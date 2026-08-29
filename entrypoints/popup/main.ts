import { due, makeCsv, type Capture } from '../../src/core';
import { discardVault, readVault, reviewCapture, unreadableVaultData } from '../../src/storage';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]!));
const download = (records: Capture[]) => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([makeCsv(records)], { type:'text/csv' })); link.download = 'keep-the-sentence.csv'; link.click(); URL.revokeObjectURL(link.href); };
function downloadUnreadableData(data: Record<string, unknown>) {
  const payload = JSON.stringify({ product: 'Keep the Sentence', exportedAt: new Date().toISOString(), localData: data }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'keep-the-sentence-unreadable-data.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 500);
}
function showRecovery() {
  app.innerHTML = `<main class="recovery"><h1>Your phrases could not load</h1><p role="alert">This extension has saved phrase data that cannot be read.</p><p>Download it first if you may need it. You can then clear only Keep the Sentence data and start again.</p><div class="recovery-actions"><button class="link" id="download-unreadable-data">Download unreadable data</button><button class="danger" id="clear-unreadable-data">Clear unreadable saved data</button></div><dialog id="recovery-confirm" aria-labelledby="recovery-confirm-title"><form method="dialog"><h2 id="recovery-confirm-title">Clear unreadable saved data?</h2><p>This removes only Keep the Sentence phrase data from this browser. It cannot be undone.</p><div class="recovery-actions"><button class="link" value="cancel">Cancel</button><button class="danger" value="clear">Clear saved phrase data</button></div></form></dialog></main>`;
  const dialog = document.querySelector<HTMLDialogElement>('#recovery-confirm')!;
  document.querySelector('#download-unreadable-data')?.addEventListener('click', async () => downloadUnreadableData(await unreadableVaultData()));
  document.querySelector('#clear-unreadable-data')?.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', async () => {
    if (dialog.returnValue !== 'clear') return;
    try {
      await discardVault();
      await safelyRender();
    } catch {
      showRecovery();
    }
  });
}
async function render() {
  const vault = await readVault(); const next = due(vault.records)[0];
  app.innerHTML = `<main><header><span class="mark">///</span><strong>Keep the Sentence</strong><p>${vault.records.length} saved locally</p></header>${next ? `<section class="review" aria-labelledby="review-title"><p class="label">Review in context</p><h1 id="review-title">${escape(next.phrase)}</h1><blockquote>${escape(next.context)}</blockquote><details><summary>Show your meaning</summary><p>${escape(next.gloss)}</p></details><button id="review">Mark phrase as remembered</button></section>` : `<section class="empty"><h1>No phrases due today</h1><p>Select a phrase on a regular web page. Choose “Keep this sentence”.</p></section>`}<section class="list"><div><h2>Saved phrases</h2><button class="link" id="export">Export CSV</button></div>${vault.records.slice(0, 8).map((r) => `<article><strong>${escape(r.phrase)}</strong><span>${escape(r.title)}</span><small>${r.reviews} review${r.reviews === 1 ? '' : 's'}</small></article>`).join('') || '<p>Your saved phrases will appear here.</p>'}</section></main>`;
  document.querySelector('#review')?.addEventListener('click', async () => { try { await reviewCapture(next!.id); await safelyRender(); } catch { showRecovery(); } });
  document.querySelector('#export')?.addEventListener('click', () => download(vault.records));
}
async function safelyRender() {
  try {
    await render();
  } catch {
    showRecovery();
  }
}
void safelyRender();
