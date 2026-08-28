import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:csv-export downloads the sample records with their source context', async ({ page }) => {
  await page.goto('/demo');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = await (await download).createReadStream();
  let content = ''; for await (const chunk of csv!) content += chunk;
  expect(content).toContain('"phrase"');
  expect(content).toContain('"quietly held"');
  expect(content.split('\n')).toHaveLength(4);
});

test('@claim:local-only keeps the demo network requests on the same origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'I remembered it' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const stored = await page.evaluate(() => Object.values(localStorage).join(' '));
  expect(stored).not.toContain('example.org');
});

test('@claim:demo-sandbox loads sample data from the direct demo URL and can reset it', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'I remembered it' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('3 total')).toBeVisible();
  const storageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storageKeys).toContain('demo:keep-the-sentence:vault');
  expect(storageKeys).toContain('demo:keep-the-sentence:device-key');
  expect(storageKeys).not.toContain('keep-the-sentence:device-key');
});

test('@claim:extension-download serves the install ZIP from the deployment output', async ({ page }) => {
  const response = await page.request.get('/downloads/keep-the-sentence-extension.zip');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application');
  expect([...((await response.body()).subarray(0, 4))]).toEqual([80, 75, 3, 4]);
});

test('keeps sample source links live and announces route changes', async ({ page }) => {
  await page.goto('/demo');
  for (const href of await page.locator('.source a').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href))) {
    const response = await page.request.get(href);
    expect(response.ok()).toBe(true);
  }
  await page.getByRole('navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcement')).toContainText('Privacy — Keep the Sentence.');
});

test('has no serious or critical accessibility findings on the demo', async ({ page }) => {
  await page.goto('/demo');
  const report = await new AxeBuilder({ page }).analyze();
  expect(report.violations.filter((finding) => ['serious', 'critical'].includes(finding.impact ?? ''))).toEqual([]);
});

test('works at 390px and with keyboard activation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const review = page.getByRole('button', { name: 'I remembered it' });
  await review.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.review-action')).toContainText('recoger el hilo');
  await page.getByRole('navigation').getByRole('link', { name: 'Privacy' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your reading notes stay on your device.');
});
