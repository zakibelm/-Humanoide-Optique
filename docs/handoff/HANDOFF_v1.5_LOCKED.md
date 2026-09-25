**HUMANOÏDE OPTIQUE**

**HANDOFF GLOBAL**

**v1.5 — LOCKED**

| **Version**            | v1.5 — LOCKED                                                                         |
|------------------------|---------------------------------------------------------------------------------------|
| **Date**               | 25 septembre 2026                                                                     |
| **Statut**             | SOURCE OF TRUTH — VISION + ARCHITECTURE + GOUVERNANCE                                 |
| **Remplace**           | v1.4 — LOCKED                                                                         |
| **Baseline canonique** | v1.2 intégralement préservée en Annexe A ; v1.3/v1.5 cumulés dans le corps principal. |
| **Contrat P-1/P0**     | Master Execution Prompt P-1/P0 v1.1 — LOCKED                                          |
| **Règle**              | Toute modification substantielle future devient v1.5 ou ultérieure.                   |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Règle de gouvernance<br />
</strong>P0 reste LOCKED et inchangé. La v1.5 n’autorise aucune extension silencieuse de P0. Elle consolide les contrats P1/P1bis pour le contexte opérationnel vivant, l’intelligence des interactions, la fiabilité et la mesure de latence métier.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 0. Changelog consolidé

## 0.1 v1.2 → v1.3 — exécution, preuves et Jev

- P-1 Validation terrain et P0 Core technique sont deux tracks parallèles avec gates séparés.

- P-1 est un gate externe humain. L’IA coder ne peut ni le simuler ni le déclarer PASSED.

- Master Execution Prompt P-1/P0 v1.1 LOCKED = contrat d’exécution de P0.

- Le protocole d’autonomie agressive est suspendu pour ce projet à proximité clinique : chaque milestone suit INSPECT → PLAN → IMPLEMENT → TEST → MEASURE → REPORT → STOP.

- P0ScopeGuard obligatoire avant le LLM : ALLOWLIST \> DENYLIST ; UNKNOWN → BLOCK.

- Provider STT/TTS A = référence provisoire ; Provider B doit pouvoir être branché sur les mêmes contrats pour prouver l’interchangeabilité.

- TTFA utilisateur = premier audio réellement joué, avec audio_first_playback_ms distinct de tts_first_chunk_ms.

- P50/P95 : N \< 20 par scénario = INDICATIVE ; N ≥ 20 = MEASURED ; N est toujours publié.

- S09 ajoute un cas gris commercial pour tester le sur-blocage / sous-blocage du Scope Guard.

- Jev reste un Research Candidate for Bounded Semantic Decision Tasks : NOT VERIFIED, NOT COMMITTED, NO SAFETY AUTHORITY, NO CLINICAL AUTHORITY, NOT PART OF P0.

- Toute expérimentation Jev passe d’abord par un JEV LAB indépendant, puis éventuellement par un shadow mode. Le Hard Policy Engine reste souverain.

## 0.2 v1.3 → v1.4 — MCP/CRM + Interaction Intelligence + Reliability

- Le CRM et les systèmes opérationnels deviennent une source de contexte vivant de l’Humanoïde, distincte du RAG.

- Le Brain ne se couple jamais directement à HubSpot, Salesforce, Zoho ou un CRM maison : il appelle des capacités stables via Tool Gateway / MCP.

- Le serveur MCP peut router vers CRM, POS/OMS, calendrier/scheduler ou autres systèmes selon le magasin.

- Lecture et écriture sont séparées : les lectures peuvent arriver plus tôt ; les écritures exigent permissions, audit, idempotence et confirmation adaptée au risque.

- Un Conversation Event Store collecte les événements utiles à l’analyse, sous règles de minimisation et de confidentialité.

- Interaction Intelligence Memory peut être mise à jour automatiquement avec les questions, intentions, formulations, contextes, fréquences et tendances récurrents.

- Interaction Intelligence Memory n’est pas une source de vérité métier : une ancienne réponse LLM ne devient jamais automatiquement une connaissance métier validée.

- Optimisation de coût/latence : Semantic Cache → FAQ/RAG ciblé → RAG complet + LLM ; cache audio/TTS possible pour les réponses stables validées.

- Reliability Intelligence analyse automatiquement logs, erreurs, latences, coûts, fallbacks, santé providers et anomalies.

- Toute action corrective qui modifie la production reste human-gated.

- Apprentissage continu gouverné : adaptation online au niveau mémoire/cache/routing/retrieval ; fine-tuning ou entraînement de modèle uniquement offline, versionné, benchmarké et validé.

## 0.3 v1.4 → v1.5 — data dependency, risque dynamique et latence métier

- Jev : limite de contexte désormais vérifiée — 32K tokens pour state + longest question, 64K tokens au total. Le statut de recherche de Jev reste inchangé.

- Task/Risk Router : aucune nouvelle étape parallèle. data_dependency devient une sous-dimension de REQUIRED_CAPABILITIES.

- Valeurs verrouillées : NONE, CACHE_ALLOWED, LIVE_NON_BLOCKING, LIVE_ANSWER_DEPENDENT.

- RISK_CLASS reste évalué en premier sur l’intention disponible, mais il n’est jamais considéré comme irréversible : une donnée live peut déclencher une réévaluation du Risk Preflight avant restitution ou action.

- LIVE_ANSWER_DEPENDENT contourne structurellement le Semantic Answer Cache et exige une source live. Un cache technique connecteur très court peut exister, mais ne compte jamais comme Semantic Cache HIT.

- TIME_TO_BUSINESS_ANSWER devient une métrique distincte du TTFA. Elle inclut le lookup live, la réévaluation du risque et les gates nécessaires avant la première information métier factuelle.

- La Definition of Done P1bis teste séparément les quatre valeurs data_dependency et mesure TTFA, TIME_TO_BUSINESS_ANSWER, latence MCP P50/P95, timeout et fallback.

# 1. Source of Truth et hiérarchie des contrats

| **Priorité** | **Artefact**                                 | **Rôle**                                                                     |
|--------------|----------------------------------------------|------------------------------------------------------------------------------|
| 1            | Handoff Global v1.5 — LOCKED                 | Architecture et décisions produit actuelles.                                 |
| 2            | Master Execution Prompt P-1/P0 v1.1 — LOCKED | Contrat exécutable de P0 ; ne pas élargir son scope.                         |
| 3            | Handoff Global v1.2 (Annexe A)               | Baseline canonique préservée ; valide sauf supersession explicite v1.3/v1.5. |
| 4            | Anciennes notes / prompts / code             | Contexte historique ; ne prévaut pas sur les contrats ci-dessus.             |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Règle de supersession<br />
Une décision v1.2 demeure valide si elle n’est pas explicitement remplacée. La v1.5 ajoute des couches et gates ; elle ne réécrit pas arbitrairement les décisions antérieures.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 2. Architecture cible consolidée v1.5

L’Humanoïde reste un copilote optique local en magasin. Le Brain conserve le LLM, le Skill, le RAG, les règles, les garde-fous, l’état conversationnel et les permissions d’outils. La v1.5 formalise en plus des plans de contexte distincts : connaissance métier, état opérationnel vivant, mémoire d’interactions et télémétrie de fiabilité.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Caméra + Micro<br />
↓<br />
Perception / STT<br />
↓<br />
P0ScopeGuard / Risk Preflight selon phase<br />
↓<br />
Brain / Skill / ModelGateway<br />
├──────────────→ RAG Knowledge<br />
│ (connaissance métier validée)<br />
├──────────────→ Tool Gateway / MCP<br />
│ (Live Business Context)<br />
│ ├─ CRM<br />
│ ├─ POS / OMS / commandes<br />
│ ├─ rendez-vous / calendrier<br />
│ └─ systèmes magasin<br />
├──────────────→ Interaction Intelligence Memory<br />
│ (ce que les clients demandent réellement)<br />
└──────────────→ Observability / Reliability<br />
(comment le système se comporte)<br />
↓<br />
Hard Policy Engine / Output Gate selon phase<br />
↓<br />
TTS → playback réel → avatar</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Principe v1.5<br />
Knowledge ≠ Operational State ≠ Interaction Memory ≠ Reliability Telemetry. Ces couches répondent à des questions différentes et ne doivent pas être fusionnées.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 3. Les quatre sources/couches de vérité et d’observation

