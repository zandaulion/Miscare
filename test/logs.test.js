import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { initDb, recomputeTotals } from '../server/db.js';

function seed() {
  const db = new DatabaseSync(':memory:');
  initDb(db);
  const now = new Date().toISOString();
  db.prepare('INSERT INTO devices (id, token_hash, created_at) VALUES (?, ?, ?)')
    .run('dev_test', 'hash_test', now);
  db.prepare(`
    INSERT INTO user_profile (device_id, level, created_at, updated_at)
    VALUES (?, 'zero', ?, ?)
  `).run('dev_test', now, now);
  return db;
}

let n = 0;
function addLog(db, date, seconds, feedback = 'just_right') {
  const id = `log_${++n}`;
  db.prepare(`
    INSERT INTO workout_logs
      (id, device_id, date, routine_title, duration_seconds, completion_status,
       exercises_done_json, feedback, created_at)
    VALUES (?, 'dev_test', ?, 'sesiune', ?, 'completed', '[]', ?, ?)
  `).run(id, date, seconds, feedback, `${date}T10:0${n}:00.000Z`);
  return id;
}

const profile = (db) =>
  db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get('dev_test');

test('deleting a session', async (t) => {
  await t.test('a day stays active while any session remains in it', () => {
    // Cazul pe care o simplă scădere îl greșește: două reprize într-o zi, una
    // ștearsă, ziua e în continuare o zi în care s-a mișcat.
    const db = seed();
    addLog(db, '2026-09-09', 300);
    const second = addLog(db, '2026-09-09', 600);
    recomputeTotals(db, 'dev_test');
    assert.equal(profile(db).total_active_days, 1);
    assert.equal(profile(db).total_sessions, 2);

    db.prepare('DELETE FROM workout_logs WHERE id = ?').run(second);
    recomputeTotals(db, 'dev_test');
    assert.equal(profile(db).total_active_days, 1, 'ziua rămâne activă');
    assert.equal(profile(db).total_sessions, 1);
    assert.equal(profile(db).total_minutes, 5);
  });

  await t.test('removing the only session of a day removes the day', () => {
    const db = seed();
    addLog(db, '2026-09-08', 600);
    const only = addLog(db, '2026-09-09', 300);
    recomputeTotals(db, 'dev_test');
    assert.equal(profile(db).total_active_days, 2);

    db.prepare('DELETE FROM workout_logs WHERE id = ?').run(only);
    recomputeTotals(db, 'dev_test');
    assert.equal(profile(db).total_active_days, 1);
    assert.equal(profile(db).last_session_date, '2026-09-08', 'ultima zi se recalculează');
  });

  await t.test('the numbers are a function of the log, not of the order of deletions', () => {
    // Recalcul, nu scădere: acesta e motivul. Orice succesiune de ștergeri care
    // lasă aceleași rânduri trebuie să dea aceleași totaluri.
    const build = () => {
      const db = seed();
      return [db, [
        addLog(db, '2026-09-07', 300),
        addLog(db, '2026-09-08', 600),
        addLog(db, '2026-09-08', 300),
        addLog(db, '2026-09-09', 900)
      ]];
    };
    const [dbA, idsA] = build();
    for (const id of [idsA[1], idsA[3]]) {
      dbA.prepare('DELETE FROM workout_logs WHERE id = ?').run(id);
      recomputeTotals(dbA, 'dev_test');
    }
    const [dbB, idsB] = build();
    for (const id of [idsB[3], idsB[1]]) {
      dbB.prepare('DELETE FROM workout_logs WHERE id = ?').run(id);
      recomputeTotals(dbB, 'dev_test');
    }
    const a = profile(dbA);
    const b = profile(dbB);
    assert.equal(a.total_active_days, b.total_active_days);
    assert.equal(a.total_sessions, b.total_sessions);
    assert.equal(a.total_minutes, b.total_minutes);
    assert.equal(a.total_active_days, 2, '7 și 8 septembrie rămân');
  });

  await t.test('the last feedback follows the newest remaining session', () => {
    const db = seed();
    addLog(db, '2026-09-08', 300, 'hard');
    const newest = addLog(db, '2026-09-09', 300, 'easy');
    recomputeTotals(db, 'dev_test');
    assert.equal(profile(db).last_feedback, 'easy');

    db.prepare('DELETE FROM workout_logs WHERE id = ?').run(newest);
    recomputeTotals(db, 'dev_test');
    assert.equal(profile(db).last_feedback, 'hard');
  });

  await t.test('what the person chose is never recalculated away', () => {
    // Nivelul și treapta de efort includ ce a acceptat omul când a fost
    // întrebat. Nu se deduc din jurnal, deci o ștergere nu are ce să le facă:
    // cine corectează o înregistrare greșită nu cere să fie recalibrat.
    const db = seed();
    db.prepare("UPDATE user_profile SET level = 'beginner', rep_step = 3, easy_streak = 1 WHERE device_id = 'dev_test'").run();
    const id = addLog(db, '2026-09-09', 300, 'easy');

    db.prepare('DELETE FROM workout_logs WHERE id = ?').run(id);
    recomputeTotals(db, 'dev_test');

    const p = profile(db);
    assert.equal(p.level, 'beginner');
    assert.equal(p.rep_step, 3);
    assert.equal(p.easy_streak, 1);
    assert.equal(p.total_sessions, 0, 'dar evidența chiar se golește');
  });

  await t.test('an emptied log leaves zeroes, not nulls', () => {
    const db = seed();
    const id = addLog(db, '2026-09-09', 300);
    db.prepare('DELETE FROM workout_logs WHERE id = ?').run(id);
    recomputeTotals(db, 'dev_test');
    const p = profile(db);
    assert.equal(p.total_active_days, 0);
    assert.equal(p.total_sessions, 0);
    assert.equal(p.total_minutes, 0);
    assert.equal(p.last_feedback, null);
  });
});
