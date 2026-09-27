import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseFixtures } from '../src/qualification/fixtures.ts';
import { inspectWav, sha256 } from '../src/qualification/wav.ts';
import { normalizeForWer, wordErrorRate } from '../src/qualification/wer.ts';
import { readEvidence, scoreTranscripts, validateRecordings } from '../src/qualification/evidence.ts';
import type { Transcript } from '../src/qualification/evidence.ts';

const markdown = await readFile(new URL('../docs/p0/azure-qualification-materials.md', import.meta.url), 'utf8');
const fixtures = parseFixtures(markdown);

// Synthetic PCM is ONLY a parser/test input. Never a human qualification artifact.
function wav(seed = 1, rate = 16000, samples = 3200) {
  const data = Buffer.alloc(44 + samples * 2);
  data.write('RIFF', 0); data.writeUInt32LE(data.length - 8, 4); data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28);
  data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write('data', 36); data.writeUInt32LE(samples * 2, 40);
  for (let i = 44; i < data.length; i += 2) data.writeInt16LE(seed * 10, i);
  return data;
}

async function corpus(root: string) {
  const notes = [];
  for (const [index, f] of fixtures.entries()) {
    await mkdir(join(root, f.category), { recursive: true });
    await writeFile(join(root, f.category, `${f.id}.wav`), wav(index + 1));
    notes.push({ fixtureId: f.id, consent: true, speakerId: 'SYNTHETIC_TEST_ONLY', sessionId: 'test',
      microphone: 'TEST_GENERATOR', distanceCm: 30, conditions: 'SYNTHETIC_UNIT_TEST_NOT_HUMAN' });
  }
  await writeFile(join(root, 'recording-notes.json'), JSON.stringify(notes));
}

test('reviewed fixture source contains exactly 15 FQ, 15 DJ, 10 CS and 10 NZ', () => {
  assert.deepEqual(['fr-ca', 'darija', 'code-switch', 'noise'].map(c => fixtures.filter(f => f.category === c).length), [15, 15, 10, 10]);
  assert.equal(fixtures.find(f => f.id === 'DJ01')?.reference, 'السلام عليكم، مرحبا بكم. كيفاش نقدر نعاونك اليوم؟');
  assert.match(fixtures.find(f => f.id === 'NZ10')!.condition!, /30%/u);
  assert.throws(() => parseFixtures(markdown.replace('| FQ01 |', '| FQ02 |')), /DUPLICATE/u);
  assert.throws(() => parseFixtures(markdown.replace('| FQ01 |', '| FQ99 |')), /INVALID/u);
});

test('WAV accepts mono PCM16 at both specified rates with exact digest', () => {
  for (const rate of [16000, 44100]) {
    const bytes = wav(1, rate, rate);
    const inspected = inspectWav(bytes);
    assert.equal(inspected.sampleRateHz, rate);
    assert.equal(inspected.durationMs, 1000);
    assert.equal(inspected.sha256, sha256(bytes));
    assert.equal(inspected.humanListeningRequired, true);
  }
});

test('WAV rejects truncation, stereo, silence, invalid rate, duplicate data and bad alignment', () => {
  assert.throws(() => inspectWav(wav().subarray(0, 100)), /TRUNCATED/u);
  const stereo = wav(); stereo.writeUInt16LE(2, 22);
  assert.throws(() => inspectWav(stereo), /MONO/u);
  assert.throws(() => inspectWav(wav(0)), /SILENCE/u);
  assert.throws(() => inspectWav(wav(1, 48000)), /44100/u);
  const alignment = wav(); alignment.writeUInt32LE(17, 28);
  assert.throws(() => inspectWav(alignment), /ALIGNMENT/u);
  const duplicate = Buffer.concat([wav(), wav().subarray(36)]);
  duplicate.writeUInt32LE(duplicate.length - 8, 4);
  assert.throws(() => inspectWav(duplicate), /DUPLICATE/u);
});

test('WAV supports padded ancillary chunks and rejects truncated chunk lengths', () => {
  const original = wav();
  const junk = Buffer.from([74, 85, 78, 75, 1, 0, 0, 0, 32, 0]);
  const padded = Buffer.concat([original.subarray(0, 12), junk, original.subarray(12)]);
  padded.writeUInt32LE(padded.length - 8, 4);
  assert.equal(inspectWav(padded).durationMs, 200);
  padded.writeUInt32LE(0xffffffff, 16);
  assert.throws(() => inspectWav(padded), /TRUNCATED/u);
});

test('WER normalization handles French apostrophes, Arabic digits and code switching without translation', () => {
  assert.deepEqual(normalizeForWer('Dix، العشرة ١٠ ۱۰ 10!'), ['10', '10', '10', '10', '10']);
  assert.deepEqual(normalizeForWer('J’aimerais un rendez-vous. بغيت'), ['j', 'aimerais', 'un', 'rendez', 'vous', 'بغيت']);
  assert.notDeepEqual(normalizeForWer('médecin'), normalizeForWer('medecin'));
  assert.notDeepEqual(normalizeForWer('أهلا'), normalizeForWer('اهلا'));
});

test('WER counts substitutions, insertions, deletions, empty recognition and can exceed 100%', () => {
  assert.equal(wordErrorRate('bonjour ami', 'bonjour ici').substitutions, 1);
  assert.equal(wordErrorRate('bonjour ami', 'bonjour').deletions, 1);
  assert.equal(wordErrorRate('bonjour ami', 'bonjour mon ami').insertions, 1);
  assert.equal(wordErrorRate('bonjour ami', '').wer, 1);
  assert.equal(wordErrorRate('bonjour', 'bonjour a b c').wer, 3);
  assert.throws(() => wordErrorRate('', 'bonjour'), /TOKEN_LIMIT/u);
});

