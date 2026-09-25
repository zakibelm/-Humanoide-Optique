# P0 — Provider Reference Decision

**Status:** DECISION REQUIRED — no Provider A selected  
**Research date:** 2026-09-25  
**Temporary decision:** true  
**M3 authorization:** NOT GRANTED

## Purpose

This document compares viable STT and TTS candidates for P0. It does not connect, configure or select a provider. No SDK, credential or production endpoint has been introduced. Provider A may be chosen only by explicit user approval.

Requirements: genuine streaming, French Canadian/English/Arabic coverage, known pricing basis, documented data constraints, provider-neutral integration and preference for Canadian governance options where technically comparable.

Prices are public indicators observed on 2026-09-25, generally USD before taxes, discounts and currency conversion. Recheck immediately before M3.

## STT candidates

### STT-A — Microsoft Azure Speech

- **Streaming:** confirmed real-time STT through the Speech SDK/API.
- **Languages:** explicit fr-CA and en-CA; broader Speech support includes Arabic locales. Lock the exact Arabic locale before M3.
- **Pricing:** pay-as-you-go billed by audio hours; the exact regional quote is dynamic and must be captured for the selected Azure region.
- **Data:** Microsoft states real-time audio is processed in server memory, encrypted in transit and not stored at rest. Consent/privacy obligations remain ours.
- **Strengths:** explicit Canadian French; unified STT/TTS; enterprise governance; regional deployment; mature SDKs.
- **Limits:** region/agreement-dependent price; Arabic/Darija quality and store-noise performance unproven.

**Fit:** strong conservative reference candidate when governance and fr-CA are prioritized.

### STT-B — Google Cloud Speech-to-Text V2 / Chirp 3

- **Streaming:** StreamingRecognize documented for Chirp 3.
- **Languages:** fr-CA documented; Arabic Morocco ar-MA listed for Chirp 3; English variants available.
- **Pricing:** billed per successfully processed second of audio. Capture the chosen model/region rate before M3.
- **Data:** Google states streaming/synchronous audio is processed in memory and customer audio is not stored; limited request metadata is logged temporarily.
- **Strengths:** explicit fr-CA and ar-MA; strong multilingual catalogue; streaming model; some Canadian region availability.
- **Limits:** complex model/region/language matrix; successful empty responses can still be billable.

**Fit:** strongest multilingual challenger where explicit ar-MA matters.

### STT-C — Deepgram Nova-3

- **Streaming:** confirmed WebSocket streaming; Nova-3 supports batch and streaming.
- **Languages:** English, French and Arabic; Nova-3 explicitly lists ar-MA. French is generic/multilingual, not a distinct fr-CA locale.
- **Pricing:** public indicator around **$0.29/audio hour monolingual streaming** and **$0.35/audio hour multilingual**, subject to plan confirmation.
- **Data:** mip_opt_out=true excludes model improvement and gives zero content retention after the response; metadata and usage logs remain.
- **Strengths:** simple real-time API; low latency/cost position; explicit Arabic dialects.
- **Limits:** no explicit fr-CA profile; Canadian French accuracy and Canadian data residency remain to prove.

**Fit:** latency/cost challenger, conditional on passing fr-CA fixtures.

## TTS candidates

### TTS-A — Microsoft Azure Speech

- **Streaming:** progressive synthesis/stream consumption through the Speech SDK/API.
- **Languages:** Canadian French and English voices plus Arabic voices/locales.
- **Pricing:** billed per synthesized character; capture the exact voice tier and regional rate.
- **Data:** Microsoft states no data is persisted in TTS processing.
- **Strengths:** explicit local voices; enterprise governance; one platform with Azure STT; SSML/pronunciation controls.
- **Limits:** naturalness and first-audio latency require measurement; premium/custom tiers differ.

**Fit:** strongest operationally conservative candidate.

### TTS-B — Google Cloud Text-to-Speech / Chirp 3 HD

- **Streaming:** low-latency real-time text streaming documented for Chirp 3 HD.
- **Languages:** many fr-CA voices, English variants and generic Arabic ar-XA voices. ar-XA is Modern Standard Arabic, not guaranteed Darija.
- **Pricing:** billed per character; exact rate depends on voice family.
- **Data:** contractual and regional settings need review; language availability does not prove Canadian residency.
- **Strengths:** broad inventory; explicit fr-CA; streaming HD voices.
- **Limits:** Arabic dialect fit and exact region/voice/streaming combination require validation.

