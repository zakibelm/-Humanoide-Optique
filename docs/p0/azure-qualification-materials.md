# Azure Speech Qualification Materials — STT + TTS

**Status:** MATERIALS PREPARED — EXECUTION BLOCKED  
**Prepared:** 2026-09-25  
**Human verdict:** NOT RECORDED  
**M3 authorization:** NOT GRANTED

## 1. Role and boundary

This package prepares the Azure Speech qualification panel. It does not issue a PASS, PARTIAL or FAIL verdict. Only human reviewers who listen to the generated audio and review the STT evidence may decide the gate.

No audio, transcription, WER or listening score in this document is simulated.

## 2. Azure sandbox environment

### Requested configuration

- Service: Azure AI Speech / Speech Services
- Deployment type: trial or sandbox only
- Preferred region: **Canada Central**
- Alternate region: **Canada East**
- Billing: no production key, no long-term commitment
- Data policy: Canadian processing and zero content retention

### Region rationale

Canada Central is the preferred sandbox region because the architecture decision requires Canadian processing and it generally offers broad Azure service availability. Canada East is the fallback only if the required Speech model/voice combination is unavailable in Canada Central.

### Actual provisioning state

**NOT PROVISIONED.**

The Azure portal did not return a usable authenticated state in the available browser session, and no sandbox Azure credential or existing Speech resource was available in the execution environment. No resource, subscription, key, charge or external side effect was created.

Required human action before TTS generation:

1. provide access to an existing Azure sandbox subscription, or create a trial Speech resource;
2. confirm Canada Central or Canada East;
3. provide the resource endpoint and key through the approved secret mechanism, never in chat or in the repository;
4. confirm the selected Azure voices for fr-CA and Arabic/Darija.

## 3. Fixture inventory

Total: **50 fixtures**

- FQ01–FQ15: 15 clear Québec French phrases
- DJ01–DJ15: 15 clear Moroccan Darija phrases
- CS01–CS10: 10 real code-switching phrases
- NZ01–NZ10: 10 phrases to record with simulated store noise or overlapping voices

The reference text is intended for WER normalization. Punctuation is ignored for WER; numbers must be normalized consistently before scoring.

## 4. Québec French fixtures

| ID | Theme | Reference text |
|---|---|---|
| FQ01 | Greeting | Bonjour, bienvenue. Comment est-ce que je peux vous aider aujourd'hui? |
| FQ02 | Greeting | Salut, je viens regarder les montures pour une nouvelle paire de lunettes. |
| FQ03 | Product | Est-ce que vous avez des montures légères pour tous les jours? |
| FQ04 | Product | Je cherche des lunettes solides pour travailler devant un écran. |
| FQ05 | Product | Est-ce que je peux essayer cette monture en noir et en bleu? |
| FQ06 | Price | Combien coûte cette paire de lunettes avant les taxes? |
| FQ07 | Price | Est-ce que les verres sont inclus dans le prix affiché? |
| FQ08 | Price | Avez-vous une option moins chère dans le même style? |
| FQ09 | Appointment | J'aimerais prendre un rendez-vous jeudi après-midi. |
| FQ10 | Appointment | Est-ce qu'il reste une place demain vers dix heures? |
| FQ11 | Appointment | Je dois déplacer mon rendez-vous à la semaine prochaine. |
| FQ12 | Service | Combien de temps faut-il pour recevoir mes nouvelles lunettes? |
| FQ13 | Service | Est-ce que vous pouvez ajuster mes lunettes aujourd'hui? |
| FQ14 | Confirmation | Si j'ai bien compris, vous allez me rappeler quand elles seront prêtes. |
| FQ15 | Natural speech | Parfait, je vais y penser puis je vais revenir avec mon ordonnance. |

## 5. Moroccan Darija fixtures

