import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Preloaded in each test worker before server/db.js opens its default database.
// Always use a fresh directory, including when the caller has DATA_DIR set.
const directory = mkdtempSync(path.join(tmpdir(), 'miscare-tests-'));
process.env.DATA_DIR = directory;
process.on('exit', () => rmSync(directory, { recursive: true, force: true }));
