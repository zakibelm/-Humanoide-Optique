import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import type { Deps, Locale } from '../scripts/call-azure-stt.ts';
import { localeFor, runTranscription } from '../scripts/call-azure-stt.ts';
import type { Category, Fixture } from '../src/qualification/fixtures.ts';
import { scoreTranscripts, validateRecordings } from '../src/qualification/evidence.ts';
import { sha256 } from '../src/qualification/wav.ts';

// Synthetic PCM only, in dedicated temporary folders — never offered to the human panel.
const FR = 'Bonjour je voudrais des lunettes';
const AR = 'بغيت نشوف شي مونطير جديدة';
const MIX = 'Bonjour بغيت نشوف une paire';
const SECRET_TOKEN = 'TEST-ONLY-TOKEN-must-never-be-logged';

function makeFixtures(): Fixture[] {
  const list: Fixture[] = [];
  const add = (prefix: string, n: number, category: Category, ref: (i: number) => string) => {
    for (let i = 1; i <= n; i++) list.push({ id: `${prefix}${String(i).padStart(2, '0')}`, category,
      reference: ref(i), condition: category === 'noise' ? 'test' : null });
  };
  add('FQ', 15, 'fr-ca', () => FR);
  add('DJ', 15, 'darija', () => AR);
  add('CS', 10, 'code-switch', () => MIX);
  add('NZ', 10, 'noise', i => (i <= 5 ? FR : i <= 8 ? AR : MIX));
  return list;
}

function wav(seed: number, sampleRate = 16000, seconds = 0.5): Buffer {
  const samples = Math.round(sampleRate * seconds);
  const data = Buffer.alloc(samples * 2);
  for (let i = 0; i < samples; i++) data.writeInt16LE(Math.round(Math.sin((i + seed) / (3 + seed % 7)) * 8000), i * 2);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0); header.writeUInt32LE(36 + data.length, 4); header.write('WAVE', 8);
  header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28); header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const temps: string[] = [];
afterEach(async () => { for (const t of temps.splice(0)) await rm(t, { recursive: true, force: true }); });

async function panel(options: { rateFor?: (id: string) => number } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'ho-stt-'));
  temps.push(root);
  const fixtures = makeFixtures();
  const wavRoot = join(root, 'human-recordings');
  for (const [i, f] of fixtures.entries()) {
    await mkdir(join(wavRoot, f.category), { recursive: true });
    await writeFile(join(wavRoot, f.category, `${f.id}.wav`), wav(i + 1, options.rateFor?.(f.id) ?? 16000));
  }
  await writeFile(join(wavRoot, 'recording-notes.json'), JSON.stringify(fixtures.map(f => ({ fixtureId: f.id,
    consent: true, speakerId: 'SYNTH', sessionId: `S-${f.id}`, microphone: 'synthetic', distanceCm: 1, conditions: 'test' }))));
  const report = await validateRecordings(wavRoot, fixtures);
  const reportPath = join(root, 'wav-report.json');
  await writeFile(reportPath, JSON.stringify(report));
  return { root, fixtures, wavRoot, reportPath, report };
}

function fakeDeps(options: { respond?: (id: number, locale: Locale) => { status: number; json?: unknown } } = {}) {
  const calls: Array<{ locale: Locale; token: string; audioSha: string }> = [];
  const logs: string[] = [];
  const bodies: Buffer[] = [];
  const deps: Deps = {
    issueToken: async () => SECRET_TOKEN,
    async recognize(audio, locale, token) {
      calls.push({ locale, token, audioSha: sha256(audio) });
      const r = options.respond?.(calls.length, locale) ?? { status: 200,
        json: { RecognitionStatus: 'Success', Offset: 100, Duration: 5000,
          NBest: [{ Confidence: 0.9, Lexical: 'x', ITN: 'x', MaskedITN: 'x', Display: `texte ${calls.length} ${locale}` }] } };
      // Deliberately non-canonical spacing: the raw bytes must be kept exactly as received.
      const body = Buffer.from(r.json === undefined ? '' : JSON.stringify(r.json).replace(/,/gu, ', '));
      bodies.push(body);
      return { status: r.status, body };
    },
    now: () => new Date('2026-09-27T12:00:00.000Z'),
    sleep: async () => {},
    log: line => logs.push(line)
  };
  return { deps, calls, logs, bodies };
}

