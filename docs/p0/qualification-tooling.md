# Qualification Azure — préparation et contrôle hors ligne

Lot pré-M3, correspondant à la préparation de B-008 et B-011 du plan opérationnel.
Il ne connecte aucun fournisseur et ne donne aucun verdict de qualification.

## 1. Préparer la sandbox

Mise à jour : Speech est désormais provisionné et le coffre Key Vault a été rapporté créé.
Voir [l'état et la vérification d'accès](azure-secret-access.md). Les instructions de
création ci-dessous sont conservées pour reproduction ; ne pas créer de doublon.

Ouvrir https://portal.azure.com/, rechercher **Speech**, puis créer une ressource
de test. Région demandée : **Canada Central** (`canadacentral`). Nom proposé :
`humanoide-optique-speech-sandbox`. Utiliser F0 s'il est disponible ; examiner le tarif
affiché avant la création. Ne pas basculer silencieusement vers une région non canadienne.

Référence régionale : https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions
(consultée le 27 septembre 2026 UTC). La présence d'une région dans cette liste
ne constitue pas une preuve de rétention nulle ou d'aptitude au darija.

Conserver la clé dans le mécanisme de secrets choisi. Fournir uniquement les métadonnées
non secrètes pour le suivi : nom, région, niveau de service et état du provisionnement.
La génération Azure STT/TTS et la sélection exacte des voix restent à réaliser.

## 2. Préparer les fichiers

Depuis la racine du dépôt :

```sh
node scripts/qualification.ts prepare qualification-input/panel
```

Cette commande crée un **nouveau** dossier et refuse un dossier existant :

```text
qualification-input/panel/
  fixtures.json
  human-listening.csv
  transcripts.template.json
  human-recordings/
    recording-notes.json
    fr-ca/
    darija/
    code-switch/
    noise/
```

Les 50 textes proviennent directement du Markdown de qualification verrouillé,
sans copie indépendante des références. Les notes, consentements et scores ne sont
jamais préremplis comme réussis. `transcripts.template.json` contient `null` pour les
résultats absents : un texte vide sera réservé à une reconnaissance réellement sans résultat.

## 3. Enregistrer et contrôler

Lire une phrase par fichier : FQ01–FQ15, DJ01–DJ15, CS01–CS10, NZ01–NZ10.
Placer chaque fichier dans sa catégorie avec la casse exacte, par exemple
`human-recordings/fr-ca/FQ01.wav`. Utiliser **WAV PCM signé 16 bits, mono, 16 kHz ou
44,1 kHz**, avec une fréquence uniforme par session. Le contrôle accepte 0,1 à 120 secondes
et au maximum 12 Mio par fichier. Une conversion éventuelle reste une copie dérivée ;
conserver les originaux ailleurs et documenter la conversion.

Dans `recording-notes.json`, remplir chaque ligne :

- `consent` : `true` uniquement après consentement réel ;
- `speakerId` : identifiant pseudonyme, sans nom complet ;
- `sessionId` : identifiant de la séance ;
- `microphone`, `distanceCm` et `conditions` : conditions constatées ;
- pour NZ, documenter aussi le bruit, son niveau/recouvrement et sa méthode de production.

Les conditions attendues NZ sont disponibles dans `fixtures.json`. Ne pas remplacer
les conditions constatées par les conditions attendues sans vérification humaine.

```sh
node scripts/qualification.ts validate qualification-input/panel/human-recordings qualification-output/wav-report.json
```

Créer d'abord le dossier `qualification-output` s'il n'existe pas. Aucun rapport
existant n'est écrasé. La commande contrôle les en-têtes RIFF, les limites de chunks,
le format, la durée, le silence numérique, les duplications exactes, les noms, le consentement
déclaré et les notes. Elle calcule SHA-256, RMS, pic et nombre d'échantillons saturés.

**READY_FOR_HUMAN_REVIEW** signifie seulement conformité technique. L'outil ne vérifie
pas que la personne a réellement consenti, que la phrase a été lue correctement,
qu'elle n'est pas tronquée acoustiquement, ou que le SNR prescrit est atteint. Une écoute
humaine reste nécessaire, y compris en présence de saturation ou de niveau faible.

## 4. Calculer le WER après les vrais appels Azure

