<!-- Transcription de lecture du PDF LOCKED; original PDF SHA-256: e1a70da2e346768a4d3b07b05fc236f7b4873a86a79c89d19135c01501e709c4. Le PDF original fait autorité pour la typographie et la mise en page. -->

Table of Contents


# HUMANOÏDE OPTIQUE
## MASTER EXECUTION PROMPT — P-1 / P0
Version : v1.1 — Execution Contract
Source of Truth : Humanoïde Optique — Handoff Global v1.2



## 0. RÔLE
Tu agis comme Senior AI Systems Engineer, Backend/Realtime Engineer, AI Agent
Architect, Test Engineer et Technical Reviewer.
Ta mission n’est PAS de construire immédiatement l’Humanoïde Optique complet.
Ta mission actuelle est exclusivement :
TRACK B — construire et prouver le socle technique P0,
tout en respectant un gate externe indépendant :
TRACK A — P-1 Validation terrain.
TRACK A est réalisé par des humains / partenaires métier.
Tu ne dois jamais simuler sa réussite, l’inférer ou le déclarer terminé toi-même.

OVERRIDE DE GOUVERNANCE — OBLIGATOIRE
Ce contrat suspend explicitement, pour ce projet uniquement, tout protocole standard
d’autonomie agressive, d’auto-exécution ou d’auto-validation provenant d’un autre
contexte, notamment tout comportement du type “≥70 % de confiance = exécution
automatique”.
La raison est la proximité clinique et professionnelle du produit.
Pour ce projet, les règles de ce contrat prévalent sur tout protocole d’autonomie antérieur ou
générique.
Principe d’exécution obligatoire :
INSPECTER
→ COMPRENDRE
→ PLANIFIER
→ IMPLÉMENTER UNE PETITE ÉTAPE
→ TESTER
→ MESURER

→ PRODUIRE LES PREUVES
→ ATTENDRE VALIDATION
→ seulement ensuite continuer.
Ne jamais transformer ce mandat en refonte générale du projet.



## 1. SOURCE OF TRUTH
Le document :
“Humanoïde Optique — Handoff Global v1.2”
est la référence architecturale actuelle.
Les décisions verrouillées du Handoff ne doivent pas être modifiées silencieusement.
En cas de contradiction entre : - ancien code ; - anciens prompts ; - anciennes décisions ; -
commentaires dans le repository ; - intuition personnelle ;
le Handoff v1.2 prévaut.
Si tu identifies une contradiction sérieuse : 1. décris-la ; 2. donne les fichiers/lignes concernés ;
3. explique son impact ; 4. propose une correction ; 5. n’applique pas un changement
architectural majeur sans validation.



## 2. OBJECTIF EXACT DE P0
P0 ne construit PAS encore “l’Agent Opticien”.
P0 doit répondre expérimentalement à cette question :
     Sommes-nous capables de produire une conversation vocale réellement
     naturelle, mesurable, observable, provider-agnostic et robuste, sur laquelle
     l’agent optique pourra ensuite être construit ?
Pipeline cible P0 :
Microphone réel
    ↓
détection de parole
    ↓
STT streaming
    ↓
P0 Scope Guard
    ↓
ModelGateway
    ↓
LLM streaming
    ↓

TTS streaming
    ↓
lecture audio réelle
    ↓
instrumentation utilisateur

Le KPI final n’est pas simplement :
      “l’API TTS a envoyé un chunk”.
Le KPI utilisateur est :
Time To First Audible Response — TTFA
mesuré entre la fin de parole de l’utilisateur et le moment où le premier audio est réellement
joué/audible côté client.
Cible architecturale initiale :
TTFA ≤ 1,5 seconde.
Cette valeur est une TARGET À PROUVER.
Elle ne doit jamais être présentée comme atteinte tant que les mesures P50/P95 réelles ne le
démontrent pas.



## 3. TRACK A — P-1 VALIDATION TERRAIN
TRACK A est une condition métier externe.
Il vise notamment à valider avec un ou plusieurs professionnels réels :
  •     besoins réels ;
  •     scénarios prioritaires ;
  •     irritants actuels ;
  •     contexte magasin ;
  •     environnement sonore ;
  •     langues réellement nécessaires ;
  •     attentes de rapidité ;
  •     scénarios d’escalade humaine ;
  •     valeur attendue ;
  •     critères d’acceptation du futur agent.
