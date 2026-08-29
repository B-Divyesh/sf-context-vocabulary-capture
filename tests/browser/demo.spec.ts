import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SAMPLE_RECORDS, createDeviceKey, encryptVault, exportKey } from '../../src/core';

const siteOrigin = (process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');

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

test('keeps demo network requests on the same origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Mark phrase as remembered' }).click();
  expect(requests.every((url) => new URL(url).origin === siteOrigin)).toBe(true);
  const stored = await page.evaluate(() => Object.values(localStorage).join(' '));
  expect(stored).not.toContain('example.org');
});

test('@claim:demo-sandbox loads sample data from the direct demo URL and can reset it', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Mark phrase as remembered' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('3 total')).toBeVisible();
  const storageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storageKeys).toContain('demo:keep-the-sentence:vault');
  expect(storageKeys).toContain('demo:keep-the-sentence:device-key');
  expect(storageKeys).not.toContain('keep-the-sentence:device-key');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(`${siteOrigin}/`);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Nothing due today.' })).toBeVisible();
  const exitState = await page.evaluate(() => Object.keys(localStorage));
  expect(exitState.filter((key) => key.startsWith('demo:'))).toEqual([]);
  expect(exitState.filter((key) => !key.startsWith('demo:'))).toEqual([]);
});

test('@claim:demo-discard-on-exit discards changed sample data on a header exit and preserves real records', async ({ page }) => {
  const realKey = await createDeviceKey();
  const realVault = await encryptVault({ version: 1, records: [SAMPLE_RECORDS[2]] }, realKey);
  const seed = { key: await exportKey(realKey), vault: realVault };
  await page.goto('/');
  await page.evaluate(({ key, vault }) => {
    localStorage.setItem('keep-the-sentence:device-key', JSON.stringify(key));
    localStorage.setItem('keep-the-sentence:vault', JSON.stringify(vault));
  }, seed);
  const realBefore = await page.evaluate(() => ({
    key: localStorage.getItem('keep-the-sentence:device-key'),
    vault: localStorage.getItem('keep-the-sentence:vault'),
  }));

  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Mark phrase as remembered' }).click();
  await expect(page.locator('.review-action')).toContainText('recoger el hilo');
  await page.getByRole('navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(`${siteOrigin}/privacy`);
  const afterExit = await page.evaluate(() => ({
    demoKeys: Object.keys(localStorage).filter((key) => key.startsWith('demo:')),
    key: localStorage.getItem('keep-the-sentence:device-key'),
    vault: localStorage.getItem('keep-the-sentence:vault'),
  }));
  expect(afterExit).toEqual({ demoKeys: [], ...realBefore });

  await page.getByRole('navigation').getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByRole('heading', { name: 'Read the sentence first.' })).toBeVisible();
  await expect(page.locator('.review-action')).toContainText('quietly held');
  await expect(page.getByText('3 total')).toBeVisible();
});

test('discards demo keys on a full page navigation away from Demo', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Mark phrase as remembered' }).click();
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Your reading notes stay on your device.' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
});

test('opens the isolated sample review in one click from the first screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(`${siteOrigin}/demo`);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review a saved phrase in context.' })).toBeVisible();
  await expect(page.getByText('3 total')).toBeVisible();
});

test('@claim:extension-download lets a fresh visitor download the free extension ZIP without an account or payment', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.facts')).toContainText('Free to download and use');
  const install = page.getByRole('link', { name: 'Download extension ZIP' });
  await expect(install).toHaveAttribute('href', '/downloads/keep-the-sentence-extension.zip');
  const download = page.waitForEvent('download');
  await install.click();
  const archive = await download;
  expect(new URL(archive.url()).origin).toBe(siteOrigin);
  expect(archive.suggestedFilename()).toBe('keep-the-sentence-extension.zip');
  const response = await page.request.get('/downloads/keep-the-sentence-extension.zip');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application');
  expect([...((await response.body()).subarray(0, 4))]).toEqual([80, 75, 3, 4]);
  expect(requests.every((url) => new URL(url).origin === siteOrigin)).toBe(true);
});

test('uses literal phrase-review language and no generic provenance footer claim', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.section-label .eyebrow')).toHaveText('Phrase review');
  await expect(page.locator('.section-label h2')).toHaveText('Review a phrase with its source sentence.');
  await expect(page.locator('footer')).toContainText('Save phrases with source sentences. Review them later.');
  await expect(page.locator('footer')).not.toContainText('Illustration generated for this product.');
  await page.goto('/missing');
  await expect(page.locator('footer')).toContainText('Save phrases with source sentences. Review them later.');
  await expect(page.locator('footer')).not.toContainText('Illustration generated for this product.');
});

