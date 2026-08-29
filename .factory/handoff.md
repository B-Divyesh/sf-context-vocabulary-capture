# Polish 3 handoff — PASS

**Work order:** `context-vocabulary-capture-polish-3`

**Reviewed base:** `352911f5a043538566713cc5f93f0eb350aec8d6`

**Final product commit verified from a clean clone:** `8e3e596c24f8665cd2422462b74948f10b926aec`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## What changed

- Rewrote the first-screen audience and click-outcome copy for a faster cold
  read while preserving the dithered reading-margin identity.
- Rebuilt the cumulative copy audit and added `npm run test:copy`, which
  extracts rendered landing copy and README prose, checks coverage, recounts
  every row, and enforces the 22-word cap.
- Strengthened the direct `/?demo=1` test through review, reset, exit, vault
  decryption, and proof that no real-data storage key was created.
- Expanded browser coverage for exact metadata, social images, real route
  statuses, link crawling, focus/history, CSP-clean 404 behavior, mobile
  overflow, and 44 px targets.
- Added live-origin support to the Playwright site suite and fixed mobile legal
  page gutters found during the first cold production check.
- Stopped WXT from copying the 1.28 MB site social image and other landing
  assets into the extension. The built extension is 17.94 KB; its ZIP is 9,478
  bytes in the final clean clone.
- Updated the catalog description, demo documentation, image provenance, and
  cumulative finding evidence in `polish-3.md`.

## How it was verified

From a clean clone at `8e3e596c24f8665cd2422462b74948f10b926aec`:

- `npm ci`: PASS, zero vulnerabilities.
- Every one of the 11 exact commands in `.factory/claims.json`: PASS.
- `npm test`: PASS, 6 unit/contract tests and 20 Playwright tests.
- `npm run lint`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; creates `dist/site`,
  `dist/extension/chrome-mv3`, and the downloadable ZIP.
- `npm run test:copy`: PASS.

The production deployment was uploaded through
`/opt/fleet/lib/deploy-static.sh context-vocabulary-capture dist/site`.
After deployment:

- The factory URL verifier passed with zero console errors.
- The production-targeted site suite passed all 14 tests.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; a missing URL returned
  the designed 404 with status 404.
- Lighthouse mobile on `/?demo=1` scored Performance 100 and Accessibility
  100, with FCP 0.8 s, LCP 0.8 s, CLS 0, and TBT 0 ms.
- Production responses include HSTS, `nosniff`, strict-origin referrer policy,
  and the self-only CSP with `frame-ancestors 'none'`.

Build sizes are 13,538 bytes JS (5.35 KB gzip), 8,675 bytes CSS (2.79 KB
gzip), and 74,024 bytes for the hero WebP. No third-party runtime scripts,
fonts, analytics, product API, AI request, account, or payment path exists.

## Evidence

- [Cumulative finding map](polish-3.md)
- [Live demo at 390 px](evidence-polish-3-live-demo-mobile.png)
- [Live Privacy route at 390 px](evidence-polish-3-live-privacy-mobile.png)
- [Live 404 at 390 px](evidence-polish-3-live-404-mobile.png)
- [Factory live verifier output](evidence-polish-3-live-root/verify.json)

## Known gaps and next steps

None. Every finding from all three review rounds is resolved and rechecked on
the live deployment.
