# Mișcare — PWA

Aplicație web progresivă (PWA) de exerciții concepută să te ia **de la zero**, să îți ofere un program zilnic **fără nicio fricțiune**, să recunoască din **fotografie echipamentul** disponibil (folosind Gemini Vision) și să permită **logarea ultra-ușoară** a ceea ce ai făcut, sub principiul: **fără vinovăție (no shaming), doar ajustare**.

Integrată nativ cu **[pwa-kit](https://github.com/zandaulion/pwa-kit)** pentru actualizări automate instante fără întreruperea utilizatorului și cu **[pwa-invite-console](https://github.com/zandaulion/pwa-invite-console)** pentru administrarea dispozitivelor și generarea de invitații de acces.

---

## Caracteristici Cheie

1. **Să te ia de la 0**:
   - Creată special pentru începători absoluți sau persoane care nu au mai făcut sport de mult timp.
   - Mișcări de bază sigure: flotări la perete, ridicări de pe scaun, întinderi de umeri, pod fesier blând.
   - Ghid vizual SVG animat și instrucțiuni clare în limba română (fără termeni tehnici complicați).
   - Filtre pentru protecția zonelor sensibile (genunchi, spate, încheieturi).

2. **Program fără fricțiuni**:
   - Pe ecranul principal apare direct: **„Sesiunea de azi”** — gata de pornire cu 1 singur tap.
   - Fără setări laborioase de seturi, kilograme sau scheme de antrenament.
   - Opțiuni rapide: *„Fă-o de 5 min”* sau *„Schimbă exercițiul”*.
   - Mod ghidat cu timer discret și sunet blând de finalizare prin Web Audio API.

3. **Foto la echipament (dacă ai)**:
   - Faci o poză sau încarci o fotografie cu echipamentul disponibil acasă (gantere, saltea, bandă elastică, scaun).
   - Gemini Vision (`gemini-3.8-flash`) recunoaște automat obiectele și ajustează programul.
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
- **Backend**: Node.js v24 (`DatabaseSync` nativ din `node:sqlite`), Express, Gemini Vision API.
- **PWA Kit**:
  - `web/sw.js` (network-first caching cu version stamping `miscare-__BUILD_VERSION__`).
  - `web/pwa-update.js` & `web/sw-update.js` (anunță utilizatorul că aplicația s-a actualizat).
  - `web/bust.html` (escape hatch pentru resetarea stării și a cache-ului).
  - `server/serve-sw.js` (middleware ce injectează hash-ul conținutului din `web/`).

---

## Integrare pwa-invite-console

Aplicația implementează contractul complet cerut de [pwa-invite-console]:

| Endpoint | Descriere |
|---|---|
| `GET /api/admin/devices` | `{ devices: [{ id, label, created_at, last_seen, revoked, has_push }] }` |
| `POST /api/admin/devices/:id/revoke` | Activează sau revocă un dispozitiv |
| `POST /api/admin/devices/:id/label` | Schimbă eticheta dispozitivului |
| `DELETE /api/admin/devices/:id` | Șterge dispozitivul |
| `GET /api/admin/invites` | `{ invites: [...], ttl_days: 7 }` |
| `POST /api/admin/invites` | Creează cod invitație (`XXXX-YYYY-ZZZZ`) |
| `POST /api/admin/invites/:id/revoke` | Anulează o invitație nefolosită |

Rutele de admin sunt protejate prin header-ul `X-Admin` sau `X-Admin-Token`.

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
        header_up X-Admin 1
    }
}

# Suprafață publică
handle /miscare/* {
    uri strip_prefix /miscare
    reverse_proxy 127.0.0.1:3098 {
        header_up -X-Admin
    }
}
```
