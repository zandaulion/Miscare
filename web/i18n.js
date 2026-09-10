/**
 * Limba interfeței.
 *
 * Cheia e textul românesc, nu un identificator și nu engleza. Aplicația a fost
 * scrisă în română, iar formulările ei au fost cântărite pe rând -- „fără
 * grabă și fără vinovăție" nu e o propoziție oarecare. Trecând-o mai întâi
 * prin engleză, fiecare celelaltă limbă ar fi fost traducerea unei traduceri,
 * iar tonul se pierde exact acolo. Așa că româna e originalul și toate cele
 * douăsprezece limbi, engleza inclusă, pleacă de la el.
 *
 * O cheie fără traducere se întoarce ca ea însăși. Un ecran pe jumătate
 * românesc e supărător, dar e citibil și se vede imediat ce lipsește; un ecran
 * cu goluri nu e nici una, nici alta.
 */

export const LOCALES = ['ro', 'en', 'ar', 'de', 'es', 'fr', 'hi', 'ja', 'ko', 'pt', 'uk', 'zh'];
export const RTL = new Set(['ar']);

const STORAGE_KEY = 'miscare-locale';

let strings = {};
let current = 'ro';

/** Limba salvată, altfel una dintre cele ale browserului, altfel româna. */
export function preferred() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LOCALES.includes(saved)) return saved;
  for (const tag of navigator.languages || [navigator.language || 'ro']) {
    const base = String(tag).toLowerCase().split('-')[0];
    if (LOCALES.includes(base)) return base;
  }
  return 'ro';
}

export function locale() {
  return current;
}

/**
 * Limbile care chiar au un catalog.
 *
 * Citite dintr-un index generat, nu din lista fixă de mai sus: un selector care
 * oferă o limbă fără fișier arată aplicația în română după alegere, fără niciun
 * mesaj, și pare defectă în loc de netradusă.
 */
let availableCache = null;
export async function available() {
  if (availableCache) return availableCache;
  try {
    const res = await fetch('/i18n/index.json');
    availableCache = res.ok ? await res.json() : [{ code: 'ro', name: 'Română', dir: 'ltr' }];
  } catch {
    availableCache = [{ code: 'ro', name: 'Română', dir: 'ltr' }];
  }
  return availableCache;
}

export function catalogue() {
  return strings;
}

export async function load(next) {
  current = LOCALES.includes(next) ? next : preferred();
  try {
    const res = await fetch(`/i18n/${current}.json`);
    strings = res.ok ? await res.json() : {};
  } catch {
    // Fără catalog, totul cade pe cheie -- adică pe română. Aplicația merge.
    strings = {};
  }
  document.documentElement.lang = current;
  document.documentElement.dir = RTL.has(current) ? 'rtl' : 'ltr';
  return current;
}

export function setLocale(next) {
  localStorage.setItem(STORAGE_KEY, next);
  return load(next);
}

/**
 * Un text, în limba curentă.
 *
 * `t('Gata', { n: 3 })` înlocuiește `{n}` după traducere, nu înainte: ordinea
 * cuvintelor diferă de la o limbă la alta, iar un număr lipit de text n-ar mai
 * putea fi mutat de traducător acolo unde îi e locul.
 */
export function t(key, vars) {
  let out = strings?.ui?.[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      out = out.replaceAll(`{${name}}`, String(value));
    }
  }
  return out;
}

/**
 * Textul unui exercițiu: nume, descriere, accent, sfat.
 *
 * Cade pe catalogul românesc dacă limba curentă nu are exercițiul -- un sfat
 * de execuție lipsă e mai rău decât unul într-o limbă străină, fiindcă acolo
 * se explică cum se face mișcarea fără să te accidentezi.
 */
export function exText(id, field) {
  return strings?.ex?.[id]?.[field] ?? FALLBACK?.ex?.[id]?.[field] ?? '';
}

/** Catalogul românesc, ținut deoparte ca plasă pentru exText. */
let FALLBACK = null;
export async function loadFallback() {
  if (FALLBACK || current === 'ro') return;
  try {
    const res = await fetch('/i18n/ro.json');
    if (res.ok) FALLBACK = await res.json();
  } catch { /* fără plasă; exText întoarce gol */ }
}

/** Cuvintele pentru efort, pentru formatReps. */
export function repWords() {
  return strings?.reps ? strings : FALLBACK ?? {};
}

/**
 * Aplică traducerile peste marcaj.
 *
 * `data-i18n` schimbă textul, `data-i18n-label` eticheta pentru cititoarele de
 * ecran, `data-i18n-ph` textul-fantomă dintr-un câmp. Se rulează după fiecare
 * redesenare, fiindcă vederile își rescriu propriul HTML.
 */
export function apply(root = document) {
  for (const el of root.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of root.querySelectorAll('[data-i18n-label]')) {
    el.setAttribute('aria-label', t(el.dataset.i18nLabel));
  }
  for (const el of root.querySelectorAll('[data-i18n-ph]')) {
    el.setAttribute('placeholder', t(el.dataset.i18nPh));
  }
}
