// Lista limbilor care chiar au un catalog pe disc.
//
// Generată, nu scrisă de mână: un selector care oferă japoneza fără fișier de
// japoneză arată aplicația în română după alegere, fără niciun mesaj -- pare
// defectă, nu netradusă. Ce nu există nu se oferă.
import fs from 'node:fs';
import path from 'node:path';

const NATIVE = {
  ro: 'Română', en: 'English', ar: 'العربية', de: 'Deutsch', es: 'Español',
  fr: 'Français', hi: 'हिन्दी', ja: '日本語', ko: '한국어', pt: 'Português',
  uk: 'Українська', zh: '中文'
};
const RTL = new Set(['ar']);

const dir = new URL('../web/i18n/', import.meta.url);
const codes = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.json') && f !== 'index.json')
  .map((f) => path.basename(f, '.json'))
  .filter((c) => NATIVE[c])
  .sort((a, b) => NATIVE[a].localeCompare(NATIVE[b]));

const index = codes.map((code) => ({ code, name: NATIVE[code], dir: RTL.has(code) ? 'rtl' : 'ltr' }));
fs.writeFileSync(new URL('index.json', dir), JSON.stringify(index, null, 2) + '\n');
console.log(`i18n index: ${codes.length} language(s) — ${codes.join(', ')}`);
