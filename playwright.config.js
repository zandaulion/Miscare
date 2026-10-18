import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  fullyParallel: false,
  timeout: 60000,
  use: { baseURL: 'http://127.0.0.1:4198', locale: 'ro-RO', viewport: { width: 412, height: 915 },
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {} },
  webServer: { command: 'node scripts/preview-android.mjs', url: 'http://127.0.0.1:4198', reuseExistingServer: false }
});
