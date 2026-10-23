# Mișcare — Android & PWA

[Descarcă versiunea Android de test](https://github.com/zandaulion/Miscare/releases)
(Android 7.0+): program adaptiv și jurnal pe telefon, fără cont sau server.
Vezi [instalarea, copiile de siguranță și limitele versiunii](docs/android-release.md)
și [configurarea Android](docs/android-development.md).

Materialele pentru Google Play sunt în [store/](store/README.md).

Aplicație web progresivă (PWA) de exerciții concepută să te ia **de la zero**, să îți ofere un program zilnic **fără nicio fricțiune**, să permită **configurarea simplă a echipamentului** disponibil și **logarea ultra-ușoară** a ceea ce ai făcut, sub principiul: **fără vinovăție (no shaming), doar ajustare**.

Integrată nativ cu **[pwa-kit](https://github.com/zandaulion/pwa-kit)** pentru actualizări automate instante fără întreruperea utilizatorului și cu **[pwa-invite-console](https://github.com/zandaulion/pwa-invite-console)** pentru administrarea dispozitivelor și generarea de invitații de acces.

---


## In English

Mișcare is a Romanian exercise app for beginners, with adaptive routines,
equipment/limitation filters and a workout journal. This repo contains two paths:
the self-hosted PWA and a local Android build in development. The Android app’s
storage, activation and release status differ from the PWA; start with
[Android development](docs/android-development.md) for that platform.
[Project overview](https://zandaulion.com/miscare.html) · [Store preview](store/README.md).

### Android download

[Download the Android preview](https://github.com/zandaulion/Miscare/releases).
The signed APK works offline, without an account or Internet permission. It is
an early-access build; the [installation and build guide](docs/android-release.md)
explains checksums, local storage, backups, differences from the PWA and remaining
validation. Existing PWA history is not imported automatically.

### PWA local setup

Use Node.js 24 or newer, npm and `openssl`. In a fresh checkout:

```bash
npm ci
npm test
umask 077
printf 'ADMIN_TOKEN=%s\nPUBLIC_BASE_URL=http://127.0.0.1:3098\nPORT=3098\nCOOKIE_SECURE=false\n' \
  "$(openssl rand -hex 32)" > .env
set -a
. ./.env
set +a
npm start
```

Do not overwrite an existing `.env`. In another terminal, load that same file
with `set -a; . ./.env; set +a`, then create the first device invitation:

```bash
curl --fail http://127.0.0.1:3098/api/admin/invites \
  -H "X-Admin-Token: $ADMIN_TOKEN" -H 'Content-Type: application/json' \
  --data '{"label":"Demo device"}'
```

Open the returned invitation URL. Use HTTPS and `COOKIE_SECURE=true` for deployment;
block public `/api/admin/*` access and strip caller-supplied admin headers.
The PWA stores data on the server; the Android app stores it on-device. Do not
assume a PWA account or database is automatically imported into Android.

## Caracteristici Cheie

1. **Să te ia de la 0**:
   - Creată special pentru începători absoluți sau persoane care nu au mai făcut sport de mult timp.
   - Mișcări de bază sigure: flotări la perete, ridicări de pe scaun, întinderi de umeri, pod fesier blând.
   - Ghid vizual ilustrat / animat și instrucțiuni clare în limba română (fără termeni tehnici complicați).
   - Filtre pentru protecția zonelor sensibile (genunchi, spate, încheieturi).

2. **Sesiuni care nu se repetă**:
   - Mișcările se rotesc: fiecare sesiune făcută avansează rotația cu o poziție, așa că treci prin tot catalogul potrivit ție și te întorci.
   - Rotația e legată de sesiunile făcute, nu de calendar — cine se mișcă de două ori pe săptămână vede la fel de multe mișcări, doar mai lent. O zi sărită îți dă înapoi sesiunea nefăcută, nu următoarea.
   - Forma zilei rămâne aceeași (încălzire → sus → jos → centru); se schimbă cine ocupă fiecare loc.
   - O categorie cu o singură opțiune se completează din nivelul imediat următor — o singură mișcare nu e o alegere. Filtrele de excludere rămân neatinse.
   - **Se rotesc și grupele, nu doar exercițiile.** Fiecare mișcare e etichetată cu tiparul ei (împinge, trage, genuflexiune, șold, centru, gambe, cărat), iar sesiunea alternează perechile: fiecare grupă apare în două sesiuni din trei, nu în toate. Motivul e practic, nu fiziologic — cine împinge trei zile la rând se trezește cu pieptul înțepenit și sare o zi, iar ziua sărită e exact ce încearcă aplicația să prevină.
   - În aceeași sesiune nu apar două mișcări cu același tipar.
   - Catalogul are 45 de exerciții, dintre care patru tracțiuni fără echipament (prosop, îngerași la sol, ramat la tocul ușii, cobra) — fără ele, cine n-are bandă sau bară împingea în fiecare sesiune, fiindcă orice mișcare de sus cu greutatea corpului e o împingere.

3. **Program fără fricțiuni**:
   - Pe ecranul principal apare direct: **„Sesiunea de azi”** — gata de pornire cu 1 singur tap.
   - Fără setări laborioase de seturi, kilograme sau scheme de antrenament.
   - Opțiuni rapide: *„Fă-o de 5 min”* sau *„Schimbă exercițiul”*.
   - Mod ghidat cu timer discret și sunet blând de finalizare prin Web Audio API.

3. **Checklist curat pentru echipament**:
   - Bifezi rapid ce ai acasă (gantere, saltea, bandă elastică, bară de tracțiuni).
   - Dacă nu ai niciun echipament, ești încurajat — greutatea corpului și un scaun/perete sunt suficiente!

4. **Logare foarte ușoară**:
   - Bife rapide pentru exerciții sau buton *„Am făcut tot!”*.
   - Feedback cu 1 atingere: 😊 *Ușor și revigorant*, 👍 *Tocmai bine*, 🥵 *Cam greu*, ⏱️ *Doar o parte*.

5. **No shaming, doar ajustare**:
   - **Fără streaks pierdute**: zilele active se adună ca realizări permanente; nu există pedepse pentru zile de pauză.
   - Dacă revii după 5 zile: *„Bine ai revenit!”* + sesiune automată de reacomodare cu volum mai redus.
   - Dacă ultima sesiune a fost bifată ca *„Cam greu”*, intensitatea următoarei sesiuni este diminuată automat.

---

## Arhitectură & Tehnologie

- **Frontend**: Vanilla JS (ES Modules) fără build step, design tokens responsive, suport Dark/Light mode automat, `pwa-kit` update hooks (`installUpdates`), cache offline IndexedDB / LocalStorage.
- **Backend**: Node.js v24 (`DatabaseSync` nativ din `node:sqlite`), Express.
- **PWA Kit**:
  - `web/sw.js` (network-first caching cu version stamping `miscare-__BUILD_VERSION__`).
  - `web/pwa-update.js` & `web/sw-update.js` (anunță utilizatorul că aplicația s-a actualizat).
  - `web/bust.html` (escape hatch pentru resetarea stării și a cache-ului).
  - `server/serve-sw.js` (middleware ce injectează hash-ul conținutului din `web/`).

---

## Integrare pwa-invite-console

Aplicația implementează contractul complet cerut de [pwa-invite-console](https://github.com/zandaulion/pwa-invite-console):

| Endpoint | Descriere |
|---|---|
| `GET /api/admin/devices` | `{ devices: [{ id, label, created_at, last_seen, revoked, has_push }] }` |
| `POST /api/admin/devices/:id/revoke` | Activează sau revocă un dispozitiv |
| `POST /api/admin/devices/:id/label` | Schimbă eticheta dispozitivului |
| `DELETE /api/admin/devices/:id` | Șterge dispozitivul |
| `GET /api/admin/invites` | `{ invites: [...], ttl_days: 7 }` |
| `POST /api/admin/invites` | Creează cod invitație (`XXXX-YYYY-ZZZZ`) |
| `POST /api/admin/invites/:id/revoke` | Anulează o invitație nefolosită |

Serverul cere secretul `ADMIN_TOKEN` în header-ul `X-Admin-Token`. Un marker
`X-Admin` injectat de un proxy vechi nu autentifică direct serverul.

### Rută publică de activare:
- `POST /api/auth/redeem` (sau `/api/invites/redeem`): consumă codul de invitație, șterge textul clar din DB și emite un cookie securizat `miscare_device` pe 400 de zile.
- La deschiderea unui link `/?code=ABCD-EFGH-JKLM`, aplicația instalată pe ecranul principal se activează automat la prima lansare.

---

## Rulare și Teste

```bash
# Instalare dependențe
npm install

# Rulare teste unitare (contract consolă + motor adaptiv)
npm test

# Pornire server de dezvoltare
npm run dev

# Pornire server de producție
npm start
```

---

## Configurare Caddy (exemplu)

```caddyfile
# Suprafață privată (Consola de invitații pe tailnet)
handle /miscare/api/* {
    uri strip_prefix /miscare
    reverse_proxy 127.0.0.1:3098 {
        header_up -X-Admin
        header_up X-Admin-Token {env.MISCARE_ADMIN_TOKEN}
    }
}

# Suprafață publică
handle /miscare/* {
    uri strip_prefix /miscare
    reverse_proxy 127.0.0.1:3098 {
        header_up -X-Admin
        header_up -X-Admin-Token
    }
}
```

---

## Licență

Acest proiect este licențiat sub termenii licenței **GNU General Public License v3.0 or later** (GPL-3.0-or-later). Consultă fișierul [LICENSE](LICENSE) pentru detalii complete.


## Support and contributions

Capacitor CLI currently declares the older Xcode project editor. A scoped npm
override selects Xcode 4, which uses Node's built-in UUID generation. The test
suite parses, edits and round-trips a synthetic project to check this override;
remove it once Capacitor's own dependency range includes the patched editor.

The Node test runner gives each worker a fresh temporary data directory, so
parallel database tests do not share a file or open existing workout data.

Use this repository’s Issues for reproducible bugs and focused feature requests. Include the version, relevant runtime/browser, expected behavior and a minimal synthetic example. Remove credentials, personal records, device identifiers and deployment-specific values before sharing logs or screenshots.

Run `npm test` for server/engine changes and follow `docs/android-development.md` for local Android and browser validation. Use only synthetic workout/profile data.

Keep changes focused and update the affected documentation. Security-sensitive reports should follow [SECURITY.md](SECURITY.md).
