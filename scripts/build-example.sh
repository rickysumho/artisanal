#!/bin/sh
set -eu

unset CDPATH
ROOT=$(cd -- "$(dirname -- "$0")/.." && pwd)
HUGO_BIN=${HUGO_BIN:-hugo}
THEME_NAME=$(basename "$ROOT")

exec "$HUGO_BIN" \
  --source "$ROOT/exampleSite" \
  --themesDir "$(dirname "$ROOT")" \
  --theme "$THEME_NAME" \
  --destination "$ROOT/public" \
  --baseURL '/' \
  --cleanDestinationDir \
  --gc \
  --minify \
  --panicOnWarning \
  --printI18nWarnings \
  --printPathWarnings
