#!/usr/bin/env bash
# Builds the plugin and packs it the way Decky Loader's "Install plugin from ZIP" expects:
# a single switch2-dashboard/ folder with the built frontend, the Python backend and the metadata.
set -euo pipefail

cd "$(dirname "$0")/.."

# The panel shows VERSION from src/index.tsx; refuse to ship a ZIP that would show the wrong one.
version="$(node -p 'require("./package.json").version')"
if ! grep -q "const VERSION = \"$version\";" src/index.tsx; then
  echo "src/index.tsx VERSION doesn't match package.json ($version)" >&2
  exit 1
fi

npm run build

stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT
dest="$stage/switch2-dashboard"
mkdir -p "$dest/dist"
cp dist/index.js "$dest/dist/"
cp main.py plugin.json package.json LICENSE README.md "$dest/"

rm -f switch2-dashboard.zip
(cd "$stage" && python3 -I -m zipfile -c "$OLDPWD/switch2-dashboard.zip" switch2-dashboard)
echo "Created switch2-dashboard.zip"
