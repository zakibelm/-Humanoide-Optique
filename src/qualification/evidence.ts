import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import type { Fixture } from './fixtures.ts';
import { thresholds } from './fixtures.ts';
import { inspectWav, MAX_WAV_BYTES, sha256 } from './wav.ts';
import { NORMALIZATION_VERSION, wordErrorRate } from './wer.ts';

type Notes = { fixtureId: string; consent: boolean; speakerId: string; sessionId: string;
  microphone: string; distanceCm: number; conditions: string };
const nonempty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const digest = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{64}$/u.test(value);

/** Reject traversal and symlinks, including linked parent directories. */
export async function readEvidence(root: string, name: string, maxBytes: number): Promise<Buffer> {
  if (!nonempty(name) || isAbsolute(name) || name.includes(':')) throw new Error('EVIDENCE_PATH');
  const base = await realpath(root);
  const target = resolve(base, name);
  const rel = relative(base, target);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error('EVIDENCE_PATH');
  let cursor = base;
  for (const part of rel.split(sep)) {
    cursor = resolve(cursor, part);
    if ((await lstat(cursor)).isSymbolicLink()) throw new Error('EVIDENCE_SYMLINK');
  }
  const stat = await lstat(target);
  if (!stat.isFile() || stat.size > maxBytes) throw new Error('EVIDENCE_SIZE');
  const bytes = await readFile(target);
  if (bytes.length > maxBytes) throw new Error('EVIDENCE_SIZE');
  return bytes;
}