test('plan de locales : fr-CA, ar-MA, mixte selon la passe, recoupé avec le texte', () => {
  const fixtures = makeFixtures();
  const get = (id: string, m: Locale) => localeFor(fixtures.find(f => f.id === id)!, m);
  assert.equal(get('FQ01', 'ar-MA'), 'fr-CA');
  assert.equal(get('DJ07', 'fr-CA'), 'ar-MA');
  assert.equal(get('NZ03', 'ar-MA'), 'fr-CA');
  assert.equal(get('NZ07', 'fr-CA'), 'ar-MA');
  for (const id of ['CS01', 'CS10', 'NZ09', 'NZ10']) {
    assert.equal(get(id, 'ar-MA'), 'ar-MA');
    assert.equal(get(id, 'fr-CA'), 'fr-CA');
  }
  assert.throws(() => localeFor({ id: 'NZ02', category: 'noise', reference: AR, condition: null }, 'ar-MA'),
    /LOCALE_PLAN_MISMATCH/u);
});

test('passe complète : 50 appels séquentiels, octets bruts conservés, NoMatch gardé, accepté par score', async () => {
  const p = await panel();
  const out = join(p.root, 'stt-mixed-ar-MA');
  const f = fakeDeps({ respond: (n, locale) => n === 3
    ? { status: 200, json: { RecognitionStatus: 'NoMatch', Offset: 0, Duration: 0 } }
    : { status: 200, json: { RecognitionStatus: 'Success', NBest: [{ Display: `texte ${n} ${locale}` }] } } });
  const summary = await runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath, outputDir: out,
    mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps);
  assert.deepEqual([summary.success, summary.noMatch, summary.reused, f.calls.length], [49, 1, 0, 50]);
  const transcripts = JSON.parse(await readFile(join(out, 'transcripts.json'), 'utf8'));
  assert.equal(transcripts.length, 50);
  const fq03 = transcripts.find((t: any) => t.fixtureId === 'FQ03');
  assert.equal(fq03.text, '');
  for (const [i, t] of transcripts.entries()) {
    const raw = await readFile(join(out, t.rawResponseFile));
    assert.ok(raw.equals(f.bodies[i]), 'raw bytes must be identical to the response');
    assert.equal(t.rawResponseSha256, sha256(raw));
    assert.equal(t.audioSha256, p.report.rows.find(r => r.fixtureId === t.fixtureId)!.audio!.sha256);
    assert.equal(t.provider, 'azure');
    assert.equal(t.region, 'canadacentral');
  }
  assert.equal(transcripts.find((t: any) => t.fixtureId === 'CS04').locale, 'ar-MA');
  assert.equal(transcripts.find((t: any) => t.fixtureId === 'NZ02').locale, 'fr-CA');
  assert.equal(f.calls.find((_c, i) => p.fixtures[i].id === 'DJ01')!.locale, 'ar-MA');
  const scored = await scoreTranscripts(out, p.fixtures, p.report);
  assert.equal(scored.rows.length, 50);
  assert.equal(scored.humanVerdict, 'NOT_RECORDED');
  const logText = f.logs.join('\n');
  assert.ok(!logText.includes(SECRET_TOKEN) && !logText.includes('texte '), 'logs: no token, no recognized text');
});

test('seconde passe : seules les 12 phrases mixtes sont rappelées, le reste est recopié octet pour octet', async () => {
  const p = await panel();
  const first = join(p.root, 'stt-mixed-ar-MA');
  const second = join(p.root, 'stt-mixed-fr-CA');
  await runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath, outputDir: first, mixedLocale: 'ar-MA',
    fixtures: p.fixtures }, fakeDeps().deps);
  const f = fakeDeps();
  const summary = await runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath, outputDir: second,
    mixedLocale: 'fr-CA', fixtures: p.fixtures, reuseDir: first }, f.deps);
  assert.deepEqual([f.calls.length, summary.reused], [12, 38]);
  assert.ok(f.calls.every(c => c.locale === 'fr-CA'));
  const a = JSON.parse(await readFile(join(first, 'transcripts.json'), 'utf8'));
  const b = JSON.parse(await readFile(join(second, 'transcripts.json'), 'utf8'));
  for (const id of ['FQ01', 'DJ05', 'NZ06']) {
    assert.deepEqual(b.find((t: any) => t.fixtureId === id), a.find((t: any) => t.fixtureId === id));
    assert.ok((await readFile(join(first, `${id}.json`))).equals(await readFile(join(second, `${id}.json`))));
  }
  assert.equal(b.find((t: any) => t.fixtureId === 'CS01').locale, 'fr-CA');
  await scoreTranscripts(second, p.fixtures, p.report);
});

