# Accès au secret Azure Speech — état et vérification

## État des ressources

- Speech `humanoide-optique-speech-sandbox`, Canada Central, niveau Gratuit :
  vérifié dans le portail lors de la séance précédente.
- Key Vault `kv-humanoide-optique-sbx`, Canada Central, Standard, groupe
  `rg-humanoide-optique-sandbox` : création rapportée par l'utilisateur.
- RBAC, rôle Secrets Officer au coffre, suppression réversible 90 jours,
  purge non protégée et accès réseau public : paramètres rapportés par l'utilisateur,
  non revérifiés dans ce lot.
- Secret attendu : `azure-speech-key`. Sa présence et sa validité ne sont pas encore prouvées.
- Budget mensuel 30 : alerte uniquement, devise non confirmée. Aucun arrêt automatique.

## Rôles et réseau

`Key Vault Secrets Officer` permet de gérer les secrets, au-delà de la lecture seule.
Pour l'identité applicative qui ne doit que lire, prévoir `Key Vault Secrets User`
avec une portée limitée ; aucun changement de rôle n'est réalisé par ce script.
Le compte propriétaire reste un compte d'administration et n'est pas une identité de déploiement.
Source : [rôles Azure RBAC](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide).

L'ouverture à tous les réseaux n'est **pas nécessaire à `az login`**. Le réseau du coffre
détermine l'accès aux secrets après authentification. Une adresse cliente autorisée
ou un chemin privé peut être utilisé. Ne pas confondre connexion au compte et accès au
plan de données. Source : [réseau Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/network-security).

## Étape manuelle : déposer la clé

Dans le portail, copier directement Clé 1 depuis la ressource Speech vers un nouveau secret
`azure-speech-key` du coffre. Ne pas coller la clé dans Git, un ticket ou le chat.
Cette opération reste à effectuer par l'utilisateur ; le script ne crée ni ne modifie de secret.

## Exécuter la vérification

Prérequis : Bash, Azure CLI connecté, curl >= 7.55 et droits de lecture du secret.
Sous Windows, utiliser **Git Bash** ou un environnement WSL disposant de ces outils.
Le `bash.exe` système peut pointer vers un WSL non configuré ; ce n'est pas Git Bash.

Depuis la racine du dépôt, dans Bash :

```sh
az login
bash scripts/verify-azure-speech-secret.sh
echo "Code de sortie : $?"
```

Les valeurs par défaut ciblent le coffre et le secret ci-dessus, en `canadacentral`.
Les variables `VAULT`, `SECRET_NAME` et `REGION` sont configurables ; seule une région
canadienne (`canadacentral` ou `canadaeast`) est acceptée. Ne changer la région que si
elle correspond réellement à la ressource Speech.

Le script lit le secret avec Azure CLI puis effectue un POST vers le point STS régional
`https://canadacentral.api.cognitive.microsoft.com/sts/v1.0/issueToken`.
Il ne transmet aucun audio et ne lance aucune transcription ou synthèse.
Un HTTP 200 prouve seulement l'acceptation de la clé par STS à cet instant.
Référence : [authentification Speech REST](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech#how-to-get-an-sts-access-token).

| Code | Sens |
|---|---|
| 0 | Secret lu et appel STS terminé avec HTTP 200 |
| 1 | Configuration/prérequis invalides, secret illisible, vide ou format invalide |
| 2 | Clé refusée, réponse STS inattendue, échec réseau ou transfert incomplet |

## Protections et limites

- Traces Bash désactivées avant toute lecture, même avec `bash -x`.
- Pas de secret dans les arguments curl : en-tête transmis sur l'entrée standard.
- Pas de variable secrète exportée aux processus enfants ; suppression de la variable à la sortie.
- Format contrôlé : pas d'injection CR/LF dans l'en-tête ; CRLF terminal d'Azure CLI Windows accepté.
- `curl -q` ignore la configuration `.curlrc`, notamment un mode verbeux ou des redirections.
- HTTPS uniquement, aucune redirection ni retry, connexion limitée à 5 s et appel HTTP à 20 s.
- Corps de réponse STS, qui contient un jeton, dirigé vers le périphérique nul.
- Les erreurs brutes d'Azure CLI/curl ne sont pas affichées ; sortie limitée à un statut contrôlé.
- Un code de sortie curl non nul reste un échec, même si un HTTP 200 a déjà été reçu.

Ces garanties concernent le comportement du script avec des exécutables et un environnement
de confiance. Elles ne protègent pas contre un poste compromis, un débogueur, un shell modifié,
des hooks de démarrage malveillants ou la journalisation externe d'Azure CLI. `unset` n'est
pas une garantie d'effacement physique de la mémoire. La lecture Azure CLI n'a pas de délai
global imposé par ce script ; elle peut devoir être interrompue si elle se bloque.

## Preuves et gate

Les tests remplacent **à la fois** `az` et `curl`. Ils ne contactent pas Azure et utilisent
uniquement une valeur synthétique. Ils vérifient les erreurs de lecture, clé vide, CRLF,
injection d'en-tête, HTTP 401/403/302/429/500, timeout, HTTP 200 incomplet, sortie inattendue,
restriction régionale, absence de clé dans les arguments/l'environnement et dans la sortie
de `bash -x`.

Voir [les commandes et leurs codes](evidence/azure-secret-access/commands.json) et
[les sorties de tests](evidence/azure-secret-access/tests.txt).
Résultat local : **39 tests réussis, aucun échec ni test ignoré**, et vérification TypeScript
réussie. Bash 5.2.15 de Git for Windows a exécuté les tests du script.
Le [diff du lot](evidence/azure-secret-access/changes.patch) accompagne ces preuves.

Le test réel n'a pas été exécuté : Azure CLI n'est pas disponible dans l'environnement de
cette séance et le dépôt effectif du secret n'a pas été confirmé. Aucun secret réel n'a été lu.
La réussite STS ne valide ni la qualité des voix, ni le WER, ni le TTFA, ni la politique de
rétention. M3 et le verdict humain de qualification restent inchangés.
