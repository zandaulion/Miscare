import { test, expect } from '@playwright/test';

test('packaged assets: first launch, guided resume, journal, progression, locales, export/import and reset without API', async ({ page }) => {
  const errors = [], api = [], external = [], workers = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/api/')) api.push(request.url());
    if (!request.url().startsWith('http://127.0.0.1:4198/') && !request.url().startsWith('blob:')) external.push(request.url());
  });
  page.on('worker', worker => workers.push(worker.url()));
  // Preview the same native assets in a normal browser; native APIs are unavailable here.
  await page.route('**/native.js', route => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.goto('/');
  await expect(page.locator('#btn-start-guided')).toBeVisible();
  await expect(page.locator('#device-badge')).toContainText('Setări');
  await page.locator('#btn-start-guided').click();
  await expect(page.locator('#guided-overlay')).toBeVisible();
  await page.locator('#rep-plus-btn').click();
  const reps = await page.locator('#rep-value').textContent();
  await page.waitForTimeout(1100);
  await page.reload();
  await expect(page.locator('#guided-overlay')).toBeVisible();
  await expect(page.locator('#guided-pause-btn')).toContainText('Continuă');
  await expect(page.locator('#rep-value')).toHaveText(reps);
  await page.locator('#guided-pause-btn').click();
  await page.locator('#guided-done-btn').click();
  await expect(page.locator('#guided-rest-timer')).toBeVisible();
  await page.reload();
  await expect(page.locator('#guided-rest-timer')).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#guided-close').click();
  await expect(page.locator('#feedback-modal')).toBeVisible();
  await page.reload();
  await expect(page.locator('#feedback-modal')).toBeVisible();
  await page.locator('#btn-save-log').click();
  await expect(page.locator('.log-item')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.log-item')).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-del-log]').click();
  await expect(page.locator('.log-item')).toHaveCount(0);
  await expect(page.locator('.stat-number').first()).toHaveText('0');

  for (let i = 0; i < 2; i++) {
    await page.locator('[data-tab="today"]').click();
    await page.locator('#btn-quick-log').click();
    await page.locator('[data-feedback="easy"]').click();
    await page.locator('#btn-save-log').click();
    await expect(page.locator('.log-item')).toHaveCount(i + 1);
  }
  await page.locator('[data-tab="today"]').click();
  await page.locator('[data-proposal="accept"]').click();
  await expect(page.locator('#revert-progression')).toBeVisible();
  await page.locator('#revert-progression').click();
  await expect(page.locator('#revert-progression')).toHaveCount(0);

  await page.locator('[data-tab="settings"]').click();
  await expect(page.locator('#invite-code-input')).toHaveCount(0);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-data').click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  const locales = await page.locator('#select-language option').evaluateAll(options => options.map(option => option.value));
  expect(locales).toHaveLength(12);
  for (const language of locales) {
    await page.locator('#select-language').selectOption(language);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('#select-language')).toHaveValue(language);
  }
  await page.locator('#select-language').selectOption('ro');
  const fileChooser = page.waitForEvent('filechooser');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-data').click();
  await Promise.all([page.waitForEvent('load'), (async () => (await fileChooser).setFiles(backupPath))()]);
  await expect(page.locator('#select-language')).toBeVisible();
  await page.locator('[data-tab="progress"]').click();
  await expect(page.locator('.log-item')).toHaveCount(2);
  await page.locator('[data-tab="settings"]').click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#reset-data').click();
  await expect(page.locator('#btn-start-guided')).toBeVisible();
  await page.locator('[data-tab="progress"]').click();
  await expect(page.locator('.log-item')).toHaveCount(0);
  expect(api).toEqual([]); expect(external).toEqual([]); expect(workers).toEqual([]); expect(errors).toEqual([]);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
});

test.describe('PWA compatibility', () => {
test('PWA still starts with server mode, invite settings and profile controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Isolate the unchanged update/reload mechanism from this client/view check.
  await page.route('**/pwa-update.js', route => route.fulfill({ body: 'export function installUpdates() {}', contentType: 'application/javascript' }));
  await page.goto('http://127.0.0.1:4199/');
  await expect(page.locator('#btn-start-guided')).toBeVisible();
  await page.locator('[data-tab="settings"]').click();
  await expect(page.locator('#invite-code-input')).toBeVisible();
  await expect(page.locator('#export-data')).toHaveCount(0);
  await page.locator('[data-tab="progress"]').click();
  await expect(page.locator('#select-level')).toBeVisible();
  expect(errors).toEqual([]);
});
});
