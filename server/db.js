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

    CREATE TABLE IF NOT EXISTS equipment_scans (
      id                  TEXT PRIMARY KEY,
      device_id           TEXT REFERENCES devices(id) ON DELETE CASCADE,
      detected_items_json TEXT NOT NULL,
      created_at          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export const db = getDb();