| **Couche**                      | **Question**                                               | **Exemples**                                                     | **Autorité**                                   |
|---------------------------------|------------------------------------------------------------|------------------------------------------------------------------|------------------------------------------------|
| RAG Knowledge                   | Que savons-nous du métier ?                                | Produits, FAQ validée, procédures, documentation, règles métier. | Connaissance validée.                          |
| MCP / Live Business Context     | Qu’est-ce qui est vrai maintenant pour ce client/magasin ? | Client existe, commande prête, créneaux, rendez-vous.            | Système opérationnel source.                   |
| Interaction Intelligence Memory | Que demandent réellement les utilisateurs ?                | Intentions fréquentes, variantes, fréquence, tendances.          | Observation statistique, jamais vérité métier. |
| Observability / Reliability     | Comment le système se comporte-t-il ?                      | TTFA, erreurs, retries, coût, fallback, santé provider.          | Télémétrie technique.                          |

# 4. Live Business Context — Tool Gateway / MCP

L’Humanoïde doit pouvoir accéder au CRM et aux systèmes opérationnels du magasin. Cette capacité fait partie de l’architecture cible, mais n’entre pas dans P0.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Humanoïde / Brain<br />
↓<br />
Tool Gateway<br />
↓<br />
MCP Client<br />
↓<br />
MCP Integration Server<br />
├─ CRM Adapter<br />
├─ Order/POS/OMS Adapter<br />
├─ Appointment/Scheduler Adapter<br />
└─ Other Store Systems</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 4.1 Contrat fonctionnel stable

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>customer.find()<br />
customer.get_profile()<br />
order.get_status()<br />
order.list_recent()<br />
appointment.list()<br />
appointment.get_availability()<br />
appointment.create()<br />
appointment.reschedule()<br />
store.get_hours()</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Les noms exacts pourront évoluer, mais le principe est verrouillé : le Brain appelle des capacités métier stables ; les adapters traduisent vers les APIs concrètes. Changer de CRM ne doit pas obliger à réécrire le Brain.

## 4.2 Read / Write separation

| **Niveau**               | **Exemples**                                                              | **Règle**                                                                                   |
|--------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| READ                     | Recherche client, statut commande, rendez-vous existants, disponibilités. | Peut être introduit plus tôt avec auth, scopes et audit.                                    |
| WRITE                    | Créer client, note, rendez-vous, modification coordonnées.                | Permissions explicites, validation inputs, idempotence, audit et confirmation selon risque. |
| SENSITIVE / PROFESSIONAL | Toute action touchant une décision professionnelle ou clinique.           | Hard Policy Engine + règles métier + human gate lorsque requis.                             |

## 4.3 Placement roadmap

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>P0 LOCKED<br />
↓<br />
P1 — Skill + RAG + ModelGateway métier<br />
↓<br />
P1bis — Live Business Context<br />
├─ MCP read-only<br />
├─ CRM / orders / appointments<br />
└─ preuves + audit<br />
↓<br />
Write actions contrôlées</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 4.4 data_dependency dans REQUIRED_CAPABILITIES

La classification NON_BLOCKING / ANSWER_DEPENDENT ne crée pas un second routeur. Elle est portée par le Task/Risk Router existant dans REQUIRED_CAPABILITIES, après RISK_CLASS et avant TASK_TYPE / COMPLEXITY.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Task/Risk Router<br />
1. RISK_CLASS<br />
2. REQUIRED_CAPABILITIES<br />
├─ text<br />
├─ vision<br />
├─ audio_input<br />
├─ tool_calling<br />
├─ structured_output<br />
├─ multilingual<br />
└─ data_dependency<br />
├─ NONE<br />
├─ CACHE_ALLOWED<br />
├─ LIVE_NON_BLOCKING<br />
└─ LIVE_ANSWER_DEPENDENT<br />
3. TASK_TYPE / COMPLEXITY<br />
4. QUALITY_HISTORY<br />
5. LATENCY<br />
6. COST<br />
7. FALLBACK</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Sémantique des valeurs<br />
</strong>NONE : aucune donnée opérationnelle live requise. CACHE_ALLOWED : réponse stable pouvant utiliser un cache validé. LIVE_NON_BLOCKING : enrichissement live utile mais non nécessaire à la première réponse utile. LIVE_ANSWER_DEPENDENT : la réponse métier factuelle dépend d’une source live et ne peut pas être finalisée sans elle.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 4.5 Risque dynamique, cache bypass et contrat de latence métier

RISK_CLASS est déterminé en premier sur l’intention et le contexte disponibles, conformément au routeur v1.2. Il ne devient toutefois jamais un état figé : si la réponse d’un système live apporte une information susceptible de modifier le risque, le Risk Preflight est réévalué avant restitution de cette information ou exécution de l’action.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>User intent<br />
↓<br />
Initial Risk Preflight<br />
↓<br />
REQUIRED_CAPABILITIES.data_dependency<br />
↓<br />
MCP / CRM / operational source<br />
↓<br />
Live result received<br />
↓<br />
Risk Preflight RE-EVALUATION (when live data can affect risk)<br />
↓<br />
Policy / Tool / Output Gate<br />
↓<br />
Business response</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>LIVE_ANSWER_DEPENDENT = Semantic Cache BYPASS<br />
</strong>Un résultat LIVE_ANSWER_DEPENDENT doit déclencher une lecture de la source live. Le Semantic Answer Cache est contourné structurellement. Un éventuel cache technique connecteur à très courte durée reste une optimisation d’infrastructure et ne peut jamais être compté comme Semantic Cache HIT ni être présenté comme preuve de fraîcheur métier.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Deux métriques distinctes sont obligatoires : TTFA mesure la première réaction audible ; TIME_TO_BUSINESS_ANSWER mesure la première information métier factuelle réellement disponible. Pour LIVE_ANSWER_DEPENDENT, TIME_TO_BUSINESS_ANSWER inclut le lookup MCP/CRM, la réévaluation éventuelle du Risk Preflight et les Policy/Tool/Output Gates requis avant restitution.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>TTFA = first_audio_actually_played - end_of_user_speech<br />
<br />
TIME_TO_BUSINESS_ANSWER =<br />
first_factually_useful_live_business_answer<br />
- end_of_user_speech<br />
<br />
Inclut, selon le cas :<br />
MCP lookup + live response + second Risk Preflight + Policy/Tool/Output Gate</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Le message conversationnel « Je vérifie votre commande » peut satisfaire le TTFA, mais ne satisfait jamais TIME_TO_BUSINESS_ANSWER.

# 5. Interaction Intelligence Memory

Cette couche analyse l’historique d’utilisation pour apprendre non pas de nouvelles vérités métier, mais quelles connaissances, intentions et contextes sont les plus sollicités.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Conversation Event Store<br />
↓<br />
PII minimization / redaction<br />
↓<br />
Intent &amp; context extraction<br />
↓<br />
Semantic clustering<br />
↓<br />
Frequency / trend analysis<br />
↓<br />
Interaction Intelligence Memory</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 5.1 Écriture automatique autorisée

- Intentions récurrentes.

- Questions canoniques et formulations équivalentes.

- Fréquences 7j / 30j / période configurable.

- Tendances montantes / descendantes.

- Langue / locale / contexte d’interaction.

- Source nécessaire pour répondre : cache, RAG, MCP/CRM, outil ou escalade.

- Knowledge gaps et questions mal couvertes comme candidats d’amélioration.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Limite<br />
</strong>Cette couche peut être mise à jour automatiquement car elle décrit ce qui est observé. Elle ne peut pas transformer automatiquement une ancienne réponse du LLM en vérité métier.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 5.2 Optimisation de coût et de latence

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Question<br />
↓<br />
Risk + freshness check<br />
↓<br />
Semantic Cache<br />
├─ SAFE HIT → réponse validée<br />
└─ MISS<br />
↓<br />
FAQ / RAG ciblé<br />
├─ HIT → réponse<br />
└─ MISS<br />
↓<br />
RAG complet + LLM</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

- FAQ générale stable : cache sémantique fortement recommandé.

- Information commerciale semi-stable : cache versionné + TTL / invalidation.

