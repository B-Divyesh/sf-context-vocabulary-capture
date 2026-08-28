import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', headless: true },
  webServer: { command: 'npm run build:site && npm run preview:site -- --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
