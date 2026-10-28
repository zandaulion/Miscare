// Fiecare limbă, măsurată față de română.
//
// Nu verifică traducerea -- nimic automat nu poate -- ci că nu lipsește nimic
// și că nu a rămas nimic în plus. O cheie lipsă se vede în aplicație ca text
// românesc într-un ecran altfel tradus; una în plus e muncă făcută degeaba
// pentru un text care nu se mai afișează nicăieri.
import fs from 'node:fs';
import path from 'node:path';

const DIR = new URL('../web/i18n/', import.meta.url);
const ro = JSON.parse(fs.readFileSync(new URL('ro.json', DIR), 'utf8'));
const FIELDS = ['name', 'description', 'focus', 'tip'];

// Substituenții pe care fiecare traducere trebuie să-i păstreze. `{n}` pierdut
// nu strică nimic vizibil în fișier, dar în aplicație scrie „aproximativ
// minute" -- adică fix numărul dispare, singura parte care nu se poate ghici.
const PLACEHOLDER = /\{(\w+)\}/g;
// Pentru un plural contează forma generală: „one" poate spune „o sesiune" în
// loc de „{n} sesiuni", dar „other" trebuie să păstreze tot.
const general = (v) => (v && typeof v === 'object' ? v.other : v);
const marks = (s) => [...String(general(s) ?? '').matchAll(PLACEHOLDER)].map((m) => m[1]).sort().join(',');
const expectedMarks = Object.fromEntries(
  Object.entries(ro.ui).map(([k, v]) => [k, marks(v)]).filter(([, m]) => m));

const expectedUi = Object.keys(ro.ui);
const expectedEx = Object.keys(ro.ex);
const repCount = Object.keys(ro.reps.unit).length + Object.keys(ro.reps.note).length;
let bad = 0;

for (const file of fs.readdirSync(DIR).sort()) {
  if (!file.endsWith('.json') || file === 'index.json') continue;
  const code = path.basename(file, '.json');
  const cat = JSON.parse(fs.readFileSync(new URL(file, DIR), 'utf8'));

  const missingUi = expectedUi.filter((k) => !cat.ui?.[k]);
  const extraUi = Object.keys(cat.ui ?? {}).filter((k) => !ro.ui[k]);
  const missingEx = expectedEx.filter((id) => !cat.ex?.[id]);
  const missingFields = [];
  for (const id of expectedEx) {
    for (const f of FIELDS) {
      if (ro.ex[id][f] && !cat.ex?.[id]?.[f]) missingFields.push(`${id}.${f}`);
    }
  }
  const missingReps = ['unit', 'note'].flatMap((g) =>
    Object.keys(ro.reps[g]).filter((k) => !cat.reps?.[g]?.[k]).map((k) => `${g}.${k}`));
  const brokenMarks = Object.entries(expectedMarks)
    .filter(([k, want]) => cat.ui?.[k] && marks(cat.ui[k]) !== want)
    .map(([k]) => k);

  // Un text cu plural cere toate formele pe care le are limba: araba are șase,
  // ucraineana patru, japoneza una. Lipsa uneia nu dă eroare, dă forma generală
  // acolo unde limba ar fi spus altfel.
  const forms = new Intl.PluralRules(code).resolvedOptions().pluralCategories;
  const brokenPlurals = Object.keys(ro.ui)
    .filter((k) => typeof ro.ui[k] === 'object')
    .filter((k) => cat.ui?.[k] && (typeof cat.ui[k] !== 'object' || forms.some((f) => !cat.ui[k][f])));

  const problems = missingUi.length + extraUi.length + missingEx.length
    + missingFields.length + missingReps.length + brokenMarks.length + brokenPlurals.length;
  if (problems) bad++;

  console.log(`${code.padEnd(4)} ${(problems ? 'INCOMPLETE' : 'complete').padEnd(11)}`
    + ` ui ${expectedUi.length - missingUi.length}/${expectedUi.length}`
    + `  exercises ${expectedEx.length - missingEx.length}/${expectedEx.length}`
    + `  effort words ${repCount - missingReps.length}/${repCount}`);
  if (missingUi.length) console.log(`     missing ui: ${missingUi.slice(0, 3).map((k) => JSON.stringify(k)).join(', ')}${missingUi.length > 3 ? ` … +${missingUi.length - 3}` : ''}`);
  if (extraUi.length) console.log(`     extra ui: ${extraUi.slice(0, 3).map((k) => JSON.stringify(k)).join(', ')}`);
  if (missingFields.length) console.log(`     missing text: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? ` … +${missingFields.length - 3}` : ''}`);
  if (brokenMarks.length) console.log(`     lost placeholder: ${brokenMarks.map((k) => JSON.stringify(k)).join(', ')}`);
  if (brokenPlurals.length) console.log(`     plural forms missing (${forms.join(', ')}): ${brokenPlurals.map((k) => JSON.stringify(k)).join(', ')}`);
}

if (process.argv.includes('--check') && bad) {
  console.error(`\n${bad} catalogue(s) incomplete.`);
  process.exit(1);
}
