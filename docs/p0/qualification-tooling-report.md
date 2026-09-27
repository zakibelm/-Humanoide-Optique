# Lot pré-M3 — outils de qualification

Date : 27 septembre 2026 UTC. Base distante inspectée :
`baf42b3f5f715202c8cd5747b4275f5212933225`.

**État du lot technique : PASS aux contrôles locaux.**
**Qualification Azure : NON EXÉCUTÉE. P0 : NOT VERIFIED.**

## Inspection et plan exécuté

Le dépôt contient 16 fichiers à la base inspectée : documents, contrats TypeScript,
Scope Guard, deux suites de tests et dépendances de développement. Aucun adaptateur
réel, serveur, capture microphone, playback ou benchmark TTFA n'est présent.
Les rapports M1/M2 existent ; le rapport d'audit M0 mentionné par le handoff fourni
n'est pas présent dans l'arbre de cette branche. M0 n'a donc pas été revalidé ici.

Les 12 tests de contrats et de garde passent avant modification. Le dépôt déclare
TypeScript mais ne possède pas de `tsconfig.json` ni de commande de vérification statique.
Le lot ajoute cette vérification, puis prépare le contrôle B-008 et le calcul B-011
sans attendre les fichiers humains et sans ouvrir M3.

L'utilisateur a confirmé dans cette séance que la sandbox et les enregistrements ne sont
pas encore disponibles. Les anciennes consignes de redémarrage à M0 dans le Master
Prompt ont été traitées comme historiques, et non comme une demande de refaire M1/M2.

## Changements

- Extraction des 50 références depuis le document de qualification existant.
- Commande `prepare` : dossiers WAV, notes/consentements vides, grille humaine et schéma de transcriptions.
- Commande `validate` : intégrité RIFF/PCM16, fréquence, mono, durée, silence numérique,
  duplications, noms, consentement déclaré, notes et empreintes SHA-256.
- Commande `score` : cohérence audio/réponse brute/transcription, normalisation versionnée,
  WER par fixture et micro-agrégation par catégorie.
- Refus de remplacer un rapport existant, limites de taille et refus des traversées de chemins/liens symboliques.
- README, guide d'utilisation, exclusions Git des données privées et vérification TypeScript.

Les contrats, le garde existant, les seuils de qualification et les documents verrouillés
ne sont pas modifiés. Les outils n'émettent pas de verdict humain ni d'autorisation M3.

## Tests et preuves

Environnement : Windows, Node v24.19.0, TypeScript 7.0.2. Les dépendances de vérification
ont été installées localement avec pnpm, sans scripts d'installation ; `@types/node`
résolu localement : 26.6.3 (plage existante `^26.6.2`). Le lockfile npm existant est conservé.

| Contrôle | Résultat | Code |
|---|---|---:|
| Suites contrats, garde et qualification | 22 tests réussis, 0 échec | 0 |
| Vérification statique sources/scripts/tests | Aucune erreur | 0 |
| Dossier de qualification réel, encore vide | INCOMPLETE, 0/50 valides | 2 attendu |

Preuves brutes :

- [Commandes et codes de sortie](evidence/qualification-tooling/commands.json)
- [Tests](evidence/qualification-tooling/tests.txt)
- [Typecheck](evidence/qualification-tooling/typecheck.txt) — sortie vide, code 0 dans le manifeste.
- [Contrôle du dossier vide](evidence/qualification-tooling/empty-recordings.txt)
- [Diff du code et de la documentation](evidence/qualification-tooling/changes.patch)

Les tests couvrent les fichiers tronqués/stéréo/silencieux, les chunks RIFF rembourrés,
les duplications, les consentements absents, les noms incorrects, les WER avec insertions,
les reconnaissances vides, la micro-agrégation, les empreintes divergentes et la protection
contre l'écrasement. Le PCM et les réponses JSON synthétiques sont exclusivement des
données de tests temporaires ; aucun de ces scores n'est une mesure Azure.

## Livraison et limites

Les fichiers ont été récupérés au commit fixe via le connecteur GitHub : l'authentification
Git locale disponible ne permettait pas de cloner le dépôt privé. Un snapshot Git local
indépendant sert seulement au diff. La publication distante doit être un commit enfant
du véritable commit distant, via le connecteur, sur une branche dédiée ; l'historique
local indépendant ne doit jamais être poussé sur `main`.

La conformité technique d'un WAV ne prouve pas la fidélité du texte lu, le SNR, le consentement
réel ou la naturalité. L'importeur de réponses REST audio court est borné au format documenté
par Microsoft ; il ne démontre pas le streaming. La provenance fournie manuellement
n'est pas une attestation d'appel réseau. L'outil WER conserve toutes les reconnaissances
vides mais bloque un lot incomplet ou une requête en erreur ; il ne masque pas l'erreur
en calculant une moyenne sur le sous-ensemble réussi.

Aucune mesure TTFA, aucun score humain, aucun coût fournisseur, aucune preuve de résidence
ou de rétention de données n'ont été produits. La qualité multilingue du garde existant
reste à éprouver ; ce lot ne constitue pas un audit exhaustif de sa sécurité.

## Étape suivante

Terminer la sandbox canadienne, enregistrer les 50 WAV et documenter leurs conditions.
Puis exécuter les vrais appels de qualification STT/TTS, vérifier les preuves et faire
réaliser l'écoute et le verdict humain. M3 restera fermé jusqu'au verdict et à l'ouverture
explicite prévus dans le handoff. Aucun gate terrain P-1 n'est déclaré réussi.
