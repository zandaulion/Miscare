import express from 'express';
import cors from 'cors';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

import { db, nowIso } from './db.js';
import {
  COOKIE_NAME,
  listDevices,
  setDeviceRevoked,
  setDeviceLabel,
  deleteDevice,
  listInvites,
  createInvite,
  revokeInvite,
  redeemInvite,
  requireDevice,
  requireAdmin
} from './auth.js';

import {
  isConfigured as isGeminiConfigured,
  detectEquipmentFromPhoto,
  EQUIPMENT_CATALOG
} from './equipment.js';

import {
  generateDailyRoutine,
  EXERCISES
} from './routine.js';

import { swVersion } from './serve-sw.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(__dirname, '../web');
const app = express();
const PORT = process.env.PORT || 3098;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ---------------------------------------------------------------- Admin Routes (pwa-invite-console contract)

app.get('/api/admin/devices', requireAdmin, (req, res) => {
  try {
    const data = listDevices();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/devices/:id/revoke', requireAdmin, (req, res) => {
  try {
    const { revoked } = req.body || {};
    setDeviceRevoked(req.params.id, revoked);
    res.json({ id: req.params.id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/devices/:id/label', requireAdmin, (req, res) => {
  try {
    const { label } = req.body || {};
    setDeviceLabel(req.params.id, label);
    res.json({ id: req.params.id, label, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/devices/:id', requireAdmin, (req, res) => {
  try {
    deleteDevice(req.params.id);
    res.json({ deleted: req.params.id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/invites', requireAdmin, (req, res) => {
  try {
    const data = listInvites();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/invites', requireAdmin, (req, res) => {
  try {
    const { label } = req.body || {};
    const invite = createInvite(label);
    res.json(invite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/invites/:id/revoke', requireAdmin, (req, res) => {
  try {
    revokeInvite(req.params.id);
    res.json({ revoked: req.params.id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------- Public Health & Auth Routes

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    name: 'miscare',
    gemini_configured: isGeminiConfigured(),
    timestamp: Date.now()
  });
});

function handleRedeem(req, res) {
  try {
    const { code, label } = req.body || {};
    const result = redeemInvite(code, label);

    const isSecure = process.env.COOKIE_SECURE === 'true';
    res.cookie(COOKIE_NAME, result.token, {
      httpOnly: false, // Accessible to client JS for offline header usage
      sameSite: 'lax',
      secure: isSecure,
      maxAge: 400 * 86400 * 1000,
      path: '/'
    });

    res.json({
      ok: true,
      token: result.token,
      device: result.device
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

app.post('/api/auth/redeem', handleRedeem);
app.post('/api/invites/redeem', handleRedeem);

function handleMe(req, res) {
  const profileRow = db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get(req.device.id);
  res.json({
    ok: true,
    device: req.device,
    profile: profileRow ? {
      level: profileRow.level,
      daily_time: profileRow.daily_time,
      limitations: JSON.parse(profileRow.limitations_json || '[]'),
      equipment: JSON.parse(profileRow.equipment_json || '[]'),
      total_active_days: profileRow.total_active_days,
      total_minutes: profileRow.total_minutes,
      last_feedback: profileRow.last_feedback
    } : null
  });
}

app.get('/api/auth/me', requireDevice, handleMe);
app.get('/api/me', requireDevice, handleMe);

app.post('/api/auth/label', requireDevice, (req, res) => {
  try {
    const { label } = req.body || {};
    setDeviceLabel(req.device.id, label);
    res.json({ success: true, label });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------- Profile & Equipment API

app.get('/api/equipment/catalog', (req, res) => {
  res.json({ catalog: EQUIPMENT_CATALOG });
});

app.get('/api/profile', requireDevice, (req, res) => {
  try {
    let row = db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get(req.device.id);
    if (!row) {
      const now = nowIso();
      db.prepare(`
        INSERT INTO user_profile (device_id, level, daily_time, created_at, updated_at)
        VALUES (?, 'zero', 10, ?, ?)
      `).run(req.device.id, now, now);
      row = db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get(req.device.id);
    }

    res.json({
      profile: {
        device_id: row.device_id,
        level: row.level,
        daily_time: row.daily_time,
        limitations: JSON.parse(row.limitations_json || '[]'),
        equipment: JSON.parse(row.equipment_json || '["bodyweight","chair","wall"]'),
        preferred_days: JSON.parse(row.preferred_days_json || '[]'),
        total_active_days: row.total_active_days,
        total_minutes: row.total_minutes,
        last_feedback: row.last_feedback
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', requireDevice, (req, res) => {
  try {
    const { level, daily_time, limitations, equipment, preferred_days } = req.body || {};
    const now = nowIso();

    db.prepare(`
      INSERT INTO user_profile (device_id, level, daily_time, limitations_json, equipment_json, preferred_days_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(device_id) DO UPDATE SET
        level = COALESCE(?, level),
        daily_time = COALESCE(?, daily_time),
        limitations_json = COALESCE(?, limitations_json),
        equipment_json = COALESCE(?, equipment_json),
        preferred_days_json = COALESCE(?, preferred_days_json),
        updated_at = ?
    `).run(
      req.device.id,
      level || 'zero',
      daily_time || 10,
      JSON.stringify(limitations || []),
      JSON.stringify(equipment || ['bodyweight', 'chair', 'wall']),
      JSON.stringify(preferred_days || []),
      now, now,
      level || null,
      daily_time || null,
      limitations ? JSON.stringify(limitations) : null,
      equipment ? JSON.stringify(equipment) : null,
      preferred_days ? JSON.stringify(preferred_days) : null,
      now
    );

    res.json({ success: true, updated_at: now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/equipment/detect', requireDevice, async (req, res) => {
  try {
    const { image_base64, mime_type } = req.body || {};
    if (!image_base64) {
      return res.status(400).json({ error: 'Imagine lipsă' });
    }

    const result = await detectEquipmentFromPhoto(image_base64, mime_type || 'image/jpeg');

    // Salvează scanarea în baza de date
    const scanId = 'scan_' + crypto.randomBytes(8).toString('hex');
    db.prepare(`
      INSERT INTO equipment_scans (id, device_id, detected_items_json, created_at)
      VALUES (?, ?, ?, ?)
    `).run(scanId, req.device.id, JSON.stringify(result.detected || []), nowIso());

    // Dacă scanarea a găsit echipamente, facem auto-update în profilul utilizatorului
    if (result.detected && result.detected.length > 0) {
      const detectedIds = result.detected.map((d) => d.id);
      const profile = db.prepare('SELECT equipment_json FROM user_profile WHERE device_id = ?').get(req.device.id);
      const existing = profile ? JSON.parse(profile.equipment_json || '[]') : ['bodyweight', 'chair', 'wall'];
      const merged = Array.from(new Set([...existing, ...detectedIds]));

      db.prepare(`
        UPDATE user_profile SET equipment_json = ?, updated_at = ? WHERE device_id = ?
      `).run(JSON.stringify(merged), nowIso(), req.device.id);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------- Routine & Workout Logs API

app.get('/api/routine/today', requireDevice, (req, res) => {
  try {
    const profileRow = db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get(req.device.id) || {};
    const lastLog = db.prepare(`
      SELECT * FROM workout_logs WHERE device_id = ? ORDER BY date DESC, created_at DESC LIMIT 1
    `).get(req.device.id);

    let daysSinceLast = 0;
    if (lastLog) {
      const lastDate = new Date(lastLog.date);
      const today = new Date();
      const diffMs = today.getTime() - lastDate.getTime();
      daysSinceLast = Math.max(0, Math.floor(diffMs / (86400 * 1000)));
    }

    const forceDuration = req.query.duration ? parseInt(req.query.duration, 10) : null;

    const profile = {
      level: profileRow.level || 'zero',
      daily_time: profileRow.daily_time || 10,
      limitations: JSON.parse(profileRow.limitations_json || '[]'),
      equipment: JSON.parse(profileRow.equipment_json || '["bodyweight","chair","wall"]'),
      last_feedback: profileRow.last_feedback || (lastLog ? lastLog.feedback : null)
    };

    const routine = generateDailyRoutine(profile, {
      forceDurationMinutes: forceDuration,
      daysSinceLastSession: daysSinceLast,
      lastFeedback: profile.last_feedback
    });

    res.json({ routine, profile, days_since_last: daysSinceLast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/routine/log', requireDevice, (req, res) => {
  try {
    const {
      routine_title,
      duration_seconds = 0,
      completion_status = 'completed',
      exercises_done = [],
      feedback = 'just_right',
      adjustment_note = null
    } = req.body || {};

    const logId = 'log_' + crypto.randomBytes(8).toString('hex');
    const todayStr = new Date().toISOString().slice(0, 10);
    const nowStr = nowIso();

    db.prepare(`
      INSERT INTO workout_logs (id, device_id, date, routine_title, duration_seconds, completion_status, exercises_done_json, feedback, adjustment_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      logId,
      req.device.id,
      todayStr,
      routine_title || 'Mișcare de zi cu zi',
      duration_seconds,
      completion_status,
      JSON.stringify(exercises_done),
      feedback,
      adjustment_note,
      nowStr
    );

    // Actualizare agregate în user_profile (No Shaming: adunăm minutele și zilele active)
    const minutesAdded = Math.max(1, Math.round(duration_seconds / 60));
    db.prepare(`
      UPDATE user_profile SET
        total_active_days = total_active_days + 1,
        total_minutes = total_minutes + ?,
        last_feedback = ?,
        updated_at = ?
      WHERE device_id = ?
    `).run(minutesAdded, feedback, nowStr, req.device.id);

    res.json({
      success: true,
      log_id: logId,
      minutes_logged: minutesAdded,
      celebration: 'Felicitări pentru mișcarea de azi! Fiecare pas se adună.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', requireDevice, (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM workout_logs WHERE device_id = ? ORDER BY date DESC, created_at DESC LIMIT 30
    `).all(req.device.id);

    const profile = db.prepare('SELECT total_active_days, total_minutes FROM user_profile WHERE device_id = ?').get(req.device.id) || {
      total_active_days: 0,
      total_minutes: 0
    };

    res.json({
      logs: logs.map((l) => ({
        id: l.id,
        date: l.date,
        routine_title: l.routine_title,
        duration_seconds: l.duration_seconds,
        completion_status: l.completion_status,
        feedback: l.feedback,
        adjustment_note: l.adjustment_note,
        exercises_done: JSON.parse(l.exercises_done_json || '[]'),
        created_at: l.created_at
      })),
      totals: {
        active_days: profile.total_active_days,
        total_minutes: profile.total_minutes
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------- PWA Kit Static Serving & Updates

// Escape hatch: /bust clears service workers and caches
app.get('/bust', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Clear-Site-Data', '"cache"');
  res.sendFile(path.join(webDir, 'bust.html'));
});

// Serve sw.js with content-derived version stamped in
app.use(swVersion(webDir));

// Serve static assets with crisp revalidation for HTML, CSS, JS
app.use(express.static(webDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.webmanifest')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// SPA Fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint inexistent' });
  }
  res.sendFile(path.join(webDir, 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Mișcare server running on http://127.0.0.1:${PORT}`);
  });
}

export default app;
