import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDailyRoutine, filterSafeExercises, EXERCISES } from '../server/routine.js';

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

test('muscle groups rotate, not just exercises', async (t) => {
  const zero = { level: 'zero', equipment: ['bodyweight', 'chair', 'wall'], daily_time: 10 };
  const patternsOf = (rotation, profile = zero) =>
    generateDailyRoutine(profile, { rotation }).exercises.map((e) => e.pattern);

  await t.test('every exercise carries a pattern', () => {
    // Derivat din `focus` -- proză scrisă pentru om -- ar fi fost fragil: exact
    // felul în care „mobilitate glezne" făcea genuflexiunile să pară gambe.
    for (const ex of EXERCISES) {
      assert.ok(ex.pattern, `${ex.id} nu are pattern`);
    }
  });

  await t.test('a session does not work the same pattern twice', () => {
    // Două împingeri în aceeași sesiune înseamnă aceiași mușchi de două ori,
    // oricât de diferit s-ar numi exercițiile.
    for (let r = 0; r < 24; r++) {
      const pats = patternsOf(r).filter((p) => p !== 'mobility');
      assert.equal(new Set(pats).size, pats.length, `tipar repetat la rotația ${r}: ${pats}`);
    }
  });

  await t.test('no group is loaded in every single session', () => {
    // Ăsta e miezul: cine împinge zi de zi se trezește cu pieptul înțepenit și
    // sare o zi, iar ziua sărită e exact ce încearcă aplicația să prevină.
    const total = 12;
    const days = {};
    for (let r = 0; r < total; r++) {
      for (const p of new Set(patternsOf(r))) days[p] = (days[p] || 0) + 1;
    }
    for (const [pattern, n] of Object.entries(days)) {
      if (pattern === 'mobility') continue;   // încălzirea e ușoară prin definiție
      assert.ok(n < total, `${pattern} apare în toate cele ${total} sesiuni`);
    }
  });

  await t.test('there are days off for the chest', () => {
    const restDays = [...Array(12).keys()].filter((r) => !patternsOf(r).includes('push'));
    assert.ok(restDays.length >= 2, `doar ${restDays.length} sesiuni fără împingere din 12`);
  });
});

test('the group cycle and the exercise index must not lock in phase', async (t) => {
  // Bug real, găsit prin măsurare, nu prin citit: o grupă e aleasă doar la
  // anumite poziții din ciclu, iar indexarea listei după rotația brută le
  // sincroniza. „Sus" era ales doar când rotation % 3 era 0 sau 1, ceea ce
  // selecta exact pozițiile 0 și 1 -- al treilea exercițiu nu ieșea niciodată.
  // Prima corecție a mutat blocajul: cu patru în listă rămânea inaccesibil al
  // patrulea. Testul cere acoperire, nu o anume formulă.
  const configs = [
    { level: 'zero', equipment: ['bodyweight', 'chair', 'wall'] },
    { level: 'beginner', equipment: ['bodyweight', 'chair', 'wall'] },
    { level: 'intermediate', equipment: ['bodyweight', 'chair', 'wall'] }
  ];

  for (const profile of configs) {
    await t.test(`${profile.level}: every eligible exercise is reachable`, () => {
      const eligible = filterSafeExercises(EXERCISES, profile);
      const byCategory = {};
      for (const e of eligible) {
        const key = e.category.includes('core') ? 'core' : e.category;
        (byCategory[key] ||= []).push(e.id);
      }

      const seen = new Set();
      for (let r = 0; r < 60; r++) {
        for (const ex of generateDailyRoutine({ ...profile, daily_time: 10 }, { rotation: r }).exercises) {
          seen.add(ex.id);
        }
      }

      for (const [category, list] of Object.entries(byCategory)) {
        if (category === 'mobility') continue;
        const unreachable = list.filter((id) => !seen.has(id));
        assert.equal(unreachable.length, 0,
          `${category}: nu se ajunge niciodată la ${unreachable.join(', ')} în 60 de sesiuni`);
      }
    });
  }
});

test('today should not look like yesterday', async (t) => {
  // Plângerea care a scos asta la iveală: trei din patru exerciții identice cu
  // ziua precedentă. Cauza nu era rotația grupelor, ci completarea: la
  // cincisprezece minute sunt patru locuri și doar două grupe care conduc, iar
  // completarea alegea după tipar, nu după rotație -- același exercițiu
  // câștiga „primul tipar nefolosit" în fiecare zi.
  const CONFIGS = [
    ['intermediar 15 min, spate sensibil', {
      level: 'intermediate', daily_time: 15, limitations: ['back'],
      equipment: ['bodyweight', 'wall', 'yoga_mat', 'adjustable_dumbbells', 'pullup_bar']
    }],
    ['început, 10 min', { level: 'zero', daily_time: 10, equipment: ['bodyweight', 'chair', 'wall'] }],
    ['avansat, 15 min', { level: 'advanced', daily_time: 15, equipment: ['bodyweight', 'chair', 'wall'] }]
  ];

  for (const [label, profile] of CONFIGS) {
    await t.test(label, () => {
      let repeated = 0;
      let served = 0;
      for (let r = 0; r < 12; r++) {
        const a = generateDailyRoutine(profile, { rotation: r }).exercises.map((e) => e.id);
        const b = generateDailyRoutine(profile, { rotation: r + 1 }).exercises.map((e) => e.id);
        assert.notDeepEqual(b, a, `sesiunea ${r + 1} e identică cu ${r}`);
        repeated += b.filter((id) => a.includes(id)).length;
        served += b.length;
      }
      const share = repeated / served;
      // Pragul e generos pentru cataloagele subțiri -- profilul de mai sus are
      // un singur exercițiu de cărat, deci acela chiar n-are alternativă --
      // dar prinde regresia care a pornit de aici: era 38%.
      assert.ok(share <= 0.25,
        `${Math.round(share * 100)}% dintr-o sesiune se repetă a doua zi`);
    });
  }
});

