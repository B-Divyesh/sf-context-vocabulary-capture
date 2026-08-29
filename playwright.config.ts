import { defineConfig } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: externalBaseURL ?? 'http://127.0.0.1:4173', browserName: 'chromium', headless: true },
  webServer: externalBaseURL ? undefined : { command: 'npm run build:site && npm run preview:site -- --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
