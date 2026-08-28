import { chromium, expect, test } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

test('@claim:offline-review @claim:local-only @claim:source-context-capture @claim:supported-chromium-pages captures a selected phrase, preserves its source context, and reviews it offline', async () => {
  const profile = await mkdtemp(join(tmpdir(), 'keep-the-sentence-extension-'));
  const extensionPath = resolve('dist/extension/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });

  try {
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await context.newPage();
    const pageErrors: string[] = [];
    const requests: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') pageErrors.push(message.text()); });
    page.on('request', (request) => requests.push(request.url()));
    await page.goto('http://127.0.0.1:4173/extension-fixture.html');
    await page.waitForTimeout(300);
    await page.locator('#return-focus').focus();
    await page.locator('#reading-text').evaluate((element) => {
      const text = element.firstChild!;
      const phrase = text.textContent!.indexOf('quietly held');
      const range = document.createRange();
      range.setStart(text, phrase); range.setEnd(text, phrase + 'quietly held'.length);
      const selection = window.getSelection()!;
      selection.removeAllRanges(); selection.addRange(range);
    });
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('quietly held');

    // This is the exact tab message dispatched by the extension's context-menu handler.
    const messageResult = await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/extension-fixture.html' });
      if (!tab?.id) throw new Error('The reading fixture tab was not found.');
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'open-capture', selectionText: 'quietly held' });
      return { tabId: tab.id, url: tab.url, response };
    });
    expect(messageResult.url).toContain('/extension-fixture.html');
    expect(messageResult.response).toBeUndefined();
    await page.waitForTimeout(200);
    expect(pageErrors.filter((error) => !error.includes('404'))).toEqual([]);

    await expect(page.locator('#keep-sentence-capture')).toHaveCount(1);
    const dialog = page.locator('#keep-sentence-capture').locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('quietly held');
    await dialog.getByRole('button', { name: 'Save phrase' }).click();
    await expect(dialog).toContainText('Write a short meaning, then save it.');
    await dialog.getByLabel('Your meaning').fill('remained still and calm');
    await dialog.getByRole('button', { name: 'Save phrase' }).click();
    await expect(dialog).toContainText('Saved. You can review it in the extension.');
    await expect(page.locator('#keep-sentence-capture')).toHaveCount(0);

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.getByRole('heading', { name: 'quietly held' })).toBeVisible();
    const download = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export CSV' }).click();
    const csvDownload = await download;
    expect(csvDownload.suggestedFilename()).toBe('keep-the-sentence.csv');
    const csv = await csvDownload.createReadStream();
    let content = ''; for await (const chunk of csv!) content += chunk;
    expect(content).toContain('quietly held');
    expect(content).toContain('Nora quietly held the door.');
    expect(content).toContain('http://127.0.0.1:4173/extension-fixture.html');
    expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
    await context.setOffline(true);
    await popup.reload();
    await expect(popup.getByRole('heading', { name: 'quietly held' })).toBeVisible();
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});
