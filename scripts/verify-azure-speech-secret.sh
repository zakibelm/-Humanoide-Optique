#!/usr/bin/env bash
# Qualification only: no audio, no secret/token output or secret file.
# Run in a trusted Bash environment, not by sourcing this script.
set +x
set +v
set -euo pipefail

VAULT="${VAULT:-kv-humanoide-optique-sbx}"
SECRET_NAME="${SECRET_NAME:-azure-speech-key}"
REGION="${REGION:-canadacentral}"

# Keep the destination Canadian and reject URL/header injection before reading a key.
case "$REGION" in
  canadacentral|canadaeast) ;;
  *) printf 'ÉCHEC : région non autorisée.\n'; exit 1 ;;
esac
if [[ ! "$VAULT" =~ ^[a-zA-Z][a-zA-Z0-9-]{1,22}[a-zA-Z0-9]$ ]] ||
   [[ ! "$SECRET_NAME" =~ ^[a-zA-Z0-9-]{1,127}$ ]]; then
  printf 'ÉCHEC : nom de coffre ou de secret invalide.\n'
  exit 1
fi
if ! command -v az >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
  printf 'ÉCHEC : Azure CLI et curl >= 7.55 sont requis.\n'
  exit 1
fi

# Unset first so an inherited exported variable named key cannot export our value.
unset key
trap 'unset key' EXIT
if ! key="$(az keyvault secret show --vault-name "$VAULT" --name "$SECRET_NAME" \
    --query value --output tsv --only-show-errors 2>/dev/null)"; then
  printf 'ÉCHEC : lecture du secret impossible. Vérifier la connexion, RBAC et le réseau.\n'
  exit 1
fi
# Native Azure CLI on Windows emits CRLF; command substitution removes LF only.
key="${key%$'\r'}"
if [[ -z "$key" || ! "$key" =~ ^[a-zA-Z0-9+/=_-]+$ ]]; then
  printf 'ÉCHEC : secret vide ou format invalide.\n'
  exit 1
fi

# -q MUST be first: ignores .curlrc (tracing, redirects, output files, etc.).
# Header on stdin rather than /dev/fd: also works with native curl in Git Bash.
# No redirects, no retries, bounded HTTP call; response token goes to the null device.
# A nonzero curl exit is an error even if it printed HTTP 200 before failing.
if code="$(printf 'Ocp-Apim-Subscription-Key: %s\n' "$key" |
    curl -q --silent --show-error --output /dev/null --write-out '%{http_code}' \
      --connect-timeout 5 --max-time 20 --proto '=https' --max-redirs 0 \
      --request POST --header @- --header 'Content-Length: 0' \
      --header 'Content-Type: application/x-www-form-urlencoded' \
      "https://${REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken" 2>/dev/null)"; then
  unset key
else
  unset key
  printf 'ÉCHEC : appel STS interrompu ou erreur réseau.\n'
  exit 2
fi

# Only a three-digit status can reach the console; never echo unexpected output.
if [[ ! "$code" =~ ^[0-9]{3}$ ]]; then
  printf 'ÉCHEC : statut HTTP invalide.\n'
  exit 2
fi
case "$code" in
  200) printf 'OK : clé acceptée par Azure Speech (%s), HTTP 200.\n' "$REGION"; exit 0 ;;
  401|403) printf 'ÉCHEC : clé refusée par Azure Speech, HTTP %s.\n' "$code"; exit 2 ;;
  *) printf 'ÉCHEC : réponse STS inattendue, HTTP %s.\n' "$code"; exit 2 ;;
esac
