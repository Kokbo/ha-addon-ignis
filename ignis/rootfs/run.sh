#!/bin/bash
# Turn the add-on options into Ignis environment variables, then hand over to the
# upstream entrypoint (which downloads Obsidian if needed and drops to PUID/PGID).
set -euo pipefail

OPTIONS_FILE=/data/options.json

if [ -f "$OPTIONS_FILE" ]; then
    eval "$(node /usr/local/lib/ha-addon/options.js "$OPTIONS_FILE")"
else
    echo "[ha-addon] $OPTIONS_FILE not found; using defaults."
fi

export PUID="${PUID:-1000}"
export PGID="${PGID:-1000}"

mkdir -p "$DATA_ROOT" "$OBSIDIAN_ASSETS_PATH" "$XDG_CONFIG_HOME" "$VAULT_ROOT"

# The upstream entrypoint chowns Obsidian, the settings and the vaults. Do the same
# for the Obsidian Sync login, which lives outside those folders.
chown -R "$PUID:$PGID" "$XDG_CONFIG_HOME" 2>/dev/null || true

echo "[ha-addon] Vaults: $VAULT_ROOT (each subfolder is a vault)"
echo "[ha-addon] Running as UID $PUID / GID $PGID"

exec /app/apps/ignis-server/scripts/entrypoint.sh "$@"