L'outil n'appelle pas Azure. Après exécution réelle, importer dans un dossier privé :

```text
qualification-output/stt/
  transcripts.json
  FQ01.json
  ...
  NZ10.json
```

Chaque entrée de `transcripts.json` comprend :

```json
{
  "fixtureId": "FQ01",
  "text": "texte réellement reconnu",
  "audioSha256": "empreinte du WAV réellement envoyé",
  "provider": "azure",
  "region": "canadacentral",
  "locale": "locale réellement utilisée",
  "capturedAt": "horodatage ISO 8601 de l'appel",
  "rawResponseFile": "FQ01.json",
  "rawResponseSha256": "empreinte de la réponse brute"
}
```

Ce bloc est un schéma d'exemple, **pas une preuve utilisable**. Les empreintes doivent
être 64 caractères hexadécimaux calculés sur les fichiers réels.

L'import actuel attend une réponse JSON Azure REST de reconnaissance audio court avec
`RecognitionStatus` et `DisplayText` (format simple), ou le premier `NBest[].Display`
(format détaillé). Conserver les octets de réponse originaux ;
ne pas reconstruire une réponse à partir du texte reconnu. Un appel en erreur bloque
le calcul ; une réponse `NoMatch` compte comme toutes les suppressions, sans être ignorée.
Les réponses SDK streaming devront recevoir un importeur distinct avant leur utilisation.
Cet importeur hors ligne n'est pas le futur adaptateur STT streaming M3.
Il exige des WAV **16 kHz et au plus 60 secondes**, conformément aux limites de cette API.
Les originaux 44,1 kHz restent acceptés par le contrôleur WAV, mais nécessitent des copies
16 kHz documentées pour cet import ; l'empreinte doit correspondre au fichier effectivement
transmis. Voir la [référence Microsoft](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short).

```sh
node scripts/qualification.ts score qualification-input/panel/human-recordings qualification-output/stt qualification-output/wer-report.json
```

Le calcul exige les 50 WAV techniquement valides, 50 transcriptions avec identifiants
uniques, une région canadienne déclarée, les empreintes audio correspondantes et une
réponse brute distincte par fixture dont le texte concorde. Il ne certifie pas l'origine
Azure de fichiers fournis manuellement : les traces d'exécution réelles restent nécessaires.

Le WER est `(substitutions + suppressions + insertions) / mots de référence`.
L'agrégation par catégorie est **micro-pondérée**, jamais une moyenne des pourcentages.
Les seuils sont 15 % FQ, 25 % DJ, 25 % CS et 30 % NZ. Un WER peut dépasser 100 %.

Normalisation versionnée `p0-fixtures-v1` : NFKC, minuscules, chiffres arabes/persans vers
chiffres ASCII, ponctuation remplacée par des espaces, espaces normalisés. Les accents,
lettres arabes et mots alternant de langue sont conservés. Lexique numérique volontairement
limité au corpus : `dix`, `عشرة` et `العشرة` deviennent `10` dans les deux textes.
Les autres formes numériques ne sont pas assimilées automatiquement. Toute extension
du lexique exige une version et un nouveau calcul de l'ensemble des résultats.

Les champs `thresholdMet` sont de simples comparaisons numériques. Les négations perdues,
nombres inventés et inversions sémantiques exigent une revue humaine, même si les seuils passent.
Le rapport garde toujours `humanVerdict: NOT_RECORDED`, `providerApproved: false` et
`m3Authorized: false` ; il ne remplace pas le verdict humain externe.

## 5. Codes de sortie et vérification

| Code | Signification |
|---|---|
| 0 | Préparation réussie, conformité technique ou seuils WER atteints ; aucun gate humain validé |
| 1 | Commande invalide, preuve incohérente, lecture impossible ou destination existante |
| 2 | WAV incomplets/non conformes ou au moins un seuil WER dépassé |

```sh
node --test tests/*.test.ts
npm ci
npm run typecheck
```

Les tests utilisent du PCM synthétique uniquement dans des dossiers temporaires dédiés.
Ces fichiers sont supprimés après les tests et ne sont jamais proposés au panel humain.
Ne pas publier les dossiers d'entrée/sortie privés. Un SHA-256 prouve la cohérence des
octets, pas l'authenticité d'un locuteur, une résidence de données ou une validation humaine.
