/**
 * Cât de mult, exprimat în cuvinte — și cum se mișcă în sus sau în jos.
 *
 * Catalogul scrie efortul ca text: "8-10 repetări", "30 secunde",
 * "15-20 secunde pe fiecare parte". Varianta veche umbla direct pe text cu o
 * expresie regulată și scădea 2, ceea ce mergea pentru jumătate din formate și
 * eșua tăcut pentru restul: "30 secunde" nu se schimba niciodată, deci
 * planșele și statul la perete nu deveneau nici mai ușoare, nici mai grele,
 * oricât ar fi raportat cineva.
 *
 * Aici textul se citește o dată într-o structură, se mută numeric, apoi se
 * scrie la loc. Partea de după numere rămâne intactă — "(menținere 2s)" și
 * "(coborâre 3-4s)" conțin cifre care nu descriu efortul și nu au ce căuta în
 * calcul.
 */

// Un pas: câte repetări, respectiv câte secunde. Secundele se mișcă mai
// mărunt, fiindcă un exercițiu de 20 de secunde sărit direct la 30 e o
// creștere de 50%, nu un pas.
const STEP_REPS = 2;
const STEP_SECONDS = 5;

// Sub atât nu mai e exercițiu, e gest.
const FLOOR_REPS = 4;
const FLOOR_SECONDS = 15;

/** Prima valoare din șir — un număr sau un interval — plus restul, neatins. */
export function parseLoad(text) {
  const raw = String(text ?? '').trim();
  const m = raw.match(/^(\d+)(?:\s*-\s*(\d+))?(.*)$/s);
  if (!m) return null;

  const lo = parseInt(m[1], 10);
  const hi = m[2] ? parseInt(m[2], 10) : lo;
  const suffix = m[3] ?? '';

  // Secunde sau repetări: decide primul cuvânt de după numere, nu ghicitul.
  const unit = /^\s*secunde/i.test(suffix) ? 'seconds' : 'reps';

  return { lo, hi, unit, suffix, ranged: Boolean(m[2]) };
}

export function formatLoad(load) {
  if (!load) return '';
  return load.ranged && load.hi !== load.lo
    ? `${load.lo}-${load.hi}${load.suffix}`
    : `${load.lo}${load.suffix}`;
}

/**
 * Mută efortul cu `steps` trepte, în sus sau în jos.
 *
 * Intervalul se mută întreg, păstrându-și lățimea: "8-10" devine "10-12", nu
 * "8-12". Lățimea e spațiul de manevră al zilei — unii oameni au zile de 8 și
 * zile de 10 — și nu are motiv să crească odată cu efortul.
 *
 * Podeaua se aplică pe capătul de jos, iar capătul de sus îl urmează, ca un
 * interval strâns la limită să nu se răstoarne în "6-4".
 */
export function stepLoad(load, steps) {
  if (!load || !Number.isFinite(steps) || steps === 0) return load;

  const size = load.unit === 'seconds' ? STEP_SECONDS : STEP_REPS;
  const floor = load.unit === 'seconds' ? FLOOR_SECONDS : FLOOR_REPS;
  const width = load.hi - load.lo;

  const lo = Math.max(floor, load.lo + steps * size);
  return { ...load, lo, hi: lo + width };
}

/** Textul catalogului, mutat cu câteva trepte și scris la loc. */
export function shiftText(text, steps) {
  const load = parseLoad(text);
  if (!load) return text;          // ceva ce nu începe cu un număr rămâne cum e
  return formatLoad(stepLoad(load, steps));
}