| ID | Theme | Reference text |
|---|---|---|
| DJ01 | Greeting | السلام عليكم، مرحبا بكم. كيفاش نقدر نعاونك اليوم؟ |
| DJ02 | Greeting | سلام، بغيت نشوف شي مونطير جديدة ديال النظاضر. |
| DJ03 | Product | واش عندكم مونطير خفاف للاستعمال اليومي؟ |
| DJ04 | Product | كنقلب على نظاضر قويين باش نخدم قدام الشاشة. |
| DJ05 | Product | واش نقدر نجرب هاد المونطير بالكحل وبالزرق؟ |
| DJ06 | Price | بشحال هاد النظاضر قبل الضريبة؟ |
| DJ07 | Price | واش الزجاج داخل فالثمن اللي مكتوب؟ |
| DJ08 | Price | واش عندكم اختيار أرخص بنفس الستايل؟ |
| DJ09 | Appointment | بغيت ناخد موعد نهار الخميس من بعد الظهر. |
| DJ10 | Appointment | واش باقي شي بلاصة غدا مع العشرة ديال الصباح؟ |
| DJ11 | Appointment | خاصني نبدل الموعد ديالي للسيمانة الجاية. |
| DJ12 | Service | شحال خاص من الوقت باش يوجدو ليا النظاضر الجداد؟ |
| DJ13 | Service | واش تقدروا تصلحو ليا النظاضر اليوم؟ |
| DJ14 | Confirmation | إلا فهمت مزيان، غادي تعيطو ليا ملي يوجدو النظاضر. |
| DJ15 | Natural speech | مزيان، غادي نفكر ونرجع من بعد ومعايا الوصفة. |

## 6. French–Darija code-switching fixtures

| ID | Theme | Reference text |
|---|---|---|
| CS01 | Greeting | Bonjour, بغيت نشوف une nouvelle paire de lunettes. |
| CS02 | Product | واش عندكم des montures légères pour tous les jours? |
| CS03 | Product | Je préfère هاد المونطير en noir, s'il vous plaît. |
| CS04 | Product | هاد النظاضر مزيانين، mais je veux essayer une autre taille. |
| CS05 | Price | بشحال cette paire avant les taxes? |
| CS06 | Price | Est-ce que الزجاج داخل dans le prix affiché? |
| CS07 | Appointment | بغيت ناخد rendez-vous jeudi après-midi. |
| CS08 | Appointment | Je dois نبدل الموعد ديالي à la semaine prochaine. |
| CS09 | Service | شحال خاص من الوقت pour recevoir mes nouvelles lunettes? |
| CS10 | Confirmation | إذا فهمت مزيان، vous allez m'appeler quand elles seront prêtes. |

## 7. Store-noise and overlapping-voice fixtures

These fixtures require **human recordings**. Noise must be mixed or reproduced in the room; it must not be written into the transcript.

| ID | Noise condition | Target SNR / overlap | Reference text |
|---|---|---|---|
| NZ01 | Retail ambience | +15 dB SNR | Bonjour, j'aimerais prendre un rendez-vous pour demain matin. |
| NZ02 | Door chime and footsteps | +10 dB SNR | Est-ce que les verres sont inclus dans le prix? |
| NZ03 | Quiet music | +10 dB SNR | Je cherche une monture légère pour travailler. |
| NZ04 | Cash register sounds | +5 dB SNR | Combien coûte cette paire avant les taxes? |
| NZ05 | One background speaker | 20% overlap | Je dois déplacer mon rendez-vous à vendredi. |
| NZ06 | Retail ambience | +15 dB SNR | بغيت ناخد موعد نهار الخميس. |
| NZ07 | Door chime and footsteps | +10 dB SNR | واش الزجاج داخل فالثمن؟ |
| NZ08 | Quiet music | +10 dB SNR | كنقلب على مونطير خفاف. |
| NZ09 | One background speaker | 20% overlap | Bonjour، بغيت نشوف des montures légères. |
| NZ10 | Two background speakers | 30% overlap | واش نقدر ناخد rendez-vous demain matin? |

## 8. TTS generation plan

### Output directory and naming

Expected repository-external output directory:

    qualification-output/azure-tts/
      fr-ca/
        FQ01.wav ... FQ15.wav
      darija/
        DJ01.wav ... DJ15.wav
      code-switch/
        CS01.wav ... CS10.wav
      noise-reference-clean/
        NZ01.wav ... NZ10.wav
      manifest.csv

