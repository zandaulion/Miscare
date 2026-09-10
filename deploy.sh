#!/usr/bin/env bash
# Rebuild the Mișcare image and restart the service.
#
# Nu există pas de copiere a fișierelor. Caddy nu servește nimic de pe disc
# pentru Mișcare -- trimite tot către container, iar `web/` e copiat în imagine
# la build. Deci singura cale prin care o modificare din `web/` ajunge la
# telefon e o reconstrucție. Versiunea service worker-ului se calculează în
# server, din conținutul servit, deci nu se ștampilează nimic aici.
#
# Scriptul acesta a copiat cândva în /var/www/miscare, de pe vremea când
# fișierele erau servite static. Directorul a rămas, dar nimeni nu-l mai
# citește: o modificare „implementată" cu el ajungea într-un loc mort, iar
# aplicația mergea mai departe cu codul vechi fără niciun semn.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

npm --prefix "$ROOT" test >/dev/null
npm --prefix "$ROOT" run i18n:check

podman build -t miscare:latest -f "$ROOT/deploy/Containerfile" "$ROOT"
systemctl --user restart miscare

for _ in $(seq 1 20); do
  sleep 1
  if curl -fsS http://127.0.0.1:8100/api/health >/dev/null 2>&1; then
    echo "deployed Mișcare -> container repornit, sănătate confirmată"
    exit 0
  fi
done

echo "imaginea s-a construit, dar serviciul nu a răspuns la /api/health" >&2
exit 1
