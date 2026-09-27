# Appels Azure STT — benchmark Provider A pré-M3

Suite de `qualification-tooling.md`, section 4. Ce lot sert **uniquement** au benchmark
Provider A pré-M3 : il ne connecte aucun fournisseur au produit, ne donne aucun verdict
de qualification et n'autorise pas M3.

## Ce que fait `scripts/call-azure-stt.ts`

Appelle l'API REST Azure Speech-to-text **audio court** (`canadacentral`) sur les 50 WAV du
panel, **séquentiellement** (pause d'une seconde, niveau F0), et écrit exactement ce que lit
`qualification.ts score` :

```text
<dossier-sortie>/
  transcripts.json      50 entrées : fixtureId, text, audioSha256, provider, region,
                        locale, capturedAt, rawResponseFile, rawResponseSha256
  FQ01.json … NZ10.json octets bruts de la réponse Azure, jamais reformatés
```

Avant tout appel, le script exige :

1. un `wav-report.json` avec `READY_FOR_HUMAN_REVIEW`, 50 lignes `TECHNICALLY_VALID` ;
2. une revalidation immédiate des WAV identique à ce rapport (sinon `WAV_REPORT_STALE`) ;
3. **16 kHz et ≤ 60 s pour chaque WAV**. Sinon il s'arrête et liste les identifiants :
   aucune conversion automatique, une copie 16 kHz est une donnée dérivée à documenter ;
4. un dossier de sortie **neuf** (jamais d'écrasement, jamais de mélange de passes).

Un appel en erreur (HTTP ≠ 200 après au plus 3 nouveaux essais sur 429/503, ou
`InitialSilenceTimeout`, `BabbleTimeout`, `Error`) **bloque le lot** : aucun
`transcripts.json` n'est écrit, donc aucun calcul avec des trous. `NoMatch` est un résultat
réel : texte vide, compté en suppressions. À la fin, la sortie est relue par l'import `score`
lui-même (aucun chiffre affiché).

## Plan de locales `p0-locales-v1`

L'API audio court n'accepte **qu'une locale par appel**, sans détection automatique de langue.

| Fixtures | Locale | Motif |
|---|---|---|
| FQ01–FQ15, NZ01–NZ05 | `fr-CA` | Référence en français |
| DJ01–DJ15, NZ06–NZ08 | `ar-MA` | Seule locale marocaine disponible ; pas de locale « darija » distincte |
| CS01–CS10, NZ09–NZ10 | `ar-MA` **puis** `fr-CA` | Mixtes : deux passes, décision du fondateur (2026-09-27) |

Le plan est recoupé avec l'écriture du texte de référence verrouillé (latin, arabe, mixte) ;
toute incohérence arrête le script (`LOCALE_PLAN_MISMATCH`). `ar-MA` n'est pas une preuve
d'aptitude au darija : c'est précisément ce que le benchmark mesure.

Limite connue : une transcription mixte avec une seule locale pénalise mécaniquement l'autre
langue. Le futur adaptateur streaming M3 (SDK, identification de langue) n'est pas évalué ici.

## Règle de lecture des phrases mixtes (fixée avant tout appel réel)

Décision du fondateur, 2026-09-27, **préenregistrée avant les appels sur le panel** :

1. Aucune transcription canonique n'est choisie pour CS01–CS10 et NZ09–NZ10. Chaque passe
   produit un jeu complet de 50 résultats et son propre rapport WER
   (`wer-mixed-ar-MA.json`, `wer-mixed-fr-CA.json`).
2. **Les deux rapports sont publiés côte à côte ; aucun ne valide seul.** Le seuil CS (25 %)
   n'est considéré atteint que s'il l'est **dans les deux passes**. Il en va de même pour la
   catégorie NZ, qui contient deux phrases mixtes.
3. Sont interdits : retenir après coup la passe la plus favorable, et composer un jeu
   phrase par phrase (locale majoritaire ou meilleur résultat) — un tel score ne correspond à
   aucune configuration réellement exécutable.

Résultat attendu, à rapporter tel quel et non à corriger : avec une locale par appel, le
segment dans la locale non demandée est probablement perdu dans chaque passe ; le seuil CS
risque de n'être atteint dans aucune. Ce n'est pas un défaut de l'outillage mais la donnée
recherchée : l'approche « un appel, une locale » est structurellement insuffisante pour le
code-switching. Un échec CS dans ce lot ne bloque rien en soi ; il documente une limite
d'architecture (détection de langue par segment avant transcription), hors périmètre de ce
lot, à faire remonter dans le rapport final avant toute décision Provider A.

## Exécution

Environnement contrôlé uniquement (poste du fondateur ou Azure Cloud Shell), jamais dans un chat.
Prérequis : `az login`, rôle « Utilisateur des secrets Key Vault » ou supérieur sur
`kv-humanoide-optique-sbx`, Node ≥ 24.

```sh
# Vérifier le plan sans appel réseau
node scripts/call-azure-stt.ts plan --mixed-locale ar-MA

# Passe 1 : 50 appels
node scripts/call-azure-stt.ts run qualification-input/panel/human-recordings \
  qualification-output/wav-report.json qualification-output/stt-mixed-ar-MA --mixed-locale ar-MA

# Passe 2 : 12 appels (mixtes) ; les 38 autres réponses sont recopiées octet pour octet
node scripts/call-azure-stt.ts run qualification-input/panel/human-recordings \
  qualification-output/wav-report.json qualification-output/stt-mixed-fr-CA --mixed-locale fr-CA \
  --reuse qualification-output/stt-mixed-ar-MA

# Calcul WER, une fois par passe
node scripts/qualification.ts score qualification-input/panel/human-recordings \
  qualification-output/stt-mixed-ar-MA qualification-output/wer-mixed-ar-MA.json
node scripts/qualification.ts score qualification-input/panel/human-recordings \
  qualification-output/stt-mixed-fr-CA qualification-output/wer-mixed-fr-CA.json
```

Coût : 62 appels de quelques secondes, sur les 5 h/mois gratuites du niveau F0.

## Secret et journalisation

- Clé lue **uniquement** dans Key Vault via Azure CLI (`az keyvault secret show`), en mémoire.
  Aucun fichier local, aucune variable d'environnement, aucun argument en clair.
- La clé ne sert qu'à obtenir un jeton STS (10 min, renouvelé toutes les 8 min) ; les appels STT
  utilisent le jeton.
- Sortie console : identifiants de fixture, locale, `RecognitionStatus`, code HTTP et comptes.
  **Jamais** de texte reconnu, de réponse brute, de jeton ni de clé ; les erreurs sont réduites
  à des codes (`KEY_VAULT_READ_FAILED`, `STT_HTTP_ERROR`, etc.).
- `qualification-output/` est ignoré par Git et ne doit jamais être commité.

## Codes de sortie

| Code | Signification |
|---|---|
| 0 | 50 résultats écrits et acceptés par `score` ; aucun verdict humain |
| 1 | Commande invalide ou locale mixte absente |
| 2 | Arrêt : rapport absent/périmé, WAV hors limites, dossier existant, secret, réseau ou réponse Azure inutilisable |

## Vérification

`tests/call-azure-stt.test.ts` (PCM synthétique en dossiers temporaires, Azure simulé) :
plan de locales, passe complète acceptée par `score`, octets bruts identiques, `NoMatch`
conservé, seconde passe limitée aux 12 mixtes, arrêt sur 44,1 kHz, rapport absent/incomplet/
périmé, blocage sur HTTP 500/401 et `InitialSilenceTimeout`, reprise bornée sur 429, dossier
existant refusé, aucun jeton ni texte reconnu dans les journaux.
