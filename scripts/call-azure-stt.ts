/**
 * Benchmark Provider A pré-M3 — appels Azure Speech-to-text REST (audio court).
 *
 * Produit exactement la structure lue par `qualification.ts score` :
 *   <sortie>/transcripts.json  +  <sortie>/{fixtureId}.json (octets bruts de la réponse Azure)
 *
 * Ne connecte aucun fournisseur au produit, ne donne aucun verdict, n'autorise pas M3.
 * La clé est lue uniquement dans Key Vault via Azure CLI ; elle n'est jamais affichée,
 * journalisée, écrite sur disque ni incluse dans un message d'erreur.
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Fixture } from '../src/qualification/fixtures.ts';
import { parseFixtures } from '../src/qualification/fixtures.ts';
import { readEvidence, scoreTranscripts, validateRecordings } from '../src/qualification/evidence.ts';
import type { Transcript } from '../src/qualification/evidence.ts';
import { MAX_WAV_BYTES, sha256 } from '../src/qualification/wav.ts';

export const LOCALE_PLAN_VERSION = 'p0-locales-v1';
export const REGION = 'canadacentral' as const;
const VAULT = 'kv-humanoide-optique-sbx';
const SECRET_NAME = 'azure-speech-key';
// La ressource n'a pas de sous-domaine personnalisé : points de terminaison régionaux.
// Vérifiés le 2026-09-27 (Cloud Shell, ton synthétique, hors panel) : HTTP 200 en fr-CA et ar-MA.
const STS_URL = `https://${REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
const STT_URL = `https://${REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;
const TOKEN_REUSE_MS = 8 * 60 * 1000;   // jeton valide 10 min ; renouvelé avant 9 min (doc Microsoft)
const PAUSE_BETWEEN_CALLS_MS = 1000;    // séquentiel, niveau F0
const MAX_THROTTLE_RETRIES = 3;          // 429/503 uniquement : limitation de débit, pas un résultat
const MAX_RAW_BYTES = 1024 * 1024;       // même plafond que l'import `score`

export type Locale = 'fr-CA' | 'ar-MA';
export const MIXED_LOCALES: readonly Locale[] = ['ar-MA', 'fr-CA'];

/** Phrases français–darija : une seule locale par appel dans cette API, choisie par passe. */
const MIXED_IDS = new Set(['CS01', 'CS02', 'CS03', 'CS04', 'CS05', 'CS06', 'CS07', 'CS08', 'CS09', 'CS10',
  'NZ09', 'NZ10']);
const NOISE_FRENCH = new Set(['NZ01', 'NZ02', 'NZ03', 'NZ04', 'NZ05']);
const NOISE_ARABIC = new Set(['NZ06', 'NZ07', 'NZ08']);

const hasArabic = (text: string) => /\p{Script=Arabic}/u.test(text);
const hasLatin = (text: string) => /\p{Script=Latin}/u.test(text);

/** Plan de locales versionné, recoupé avec l'écriture du texte de référence verrouillé. */
export function localeFor(fixture: Fixture, mixedLocale: Locale): Locale {
  let locale: Locale;
  let expectedScript: 'latin' | 'arabic' | 'mixed';
  if (MIXED_IDS.has(fixture.id)) { locale = mixedLocale; expectedScript = 'mixed'; }
  else if (fixture.category === 'fr-ca' || NOISE_FRENCH.has(fixture.id)) { locale = 'fr-CA'; expectedScript = 'latin'; }
  else if (fixture.category === 'darija' || NOISE_ARABIC.has(fixture.id)) { locale = 'ar-MA'; expectedScript = 'arabic'; }
  else throw new Error('LOCALE_PLAN_MISSING_FIXTURE');
  if (fixture.category === 'code-switch' && expectedScript !== 'mixed') throw new Error('LOCALE_PLAN_MISMATCH');
  const arabic = hasArabic(fixture.reference);
  const latin = hasLatin(fixture.reference);
  const actual = arabic && latin ? 'mixed' : arabic ? 'arabic' : latin ? 'latin' : 'none';
  if (actual !== expectedScript) throw new Error('LOCALE_PLAN_MISMATCH');
  return locale;
}

export const isMixed = (fixture: Fixture) => MIXED_IDS.has(fixture.id);

export interface RecognizeResult { status: number; body: Buffer; retryAfterMs?: number }
export interface Deps {
  /** Renvoie un jeton STS. Ne doit jamais exposer la clé ni le jeton. */
  issueToken(): Promise<string>;
  recognize(audio: Buffer, locale: Locale, token: string): Promise<RecognizeResult>;
  now(): Date;
  sleep(ms: number): Promise<void>;
  log(line: string): void;
}

