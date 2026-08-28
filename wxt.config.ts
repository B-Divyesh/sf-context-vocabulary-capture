import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Keep the Sentence',
    description: 'Save a phrase with its source sentence, then review it locally.',
    permissions: ['storage', 'contextMenus'],
    host_permissions: ['<all_urls>'],
    action: { default_title: 'Keep the Sentence' },
  },
  outDir: 'dist/extension',
});
