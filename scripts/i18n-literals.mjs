// Text românesc în cod, care nu trece prin catalog.
//
// i18n-check.mjs măsoară cataloagele unul față de altul. Nu vede textul care
// n-a ajuns niciodată într-un catalog: „Seria 1 din 2" scris direct în
// marcaj, „secunde" pus ca unitate, „Tocmai bine" lăsat fără t(). Toate
// cataloagele ieșeau „complete", iar aplicația în engleză arăta română la
// mijlocul antrenamentului (testarea închisă, oct. 2026).
//
// Regula: orice text din cod care va ajunge pe ecran e o cheie din ro.json.
// Unde se traduce -- pe loc cu t() sau mai târziu, la desenare -- e treaba
// vederii; aici se verifică doar că are ce traduce. Se uită la două locuri:
// șiruri cu diacritice românești și textul dintre etichetele HTML din
// șabloane. Comentariile nu contează.
import fs from 'node:fs';

const ROOT = new URL('../web/', import.meta.url);
const ro = JSON.parse(fs.readFileSync(new URL('i18n/ro.json', ROOT), 'utf8'));
const keys = new Set(Object.keys(ro.ui));

// Catalogul de exerciții are textele lui în `ex`; restul sunt identificatori.
const SKIP = new Set(['exercises.js', 'i18n.js']);
const DIACRITIC = /[ăâîșțşţĂÂÎȘȚŞŢ]/;

const files = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.js') && !SKIP.has(f)),
  ...fs.readdirSync(new URL('engine/', ROOT)).filter((f) => f.endsWith('.js')).map((f) => `engine/${f}`)
];

/**
 * Șirurile din cod, cu linia lor: `quoted` pentru '…' și "…", `template`
 * pentru textul fix al unui șablon `…`, cu interpolările înlocuite de \u0000.
 * Expresiile din interpolări se citesc la rândul lor, fiindcă acolo stau
 * t('…') și șabloanele imbricate. Comentariile se sar.
 */
function tokens(src) {
  const out = [];
  let i = 0;
  const line = (at) => src.slice(0, at).split('\n').length;

  function quoted(q) {
    const start = i++;
    let text = '';
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') { text += src[i + 1]; i += 2; } else text += src[i++];
    }
    i++;
    out.push({ kind: 'quoted', text, line: line(start), before: src.slice(Math.max(0, start - 8), start) });
  }

  function template() {
    const start = i++;
    let text = '';
    while (i < src.length && src[i] !== '`') {
      if (src[i] === '\\') { text += src[i + 1]; i += 2; continue; }
      if (src[i] === '$' && src[i + 1] === '{') {
        i += 2;
        code('}');
        i++;
        text += '\u0000';
        continue;
      }
      text += src[i++];
    }
    i++;
    out.push({ kind: 'template', text, line: line(start), before: src.slice(Math.max(0, start - 8), start) });
  }

  // Cod până la `stop` (o acoladă de închidere), la adâncimea curentă.
  function code(stop) {
    let depth = 0;
    while (i < src.length) {
      const c = src[i];
      const next = src[i + 1];
      if (c === '/' && next === '*') { const e = src.indexOf('*/', i + 2); i = e === -1 ? src.length : e + 2; continue; }
      if (c === '/' && next === '/') { const e = src.indexOf('\n', i); i = e === -1 ? src.length : e; continue; }
      if (c === "'" || c === '"') { quoted(c); continue; }
      // O expresie regulată: `/"/g` nu deschide un șir.
      if (c === '/' && /[(,=:[!&|?;{}]\s*$|^\s*$|\breturn\s*$/.test(src.slice(Math.max(0, i - 12), i))) {
        i++;
        let inClass = false;
        while (i < src.length && (inClass || src[i] !== '/') && src[i] !== '\n') {
          if (src[i] === '\\') i++;
          else if (src[i] === '[') inClass = true;
          else if (src[i] === ']') inClass = false;
          i++;
        }
        i++;
        continue;
      }
      if (c === '`') { template(); continue; }
      if (c === '{') depth++;
      if (c === '}') { if (depth === 0 && stop === '}') return; depth--; }
      i++;
    }
  }

  code(null);
  return out;
}

const problems = [];
const isKeyCall = (before) => /\btn?\(\s*$/.test(before);

for (const file of files) {
  const src = fs.readFileSync(new URL(file, ROOT), 'utf8');
  for (const tok of tokens(src)) {
    if (tok.kind === 'quoted') {
      // Un argument al lui t() trebuie să fie cheie, cu sau fără diacritice.
      if ((isKeyCall(tok.before) || DIACRITIC.test(tok.text)) && !keys.has(tok.text)) {
        problems.push([file, tok.line, tok.text]);
      }
      continue;
    }
    // Un șablon dat direct lui t() e o cheie cu bucăți lipite: nu se poate traduce.
    if (isKeyCall(tok.before) && tok.text.includes('\u0000')) {
      problems.push([file, tok.line, tok.text.replace(/\u0000/g, '${…}')]);
      continue;
    }
    if (isKeyCall(tok.before)) {
      if (!keys.has(tok.text)) problems.push([file, tok.line, tok.text]);
      continue;
    }
    // Textul dintre etichete, plus orice bucată cu diacritice.
    const pieces = [];
    for (const m of tok.text.matchAll(/>([^<>]*)</g)) pieces.push(...m[1].split('\u0000'));
    for (const piece of tok.text.split(/<[^>]*>|\u0000/)) if (DIACRITIC.test(piece)) pieces.push(piece);
    for (const raw of pieces) {
      const text = raw.replace(/&\w+;/g, '').trim();
      if (!/\p{L}{2,}/u.test(text) || keys.has(text)) continue;
      problems.push([file, tok.line, text]);
    }
  }
}

if (problems.length) {
  console.error('Text pe ecran care nu e cheie în ro.json (adaugă-l în catalog și treci-l prin t()):');
  for (const [file, line, text] of problems) console.error(`  web/${file}:${line}  ${JSON.stringify(text)}`);
  process.exit(1);
}
console.log(`i18n literals: ${files.length} files, all screen text is in the catalogue`);
