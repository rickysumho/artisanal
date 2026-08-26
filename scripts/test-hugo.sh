#!/bin/sh
set -eu

unset CDPATH
ROOT=$(cd -- "$(dirname -- "$0")/.." && pwd)

run_build() {
  version=$1
  binary=$2
  printf '\nRunning Hugo %s\n' "$version"
  HUGO_BIN="$binary" "$ROOT/scripts/build-example.sh"
  "$binary" config mounts --source "$ROOT/exampleSite" --themesDir "$(dirname "$ROOT")" --theme "$(basename "$ROOT")"
  "$binary" --source "$ROOT/exampleSite" --themesDir "$(dirname "$ROOT")" --theme "$(basename "$ROOT")" --templateMetrics --templateMetricsHints --quiet
}

if [ -n "${HUGO_MIN_BIN:-}" ]; then
  run_build 'minimum' "$HUGO_MIN_BIN"
fi

run_build 'current' "${HUGO_BIN:-hugo}"