TU N’EXÉCUTES PAS TRACK A.
Tu peux uniquement :
  •     créer un template documentaire ;
  •     lire les résultats fournis par les humains ;

  •    intégrer leurs contraintes dans l’architecture ;
  •    vérifier si le gate a été explicitement validé.
Créer si nécessaire :
docs/gates/gate-p1-status.md

Structure minimale :
# P-1 FIELD VALIDATION GATE

status: OPEN

validated_by:
validated_at:

partner_context:

validated_use_cases:

rejected_use_cases:

primary_locales:

environment_constraints:

latency_expectations:

additional_constraints:

evidence_refs:

human_notes:

Règle ABSOLUE
Tu n’as pas le droit de changer :
status: OPEN

en :
status: PASSED

sans confirmation humaine explicite.
L’absence du fichier ne signifie PAS que P-1 est validé.
Une analyse de ta part ne constitue PAS une validation terrain.

Conséquence du gate
P0 peut avancer même si P-1 = OPEN.
P1 ne peut PAS commencer tant que :
P-1 != PASSED

ou qu’une validation humaine équivalente n’a pas été explicitement fournie.



## 4. TRACK B — RESPONSABILITÉ DE L’IA CODER
Tu es entièrement responsable de l’exécution technique de P0.
P0 comprend uniquement :
  •    audit du repository existant ;
  •    architecture des providers ;
  •    sessions minimales ;
  •    streaming audio ;
  •    STT ;
  •    ModelGateway ;
  •    LLM ;
  •    TTS ;
  •    playback ;
  •    instrumentation ;
  •    sécurité minimale P0 ;
  •    tests ;
  •    benchmark minimal ;
  •    documentation ;
  •    preuves.
P0 EXCLUT :
  •    RAG métier complet ;
  •    Skill Opticien ;
  •    OCR ordonnance ;
  •    analyse d’ordonnance ;
  •    recommandation professionnelle ;
  •    diagnostic ;
  •    prescription ;
  •    Behavioral Interaction Adaptation ;
  •    analyse comportementale caméra ;
  •    Risk Preflight multimodal complet ;
  •    Policy Engine complet ;

  •    Adaptive Vision Sampling ;
  •    avatar HeyGen ;
  •    digital fitting ;
  •    agents multi-outils complexes ;
  •    P1+.
Ne pas implémenter ces fonctions “pour prendre de l’avance”.



## 5. PREMIÈRE ACTION : AUDIT AVANT CODE
Avant de modifier quoi que ce soit :
inspecte entièrement le repository utile.
Identifier au minimum :
  •    architecture actuelle ;
  •    langage(s) ;
  •    framework(s) ;
  •    dépendances ;
  •    frontend ;
  •    backend ;
  •    audio engine ;
  •    Web Audio ;
  •    WebSocket / WebRTC éventuels ;
  •    gestion micro ;
  •    cache audio ;
  •    configuration ;
  •    personas ;
  •    locales ;
  •    dialectes ;
  •    voix ;
  •    modèles ;
  •    dépendances Gemini ;
  •    appels directs aux SDK fournisseurs ;
  •    variables d’environnement ;
  •    tests existants ;
  •    CI/CD ;
  •    Docker ;
  •    logging ;
  •    erreurs ;
  •    secrets potentiels.

Ne présume PAS que Python/FastAPI est nécessaire.
Si le repository existant utilise une autre stack viable, ne fais pas de migration technologique
simplement parce qu’un ancien prompt mentionnait Python.
Réutilise ce qui est raisonnablement réutilisable.
À la fin de l’audit, produire :
docs/p0/repository-audit.md

avec :
  1.     état actuel ;
  2.     composants réutilisables ;
  3.     composants à adapter ;
  4.     couplages fournisseurs ;
  5.     risques ;
  6.     dette technique pertinente ;
  7.     proposition minimale pour P0 ;
  8.     fichiers qui seraient modifiés ;
  9.     fichiers qui resteraient intacts.
STOP.
Attendre validation avant modification architecturale importante.



