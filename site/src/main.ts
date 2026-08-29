import { SAMPLE_RECORDS, due, makeCsv, type Capture } from '../../src/core';
import { clearVault, readVault, replaceRecords, reviewCapture } from '../../src/storage';
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
function demoBanner() { return html`<aside class="demo-banner" aria-label="Demo controls"><span><strong>Demo</strong> — sample data, nothing is saved</span><button id="reset-demo">Reset demo</button><a href="/" data-route data-exit-demo>Start for real</a></aside>`; }
function card(record: Capture, compact = false) { return html`<article class="phrase-card ${compact ? 'compact' : ''}"><span class="card-mark" aria-hidden="true"></span><p class="phrase">${esc(record.phrase)}</p><blockquote>${esc(record.context)}</blockquote><p class="gloss"><strong>Your meaning:</strong> ${esc(record.gloss)}</p><p class="source"><a href="${esc(record.url)}" target="_blank" rel="noreferrer">${esc(record.title)} <span class="external">(opens source)</span></a> · ${esc(record.language)}</p></article>`; }

async function productBoard(demo: boolean) {
  const vault = await readVault(demo ? 'demo:' : ''); const records = vault.records; const today = due(records)[0];
  return html`<section class="board" aria-labelledby="board-title"><div class="board-heading"><div><p class="eyebrow">${demo ? 'Sample phrases to review' : 'Your phrases to review'}</p><h2 id="board-title">${today ? 'Read the sentence first.' : 'Nothing due today.'}</h2></div><button class="quiet-button" id="export-csv" ${records.length ? '' : 'disabled'}>Export CSV</button></div>${today ? `<div class="review-row"><div>${card(today)}</div><div class="review-action"><p>Can you recall what <strong>${esc(today.phrase)}</strong> means here?</p><details><summary>Show your meaning</summary><p>${esc(today.gloss)}</p></details><button class="primary" id="remembered">Mark phrase as remembered</button><p class="small">This records one review today.</p></div></div>` : `<div class="empty"><p>Saved phrases will appear here after you capture one.</p><a class="primary link-button" href="/demo" data-route>Try sample phrases</a></div>`}<div class="saved-head"><h3>Saved phrases</h3><span>${records.length} total</span></div><div class="saved-list">${records.slice(0, 4).map((r) => card(r, true)).join('') || '<p>No saved phrases yet.</p>'}</div></section>`;
}
async function landing() {
  setMetadata('/');
  app.innerHTML = html`${header()}<main id="main" tabindex="-1"><section class="hero"><div class="hero-copy"><p class="eyebrow">A local browser extension</p><h1>Save phrases with their source sentence.</h1><p class="lede">For learners reading real pages who need a meaning without losing their place.</p><div class="actions"><a class="primary link-button" href="/demo" data-route>Try it with sample data</a><span>See phrases ready to review right away.</span></div><ul class="facts"><li>Saved phrases stay on your device</li><li>Works without an account</li><li>Review saved phrases offline</li></ul></div><figure class="hero-art"><img src="/assets/dithered-reading-margin.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="A blank open book, a bookmark, a flashcard, and halftone dots show a saved phrase beside its source sentence."></figure></section><section class="preview-section"><div class="section-label"><p class="eyebrow">A sentence stays attached</p><h2>Review the phrase where you met it.</h2></div>${await productBoard(false)}</section><section id="how" class="how" tabindex="-1"><p class="eyebrow">How it works</p><h2>Keep reading. Keep the source.</h2><ol><li><strong>Select the phrase.</strong><span>Choose “Keep this sentence” from the page menu.</span></li><li><strong>Write a short meaning.</strong><span>Your saved phrase includes nearby sentences and the source link.</span></li><li><strong>Review today’s phrases.</strong><span>Try the phrase in context before you reveal your meaning.</span></li></ol></section><section class="privacy-blurb"><div><p class="eyebrow">What it does not do</p><h2>Your saved phrases stay private and local.</h2></div><p>Records store a phrase, nearby text, source title and link, language, your meaning, and review details. Export your records as CSV.</p></section><section class="install"><div><p class="eyebrow">Install the extension</p><h2>Capture phrases from regular web pages in Chromium.</h2><p>Download the extension package. Your browser will ask you to load it as an unpacked extension during this first release.</p></div><a class="primary link-button" href="/downloads/keep-the-sentence-extension.zip" download>Download extension ZIP</a></section></main>${footer()}`;
}
async function demo() {
  setMetadata('/demo');
  const current = await readVault('demo:'); if (!current.records.length) await replaceRecords(SAMPLE_RECORDS, 'demo:');
  app.innerHTML = html`${header()}${demoBanner()}<main id="main" tabindex="-1"><section class="demo-intro"><p class="eyebrow">Try the review flow</p><h1>Review a saved phrase in context.</h1><p class="lede">These phrases are sample data. Reset them whenever you want.</p></section>${await productBoard(true)}<section class="demo-capture"><p class="eyebrow">What each saved phrase includes</p><h2>A phrase, two nearby sentences, a source link, and your meaning.</h2><p>In the extension, select text on a page. Choose “Keep this sentence.”</p></section></main>${footer()}`;
}
function legal(kind: 'privacy' | 'terms') { const privacy = kind === 'privacy'; setMetadata((`/${kind}`) as '/privacy' | '/terms'); app.innerHTML = html`${header()}<main id="main" class="legal" tabindex="-1"><h1>${privacy ? 'Your reading notes stay on your device.' : 'Terms for Keep the Sentence.'}</h1>${privacy ? `<p>It uses your browser’s local extension storage. Records are encrypted with AES-GCM before storage.</p><p>It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates.</p><p>The extension sends no analytics or product data to any server. The sample demo uses separate local storage and is discarded when you leave it.</p><p>You can export your phrases as CSV. Removing the extension or clearing its browser storage may remove your local data.</p>` : `<p>Keep the Sentence is a local reading utility. Use it only for text you may read and save for personal study.</p><p>Do not use the extension to redistribute source text. You are responsible for the web pages you select from.</p><p>The extension is provided as-is.</p>`}<p><a href="/" data-route>Return home</a></p></main>${footer()}`; }
function notFound() { setMetadata('/404'); app.innerHTML = html`${header()}<main id="main" class="not-found" tabindex="-1"><h1>This page is not in the notebook.</h1><p>Try the home page or the sample phrases.</p><p><a class="primary link-button" href="/" data-route>Go home</a></p></main>${footer()}`; }
async function render() {
  const path = route();
  if (path === '/demo' || (path === '/' && isDemo())) await demo();
  else if (path === '/') await landing();
  else if (path === '/privacy' || path === '/terms') legal(path.slice(1) as 'privacy' | 'terms');
  else notFound();
  bind();
  const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  const focusTarget = target ?? document.querySelector<HTMLElement>('h1');
  if (focusTarget) {
    focusTarget.tabIndex = -1;
    focusTarget.focus();
    const announcement = document.querySelector<HTMLElement>('#route-announcement');
    if (announcement) announcement.textContent = target ? `${target.querySelector('h2')?.textContent ?? 'Section'} section.` : `${document.title}.`;
  }
}
function bind() {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((a) => a.addEventListener('click', async (e) => { e.preventDefault(); if (a.hasAttribute('data-exit-demo')) await clearVault('demo:'); history.pushState({}, '', a.href); render(); }));
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { await replaceRecords(SAMPLE_RECORDS, 'demo:'); await render(); });
  document.querySelector('#remembered')?.addEventListener('click', async () => { const record = due((await readVault(isDemo() ? 'demo:' : '')).records)[0]; if (record) { await reviewCapture(record.id, isDemo() ? 'demo:' : ''); await render(); } });
  document.querySelector('#export-csv')?.addEventListener('click', async () => download((await readVault(isDemo() ? 'demo:' : '')).records));
}
window.addEventListener('popstate', render); render().catch(() => { app.innerHTML = '<main id="main"><h1>Your local notes could not load.</h1><p>Reload this page. If it still fails, reset the demo and try again.</p></main>'; });
