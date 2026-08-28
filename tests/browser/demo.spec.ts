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
});

test('has no serious or critical accessibility findings on the demo', async ({ page }) => {
  await page.goto('/demo');
  const report = await new AxeBuilder({ page }).analyze();
  expect(report.violations.filter((finding) => ['serious', 'critical'].includes(finding.impact ?? ''))).toEqual([]);
});