- CRM / commande / rendez-vous : lecture live depuis le système source. Si data_dependency = LIVE_ANSWER_DEPENDENT, le Semantic Answer Cache est systématiquement BYPASS.

- Rx / clinique / conseil sensible : pas de réponse finale recyclée automatiquement.

- Réponses vocales stables : cache TTS/audio possible si texte, locale, voice_id et version de contenu correspondent.

## 5.3 Schéma minimal d’une entrée optimisée

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>cache_key<br />
intent_id<br />
canonical_question<br />
locale<br />
validated_answer<br />
risk_class<br />
source_refs<br />
rag_version<br />
policy_version<br />
catalog_version<br />
created_at<br />
expires_at<br />
last_verified_at<br />
hit_count</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 6. Reliability Intelligence

Reliability Intelligence observe les logs, traces et métriques afin de détecter les dégradations et anomalies avant qu’elles ne deviennent des incidents visibles.

- TTFA / stt latency / llm TTFT / TTS first chunk / audio first playback.

- Erreurs, timeouts, retries, fallback rate, circuit-breaker events.

- Coût par tour / session, tokens et dérive de coût.

- Cache hit rate et taux de retrieval miss.

- Santé STT/TTS/LLM/MCP/CRM et erreurs par provider.

- Anomalies de locale, qualité ou stabilité par version.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Logs / traces / metrics<br />
↓<br />
Analyse automatique<br />
↓<br />
Anomalie / tendance<br />
↓<br />
Diagnostic probable + recommandation<br />
↓<br />
Alerte / ticket<br />
↓<br />
HUMAN GATE<br />
↓<br />
Modification de production</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Règle d’action<br />
</strong>L’analyse et l’alerte peuvent être automatiques. Une correction qui modifie la production reste human-gated tant qu’un contrat de remédiation automatisée séparé n’a pas été validé.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 7. Apprentissage continu gouverné

| **Mode**                           | **Autorisé**                                                                               | **Interdit / gate**                                    |
|------------------------------------|--------------------------------------------------------------------------------------------|--------------------------------------------------------|
| Online system learning             | Mémoire d’interactions, cache, retrieval ciblé, statistiques, routing fondé sur résultats. | Ne modifie pas les poids du LLM.                       |
| Offline model improvement          | Dataset anonymisé/validé, fine-tuning éventuel, benchmark, A/B, versioning.                | Jamais déployé sans évaluation et approbation.         |
| Direct self-training in production | Aucun.                                                                                     | Interdit : conversation → poids modifiés → production. |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Intention<br />
</strong>Le système apprend surtout ce qu’il doit retrouver rapidement, pas ce qui devient vrai. La connaissance métier reste gouvernée par ses sources de vérité.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 8. Jev — statut de recherche inchangé

| **Attribut**             | **Statut v1.5**                                                  |
|--------------------------|------------------------------------------------------------------|
| Rôle                     | Research Candidate for Bounded Semantic Decision Tasks           |
| P0                       | NOT PART OF P0                                                   |
| Engagement architectural | NOT COMMITTED                                                    |
| Sécurité / clinique      | NO SAFETY AUTHORITY / NO CLINICAL AUTHORITY                      |
| Prérequis                | JEV LAB vérifié avant tout shadow mode Humanoïde Optique         |
| Autorité finale          | Hard Policy Engine / règles déterministes / human gate selon cas |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>RAG Retriever<br />
↓<br />
Reranker<br />
↓<br />
Evidence Sufficiency Gate<br />
↓<br />
Targeted Evidence Pack<br />
↓<br />
Jev (candidate semantic judgment)<br />
↓<br />
Decision Envelope<br />
↓<br />
Hard Policy Engine<br />
↓<br />
ALLOW / HUMAN_REVIEW / BLOCK</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

JEV_CONTEXT_LIMIT = 32K tokens pour state + longest question / 64K tokens au total — VERIFIED dans le dossier projet (cross-check TypeSafe API + documentation écosystème). Cette capacité ne change pas l’architecture : le système ne doit pas envoyer le corpus RAG entier ; retrieval ciblé, provenance et suffisance de preuve restent obligatoires.

# 9. P-1 / P0 — contrat inchangé

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>P0 LOCKED<br />
La v1.5 ne modifie ni le scope, ni les milestones, ni la Definition of Done du Master Execution Prompt P-1/P0 v1.1 LOCKED.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>TRACK A — P-1 FIELD VALIDATION<br />
Human / business owned<br />
│<br />
├───────────────┐<br />
│ │<br />
TRACK B — P0 TECHNICAL │<br />
Core voice + guards │<br />
+ providers + metrics │<br />
│ │<br />
└──────┬────────┘<br />
↓<br />
P-1 PASSED + P0 VERIFIED<br />
↓<br />
P1</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

- P0 peut avancer alors que P-1 est OPEN.

- P1 ne démarre pas sans validation humaine explicite de P-1.

- P0ScopeGuard demeure obligatoire.

- TTFA cible ≤ 1,5 s reste une cible à prouver, pas une promesse.

- N \< 20 = INDICATIVE ; N ≥ 20 = MEASURED pour les distributions par scénario.

- audio_first_playback_ms reste la métrique de vérité côté utilisateur.

# 10. Roadmap consolidée v1.5

| **Phase** | **Objet**                                                                       | **Statut / dépendance**                                               |
|-----------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| P-1       | Validation terrain                                                              | Track humain externe.                                                 |
| P0        | Core voix temps réel + instrumentation + Scope Guard                            | LOCKED execution contract.                                            |
| P1        | Skill + RAG + ModelGateway métier                                               | Après gates P-1 + P0.                                                 |
| P1bis     | Live Business Context MCP/CRM + Interaction Intelligence shadow                 | Read-first ; pas de réécriture P0.                                    |
| P2+       | Routing avancé, write tools contrôlés, reliability intelligence, autres modules | Après preuves et gates.                                               |
| JEV LAB   | Recherche indépendante Jev                                                      | Peut avancer isolément ; aucun effet automatique sur roadmap produit. |

Les phases historiques P2 à P8 de la baseline v1.2 restent applicables ; P1bis est un point d’insertion consolidé en v1.5, pas une renumérotation destructive de la roadmap.

# 11. Décisions verrouillées v1.5

Les décisions 1 à 32 proviennent de v1.2. Les décisions 33 à 43 correspondent aux verrous v1.3. Les décisions 44 à 52 correspondent aux ajouts v1.4. La v1.5 ajoute les décisions 53 à 58 ci-dessous.

33\. P-1 et P0 sont deux tracks parallèles ; P-1 reste un gate humain externe.

34\. Le Master Execution Prompt P-1/P0 v1.1 LOCKED gouverne l’exécution de P0.

35\. L’autonomie agressive standard est suspendue sur ce projet ; STOP + preuve après chaque milestone.

36\. P0ScopeGuard est obligatoire avant le LLM ; ALLOWLIST \> DENYLIST ; UNKNOWN → BLOCK.

37\. Provider A STT/TTS est provisoire et doit être challengé par Provider B sur les mêmes contrats.

38\. TTFA est mesuré jusqu’au premier audio réellement joué ; audio_first_playback_ms est distinct du premier chunk fournisseur.

39\. N \< 20 par scénario = INDICATIVE ; N ≥ 20 = MEASURED pour P50/P95, N toujours publié.

40\. Les cas gris commerciaux sont testés explicitement (S09) afin de mesurer le sur/sous-blocage du Scope Guard.

41\. Jev est un candidat de recherche pour jugements sémantiques bornés, sans autorité sécurité/clinique et hors P0.

42\. Toute expérimentation Jev passe d’abord par JEV LAB, puis éventuellement shadow mode ; Rules vs Jev vs LLM vs labels humains.

43\. Une décision Jev ne peut jamais autoriser seule une action YELLOW/RED ; Hard Policy Engine et gates restent souverains.

44\. L’Humanoïde doit pouvoir accéder au CRM et aux systèmes opérationnels comme Live Business Context via Tool Gateway / MCP.

45\. RAG Knowledge et Live Business Context sont distincts : le RAG porte la connaissance métier ; MCP/CRM porte l’état opérationnel vivant.

46\. Le Brain appelle des capacités MCP stables ; les adapters encapsulent CRM, POS/OMS, rendez-vous et autres systèmes.

