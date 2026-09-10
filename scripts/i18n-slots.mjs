/**
 * Sloturile traducerii, în ordine fixă.
 *
 * Cheile sunt propoziții românești întregi. Rescrise în fiecare din cele
 * douăsprezece fișiere, ar fi fost douăsprezece ocazii ca o cheie să difere de
 * original printr-o diacritică -- iar o cheie greșită nu dă eroare, doar lasă
 * textul netradus, ceea ce se vede abia pe ecran. Așa că un catalog nou se
 * scrie ca listă de valori, în ordinea de aici, iar cheile vin toate din
 * română.
 */
import fs from 'node:fs';

const RO_URL = new URL('../web/i18n/ro.json', import.meta.url);
const ro = JSON.parse(fs.readFileSync(RO_URL, 'utf8'));

const EX_FIELDS = ['name', 'description', 'focus', 'tip'];

/**
 * Sloturile, ca [fel, cheie, subcheie, textRomânesc].
 *
 * Cheia se ține întreagă, nu se lipește într-o cale cu puncte: cheile din `ui`
 * sunt propoziții și conțin ele însele puncte, deci o cale despicată pe punct
 * ar tăia „Gata. Bravo." în bucăți.
 */
export function slots() {
  const out = [];
  for (const u of Object.keys(ro.reps.unit)) out.push(['unit', u, null, ro.reps.unit[u]]);
  for (const n of Object.keys(ro.reps.note)) out.push(['note', n, null, ro.reps.note[n]]);
  for (const [id, fields] of Object.entries(ro.ex))
    for (const f of EX_FIELDS) out.push(['ex', id, f, fields[f] ?? '']);
  for (const k of Object.keys(ro.ui)) out.push(['ui', k, null, ro.ui[k]]);
  return out;
}

/** Construiește catalogul unei limbi din valori, una pe slot, în ordine. */
export function build(values, meta) {
  const s = slots();
  if (values.length !== s.length)
    throw new Error(`${meta.code}: ${values.length} valori pentru ${s.length} sloturi`);

  const out = { meta: { name: meta.name, dir: meta.dir || 'ltr' }, reps: { unit: {}, note: {} }, ex: {}, ui: {} };
  s.forEach(([kind, key, sub], i) => {
    const v = values[i];
    if (kind === 'unit') out.reps.unit[key] = v;
    else if (kind === 'note') out.reps.note[key] = v;
    else if (kind === 'ex') (out.ex[key] ??= {})[sub] = v;
    else out.ui[key] = v;
  });
  return out;
}