**Fit:** strong fr-CA challenger; Arabic needs listening tests.

### TTS-C — ElevenLabs Flash/Turbo or Multilingual

- **Streaming:** confirmed HTTP and WebSocket input streaming from partial text.
- **Languages:** official documentation lists English Canada, French Canada and Arabic variants.
- **Pricing:** **Flash/Turbo $0.05 per 1,000 characters**; **Multilingual v2 $0.10 per 1,000 characters**, before plan effects.
- **Data:** enable_logging=false provides zero retention, but official docs limit it to enterprise customers. Canadian residency is not assumed.
- **Strengths:** naturalness; partial-text streaming; transparent unit price.
- **Limits:** zero retention may require enterprise; accent quality needs human validation; voice cloning should remain disabled.

**Fit:** quality/latency challenger with a governance caveat.

## Comparative shortlist

| Layer | Candidate | Streaming | fr-CA | English | Arabic | Data posture | Main unresolved point |
|---|---|---:|---:|---:|---:|---|---|
| STT | Azure Speech | Yes | Explicit | Explicit | Multiple locales | Real-time audio not stored at rest | Regional price + Darija |
| STT | Google Chirp 3 | Yes | Explicit | Yes | ar-MA explicit | Audio in-memory; temporary metadata | Region/model matrix |
| STT | Deepgram Nova-3 | Yes | Generic French | Yes | ar-MA explicit | Opt-out zero content retention | fr-CA accuracy |
| TTS | Azure Speech | Yes | Explicit voices | Explicit voices | Multiple locales | TTS data not persisted per docs | Voice/latency |
| TTS | Google Chirp 3 HD | Yes | Explicit voices | Yes | ar-XA MSA | Contract/region review | Darija suitability |
| TTS | ElevenLabs | Yes | Documented | Documented | Documented | Zero retention enterprise-only | Governance + accent |

## Recommendation — not a selection

### Recommended first benchmark pair

- **STT:** Azure Speech as conservative reference candidate.
- **TTS:** Azure Speech as conservative reference candidate.

Rationale: explicit Canadian French, one enterprise speech platform, mature real-time interfaces and clearer real-time retention statements reduce integration and governance uncertainty.

### Mandatory challengers

- **STT:** Google Chirp 3 for explicit ar-MA; Deepgram Nova-3 only if generic French passes Canadian French fixtures.
- **TTS:** ElevenLabs Flash/Turbo for perceived quality/latency; Google Chirp 3 HD for fr-CA and platform diversity.

This does not authorize Provider A. Decide first:

1. Québec only or Québec + Morocco;
2. permitted data region and retention;
3. experimental budget cap;
4. single speech vendor versus best-of-breed;
5. human listening panel for fr-CA and Arabic/Darija.

## M3 decision record to complete after approval

    provider_a_stt:
    provider_a_tts:
    selection_date:
    selected_region:
    selected_models:
    selected_locales:
    budget_cap:
    retention_mode:
    pricing_snapshot:
    privacy_notes:
    temporary_decision: true
    approved_by:

## Official sources checked

### Microsoft

- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text
- https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/speech-to-text/data-privacy-security
- https://azure.microsoft.com/en-ca/pricing/details/speech/

### Google Cloud

- https://docs.cloud.google.com/speech-to-text/docs/models/chirp-3
- https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
- https://cloud.google.com/speech-to-text/pricing
- https://docs.cloud.google.com/speech-to-text/docs/v1/data-usage-faq
- https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types
- https://cloud.google.com/text-to-speech/pricing

### Deepgram

- https://developers.deepgram.com/docs/models-languages-overview
- https://developers.deepgram.com/reference/speech-to-text/listen-streaming
- https://developers.deepgram.com/trust-security/your-data
- https://deepgram.com/pricing

### ElevenLabs

- https://elevenlabs.io/docs/overview/capabilities/text-to-speech
- https://elevenlabs.io/docs/api-reference/text-to-speech/stream
- https://elevenlabs.io/docs/api-reference/text-to-speech/v-1-text-to-speech-voice-id-stream-input
- https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode
- https://elevenlabs.io/pricing/api

## Gate

**No provider has been selected or contacted. M3 remains NOT AUTHORIZED until the user explicitly chooses Provider A for STT and TTS.**
