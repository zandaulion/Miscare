import test from 'node:test';
import assert from 'node:assert/strict';
import { EXERCISES } from '../server/routine.js';
import { CLIENT_EXERCISES } from '../web/exercises.js';

test('the two catalogues agree', async (t) => {
  // Sunt două fiindcă fiecare știe altceva -- serverul efortul și siguranța,
  // clientul desenul și animația. Dar ce se suprapune trebuie să coincidă:
  // compendiul scrie „volumul uzual" din catalogul clientului, iar sesiunea
  // îl calculează din al serverului. Dacă se despart, aceeași mișcare apare
  // cu două efortyri diferite în două ecrane.
  const serverById = new Map(EXERCISES.map((e) => [e.id, e]));
  const clientById = new Map(CLIENT_EXERCISES.map((e) => [e.id, e]));

  await t.test('the same movements are in both', () => {
    const missingFromClient = [...serverById.keys()].filter((id) => !clientById.has(id));
    const missingFromServer = [...clientById.keys()].filter((id) => !serverById.has(id));
    assert.deepEqual(missingFromClient, [], 'lipsesc din catalogul clientului');
    assert.deepEqual(missingFromServer, [], 'lipsesc din catalogul serverului');
  });

  await t.test('effort is identical', () => {
    // Se generează cu scripts/sync-client-reps.mjs; testul prinde editarea
    // pe loc, care altfel ar trece neobservată până pe ecran.
    for (const [id, server] of serverById) {
      assert.deepEqual(clientById.get(id)?.reps, server.reps,
        `${id}: efortul diferă între cataloage`);
    }
  });

  await t.test('level is identical', () => {
    for (const [id, server] of serverById) {
      assert.equal(clientById.get(id)?.level, server.level,
        `${id}: nivelul diferă între cataloage`);
    }
  });
});