test('missing recordings remain incomplete with no scores or approvals', async () => {
  const root = await mkdtemp(join(tmpdir(), 'optique-empty-'));
  try {
    const report = await validateRecordings(root, fixtures);
    assert.equal(report.status, 'INCOMPLETE'); assert.equal(report.validCount, 0);
    assert.equal(report.rows.length, 50); assert.equal(report.humanVerdict, 'NOT_RECORDED');
    assert.equal(report.m3Authorized, false);
    await assert.rejects(scoreTranscripts(root, fixtures, report), /RECORDINGS_NOT_READY/u);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('recording validation detects duplicate audio, missing consent and wrong-case filenames', async () => {
  const root = await mkdtemp(join(tmpdir(), 'optique-validation-'));
  try {
    await corpus(root);
    let report = await validateRecordings(root, fixtures);
    assert.equal(report.validCount, 50); assert.equal(report.humanVerdict, 'NOT_RECORDED');
    await writeFile(join(root, 'fr-ca/FQ02.wav'), wav(1));
    const notes = JSON.parse(await readFile(join(root, 'recording-notes.json'), 'utf8'));
    notes[0].consent = false;
    await writeFile(join(root, 'recording-notes.json'), JSON.stringify(notes));
    await rm(join(root, 'fr-ca/FQ03.wav'));
    await writeFile(join(root, 'fr-ca/fq03.wav'), wav(3));
    report = await validateRecordings(root, fixtures);
    assert.equal(report.status, 'INCOMPLETE');
    assert.ok(report.rows[0].issues.includes('CONSENT_OR_RECORDING_NOTES_REQUIRED'));
    assert.ok(report.rows[1].issues.includes('DUPLICATE_AUDIO'));
    assert.ok(report.rows[2].issues.includes('WAV_MISSING_OR_WRONG_CASE'));
    assert.deepEqual(report.unexpectedFiles, ['fr-ca/fq03.wav']);
    await assert.rejects(readEvidence(root, '../outside.json', 100), /EVIDENCE_PATH/u);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('scoring requires matching audio and raw evidence, uses micro WER, never issues a human verdict', async () => {
  const root = await mkdtemp(join(tmpdir(), 'optique-score-'));
  try {
    const audioRoot = join(root, 'audio'); const sttRoot = join(root, 'stt');
    await mkdir(audioRoot); await mkdir(sttRoot); await corpus(audioRoot);
    const recordings = await validateRecordings(audioRoot, fixtures);
    const entries: Transcript[] = [];
    for (const [i, f] of fixtures.entries()) {
      const text = i === 0 ? '' : f.reference;
      const raw = JSON.stringify(i === 1
        ? { RecognitionStatus: 'Success', NBest: [{ Display: text }] }
        : { RecognitionStatus: i === 0 ? 'NoMatch' : 'Success', DisplayText: text });
      await writeFile(join(sttRoot, `${f.id}.json`), raw);
      entries.push({ fixtureId: f.id, text, provider: 'azure', region: 'canadacentral', locale: 'test-only',
        capturedAt: '2026-09-27T00:00:00Z', audioSha256: recordings.rows[i].audio!.sha256,
        rawResponseFile: `${f.id}.json`, rawResponseSha256: sha256(raw) });
    }
    const save = () => writeFile(join(sttRoot, 'transcripts.json'), JSON.stringify(entries));
    await save();
    const report = await scoreTranscripts(sttRoot, fixtures, recordings);
    const french = report.rows.filter(r => r.category === 'fr-ca');
    assert.equal(report.categories[0].wer, french.reduce((n, r) => n + r.errors, 0) / french.reduce((n, r) => n + r.referenceWords, 0));
    assert.equal(report.rows[0].wer, 1); assert.equal(report.humanVerdict, 'NOT_RECORDED');
    assert.equal(report.providerApproved, false); assert.equal(report.m3Authorized, false);
    entries[0].text = 'fabricated'; await save();
    await assert.rejects(scoreTranscripts(sttRoot, fixtures, recordings), /RAW_MISMATCH/u);
    entries[0].text = ''; entries[0].audioSha256 = '0'.repeat(64); await save();
    await assert.rejects(scoreTranscripts(sttRoot, fixtures, recordings), /PROVENANCE/u);
    entries[0].audioSha256 = recordings.rows[0].audio!.sha256; await save();
    await writeFile(join(sttRoot, 'FQ01.json'), '{}');
    await assert.rejects(scoreTranscripts(sttRoot, fixtures, recordings), /HASH_MISMATCH/u);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('CLI prepares blank artifacts, refuses overwrites and returns 2 for incomplete inputs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'optique-cli-'));
  const script = resolve('scripts/qualification.ts');
  const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', timeout: 15000 });
  try {
    const prepared = join(root, 'panel');
    assert.equal(run('prepare', prepared).status, 0);
    const notes = JSON.parse(await readFile(join(prepared, 'human-recordings/recording-notes.json'), 'utf8'));
    assert.equal(notes.length, 50); assert.ok(notes.every((n: { consent: boolean }) => !n.consent));
    assert.equal(run('prepare', prepared).status, 1);
    const report = join(root, 'report.json');
    assert.equal(run('validate', join(prepared, 'human-recordings'), report).status, 2);
    assert.equal(JSON.parse(await readFile(report, 'utf8')).validCount, 0);
    assert.equal(run('validate', join(prepared, 'human-recordings'), report).status, 1);
    assert.equal(run('unknown').status, 1);
  } finally { await rm(root, { recursive: true, force: true }); }
});
