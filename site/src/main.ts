import { SAMPLE_RECORDS, due, makeCsv, type Capture } from '../../src/core';
import { discardVault, readVault, replaceRecords, reviewCapture, unreadableVaultData } from '../../src/storage';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const isDemo = () => location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const route = () => location.pathname.replace(/\/$/, '') || '/';
const html = String.raw;
const esc = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const siteUrl = 'https://context-vocabulary-capture.sociobot.in';
type PageMetadata = { title: string; description: string; path: string };
const metadata: Record<string, PageMetadata> = {
  '/': { title: 'Keep the Sentence — save phrases in context', description: 'Save a phrase with its source sentence, then review it in your browser.', path: '/' },
  '/demo': { title: 'Demo — Keep the Sentence', description: 'Try three sample phrases with source sentences in Keep the Sentence.', path: '/demo' },
  '/privacy': { title: 'Privacy — Keep the Sentence', description: 'Learn which local phrase records Keep the Sentence stores and what it does not send.', path: '/privacy' },
  '/terms': { title: 'Terms — Keep the Sentence', description: 'Read the terms for using Keep the Sentence as a personal reading tool.', path: '/terms' },
  '/404': { title: 'Page not found — Keep the Sentence', description: 'Return to Keep the Sentence to save and review phrases with their source sentences.', path: '/404' },
};
function setMetadata(key: keyof typeof metadata) {
  const page = metadata[key];
  document.title = page.title;
  const canonical = `${siteUrl}${page.path}`;
  const set = (selector: string, value: string) => document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)?.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
  set('meta[name="description"]', page.description);
  set('link[rel="canonical"]', canonical);
  set('meta[property="og:title"]', page.title);
  set('meta[property="og:description"]', page.description);
  set('meta[name="twitter:title"]', page.title);
  set('meta[name="twitter:description"]', page.description);
}
const download = (records: Capture[]) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([makeCsv(records)], { type: 'text/csv;charset=utf-8' })); a.download = 'keep-the-sentence.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };

function header() { return html`<header class="site-header"><a class="wordmark" href="/" data-route><span aria-hidden="true">///</span> Keep the Sentence</a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/#how" data-route>How it works</a><a href="/privacy" data-route>Privacy</a></nav></header>`; }
function footer() { return html`<footer><p>Save source sentences. Review them later.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · v1.0.0</p><p class="generated-note">Illustration generated for this product.</p></footer>`; }
function demoBanner() { return html`<aside class="demo-banner" aria-label="Demo controls"><span><strong>Demo</strong> — sample data, nothing is saved</span><button id="reset-demo">Reset demo</button><a href="/" data-route>Start for real</a></aside>`; }
function card(record: Capture, compact = false) { return html`<article class="phrase-card ${compact ? 'compact' : ''}"><span class="card-mark" aria-hidden="true"></span><p class="phrase">${esc(record.phrase)}</p><blockquote>${esc(record.context)}</blockquote><p class="gloss"><strong>Your meaning:</strong> ${esc(record.gloss)}</p><p class="source"><a href="${esc(record.url)}" target="_blank" rel="noreferrer">${esc(record.title)} <span class="external">(opens source)</span></a> · ${esc(record.language)}</p></article>`; }