async function enumerateWavs(root: string, folder = '', result: string[] = []): Promise<string[]> {
  const entries = await readdir(resolve(root, folder), { withFileTypes: true });
  for (const entry of entries) {
    const name = folder ? `${folder}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error('EVIDENCE_SYMLINK');
    if (entry.isDirectory()) {
      if (name.split('/').length > 3) throw new Error('EVIDENCE_DIRECTORY_DEPTH');
      await enumerateWavs(root, name, result);
    } else if (/\.wav$/iu.test(entry.name)) result.push(name);
    if (result.length > 100) throw new Error('TOO_MANY_WAVS');
  }
  return result;
}

export async function validateRecordings(root: string, fixtures: Fixture[]) {
  let notes: Notes[] = [];
  const issues: string[] = [];
  try {
    const parsed: unknown = JSON.parse((await readEvidence(root, 'recording-notes.json', 1024 * 1024)).toString('utf8'));
    if (!Array.isArray(parsed)) throw new Error('INVALID_NOTES');
    notes = parsed;
    if (notes.some(n => !n || !fixtures.some(f => f.id === n.fixtureId)) ||
        new Set(notes.map(n => n?.fixtureId)).size !== notes.length) throw new Error('INVALID_NOTES');
  } catch { issues.push('RECORDING_NOTES_MISSING_OR_INVALID'); }
  let paths: string[] = [];
  try { paths = await enumerateWavs(root); } catch { issues.push('RECORDING_DIRECTORY_MISSING_OR_INVALID'); }
  const expected = fixtures.map(f => `${f.category}/${f.id}.wav`);
  const unexpectedFiles = paths.filter(path => !expected.includes(path));
  if (unexpectedFiles.length) issues.push('UNEXPECTED_WAV_FILES');
  const rows = [];
  const seenHashes = new Set<string>();
  const sessionRates = new Map<string, number>();
  for (const fixture of fixtures) {
    const file = `${fixture.category}/${fixture.id}.wav`;
    const rowIssues: string[] = [];
    const note = notes.find(n => n?.fixtureId === fixture.id);
    if (!note || note.consent !== true || !nonempty(note.speakerId) || !nonempty(note.sessionId) ||
        !nonempty(note.microphone) || !Number.isFinite(note.distanceCm) || note.distanceCm <= 0 ||
        !nonempty(note.conditions)) rowIssues.push('CONSENT_OR_RECORDING_NOTES_REQUIRED');
    let audio: ReturnType<typeof inspectWav> | null = null;
    try {
      if (!paths.includes(file)) throw new Error('WAV_MISSING_OR_WRONG_CASE');
      audio = inspectWav(await readEvidence(root, file, MAX_WAV_BYTES));
      if (seenHashes.has(audio.sha256)) rowIssues.push('DUPLICATE_AUDIO');
      seenHashes.add(audio.sha256);
      if (note && nonempty(note.sessionId)) {
        const rate = sessionRates.get(note.sessionId);
        if (rate && rate !== audio.sampleRateHz) rowIssues.push('MIXED_SAMPLE_RATE_IN_SESSION');
        sessionRates.set(note.sessionId, audio.sampleRateHz);
      }
    } catch (error) {
      const code = error instanceof Error && /^(WAV_|EVIDENCE_)[A-Z0-9_]+$/u.test(error.message)
        ? error.message : 'WAV_UNREADABLE';
      rowIssues.push(code);
    }
    rows.push({ fixtureId: fixture.id, category: fixture.category, file, audio, issues: rowIssues,
      status: rowIssues.length ? 'INVALID' : 'TECHNICALLY_VALID' });
  }
  const validCount = rows.filter(row => row.status === 'TECHNICALLY_VALID').length;
  return { schemaVersion: 1, status: validCount === 50 && !issues.length ? 'READY_FOR_HUMAN_REVIEW' : 'INCOMPLETE',
    expectedCount: 50, validCount, issues, unexpectedFiles, rows,
    humanVerdict: 'NOT_RECORDED', providerApproved: false, m3Authorized: false };
}

export interface Transcript {
  fixtureId: string;
  text: string;
  audioSha256: string;
  provider: 'azure';
  region: 'canadacentral' | 'canadaeast';
  locale: string;
  capturedAt: string;
  rawResponseFile: string;
  rawResponseSha256: string;
}

export async function scoreTranscripts(root: string, fixtures: Fixture[], recordings: Awaited<ReturnType<typeof validateRecordings>>) {
  if (recordings.status !== 'READY_FOR_HUMAN_REVIEW') throw new Error('RECORDINGS_NOT_READY');
  const data: unknown = JSON.parse((await readEvidence(root, 'transcripts.json', 1024 * 1024)).toString('utf8'));
  if (!Array.isArray(data) || data.length !== fixtures.length) throw new Error('EXPECTED_50_TRANSCRIPTS');
  const transcripts: Transcript[] = data;
  if (transcripts.some(t => !t || !fixtures.some(f => f.id === t.fixtureId)) ||
      new Set(transcripts.map(t => t.fixtureId)).size !== fixtures.length) throw new Error('TRANSCRIPT_IDS');
  const rawPaths = new Set<string>();
  const rows: Array<ReturnType<typeof wordErrorRate> & {
    fixtureId: string; category: Fixture['category']; audioSha256: string; rawResponseSha256: string;
  }> = [];
  for (const fixture of fixtures) {
    const entry = transcripts.find(t => t.fixtureId === fixture.id)!;
    const recording = recordings.rows.find(r => r.fixtureId === fixture.id)!;
    if (typeof entry.text !== 'string' || entry.text.length > 20000 || entry.provider !== 'azure' ||
        !['canadacentral', 'canadaeast'].includes(entry.region) || !nonempty(entry.locale) ||
        !nonempty(entry.capturedAt) || !Number.isFinite(Date.parse(entry.capturedAt)) ||
        !digest(entry.audioSha256) || entry.audioSha256 !== recording.audio?.sha256 ||
        !digest(entry.rawResponseSha256) || !nonempty(entry.rawResponseFile)) throw new Error('TRANSCRIPT_PROVENANCE');
    const rawPath = resolve(root, entry.rawResponseFile);
    if (rawPaths.has(rawPath)) throw new Error('DUPLICATE_RAW_RESPONSE');
    rawPaths.add(rawPath);
    const raw = await readEvidence(root, entry.rawResponseFile, 1024 * 1024);
    if (sha256(raw) !== entry.rawResponseSha256) throw new Error('RAW_RESPONSE_HASH_MISMATCH');
    if (recording.audio?.sampleRateHz !== 16000 || recording.audio.durationMs > 60000) {
      throw new Error('SHORT_AUDIO_REST_REQUIRES_16KHZ_MAX_60S');
    }
    // Current import format is the unmodified Azure simple/detailed short-audio REST response.
    // Failed requests must not be interpreted as valid empty recognitions.
    const response = JSON.parse(raw.toString('utf8'));
    if (!['Success', 'NoMatch'].includes(response?.RecognitionStatus)) throw new Error('STT_REQUEST_NOT_SUCCESSFUL');
    const rawText = response.RecognitionStatus === 'NoMatch' ? '' :
      (response.DisplayText ?? response.NBest?.[0]?.Display);
    if (typeof rawText !== 'string' || rawText !== entry.text) throw new Error('TRANSCRIPT_RAW_MISMATCH');
    rows.push({ fixtureId: fixture.id, category: fixture.category,
      audioSha256: entry.audioSha256, rawResponseSha256: entry.rawResponseSha256,
      ...wordErrorRate(fixture.reference, entry.text) });
  }
  const categories = Object.entries(thresholds).map(([category, threshold]) => {
    const items = rows.filter(r => r.category === category);
    const errors = items.reduce((n, r) => n + r.errors, 0);
    const referenceWords = items.reduce((n, r) => n + r.referenceWords, 0);
    const wer = errors / referenceWords;
    return { category, count: items.length, errors, referenceWords, wer, threshold, thresholdMet: wer <= threshold };
  });
  return { schemaVersion: 1, normalization: NORMALIZATION_VERSION, status: 'COMPUTED_FROM_SUPPLIED_EVIDENCE',
    fixturesSha256: sha256(JSON.stringify(fixtures)), rows, categories,
    semanticReview: 'REQUIRED', ttsHumanReview: 'REQUIRED', humanVerdict: 'NOT_RECORDED',
    providerApproved: false, m3Authorized: false };
}
