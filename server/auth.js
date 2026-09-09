import crypto from 'node:crypto';
import { db, nowIso } from './db.js';

export const COOKIE_NAME = 'miscare_device';
export const INVITE_TTL_DAYS = 7;
export const INVITE_REBIND_MINUTES = 60;

export const hash = (v) => crypto.createHash('sha256').update(String(v)).digest('hex');

// Alphabet without ambiguous glyphs (no 0/O, 1/I)
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const GROUPS = 3;
const GROUP_LEN = 4;

export function randomCode() {
  const parts = [];
  for (let g = 0; g < GROUPS; g++) {
    const bytes = crypto.randomBytes(GROUP_LEN);
    let part = '';
    for (let i = 0; i < GROUP_LEN; i++) {
      part += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    }
    parts.push(part);
  }
  return parts.join('-');
}

export function normaliseCode(raw) {
  const clean = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (clean.length !== GROUPS * GROUP_LEN) return '';
  const parts = [];
  for (let i = 0; i < clean.length; i += GROUP_LEN) {
    parts.push(clean.slice(i, i + GROUP_LEN));
  }
  return parts.join('-');
}

export function randomToken() {
  return crypto.randomBytes(32).toString('base64url');
}

const publicBase = () => (process.env.PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');

// Rate limiting for redemption
const failures = [];
const FAIL_WINDOW_MS = 10 * 60 * 1000;
const FAIL_LIMIT = 25;

function tooManyFailures() {
  const cutoff = Date.now() - FAIL_WINDOW_MS;
  while (failures.length && failures[0] < cutoff) failures.shift();
  return failures.length >= FAIL_LIMIT;
}

function recordFailure() {
  failures.push(Date.now());
}

export class ThrottledError extends Error {
  constructor() {
    super('Prea multe încercări. Așteaptă câteva minute și încearcă din nou.');
    this.status = 429;
  }
}

// ---------------------------------------------------------------- Admin API (pwa-invite-console contract)

export function listDevices(dbInstance = db) {
  const rows = dbInstance.prepare(`
    SELECT id, label, created_at, last_seen, revoked, has_push
    FROM devices ORDER BY created_at DESC
  `).all();
  return {
    devices: rows.map((r) => ({
      id: r.id,
      label: r.label || 'Dispozitiv fără nume',
      created_at: r.created_at,
      last_seen: r.last_seen,
      revoked: Boolean(r.revoked),
      has_push: Boolean(r.has_push)
    }))
  };
}

export function setDeviceRevoked(id, revoked, dbInstance = db) {
  const res = dbInstance.prepare('UPDATE devices SET revoked = ? WHERE id = ?').run(revoked ? 1 : 0, id);
  return res.changes > 0;
}

export function setDeviceLabel(id, label, dbInstance = db) {
  const res = dbInstance.prepare('UPDATE devices SET label = ? WHERE id = ?').run(label || null, id);
  return res.changes > 0;
}

export function deleteDevice(id, dbInstance = db) {
  const res = dbInstance.prepare('DELETE FROM devices WHERE id = ?').run(id);
  return res.changes > 0;
}

export function listInvites(dbInstance = db) {
  const rows = dbInstance.prepare(`
    SELECT id, label, code, url, created_at, expires_at, used_at, revoked, device_id
    FROM invites ORDER BY id DESC
  `).all();

  return {
    ttl_days: INVITE_TTL_DAYS,
    invites: rows.map((r) => ({
      id: r.id,
      label: r.label,
      code: r.code,
      url: r.url,
      created_at: r.created_at,
      expires_at: r.expires_at,
      used_at: r.used_at,
      revoked: Boolean(r.revoked),
      device_id: r.device_id
    }))
  };
}

export function createInvite(label = null, dbInstance = db) {
  const code = randomCode();
  const base = publicBase();
  const url = base ? `${base}/?code=${encodeURIComponent(code)}` : null;
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86400000).toISOString();

  const out = dbInstance.prepare(`
    INSERT INTO invites (code_hash, code, label, url, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(hash(normaliseCode(code)), code, label || null, url, nowIso(), expiresAt);

  return {
    id: Number(out.lastInsertRowid),
    code,
    url,
    label: label || null,
    expires_at: expiresAt,
    expires_in_days: INVITE_TTL_DAYS
  };
}

export function revokeInvite(id, dbInstance = db) {
  const res = dbInstance.prepare('UPDATE invites SET revoked = 1, code = NULL, url = NULL WHERE id = ?').run(id);
  return res.changes > 0;
}

// ---------------------------------------------------------------- Device Redemption & Auth

export function redeemInvite(codeStr, initialLabel = null, dbInstance = db) {
  if (tooManyFailures()) throw new ThrottledError();

  const codeClean = normaliseCode(codeStr);
  if (!codeClean) {
    recordFailure();
    const err = new Error('Codul de invitație nu pare valid.');
    err.status = 400;
    throw err;
  }

  const codeH = hash(codeClean);
  const invite = dbInstance.prepare(`
    SELECT * FROM invites WHERE code_hash = ?
  `).get(codeH);

  if (!invite) {
    recordFailure();
    const err = new Error('Codul de invitație nu a fost găsit.');
    err.status = 404;
    throw err;
  }

  if (invite.revoked) {
    recordFailure();
    const err = new Error('Această invitație a fost anulată. Solicită una nouă.');
    err.status = 400;
    throw err;
  }

  const now = new Date();
  if (new Date(invite.expires_at).getTime() < now.getTime()) {
    recordFailure();
    const err = new Error('Invitația a expirat. Solicită una nouă.');
    err.status = 410;
    throw err;
  }

  let rebindDeviceId = null;
  if (invite.used_at) {
    const usedAtTime = new Date(invite.used_at).getTime();
    if (now.getTime() - usedAtTime <= INVITE_REBIND_MINUTES * 60 * 1000 && invite.device_id) {
      // Re-bind to same device (installed PWA transition)
      rebindDeviceId = invite.device_id;
    } else {
      recordFailure();
      const err = new Error('Invitația a fost deja folosită.');
      err.status = 400;
      throw err;
    }
  }

  const token = randomToken();
  const tokenH = hash(token);
  const nowStr = nowIso();
  let deviceId = rebindDeviceId;
  const label = initialLabel || invite.label || 'Telefonul meu';

  if (deviceId) {
    dbInstance.prepare(`
      UPDATE devices SET token_hash = ?, revoked = 0, last_seen = ? WHERE id = ?
    `).run(tokenH, nowStr, deviceId);
  } else {
    deviceId = 'dev_' + crypto.randomBytes(8).toString('hex');
    dbInstance.prepare(`
      INSERT INTO devices (id, token_hash, label, created_at, last_seen)
      VALUES (?, ?, ?, ?, ?)
    `).run(deviceId, tokenH, label, nowStr, nowStr);

    // Initialize initial user profile for this device
    dbInstance.prepare(`
      INSERT OR IGNORE INTO user_profile (device_id, level, daily_time, created_at, updated_at)
      VALUES (?, 'zero', 10, ?, ?)
    `).run(deviceId, nowStr, nowStr);
  }

  // Wipe plain code from DB on first use or rebind
  dbInstance.prepare(`
    UPDATE invites
    SET used_at = COALESCE(used_at, ?), device_id = ?, code = NULL, url = NULL
    WHERE id = ?
  `).run(nowStr, deviceId, invite.id);

  return {
    token,
    device: {
      id: deviceId,
      label,
      created_at: nowStr
    }
  };
}

export function getDeviceByToken(token, dbInstance = db) {
  if (!token) return null;
  const tokenH = hash(token);
  const row = dbInstance.prepare(`
    SELECT id, label, created_at, last_seen, revoked
    FROM devices WHERE token_hash = ?
  `).get(tokenH);

  if (!row || row.revoked) return null;

  // Update last seen
  dbInstance.prepare('UPDATE devices SET last_seen = ? WHERE id = ?').run(nowIso(), row.id);
  return {
    id: row.id,
    label: row.label,
    created_at: row.created_at,
    last_seen: row.last_seen
  };
}

export function extractToken(req) {
  // 1. From cookie header
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) return decodeURIComponent(match[1]);
  }
  // 2. From Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  // 3. Custom header
  if (req.headers['x-device-token']) {
    return req.headers['x-device-token'].trim();
  }
  return null;
}

export function requireDevice(req, res, next) {
  const token = extractToken(req);
  const device = getDeviceByToken(token);
  if (!device) {
    return res.status(401).json({ error: 'Dispozitiv neautorizat' });
  }
  req.device = device;
  next();
}

function adminTokenOk(supplied) {
  const expected = (process.env.ADMIN_TOKEN || '').trim();
  // If no admin token configured, accept X-Admin: 1 for local tailnet reverse proxy
  if (!expected) {
    return supplied === '1' || supplied === 'true';
  }
  const given = Buffer.from(String(supplied || ''));
  const want = Buffer.from(expected);
  if (given.length !== want.length) return false;
  return crypto.timingSafeEqual(given, want);
}

export function requireAdmin(req, res, next) {
  const headerToken = req.headers['x-admin-token'] || req.headers['x-admin'];
  if (!adminTokenOk(headerToken)) {
    return res.status(404).json({ error: 'Not found' });
  }
  next();
}