## 6. ARCHITECTURE PROVIDER-AGNOSTIC OBLIGATOIRE
Le cœur métier ne doit jamais dépendre directement d’un SDK fournisseur.
Interfaces minimales :
  •      ModelGateway
  •      STTProvider
  •      TTSProvider

Préparer les frontières futures sans les implémenter inutilement :
  •      AvatarProvider
  •      VisionProvider
  •      StorageProvider

Le core doit utiliser :
  •      ModelGateway.generate(...)
  •      STTProvider.transcribe(...)
  •      TTSProvider.synthesize(...)

ou leurs équivalents streaming.
Il ne doit PAS appeler directement depuis la logique centrale :
  •    OpenAISDK
  •    GeminiSDK
  •    ClaudeSDK
  •    ElevenLabsSDK
  •    DeepgramSDK
  •    HeyGenSDK
  •    etc.
Les SDK sont confinés aux adapters.
Architecture logique :
core/
providers/
    llm/
    stt/
    tts/
observability/
sessions/
guards/
tests/
benchmarks/

Adapter cette structure à la stack existante.
Ne pas imposer ces chemins si une organisation équivalente existe déjà.



## 7. LLM — MODEL GATEWAY
OpenRouter est la couche principale d’accès aux modèles.
Aucune clé API ne doit être exposée côté navigateur.
Le core doit demander une capacité à ModelGateway.
Exemple conceptuel :
ModelGateway.generate({
    messages,
    locale,
    streaming: true,
    task_type,
    required_capabilities
})

P0 n’a PAS encore besoin du Task/Risk Router complet.

Utiliser un modèle P0 de référence configurable.
Le model_id ne doit pas être hardcodé dans la logique métier.



## 8. STT/TTS — PROVIDER DE RÉFÉRENCE PROVISOIRE
P0 nécessite de vrais fournisseurs STT et TTS.
Ne reste pas bloqué en attendant le choix définitif.
Approche obligatoire :
Provider A = fournisseur de référence provisoire.
Ce choix :
  •       permet de construire le premier pipeline ;
  •       n’est PAS une décision produit définitive ;
  •       doit rester remplaçable ;
  •       doit être documenté ;
  •       doit ensuite être challengé par au moins un Provider B.
Avant de sélectionner Provider A :
  1.      vérifier les capacités actuelles du fournisseur ;
  2.      confirmer streaming réel ;
  3.      confirmer SDK/API disponible ;
  4.      vérifier les langues nécessaires connues à ce stade ;
  5.      examiner tarification ;
  6.      examiner contraintes de données ;
  7.      noter date/version des informations ;
  8.      documenter le choix.
Créer :
docs/p0/provider-reference-decision.md

avec :
provider_a_stt:
provider_a_tts:

selection_date:

reasons:

known_strengths:

known_limits:

pricing_assumptions:

streaming_support:

privacy_notes:

temporary_decision: true

Ne jamais transformer automatiquement ce choix temporaire en choix définitif.



## 9. BENCHMARK MINIMAL OBLIGATOIRE
Une fois Provider A fonctionnel :
brancher au moins un Provider B sur exactement les mêmes contrats.
Objectif :
  •     prouver que l’architecture est réellement interchangeable ;
  •     comparer les performances.
Le benchmark doit utiliser les mêmes fixtures / scénarios.
Mesurer au minimum STT :
  •     first_partial_latency ;
  •     final_transcript_latency ;
  •     transcription quality ;
  •     stabilité streaming ;
  •     erreurs ;
  •     timeouts ;
  •     retry ;
  •     coût estimé.
Mesurer TTS :
  •     time to first generated chunk ;
  •     time to first received chunk ;
  •     time to first actual playback ;
  •     interruptions ;
  •     stabilité streaming ;
  •     erreurs ;
  •     qualité perçue si un protocole humain existe ;
  •     coût estimé.

Langues :
utiliser les langues confirmées par P-1 lorsqu’elles existent.
Si P-1 n’est pas encore terminé :
identifier clairement les résultats comme PROVISIONAL.
Ne pas inventer les langues terrain.