47\. READ et WRITE sont séparés ; les écritures exigent permissions, audit, idempotence et confirmations adaptées au risque.

48\. Un Conversation Event Store supporte l’analyse d’usage sous règles de minimisation, rétention et confidentialité.

49\. Interaction Intelligence Memory peut s’auto-mettre à jour avec questions, intentions, contextes, fréquences et tendances.

50\. Interaction Intelligence Memory n’est pas une source de vérité métier et ne peut promouvoir automatiquement une ancienne réponse LLM en connaissance validée.

51\. L’optimisation suit Semantic Cache → FAQ/RAG ciblé → RAG complet + LLM, avec cache audio/TTS possible pour contenu stable et validé.

52\. Reliability Intelligence analyse automatiquement la télémétrie, mais toute modification de production reste human-gated ; l’apprentissage continu online ne modifie pas les poids du LLM.

53\. JEV_CONTEXT_LIMIT = 32K tokens pour state + longest question / 64K tokens total — VERIFIED ; le statut de Jev reste Research Candidate, sans autorité sécurité/clinique et hors P0.

54\. data_dependency est une sous-dimension de REQUIRED_CAPABILITIES du Task/Risk Router existant ; valeurs verrouillées : NONE, CACHE_ALLOWED, LIVE_NON_BLOCKING, LIVE_ANSWER_DEPENDENT.

55\. LIVE_ANSWER_DEPENDENT contourne structurellement le Semantic Answer Cache et exige une lecture de la source live ; un cache technique connecteur ne compte pas comme Semantic Cache HIT.

56\. RISK_CLASS n’est jamais irréversible : une donnée live susceptible de modifier le risque déclenche une réévaluation du Risk Preflight avant restitution ou action.

57\. TTFA et TIME_TO_BUSINESS_ANSWER sont deux métriques distinctes ; pour LIVE_ANSWER_DEPENDENT, TIME_TO_BUSINESS_ANSWER inclut lookup live + réévaluation du risque + gates nécessaires avant la première information métier factuelle.

58\. Les budgets exacts P50/P95, timeouts, retries, fallbacks, TTL/freshness et seuils associés à P1bis restent à benchmarker avant d’être figés comme SLA.

# 12. Éléments à décider / benchmarker plus tard — v1.5

Les principes structurants sont verrouillés ; les valeurs ci-dessous restent ouvertes tant qu’elles ne sont pas prouvées par mesure réelle.

- budgets P50/P95 et seuils d’acceptation par opération MCP/CRM ;

- timeout, retry et fallback par connector / système opérationnel ;

- classification opérationnelle exacte des intentions LIVE_NON_BLOCKING vs LIVE_ANSWER_DEPENDENT dans le jeu de tests terrain ;

- TTL / freshness policy pour CACHE_ALLOWED et éventuels caches techniques connecteurs ;

- seuils du Semantic Cache et critères de similarité sémantique ;

- rétention / pseudonymisation / agrégation de l’Interaction Intelligence Memory ;

- seuils d’alerte et horizons de détection de Reliability Intelligence ;

- budget TIME_TO_BUSINESS_ANSWER par type de workflow live, incluant explicitement le second Risk Preflight et les gates post-lookup ;

- politique finale de confirmation et d’idempotence pour les écritures MCP.

# 13. Definition of Done — extensions v1.5

- Le P0 v1.1 LOCKED reste inchangé et peut être vérifié indépendamment de MCP/CRM et Interaction Intelligence.

- Le Brain n’a aucun couplage direct critique à un CRM concret.

- Au moins un adapter MCP read-only est prouvé sur un système opérationnel réel ou sandbox avant de déclarer P1bis VERIFIED.

- Les tool calls opérationnels sont authentifiés, audités et corrélés par trace_id.

- Aucune réponse périssable (commande, rendez-vous, disponibilité) n’est servie comme fait live depuis un cache obsolète.

- Interaction Intelligence distingue clairement observation d’usage et connaissance validée.

- Toute entrée de Semantic Cache possède provenance/version/freshness/risk metadata.

- Les gains de tokens, coût et latence sont mesurés avant/après ; pas seulement supposés.

- Reliability Intelligence peut produire alertes/recommandations sans modifier automatiquement la production.

- Les données conversationnelles sont minimisées/pseudonymisées selon la politique de confidentialité applicable.

- Les quatre valeurs data_dependency sont testées individuellement : NONE, CACHE_ALLOWED, LIVE_NON_BLOCKING, LIVE_ANSWER_DEPENDENT.

- LIVE_ANSWER_DEPENDENT bypass le Semantic Answer Cache et une lecture de source live est prouvée par trace.

- La réévaluation du Risk Preflight après donnée live est testée sur au moins un cas où la donnée peut faire évoluer la classe de risque.

- TTFA et TIME_TO_BUSINESS_ANSWER sont mesurés séparément et corrélés au même trace_id.

- Pour LIVE_ANSWER_DEPENDENT, TIME_TO_BUSINESS_ANSWER inclut explicitement le second Risk Preflight et les Policy/Tool/Output Gates post-lookup.

- La latence MCP P50/P95, les timeouts et les fallbacks sont mesurés ; aucun SLA n’est déclaré avant benchmark suffisant.

- Aucune donnée périssable n’est présentée comme live si sa fraîcheur ne peut pas être prouvée.

# 14. Principe final v1.5

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Séparation des responsabilités<br />
</strong>Le RAG explique le métier. MCP expose l’état réel du magasin et du client. Interaction Intelligence apprend ce que les utilisateurs demandent. Reliability Intelligence observe comment le système se comporte. Le Task/Risk Router détermine aussi la dépendance aux données live via REQUIRED_CAPABILITIES.data_dependency. Le risque peut être réévalué après réception du monde réel. Le LLM raisonne et dialogue. Les règles déterministes et le Hard Policy Engine imposent les limites. Les humains conservent les gates d’autorité et de modification de production.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe A — Baseline canonique v1.2 préservée

Le texte ci-dessous est conservé comme baseline de référence. En cas de contradiction, les décisions cumulatives v1.3, v1.4 et v1.5 du corps principal prévalent explicitement.

HUMANOÏDE OPTIQUE — HANDOFF

GLOBAL

Version : v1.2

\*\*Date : \*\* Sep 25, 2026

Rédigé avec : @Zakaria Belmeddah

Statut : VISION + ARCHITECTURE + GOUVERNANCE PRODUIT — AUCUNE

IMPLÉMENTATION DÉCLENCHÉE

Remplace : HUMANOIDE_OPTIQUE_HANDOFF_GLOBAL_v1.1_2026-09-25

0bis. Changelog v1.1 → v1.2

La v1.1 posait la structure globale (Brain / Skill / RAG / Voix / Avatar / OpenRouter /

périmètre professionnel). La revue de v1.1 a identifié quatre points qui restaient au niveau

du principe et devaient devenir des mécanismes vérifiables. La v1.2 verrouille sept

décisions supplémentaires :

1\. TTFA SLO — Time-to-First-Audible-Response mesuré P50/P95, cible initiale ≤ 1,5 s à

prouver sur le vrai pipeline.

2\. Pipeline concurrent obligatoire — les étages ne s'additionnent pas en cascade

séquentielle ; ils se chevauchent.

3\. Exécution spéculative annulable, sans effets de bord — on peut précharger/préparer

sur une intention probable, jamais agir dessus.

4\. Hard Policy Engine hors LLM — le LLM propose une enveloppe structurée, le serveur

décide (ALLOW / HUMAN_REVIEW / BLOCK).

5\. Risk Preflight multimodal — le risque est évalué sur texte + vision + document détecté

\+ outil, pas seulement sur l'intention verbale.

6\. Adaptive Vision Sampling — fréquence de vision pilotée par benchmark et

événements, jamais une analyse vidéo continue à taux fixe.

7\. Task/Risk Router benchmarké — ordre de décision : risque → capacités requises →

complexité → qualité → latence → coût.

Ces sept décisions ne remplacent aucune décision de la v1.1 ; elles la complètent. La

structure des sections 1 à 43 de la v1.1 est conservée.

Humanoïde Optique — Handoﬀ Global v1.2

1\. Résumé exécutif

Le produit est un Humanoïde Optique multimodal en magasin, capable de voir, entendre,

