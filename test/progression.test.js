import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyFeedback, proposeChange, nextLevel, previousLevel,
  MAX_STEP, MIN_STEP, EASY_STREAK_FOR_MORE, REENTRY_DAYS
} from '../server/progression.js';
import { generateDailyRoutine, EXERCISES } from '../server/routine.js';

const base = { level: 'zero', daily_time: 10, equipment: ['bodyweight', 'chair', 'wall'] };

test('progression', async (t) => {
  await t.test('going down is automatic; going up never is', () => {
    // Cine tocmai s-a chinuit nu are de ce să confirme asta printr-un dialog.
    assert.equal(applyFeedback({ rep_step: 0, easy_streak: 0 }, 'hard').rep_step, -1);
    // Iar o sesiune ușoară nu urcă nimic singură -- doar pornește numărătoarea.
    assert.equal(applyFeedback({ rep_step: 0, easy_streak: 0 }, 'easy').rep_step, 0);
    assert.equal(applyFeedback({ rep_step: 0, easy_streak: 0 }, 'easy').easy_streak, 1);
  });

  await t.test('one easy day is a good day, not a trend', () => {
    assert.equal(proposeChange({ level: 'zero', repStep: 0, easyStreak: 1 }), null);
    assert.equal(proposeChange({ level: 'zero', repStep: 0, easyStreak: 0 }), null);
  });

  await t.test('two in a row asks for a little more', () => {
    const p = proposeChange({ level: 'zero', repStep: 0, easyStreak: EASY_STREAK_FOR_MORE });
    assert.equal(p.kind, 'more_reps');
    assert.equal(p.to.rep_step, 1);
    assert.ok(p.decline_label, 'refuzul trebuie să fie la fel de la îndemână ca acceptul');
  });

  await t.test('when reps are already high, the answer is a level, not more volume', () => {
    const p = proposeChange({ level: 'zero', repStep: MAX_STEP, easyStreak: 2 });
    assert.equal(p.kind, 'level_up');
    assert.equal(p.to.level, 'beginner');
    assert.equal(p.to.rep_step, 0, 'nivelul nou pornește de la baza lui, nu de la vârful celui vechi');
  });

  await t.test('nothing is proposed past the top of the catalog', () => {
    assert.equal(proposeChange({ level: 'advanced', repStep: MAX_STEP, easyStreak: 5 }), null);
    assert.equal(nextLevel('advanced'), null);
    assert.equal(previousLevel('zero'), null);
  });

  await t.test('a long pause is asked about, not decided', () => {
    const p = proposeChange({ level: 'zero', repStep: 2, easyStreak: 0, daysSinceLastSession: 8 });
    assert.equal(p.kind, 'ease_back');
    assert.equal(p.to.rep_step, 1, 'propune mai ușor, nu impune');
    assert.match(p.question, /8 zile/);
    assert.ok(p.decline_label.length, 'trebuie să se poată continua de unde a rămas');
  });

  await t.test('the pause question comes before the progress question', () => {
    // Cel mai proaspăt lucru despre om e că a lipsit, nu că i-a fost ușor
    // acum două săptămâni.
    const p = proposeChange({ level: 'zero', repStep: 0, easyStreak: 5, daysSinceLastSession: 10 });
    assert.equal(p.kind, 'ease_back');
  });

  await t.test('every proposal says you can go back', () => {
    // Promisiunea aplicației, nu o formulare întâmplătoare: dacă o propunere
    // nu spune că e reversibilă, e o cerere, nu o ofertă.
    const all = [
      proposeChange({ level: 'zero', repStep: 0, easyStreak: 2 }),
      proposeChange({ level: 'zero', repStep: MAX_STEP, easyStreak: 2 }),
      proposeChange({ level: 'beginner', repStep: 1, easyStreak: 0, daysSinceLastSession: 6 })
    ];
    for (const p of all) {
      assert.ok(p, 'propunerea trebuie să existe');
      assert.ok(p.note && p.note.length > 10, `${p.kind} nu explică revenirea`);
      assert.ok(p.accept_label && p.decline_label, `${p.kind} nu oferă ambele răspunsuri`);
    }
  });

  await t.test('steps are clamped at both ends', () => {
    let s = { rep_step: MIN_STEP, easy_streak: 0 };
    for (let i = 0; i < 5; i++) s = applyFeedback(s, 'hard');
    assert.equal(s.rep_step, MIN_STEP, 'nu se coboară la nesfârșit');
    assert.equal(proposeChange({ level: 'advanced', repStep: MAX_STEP + 9, easyStreak: 3 }), null);
  });

  await t.test('the step actually moves what the session asks for', () => {
    // Testul care lipsea: vechile teste verificau doar mesajul, deci volumul
    // putea sta pe loc fără ca nimic să pice.
    const at = (repStep) => generateDailyRoutine(base, { repStep }).exercises.map((e) => JSON.stringify(e.reps));
    const flat = at(0);
    const up = at(2);
    const down = at(-2);
    assert.notDeepEqual(up, flat, 'o treaptă în sus trebuie să schimbe efortul');
    assert.notDeepEqual(down, flat, 'o treaptă în jos trebuie să schimbe efortul');
  });

  await t.test('duration exercises move too', () => {
    // "30 secunde" era imun la orice ajustare, în ambele direcții.
    // Unitatea e acum un câmp, deci se cere direct -- nu se mai caută un
    // cuvânt românesc într-un șir, care era exact fragilitatea eliminată.
    const timed = generateDailyRoutine(base, { repStep: 2 }).exercises
      .filter((e) => e.reps.unit === 'seconds');
    assert.ok(timed.length, 'catalogul are exerciții pe timp');
    for (const ex of timed) {
      const base_ = EXERCISES.find((x) => x.id === ex.id).reps;
      assert.notEqual(ex.reps.lo, base_.lo, `${ex.id} nu s-a mișcat`);
    }
  });
});
