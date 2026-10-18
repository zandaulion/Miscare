import express from 'express';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const app = express();
app.use(express.static(new URL('../dist/android', import.meta.url).pathname));
app.listen(4198, '127.0.0.1');
// A fresh synthetic PWA database, never the developer's data directory.
process.env.NODE_ENV = 'test';
process.env.DATA_DIR = await mkdtemp(path.join(tmpdir(), 'miscare-browser-'));
const { default: pwa } = await import('../server/index.js');
pwa.listen(4199, '127.0.0.1');
