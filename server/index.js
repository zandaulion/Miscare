import express from 'express';
import cors from 'cors';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

import { db, nowIso, recomputeTotals } from './db.js';
import { applyFeedback, proposeChange, LEVELS } from './progression.js';
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
      last_feedback: profileRow.last_feedback || (lastLog ? lastLog.feedback : null),
      rep_step: profileRow.rep_step || 0,
      total_active_days: profileRow.total_active_days || 0,
      total_sessions: profileRow.total_sessions || 0
    };

    // Ce s-a făcut chiar ieri, din jurnal -- nu reconstituit.
    //
    // Generatorul își putea deduce singur sesiunea precedentă, rulându-se cu o
    // rotație mai puțin. Numai că, pentru a opri recursivitatea, o rula cu
    // `avoid` gol, adică fără regula pe care tocmai o aplica. Ieșea altă
    // sesiune decât cea servită cu adevărat, deci se ocolea o zi care nu
    // existase și se repeta cea care existase.
    //
    // Jurnalul știe exact ce s-a servit, inclusiv exercițiile schimbate manual
    // cu „Schimbă cu altul" -- pe care nicio reconstituire nu le-ar fi ghicit.
    let avoid = null;
    if (lastLog && daysSinceLast <= 1) {
      try {
        const done = JSON.parse(lastLog.exercises_done_json || '[]');
        const ids = done.map((e) => e && e.id).filter(Boolean);
        if (ids.length) avoid = new Set(ids);
      } catch { /* jurnal ilizibil: generatorul se descurcă și fără */ }
    }

    const routine = generateDailyRoutine(profile, {
      forceDurationMinutes: forceDuration,
      daysSinceLastSession: daysSinceLast,
      lastFeedback: profile.last_feedback,
      repStep: profile.rep_step,
      rotation: profile.total_sessions,
      avoid
    });

    // Cel mult o întrebare, și niciodată aplicată din oficiu: sesiunea de mai
    // sus e deja completă fără ea. Dacă răspunsul nu vine, nu se schimbă nimic.
    const proposal = proposeChange({
      level: profile.level,
      repStep: profile.rep_step,
      easyStreak: profileRow.easy_streak || 0,
      daysSinceLastSession: daysSinceLast
    });

    const canRevert = Boolean(profileRow.prev_level || profileRow.prev_rep_step !== null);

    // Ce s-a bifat deja azi. Fără asta, ecranul „azi" arată aceleași exerciții
    // după ce au fost făcute, ca și cum nu s-ar fi întâmplat nimic.
    const todayStr = new Date().toISOString().slice(0, 10);
    const doneToday = db.prepare(`
      SELECT COUNT(*) AS sessions, COALESCE(SUM(duration_seconds), 0) AS seconds,
             MAX(created_at) AS last_at
      FROM workout_logs WHERE device_id = ? AND date = ?
    `).get(req.device.id, todayStr);

    res.json({
      routine, profile, proposal,
      can_revert: canRevert,
      days_since_last: daysSinceLast,
      done_today: {
        sessions: doneToday.sessions,
        minutes: Math.round(doneToday.seconds / 60),
        last_at: doneToday.last_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Răspunsul la întrebarea zilei.
 *
 * Acceptul e singurul loc unde efortul cerut crește, iar starea dinainte se
 * salvează în același pas -- „poți reveni oricând" trebuie să aibă unde să
 * revină, altfel e doar o formulare frumoasă.
 */
app.post('/api/progression/accept', requireDevice, (req, res) => {
  const { kind } = req.body || {};
  const row = db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get(req.device.id);
  if (!row) return res.status(404).json({ error: 'profil inexistent' });

  const proposal = proposeChange({
    level: row.level,
    repStep: row.rep_step || 0,
    easyStreak: row.easy_streak || 0,
    daysSinceLastSession: Number(req.body?.days_since_last) || 0
  });
  if (!proposal || (kind && kind !== proposal.kind)) {
    // Propunerea s-a schimbat între afișare și răspuns -- se poate întâmpla cu
    // două dispozitive. Mai bine nimic decât altceva decât ce a citit omul.
    return res.status(409).json({ error: 'propunerea nu mai este valabilă' });
  }

  const nextLevelValue = proposal.to.level ?? row.level;
  const nextStep = proposal.to.rep_step ?? row.rep_step ?? 0;

  db.prepare(`
    UPDATE user_profile SET
      prev_level = ?, prev_rep_step = ?,
      level = ?, rep_step = ?, easy_streak = 0, updated_at = ?
    WHERE device_id = ?
  `).run(row.level, row.rep_step ?? 0, nextLevelValue, nextStep, nowIso(), req.device.id);

  res.json({ ok: true, level: nextLevelValue, rep_step: nextStep, can_revert: true });
});

/** „Nu, mulțumesc." Se reține doar ca întrebarea să nu revină imediat. */
app.post('/api/progression/decline', requireDevice, (req, res) => {
  db.prepare('UPDATE user_profile SET easy_streak = 0, updated_at = ? WHERE device_id = ?')
    .run(nowIso(), req.device.id);
  res.json({ ok: true });
});

/** Înapoi de unde s-a plecat. Nu cere motive și nu comentează. */
app.post('/api/progression/revert', requireDevice, (req, res) => {
  const row = db.prepare('SELECT * FROM user_profile WHERE device_id = ?').get(req.device.id);
  if (!row || (row.prev_level === null && row.prev_rep_step === null)) {
    return res.status(409).json({ error: 'nu există o schimbare de anulat' });
  }
  const level = LEVELS.includes(row.prev_level) ? row.prev_level : row.level;
  const step = row.prev_rep_step ?? 0;

  db.prepare(`
    UPDATE user_profile SET
      level = ?, rep_step = ?, prev_level = NULL, prev_rep_step = NULL,
      easy_streak = 0, updated_at = ?
    WHERE device_id = ?
  `).run(level, step, nowIso(), req.device.id);

  res.json({ ok: true, level, rep_step: step });
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

    // Partea automată a adaptării: doar coborârea, și seria de zile ușoare.
    // Urcarea trece prin /api/progression/accept, fiindcă e singura direcție
    // în care aplicația ar cere ceva ce nimeni nu a acceptat.
    const current = db.prepare(
      'SELECT rep_step, easy_streak, last_session_date FROM user_profile WHERE device_id = ?'
    ).get(req.device.id) || { rep_step: 0, easy_streak: 0, last_session_date: null };
    const adapted = applyFeedback(current, feedback);

    // O zi activă e o zi, oricâte reprize ar avea. Sesiunile se numără separat,
    // fiindcă rotația vrea sesiuni: cine face trei reprize într-o zi vrea trei
    // sesiuni diferite, nu aceeași de trei ori.
    const isNewDay = current.last_session_date !== todayStr;

    db.prepare(`
      UPDATE user_profile SET
        total_active_days = total_active_days + ?,
        total_sessions = total_sessions + 1,
        last_session_date = ?,
        total_minutes = total_minutes + ?,
        last_feedback = ?,
        rep_step = ?,
        easy_streak = ?,
        updated_at = ?
      WHERE device_id = ?
    `).run(isNewDay ? 1 : 0, todayStr, minutesAdded, feedback,
           adapted.rep_step, adapted.easy_streak, nowStr, req.device.id);

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

/**
 * Șterge o sesiune din evidență.
 *
 * Totalurile se recalculează din jurnal, nu se scad. O scădere ar greși exact
 * cazul care contează -- ziua rămâne activă dacă mai are alte sesiuni în ea --
 * iar recalculul dă același rezultat oricâte ștergeri s-ar face.
 *
 * Nivelul, treapta de efort și seria de zile ușoare rămân neatinse: acelea
 * includ ce a acceptat omul când a fost întrebat și nu se deduc din jurnal.
 * Cine șterge o sesiune înregistrată din greșeală corectează evidența, nu
 * cere să i se recalibreze intensitatea.
 */
app.delete('/api/logs/:id', requireDevice, (req, res) => {
  const row = db.prepare('SELECT id, date FROM workout_logs WHERE id = ? AND device_id = ?')
    .get(req.params.id, req.device.id);
  if (!row) return res.status(404).json({ error: 'not_found' });

  db.prepare('DELETE FROM workout_logs WHERE id = ?').run(row.id);
  const totals = recomputeTotals(db, req.device.id);

  res.json({ ok: true, deleted: row.id, totals });
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
