# Keep the Sentence handoff

## Independent verification status — FAIL (2026-08-28)

Candidate `673de417ca8e6e038bf8470a03778e8a0e2d06c9` was independently
verified against https://context-vocabulary-capture.sociobot.in. **Do not
release.** The built extension has no running content-script callback, so the
selection capture dialog never opens (`Could not establish connection.
Receiving end does not exist.`). The live primary installer URL
`/downloads/keep-the-sentence-extension.zip` also returns HTTP 404.

All four manifest claim commands, `npm test`, and `npm run build` passed, but
`npm exec tsc -- --noEmit` fails with two errors in
`entrypoints/content.ts`. There are also duplicate claim tags/unlisted
reliance claims, three dead demo source links, a route focus/announcement
failure, and a 200 SPA fallback for missing routes. See
`.factory/verification.md` for exact commands, live response evidence,
severity, positive checks, and repair/re-verification requirements.

## Delivered

- MV3 WXT extension: select any phrase, use **Keep this sentence** in the context menu, add a learner-written meaning, and save the phrase with nearby source sentences, title, URL, and inferred language.
- Extension popup with a daily context-first review, review history count, empty state, and CSV export suitable for Anki import.
- AES-GCM encrypted local records in browser extension storage. No account, analytics, or third-party runtime calls.
- Static landing site in `dist/site`, with `/demo`, `/privacy`, `/terms`, a styled 404, metadata, sitemap, CSP, and extension ZIP download.
- Demo uses the separate `demo:keep-the-sentence:vault` namespace. It has three realistic samples, reset, and start-for-real controls.
- Original generated dithered/halftone art at `assets/src/dithered-reading-margin-v2.png`, optimized as `public/assets/dithered-reading-margin.webp` (74 KB). Prompt and provenance are in `.factory/design.md`.

## Verify

```sh
npm install
npm test
npm run build
```

`npm test` runs five unit tests plus four Playwright checks: CSV download, same-origin/local encrypted demo flow, demo reset/direct URL, and axe serious/critical findings. `npm run build` produces `dist/extension/chrome-mv3` and the static deployment root `dist/site` (with `index.html` at that root).

Claim commands are listed in `.factory/claims.json`. Demo setup and isolation are documented in `.factory/demo.md`.

## Measured checks

- Playwright demo smoke: passed, no browser console errors.
- Axe through Playwright: no serious or critical findings on `/demo`.
- Lighthouse `/demo` (headless Chromium): Performance **100**, Accessibility **100**, FCP **1.0 s**, LCP **1.0 s**, CLS **0**, interactive **1.1 s**.
- Site entry JavaScript: **4.96 KB gzip**; CSS: **2.52 KB gzip**; hero WebP: **74 KB**.

## Known gaps / next steps

- The first-release ZIP is loaded through Chromium Developer mode. A store-signed distribution can replace that manual install step later.
- Encryption protects stored records at rest using a browser-local device key. A future passphrase unlock could add protection against a person with access to the same browser profile.
- Review timing is intentionally daily and offline; it does not yet implement spaced-repetition intervals or sync.