Do not commit API keys. Generated audio should not be committed to Git by default; deliver it as a separate panel artifact.

### Required manifest fields

- fixture_id
- category
- reference_text
- azure_region
- voice_name
- locale
- output_format
- sample_rate_hz
- generated_at
- sha256
- generation_status
- error_code

### Current TTS status

**0/50 generated — PENDING_AZURE_RESOURCE.**

No placeholder or synthetic local audio was created.

## 9. STT recording and transcription plan

### Human recordings required

No real human fr-CA or Darija recordings were supplied. Therefore:

- STT transcription was not called;
- no hypothesis transcript exists;
- WER was not calculated;
- no result was inferred from Azure TTS audio, because TTS-to-STT loopback would not replace a human-speech test.

Expected input structure:

    qualification-input/human-recordings/
      fr-ca/FQ01.wav ... FQ15.wav
      darija/DJ01.wav ... DJ15.wav
      code-switch/CS01.wav ... CS10.wav
      noise/NZ01.wav ... NZ10.wav

Each recording must have explicit speaker consent and a matching reference fixture ID.

## 10. WER protocol

For each fixture:

    WER = (substitutions + deletions + insertions) / reference word count

Required normalization:

1. Unicode normalization;
2. lowercase where applicable;
3. punctuation removal;
4. consistent number expansion;
5. whitespace normalization;
6. preserve meaningful French/Darija words;
7. do not translate code-switched content before scoring.

Report both:

- fixture-level WER;
- micro-averaged category WER using total errors divided by total reference words.

No WER cell may be populated without the original audio, reference text, Azure transcript and reproducible calculation.

## 11. Locked acceptance thresholds

| Category | Maximum WER |
|---|---:|
| fr-CA clean speech | 15% |
| Darija clean speech | 25% |
| fr-CA/Darija code-switching | 25% |
| Store-noise fixtures | 30% |

Critical semantic inversion, fabricated number or missed negation is a blocking failure regardless of aggregate WER.

TTS human listening criteria:

- median intelligibility at least 4/5 for fr-CA and Darija;
- no language below 3/5 by a qualified reviewer without retest;
- correct pronunciation of brand, optical vocabulary, numbers and locale expressions;
- understandable code-switching;
- no clipping, truncation or pause that changes meaning.

## 12. Human score sheet

Each reviewer completes one row per TTS file:

| Field | Allowed value |
|---|---|
| fixture_id | FQ01–NZ10 |
| reviewer_id | pseudonymous identifier |
| qualified_fr_ca | yes/no |
| qualified_darija | yes/no |
| intelligibility | 1–5 |
| naturalness | 1–5 |
| accent_acceptability | 1–5 |
| pronunciation_error | yes/no + note |
| meaning_changed | yes/no + note |
| clipping_or_truncation | yes/no + note |
| comments | free text |

The panel owner aggregates scores and records the verdict. Work must not assign it.

## 13. Evidence checklist

- [ ] Azure Speech sandbox provisioned in Canada Central or Canada East
- [ ] Region and resource identifier recorded without exposing keys
- [ ] Exact STT model and TTS voices recorded
- [ ] 50 Azure TTS files generated and hashes captured
- [ ] Human fr-CA recordings supplied with consent
- [ ] Human Darija recordings supplied with consent
- [ ] Code-switch recordings supplied
- [ ] Noise/overlap recordings supplied
- [ ] Azure STT raw transcripts exported
- [ ] WER calculation artifact produced
- [ ] Human score sheets completed
- [ ] Human panel verdict signed

## 14. Current gate

**MATERIAL PREPARATION: PARTIAL**

Completed: 50 text fixtures, file naming, manifest schema, WER protocol, thresholds and human score sheet.

Blocked: Azure resource access, TTS generation, real human recordings, STT transcription, WER measurement and human listening.

**No PASS/PARTIAL/FAIL qualification verdict has been issued. M3 remains closed.**
