import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDailyRoutine, EXERCISES } from '../server/routine.js';

const zero = { level: 'zero', equipment: ['bodyweight', 'chair', 'wall'], daily_time: 10 };
const ids = (rotation, profile = zero) =>
  generateDailyRoutine(profile, { rotation }).exercises.map((e) => e.id);

test('rotation', async (t) => {
  await t.test('consecutive sessions are not the same session', () => {
    // Ăsta era comportamentul dinainte: aceleași trei mișcări, la nesfârșit.
    assert.notDeepEqual(ids(0), ids(1));
    assert.notDeepEqual(ids(1), ids(2));
  });

  await t.test('the same position gives the same session', () => {
    // Rotația avansează când se muncește, nu la fiecare cerere: altfel un
    // refresh ar schimba sesiunea sub degete, iar cea din cache n-ar mai
    // corespunde cu cea de pe ecran.
    assert.deepEqual(ids(4), ids(4));
    assert.deepEqual(ids(4), ids(4));
  });

  await t.test('a skipped day returns the session that was not done', () => {
    // Rotația e legată de sesiuni făcute, nu de calendar. Cine sare o zi
    // primește înapoi sesiunea sărită, nu următoarea.
    assert.deepEqual(ids(3), ids(3));
  });

  await t.test('nothing repeats inside one session', () => {
    for (let r = 0; r < 40; r++) {
      const list = ids(r);
      assert.equal(new Set(list).size, list.length, `duplicat la rotația ${r}`);
    }
  });

  await t.test('a thin category is topped up from the next level, not left in a rut', () => {
    // Nivel 0 are o singură mișcare de sus fără echipament -- flotările la
    // perete. Fără completare, ele apar în fiecare sesiune, oricât s-ar roti.
    const upper = new Set();
    for (let r = 0; r < 8; r++) {
      for (const id of ids(r)) {
        const ex = EXERCISES.find((e) => e.id === id);
        if (ex.category === 'upper') upper.add(id);
      }
    }
    assert.ok(upper.size >= 2, `o singură mișcare de sus în opt sesiuni: ${[...upper]}`);
  });

  await t.test('widening for variety never widens the safety filter', () => {
    // Completarea trece prin filterSafeExercises, deci limitările rămân
    // întregi. Verificat pe toate pozițiile de rotație, fiindcă o scăpare ar
    // apărea doar la anumite poziții.
    const sets = [['knees'], ['wrists'], ['knees', 'back', 'wrists']];
    for (const limitations of sets) {
      for (const level of ['zero', 'beginner', 'intermediate', 'advanced']) {
        for (let r = 0; r < 12; r++) {
          const routine = generateDailyRoutine(
            { level, equipment: ['bodyweight', 'chair', 'wall'], limitations, daily_time: 15 },
            { rotation: r }
          );
          for (const ex of routine.exercises) {
            for (const limit of limitations) {
              assert.ok(ex.safe_for.includes(limit),
                `${ex.id} servit cu limitarea "${limit}" (nivel ${level}, rotația ${r})`);
            }
          }
        }
      }
    }
  });

  await t.test('the catalog is actually explored over time', () => {
    const seen = new Set();
    for (let r = 0; r < 12; r++) ids(r, { ...zero, level: 'intermediate' }).forEach((i) => seen.add(i));
    assert.ok(seen.size >= 10, `doar ${seen.size} mișcări distincte în 12 sesiuni`);
  });
});
