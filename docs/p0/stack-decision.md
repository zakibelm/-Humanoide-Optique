# M1 — Stack decision

- Date: 2026-09-25.
- Destination repository: `zakibelm/-Humanoide-Optique`, empty at inspection.
- Choice: TypeScript with erasable syntax on Node.js >=24, ES modules and the built-in `node:test` runner. Verified in this environment with Node v24.19.0; no package install or provider dependency required in M1. Pinning a deployment runtime and adding a TypeScript compiler/typecheck belong to a later approved integration step.
- Rationale: M1 needs typed, streaming-capable contracts and tests, not a web framework or deployment platform. TypeScript aligns with the structures inspected in Z12 Voice while keeping the Humanoïde codebase independent. Node's async iterables and AbortSignal express streaming and cancellation without choosing a provider. Node's type stripping executes tests but does not typecheck; an actual TypeScript compiler remains a documented limitation of M1 verification.
- Alternatives considered: Python/FastAPI adds an unjustified stack decision for an empty repository; cloning the React/Express Z12 studio would carry provider-coupled routes and unrelated product features into P0.
- Boundaries: no server, transport, SDK, provider adapter, P0ScopeGuard, audio runtime, or locale data portage in M1. M2 owns the Scope Guard; real providers begin at M3 under the Master contract.
- Status: M1 design decision, not a proof of a functioning pipeline or provider integration.