async function productBoard(demo: boolean) {
  const vault = await readVault(demo ? 'demo:' : ''); const records = vault.records; const today = due(records)[0];
  return html`<section class="board" aria-labelledby="board-title"><div class="board-heading"><div><p class="eyebrow">${demo ? 'Sample phrases to review' : 'Your phrases to review'}</p><h2 id="board-title">${today ? 'Read the sentence first.' : 'Nothing due today.'}</h2></div><button class="quiet-button" id="export-csv" ${records.length ? '' : 'disabled'}>Export CSV</button></div>${today ? `<div class="review-row"><div>${card(today)}</div><div class="review-action"><p>Can you recall what <strong>${esc(today.phrase)}</strong> means here?</p><details><summary>Show your meaning</summary><p>${esc(today.gloss)}</p></details><button class="primary" id="remembered">Mark phrase as remembered</button><p class="small">This records one review today.</p></div></div>` : `<div class="empty"><p>Saved phrases will appear here after you capture one.</p><a class="primary link-button" href="/demo" data-route>Try sample phrases</a></div>`}<div class="saved-head"><h3>Saved phrases</h3><span>${records.length} total</span></div><div class="saved-list">${records.slice(0, 4).map((r) => card(r, true)).join('') || '<p>No saved phrases yet.</p>'}</div></section>`;
}
async function landing() {
  setMetadata('/');
  app.innerHTML = html`${header()}<main id="main" tabindex="-1"><section class="hero"><div class="hero-copy"><p class="eyebrow">A local browser extension</p><h1>Save phrases with their source sentence.</h1><p class="lede">For language learners reading web pages who want to remember a phrase and its context.</p><div class="actions"><a class="primary link-button" href="/demo" data-route>Try it with sample data</a><span>Open sample phrases ready to review.</span></div><ul class="facts"><li>Saved phrases stay on your device</li><li>Works without an account</li><li>Review saved phrases offline</li></ul></div><figure class="hero-art"><img src="/assets/dithered-reading-margin.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="A blank open book, a bookmark, a flashcard, and halftone dots show a saved phrase beside its source sentence."></figure></section><section class="preview-section"><div class="section-label"><p class="eyebrow">A sentence stays attached</p><h2>Review the phrase where you met it.</h2></div>${await productBoard(false)}</section><section id="how" class="how" tabindex="-1"><p class="eyebrow">How it works</p><h2>Save and review a phrase in three steps.</h2><ol><li><strong>Select the phrase.</strong><span>Choose “Keep this sentence” from the page menu.</span></li><li><strong>Write a short meaning.</strong><span>Your saved phrase includes nearby sentences and the source link.</span></li><li><strong>Review today’s phrases.</strong><span>Try the phrase in context before you reveal your meaning.</span></li></ol></section><section class="privacy-blurb"><div><p class="eyebrow">Privacy and data export</p><h2>Your saved phrases stay private and local.</h2></div><p>Records store a phrase, nearby text, source title and link, language, your meaning, and review details. Export your records as CSV.</p></section><section class="install" aria-labelledby="install-heading"><div><p class="eyebrow">Install the extension</p><h2 id="install-heading">Capture phrases from regular web pages in Chromium.</h2><p>Download the ZIP, then load its extracted folder in Chromium.</p><ol class="install-steps" aria-label="Install the extension"><li>Download and extract the ZIP.</li><li>Open <code>chrome://extensions</code> in Chromium.</li><li>Turn on Developer mode.</li><li>Choose <strong>Load unpacked</strong>. Select the extracted folder.</li></ol><p><a href="/downloads/INSTALL.md" download>Read the install guide</a></p></div><a class="primary link-button" href="/downloads/keep-the-sentence-extension.zip" download>Download extension ZIP</a></section></main>${footer()}`;
}
async function demo() {
  setMetadata('/demo');
  const current = await readVault('demo:'); if (!current.records.length) await replaceRecords(SAMPLE_RECORDS, 'demo:');
  app.innerHTML = html`${header()}${demoBanner()}<main id="main" tabindex="-1"><section class="demo-intro"><p class="eyebrow">Try the review flow</p><h1>Review a saved phrase in context.</h1><p class="lede">These phrases are sample data. Reset them whenever you want.</p></section>${await productBoard(true)}<section class="demo-capture"><p class="eyebrow">What each saved phrase includes</p><h2>A phrase, two nearby sentences, a source link, and your meaning.</h2><p>In the extension, select text on a page. Choose “Keep this sentence.”</p></section></main>${footer()}`;
}
function legal(kind: 'privacy' | 'terms') { const privacy = kind === 'privacy'; setMetadata((`/${kind}`) as '/privacy' | '/terms'); app.innerHTML = html`${header()}<main id="main" class="legal" tabindex="-1"><h1>${privacy ? 'Your reading notes stay on your device.' : 'Terms for Keep the Sentence.'}</h1>${privacy ? `<p>It uses your browser’s local extension storage. Records are encrypted with AES-GCM before storage.</p><p>It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates.</p><p>The extension sends no analytics or product data to any server. The sample demo uses separate local storage and is discarded when you leave it.</p><p>You can export your phrases as CSV. Removing the extension or clearing its browser storage may remove your local data.</p>` : `<p>Keep the Sentence is a local reading utility. Use it only for text you may read and save for personal study.</p><p>Do not use the extension to redistribute source text. You are responsible for the web pages you select from.</p><p>The extension is provided as-is.</p>`}<p><a href="/" data-route>Return home</a></p></main>${footer()}`; }
function notFound() { setMetadata('/404'); app.innerHTML = html`${header()}<main id="main" class="not-found" tabindex="-1"><h1>This page could not be found.</h1><p>Try the home page or the sample phrases.</p><p><a class="primary link-button" href="/" data-route>Go home</a></p></main>${footer()}`; }
let renderedDemo = false;
const demoStorageKeys = ['demo:keep-the-sentence:vault', 'demo:keep-the-sentence:device-key'];
function discardDemoBeforePageExit() {
  // pagehide cannot wait for crypto work. Local demo state is therefore removed synchronously.
  demoStorageKeys.forEach((key) => localStorage.removeItem(key));
}
async function discardDemo() {
  await discardVault('demo:');
}
type RenderOptions = { moveFocus?: boolean };
async function render({ moveFocus = false }: RenderOptions = {}) {
  const enteringDemo = isDemo();
  if (renderedDemo && !enteringDemo) await discardDemo();
  const path = route();
  if (path === '/demo' || (path === '/' && isDemo())) await demo();
  else if (path === '/') await landing();
  else if (path === '/privacy' || path === '/terms') legal(path.slice(1) as 'privacy' | 'terms');
  else notFound();
  renderedDemo = enteringDemo;
  bind();
  if (!moveFocus) return;
  const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  const focusTarget = target ?? document.querySelector<HTMLElement>('h1');
  if (focusTarget) {
    focusTarget.tabIndex = -1;
    focusTarget.focus();
    const announcement = document.querySelector<HTMLElement>('#route-announcement');
    if (announcement) announcement.textContent = target ? `${target.querySelector('h2')?.textContent ?? 'Section'} section.` : `${document.title}.`;
  }
}
function downloadUnreadableData(data: Record<string, unknown>) {
  const payload = JSON.stringify({ product: 'Keep the Sentence', exportedAt: new Date().toISOString(), localData: data }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'keep-the-sentence-unreadable-data.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 500);
}
function showRecovery(namespace = isDemo() ? 'demo:' : '') {
  const demoRecovery = namespace === 'demo:';
  const dataName = demoRecovery ? 'sample data' : 'saved phrase data';
  const heading = demoRecovery ? 'Demo data could not load.' : 'Your local notes could not load.';
  const clearLabel = demoRecovery ? 'Clear unreadable demo data' : 'Clear unreadable saved data';
  const clearScope = demoRecovery
    ? 'This removes only Keep the Sentence sample data from this browser. It cannot be undone.'
    : 'This removes only Keep the Sentence phrase data from this browser. It cannot be undone.';
  setMetadata('/');
  app.innerHTML = html`${header()}<main id="main" class="recovery" tabindex="-1"><section aria-labelledby="recovery-title"><p class="eyebrow">Local data needs attention</p><h1 id="recovery-title">${heading}</h1><p role="alert">This browser has ${dataName} that cannot be read.</p><p>Download it first if you may need it. You can then clear only Keep the Sentence data and start again.</p><div class="recovery-actions"><button class="quiet-button" id="download-unreadable-data">Download unreadable data</button><button class="danger-button" id="clear-unreadable-data">${clearLabel}</button></div><p><a href="/demo" data-route>Try sample phrases</a> · <a href="/privacy" data-route>Read privacy details</a></p></section><dialog id="recovery-confirm" class="recovery-dialog" aria-labelledby="recovery-confirm-title"><form method="dialog"><h2 id="recovery-confirm-title">${clearLabel}?</h2><p>${clearScope}</p><div class="dialog-actions"><button value="cancel" class="quiet-button">Cancel</button><button value="clear" class="danger-button">Clear saved phrase data</button></div></form></dialog></main>${footer()}`;
  bind();
  const dialog = document.querySelector<HTMLDialogElement>('#recovery-confirm')!;
  document.querySelector('#download-unreadable-data')?.addEventListener('click', async () => downloadUnreadableData(await unreadableVaultData(namespace)));
  document.querySelector('#clear-unreadable-data')?.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', async () => {
    if (dialog.returnValue !== 'clear') return;
    try {
      await discardVault(namespace);
      await render({ moveFocus: true });
    } catch {
      showRecovery(namespace);
    }
  });
}
async function safelyRender(options: RenderOptions = {}) {
  try {
    await render(options);
  } catch {
    showRecovery();
  }
}
function bind() {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((a) => a.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      if (isDemo() && !new URL(a.href).pathname.startsWith('/demo')) await discardDemo();
      history.pushState({}, '', a.href);
      await safelyRender({ moveFocus: true });
    } catch {
      showRecovery();
    }
  }));
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { try { await replaceRecords(SAMPLE_RECORDS, 'demo:'); await safelyRender(); } catch { showRecovery(); } });
  document.querySelector('#remembered')?.addEventListener('click', async () => { try { const record = due((await readVault(isDemo() ? 'demo:' : '')).records)[0]; if (record) { await reviewCapture(record.id, isDemo() ? 'demo:' : ''); await safelyRender(); } } catch { showRecovery(); } });
  document.querySelector('#export-csv')?.addEventListener('click', async () => download((await readVault(isDemo() ? 'demo:' : '')).records));
}
window.addEventListener('pagehide', () => { if (isDemo()) discardDemoBeforePageExit(); });
window.addEventListener('popstate', () => { void safelyRender({ moveFocus: true }); });
void safelyRender();
