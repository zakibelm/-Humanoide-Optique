# M1 — Provider Contracts Report

## Milestone and scope

**M1 only.** M0 approved by the user. The Handoff v1.5 takes precedence over the Master Execution Prompt v1.1; the latter's historical header still points to v1.2. This milestone defines three provider-neutral streaming contracts and tests them with doubles. No real provider, application runtime, guard, avatar or product feature is implemented. P-1 remains an external human gate, not asserted passed.

## Setup and stack

- Destination: `zakibelm/-Humanoide-Optique`, private at execution. It was empty before the first documentation commit.
- Source of truth: `docs/handoff/HANDOFF_v1.5_LOCKED.md` converted from the supplied DOCX and `docs/handoff/MASTER_PROMPT_v1.1_LOCKED.md` transcribed from the supplied PDF. The latter identifies the exact source PDF by SHA-256 `e1a70da2e346768a4d3b07b05fc236f7b4873a86a79c89d19135c01501e709c4`. The original PDFs remain the authoritative format for layout; their Markdown transcriptions are readable repository copies.
- The two Markdown files were committed before M1 product files and independently fetched back from GitHub: remote content matched the local copies byte for byte as strings.
- Stack decision: `docs/p0/stack-decision.md`; TypeScript ES modules, Node >=24 and built-in `node:test`, without runtime packages. Verified on Node v24.19.0. Node type stripping does **not** constitute a TypeScript typecheck.

## Contract files

| Contract | Input | Progressive output | Boundary |
|---|---|---|---|
| `ModelGateway.generate` | messages, task type, capabilities, configured model ID, locale, request context, optional AbortSignal | `text_delta`, terminal `completed` | no SDK/model hardcoded in core |
| `STTProvider.transcribe` | asynchronous audio frames with MIME/rate/channels, locale, request context, optional AbortSignal | `partial`, `final` transcripts | no browser/provider STT dependency |
| `TTSProvider.synthesize` | asynchronous text, configured voice ID, locale, request context, optional AbortSignal | asynchronous audio frames with MIME/rate/channels | no provider voice or playback implementation |

Shared `RequestContext` carries `traceId`, `sessionId`, `requestId`, `locale`, `signal`; `ProviderError` describes a code and retryability. These are interface boundaries, not a runtime implementation or proof of streaming transport. Future adapters must honor these contracts; cancellation remains cooperative because the interface cannot force a provider to stop.

## Tests and measurements

Command executed locally in the isolated project directory:

```text
npm test
> node --test tests/*.test.ts
✔ two model doubles satisfy one streaming consumer without changing its core call
✔ two STT doubles consume progressive frames and emit partial then final
✔ two TTS doubles consume streaming text and emit codec-described audio
✔ cancellation propagates through each of the three contracts
ℹ tests 4
ℹ pass 4
ℹ fail 0
ℹ duration_ms 270.719145
```

Measurement: four contract tests passed on Node v24.19.0; no runtime latency, TTFA, provider quality, microphone or playback measurements. `tsc --version` returned exit 127 (`tsc: command not found`); therefore static compiler validation is **not evidenced**. This limitation does not invalidate the runtime tests, but should be addressed before relying on TypeScript types across real adapters.

## Changed files

- `docs/handoff/HANDOFF_v1.5_LOCKED.md`
- `docs/handoff/MASTER_PROMPT_v1.1_LOCKED.md`
- `docs/p0/stack-decision.md`
- `package.json`
- `src/contracts/common.ts`
- `src/contracts/model-gateway.ts`
- `src/contracts/stt-provider.ts`
- `src/contracts/tts-provider.ts`
- `tests/provider-contracts.test.ts`
- `docs/p1/provider-contracts-report.md`

No Z12 Voice file was modified or imported. No `P0ScopeGuard` file exists; its implementation is M2 and requires separate approval.

## Risks and next gate

- Contracts have been tested only against doubles; provider interchangeability in real conditions is unproven until M7.
- `AsyncIterable` preserves the option for streaming but does not prove backpressure, network transport, TTFA or provider latency.
- TypeScript typecheck requires a compiler dependency; none was installed in M1.
- Provider error taxonomy, codec negotiation and frame timing may require additive refinement as real adapters are tested, without embedding a provider in the core.

**STOP after M1.** Proposed next milestone is M2 Scope Guard, but it must not start without explicit authorization. P0 remains **NOT VERIFIED**.
