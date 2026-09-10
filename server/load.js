/**
 * Cât de mult, ca date — și cum se mișcă în sus sau în jos.
 *
 * Efortul era scris ca text: "8-10 repetări", "30 secunde". Funcționa cât timp
 * aplicația vorbea o singură limbă, fiindcă unitatea se citea din cuvânt --
 * `/^\s*secunde/` decidea dacă un pas înseamnă cinci secunde sau două
 * repetări. În clipa în care catalogul s-ar fi tradus, "30 seconds" ar fi fost
 * luat drept repetări și fiecare exercițiu pe timp ar fi început să crească cu
 * doi în loc de cinci, tăcut, în toate limbile deodată.
 *
 * Aici unitatea e un câmp, nu un cuvânt. Textul se compune la afișare, din
 * catalogul limbii curente.
 */

// Un pas: câte repetări, respectiv câte secunde. Secundele se mișcă mai
// mărunt, fiindcă un exercițiu de 20 de secunde sărit direct la 30 e o
// creștere de 50%, nu un pas.
const STEP = { reps: 2, seconds: 5, taps: 2 };
// Sub atât nu mai e exercițiu, e gest.
const FLOOR = { reps: 4, seconds: 15, taps: 4 };

export const UNITS = Object.keys(STEP);

/**
 * Mută efortul cu `steps` trepte, în sus sau în jos.
 *
 * Intervalul se mută întreg, păstrându-și lățimea: 8-10 devine 10-12, nu 8-12.
 * Lățimea e spațiul de manevră al zilei -- unii oameni au zile de 8 și zile de
 * 10 -- și nu are motiv să crească odată cu efortul.
 */
export function stepReps(reps, steps = 0) {
  if (!reps || typeof reps !== 'object') return reps;
  const size = STEP[reps.unit] ?? STEP.reps;
  const floor = FLOOR[reps.unit] ?? FLOOR.reps;
  const width = Math.max(0, (reps.hi ?? reps.lo) - reps.lo);

  const lo = Math.max(floor, Math.round(reps.lo + steps * size));
  return { ...reps, lo, hi: lo + width };
}

/**
 * Efortul, scris în limba cerută.
 *
 * `strings` vine din catalogul limbii: `reps.unit.<unitate>` dă cuvântul, iar
 * `reps.note.<calificativ>` dă coada ("pe fiecare parte", "menținere 2s").
 * Lipsa unei chei nu aruncă -- se pierde calificativul, nu numărul, fiindcă
 * numărul e partea pe care nimeni nu o poate ghici din context.
 */
export function formatReps(reps, strings = {}) {
  if (!reps || typeof reps !== 'object') return '';
  const range = reps.hi && reps.hi !== reps.lo ? `${reps.lo}-${reps.hi}` : `${reps.lo}`;
  const unit = strings?.reps?.unit?.[reps.unit] ?? '';
  const note = reps.note ? (strings?.reps?.note?.[reps.note] ?? '') : '';
  return [range, unit, note].filter(Boolean).join(' ');
}
