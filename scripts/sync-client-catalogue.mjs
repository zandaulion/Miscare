/**
 * Copiază din catalogul serverului în cel al clientului câmpurile de care are
 * nevoie interfața: efortul și sugestiile de confort.
 *
 * Sunt două cataloage fiindcă fiecare știe altceva: serverul are efortul,
 * tiparul și zonele sigure; clientul are desenul, fotografia, animația și
 * alternativele. Compendiul are însă nevoie și de efort, ca să scrie „volumul
 * uzual" -- iar scris de mână a doua oară s-ar fi depărtat de primul, exact
 * cum s-a întâmplat cu textele exercițiilor.
 *
 * Deci se generează. Testul din test/catalogue.test.js verifică apoi că cele
 * două chiar coincid, ca să nu treacă neobservat dacă cineva editează pe loc.
 */
import fs from 'node:fs';
import { EXERCISES } from '../server/routine.js';

const file = new URL('../web/exercises.js', import.meta.url);
let src = fs.readFileSync(file, 'utf8');

let added = 0;
let updated = 0;
for (const ex of EXERCISES) {
  const marker = `    id: '${ex.id}',`;
  const at = src.indexOf(marker);
  if (at === -1) {
    console.error(`lipsește din catalogul clientului: ${ex.id}`);
    process.exitCode = 1;
    continue;
  }
  const fields = [`reps: ${JSON.stringify(ex.reps)}`];
  if (ex.comfort && ex.comfort.length) fields.push(`comfort: ${JSON.stringify(ex.comfort)}`);
  const line = fields.map((f) => `    ${f},`).join('\n');
  // Câmpul generat stă imediat sub id, ca să se vadă că nu se editează aici.
  const after = src.indexOf('\n', at) + 1;
  const existing = /^(?: {4}(?:reps|comfort): .*\n)+/.exec(src.slice(after));
  if (existing) {
    if (existing[0] === line + '\n') continue;
    src = src.slice(0, after) + line + '\n' + src.slice(after + existing[0].length);
    updated++;
  } else {
    src = src.slice(0, after) + line + '\n' + src.slice(after);
    added++;
  }
}

fs.writeFileSync(file, src);
console.log(`catalog sincronizat: ${added} adăugate, ${updated} actualizate, din ${EXERCISES.length}`);
