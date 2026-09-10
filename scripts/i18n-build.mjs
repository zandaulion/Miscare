/**
 * Scrie catalogul unei limbi dintr-un fișier de valori, una pe linie.
 *
 *   node scripts/i18n-build.mjs de Deutsch ltr valori-de.txt
 */
import fs from 'node:fs';
import { build, slots } from './i18n-slots.mjs';

const [code, name, dir, file] = process.argv.slice(2);
if (!code || !name || !dir || !file) {
  console.error('folosire: i18n-build.mjs <cod> <nume nativ> <ltr|rtl> <fișier valori>');
  process.exit(2);
}

const values = fs.readFileSync(file, 'utf8').replace(/\n$/, '').split('\n');
const out = build(values, { code, name, dir });

const dest = new URL(`../web/i18n/${code}.json`, import.meta.url);
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log(`${code}: ${slots().length} sloturi -> web/i18n/${code}.json`);