comprendre, dialoguer, rechercher dans sa base de connaissances, expliquer, conseiller

dans son périmètre, adapter son interaction à la personne devant lui et transmettre son

visage/sa voix via un avatar temps réel.

Le système repose sur cinq couches indépendantes :

1\. Entrées locales : caméra + microphone.

2\. Brain : LLM multimodal + Skill métier + RAG.

3\. Voix : STT + TTS sous notre contrôle.

4\. Incarnation : HeyGen LiveAvatar pour l'avatar et le lip-sync.

5\. Configuration universelle : modèle IA, avatar, voix, langue, dialecte, persona et profil

de dialogue configurables.

À ces cinq couches, la v1.2 ajoute une exigence transversale : le système doit prouver

qu'il fonctionne en conditions réelles, pas seulement que son architecture est cohérente

sur papier. C'est le sens des sept décisions du changelog ci-dessus — latence, sécurité,

vision — qui deviennent des contrats vérifiables plutôt que des intentions.

Principe central :

Le cerveau, la connaissance, la voix et la logique métier restent chez nous. Les

fournisseurs externes sont des adaptateurs interchangeables.

2\. Positionnement produit

Le produit n'est pas :

un opticien autonome ;

un optométriste virtuel ;

un système de diagnostic ;

un système de prescription ;

un centre d'appels ;

une extension de Z12 Voice ;

un avatar HeyGen avec logique métier embarquée.

Le produit est :

Humanoïde Optique — Handoﬀ Global v1.2

un copilote humanoïde spécialisé en optique, physiquement présent dans le

magasin, qui augmente le travail de l'opticien et améliore l'expérience client.

3\. Environnement d'utilisation

L'interaction est locale, en magasin. Le client parle, montre, regarde, réagit et interagit

avec l'avatar. Aucune dépendance à la téléphonie, au SIP, à un numéro de téléphone, au

transfert d'appel, à un call center ou à Z12 Voice : Z12 Voice est hors runtime de cette

solution.

4\. Architecture globale cible

La v1.1 décrivait un pipeline linéaire (micro/caméra → STT/vision → Model Gateway →

OpenRouter → LLM → Skill/RAG/outils → texte → TTS → HeyGen). Ce pipeline reste juste

fonctionnellement, mais la v1.2 précise qu'il ne doit pas s'exécuter en cascade purement

séquentielle — voir section 8 (Architecture de latence) pour le diagramme concurrent qui

remplace cette lecture linéaire en production.

5\. Le Brain : Skill + RAG + Modèle

Le Brain n'est pas l'avatar. Il contient : LLM multimodal, Skill métier, RAG, règles métier,

garde-fous, outils, policies, état conversationnel.

Skill définit : rôle de l'agent, mission, style de comportement, limites, règles de conseil,

règles commerciales, règles SAV, garde-fous professionnels, comportement en cas

d'incertitude, gestion de satisfaction/insatisfaction, logique de recours au RAG, logique

d'utilisation des outils.

RAG : chaque agent garde son propre corpus (ex. Agent Opticien → RAG Optique,

procédures magasin, produits, FAQ, documentation métier, règles/politiques validées). Le

RAG reste isolé du modèle choisi — changer de modèle n'oblige pas à reconstruire le RAG.

6\. OpenRouter : couche de routage IA

OpenRouter est le provider principal de modèles IA, mais ne doit pas devenir notre

architecture métier. Notre code appelle ModelGateway.generate(...), jamais

directement un SDK fournisseur (GeminiSDK, ClaudeSDK, OpenAISDK). Le ModelGateway

Humanoïde Optique — Handoﬀ Global v1.2

traduit ensuite la demande vers OpenRouter.

7\. Une clé OpenRouter, plusieurs agents, plusieurs modèles

Décision verrouillée : une seule clé OpenRouter côté serveur. Chaque agent possède son

propre model_id :

{

"agent_id": "opticien_conseil",

"provider": "openrouter",

"model_id": "google/gemini-...",

"temperature": 0.25,

"skill_id": "skill_opticien",

"rag_id": "rag_optique",

"persona_id": "persona_fr_ca"

}

8\. Task/Risk Router — taxonomie déterministe (mise à jour v1.2)

La v1.1 proposait un routage coût/performance simple (tâche simple → modèle

économique, tâche complexe → modèle premium). La v1.2 remplace cette lecture par une

taxonomie déterministe, décidée sans appel LLM supplémentaire pour éviter d'ajouter

coût, latence et variabilité à l'étape censée les réduire :

T0 — trivial FAQ, reformulation, classification → cheap

T1 — standard conversation, recherche simple → standard

T2 — advanced RAG multi-source, outils, vision → capable

model

T3 — sensitive Rx, ambiguïté professionnelle, policy-sensitive →

validated premium + human gate

Et surtout, l'ordre de décision est verrouillé :

1\. RISK CLASS

2\. REQUIRED CAPABILITIES

3\. TASK TYPE / COMPLEXITY

4\. QUALITY HISTORY

5\. LATENCY

6\. COST

7\. FALLBACK

Humanoïde Optique — Handoﬀ Global v1.2

Le coût vient après la compatibilité et le risque — jamais l'inverse. Ce routeur doit lui-

même être benchmarké : il n'est pas un détail d'OpenRouter, c'est un sous-produit à part

entière (voir section 25, Éléments à décider plus tard).

9\. Capability Registry

Chaque modèle possède un profil de capacités :

{

"model_id": "provider/model",

"capabilities": {

"text": true,

"vision": true,

"audio_input": false,

"tool_calling": true,

"structured_output": true,

"multilingual": true

},

"cost_class": "medium",

"latency_class": "fast"

}

Besoin agent → capacités requises → modèles compatibles → coût/latence/qualité →

modèle choisi.

Règle de sécurité : un modèle gratuit ou très économique n'est pas automatiquement

utilisable partout. FAQ générale et classification non critique → cheap model autorisé.

Analyse professionnelle importante → modèle validé. OCR Rx / raisonnement sensible →

modèle validé + contrôle humain (renforcé en v1.2 par le Policy Engine, section 10).

10\. Découplage du SDK Gemini

Le GitHub réutilisé contient un couplage important au SDK Gemini. L'architecture cible

interdit que ce couplage reste dans le cœur.

À supprimer du core : dépendance directe métier à @google/genai, initialisation

GoogleGenAI() dans la logique centrale, appels directs ai.models.generateContent(),

modèles Gemini codés en dur, types vocaux limités aux voix Gemini.

À remplacer par : ModelGateway, TTSProvider, STTProvider, AvatarProvider,

VisionProvider.

Humanoïde Optique — Handoﬀ Global v1.2

11\. Ce qu'on conserve du GitHub existant

À conserver/adapter : UI, logique de configuration, plusieurs personas, plusieurs voix,

langues, dialectes, paramètres audio, Web Audio, visualiseur, cache audio, EQ, playback,

profils de tonalité, structures de voix/persona, données locales multilingues.

À généraliser : VoicePersona, DialectOption, AudioSettings, profils de tonalité,

configuration locale.

12\. Nouveaux adaptateurs fournisseurs

LLM / Vision → ModelGateway → OpenRouter

STT → STTProvider → provider sélectionné

TTS → TTSProvider → provider sélectionné

Avatar → AvatarProvider → HeyGen

Objectif : changer de fournisseur ne doit jamais imposer de réécrire le produit.

13\. STT

Le STT transforme la voix du client en texte lorsque le modèle utilisé n'exploite pas

directement l'audio. Le fournisseur reste configurable. Critères : latence, précision,

français canadien, anglais, arabe, dialectes, bruit magasin, coût. En v1.2, le STT doit

supporter un mode streaming — condition nécessaire au budget de latence de la section

8\.

14\. TTS — contrôle interne de la voix

La voix est générée par notre système, pas par HeyGen. Pipeline : LLM → réponse texte →

TTSProvider → audio streaming → speaker + HeyGen. Le TTS doit fonctionner en

streaming (démarrage sur les premiers tokens LLM, pas sur la réponse complète — voir

section 8).

15\. HeyGen — incarnation uniquement

HeyGen LiveAvatar est une couche de rendu : avatar, animation, lip-sync, présence

