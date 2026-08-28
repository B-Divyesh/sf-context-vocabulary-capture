import { defineBackground } from 'wxt/utils/define-background';
import { browser } from 'wxt/browser';
import { addCapture } from '../src/storage';
import { newCapture } from '../src/core';

export default defineBackground(() => {
  browser.contextMenus.create({ id: 'keep-sentence', title: 'Keep this sentence', contexts: ['selection'] });
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'keep-sentence' && tab?.id) await browser.tabs.sendMessage(tab.id, { type: 'open-capture' });
  });
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.type !== 'save-capture') return undefined;
    const capture = newCapture(message.capture);
    await addCapture(capture);
    return { ok: true, capture };
  });
});