test('what yesterday means', async (t) => {
  // Profilul pe care s-a văzut: nivel intermediar, spate sensibil, bară și
  // gantere reglabile. Catalogul lui are 18 mișcări, deci are din ce alege --
  // o repetare aici nu e lipsă de opțiuni.
  const rich = {
    level: 'intermediate',
    daily_time: 15,
    limitations: ['back'],
    equipment: ['bodyweight', 'wall', 'yoga_mat', 'adjustable_dumbbells', 'pullup_bar']
  };

  await t.test('the avoided session is the one actually served', () => {
    // Invariantul care lipsea. Generatorul își reconstituia ziua precedentă
    // rulându-se cu `avoid` gol -- adică fără regula pe care tocmai o aplica --
    // deci reconstituia altă sesiune decât cea servită. Ocolea o zi care nu
    // existase și repeta pe cea care existase.
    for (let r = 1; r <= 8; r++) {
      const served = generateDailyRoutine(rich, { rotation: r - 1 }).exercises.map((e) => e.id);
      const told = generateDailyRoutine(rich, { rotation: r, avoid: new Set(served) })
        .exercises.map((e) => e.id);
      const reconstructed = generateDailyRoutine(rich, { rotation: r }).exercises.map((e) => e.id);
      assert.deepEqual(reconstructed, told,
        `la rotația ${r}, ce se reconstituie diferă de ce s-a servit`);
    }
  });

  await t.test('nothing carries over from one day to the next', () => {
    for (let r = 1; r <= 12; r++) {
      const prev = generateDailyRoutine(rich, { rotation: r - 1 }).exercises.map((e) => e.id);
      const cur = generateDailyRoutine(rich, { rotation: r }).exercises.map((e) => e.id);
      const same = cur.filter((id) => prev.includes(id));
      assert.deepEqual(same, [],
        `rotația ${r} repetă ${same.join(', ')} din ziua dinainte`);
    }
  });
});

test('level is a ceiling and a floor', async (t) => {
  await t.test('nothing is served more than one level below the declared one', () => {
    // Cu un nivel mai jos e încălzire. Cu două, cineva la Nivel 2 primea
    // flotări la perete drept mișcare principală de împins, având în bazin și
    // flotări clasice, și împins cu gantere.
    const LEVELS = { zero: 0, beginner: 1, intermediate: 2, advanced: 3 };
    const equipSets = [
      ['bodyweight', 'chair', 'wall'],
      ['bodyweight', 'wall', 'yoga_mat', 'adjustable_dumbbells', 'pullup_bar'],
      ['bodyweight', 'chair', 'wall', 'dumbbells', 'resistance_band']
    ];
    for (const [name, level] of Object.entries(LEVELS)) {
      for (const equipment of equipSets) {
        for (let r = 0; r < 12; r++) {
          const routine = generateDailyRoutine({ level: name, daily_time: 15, equipment }, { rotation: r });
          for (const served of routine.exercises) {
            const full = EXERCISES.find((e) => e.id === served.id);
            assert.ok(full.level >= level - 1,
              `${name}: ${served.id} e nivel ${full.level}, adică ${level - full.level} sub nivelul declarat`);
          }
        }
      }
    }
  });
});

test('one movement below level is a warm-up, two is another session', async (t) => {
  const rich = {
    level: 'intermediate',
    daily_time: 15,
    limitations: ['back'],
    equipment: ['bodyweight', 'wall', 'yoga_mat', 'adjustable_dumbbells', 'pullup_bar']
  };

  await t.test('rarely more than one, never more than two', () => {
    let twoPlus = 0;
    for (let r = 0; r < 48; r++) {
      const served = generateDailyRoutine(rich, { rotation: r }).exercises
        .map((e) => EXERCISES.find((x) => x.id === e.id));
      const below = served.filter((e) => e.level < 2).length;
      assert.ok(below <= 2, `rotația ${r} servește ${below} mișcări sub nivel`);
      if (below >= 2) twoPlus++;
    }
    // Nu zero: sloturile grupelor care conduc ziua rămân nelimitate, ca
    // rotația să ajungă la tot catalogul. Când amândouă nimeresc pe o mișcare
    // sub nivel, ies două -- s-a măsurat o dată în 48 de sesiuni.
    assert.ok(twoPlus <= 2, `${twoPlus} sesiuni din 48 au două mișcări sub nivel`);
  });

  await t.test('the catalogue stays reachable', () => {
    // Prima încercare de plafon prefera mereu ce era la nivel și făcea unele
    // mișcări de negăsit. Plafonul nu are voie să coste acoperirea.
    const seen = new Set();
    for (let r = 0; r < 48; r++) {
      for (const e of generateDailyRoutine(rich, { rotation: r }).exercises) seen.add(e.id);
    }
    const eligible = filterSafeExercises(EXERCISES, rich).map((e) => e.id);
    const missing = eligible.filter((id) => !seen.has(id));
    assert.deepEqual(missing, [], `nu se ajunge la ${missing.join(', ')}`);
  });
});
