import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFixtures } from '../src/qualification/fixtures.ts';
import { scoreTranscripts, validateRecordings } from '../src/qualification/evidence.ts';

const repository = fileURLToPath(new URL('../', import.meta.url));
const usage = `Qualification Azure — outils hors ligne, Node >=24
  node scripts/qualification.ts prepare <nouveau-dossier>
  node scripts/qualification.ts validate <dossier-wav> [rapport.json]
  node scripts/qualification.ts score <dossier-wav> <dossier-transcriptions> [rapport.json]
Les rapports existants ne sont jamais remplacés. Aucun appel réseau.`;

async function output(value: unknown, path?: string) {
  const json = JSON.stringify(value, null, 2) + '\n';
  if (path) await writeFile(resolve(path), json, { flag: 'wx', encoding: 'utf8' });
  else process.stdout.write(json);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help') { console.log(usage); return; }
  const fixtures = parseFixtures(await readFile(resolve(repository, 'docs/p0/azure-qualification-materials.md'), 'utf8'));
  if (command === 'prepare' && args.length === 1) {
    const destination = resolve(args[0]);
    await mkdir(dirname(destination), { recursive: true });
    await mkdir(destination); // Fail before writing anything when the directory already exists.
    for (const category of ['fr-ca', 'darija', 'code-switch', 'noise']) {
      await mkdir(resolve(destination, 'human-recordings', category), { recursive: true });
    }
    await output(fixtures, resolve(destination, 'fixtures.json'));
    await output(fixtures.map(f => ({ fixtureId: f.id, consent: false, speakerId: '', sessionId: '',
      microphone: '', distanceCm: null, conditions: '' })), resolve(destination, 'human-recordings/recording-notes.json'));
    await output(fixtures.map(f => ({ fixtureId: f.id, text: null, audioSha256: null, provider: 'azure',
      region: null, locale: null, capturedAt: null, rawResponseFile: null, rawResponseSha256: null })),
      resolve(destination, 'transcripts.template.json'));
    const header = 'fixture_id,intelligibility,naturalness,darija_register,meaning_changed,clipping,reviewer_id,reviewed_at,notes';
    await writeFile(resolve(destination, 'human-listening.csv'), '\uFEFF' + header + '\n' +
      fixtures.map(f => `${f.id},,,,,,,,`).join('\n') + '\n', { flag: 'wx' });
    console.log('PREPARED: 50 fixtures; 0 recordings; 0 scores; no human verdict.');
  } else if (command === 'validate' && args.length >= 1 && args.length <= 2) {
    const report = await validateRecordings(resolve(args[0]), fixtures);
    await output(report, args[1]);
    if (report.status !== 'READY_FOR_HUMAN_REVIEW') process.exitCode = 2;
  } else if (command === 'score' && args.length >= 2 && args.length <= 3) {
    const recordings = await validateRecordings(resolve(args[0]), fixtures);
    const report = await scoreTranscripts(resolve(args[1]), fixtures, recordings);
    await output(report, args[2]);
    if (report.categories.some(c => !c.thresholdMet)) process.exitCode = 2;
  } else throw new Error('USAGE');
}

main().catch(error => {
  const code = error instanceof Error && /^[A-Z][A-Z0-9_]+$/u.test(error.message) ? error.message : 'INPUT_OR_OUTPUT_ERROR';
  console.error(code); // No raw paths, transcription content or underlying errors.
  process.exitCode = 1;
});