visuelle. HeyGen ne gère pas le Brain, le Skill, le RAG, le choix du modèle, le raisonnement,

les règles métier, ni le TTS principal.

Humanoïde Optique — Handoﬀ Global v1.2

Notre système pense et parle. HeyGen donne un visage à cette réponse.

16\. Persona Config

La persona est indépendante du Brain :

{

"persona_id": "opticien_female_fr_ca",

"avatar_provider": "heygen",

"avatar_id": "avatar_x",

"voice_id": "voice_y",

"gender_presentation": "female",

"locale": "fr-CA",

"dialogue_profile": "commercial_conseil",

"response_style": "court_clair_chaleureux",

"temperature": 0.3

}

17\. Profils de dialogue

Profils configurables : accueil, conseil, commercial, vente, upsell, cross-sell, SAV, plainte,

information, accompagnement pédagogique. Le profil influence le style, jamais la vérité

métier.

18\. Multilingue / multi-marché et Locale Pack

L'Humanoïde est une plateforme universelle (Québec → fr-CA, Canada anglophone → en-

CA, États-Unis → en-US, Maroc → ar-MA/Darija, France → fr-FR). La langue ne doit jamais

être codée en dur.

Humanoïde Optique — Handoﬀ Global v1.2

{

"locale": "ar-MA",

"language": "ar",

"dialect": "darija_marocaine",

"stt_profile": "darija",

"tts_voice": "female_moroccan",

"dialogue_profile": "commercial_conseil",

"avatar": "ugc_female"

}

19\. Architecture de latence (NOUVEAU v1.2)

Pour un humanoïde en face-à-face, la perception humaine ne pardonne pas une réponse

qui arrive après plusieurs secondes. Le KPI produit central devient :

Time-to-First-Audible-Response (TTFA)

Cible initiale : ≤ 1,5 s, mesurée en P50/P95, à prouver sur le vrai pipeline — jamais promise

comme garantie produit avant d'être validée en conditions réelles.

19.1 Budget par étage (indicatif, pas une garantie isolée)

Fin de parole détectée

↓

STT final cible \< 300–500 ms

↓

Routing + Policy cible \< 50–100 ms

↓

RAG / outils cible \< 300–700 ms

↓

Premier token LLM cible \< 300–700 ms

↓

TTS streaming démarrage \< 250–400 ms

↓

Premier audio audible

Ces chiffres additionnés dépassent 1,5 s dans le pire cas (~2,4 s) s'ils s'exécutent en

cascade. Le budget par étage n'est donc pas suffisant seul : il doit être combiné à un

chevauchement structurel entre étages (section 19.2).

Humanoïde Optique — Handoﬀ Global v1.2

19.2 Pipeline concurrent obligatoire

Les étages ne s'exécutent pas en cascade purement séquentielle. Architecture

concurrente verrouillée :

Audio entrant

│

├ ── STT streaming ───────────────┐

│ │

├ ── intention probable ──► RAG spéculatif

│ └── annulable

│

└── vision ──► risk preflight

│

▼

Policy Engine local

│

STT final ─────────── ┼ ──► LLM streaming

│ │

│ └──► TTS streaming

│ │

└──────────────► audio audible

