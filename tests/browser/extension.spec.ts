import { chromium, expect, test, type BrowserContext, type Page, type Worker } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { decryptVault, importKey, type Capture, type EncryptedVault } from '../../src/core';

const sourceOrigin = 'http://127.0.0.1:4173';

type ExtensionSession = {
  context: BrowserContext;
  worker: Worker;
  extensionId: string;
  page: Page;
  close: () => Promise<void>;
};

async function openExtension(): Promise<ExtensionSession> {
  const profile = await mkdtemp(join(tmpdir(), 'keep-the-sentence-extension-'));
  const extensionPath = resolve('dist/extension/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium', headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const page = await context.newPage();
  return {
    context, worker, page, extensionId: new URL(worker.url()).host,
    close: async () => { await context.close(); await rm(profile, { recursive: true, force: true }); },
  };
}

async function saveFixtureCapture(session: ExtensionSession) {
  const pageErrors: string[] = [];
  session.page.on('console', (message) => { if (message.type() === 'error') pageErrors.push(message.text()); });
  await session.page.goto(`${sourceOrigin}/extension-fixture.html`);
  await session.page.locator('#return-focus').focus();
  await session.page.locator('#reading-text').evaluate((element) => {
    const text = element.firstChild!;
    const phrase = text.textContent!.indexOf('quietly held');
    const range = document.createRange();
    range.setStart(text, phrase); range.setEnd(text, phrase + 'quietly held'.length);
    const selection = window.getSelection()!;
    selection.removeAllRanges(); selection.addRange(range);
  });
  await expect.poll(() => session.page.evaluate(() => window.getSelection()?.toString())).toBe('quietly held');
  const messageResult = await session.worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/extension-fixture.html' });
    if (!tab?.id) throw new Error('The reading fixture tab was not found.');
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'open-capture', selectionText: 'quietly held' });
    return { url: tab.url, response };
  });
  expect(messageResult.url).toContain('/extension-fixture.html');
  expect(messageResult.response).toBeUndefined();
  const dialog = session.page.locator('#keep-sentence-capture').locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('quietly held');
  await dialog.getByRole('button', { name: 'Save phrase' }).click();
  await expect(dialog).toContainText('Write a short meaning, then save it.');
  await dialog.getByLabel('Your meaning').fill('remained still and calm');
  await dialog.getByRole('button', { name: 'Save phrase' }).click();
  await expect(dialog).toContainText('Saved. You can review it in the extension.');
  await expect(session.page.locator('#keep-sentence-capture')).toHaveCount(0);
  expect(pageErrors.filter((error) => !error.includes('404'))).toEqual([]);
}

async function openPopup(session: ExtensionSession) {
  const popup = await session.context.newPage();
  await popup.goto(`chrome-extension://${session.extensionId}/popup.html`);
  await expect(popup.getByRole('heading', { name: 'quietly held' })).toBeVisible();
  return popup;
}

test.describe.configure({ mode: 'serial' });

test('@claim:offline-review captures a phrase and reopens its review offline', async () => {
  const session = await openExtension();
  try {
    await saveFixtureCapture(session);
    const popup = await openPopup(session);
    await session.context.setOffline(true);
    await popup.reload();
    await expect(popup.getByRole('heading', { name: 'quietly held' })).toBeVisible();
  } finally { await session.close(); }
});

test('@claim:local-only keeps a capture flow on the source origin', async () => {
  const session = await openExtension();
  const requests: string[] = [];
  session.context.on('request', (request) => requests.push(request.url()));
  try {
    await saveFixtureCapture(session);
    await openPopup(session);
    const httpRequests = requests.filter((url) => /^https?:/.test(url));
    expect(httpRequests).not.toEqual([]);
    expect(httpRequests.every((url) => new URL(url).origin === sourceOrigin)).toBe(true);
  } finally { await session.close(); }
});

test('@claim:source-context-capture exports the selected phrase, nearby sentences, and source link', async () => {
  const session = await openExtension();
  try {
    await saveFixtureCapture(session);
    const popup = await openPopup(session);
    const download = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export CSV' }).click();
    const csv = await (await download).createReadStream();
    let content = ''; for await (const chunk of csv!) content += chunk;
    expect(content).toContain('quietly held');
    expect(content).toContain('Nora quietly held the door.');
    expect(content).toContain(`${sourceOrigin}/extension-fixture.html`);
  } finally { await session.close(); }
});

test('@claim:supported-chromium-pages saves a selection from a regular Chromium web page', async () => {
  const session = await openExtension();
  try {
    await saveFixtureCapture(session);
    const popup = await openPopup(session);
    await expect(popup.getByText('1 saved locally')).toBeVisible();
  } finally { await session.close(); }
});

test('@claim:storage-scope stores only the documented encrypted record fields', async () => {
  const session = await openExtension();
  try {
    await saveFixtureCapture(session);
    const popup = await openPopup(session);
    await popup.getByRole('button', { name: 'Mark phrase as remembered' }).click();
    await expect(popup.getByRole('heading', { name: 'No phrases due today' })).toBeVisible();
    const stored = await session.worker.evaluate(async () => chrome.storage.local.get([
      'keep-the-sentence:vault', 'keep-the-sentence:device-key',
    ]));
    expect(Object.keys(stored).sort()).toEqual(['keep-the-sentence:device-key', 'keep-the-sentence:vault']);
    const vault = await decryptVault(stored['keep-the-sentence:vault'] as EncryptedVault, await importKey(stored['keep-the-sentence:device-key'] as string));
    expect(vault.records).toHaveLength(1);
    expect(Object.keys(vault.records[0] as Capture).sort()).toEqual([
      'context', 'createdAt', 'gloss', 'id', 'language', 'phrase', 'reviewedAt', 'reviews', 'title', 'url',
    ]);
    expect(vault.records[0]).toMatchObject({
      phrase: 'quietly held',
      context: 'The first train arrived late. Nora quietly held the door. Everyone stepped inside.',
      title: 'Reading fixture', url: `${sourceOrigin}/extension-fixture.html`, language: 'en',
      gloss: 'remained still and calm', reviews: 1,
    });
    expect(vault.records[0].reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  } finally { await session.close(); }
});

test('@claim:no-analytics makes no analytics or product-data requests during capture, popup, and demo', async () => {
  const session = await openExtension();
  const requests: string[] = [];
  session.context.on('request', (request) => requests.push(request.url()));
  try {
    await saveFixtureCapture(session);
    await openPopup(session);
    const demo = await session.context.newPage();
    await demo.goto(`${sourceOrigin}/?demo=1`);
    await expect(demo.getByText('Demo — sample data, nothing is saved')).toBeVisible();
    await demo.getByRole('button', { name: 'Mark phrase as remembered' }).click();
    const httpRequests = requests.filter((url) => /^https?:/.test(url));
    expect(httpRequests).not.toEqual([]);
    expect(httpRequests.every((url) => new URL(url).origin === sourceOrigin)).toBe(true);
  } finally { await session.close(); }
});
