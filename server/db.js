import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const defaultDbPath = path.join(DATA_DIR, 'miscare.db');

let currentDb = null;

export function getDb(customPath = null) {
  if (customPath) {
    const db = new DatabaseSync(customPath);
    initDb(db);
    return db;
  }
  if (!currentDb) {
    currentDb = new DatabaseSync(defaultDbPath);
    initDb(currentDb);
  }
  return currentDb;
}

export const nowIso = () => new Date().toISOString();

export function initDb(dbInstance = null) {
  const db = dbInstance || (currentDb || getDb());
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id          TEXT PRIMARY KEY,
      token_hash  TEXT NOT NULL UNIQUE,
      label       TEXT,
      created_at  TEXT NOT NULL,
      last_seen   TEXT,
      revoked     INTEGER DEFAULT 0,
      has_push    INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS invites (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      code_hash   TEXT NOT NULL UNIQUE,
      code        TEXT,
      label       TEXT,
      url         TEXT,
      created_at  TEXT NOT NULL,
      expires_at  TEXT NOT NULL,
      used_at     TEXT,
      revoked     INTEGER DEFAULT 0,
      device_id   TEXT REFERENCES devices(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      device_id           TEXT PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
      level               TEXT NOT NULL DEFAULT 'zero',
      daily_time          INTEGER NOT NULL DEFAULT 10,
      limitations_json    TEXT NOT NULL DEFAULT '[]',
      equipment_json      TEXT NOT NULL DEFAULT '["bodyweight","chair","wall"]',
      preferred_days_json TEXT NOT NULL DEFAULT '[]',
      total_active_days   INTEGER NOT NULL DEFAULT 0,
      total_minutes       INTEGER NOT NULL DEFAULT 0,
      last_feedback       TEXT DEFAULT NULL,
      created_at          TEXT NOT NULL,
      updated_at          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_logs (
      id                  TEXT PRIMARY KEY,
      device_id           TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
      date                TEXT NOT NULL,
      routine_title       TEXT NOT NULL,
      duration_seconds    INTEGER NOT NULL DEFAULT 0,
      completion_status   TEXT NOT NULL,
      exercises_done_json TEXT NOT NULL,
      feedback            TEXT,
      adjustment_note     TEXT,
      created_at          TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_workout_device_date ON workout_logs(device_id, date);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  addColumn(db, 'user_profile', 'rep_step', 'INTEGER NOT NULL DEFAULT 0');
  addColumn(db, 'user_profile', 'easy_streak', 'INTEGER NOT NULL DEFAULT 0');
  // Ce era înainte de ultima schimbare acceptată. Fără asta, „poți reveni
  // oricând" e o formulă de politețe: nu ar exista unde să se revină.
  addColumn(db, 'user_profile', 'prev_level', 'TEXT');
  addColumn(db, 'user_profile', 'prev_rep_step', 'INTEGER');

  // Sesiuni și zile sunt lucruri diferite, iar aplicația le confunda: fiecare
  // sesiune înregistrată creștea „zilele active", deci trei reprize într-o
  // singură zi arătau ca trei zile. Rotația vrea sesiuni -- cine face trei
  // reprize vrea trei sesiuni diferite -- iar realizarea permanentă vrea zile.
  addColumn(db, 'user_profile', 'total_sessions', 'INTEGER NOT NULL DEFAULT 0');
  addColumn(db, 'user_profile', 'last_session_date', 'TEXT');
  backfillDayCounts(db);
}

/**
 * Repară numărătorile pentru conturile existente.
 *
 * total_active_days a fost incrementat per sesiune de la început, așa că
 * valoarea din baza de date e inflatată. Jurnalul are adevărul: câte date
 * distincte are contul. Rulează o singură dată -- total_sessions e zero doar
 * înainte de a fi populat.
 */
function backfillDayCounts(db) {
  const rows = db.prepare(`
    SELECT p.device_id,
           (SELECT COUNT(DISTINCT date) FROM workout_logs w WHERE w.device_id = p.device_id) AS days,
           (SELECT COUNT(*)             FROM workout_logs w WHERE w.device_id = p.device_id) AS sessions,
           (SELECT MAX(date)            FROM workout_logs w WHERE w.device_id = p.device_id) AS last_date
    FROM user_profile p
    WHERE p.total_sessions = 0
  `).all();

  for (const r of rows) {
    if (!r.sessions) continue;
    db.prepare(`
      UPDATE user_profile
      SET total_active_days = ?, total_sessions = ?, last_session_date = ?
      WHERE device_id = ?
    `).run(r.days, r.sessions, r.last_date, r.device_id);
    console.log(`migrated ${r.device_id}: ${r.sessions} sessions across ${r.days} days`);
  }
}

/** Adaugă o coloană dacă lipsește. SQLite nu are ADD COLUMN IF NOT EXISTS. */
function addColumn(db, table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (cols.some((c) => c.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

export const db = getDb();
