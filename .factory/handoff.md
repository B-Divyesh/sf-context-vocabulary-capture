# Repair 4 handoff — PASS

**Work order:** `context-vocabulary-capture-repair-4`

**Verifier report:** `0398093fb1afc88f0590e7436ee8cc9dd25f8f92`

**Rejected candidate:** `f89d740863f880a87e5e0acbdd6ff7a8c2d63321`

**Repair commit deployed:** `8f0e91985e964901aa7fb420753b51ea3077ff66`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Result

All release-blocking findings in `verification-4.md` and the controller's
additional evidence review are repaired. The WXT MV3 extension and static-site
deployment class are unchanged.

## Repairs and exact regression evidence

- **Repeated phrase occurrence:** the original build was reproduced first with
  the verifier's paragraph. Selecting the second `target` incorrectly returned
  “The target appeared beside the station. This first passage ended quietly.”
  The content script now measures the live DOM Range from its containing block
  and passes that occurrence offset into sentence extraction. The built-MV3
  regression selects the second occurrence, saves it through the real runtime
  message path, decrypts the vault, and asserts the exact harbour sentence plus
  its two neighbours. A unit regression also covers normalized text offsets.
- **Dark primary-action contrast:** primary actions now use ink-black
  `#171614` on light cobalt `#7da8ff` in dark mode, a measured **7.68:1**.
  Light mode remains white on dark cobalt at **8.02:1**. Axe now scans `/`,
  `/demo`, `/privacy`, `/terms`, and `/404.html` in light and dark themes at
  1280 px and 390 px; all scans have zero serious or critical findings.
- **Stable media caching:** the stable hero and social-image routes now return
  `Cache-Control: public, max-age=0, must-revalidate`. Only fingerprinted
  `index-*` bundles retain one-year immutable caching. Both the deployment
  configuration and served response headers have regressions.

## Clean local verification

- `npm ci`: PASS; 272 packages, zero vulnerabilities.
- All 11 exact commands in `.factory/claims.json`: PASS independently.
- `npm test`: PASS; 8 Vitest unit/contract tests and 22 Playwright tests.
- `npm run lint`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; produced `dist/site`, the MV3 extension, and ZIP.
- `npm run test:copy`: PASS.
- `unzip -t dist/site/downloads/keep-the-sentence-extension.zip`: PASS.
- Package sizes: extension 18.46 KB; ZIP 9,727 bytes; initial JS 13,538
  bytes (5.35 KB gzip); CSS 8,774 bytes (2.80 KB gzip); hero WebP 74,024
  bytes.
- Factory URL verifier against the local build: 200, correct title/lang,
  one h1/main, no missing alt text, no unlabeled buttons, no console errors.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.1 s, CLS 0, TBT 30 ms.

The combined browser suite covers desktop and 390×844 layouts, keyboard
activation, focus/history, 44 px targets, reduced motion, both color schemes,
route metadata, all same-origin links, CSP-clean 404 handling, privacy request
boundaries, demo isolation, encrypted storage, offline extension review, CSV
export, and the real built-extension capture path.

## Deployment and live verification

The exact `dist/site` build was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh context-vocabulary-capture dist/site
```

Azure Static Web Apps deployment `dd58f31f-422b-4de7-9722-13ce3ced832f`
succeeded. After deployment:

- The production-targeted site and copy suite passed all 15 tests.
- The factory live URL verifier returned 200 with zero console errors. Evidence:
  [verify.json](evidence-repair-4-live-root/verify.json),
  [desktop](evidence-repair-4-live-root/screenshot-desktop.png), and
  [390 px mobile](evidence-repair-4-live-root/screenshot-mobile.png).
- Live mobile Lighthouse scored Performance 100, Accessibility 100, Best
  Practices 100, and SEO 100; FCP 0.8 s, LCP 0.9 s, CLS 0, TBT 0 ms, and
  Speed Index 0.8 s. See
  [summary](evidence-repair-4-lighthouse-summary.json).
- Live `index.html`, JS, CSS, and hero SHA-256 hashes match the local build.
  The downloaded ZIP extracts byte-for-byte to the local extension build and
  passes `unzip -t`.
- Live hero and social responses require revalidation; fingerprinted JS is
  immutable. HSTS, CSP with header-only `frame-ancestors 'none'`, `nosniff`,
  and strict-origin referrer policy remain present. An unknown route returns
  the designed page with HTTP 404.

There is no web service worker, backend, identity flow, AI feature, or paid
feature. PWA update, backend concurrency/429, live identity-provider, AI, and
billing checks are not applicable. Offline behavior remains covered where it
exists: the browser-extension review flow.

## Known gaps and next steps

None known. The deployed product satisfies every finding in the cited report.