test('WAV 44,1 kHz : arrêt avant tout appel, aucune conversion silencieuse', async () => {
  const p = await panel({ rateFor: id => (id === 'DJ02' ? 44100 : 16000) });
  const f = fakeDeps();
  await assert.rejects(runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath,
    outputDir: join(p.root, 'out'), mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps),
  /SHORT_AUDIO_REST_REQUIRES_16KHZ_MAX_60S/u);
  assert.equal(f.calls.length, 0);
  assert.ok(f.logs.some(l => l.includes('DJ02')));
  await assert.rejects(stat(join(p.root, 'out')));
});

test('rapport absent, incomplet ou périmé : arrêt explicite, aucun appel', async () => {
  const p = await panel();
  const f = fakeDeps();
  const run = (reportPath: string, out: string) => runTranscription({ wavRoot: p.wavRoot, reportPath,
    outputDir: join(p.root, out), mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps);
  await assert.rejects(run(join(p.root, 'absent.json'), 'o1'), /WAV_REPORT_MISSING_OR_UNREADABLE/u);
  const incomplete = join(p.root, 'incomplete.json');
  await writeFile(incomplete, JSON.stringify({ ...p.report, status: 'INCOMPLETE' }));
  await assert.rejects(run(incomplete, 'o2'), /WAV_REPORT_NOT_READY/u);
  const stale = join(p.root, 'stale.json');
  const rows = p.report.rows.map(r => r.fixtureId === 'FQ09' ? { ...r, audio: { ...r.audio!, sha256: 'a'.repeat(64) } } : r);
  await writeFile(stale, JSON.stringify({ ...p.report, rows }));
  await assert.rejects(run(stale, 'o3'), /WAV_REPORT_STALE/u);
  assert.equal(f.calls.length, 0);
});

test('erreur HTTP ou statut inutilisable : le lot est bloqué, aucun transcripts.json', async () => {
  const p = await panel();
  for (const [name, respond, code] of [
    ['http', (n: number) => (n === 7 ? { status: 500, json: { error: 'x' } } : undefined), /STT_HTTP_ERROR/u],
    ['silence', (n: number) => (n === 4 ? { status: 200, json: { RecognitionStatus: 'InitialSilenceTimeout' } } : undefined),
      /STT_RECOGNITION_NOT_USABLE/u],
    ['auth', () => ({ status: 401, json: { error: 'unauthorized' } }), /STT_HTTP_ERROR/u]
  ] as const) {
    const out = join(p.root, name);
    const f = fakeDeps({ respond: (n, l) => respond(n) ?? { status: 200,
      json: { RecognitionStatus: 'Success', NBest: [{ Display: `t ${n} ${l}` }] } } });
    await assert.rejects(runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath, outputDir: out,
      mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps), code);
    await assert.rejects(stat(join(out, 'transcripts.json')));
  }
});

test('limitation de débit 429 : nouvel essai borné, puis succès', async () => {
  const p = await panel();
  const f = fakeDeps({ respond: (n, l) => (n === 2 || n === 3 ? { status: 429, json: {} }
    : { status: 200, json: { RecognitionStatus: 'Success', NBest: [{ Display: `t ${n} ${l}` }] } }) });
  const summary = await runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath,
    outputDir: join(p.root, 'out'), mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps);
  assert.equal(summary.success, 50);
  assert.equal(f.calls.length, 52);
});

test('dossier de sortie existant refusé ; code Key Vault conservé sans détail', async () => {
  const p = await panel();
  const out = join(p.root, 'exists');
  await mkdir(out);
  await assert.rejects(runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath, outputDir: out,
    mixedLocale: 'ar-MA', fixtures: p.fixtures }, fakeDeps().deps), /OUTPUT_DIRECTORY_EXISTS/u);
  const f = fakeDeps();
  f.deps.issueToken = async () => { throw new Error('KEY_VAULT_READ_FAILED'); };
  await assert.rejects(runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath,
    outputDir: join(p.root, 'kv'), mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps), /^Error: KEY_VAULT_READ_FAILED$/u);
  f.deps.issueToken = async () => { throw new Error(`fetch failed with ${SECRET_TOKEN}`); };
  await assert.rejects(runTranscription({ wavRoot: p.wavRoot, reportPath: p.reportPath,
    outputDir: join(p.root, 'kv2'), mixedLocale: 'ar-MA', fixtures: p.fixtures }, f.deps),
  (error: Error) => error.message === 'STS_TOKEN_FAILED' && !error.message.includes(SECRET_TOKEN));
});