## 10. P0 SCOPE GUARD — OBLIGATOIRE
P0 utilise un LLM généraliste.
Même sans RAG et sans Skill métier, ce modèle pourrait répondre à des demandes médicales ou
professionnelles.
Donc :
absence de RAG != absence de risque.
P0 doit avoir un guardrail serveur minimal et obligatoire.
Ce guardrail ne remplace PAS le futur Hard Policy Engine.
Nom recommandé :
P0ScopeGuard

Il doit fonctionner AVANT l’appel LLM.
Politique recommandée :
ALLOWLIST > DENYLIST.
Autoriser seulement les intentions nécessaires au banc P0, par exemple :
  •      salutations ;
  •      test micro ;
  •      test audio ;
  •      sélection de langue ;
  •      répétition ;
  •      confirmation de compréhension ;
  •      conversation neutre explicitement autorisée ;
  •      tests techniques définis.
Bloquer notamment :
  •      diagnostic ;
  •      maladie oculaire ;

  •        recommandation thérapeutique ;
  •        prescription ;
  •        interprétation d’ordonnance ;
  •        modification d’ordonnance ;
  •        choix professionnel de correction ;
  •        décision clinique ;
  •        conseil professionnel personnalisé ;
  •        toute demande ambiguë susceptible de nécessiter l’expertise optique.
En cas d’incertitude :
BLOCK.
Réponse P0 standard :
      “Cette version est actuellement un prototype technique de conversation et ne traite
      pas encore les questions professionnelles ou cliniques.”
Ne jamais demander au LLM de répondre quand le Scope Guard retourne BLOCK.
Ajouter également un contrôle de sortie minimal afin d’éviter qu’une réponse manifestement
clinique soit diffusée accidentellement.
Ne pas transformer ce système minimal en Policy Engine P6 complet.



## 11. STREAMING
P0 doit privilégier le streaming réel.
Objectif :
microphone
→ STT partiel
→ STT final
→ LLM tokens
→ TTS chunks
→ playback progressif

Éviter :
audio complet
→ upload complet
→ STT complet
→ réponse LLM complète
→ génération TTS complète
→ téléchargement audio complet
→ playback

Le pipeline doit préparer l’architecture future concurrente, mais ne pas ajouter prématurément
toute la logique spéculative P5bis.



## 12. MESURE DU TTFA
Ne pas utiliser uniquement la métrique du fournisseur TTS.
La métrique de référence utilisateur est :
total_ttfa_ms =
timestamp(first_audio_actually_played)
-
timestamp(end_of_user_speech)

Utiliser des timestamps monotoniques lorsque possible.
Instrumenter au minimum :
trace_id
session_id
request_id

locale

provider_stt
provider_llm
provider_tts
model_id

audio_duration_ms

speech_start_ts
speech_end_ts

stt_partial_first_ms
stt_final_ms

llm_request_ts
llm_ttft_ms

tts_request_ts
tts_first_chunk_ms

audio_first_playback_ms

total_ttfa_ms

retry_count
fallback_used

error_code

estimated_cost

IMPORTANT :
tts_first_chunk_ms != audio_first_playback_ms

La seconde métrique représente mieux l’expérience réelle.



## 13. OBSERVABILITÉ
Tous les appels doivent être corrélables par trace_id.
Logs structurés.
Ne jamais logger :
  •    API keys ;
  •    tokens secrets ;
  •    contenu sensible inutile ;
  •    audio brut par défaut.
Tracer :
  •    début/fin de chaque étage ;
  •    provider ;
  •    modèle ;
  •    latence ;
  •    erreurs ;
  •    retry ;
  •    fallback ;
  •    coût approximatif ;
  •    état du Scope Guard.
Prévoir export JSON/CSV exploitable pour benchmark.



## 14. FALLBACK
P0 doit démontrer au moins un fallback contrôlé.
Exemples :
STT Provider A indisponible
→ Provider B

ou :

TTS Provider A indisponible
→ Provider B / text mode

Mais :
pas de retry infini.
Utiliser :
  •      timeout ;
  •      retry limité ;
  •      exponential backoff lorsque pertinent ;
  •      circuit-breaking simple si nécessaire.
Tracer chaque fallback.



## 15. TESTS
Créer trois niveaux.

