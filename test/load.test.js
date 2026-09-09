import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLoad, formatLoad, stepLoad, shiftText } from '../server/load.js';
import { EXERCISES } from '../server/routine.js';

test('load parsing and stepping', async (t) => {
  await t.test('every format in the catalog can be read', () => {
    // Dacă un format scapă parserului, exercițiul devine imun la ajustare --
    // exact felul în care "30 secunde" nu se mișca deloc înainte.
    for (const ex of EXERCISES) {
      const load = parseLoad(ex.default_reps);
      assert.ok(load, `nu pot citi "${ex.default_reps}" (${ex.id})`);
      assert.ok(Number.isFinite(load.lo) && load.lo > 0, `valoare invalidă în ${ex.id}`);
    }
  });

  await t.test('reading and writing back leaves the text unchanged', () => {
    for (const ex of EXERCISES) {
      assert.equal(formatLoad(parseLoad(ex.default_reps)), ex.default_reps,
        `drum dus-întors alterat pentru ${ex.id}`);
    }
  });

  await t.test('durations move, which they never did before', () => {
    assert.equal(shiftText('30 secunde', 1), '35 secunde');
    assert.equal(shiftText('30 secunde', -1), '25 secunde');
    assert.equal(shiftText('20-30 secunde', 1), '25-35 secunde');
  });

  await t.test('reps move by two and keep the width of the range', () => {
    // Lățimea e marja zilei, nu o măsură a efortului: nu are motiv să crească.
    assert.equal(shiftText('8-10 repetări', 1), '10-12 repetări');
    assert.equal(shiftText('8-10 repetări', -1), '6-8 repetări');
    assert.equal(shiftText('8-12 repetări', 1), '10-14 repetări');
  });

  await t.test('digits that are not the effort are left alone', () => {
    // "(coborâre 3-4s)" descrie tehnica, nu volumul. Vechea expresie regulată
    // prindea primul interval întâlnit, oricare ar fi fost el.
    assert.equal(shiftText('5-6 repetări (coborâre 3-4s)', 1), '7-8 repetări (coborâre 3-4s)');
    assert.equal(shiftText('8-10 repetări (menținere 2s)', 1), '10-12 repetări (menținere 2s)');
    assert.equal(shiftText('15-20 secunde pe fiecare parte', 1), '20-25 secunde pe fiecare parte');
  });

  await t.test('single numbers stay single', () => {
    assert.equal(shiftText('10 repetări alternativ', 1), '12 repetări alternativ');
    assert.equal(shiftText('30 secunde', 2), '40 secunde');
  });

  await t.test('there is a floor, and it cannot invert the range', () => {
    // Strâns la podea, un interval prost calculat ar fi ieșit "6-4".
    const low = stepLoad(parseLoad('6-8 repetări'), -5);
    assert.equal(low.lo, 4);
    assert.ok(low.hi >= low.lo, 'capătul de sus nu poate coborî sub cel de jos');
    assert.equal(formatLoad(low), '4-6 repetări');
    assert.equal(shiftText('20-30 secunde', -10), '15-25 secunde');
  });

  await t.test('a step of zero changes nothing', () => {
    for (const ex of EXERCISES) {
      assert.equal(shiftText(ex.default_reps, 0), ex.default_reps);
    }
  });

  await t.test('text that is not a number is returned untouched', () => {
    assert.equal(shiftText('cât poți', 1), 'cât poți');
    assert.equal(shiftText('', 1), '');
    assert.equal(shiftText(null, 1), null);
  });
});
