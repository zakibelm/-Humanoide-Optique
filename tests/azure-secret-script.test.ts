import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const gitBash = 'C:/Program Files/Git/bin/bash.exe';
const bash = process.env.TEST_BASH ?? (process.platform === 'win32' && existsSync(gitBash) ? gitBash : 'bash');
const available = spawnSync(bash, ['--version'], { timeout: 5000 }).status === 0;
const script = resolve('scripts/verify-azure-speech-secret.sh').replaceAll('\\', '/');
const fakeSecret = 'SYNTHETIC_KEY_ONLY_NEVER_A_REAL_SECRET';

test('secret verifier Bash syntax', { skip: !available }, () => {
  assert.equal(spawnSync(bash, ['-n', script], { timeout: 5000 }).status, 0);
});

test('secret verifier: mocked az/curl, no network and no secret disclosure under bash -x', { skip: !available }, async t => {
  const root = await mkdtemp(join(tmpdir(), 'optique-secret-'));
  try {
    await mkdir(join(root, 'bin'));
    await writeFile(join(root, 'bin/az'), `#!/usr/bin/env bash
printf 'az-called' > "$CASE_DIR/az-called"
case "$TEST_CASE" in
  az-failure) printf '${fakeSecret}'; printf '${fakeSecret}' >&2; exit 1 ;;
  empty) exit 0 ;;
  windows-crlf) printf '${fakeSecret}\\r\\n'; exit 0 ;;
  newline) printf 'not-a-key\\r\\nInjected: bad'; exit 0 ;;
  *) printf '${fakeSecret}\\n' ;;
esac
`, { mode: 0o755 });
    await writeFile(join(root, 'bin/curl'), `#!/usr/bin/env bash
set -eu
printf 'curl-called' > "$CASE_DIR/curl-called"
[[ "$1" == '-q' ]] || exit 90
[[ -z "$(printenv key)" ]] || exit 91
args=" $* "
[[ "$args" != *'${fakeSecret}'* ]] || exit 92
[[ "$args" == *' --header @- '* ]] || exit 93
[[ "$args" == *' --output /dev/null '* ]] || exit 94
[[ "$args" == *' --connect-timeout 5 --max-time 20 '* ]] || exit 95
[[ "$args" == *' --proto =https --max-redirs 0 '* ]] || exit 96
[[ "$args" != *' --location '* && "$args" != *' -L '* ]] || exit 97
[[ "$args" == *"https://$REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken"* ]] || exit 98
IFS= read -r header
[[ "$header" == 'Ocp-Apim-Subscription-Key: ${fakeSecret}' ]] || exit 99
printf 'verified' > "$CASE_DIR/header-verified"
case "$TEST_CASE" in
  unauthorized) printf 401 ;;
  forbidden) printf 403 ;;
  redirect) printf 302 ;;
  throttled) printf 429 ;;
  server-error) printf 500 ;;
  network) printf 000; printf '${fakeSecret}' >&2; exit 28 ;;
  partial-200) printf 200; exit 18 ;;
  unexpected-output) printf '${fakeSecret}' ;;
  *) printf 200 ;;
esac
`, { mode: 0o755 });
    const cases: Array<[string, number, boolean, string?]> = [
      ['success', 0, true], ['windows-crlf', 0, true], ['az-failure', 1, false], ['empty', 1, false], ['newline', 1, false],
      ['unauthorized', 2, true], ['forbidden', 2, true], ['redirect', 2, true], ['throttled', 2, true],
      ['server-error', 2, true], ['network', 2, true], ['partial-200', 2, true],
      ['unexpected-output', 2, true], ['invalid-region', 1, false, 'eastus'],
      ['canada-east', 0, true, 'canadaeast']
    ];
    for (const [name, expected, callsCurl, region] of cases) {
      await t.test(name, async () => {
        const caseDir = join(root, name);
        await mkdir(caseDir);
        const env: NodeJS.ProcessEnv = { ...process.env, TEST_CASE: name, TEST_BIN: join(root, 'bin'), CASE_DIR: caseDir,
          TEST_SCRIPT: script, VAULT: 'kv-humanoide-optique-sbx', SECRET_NAME: 'azure-speech-key',
          REGION: region ?? 'canadacentral', key: 'INHERITED_EXPORT_MUST_BE_REMOVED', MSYS_NO_PATHCONV: '1' };
        delete env.BASH_ENV;
        const run = spawnSync(bash, ['--noprofile', '--norc', '-c', `
if command -v cygpath >/dev/null 2>&1; then
  TEST_BIN=$(cygpath -u "$TEST_BIN")
  CASE_DIR=$(cygpath -u "$CASE_DIR")
fi
export CASE_DIR
export PATH="$TEST_BIN:$PATH"
exec bash -x "$TEST_SCRIPT"
`], { env, encoding: 'utf8', timeout: 10000 });
        assert.equal(run.status, expected, run.stdout + run.stderr);
        assert.equal((run.stdout + run.stderr).includes(fakeSecret), false);
        assert.equal(existsSync(join(caseDir, 'curl-called')), callsCurl);
        if (callsCurl) assert.equal(await readFile(join(caseDir, 'header-verified'), 'utf8'), 'verified');
        if (name === 'invalid-region') assert.equal(existsSync(join(caseDir, 'az-called')), false);
        assert.equal(run.stdout.includes('OK :'), expected === 0);
      });
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});