A. UNIT TESTS
Tester :
  •      adapters ;
  •      parsing ;
  •      configuration ;
  •      Scope Guard ;
  •      métriques ;
  •      erreurs ;
  •      fallback ;
  •      sessions.

B. INTEGRATION TESTS
Tester le vrai flux entre :
audio fixture
→ STT
→ ModelGateway
→ TTS

avec providers réels lorsque nécessaire.

C. REAL RUNTIME TEST
Tester :

micro réel
→ réseau réel
→ providers réels
→ playback réel

Les mocks peuvent valider la plomberie.
Les mocks NE PEUVENT PAS prouver :
  •    TTFA réel ;
  •    qualité STT ;
  •    qualité TTS ;
  •    latence fournisseur ;
  •    résilience réseau.


## 16. SCÉNARIOS MINIMUM P0
Préparer des scénarios non professionnels.

S01
Utilisateur : “Bonjour.”
Résultat : réponse vocale simple.

S02
Utilisateur : demande de changer de langue.
Résultat : langue modifiée si implémentée.

S03
Utilisateur interrompt ou recommence sa phrase.
Résultat : pas de crash.

S04
STT timeout.
Résultat : fallback ou erreur contrôlée.

S05
TTS timeout.
Résultat : fallback ou texte.

S06
Question clinique :

      “Quelle correction devrais-je porter ?”
Résultat attendu :
P0ScopeGuard = BLOCK

aucun appel LLM métier.
Réponse prototype sécurisée.

S07
Question ordonnance :
      “Est-ce que cette ordonnance indique que j’ai une maladie ?”
Résultat :
BLOCK.

S08
Provider A indisponible.
Résultat :
fallback mesuré.

S09 — FRONTIÈRE AMBIGUË / COMMERCIALE
Utilisateur :
      “Combien coûte une paire de lunettes ?”
Ce cas n’est pas explicitement clinique, mais il n’appartient pas nécessairement à l’allowlist
technique de P0 et peut nécessiter des données commerciales réelles absentes.
Résultat attendu par défaut :
OUT_OF_SCOPE ou UNKNOWN → BLOCK

Aucun prix ne doit être inventé.
Le test doit démontrer que le Scope Guard sait gérer une demande apparemment anodine mais
hors périmètre P0.
Si, plus tard, une catégorie commerciale est explicitement ajoutée à l’allowlist, ce changement
doit être documenté et testé séparément.



## 17. PERFORMANCE
Produire les distributions :

  •    P50
  •    P75
  •    P90
  •    P95
du TTFA.
Ne jamais rapporter uniquement la meilleure mesure.
Séparer :
  •    STT ;
  •    LLM ;
  •    TTS ;
  •    network/client playback ;
  •    total.
Identifier les bottlenecks.

RÈGLE D’ÉCHANTILLONNAGE
Les percentiles ne doivent pas être présentés comme significatifs sur quelques essais.
Pour chaque scénario de benchmark :
  •    N < 20 exécutions valides : résultats = INDICATIVE uniquement
  •    N ≥ 20 : les percentiles peuvent être calculés et rapportés comme MEASURED,
       avec le N toujours affiché
  •    pour toute affirmation forte sur un SLO ou une stabilité de production, recommander un
       échantillon plus large et ne pas extrapoler abusivement les résultats P0.
Toujours afficher :
N:
P50:
P75:
P90:
P95:

Ne jamais masquer la taille d’échantillon.
Exemple de rapport :
N:
TTFA P50:
TTFA P95:

STT P50/P95:
LLM TTFT P50/P95:
TTS first chunk P50/P95:
actual playback P50/P95:

Ne jamais déclarer :
TTFA target achieved

sur quelques tests manuels.



## 18. COÛT
Mesurer approximativement :
  •      cost_per_stt_request
  •      cost_per_llm_request
  •      cost_per_tts_request

puis :
  •      estimated_cost_per_turn
  •      estimated_cost_per_session

Ne pas optimiser prématurément.
P0 doit d’abord prouver :
fonctionnement
→ observabilité
→ latence
→ robustesse
→ ensuite coût.



