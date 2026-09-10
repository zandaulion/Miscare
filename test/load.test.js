import test from 'node:test';
import assert from 'node:assert/strict';
import { stepReps, formatReps, UNITS } from '../server/load.js';
import { EXERCISES } from '../server/routine.js';
import fs from 'node:fs';

const ro = JSON.parse(fs.readFileSync(new URL('../web/i18n/ro.json', import.meta.url), 'utf8'));

test('effort as data', async (t) => {
  await t.test('every exercise carries a structured target', () => {
    for (const ex of EXERCISES) {
      assert.ok(ex.reps, `${ex.id} nu are reps`);
      assert.ok(Number.isFinite(ex.reps.lo) && ex.reps.lo > 0, `${ex.id} lo invalid`);
      assert.ok(ex.reps.hi >= ex.reps.lo, `${ex.id} interval inversat`);
      assert.ok(UNITS.includes(ex.reps.unit), `${ex.id} unitate necunoscută: ${ex.reps.unit}`);
    }
  });

  await t.test('the unit is a field, not a word in a sentence', () => {
    // Motivul întregii restructurări: pasul nu mai depinde de limbă.
    const timed = { lo: 30, hi: 30, unit: 'seconds' };
    const counted = { lo: 8, hi: 10, unit: 'reps' };
    assert.equal(stepReps(timed, 1).lo, 35, 'secundele se mișcă din cinci în cinci');
    assert.equal(stepReps(counted, 1).lo, 10, 'repetările din două în două');
  });

  await t.test('a range keeps its width', () => {
    // Lățimea e marja zilei, nu o măsură a efortului.
    const out = stepReps({ lo: 8, hi: 12, unit: 'reps' }, 1);
    assert.deepEqual([out.lo, out.hi], [10, 14]);
  });

  await t.test('there is a floor, and it cannot invert the range', () => {
    const low = stepReps({ lo: 6, hi: 8, unit: 'reps' }, -5);
    assert.equal(low.lo, 4);
    assert.ok(low.hi >= low.lo);
    assert.equal(stepReps({ lo: 20, hi: 30, unit: 'seconds' }, -10).lo, 15);
  });

  await t.test('a step of zero changes nothing', () => {
    for (const ex of EXERCISES) assert.deepEqual(stepReps(ex.reps, 0), ex.reps);
  });

  await t.test('the text is composed from the catalogue of the chosen language', () => {
    assert.equal(formatReps({ lo: 8, hi: 10, unit: 'reps' }, ro), '8-10 repetări');
    assert.equal(formatReps({ lo: 30, hi: 30, unit: 'seconds' }, ro), '30 secunde');
    assert.equal(formatReps({ lo: 15, hi: 20, unit: 'seconds', note: 'eachSide' }, ro),
      '15-20 secunde pe fiecare parte');
  });

  await t.test('a missing word loses the qualifier, never the number', () => {
    // Numărul e partea pe care nimeni nu o poate ghici din context.
    assert.equal(formatReps({ lo: 8, hi: 10, unit: 'reps', note: 'nonexistent' }, ro), '8-10 repetări');
    assert.equal(formatReps({ lo: 12, hi: 12, unit: 'reps' }, {}), '12');
  });

  await t.test('every unit and qualifier in the catalogue has Romanian words', () => {
    for (const ex of EXERCISES) {
      assert.ok(ro.reps.unit[ex.reps.unit], `lipsește cuvântul pentru unitatea ${ex.reps.unit}`);
      if (ex.reps.note) assert.ok(ro.reps.note[ex.reps.note], `lipsește ${ex.reps.note}`);
    }
  });
});