export interface RunOptions {
  wavRoot: string;
  reportPath: string;
  outputDir: string;
  mixedLocale: Locale;
  fixtures: Fixture[];
  /** Passe précédente : ses réponses non mixtes sont recopiées octet pour octet, sans nouvel appel. */
  reuseDir?: string;
}

type WavRow = { fixtureId: string; status: string; audio: { sha256: string; sampleRateHz: number; durationMs: number } | null };

async function loadReadyReport(reportPath: string, fixtures: Fixture[]): Promise<Map<string, WavRow>> {
  let report: any;
  try { report = JSON.parse(await readFile(resolve(reportPath), 'utf8')); }
  catch { throw new Error('WAV_REPORT_MISSING_OR_UNREADABLE'); }
  if (report?.schemaVersion !== 1 || report.status !== 'READY_FOR_HUMAN_REVIEW' || report.validCount !== 50 ||
      !Array.isArray(report.rows) || report.rows.length !== fixtures.length) throw new Error('WAV_REPORT_NOT_READY');
  const rows = new Map<string, WavRow>();
  for (const fixture of fixtures) {
    const row = report.rows.find((r: WavRow) => r?.fixtureId === fixture.id);
    if (!row || row.status !== 'TECHNICALLY_VALID' || !row.audio || !/^[a-f0-9]{64}$/u.test(row.audio.sha256)) {
      throw new Error('WAV_REPORT_NOT_READY');
    }
    rows.set(fixture.id, row);
  }
  return rows;
}

async function writeNew(path: string, bytes: Buffer | string) {
  await writeFile(path, bytes, { flag: 'wx' }); // jamais d'écrasement
}