test('@claim:unpacked-install gives complete Chromium unpacked-install steps and a loadable ZIP', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Install the extension' }).getByRole('listitem')).toHaveText([
    'Download and extract the ZIP.',
    'Open chrome://extensions in Chromium.',
    'Turn on Developer mode.',
    'Choose Load unpacked. Select the extracted folder.',
  ]);
  const guideResponse = await page.request.get('/downloads/INSTALL.md');
  expect(guideResponse.ok()).toBe(true);
  await expect(page.getByRole('link', { name: 'Read the install guide' })).toHaveAttribute('href', '/downloads/INSTALL.md');

  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download extension ZIP' }).click();
  const archive = await (await downloadEvent).path();
  expect(archive).not.toBeNull();
  const extracted = await mkdtemp(join(tmpdir(), 'keep-the-sentence-package-'));
  const profile = await mkdtemp(join(tmpdir(), 'keep-the-sentence-package-profile-'));
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    const entries = execFileSync('unzip', ['-Z1', archive!], { encoding: 'utf8' });
    expect(entries.split('\n')).toContain('INSTALL.md');
    expect(execFileSync('unzip', ['-p', archive!, 'INSTALL.md'], { encoding: 'utf8' })).toContain('Choose **Load unpacked**.');
    execFileSync('unzip', ['-q', archive!, '-d', extracted]);
    context = await chromium.launchPersistentContext(profile, {
      channel: 'chromium', headless: true,
      args: [`--disable-extensions-except=${extracted}`, `--load-extension=${extracted}`],
    });
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
    expect(new URL(worker.url()).protocol).toBe('chrome-extension:');
  } finally {
    await context?.close();
    await rm(extracted, { recursive: true, force: true });
    await rm(profile, { recursive: true, force: true });
  }
});

test('offers a confirmed, reversible-in-practice recovery for unreadable real local data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('keep-the-sentence:vault', '{not valid JSON');
    localStorage.setItem('keep-the-sentence:device-key', 'not a device key');
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your local notes could not load.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try sample phrases' })).toBeVisible();

  const exportEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download unreadable data' }).click();
  const exported = await (await exportEvent).createReadStream();
  let contents = ''; for await (const chunk of exported!) contents += chunk;
  expect(JSON.parse(contents).localData).toEqual({
    'keep-the-sentence:vault': '{not valid JSON',
    'keep-the-sentence:device-key': 'not a device key',
  });

  const clear = page.getByRole('button', { name: 'Clear unreadable saved data' });
  await clear.click();
  const dialog = page.getByRole('dialog', { name: 'Clear unreadable saved data?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('keep-the-sentence:vault'))).toBe('{not valid JSON');

  await clear.click();
  await dialog.getByRole('button', { name: 'Clear saved phrase data' }).click();
  await expect(page.getByRole('heading', { name: 'Nothing due today.' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('keep-the-sentence:')))).toEqual([]);
});

test('clears unreadable demo data without touching the real local namespace', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('keep-the-sentence:vault', 'real vault remains');
    localStorage.setItem('keep-the-sentence:device-key', 'real key remains');
    localStorage.setItem('demo:keep-the-sentence:vault', '{not valid JSON');
    localStorage.setItem('demo:keep-the-sentence:device-key', 'not a demo key');
  });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Demo data could not load.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear unreadable demo data' }).click();
  await page.getByRole('dialog', { name: 'Clear unreadable demo data?' }).getByRole('button', { name: 'Clear saved phrase data' }).click();
  await expect(page.getByRole('heading', { name: 'Read the sentence first.' })).toBeVisible();
  expect(await page.evaluate(() => ({
    realVault: localStorage.getItem('keep-the-sentence:vault'),
    realKey: localStorage.getItem('keep-the-sentence:device-key'),
  }))).toEqual({ realVault: 'real vault remains', realKey: 'real key remains' });
});

test('keeps the skip link first in the cold-load keyboard order', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.locator('a.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
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

test('serves every public route and every same-origin link', async ({ page }) => {
  const links = new Set<string>();
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    for (const href of await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href))) links.add(href);
  }
  for (const href of links) {
    const url = new URL(href);
    if (url.origin !== siteOrigin) continue;
    url.hash = '';
    expect((await page.request.get(url.toString())).status(), url.toString()).toBe(200);
  }
});

