import { due, makeCsv, type Capture } from '../../src/core';
import { readVault, reviewCapture } from '../../src/storage';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]!));
const download = (records: Capture[]) => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([makeCsv(records)], { type:'text/csv' })); link.download = 'keep-the-sentence.csv'; link.click(); URL.revokeObjectURL(link.href); };
async function render() {
  const vault = await readVault(); const next = due(vault.records)[0];
  app.innerHTML = `<main><header><span class="mark">///</span><strong>Keep the Sentence</strong><p>${vault.records.length} saved locally</p></header>${next ? `<section class="review" aria-labelledby="review-title"><p class="label">Review in context</p><h1 id="review-title">${escape(next.phrase)}</h1><blockquote>${escape(next.context)}</blockquote><details><summary>Show your meaning</summary><p>${escape(next.gloss)}</p></details><button id="review">Mark phrase as remembered</button></section>` : `<section class="empty"><h1>No phrases due today</h1><p>Select a phrase on any page. Choose “Keep this sentence”.</p></section>`}<section class="list"><div><h2>Saved phrases</h2><button class="link" id="export">Export CSV</button></div>${vault.records.slice(0, 8).map((r) => `<article><strong>${escape(r.phrase)}</strong><span>${escape(r.title)}</span><small>${r.reviews} review${r.reviews === 1 ? '' : 's'}</small></article>`).join('') || '<p>Your saved phrases will appear here.</p>'}</section></main>`;
  document.querySelector('#review')?.addEventListener('click', async () => { await reviewCapture(next!.id); await render(); });
  document.querySelector('#export')?.addEventListener('click', () => download(vault.records));
}
render().catch(() => { app.innerHTML = '<main><h1>Your phrases are unavailable</h1><p>Close and reopen the extension. Your saved phrases stay on this device.</p></main>'; });
