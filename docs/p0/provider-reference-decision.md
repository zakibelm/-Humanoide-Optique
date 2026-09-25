# P0 — Provider Reference Decision

**Status:** ARCHITECTURE REFERENCE RETAINED — Provider A not yet authorized  
**Research date:** 2026-09-25  
**Temporary decision:** true  
**M3 authorization:** NOT GRANTED

## Confirmed pre-M3 decisions

Confirmed by the user on 2026-09-25:

1. **Initial P0 market scope: Québec + Morocco.**
   - Required evaluation locales therefore include fr-CA and Arabic/Darija from the first real-provider benchmark.
   - The listening panel must include human reviewers able to judge both Québec French and Moroccan Darija.
2. **Mandatory data policy: processing in Canada + zero content retention.**
   - This is a hard eligibility requirement for Provider A, not a preference.
   - A provider without documented/contractual Canadian processing and zero content retention is excluded, regardless of price or latency.
   - Deepgram's standard/self-service offer is disqualified: the documented regional endpoints verified for that offer are Global/US, EU GA and Australia GA, with no self-service Canada processing region.
   - Dedicated or on-premises Deepgram deployments remain theoretical enterprise alternatives available by quote. They have no public comparable price and are outside the self-service P0 cost scenario.
3. **Architecture reference retained: Azure Speech Services for both STT and TTS.**
   - Default regions: Canada Central or Canada East, subject to service/model availability at provisioning time.
   - Decision hierarchy: **Governance & Compliance > Risk > Cost**.
   - For a Canadian Azure Speech resource, persisted service data is stored and processed at rest in the selected Canadian geography. For the P0 real-time path, STT audio is processed in memory without storage at rest and TTS does not persist input/output content, yielding the required zero-content-retention posture.

Only the unilateral Azure qualification panel and formal Provider A approval remain open. This does not authorize M3.

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
- **Pricing:** **$0.0077/minute ($0.46/hour) monolingual** and **$0.0092/minute ($0.55/hour) multilingual**, subject to current plan confirmation immediately before M3.
- **Data:** mip_opt_out=true excludes model improvement and gives zero content retention after the response; metadata and usage logs remain.
- **Strengths:** simple real-time API; low latency/cost position; explicit Arabic dialects.
- **Limits:** no explicit fr-CA profile; Canadian French accuracy and Canadian data residency remain to prove.

**Decision history:** not selected for the standard/self-service P0 architecture because no documented Canadian processing endpoint satisfies the locked residency rule. Dedicated/on-premises enterprise deployment remains a future theoretical alternative, not a current candidate.

## TTS candidates

### TTS-A — Microsoft Azure Neural TTS

- **Streaming:** progressive synthesis/stream consumption through the Speech SDK/API.
- **Languages:** Canadian French and English voices plus Arabic voices/locales.
- **Pricing:** **$16 per 1 million characters** for standard Neural TTS; capture the regional price snapshot immediately before M3.
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
| STT | Deepgram Nova-3 | Yes | Generic French | Yes | ar-MA explicit | Zero retention available, but no Canada self-service endpoint | **Not selected:** fails Canadian processing requirement |
| TTS | Azure Neural TTS | Yes | Explicit voices | Explicit voices | Multiple locales | TTS data not persisted per docs | $16/1M chars; voice/latency panel |
| TTS | Google Chirp 3 HD | Yes | Explicit voices | Yes | ar-XA MSA | Contract/region review | Darija suitability |
| TTS | ElevenLabs | Yes | Documented | Documented | Documented | Zero retention enterprise-only | Governance + accent |

## Intensive-volume scenario — 8 hours/day

**Historical cost analysis only:** the Deepgram combinations below are no longer eligible for the locked standard/self-service architecture because they fail the Canadian-processing requirement. They are preserved to document why the earlier cost recommendation changed rather than being deleted silently.

Standardized planning assumptions:

- 8 hours/day × 30 days = **240 audio hours/month** = **14,400 minutes**;
- Deepgram Nova-3 monolingual: 14,400 × $0.0077 = **$110.88/month**;
- synthesized output assumption: **10.8 million characters/month**, equivalent to about 750 characters per active minute;
- infrastructure, taxes, currency conversion, silence ratio, retries, free tiers and enterprise discounts excluded.

