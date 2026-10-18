// Capture the shipped Android web assets with isolated, explicitly synthetic data.
// No phone screenshots, production database, credentials or live records are read.
import express from 'express';
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'store');
const profiles = [
  { name: 'phone', folder: 'phone-screenshots', viewport: { width: 540, height: 960 }, scale: 2 },
  { name: 'tablet-7', folder: 'tablet-7-screenshots', viewport: { width: 720, height: 1280 }, scale: 2 },
  { name: 'tablet-10', folder: 'tablet-10-screenshots', viewport: { width: 1280, height: 720 },
    guidedViewport: { width: 720, height: 1280 }, scale: 2 }
];
const temporary = await mkdtemp(path.join(tmpdir(), 'miscare-store-'));
execFileSync('unzip', ['-q', path.join(root, 'artifacts/Miscare-0.1.0.apk'), 'assets/public/*', '-d', temporary]);
const app = express();
app.use(express.static(path.join(temporary, 'assets/public')));
app.use('/store', express.static(output));
app.get('/render-font.ttf', (req, res) => res.sendFile(process.env.EMOJI_FONT || '/tmp/miscare-store-NotoColorEmoji.ttf'));
const server = await new Promise(resolve => {
  const server = app.listen(0, '127.0.0.1', () => resolve(server));
});
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const metadata = { source: 'Web assets extracted from the signed Android 0.1.0 APK, rendered without OS chrome',
  apk_sha256: createHash('sha256').update(await readFile(path.join(root, 'artifacts/Miscare-0.1.0.apk'))).digest('hex'),
  fixture: 'Synthetic workout history generated exclusively for store screenshots',
  profiles, screenshots: {} };
try {
  for (const [language, locale] of [['en-US', 'en'], ['ro-RO', 'ro']]) {
    metadata.screenshots[language] = {};
    for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: profile.scale,
      locale: language, timezoneId: 'Europe/Bucharest', colorScheme: 'light', reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-10-17T09:00:00Z'));
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.route('**/native.js', route => route.fulfill({ body: '', contentType: 'application/javascript' }));
    await page.route('**/api/**', route => { errors.push('Unexpected API request'); return route.abort(); });
    page.on('request', request => {
      if (!request.url().startsWith(origin + '/') && !request.url().startsWith('data:')) {
        errors.push('Unexpected external request: ' + request.url());
      }
    });
    await page.addInitScript(locale => {
      localStorage.setItem('miscare-locale', locale);
      localStorage.setItem('miscare_sound_enabled', 'false');
    }, locale);
    await page.goto(origin);
    await page.locator('#btn-start-guided').waitFor();
    await page.evaluate(async () => {
      const { createLocalClient } = await import('/local-client.js');
      const { exText, repWords } = await import('/i18n.js');
      // These dates, sessions and feedback are fixtures, unrelated to any user.
      for (let i = 0; i < 5; i++) {
        const date = new Date(`2026-10-${String(8 + i * 2).padStart(2, '0')}T09:00:00Z`);
        const client = createLocalClient({ now: () => date, uuid: () => `synthetic-store-session-${i}` });
        await client.probe();
        const routine = await client.getTodayRoutine();
        await client.logWorkout({ duration_seconds: i % 2 ? 600 : 300, feedback: 'just_right',
          routine_title: routine.title, exercises_done: routine.exercises.map(ex => ({
            id: ex.id, name: exText(ex.id, 'name'), actual_reps: ex.reps.lo, unit: repWords().reps.unit[ex.reps.unit], set: 1, totalSets: 1
          })) });
      }
    });
    await page.reload();
    await page.locator('#btn-start-guided').waitFor();
    await page.addStyleTag({ content: `@font-face{font-family:StoreEmoji;src:url('/render-font.ttf');unicode-range:U+1F000-1FAFF,U+2600-27BF,U+2300-23FF,U+2B00-2BFF,U+FE0E-FE0F} :root{--font-main:StoreEmoji,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'DejaVu Sans',sans-serif}button,input,select{font-family:var(--font-main)}` });
    await page.evaluate(async () => {
      await Promise.all([...document.images].filter(img => img.complete === false).map(img => new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })));
      await document.fonts.ready;
    });
    const directory = path.join(output, language, profile.folder);
    await mkdir(directory, { recursive: true });
    const shots = [];
    async function shot(name, scroll = 0) {
      await page.evaluate(async scroll => { window.scrollTo(0,scroll); await document.fonts.load('16px StoreEmoji'); await document.fonts.ready;
        await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); }, scroll);
      const issues = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'))
      }));
      if (issues.overflow || issues.brokenImages.length) throw new Error(JSON.stringify({ name, profile: profile.name, ...issues }));
      await page.screenshot({ path: path.join(directory, name), animations: 'disabled', omitBackground: false });
      shots.push(name);
      console.log(`${language}/${profile.folder}/${name}`);
    }
    await shot('01-today.png');
    // Rotate the large tablet for the guided session, as a user can in the app.
    // Keep the packaged layout intact, including its landscape limitations.
    if (profile.guidedViewport) await page.setViewportSize(profile.guidedViewport);
    await page.locator('#btn-start-guided').click();
    await page.locator('#guided-overlay').waitFor();
    await page.locator('#guided-pause-btn').click();
    await shot('02-guided-session.png');
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#guided-close').click();
    if (profile.guidedViewport) await page.setViewportSize(profile.viewport);
    await page.locator('[data-tab="compendium"]').click();
    await page.locator('.level-chip[data-level="0"]').click();
    await page.locator('#card-ex-wall_pushups').waitFor();
    if (profile.viewport.width >= 1000) {
      await page.locator('#card-ex-wall_pushups').click();
      await page.locator('#ex-sheet').waitFor();
      await shot('03-exercise-library.png');
      await page.locator('#ex-sheet-close').click();
    } else {
      await shot('03-exercise-library.png', await page.locator('#compendium-results-container').evaluate(el => el.offsetTop - 95));
    }
    await page.locator('[data-tab="equipment"]').click();
    await page.locator('#btn-save-equipment').waitFor();
    await shot('04-equipment.png');
    await page.locator('[data-tab="progress"]').click();
    await page.locator('.log-item').first().waitFor();
    await shot('05-journal.png');
    await page.locator('[data-tab="settings"]').click();
    await page.locator('#export-data').waitFor();
    await shot('06-your-data.png');
    if (errors.length) throw new Error(JSON.stringify(errors));
    metadata.screenshots[language][profile.name] = shots;
    await context.close();
    }
  }
  const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
  const original = await readFile(path.join(root, 'web/icons/icon.svg'), 'utf8');
  const icon = original.replace(' rx="112"', '');
  await writeFile(path.join(output, 'source/store-icon.svg'), icon);
  await page.setContent(`<html><head><style>*{margin:0}html,body{width:512px;height:512px;overflow:hidden}</style></head><body>${icon}</body></html>`);
  await page.screenshot({ path: path.join(output, 'graphics/icon-512.png'), omitBackground: true });
  await page.close();
  await writeFile(path.join(output, 'source/capture-manifest.json'), JSON.stringify(metadata, null, 2) + '\n');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
