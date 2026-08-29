import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const sentences = (value: string) => normalize(value).split(/(?<=[.!?])\s+/u).filter(Boolean);
const wordCount = (value: string) => normalize(value).split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;

function auditRows() {
  const markdown = readFileSync('.factory/copy-audit.md', 'utf8');
  return [...markdown.matchAll(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|$/gm)].map((match) => ({
    count: Number(match[1]),
    text: normalize(match[2].replaceAll('\\|', '|').replaceAll('`', '')),
  }));
}

function readmeUnits() {
  const lines = readFileSync('README.md', 'utf8').split('\n');
  const units: string[] = [];
  let code = false;
  for (const raw of lines) {
    if (raw.trim().startsWith('```')) { code = !code; continue; }
    if (code || !raw.trim()) continue;
    const plain = raw
      .replace(/^#{1,6}\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '');
    units.push(...sentences(plain));
  }
  return [...new Set(units)];
}

test('copy audit matches every rendered landing label and every README prose line', async ({ page }) => {
  await page.goto('/');
  const landingUnits = await page.locator('a, button, h1, h2, h3, p, li, strong, span:not([aria-hidden]), img[alt]').evaluateAll((elements) => {
    const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();
    const result: string[] = [];
    for (const element of elements) {
      if (element.closest('.phrase-card') || element.getAttribute('aria-hidden') === 'true') continue;
      let text = '';
      if (element instanceof HTMLImageElement) text = element.alt;
      else {
        const clone = element.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('[aria-hidden="true"]').forEach((child) => child.remove());
        clone.querySelectorAll('*').forEach((child) => child.before(document.createTextNode(' ')));
        text = clone.textContent ?? '';
      }
      text = normalizeText(text);
      if (!text) continue;
      result.push(...text.split(/(?<=[.!?])\s+/u).filter(Boolean));
    }
    return [...new Set(result)];
  });

  const rows = auditRows();
  const audited = new Set(rows.map((row) => row.text));
  for (const unit of [...landingUnits, ...readmeUnits()]) expect(audited, `missing copy-audit row: ${unit}`).toContain(unit);
  for (const row of rows) expect(row.count, `wrong word count: ${row.text}`).toBe(wordCount(row.text));
  expect(Math.max(...rows.map((row) => row.count))).toBeLessThanOrEqual(22);
});

test('copy audit keeps the documented extension boundary and meaning vocabulary', () => {
  const audited = new Set(auditRows().map((row) => row.text));
  const extensionSource = [
    readFileSync('entrypoints/popup/main.ts', 'utf8'),
    readFileSync('entrypoints/content.ts', 'utf8'),
  ].join('\n');
  const requiredExtensionCopy = [
    'Select a phrase on a regular web page. Choose “Keep this sentence”.',
    'Write a short meaning',
    'Your phrases could not load',
    'This extension has saved phrase data that cannot be read.',
    'Download unreadable data',
    'Clear unreadable saved data',
    'This removes only Keep the Sentence phrase data from this browser.',
    'Clear saved phrase data',
  ];
  for (const copy of requiredExtensionCopy) {
    expect(audited, `missing extension copy-audit row: ${copy}`).toContain(copy);
    expect(extensionSource, `extension source drifted from audited copy: ${copy}`).toContain(copy);
  }
  expect(extensionSource).not.toMatch(/\bany page\b/iu);
  expect(extensionSource).not.toMatch(/\bcue\b/iu);
});