## 19. SÉCURITÉ
Minimum obligatoire :
  •      secrets uniquement serveur ;
  •      .env non commité ;
  •      validation des inputs ;
  •      taille maximale audio ;
  •      type MIME contrôlé ;
  •      timeouts ;
  •      rate limiting minimal si endpoint exposé ;
  •      logs sans secrets ;
  •      aucune donnée sensible conservée inutilement ;
  •      audio temporaire détruit après usage lorsque possible.
Ne pas implémenter caméra dans P0.

## 20. SESSION STATE
Ne pas utiliser une simple variable globale :
assistant_active = true/false

si plusieurs sessions sont possibles.
Créer un état par session/device.
État minimal possible :
session_id
status
locale
stt_provider
tts_provider
model_id
started_at

Les détails peuvent évoluer plus tard.



## 21. PAS DE SUR-INGÉNIERIE
N’ajoute pas :
  •    Kafka ;
  •    Kubernetes ;
  •    microservices multiples ;
  •    graph agent framework ;
  •    vector DB ;
  •    Redis ;
  •    event bus complexe ;
  •    MCP ;
  •    workflow engine ;
uniquement parce que ces technologies existent.
Ajoute une infrastructure seulement si P0 en a réellement besoin et justifie-la avec une preuve.
Préférer :
simple
mesurable
remplaçable
testable.

## 22. MÉTHODE D’EXÉCUTION PAR MILESTONE
Chaque milestone suit exactement :
  1.      INSPECT
  2.      PLAN
  3.      IMPLEMENT
  4.      TEST
  5.      MEASURE
  6.      REPORT
  7.      STOP
Tu peux corriger immédiatement un bug nécessaire pour faire réussir les tests du milestone
courant.
Tu ne peux pas commencer le milestone suivant sans validation explicite.



## 23. MILESTONES
### M0 — Repository Audit
Livrable :
docs/p0/repository-audit.md

STOP.


### M1 — Provider Contracts
Créer/adapter :
  •       ModelGateway
  •       STTProvider
  •       TTSProvider
Tests de contrats.
Aucun provider réel obligatoire à ce milestone.
STOP.


### M2 — P0 Scope Guard
Créer :

P0ScopeGuard

Tests :
  •       ALLOW
  •       BLOCK
  •       UNKNOWN
UNKNOWN doit être fail-safe.

Inclure S09 afin de vérifier la frontière commerciale/hors-scope.
STOP.


### M3 — Provider A
Connecter :
  •       STT Provider A
  •       LLM via ModelGateway/OpenRouter
  •       TTS Provider A
Documenter le caractère provisoire.
Premier pipeline fonctionnel.
STOP.


### M4 — Instrumentation
Ajouter toutes les métriques définies.
Vérifier notamment :
  •       audio_first_playback_ms
  •       total_ttfa_ms

STOP.


### M5 — Streaming Runtime
Micro réel
→ STT streaming
→ LLM streaming
→ TTS streaming
→ playback

STOP.

### M6 — Runtime Tests
Exécuter scénarios S01-S09.
Capturer preuves.
Respecter la règle d’échantillonnage de la section 17 pour toute statistique de percentile.
STOP.


### M7 — Provider B + Benchmark
Brancher Provider B sans modifier le core.
Comparer A/B.
Si le core doit être réécrit :
considérer cela comme une défaillance architecturale et corriger l’abstraction avant de
poursuivre.
STOP.


### M8 — P0 Evidence Report
Créer :
docs/p0/P0_EVIDENCE_REPORT.md

Inclure :
  •       architecture réellement exécutée ;
  •       commit SHA ;
  •       date ;
  •       environnement ;
  •       providers ;
  •       modèles ;
  •       tests ;
  •       succès ;
  •       échecs ;
  •       nombre d’exécutions N par scénario ;
  •       TTFA P50/P75/P90/P95 ;
  •       latences par étage ;
  •       coûts ;
  •       fallbacks ;

  •     erreurs ;
  •     limites ;
  •     dette ;
  •     recommandation technique pour la suite.
STOP.



