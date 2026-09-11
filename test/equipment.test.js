import test from 'node:test';
import assert from 'node:assert/strict';
import { equipmentForExercises, equipmentInfo, EQUIPMENT, EQUIPMENT_ORDER } from '../web/equipment.js';
import { EXERCISES } from '../server/routine.js';

test('what to gather before starting', async (t) => {
  await t.test('the union of what the day needs, without repeats', () => {
    const got = equipmentForExercises([
      { equipment: ['wall', 'bodyweight'] },
      { equipment: ['chair'] },
      { equipment: ['wall'] }
    ]);
    assert.deepEqual(got, ['chair', 'wall']);
  });

  await t.test('bodyweight is not something you go and fetch', () => {
    // Nu e o omisiune: nu se strânge de nicăieri. Când e singura, lista iese
    // goală, iar cardul spune asta în loc să arate o pastilă fără rost.
    assert.deepEqual(equipmentForExercises([{ equipment: ['bodyweight'] }]), []);
  });

  await t.test('the order is the same no matter how the day is arranged', () => {
    // Altfel lista s-ar rearanja de la o zi la alta pentru același conținut,
    // iar ochiul n-ar mai recunoaște-o dintr-o privire.
    const a = equipmentForExercises([{ equipment: ['pullup_bar'] }, { equipment: ['chair'] }]);
    const b = equipmentForExercises([{ equipment: ['chair'] }, { equipment: ['pullup_bar'] }]);
    assert.deepEqual(a, b);
    assert.deepEqual(a, ['chair', 'pullup_bar']);
  });

  await t.test('nothing in the catalogue is unknown to the table', () => {
    // Prinde un echipament adăugat în catalog fără intrare aici: altfel ar
    // apărea pe ecran identificatorul brut, ca `core_glutes` în compendiu.
    const missing = new Set();
    for (const ex of EXERCISES) {
      for (const id of ex.equipment) if (!EQUIPMENT[id]) missing.add(id);
    }
    assert.deepEqual([...missing], []);
  });

  await t.test('an unknown id degrades instead of breaking', () => {
    const info = equipmentInfo('trambulina');
    assert.equal(info.name, 'trambulina');
    assert.ok(info.icon, 'trebuie să rămână ceva de desenat');
    assert.deepEqual(equipmentForExercises([{ equipment: ['trambulina'] }]), [],
      'necunoscutul nu intră în ordinea cunoscută');
  });

  await t.test('every entry has both a long and a short name', () => {
    // Vederea de echipament folosește forma lungă, pastilele pe cea scurtă.
    for (const id of EQUIPMENT_ORDER) {
      assert.ok(EQUIPMENT[id].name, `${id} fără nume lung`);
      assert.ok(EQUIPMENT[id].short, `${id} fără nume scurt`);
      assert.ok(EQUIPMENT[id].icon, `${id} fără pictogramă`);
    }
  });
});
