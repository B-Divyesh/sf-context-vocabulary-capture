import { defineContentScript } from 'wxt/utils/define-content-script';
import { browser } from 'wxt/browser';
import { inferLanguage, sentenceContext } from '../src/core';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
  let host: HTMLDivElement | undefined;
  let returnFocus: HTMLElement | null = null;
  const close = () => {
    host?.remove(); host = undefined;
    returnFocus?.focus(); returnFocus = null;
  };
  const selectionData = (fallbackPhrase = '') => {
    const selected = window.getSelection()?.toString().trim() || fallbackPhrase;
    const active = window.getSelection()?.anchorNode?.parentElement?.closest('article, main, p, div')?.textContent || document.body.innerText;
    return {
      phrase: selected,
      context: sentenceContext(active, selected),
      title: document.title || 'Untitled page', url: location.href, language: inferLanguage(selected), gloss: '',
    };
  };
  const open = (fallbackPhrase = '') => {
    const data = selectionData(fallbackPhrase);
    if (!data.phrase) return;
    close(); returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    host = document.createElement('div'); host.id = 'keep-sentence-capture';
    const root = host.attachShadow({ mode: 'open' });
    document.body.append(host);
    root.innerHTML = `
      <style>
        :host{all:initial}*{box-sizing:border-box}.card{position:fixed;z-index:2147483647;right:20px;bottom:20px;width:min(390px,calc(100vw - 32px));background:#fffaf0;color:#171614;border:2px solid #171614;border-radius:12px;box-shadow:5px 5px 0 #1647b7;padding:18px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45}.eyebrow{color:#1647b7;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.phrase{font:700 24px Georgia,serif;margin:4px 0}.context{font:16px Georgia,serif;margin:8px 0;color:#3d3932}.label{display:block;font-weight:700;margin-top:12px}.input{width:100%;min-height:44px;border:2px solid #171614;border-radius:6px;padding:9px;font:inherit;background:#fff}.buttons{display:flex;gap:8px;margin-top:12px}.button{min-height:44px;padding:9px 13px;border:2px solid #171614;border-radius:6px;background:#1647b7;color:#fff;font-weight:700;cursor:pointer}.quiet{background:#fffaf0;color:#171614}.button:focus-visible,.input:focus-visible{outline:3px solid #d85a2a;outline-offset:2px}.status{min-height:22px;margin:7px 0 0;color:#176b4d;font-weight:700}@media(max-width:420px){.card{right:16px;bottom:16px}}
      </style>
      <section class="card" role="dialog" aria-modal="true" aria-labelledby="keep-title">
        <div class="eyebrow">Keep the Sentence</div><div id="keep-title" class="phrase"></div><p class="context"></p>
        <label class="label" for="gloss">Your meaning</label><input class="input" id="gloss" maxlength="240" autocomplete="off" placeholder="Write a short cue">
        <div class="buttons"><button class="button" id="save">Save phrase</button><button class="button quiet" id="cancel">Cancel</button></div><div class="status" aria-live="polite"></div>
      </section>`;
    (root.querySelector('.phrase') as HTMLElement).textContent = data.phrase;
    (root.querySelector('.context') as HTMLElement).textContent = data.context;
    const input = root.querySelector<HTMLInputElement>('#gloss')!; input.focus();
    root.querySelector('#cancel')?.addEventListener('click', close);
    root.querySelector('#save')?.addEventListener('click', async () => {
      const status = root.querySelector<HTMLElement>('.status')!;
      const gloss = input.value.trim();
      if (!gloss) { status.textContent = 'Write a short meaning, then save it.'; input.focus(); return; }
      status.textContent = 'Saving on this device…';
      try { await browser.runtime.sendMessage({ type: 'save-capture', capture: { ...data, gloss } }); status.textContent = 'Saved. You can review it in the extension.'; setTimeout(close, 850); }
      catch { status.textContent = 'This phrase could not be saved. Try again on a normal web page.'; }
    });
    root.addEventListener('keydown', (event) => {
      const keyEvent = event as KeyboardEvent;
      if (keyEvent.key === 'Escape') { keyEvent.preventDefault(); close(); return; }
      if (keyEvent.key !== 'Tab') return;
      const controls = Array.from(root.querySelectorAll<HTMLElement>('input, button:not([disabled])'));
      const first = controls[0]; const last = controls.at(-1);
      if (!first || !last) return;
      if (keyEvent.shiftKey && root.activeElement === first) { keyEvent.preventDefault(); last.focus(); }
      else if (!keyEvent.shiftKey && root.activeElement === last) { keyEvent.preventDefault(); first.focus(); }
    });
  };
  browser.runtime.onMessage.addListener((message) => {
    if (message.type !== 'open-capture') return undefined;
    open(message.selectionText);
    return undefined;
  });
  },
});
