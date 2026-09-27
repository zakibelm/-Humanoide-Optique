# Humanoïde Optique — socle P0

Assistant vocal multilingue pour l'accueil en magasin d'optique. Le dépôt contient
actuellement les contrats STT/LLM/TTS, le P0ScopeGuard et les outils hors ligne de
préparation de la qualification Azure. **Le pipeline vocal réel n'est pas encore livré.**

## Démarrage

Node.js **24 ou supérieur**. Les tests et les outils de qualification ne nécessitent
aucune clé ni dépendance d'exécution :

```sh
node --test tests/*.test.ts
node scripts/qualification.ts prepare qualification-input/panel
node scripts/qualification.ts validate qualification-input/panel/human-recordings
```

La dernière commande retourne le code **2** tant que le dossier est incomplet.
Après installation des dépendances de développement (`npm ci`), `npm run typecheck`
vérifie aussi les types des sources, scripts et tests.

Consulter le [guide de qualification](docs/p0/qualification-tooling.md) pour enregistrer
les 50 phrases, contrôler les WAV et importer les transcriptions réelles.

## État et limites

- M1/M2 : contrats et garde de périmètre existants, tests locaux disponibles.
- Qualification Azure : Speech provisionné ; Key Vault rapporté créé ; accès au secret,
  enregistrements et verdict humain encore à vérifier.
- M3 : connexion des fournisseurs non ouverte ; aucun fournisseur n'est appelé par ces outils.
- P0 : **NOT VERIFIED** ; aucune mesure TTFA réelle.
- P-1 terrain : validation humaine indépendante, toujours ouverte.

Les résultats de tests synthétiques ne prouvent ni la qualité des voix, ni la qualité STT,
ni le traitement au Canada, ni le fonctionnement d'un microphone ou du playback.

## Références

- [Handoff v1.5](docs/handoff/HANDOFF_v1.5_LOCKED.md)
- [Contrat d'exécution P0](docs/handoff/MASTER_PROMPT_v1.1_LOCKED.md)
- [Décision fournisseur](docs/p0/provider-reference-decision.md)
- [50 fixtures et grille humaine](docs/p0/azure-qualification-materials.md)

Ne pas commiter les secrets, les enregistrements ou les sorties fournisseur.
Les dossiers `qualification-input/` et `qualification-output/` sont ignorés par Git.

Le [guide d'accès au secret](docs/p0/azure-secret-access.md) décrit le test STS isolé :
`bash scripts/verify-azure-speech-secret.sh`. Il nécessite Azure CLI connecté et ne produit
aucun audio. Les contrôles WAV/WER ci-dessus restent entièrement hors ligne.
