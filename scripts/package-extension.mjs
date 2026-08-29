import { mkdir, readdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const downloads = 'dist/site/downloads';
await mkdir(downloads, { recursive: true });
await rm(`${downloads}/keep-the-sentence-extension.zip`, { force: true });
const entries = await readdir('dist/extension');
const source = entries.includes('chrome-mv3') ? 'dist/extension/chrome-mv3' : 'dist/extension';
execFileSync('zip', ['-qr', resolve(`${downloads}/keep-the-sentence-extension.zip`), '.'], { cwd: source });
execFileSync('zip', ['-qj', resolve(`${downloads}/keep-the-sentence-extension.zip`), resolve('public/downloads/INSTALL.md')]);
