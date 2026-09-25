# M2 — P0ScopeGuard Report

## Status and scope

M2 implements the deterministic P0 scope boundary authorized after M1. It adds no provider, no real ModelGateway, no LLM call and no full Policy Engine. P-1 remains an external human gate and is not asserted passed.

## Implementation

- `src/guards/p0-scope-guard.ts`
  - exact standard BLOCK response;
  - explicit allowlist for greetings, microphone/audio tests, language selection, repetition, understanding confirmation and a narrowly defined neutral conversation set;
  - explicit out-of-scope patterns only improve audit classification and never grant access;
  - every unmatched, empty or oversized input becomes `UNKNOWN → BLOCK`;
  - `runAfterP0ScopeGuard` invokes the future downstream model boundary only after `ALLOW`;
  - minimal output safety gate blocks manifestly clinical text without becoming a full Policy Engine.
- `tests/p0-scope-guard.test.ts`
  - representative ALLOW fixture for every authorized intent;
  - S06 clinical question → BLOCK and zero downstream calls;
  - S07 prescription/disease question → BLOCK;
  - S09 commercial price question → UNKNOWN → BLOCK, zero downstream calls and no invented price;
  - generic unknown, empty and oversized input → BLOCK;
  - ALLOW invokes downstream exactly once;
  - minimal output gate: clinical BLOCK and neutral ALLOW.

## Measurements and evidence

- Final runtime tests: 12 passed, 0 failed, 0 skipped.
- Dedicated M2 tests: 8 passed.
- Static typecheck: exit code 0, including contracts, guard and both test files.
- No external provider or model was contacted.
- The first test attempt exposed a malformed language-selection regex; it was corrected within M2 and retained in the raw test evidence.

## Commits

### M1 corrections
- `946818dec7c42a9aa1178fc3c3ccc29d63a2936d` — add `@types/node`.
- `65fa9461def8b5a5247690eacb37077669f0307a` — lock Node types.

### M2
- `76d12f80725db0bbee37fefff445288fe7a8a73d` — input guard.
- `c1b27fb5462a7252c9a308f65e1d7280a87d449c` — input tests.
- `c44e94b1314c61d27fc78a19105e9470a6e9356b` — minimal output gate.
- `56e4801fd7c33953a04ba5e2fb111ea685afe65a` — output tests.

## Limitations

This is intentionally conservative. False negatives are acceptable at P0 because unmatched content fails closed. The future runtime must use the guarded boundary before every ModelGateway call. No semantic classifier, tool policy, provider adapter or real model was introduced.

## Gate

M2 is implemented and evidenced. External review is required before M3.

**STOP after M2. M3 has not started.**

