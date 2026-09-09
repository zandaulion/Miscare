import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDailyRoutine, filterSafeExercises, EXERCISES } from '../server/routine.js';
import { CLIENT_EXERCISES } from '../web/exercises.js';

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

  await t.test('intermediate level generates level 2 movements (floor pushups, squats, plank) with default equipment and without yoga mat', () => {
    const profile = {
      level: 'intermediate',
      daily_time: 10,
      equipment: ['bodyweight', 'chair', 'wall']
    };

    const routine = generateDailyRoutine(profile);
    assert.ok(routine.exercises.some((e) => e.level === 2));
    assert.ok(routine.exercises.some((e) => e.id === 'standard_pushups'), 'Should propose standard floor pushups');
    assert.ok(!routine.exercises.some((e) => e.id === 'wall_pushups'), 'Should NOT propose wall pushups for intermediate');
    assert.match(routine.title, /Intermediar/i);
  });

  await t.test('intermediate level with ONLY bodyweight generates floor pushups and squats', () => {
    const profile = {
      level: 'intermediate',
      daily_time: 10,
      equipment: ['bodyweight']
    };

    const routine = generateDailyRoutine(profile);
    assert.ok(routine.exercises.some((e) => e.id === 'standard_pushups'));
    assert.ok(routine.exercises.some((e) => e.id === 'full_squats'));
    assert.ok(routine.exercises.some((e) => e.id === 'forearm_plank'));
  });

  await t.test('advanced level generates level 3 movements with ONLY bodyweight', () => {
    const profile = {
      level: 'advanced',
      daily_time: 10,
      equipment: ['bodyweight']
    };

    const routine = generateDailyRoutine(profile);
    assert.ok(routine.exercises.some((e) => e.level === 3));
    assert.ok(routine.exercises.some((e) => e.id === 'diamond_pushups'));
    assert.match(routine.title, /Avansat/i);
  });

  await t.test('intermediate level with pullup_bar utilizes the bar (chin-ups or hanging knee raises)', () => {
    const profile = {
      level: 'intermediate',
      daily_time: 10,
      equipment: ['bodyweight', 'chair', 'wall', 'pullup_bar']
    };

    const routine = generateDailyRoutine(profile);
    const usesBar = routine.exercises.some((e) => e.equipment.includes('pullup_bar'));
    assert.ok(usesBar, 'Routine should utilize the pullup bar when available');
    assert.ok(
      routine.exercises.some((e) => ['chin_ups', 'negative_pullups', 'hanging_knee_raises'].includes(e.id)),
      'Should select intermediate pull-up bar movements'
    );
  });

  await t.test('intermediate level with adjustable_dumbbells utilizes heavy dumbbell movements', () => {
    const profile = {
      level: 'intermediate',
      daily_time: 15,
      equipment: ['bodyweight', 'chair', 'wall', 'adjustable_dumbbells']
    };

    const routine = generateDailyRoutine(profile);
    const usesDumbbells = routine.exercises.some((e) => e.equipment.includes('adjustable_dumbbells'));
    assert.ok(usesDumbbells, 'Routine should utilize adjustable dumbbells when available');
    assert.ok(
      routine.exercises.some((e) => [
        'dumbbell_goblet_squat',
        'dumbbell_romanian_deadlift',
        'dumbbell_floor_press',
        'dumbbell_single_arm_row',
        'dumbbell_farmers_carry'
      ].includes(e.id)),
      'Should select compound heavy dumbbell exercises'
    );
  });

  await t.test('exercise catalog parity between server and client compendium', () => {
    assert.equal(CLIENT_EXERCISES.length, EXERCISES.length, 'Should have exact same number of exercises');
    assert.equal(CLIENT_EXERCISES.length, 38, 'Should have 38 total exercises');

    for (const serverEx of EXERCISES) {
      const clientEx = CLIENT_EXERCISES.find((c) => c.id === serverEx.id);
      assert.ok(clientEx, `Exercise ${serverEx.id} must exist in client compendium`);
      assert.equal(clientEx.level, serverEx.level, `Level mismatch for ${serverEx.id}`);
      assert.equal(clientEx.category, serverEx.category, `Category mismatch for ${serverEx.id}`);
      assert.ok(clientEx.svg && clientEx.svg.includes('<svg'), `Exercise ${serverEx.id} must have SVG diagram`);
      assert.ok(clientEx.description && clientEx.description.length > 10, `Exercise ${serverEx.id} must have instructions`);
    }
  });
});



