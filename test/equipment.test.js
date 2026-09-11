import test from 'node:test';
import assert from 'node:assert/strict';
import { equipmentForExercises, equipmentInfo, expandEquipment, EQUIPMENT, EQUIPMENT_ORDER } from '../web/equipment.js';
import { filterSafeExercises } from '../server/routine.js';
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

test('heavy dumbbells stand in for light ones', async (t) => {
  await t.test('the rule runs one way only', () => {
    // Ganterele grele se pun pe trei kilograme; cele uşoare nu se fac grele.
    assert.ok(expandEquipment(['adjustable_dumbbells']).has('dumbbells'),
      'grele ar trebui să acopere uşoarele');
    assert.ok(!expandEquipment(['dumbbells']).has('adjustable_dumbbells'),
      'uşoarele nu au voie să acopere grelele');
  });

  await t.test('owning one adjustable pair is enough', () => {
    // Înainte, cine avea o singură pereche reglabilă era exclus de la curl,
    // presa de umeri şi ramatul aplecat, şi trebuia să bifeze şi „uşoare" --
    // adică să declare un echipament pe care nu-l are.
    const p = { level: 'intermediate', daily_time: 15, equipment: ['bodyweight', 'chair', 'wall', 'adjustable_dumbbells'] };
    const ids = filterSafeExercises(EXERCISES, p).map((e) => e.id);
    for (const id of ['dumbbell_seated_bicep_curl', 'dumbbell_seated_shoulder_press', 'dumbbell_bent_over_row']) {
      assert.ok(ids.includes(id), `${id} ar trebui să fie disponibil cu gantere grele`);
    }
  });

  await t.test('light dumbbells do not unlock the heavy compounds', () => {
    // Cealaltă direcţie ar fi mutat greşeala, nu ar fi reparat-o: cu două
    // kilograme, mersul fermierului şi îndreptările nu sunt o sesiune.
    const p = { level: 'intermediate', daily_time: 15, equipment: ['bodyweight', 'chair', 'wall', 'dumbbells'] };
    const ids = filterSafeExercises(EXERCISES, p).map((e) => e.id);
    for (const id of ['dumbbell_goblet_squat', 'dumbbell_romanian_deadlift', 'dumbbell_farmers_carry']) {
      assert.ok(!ids.includes(id), `${id} nu ar trebui deblocat de ganterele uşoare`);
    }
  });
});

test('the equipment offered is equipment the app can use', async (t) => {
  await t.test('the API catalogue matches the one table', async () => {
    // Serverul îşi ţinea propria listă, cu alte nume şi cu un `step_box` care
    // nu exista nici în interfaţă, nici în vreun exerciţiu.
    const { EQUIPMENT_CATALOG } = await import('../server/equipment.js');
    assert.deepEqual(EQUIPMENT_CATALOG.map((e) => e.id), EQUIPMENT_ORDER);
    for (const row of EQUIPMENT_CATALOG) {
      assert.equal(row.name_ro, EQUIPMENT[row.id].name, `${row.id}: nume diferit faţă de tabel`);
    }
  });
});