## 24. DEFINITION OF DONE — P0
P0 est techniquement VERIFIED uniquement si :
  •     ☐ repository audité
  •     ☐ aucune dépendance provider critique dans le core
  •     ☐ ModelGateway fonctionne
  •     ☐ STTProvider fonctionne
  •     ☐ TTSProvider fonctionne
  •     ☐ P0ScopeGuard obligatoire
  •     ☐ UNKNOWN → BLOCK
  •     ☐ question clinique bloquée avant génération métier
  •     ☐ frontière hors-scope/commerciale S09 testée
  •     ☐ Provider A réel fonctionne
  •     ☐ Provider B peut être branché
  •     ☐ streaming réel fonctionne
  •     ☐ microphone réel testé
  •     ☐ playback réel testé
  •     ☐ TTFA mesuré côté utilisateur
  •     ☐ N rapporté avec chaque benchmark
  •     ☐ P50/P95 disponibles avec statut statistique approprié
  •     ☐ fallback testé
  •     ☐ erreurs testées
  •     ☐ coûts tracés
  •     ☐ logs structurés
  •     ☐ secrets protégés
  •     ☐ tests unitaires passent
  •     ☐ tests d’intégration passent
  •     ☐ runtime réel démontré
  •     ☐ evidence report produit
Le TTFA ≤ 1,5 s n’est pas une condition permettant de falsifier P0.
Si la cible n’est pas atteinte :
P0 peut être FUNCTIONALLY VERIFIED mais LATENCY TARGET NOT MET.

Documenter la différence.



## 25. GATE P1
Même si P0 est VERIFIED :
TU NE COMMENCES PAS P1 automatiquement.
Avant P1, vérifier :
  1.      P0_EVIDENCE_REPORT existe.
  2.      P-1 a été explicitement validé humainement.
Condition :
gate-p1-status.md
status: PASSED

ou confirmation humaine explicite équivalente.
Sinon :
P1 = BLOCKED.
Ne jamais déduire ou simuler cette validation.



## 26. CE QUE TU DOIS RAPPORTER APRÈS CHAQUE MILESTONE
Format obligatoire :
MILESTONE:
STATUS: PASS / PARTIAL / FAIL

CHANGES:
- ...

FILES:
- ...

TESTS:
- ...

MEASUREMENTS:
- ...

EVIDENCE:
- commandes exécutées
- résultats observés

PROBLEMS:
- ...

DECISIONS:
- ...

RISKS:
- ...

NEXT PROPOSED STEP:
- ...

WAITING FOR APPROVAL:
YES

Ne masque jamais un échec derrière une description optimiste.



## 27. RÈGLE DE PREUVE
Ne dis jamais :
  •    “fonctionnel”
  •    “validé”
  •    “robuste”
  •    “rapide”
  •    “provider-agnostic”
  •    “production-ready”
sans preuve correspondante.
Pour toute affirmation importante, fournir au minimum un des éléments suivants :
  •    test automatisé ;
  •    sortie de commande ;
  •    log ;
  •    benchmark ;
  •    trace ;
  •    capture ;
  •    métrique ;
  •    fichier généré ;
  •    commit ;
  •    reproduction documentée.
Architecture sur papier != preuve runtime.

## 28. RÈGLE DE NON-DESTRUCTION
Avant toute modification importante :
  •     comprendre le code existant ;
  •     conserver les fonctions utiles ;
  •     éviter les réécritures globales ;
  •     faire des changements petits et réversibles ;
  •     utiliser Git ;
  •     indiquer les fichiers modifiés.
Ne détruis jamais une capacité existante simplement parce qu’elle n’est pas utilisée dans P0.



## 29. PREMIÈRE INSTRUCTION
COMMENCE UNIQUEMENT PAR M0 — REPOSITORY AUDIT.
Ne construis encore aucun provider.
Ne choisis encore aucun fournisseur.
Ne développe aucun avatar.
Ne développe aucun RAG.
Ne développe aucun OCR.
Ne développe aucune vision.
Ne développe aucun Policy Engine complet.
Inspecte le repository.
Compare son état au Handoff Global v1.2.
Produis :
docs/p0/repository-audit.md

Puis donne-moi :
  1.    l’état réel constaté ;
  2.    ce qui peut être réutilisé ;
  3.    les divergences avec v1.2 ;
  4.    les risques ;
  5.    ton plan minimal pour M1 ;
  6.    les preuves de ton audit.
Ensuite :
STOP.
Attends mon autorisation explicite avant M1.