Levier majeur : le streaming à chaque étage (STT streaming, réponse LLM incrémentale,

TTS démarré avant la fin de la génération complète, audio envoyé progressivement à

l'avatar) et le chevauchement du RAG/outils avec la fin du STT, pas après.

19.3 Exécution spéculative — annulable, sans effets de bord

Règle ferme : aucun outil à effet de bord ne s'exécute sur une intention seulement

probable. On peut précharger du RAG, classifier une intention ou préparer un contexte de

façon spéculative. On ne peut pas créer une commande, modifier un dossier ou

déclencher une action métier avant confirmation. Le chevauchement (19.2) doit donc être

:

spéculatif — démarré sur une hypothèse, pas une certitude ;

annulable — abandonné proprement si l'hypothèse s'avère fausse ;

sans effet de bord — aucune écriture, aucune action métier tant que l'intention n'est

pas confirmée par le STT final et validée par le Policy Engine.

Cette règle s'applique symétriquement au Risk Preflight (section 20) : la vision peut

déclencher une classification de risque de façon spéculative, jamais une action.

Humanoïde Optique — Handoﬀ Global v1.2

20\. Hard Policy Engine — Risk Preflight, Tool Gate, Output Gate

(NOUVEAU v1.2)

Le prompt ne doit jamais être le mécanisme de sécurité principal. Le Skill peut expliquer

les règles, mais l'enforcement doit être hors LLM :

User request

↓

Intent / Risk classification

↓

POLICY ENGINE

↓

LLM

↓

Structured output

↓

OUTPUT GATE

↓

ALLOW / HUMAN_REVIEW / BLOCK

Le modèle produit une enveloppe structurée, jamais uniquement du texte libre :

{

"action_type": "rx_explanation",

"risk_class": "YELLOW",

"requires_human_review": true,

"proposed_response": "...",

"tool_actions": \[\]

}

Le serveur — pas le modèle — décide si cette sortie peut réellement passer : le LLM

propose, le Policy Engine autorise.

20.1 Risk Preflight multimodal

La classification de risque en entrée ne peut pas se limiter au texte : un client peut

présenter une ordonnance papier à la caméra sans prononcer un mot. Si le Risk Preflight

n'observe que l'intention verbale, ce signal passe sous le radar jusqu'à ce que le LLM le

traite — trop tard si l'Output Gate est la seule protection en aval. L'entrée du Policy

Engine est donc multimodale :

Humanoïde Optique — Handoﬀ Global v1.2

{

"text_risk": "...",

"visual_risk": "...",

"document_detected": true,

"document_type": "possible_prescription",

"tool_risk": "...",

"effective_risk_class": "YELLOW"

}

Une ordonnance présentée silencieusement à la caméra peut ainsi déclencher YELLOW

avant même que le client dise quoi que ce soit. Le détecteur visuel reste volontairement

léger : il n'a pas besoin d'interpréter le contenu de l'ordonnance, seulement de reconnaître

qu'un document potentiellement clinique vient d'entrer dans la scène. Détection → gate ;

compréhension détaillée ensuite, dans le pipeline Rx OCR dédié (section 23).

20.2 Tool Gate et Output Gate

Deux points de contrôle distincts, hors LLM :

Tool Gate — bloque toute action à effet de bord (commande, modification de dossier,

déclenchement métier) tant que l'intention n'est pas confirmée et le risque évalué.

Lien direct avec la règle d'exécution spéculative (section 19.3).

Output Gate — évalue la réponse structurée produite par le LLM avant qu'elle

n'atteigne le TTS/l'avatar. Trois issues possibles : ALLOW (la réponse part telle quelle),

HUMAN_REVIEW (transmise à l'opticien avant diffusion, ou réponse d'attente le temps

de la validation), BLOCK (la réponse ne part jamais).

21\. Vision Runtime — Adaptive Vision Sampling (NOUVEAU v1.2)

Aucune fréquence de vision arbitraire n'est verrouillée dans ce document. «

Échantillonnage limité » (langage de la v1.1) est remplacé par un principe benchmarkable :

Adaptive Vision Sampling — fréquence déterminée par benchmark et événements.

Humanoïde Optique — Handoﬀ Global v1.2

21.1 Paliers événementiels (à benchmarker, pas à figer ici)

Idle → vision très faible / présence seulement

Conversation normale → cadence basse

Mouvement / objet présenté → burst temporaire

Document détecté → capture ciblée haute qualité

Rx workflow explicite → pipeline document dédié

On ne paie pas en permanence pour analyser la scène comme une vidéo continue. Un

cinquième principe transversal en découle :

Event-driven vision \> continuous multimodal inference.

Meilleur pour le coût, la latence, et la minimisation des données — en cohérence directe

avec la section 22 (Privacy).

21.2 Lien avec le Risk Preflight

Le palier « document détecté » est ce qui alimente le document_detected /

document_type du Risk Preflight multimodal (section 20.1). La détection reste légère à ce

stade — reconnaître qu'un document est présenté, pas le lire — et déclenche la bascule

vers le pipeline Rx OCR dédié (section 23) si nécessaire.

22\. Behavioral Interaction Adaptation

Cette fonction est IN SCOPE. Elle ne constitue PAS un diagnostic psychologique, une

analyse clinique, une catégorisation certaine d'émotion, ni un profilage de personnalité.

Elle sert uniquement à adapter l'interaction de l'agent aux signaux visibles, verbaux et

comportementaux de la personne devant lui.

22.1 Sources de signaux

Verbal : mots exprimant satisfaction, plainte, hésitation, répétition, insultes, ton agressif,

hausse de voix, réponse enthousiaste.

Visuel : sourire, grimace, recul, regard, mouvements, gestes, tension visible, changements

de posture, expressions faciales évidentes.

Micro-facial léger : contraction de bouche, petit mouvement de lèvres, clignement

inhabituel dans le contexte, micro-grimace, changement facial bref — observés comme

indices faibles, jamais comme preuve. Un micro-signal isolé ne déclenche jamais une

Humanoïde Optique — Handoﬀ Global v1.2

conclusion.

Note v1.2 : ces signaux visuels sont distincts du Risk Preflight visuel (section 20.1). Le

Risk Preflight détecte des objets/événements (un document présenté) pour

déclencher une classification de risque métier ; le Behavioral Interaction Adaptation

lit des signaux affectifs pour ajuster le ton et le rythme de l'interaction. Les deux

peuvent s'exécuter en parallèle sur le même flux caméra, mais alimentent des

décisions différentes — l'un le Policy Engine, l'autre le style de réponse.

22.2 Logique d'interprétation

SIGNAUX OBSERVABLES → CONTEXTE CONVERSATIONNEL → HYPOTHÈSE FAIBLE →

ADAPTATION DE L'INTERACTION

Jamais : micro-expression → émotion certaine → profil client.

22.3 Niveaux de confiance comportementale

signal faible isolé → ne rien changer

plusieurs signaux cohérents → adaptation légère

signaux forts + verbal cohérent → adaptation plus nette

déclaration explicite du client → la déclaration du client prévaut

22.4 Cas insatisfaction

Ralentir, poser une question, chercher le problème, reformuler, rassurer, éviter l'upsell,

proposer une autre option, transmettre à l'opticien si nécessaire.

« Je vois que cette proposition ne vous convient peut-être pas. Qu'est-ce qui vous

dérange le plus : la forme, le confort ou le style ? »

22.5 Cas satisfaction

Poursuivre positivement, confirmer le choix, proposer une option supplémentaire, ouvrir

un upsell ou cross-sell pertinent, ne jamais forcer.

« Cette monture semble vraiment vous plaire. Je peux aussi vous montrer une option

similaire avec un traitement supérieur si vous voulez comparer. »

Humanoïde Optique — Handoﬀ Global v1.2

22.6 Règle comportementale verrouillée

Le système observe pour mieux interagir, pas pour analyser psychologiquement la

personne.

En cas d'incertitude, comportement neutre.

23\. Périmètre professionnel

GREEN — automatisable : accueil, FAQ, produits, rendez-vous, informations générales,

recherche catalogue, entretien lunettes, collecte des préférences, suggestions

esthétiques, résumé.

YELLOW — supervision humaine : OCR ordonnance, extraction de valeurs, détection

d'incohérence, suggestion avancée de verres, mesures assistées, PD/centrage numérique,

recommandation professionnelle personnalisée.

RED — interdit à l'agent autonome : diagnostic, prescription, modification d'ordonnance,

décision clinique autonome, recommandation thérapeutique, substitution à

l'optométriste, validation professionnelle finale autonome.

Mise à jour v1.2 : en v1.1, le RED était une règle de comportement portée par le Skill.

En v1.2, le RED est appliqué techniquement par le Policy Engine et l'Output Gate

(section 20) — le Skill continue d'expliquer la règle au modèle, mais ce n'est plus le

seul mécanisme qui l'impose. Toute sortie taguée risk_class: RED (ou dont

l' action_type correspond à une catégorie RED) est bloquée côté serveur,

indépendamment de ce que le LLM a proposé.

Pipeline Rx OCR

image → extraction → structure JSON → confidence → validation déterministe →

comparaison avec original → validation opticien

Jamais : OCR → commande automatique sans contrôle.

Humanoïde Optique — Handoﬀ Global v1.2

Mise à jour v1.2 : l'entrée de ce pipeline est désormais déclenchée par le signal

document_detected / document_type: possible_prescription du Risk Preflight

(section 20.1) et par le palier « Document détecté » / « Rx workflow explicite » de

l'Adaptive Vision Sampling (section 21.1). Le Risk Preflight ne fait que détecter la

présence du document et lever le niveau de risque à YELLOW ; c'est ce pipeline Rx

OCR, distinct, qui fait l'extraction et la validation détaillées.

24\. Model / Persona / RAG indépendants

Chaque agent est composé de :

AgentConfig

├ ── model policy

├ ── Skill

├ ── RAG

├ ── Persona

├ ── Locale

├ ── TTS profile

└── tool permissions

Ainsi : même Skill + même RAG ≠ même modèle obligatoire ≠ même voix obligatoire ≠

même avatar obligatoire ≠ même langue obligatoire.

Humanoïde Optique — Handoﬀ Global v1.2

Exemple complet d'AgentConfig

{

"agent_id": "opticien_conseil_ma",

"model_policy": {

"provider": "openrouter",

"default_model": "model-standard",

"cheap_model": "model-low-cost",

"complex_model": "model-premium",

"vision_model": "model-multimodal",

"fallback_models": \["fallback-a", "fallback-b"\]

},

"skill_id": "skill_opticien",

"rag_id": "rag_optique_ma",

"persona_id": "persona_female_ma",

"locale_pack": "ar-MA",

"tts_profile": "voice_darija_female",

"behavioral_adaptation": true

}

Ajout v1.2 : ce schéma devra aussi porter, à terme, une référence à la politique de

risque (Policy Engine) et au profil d'échantillonnage vision applicables à l'agent — voir

section 26 (Éléments à décider plus tard).

25\. Coût et quotas par agent

La clé OpenRouter est commune, mais chaque agent doit avoir un budget, une limite

journalière, une limite par session, un coût moyen cible, une politique de modèle

économique, un plafond d'usage premium.

{

"daily_budget_usd": 5,

"max_session_cost_usd": 0.10,

"premium_model_allowed": true

}

Humanoïde Optique — Handoﬀ Global v1.2

26\. Observabilité

Tracer au minimum : agent, modèle choisi, raison de routage, coût, latence, tokens, erreurs,

fallback, TTS, STT, session, qualité, comportement d'escalade.

Ajout v1.2 : s'ajoutent le TTFA mesuré par requête (voir section 19), la décision du

Policy Engine (ALLOW/HUMAN_REVIEW/BLOCK et raison), et le palier de vision

sampling actif au moment de l'interaction — nécessaires pour prouver, plutôt que

supposer, que la latence, la sécurité et le coût de la vision fonctionnent comme prévu.

27\. Règle sur la clé OpenRouter

Clé uniquement backend, jamais exposée au navigateur, logs sans secret, rotation

possible, quotas surveillés, rate limits, budget guards.

28\. Privacy / caméra / micro

Principes v1.1 (conservés) : collecte minimale, usage strictement nécessaire, pas de

reconnaissance faciale par défaut, pas de profil biométrique persistant, pas d'analyse

psychologique, traitement comportemental temporaire autant que possible,

consentement et information utilisateur adaptés au contexte, politique de conservation

explicite.

Vision Runtime & Retention Policy (mise à jour v1.2)

La v1.2 remplace ces principes par un mode par défaut concret :

Humanoïde Optique — Handoﬀ Global v1.2

Caméra active

↓

traitement temps réel

↓

échantillonnage limité (Adaptive Vision Sampling, section 21)

↓

aucun stockage vidéo par défaut

↓

aucun face embedding

↓

aucune reconnaissance d'identité

↓

buffer éphémère

↓

destruction automatique

Si un cas d'usage nécessite réellement une image persistante — par exemple une capture

volontaire pour une fonctionnalité donnée — cela devient une action distincte, avec

finalité explicite, consentement approprié et politique de conservation propre à cette

action, séparée du mode par défaut. Le système doit aussi afficher clairement quand la

caméra et le micro sont actifs.

Cette politique est cohérente avec le principe « event-driven vision \> continuous

multimodal inference » (section 21.1) : moins on capture en continu, moins il y a de

données à retenir, à sécuriser et à justifier.

29\. Architecture fournisseur-agnostique

APPLICATION

│

├ ── ModelGateway

├ ── STTProvider

├ ── TTSProvider

├ ── AvatarProvider

└── StorageProvider

Chaque adaptateur implémente un contrat stable.

Humanoïde Optique — Handoﬀ Global v1.2

30\. Plan de migration du GitHub existant

Étape A — inventaire : UI réutilisable, config, langues, personas, types, audio engine,

dépendances Gemini.

Étape B — extraction : sortir GoogleGenAI, modèles Gemini hardcodés, voix Gemini

hardcodées.

Étape C — abstraction : créer ModelGateway, TTSProvider, STTProvider,

AvatarProvider.

Étape D — migration OpenRouter : tout appel LLM métier passe par OpenRouter.

Étape E — tests : Gemini via OpenRouter, second provider, fallback, modèle économique,

modèle premium, multilingue, vision.

31\. Roadmap recommandée

P-1 — Validation terrain

↓

P0 — Core local text/voice

↓

P1 — RAG + Skill + Model Gateway

↓

P2 — Multi-model OpenRouter routing (Task/Risk Router, section 8)

↓

P3 — Persona / Locale / configurateur

↓

P4 — TTS provider + streaming

↓

P5 — HeyGen avatar / lip-sync

↓

P5bis — Latency SLO + pipeline concurrent (section 19) — à valider avant P6

↓

P6 — Behavioral Interaction Adaptation + Hard Policy Engine (section 20)

↓

P7 — Rx OCR supervisé + Vision Runtime (section 21)

↓

P8 — Digital fitting pilote

Humanoïde Optique — Handoﬀ Global v1.2

Ajout v1.2 : une étape P5bis est insérée — la preuve du TTFA sur le pipeline

concurrent doit être faite avant d'ajouter la couche d'adaptation comportementale et

le Policy Engine, pour ne pas empiler de la complexité de sécurité sur une latence non

validée.

32\. Success metrics

Précision réponses, taux grounding, qualité citation, coût moyen/session, latence, taux

fallback, satisfaction client, satisfaction opticien, taux de résolution, taux d'escalade

correcte, qualité STT par locale, qualité TTS par locale, réussite lip-sync, réduction du

temps opticien.

Ajout v1.2 :

TTFA P50/P95 par agent et par locale (section 19) ;

taux de décision du Policy Engine par catégorie (ALLOW / HUMAN_REVIEW /

BLOCK) et taux de faux positifs/négatifs sur le Risk Preflight (section 20) ;

coût vision par session et distribution des paliers d'Adaptive Vision Sampling

réellement observés vs. attendus (section 21).

33\. Décisions verrouillées (v1.2 — 32 décisions)

Décisions v1.1 (1–25, conservées telles quelles) :

1\. Humanoïde = solution locale en magasin.

2\. Z12 Voice = hors runtime.

3\. OpenRouter = provider principal de modèles.

4\. Une clé OpenRouter côté serveur.

5\. Modèle configurable par agent.

6\. Modèle configurable aussi par type de tâche.

7\. OpenRouter sert à optimiser coût/performance.

8\. Le SDK Gemini ne doit pas rester dans le cœur.

9\. Gemini peut rester utilisable via OpenRouter.

10\. ModelGateway = abstraction obligatoire.

11\. Skill = comportement métier.

Humanoïde Optique — Handoﬀ Global v1.2

12\. RAG = connaissance métier.

13\. Persona = incarnation indépendante.

14\. Locale = langue/dialecte indépendant.

15\. TTS = sous notre contrôle.

16\. HeyGen = avatar/lip-sync seulement.

17\. Le GitHub existant est réutilisé comme base de configuration.

18\. Les capacités utiles du repo sont conservées.

19\. Les dépendances fournisseurs sont découpées en adaptateurs.

20\. Behavioral Interaction Adaptation = IN SCOPE.

21\. Micro-facial = indice faible, jamais vérité.

22\. Déclaration explicite du client \> inférence visuelle.

23\. Satisfaction peut ouvrir un upsell prudent.

24\. Insatisfaction déclenche clarification, pas vente.

25\. Diagnostic/prescription autonome = hors scope.

Nouvelles décisions v1.2 (26–32) :

26\. TTFA SLO mesuré P50/P95, cible initiale ≤ 1,5 s à prouver.

27\. Pipeline concurrent obligatoire, pas une cascade purement séquentielle.

28\. Exécution spéculative annulable, sans effets de bord avant confirmation.

29\. Hard Policy Engine hors LLM, avec Tool Gate + Output Gate.

30\. Risk Preflight multimodal, texte + vision + type de document + outil.

31\. Adaptive Vision Sampling, fréquence issue de benchmarks et d'événements — event-

driven vision \> continuous multimodal inference.

32\. Task/Risk Router benchmarké, avec ordre de décision risque → capabilities →

complexity → quality → latency → cost.

34\. Éléments à décider plus tard (mise à jour v1.2)

fournisseur STT ;

fournisseur TTS ;

moteurs TTS par langue ;

voix par locale ;

stratégie de fallback ;

mode HeyGen final ;

Humanoïde Optique — Handoﬀ Global v1.2

protocole temps réel audio ;

seuils exacts par étage du budget de latence (section 19.1), à valider par mesure réelle

plutôt qu'à figer maintenant ;

paramètres exacts de l'Adaptive Vision Sampling (fréquence par palier, section 21.1), à

benchmarker ;

seuil cheap/standard/premium du Task/Risk Router (section 8), à benchmarker ;

schéma final de l'enveloppe structurée du Policy Engine (section 20) au-delà de

l'exemple donné ;

stockage/non-stockage vidéo pour les cas d'usage à capture volontaire (section 28) ;

UI finale du configurateur ;

schéma final AgentConfig (y compris la référence à la politique de risque et au profil

vision, section 24) ;

seuils de budget ;

critères de validation comportementale ;

politique détaillée de consentement.

(Retirés de la liste v1.1 car désormais couverts par une décision verrouillée : modèle exact

par agent reste ouvert, mais l'ordre et la logique de sélection sont désormais fixés —

section 8 ; stratégie automatique de routing également fixée en ordre, section 8 ;

fréquence d'échantillonnage vision passe de « à décider » à « principe fixé, valeurs à

benchmarker », section 21.)

35\. Definition of Done — architecture (mise à jour v1.2)

L'architecture est correctement implémentée lorsque :

Humanoïde Optique — Handoﬀ Global v1.2

1 clé OpenRouter

→ plusieurs agents

→ plusieurs modèles

→ routing par tâche (risque → capacités → complexité → qualité → latence →

coût)

→ Skill/RAG indépendants

→ TTS indépendant

→ HeyGen indépendant

→ langues/dialectes configurables

→ avatar configurable

→ comportement adaptatif

→ TTFA mesuré et publié (P50/P95)

→ pipeline concurrent avec exécution spéculative annulable, sans effet de

bord

→ Policy Engine hors LLM avec Risk Preflight multimodal, Tool Gate, Output

Gate

→ Adaptive Vision Sampling événementiel, sans stockage vidéo par défaut

→ coûts tracés

→ aucun SDK fournisseur dans le cœur

36\. Principe final

Le produit doit être construit autour de nos contrats, pas autour d'un fournisseur.

OpenRouter sert de couche d'accès et d'optimisation aux modèles. HeyGen sert de corps

visuel. Le TTS sert de voix. Le Skill définit le comportement. Le RAG fournit la

connaissance. Le LLM raisonne. La caméra et le micro connectent l'agent au monde réel.

Et la configuration permet au même moteur de devenir un agent différent selon le pays, la

langue, l'avatar, le métier et le budget.

En v1.2, un principe s'ajoute : le système doit le prouver, pas seulement l'architecturer. La

structure globale n'est plus le principal risque — les difficultés sérieuses sont désormais

de prouver que l'architecture fonctionne avec une latence naturelle, qu'elle reste dans

son périmètre métier, qu'elle traite la caméra proprement, et que le routage multi-modèles

économise réellement de l'argent sans détériorer la qualité.

Humanoïde Optique — Handoﬀ Global v1.2
