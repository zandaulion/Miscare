#!/usr/bin/env bash
# Deploy Mișcare static PWA files to /var/www/miscare
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${DEST:-/var/www/miscare}"

sudo mkdir -p "$DEST"
sudo chown "$(id -un):$(id -gn)" "$DEST"

# Content hash for service worker cache versioning
VERSION="$(find "$ROOT/web" -type f -exec sha256sum {} + | sort -k2 | sha256sum | cut -c1-12)"

rsync -a --delete "$ROOT/web/" "$DEST/"
grep -rl __BUILD_VERSION__ "$DEST" | xargs -r sed -i "s/__BUILD_VERSION__/${VERSION}/g"

sudo restorecon -R "$DEST" 2>/dev/null || true
echo "deployed Mișcare PWA -> ${DEST}"
