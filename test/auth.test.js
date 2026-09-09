import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { initDb } from '../server/db.js';
import {
  createInvite,
  listInvites,
  revokeInvite,
  redeemInvite,
  listDevices,
  setDeviceRevoked,
  setDeviceLabel,
  deleteDevice,
  normaliseCode,
  getDeviceByToken
} from '../server/auth.js';

test('auth & invite contract', async (t) => {
  const testDb = new DatabaseSync(':memory:');
  initDb(testDb);

  await t.test('normaliseCode cleans dashes, spaces, and case', () => {
    assert.equal(normaliseCode('abcd-efgh-jklm'), 'ABCD-EFGH-JKLM');
    assert.equal(normaliseCode('  abcd efgh jklm  '), 'ABCD-EFGH-JKLM');
    assert.equal(normaliseCode('invalid'), '');
  });

  await t.test('create and list invites', () => {
    const invite = createInvite('Mama', testDb);
    assert.ok(invite.code);
    assert.equal(invite.label, 'Mama');
    assert.equal(invite.expires_in_days, 7);

    const list = listInvites(testDb);
    assert.equal(list.invites.length, 1);
    assert.equal(list.invites[0].code, invite.code);
  });

  await t.test('redeem invite successfully and wipe plaintext code', () => {
    const invite = createInvite('Telefon Nou', testDb);
    const result = redeemInvite(invite.code, null, testDb);

    assert.ok(result.token);
    assert.ok(result.device.id);

    // Check device was created
    const devices = listDevices(testDb);
    const found = devices.devices.find((d) => d.id === result.device.id);
    assert.ok(found);
    assert.equal(found.label, 'Telefon Nou');

    // Check plaintext code is wiped in database
    const list = listInvites(testDb);
    const used = list.invites.find((i) => i.id === invite.id);
    assert.equal(used.code, null);
    assert.ok(used.used_at);

    // Verify token retrieval
    const dev = getDeviceByToken(result.token, testDb);
    assert.ok(dev);
    assert.equal(dev.id, result.device.id);
  });

  await t.test('rebind same device within grace window', () => {
    const invite = createInvite('Test Rebind', testDb);
    const firstRedeem = redeemInvite(invite.code, null, testDb);
    const secondRedeem = redeemInvite(invite.code, null, testDb);

    // Should bind to the same device ID
    assert.equal(firstRedeem.device.id, secondRedeem.device.id);
    // But with a fresh token
    assert.notEqual(firstRedeem.token, secondRedeem.token);
  });

  await t.test('revoked invite cannot be redeemed', () => {
    const invite = createInvite('De Anulat', testDb);
    revokeInvite(invite.id, testDb);

    assert.throws(() => {
      redeemInvite(invite.code, null, testDb);
    }, /anulată/);
  });

  await t.test('device management: label, revoke, delete', () => {
    const invite = createInvite('De Gestionat', testDb);
    const { device, token } = redeemInvite(invite.code, null, testDb);

    setDeviceLabel(device.id, 'Nume Schimbat', testDb);
    let dev = getDeviceByToken(token, testDb);
    assert.equal(dev.label, 'Nume Schimbat');

    setDeviceRevoked(device.id, true, testDb);
    dev = getDeviceByToken(token, testDb);
    assert.equal(dev, null); // revoked devices cannot authenticate

    deleteDevice(device.id, testDb);
    const devices = listDevices(testDb);
    assert.ok(!devices.devices.some((d) => d.id === device.id));
  });
});
