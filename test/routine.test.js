import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDailyRoutine, filterSafeExercises, EXERCISES } from '../server/routine.js';

test('routine generation & adaptive no-shaming logic', async (t) => {
  await t.test('zero baseline with bodyweight creates safe routine', () => {
    const profile = {
      level: 'zero',
      daily_time: 10,
      limitations: [],
      equipment: ['bodyweight', 'chair', 'wall']
    };

    const routine = generateDailyRoutine(profile);
    assert.ok(routine.exercises.length >= 2);
    assert.ok(routine.exercises.every((e) => e.level === 0));
    assert.equal(routine.is_reentry, false);
    assert.match(routine.supportive_message, /mișcare/i);
  });

  await t.test('filters out exercises when limitations are present', () => {
    const profile = {
      level: 'zero',
      daily_time: 10,
      limitations: ['knees'],
      equipment: ['bodyweight', 'chair', 'wall']
    };

    const safe = filterSafeExercises(EXERCISES, profile);
    assert.ok(safe.length > 0);
    // Chair sit to stand mild or deep lower body moves without knee safety should be filtered out
    assert.ok(safe.every((e) => e.category !== 'lower' || e.safe_for.includes('knees')));
  });

  await t.test('only includes dumbbells when user has them', () => {
    const profileWithoutDumbbells = {
      level: 'beginner',
      daily_time: 10,
      equipment: ['bodyweight', 'chair', 'wall']
    };
    const routineNoDb = generateDailyRoutine(profileWithoutDumbbells);
    assert.ok(!routineNoDb.exercises.some((e) => e.equipment.includes('dumbbells')));

    const profileWithDumbbells = {
      level: 'beginner',
      daily_time: 10,
      equipment: ['bodyweight', 'chair', 'wall', 'dumbbells']
    };
    const routineWithDb = generateDailyRoutine(profileWithDumbbells);
    const safeWithDb = filterSafeExercises(EXERCISES, profileWithDumbbells);
    assert.ok(safeWithDb.some((e) => e.equipment.includes('dumbbells')));
  });

  await t.test('adaptive adjustment when last feedback was hard', () => {
    const profile = {
      level: 'zero',
      daily_time: 10,
      last_feedback: 'hard',
      equipment: ['bodyweight', 'chair', 'wall']
    };

    const routine = generateDailyRoutine(profile, { lastFeedback: 'hard' });
    assert.ok(routine.adjustment_note);
    assert.match(routine.supportive_message, /mai blânde/i);
  });

  await t.test('no-shaming re-entry session after days off', () => {
    const profile = {
      level: 'zero',
      daily_time: 10,
      equipment: ['bodyweight', 'chair', 'wall']
    };

    const routine = generateDailyRoutine(profile, { daysSinceLastSession: 6 });
    assert.equal(routine.is_reentry, true);
    assert.match(routine.title, /reacomodare/i);
    assert.match(routine.supportive_message, /bine ai revenit/i);
    // Does NOT say "streak pierdut" or anything negative
    assert.ok(!routine.supportive_message.toLowerCase().includes('pierdut'));
    assert.ok(!routine.supportive_message.toLowerCase().includes('ratat'));
  });

  await t.test('short 5-minute session is generated when requested', () => {
    const profile = {
      level: 'zero',
      daily_time: 10,
      equipment: ['bodyweight', 'chair', 'wall']
    };

    const routine = generateDailyRoutine(profile, { forceDurationMinutes: 5 });
    assert.ok(routine.exercises.length <= 3);
    assert.match(routine.title, /5 minute/i);
  });
});