test('routes How it works from every public page to the landing section and preserves back navigation', async ({ page }) => {
  for (const path of ['/demo', '/privacy', '/terms']) {
    await page.goto(path);
    await page.getByRole('navigation').getByRole('link', { name: 'How it works' }).click();
    await expect(page).toHaveURL(/\/#how$/);
    await expect(page.locator('#how')).toBeFocused();
    await expect(page.locator('#how')).toContainText('Save and review a phrase in three steps.');
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  }
});

test('sets route-specific titles, descriptions, canonical URLs, and social metadata', async ({ page }) => {
  const expected = [
    ['/', 'Keep the Sentence — save phrases in context', 'https://context-vocabulary-capture.sociobot.in/', 'Save a phrase with its source sentence, then review it in your browser.'],
    ['/demo', 'Demo — Keep the Sentence', 'https://context-vocabulary-capture.sociobot.in/demo', 'Try three sample phrases with source sentences in Keep the Sentence.'],
    ['/?demo=1', 'Demo — Keep the Sentence', 'https://context-vocabulary-capture.sociobot.in/demo', 'Try three sample phrases with source sentences in Keep the Sentence.'],
    ['/privacy', 'Privacy — Keep the Sentence', 'https://context-vocabulary-capture.sociobot.in/privacy', 'Learn what each saved phrase stores and what Keep the Sentence does not send.'],
    ['/terms', 'Terms — Keep the Sentence', 'https://context-vocabulary-capture.sociobot.in/terms', 'Read the terms for using Keep the Sentence as a personal reading tool.'],
  ] as const;
  for (const [path, title, canonical, description] of expected) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://context-vocabulary-capture.sociobot.in/assets/social.png');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://context-vocabulary-capture.sociobot.in/assets/social.png');
  }
});

test('returns a CSP-clean, fully structured 404 response', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto('/missing');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Keep the Sentence');
  await expect(page.locator('header nav')).toBeVisible();
  await expect(page.locator('a.skip')).toHaveAttribute('href', '#main');
  await expect(page.locator('main h1')).toHaveText('This page could not be found.');
  await expect(page.locator('footer')).toContainText('Privacy');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://context-vocabulary-capture.sociobot.in/404');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Return to Keep the Sentence to save and review phrases with their source sentences.');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Keep the Sentence');
  expect(errors.filter((error) => !error.includes('Failed to load resource: the server responded with a status of 404'))).toEqual([]);
});

test('has no serious or critical accessibility findings in both themes at desktop and 390px', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      for (const path of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
        await page.goto(path);
        const report = await new AxeBuilder({ page }).analyze();
        expect(
          report.violations.filter((finding) => ['serious', 'critical'].includes(finding.impact ?? '')),
          `${colorScheme} ${viewport.width}px ${path}`,
        ).toEqual([]);
      }
    }
  }
});

test('has no serious or critical accessibility findings on the unreadable-data recovery screen', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('keep-the-sentence:vault', '{not valid JSON');
    localStorage.setItem('keep-the-sentence:device-key', 'not a device key');
  });
  await page.reload();
  const report = await new AxeBuilder({ page }).analyze();
  expect(report.violations.filter((finding) => ['serious', 'critical'].includes(finding.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Clear unreadable saved data' }).click();
  const dialogReport = await new AxeBuilder({ page }).analyze();
  expect(dialogReport.violations.filter((finding) => ['serious', 'critical'].includes(finding.impact ?? ''))).toEqual([]);
});

test('revalidates stable hero media and caches fingerprinted bundles immutably', async ({ page }) => {
  const hero = await page.request.get('/assets/dithered-reading-margin.webp');
  expect(hero.headers()['cache-control']).toContain('must-revalidate');
  expect(hero.headers()['cache-control']).not.toContain('immutable');

  await page.goto('/');
  const scriptPath = await page.locator('script[type="module"]').getAttribute('src');
  expect(scriptPath).toMatch(/^\/assets\/index-[\w-]+\.js$/);
  const script = await page.request.get(scriptPath!);
  expect(script.headers()['cache-control']).toContain('immutable');
});

test('works at 390px and with keyboard activation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const review = page.getByRole('button', { name: 'Mark phrase as remembered' });
  await review.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.review-action')).toContainText('recoger el hilo');
  await page.getByRole('navigation').getByRole('link', { name: 'Privacy' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your reading notes stay on your device.');
});

test('keeps every route structured, linked, and usable at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/missing']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(path === '/missing' ? 404 : 200);
    expect(await page.locator('html').getAttribute('lang')).toBe('en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    if (['/privacy', '/terms', '/missing'].includes(path)) expect((await page.getByRole('heading', { level: 1 }).boundingBox())?.x).toBeGreaterThanOrEqual(16);
    const undersized = await page.locator('a, button, summary').evaluateAll((elements) => elements.flatMap((element) => {
      const box = element.getBoundingClientRect();
      const visible = box.width > 0 && box.height > 0;
      return visible && box.height < 44 ? [`${element.tagName}:${element.textContent?.trim()}:${box.height}`] : [];
    }));
    expect(undersized).toEqual([]);
  }
});
