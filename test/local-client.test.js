import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createLocalStore } from '../web/local-store.js';
import { createLocalClient, localDate } from '../web/local-client.js';

function fixture() {
  const indexedDB = new IDBFactory();
  const store = createLocalStore({ indexedDB });
  let date = new Date('2026-09-10T10:00:00Z');
  let id = 0;
  const client = createLocalClient({ store, now: () => date, uuid: () => `synthetic-${++id}` });
  return { client, store, reopen: () => createLocalClient({ store: createLocalStore({ indexedDB }) }),
    date: value => { date = new Date(value); } };
}

test('local journal: concurrent writes, more than 30 workouts, totals and durable reopen', async () => {
  const { client, store, reopen } = fixture();
  await client.probe();
  await Promise.all(Array.from({ length: 35 }, () => client.logWorkout({ duration_seconds: 60 })));
  let data = await client.getLogs();
  assert.equal(data.logs.length, 35);
  assert.deepEqual(data.totals, { active_days: 1, total_minutes: 35, total_sessions: 35 });
  await client.deleteLog(data.logs[0].id);
  await store.close();
  data = await reopen().getLogs();
  assert.equal(data.logs.length, 34);
  assert.equal(data.totals.active_days, 1);
  assert.equal(data.totals.total_minutes, 34);
});

test('local adaptive routine rotates and progression only increases with consent', async () => {
  const { client } = fixture();
  await client.probe();
  const first = await client.getTodayRoutine();
  assert.ok(first.exercises.length >= 3);
  await client.logWorkout({ duration_seconds: 300, feedback: 'easy', exercises_done: first.exercises });
  await client.logWorkout({ duration_seconds: 300, feedback: 'easy' });
  assert.equal(client.state.profile.rep_step, 0);
  const next = await client.getTodayRoutine();
  assert.notDeepEqual(next.exercises.map(ex => ex.id), first.exercises.map(ex => ex.id));
  assert.equal(next.__done_today.sessions, 2);
  assert.equal(next.__proposal.kind, 'more_reps');
  await client.answerProposal('more_reps', true);
  assert.equal(client.state.profile.rep_step, 1);
  await assert.rejects(client.answerProposal('more_reps', true));
  await client.revertProgression();
  assert.equal(client.state.profile.rep_step, 0);
  await client.logWorkout({ feedback: 'hard' });
  assert.equal(client.state.profile.rep_step, -1);
});

test('long-break response is remembered and calendar days follow device time', async () => {
  const { client, date } = fixture();
  await client.probe();
  await client.logWorkout({});
  date('2026-09-20T10:00:00Z');
  const routine = await client.getTodayRoutine();
  assert.equal(routine.__proposal.kind, 'ease_back');
  await client.answerProposal('ease_back', false);
  assert.equal((await client.getTodayRoutine()).__proposal, null);
  const previous = process.env.TZ;
  try {
    process.env.TZ = 'Europe/Bucharest';
    assert.equal(localDate(new Date('2026-09-10T21:30:00Z')), '2026-09-11');
    date('2026-09-10T21:30:00Z');
    await client.logWorkout({});
    assert.equal((await client.getLogs()).logs.find(log => log.created_at === '2026-09-10T21:30:00.000Z').date, '2026-09-11');
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
});

test('failed or invalid transactions preserve committed data and public state', async () => {
  const { client, store } = fixture();
  await client.probe();
  await client.logWorkout({ id: 'synthetic-id', duration_seconds: 120 });
  await client.logWorkout({ id: 'synthetic-id', duration_seconds: 120 });
  assert.equal((await client.getLogs()).logs.length, 1, 'retry is idempotent');
  await assert.rejects(store.transaction(data => { data.logs = []; throw new Error('synthetic crash'); }));
  await assert.rejects(client.updateProfile({ level: 'invalid' }));
  assert.equal(client.state.profile.level, 'zero');
  assert.equal((await client.getLogs()).logs.length, 1);
});

test('backup round trip, interrupted workout and delete-all preserve clear semantics', async () => {
  const { client, reopen } = fixture();
  await client.probe();
  await client.logWorkout({ duration_seconds: 300 });
  await client.saveActiveWorkout({ active: true, routine: { id: 'synthetic-routine' }, exerciseIndex: 1 });
  assert.equal((await reopen().getActiveWorkout()).exerciseIndex, 1);
  const backup = await client.exportData();
  await client.resetData();
  assert.equal((await client.getLogs()).logs.length, 0);
  assert.equal(await client.getActiveWorkout(), null);
  await client.importData(backup);
  assert.equal((await client.getLogs()).totals.total_minutes, 5);
  assert.equal(await client.getActiveWorkout(), null, 'imports do not resume an old active workout');
  assert.throws(() => client.importData({ ...backup, version: 2 }));
  assert.throws(() => client.importData({ ...backup, logs: [{ id: 'invalid' }] }));
  assert.equal((await client.getLogs()).logs.length, 1);
});