| Combination | STT/month | TTS/month | Comparable total/month |
|---|---:|---:|---:|
| Deepgram + Azure Neural TTS | $110.88 | 10.8M × $16/1M = $172.80 | **$283.68 ≈ $283** |
| Deepgram + ElevenLabs Flash/Turbo | $110.88 | 10.8M × $0.05/1K = $540.00 | **$650.88 ≈ $650** |
| Deepgram + ElevenLabs Multilingual | $110.88 | 10.8M × $0.10/1K = $1,080.00 | **$1,190.88 ≈ $1,191** |

**Arithmetic clarification:** $1,080 is the ElevenLabs Multilingual **TTS-only** component. A combined Deepgram + ElevenLabs Multilingual total under the same assumptions is approximately $1,191/month. Presenting $1,080 as the combined total would omit the $110.88 STT cost and would not be comparable to the other two totals.

These are planning estimates, not invoices. Actual audio minutes and synthesized character volume must be measured during P0.

## Recommendation — architecture reference, not M3 authorization

### Default reference pair

- **STT:** Azure Speech STT in Canada Central or Canada East.
- **TTS:** Azure Neural TTS.

Rationale: Azure Speech STT + TTS is the only retained default architecture aligned with the locked hierarchy **Governance & Compliance > Risk > Cost**. It preserves Canadian regional deployment, the required zero-content-retention posture for the real-time P0 path, explicit fr-CA support and a unified operational boundary.

This architecture reference is still conditional: Azure STT and Azure Neural TTS must pass the human qualification panel in French Canadian, Darija and code-switching. Until then, it is not an authorized Provider A.

### Decision history — alternatives not selected as default

- **Deepgram Nova-3:** objective cost and Arabic-dialect advantages retained in the record, but disqualified for standard/self-service P0 because no Canadian regional endpoint is documented. Dedicated/on-premises enterprise options are unpriced and out of scope.
- **Google Chirp 3 / Cloud TTS:** retained as future Provider B history. It is not the default because the current decision favors Azure's unified Canadian governance boundary; Google's model/region matrix and equivalent retention configuration would need a separate validation.
- **ElevenLabs:** retained only as a future quality/latency challenger. Enterprise-only zero retention and absence of confirmed Canadian processing prevent default selection under the locked policy.

This does not authorize Provider A. Two governance decisions are now locked:

- initial scope: Québec + Morocco;
- data policy: Canadian processing + zero content retention.

The remaining external gate is now a **unilateral qualification of the Azure stack**, not a comparative multi-provider selection panel. After that panel, the user must still explicitly approve Azure as Provider A.

## M3 gate and acceptance criteria — Azure qualification panel

The panel evaluates whether Azure Speech STT + Azure Neural TTS is acceptable for an in-store client interaction across:

- Québec French (fr-CA);
- Moroccan Darija;
- fr-CA/Darija code-switching;
- representative store noise and natural conversational pacing.

### STT acceptance

The test protocol must measure WER separately for fr-CA, Darija and code-switching. Before listening begins, the human owners must approve the numeric thresholds. Proposed P0 qualification thresholds:

| Fixture class | Proposed maximum WER |
|---|---:|
| fr-CA clean speech | 15% |
| Darija clean speech | 25% |
| fr-CA/Darija code-switching | 25% |
| Store-noise fixtures | 30% |

Independent of aggregate WER, any clinically or commercially material semantic inversion, fabricated number or missed negation is a blocking failure.

### TTS acceptance

- Median human intelligibility score at least **4/5** for fr-CA and Darija.
- No language rated below **3/5** by any qualified reviewer without documented retest.
- Correct pronunciation of the locked brand, common optical vocabulary, numbers and locale-specific expressions.
- Code-switched phrases remain understandable without unacceptable accent switching or skipped words.
- No severe clipping, truncation or unnatural pause that changes meaning.

### Gate outcome

- **PASS:** all mandatory thresholds met and reviewers sign the evidence record.
- **PARTIAL:** fr-CA passes but Darija/code-switching needs a bounded remediation and retest.
- **FAIL:** a mandatory WER, intelligibility or critical-semantic criterion fails.

No result may be inferred from vendor documentation or synthetic metrics alone.

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

**Azure Speech STT + TTS is the retained architecture reference, but no provider has been connected. The human Azure qualification panel for fr-CA, Darija and code-switching remains the sole external gate. M3 remains NOT AUTHORIZED until that panel is completed and the user explicitly approves Azure as Provider A.**
