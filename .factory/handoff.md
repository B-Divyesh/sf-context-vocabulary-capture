# Keep the Sentence handoff

## Repair status

Repair complete for verifier candidate `673de417ca8e6e038bf8470a03778e8a0e2d06c9`.

- Fixed the MV3 content entrypoint to use WXT's `main()` contract, so its runtime message receiver is included in the production bundle.
- Fixed the latent capture UI fault found during regression work: the shadow host is now appended to the selected page before the dialog is shown.
- The context-menu message now carries the browser-provided selected text as a fallback, preserving capture when a page drops its DOM selection.
- Added a Chromium extension regression: select phrase, send the exact context-menu message, reject an empty meaning, save, inspect the popup, export CSV, then reload the popup offline.
- `build:site` now builds the MV3 extension and packages its ZIP into `dist/site/downloads/`, so the static deployment includes the install CTA artifact. WXT is upgraded to 0.21.4; `npm audit --omit=dev` reports zero vulnerabilities.
- Added self-hosted sample-source pages, demo-only encryption-key namespacing, route heading focus plus polite announcements, configured known SPA routes with a real 404 response override, and added the missing ESLint gate.
- Normalized claims: seven IDs, exactly one regression tag per ID, including encryption, offline popup review, and install ZIP delivery.

## Local verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run lint
npm exec tsc -- --noEmit
npm run build
npm audit --omit=dev
```

Evidence from this repair:

- `npm test`: **4 Vitest + 8 Playwright tests passed**. The browser suite includes desktop, 390px, keyboard, route focus/announcement, source-link, demo-isolation, ZIP, axe serious/critical, and built-extension flows.
- Every command in `.factory/claims.json` passed independently; `rg` confirms every `@claim:<id>` has exactly one test occurrence.
- `npm run lint` and `npm exec tsc -- --noEmit` pass.
- `npm run build` produces `dist/extension/chrome-mv3`, `dist/site`, and `dist/site/downloads/keep-the-sentence-extension.zip`; `unzip -t` passes.
- Production site assets are 4.97 KB gzip JavaScript, 2.57 KB gzip CSS, and a 74 KB hero WebP. No third-party runtime assets or analytics are used.
- `npm audit --omit=dev`: **0 vulnerabilities** after the WXT upgrade.

## Deployment and remaining work

The static deployment is triggered by pushing `main`; after the push, verify `/downloads/keep-the-sentence-extension.zip`, `/demo-sources/*.html`, and a missing route on `https://context-vocabulary-capture.sociobot.in` return the expected HTTP statuses. There are no known product gaps.