export async function runTranscription(options: RunOptions, deps: Deps) {
  const { fixtures, mixedLocale } = options;
  if (!MIXED_LOCALES.includes(mixedLocale)) throw new Error('MIXED_LOCALE_REQUIRED');
  const plan = new Map(fixtures.map(f => [f.id, localeFor(f, mixedLocale)]));

  // 1. Dernier rapport WAV : prêt, complet, et identique aux fichiers actuels.
  const reported = await loadReadyReport(options.reportPath, fixtures);
  const live = await validateRecordings(resolve(options.wavRoot), fixtures);
  if (live.status !== 'READY_FOR_HUMAN_REVIEW') throw new Error('RECORDINGS_NOT_READY_NOW');
  for (const row of live.rows) {
    if (row.audio?.sha256 !== reported.get(row.fixtureId)?.audio?.sha256) throw new Error('WAV_REPORT_STALE');
  }

  // 2. Contraintes dures de l'API audio court, vérifiées avant tout appel. Aucune conversion.
  const outOfSpec = live.rows.filter(r => r.audio?.sampleRateHz !== 16000 || (r.audio?.durationMs ?? Infinity) > 60000);
  if (outOfSpec.length) {
    deps.log(`ARRÊT : ${outOfSpec.length} WAV hors limites (16 kHz, ≤ 60 s requis) : ${outOfSpec.map(r => r.fixtureId).join(', ')}`);
    deps.log('Aucune conversion automatique : une copie 16 kHz est une donnée dérivée à produire et documenter.');
    throw new Error('SHORT_AUDIO_REST_REQUIRES_16KHZ_MAX_60S');
  }

  // 3. Passe précédente éventuelle : seules les fixtures non mixtes sont reprises, après vérification.
  let base: Map<string, { entry: Transcript; raw: Buffer }> | null = null;
  if (options.reuseDir) {
    base = new Map();
    const reuseDir = resolve(options.reuseDir);
    let entries: Transcript[];
    try { entries = JSON.parse((await readEvidence(reuseDir, 'transcripts.json', MAX_RAW_BYTES)).toString('utf8')); }
    catch { throw new Error('REUSE_TRANSCRIPTS_MISSING'); }
    if (!Array.isArray(entries) || entries.length !== fixtures.length) throw new Error('REUSE_TRANSCRIPTS_INVALID');
    for (const fixture of fixtures.filter(f => !isMixed(f))) {
      const entry = entries.find(e => e?.fixtureId === fixture.id);
      if (!entry || entry.locale !== plan.get(fixture.id) || entry.region !== REGION ||
          entry.audioSha256 !== reported.get(fixture.id)!.audio!.sha256) throw new Error('REUSE_ENTRY_MISMATCH');
      const raw = await readEvidence(reuseDir, entry.rawResponseFile, MAX_RAW_BYTES);
      if (sha256(raw) !== entry.rawResponseSha256) throw new Error('REUSE_RAW_HASH_MISMATCH');
      base.set(fixture.id, { entry, raw });
    }
  }

  // 4. Dossier de sortie neuf : refuse un dossier existant (aucun mélange de passes).
  const outputDir = resolve(options.outputDir);
  await mkdir(dirname(outputDir), { recursive: true });
  try { await mkdir(outputDir); } catch { throw new Error('OUTPUT_DIRECTORY_EXISTS'); }

  const toCall = fixtures.filter(f => !base?.has(f.id));
  deps.log(`Plan ${LOCALE_PLAN_VERSION}, locale mixte ${mixedLocale} : ${toCall.length} appel(s) Azure, ` +
    `${fixtures.length - toCall.length} réponse(s) reprise(s).`);

  let token = '';
  let tokenAt = -Infinity;
  const transcripts: Transcript[] = [];
  const counts = { success: 0, noMatch: 0, reused: 0 };

  for (const fixture of fixtures) {
    const rawResponseFile = `${fixture.id}.json`;
    const reused = base?.get(fixture.id);
    if (reused) {
      await writeNew(resolve(outputDir, rawResponseFile), reused.raw);
      transcripts.push({ ...reused.entry, rawResponseFile });
      counts.reused++;
      continue;
    }
    const row = live.rows.find(r => r.fixtureId === fixture.id)!;
    const audio = await readEvidence(resolve(options.wavRoot), row.file, MAX_WAV_BYTES);
    const audioSha256 = sha256(audio);
    if (audioSha256 !== reported.get(fixture.id)!.audio!.sha256) throw new Error('WAV_CHANGED_DURING_RUN');
    const locale = plan.get(fixture.id)!;

    let result: RecognizeResult | null = null;
    for (let attempt = 0; attempt <= MAX_THROTTLE_RETRIES; attempt++) {
      if (deps.now().getTime() - tokenAt > TOKEN_REUSE_MS) {
        try { token = await deps.issueToken(); }
        catch (error) {
          // Seuls nos propres codes passent ; tout autre détail (réseau, CLI) est écarté.
          const own = error instanceof Error && /^(KEY_VAULT|STS)_[A-Z_]+$/u.test(error.message);
          throw own ? error : new Error('STS_TOKEN_FAILED');
        }
        tokenAt = deps.now().getTime();
      }
      try { result = await deps.recognize(audio, locale, token); }
      catch { deps.log(`ARRÊT : ${fixture.id} — erreur réseau.`); throw new Error('STT_NETWORK_ERROR'); }
      if (result.status !== 429 && result.status !== 503) break;
      if (attempt === MAX_THROTTLE_RETRIES) break;
      await deps.sleep(result.retryAfterMs ?? 2000 * 2 ** attempt);
    }
    const capturedAt = deps.now().toISOString();
    if (!result || result.status !== 200) {
      deps.log(`ARRÊT : ${fixture.id} — HTTP ${result?.status ?? 'aucun'}. Aucun trou n'est laissé : le lot est bloqué.`);
      throw new Error('STT_HTTP_ERROR');
    }
    if (result.body.length === 0 || result.body.length > MAX_RAW_BYTES) throw new Error('STT_RESPONSE_SIZE');
    let parsed: any;
    try { parsed = JSON.parse(result.body.toString('utf8')); } catch { throw new Error('STT_RESPONSE_NOT_JSON'); }
    const status = parsed?.RecognitionStatus;
    if (status !== 'Success' && status !== 'NoMatch') {
      deps.log(`ARRÊT : ${fixture.id} — RecognitionStatus ${typeof status === 'string' ? status.replace(/[^A-Za-z]/gu, '') : 'absent'}.`);
      throw new Error('STT_RECOGNITION_NOT_USABLE');
    }
    // Même règle que l'import `score` : NoMatch = texte vide (toutes suppressions), jamais ignoré.
    const text = status === 'NoMatch' ? '' : (parsed.DisplayText ?? parsed.NBest?.[0]?.Display);
    if (typeof text !== 'string') throw new Error('STT_RESPONSE_WITHOUT_TEXT');

    await writeNew(resolve(outputDir, rawResponseFile), result.body); // octets originaux, non reformatés
    transcripts.push({ fixtureId: fixture.id, text, audioSha256, provider: 'azure', region: REGION, locale,
      capturedAt, rawResponseFile, rawResponseSha256: sha256(result.body) });
    if (status === 'NoMatch') counts.noMatch++; else counts.success++;
    deps.log(`${fixture.id} ${locale} : ${status}`);
    await deps.sleep(PAUSE_BETWEEN_CALLS_MS);
  }

  await writeNew(resolve(outputDir, 'transcripts.json'), JSON.stringify(transcripts, null, 2) + '\n');

  // 5. Auto-contrôle : la sortie doit être acceptée telle quelle par l'import `score` (aucun chiffre affiché ici).
  await scoreTranscripts(outputDir, fixtures, live);
  return { ...counts, total: fixtures.length, mixedLocale, localePlan: LOCALE_PLAN_VERSION };
}

