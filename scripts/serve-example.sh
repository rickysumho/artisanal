#!/bin/sh
set -eu

unset CDPATH
ROOT=$(cd -- "$(dirname -- "$0")/.." && pwd)
HUGO_BIN=${HUGO_BIN:-hugo}

exec "$HUGO_BIN" server \
  --source "$ROOT/exampleSite" \
  --themesDir "$(dirname "$ROOT")" \
  --theme "$(basename "$ROOT")" \
  --baseURL 'http://127.0.0.1:1313/' \
  --bind 127.0.0.1 \
  --port 1313 \
  --disableFastRender \
  --buildDrafts