// ---------- Dépendances réelles (réseau, Key Vault) ----------

/** Lit la clé via Azure CLI. stdout reste en mémoire ; stderr et détails d'erreur sont écartés. */
function readKeyFromVault(): Promise<string> {
  const windows = process.platform === 'win32';
  return new Promise((resolvePromise, reject) => {
    execFile(windows ? 'az.cmd' : 'az',
      ['keyvault', 'secret', 'show', '--vault-name', VAULT, '--name', SECRET_NAME,
        '--query', 'value', '--output', 'tsv', '--only-show-errors'],
      // Arguments constants : `shell` n'est requis que pour lancer az.cmd sous Windows.
      { shell: windows, windowsHide: true, timeout: 60000, maxBuffer: 64 * 1024 },
      (error, stdout) => {
        if (error) { reject(new Error('KEY_VAULT_READ_FAILED')); return; }
        const key = String(stdout).replace(/\r?\n$/u, '');
        if (!/^[A-Za-z0-9+/=_-]{16,200}$/u.test(key)) { reject(new Error('KEY_VAULT_VALUE_INVALID')); return; }
        resolvePromise(key);
      });
  });
}

export function realDeps(): Deps {
  let keyPromise: Promise<string> | null = null;
  return {
    async issueToken() {
      keyPromise ??= readKeyFromVault();
      const key = await keyPromise;
      const response = await fetch(STS_URL, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000),
        headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (response.status !== 200) throw new Error('STS_TOKEN_FAILED');
      const token = await response.text();
      if (!token) throw new Error('STS_TOKEN_FAILED');
      return token;
    },
    async recognize(audio, locale, token) {
      const url = `${STT_URL}?language=${locale}&format=detailed&profanity=raw`;
      const response = await fetch(url, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(60000),
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json',
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000' },
        body: new Uint8Array(audio)
      });
      const body = Buffer.from(await response.arrayBuffer());
      const retryAfter = Number(response.headers.get('retry-after'));
      return { status: response.status, body,
        retryAfterMs: Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 60) * 1000 : undefined };
    },
    now: () => new Date(),
    sleep: ms => new Promise(r => setTimeout(r, ms)),
    log: line => console.log(line)
  };
}

// ---------- CLI ----------

const usage = `Benchmark Provider A pré-M3 — Azure STT REST audio court (canadacentral), Node >=24
node scripts/call-azure-stt.ts run <dossier-wav> <wav-report.json> <dossier-sortie> --mixed-locale ar-MA|fr-CA [--reuse <dossier-passe-1>]
node scripts/call-azure-stt.ts plan --mixed-locale ar-MA|fr-CA      (affiche le plan de locales, aucun appel)
Prérequis : az login ; rôle « Utilisateur des secrets Key Vault » ou supérieur sur ${VAULT}.
La sortie n'affiche que des identifiants, statuts et comptes : jamais de texte reconnu, de réponse ni de clé.`;

function takeFlag(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error('USAGE');
  args.splice(index, 2);
  return value;
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === '--help') { console.log(usage); return; }
  const args = [...rest];
  const mixedLocale = takeFlag(args, '--mixed-locale') as Locale | undefined;
  const reuseDir = takeFlag(args, '--reuse');
  if (!mixedLocale || !MIXED_LOCALES.includes(mixedLocale)) throw new Error('MIXED_LOCALE_REQUIRED');
  const repository = fileURLToPath(new URL('../', import.meta.url));
  const fixtures = parseFixtures(await readFile(resolve(repository, 'docs/p0/azure-qualification-materials.md'), 'utf8'));
  if (command === 'plan' && args.length === 0) {
    for (const f of fixtures) console.log(`${f.id}\t${localeFor(f, mixedLocale)}${isMixed(f) ? '\t(mixte)' : ''}`);
    return;
  }
  if (command !== 'run' || args.length !== 3) throw new Error('USAGE');
  const [wavRoot, reportPath, outputDir] = args;
  const summary = await runTranscription({ wavRoot, reportPath, outputDir, mixedLocale, fixtures, reuseDir }, realDeps());
  console.log(`TERMINÉ : ${summary.success} Success, ${summary.noMatch} NoMatch, ${summary.reused} repris, ` +
    `${summary.total} au total. Format accepté par \`score\`. Aucun verdict humain.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    const code = error instanceof Error && /^[A-Z][A-Z0-9_]+$/u.test(error.message) ? error.message : 'UNEXPECTED_ERROR';
    console.error(`ÉCHEC : ${code}`); // jamais le détail sous-jacent (chemins, réponses, secrets)
    process.exitCode = code === 'USAGE' || code === 'MIXED_LOCALE_REQUIRED' ? 1 : 2;
  });
}
