# Independent verification 4 — FAIL

**Candidate:** `f89d740863f880a87e5e0acbdd6ff7a8c2d63321` (`f89d740`)
**Live URL:** <https://context-vocabulary-capture.sociobot.in>
**Verified:** 2026-08-29 from a clean checkout. No product code was changed.

## Verdict

**FAIL — do not release this candidate.** The deployment is healthy and matches
the candidate, and every declared claim test passes. However, the built
extension can attach the wrong source sentences when selected text occurs more
than once in a paragraph. The live site's dark theme also has serious primary-
action contrast failures. Both violate the acceptance contract.

## Release-blocking defects

### P1 — a repeated phrase is saved with the first occurrence's context

The defining job is to preserve the exact context in which the learner selected
a phrase. In a normal page containing this paragraph:

> The target appeared beside the station. This first passage ended quietly.
> Several pages later, rain began to fall. The target appeared beside the
> harbour. This second passage ended loudly.

I selected the second `target` through the built MV3 extension's real content-
script/message path. The capture dialog displayed:

> The target appeared beside the station. This first passage ended quietly.

It should have displayed the sentences around the selected harbour occurrence.
The implementation searches the containing text with `indexOf(selected)` and
therefore always chooses the first matching string, rather than locating the
actual DOM Range. This is a common reading case and corrupts the product's core
source-preservation result. Evidence: [repeated-phrase-wrong-context.png](evidence/repeated-phrase-wrong-context.png).

### P1 — dark-mode primary actions fail required contrast

Fresh axe scans with `prefers-color-scheme: dark` report a serious
`color-contrast` violation at both desktop and 390 px. White `#ffffff` text on
the dark-theme blue `#7da8ff` measures **2.35:1**, below 4.5:1 for the 16 px
bold controls.

- `/`: **Try it with sample data**, **Try sample phrases**, and **Download
  extension ZIP** fail.
- `/demo`: **Mark phrase as remembered** fails.
- `/404.html`: **Go home** fails even against the 3:1 large-text threshold.

Light mode, Privacy, and Terms have no serious/critical axe results. Evidence:
[live-demo-mobile-dark.png](evidence/live-demo-mobile-dark.png).

## Other defect

### P2 — a non-hashed image is cached as immutable for one year

`/assets/dithered-reading-margin.webp` has a stable filename but is served with
`Cache-Control: public, max-age=31536000, immutable`. An updated deployment at
the same path can remain stale in existing browsers for a year. Restrict the
immutable rule to content-hashed assets or fingerprint this image.

## Mandatory first read and demo

**PASS.** In fresh desktop and 390×844 Chromium contexts, the first screen says:

- What: “Save phrases with their source sentence.”
- For whom: “For language learners reading web pages who want to remember a
  phrase and its context.”
- First click: **Try it with sample data**, with “Open sample phrases ready to
  review.” beside it.

The action is visible without scrolling at both sizes. One click opens `/demo`,
immediately shows three realistic English, Spanish, and German captures, and
keeps the “Demo — sample data, nothing is saved” banner visible. Review, reset,
and exit work. Exit clears the demo records and opens an empty real workspace;
no real-data key is created. The full demo flow contacted only the product
origin and produced no console/page errors.

Evidence: [desktop cold read](evidence/live-first-read-desktop.png), [mobile
cold read](evidence/live-first-read-mobile.png), [desktop demo](evidence/live-demo-desktop.png),
and [mobile demo](evidence/live-demo-mobile.png).

## Claims gate

`.factory/claims.json` exists. After `npm ci`, all 11 exact commands were run
independently before the wider suite. Every command passed, and the contract
test confirms exactly one `@claim:<id>` test per entry.

| Claim | Exact command | Result |
| --- | --- | --- |
| `csv-export` | `npm run test:browser -- --grep @claim:csv-export` | PASS |
| `local-only` | `npm run test:browser -- --grep @claim:local-only` | PASS |
| `no-account` | `npm run test:unit -- --testNamePattern @claim:no-account` | PASS |
| `demo-sandbox` | `npm run test:browser -- --grep @claim:demo-sandbox` | PASS |
| `encrypted-storage` | `npm run test:unit -- --testNamePattern @claim:encrypted-storage` | PASS |
| `offline-review` | `npm run test:browser -- --grep @claim:offline-review` | PASS |
| `source-context-capture` | `npm run test:browser -- --grep @claim:source-context-capture` | PASS, but does not cover repeated text |
| `supported-chromium-pages` | `npm run test:browser -- --grep @claim:supported-chromium-pages` | PASS |
| `storage-scope` | `npm run test:browser -- --grep @claim:storage-scope` | PASS |
| `no-analytics` | `npm run test:browser -- --grep @claim:no-analytics` | PASS |
| `extension-download` | `npm run test:browser -- --grep @claim:extension-download` | PASS |

The live copy and README were cross-checked against the manifest. No unlisted
product claim was found.

## Clean-checkout and product QA

| Check | Fresh result |
| --- | --- |
| Install | `npm ci` PASS; 272 packages installed, 0 vulnerabilities. |
| Full suite | `npm test` PASS: 6 Vitest and 20 Playwright tests. |
| Static analysis | `npm run lint` and `npx tsc --noEmit` PASS. |
| Exact build | `npm run build` PASS; created `dist/site`, `dist/extension/chrome-mv3`, and the ZIP. |
| Copy audit | `npm run test:copy` PASS. |
| Live site suite | `PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts` PASS: 14 tests. |

Normal end-to-end extension capture, encrypted local persistence, review,
offline popup reload, and CSV export pass. Blank meanings are rejected with a
specific recovery message. A 241-character meaning is capped at the declared
240-character boundary. Tab and Shift+Tab wrap inside the capture dialog, and
Escape closes it and restores focus to the source page. The separate repeated-
phrase case above fails.

The built capture dialog and populated extension popup each have zero serious
or critical axe findings.

## Deployment identity, privacy, and headers

The live root HTML, JavaScript, CSS, and hero WebP SHA-256 hashes exactly match
the fresh candidate build. The live ZIP differs only in ZIP timestamps; its
extracted files are byte-identical to the candidate package and `unzip -t`
passes.

The live cold load requested only `/`, the candidate JS/CSS, and the hero image.
The complete live demo flow and the extension capture/popup checks made no
analytics or product-data requests. All observed HTTP(S) requests remained on
the product/source origin. The demo uses only `demo:` storage keys; encrypted
vault ciphertext does not contain the clear phrase.

Responses include HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP with
`frame-ancestors 'none'`. HTML and the ZIP revalidate after 30 seconds; hashed
JS/CSS are cached immutably for one year. `/`, `/demo`, `/privacy`, `/terms`,
all same-origin links, demo sources, and the ZIP return 200. An unknown route
returns the designed page with HTTP 404.

There is no sign-in, server-side product endpoint, paid-unlock call, AI call,
or web service worker. Entra authority, API 429/`Retry-After`, backend
concurrency/persistence/health, paid billing, and PWA update/offline-reload
checks are therefore not applicable. Offline review was tested in the MV3
extension, where it belongs.

## Responsive, accessibility, and performance evidence

- Desktop and 390 px routes have one `<h1>`, one `<main>`, `lang="en"`, no
  horizontal overflow, correct titles, reachable links, 44 px targets, and no
  console/page errors.
- Keyboard navigation and Enter activation work; focus uses a visible 3 px
  outline. Route changes move focus and announce the destination.
- Reduced motion computes `scroll-behavior: auto`.
- Light-mode axe scans on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`
  have zero serious/critical findings. Dark mode fails as described above.
- Site bundles: JS 13,538 B (5.35 KB gzip), CSS 8,675 B (2.79 KB gzip), no
  remote fonts, hero WebP 74,024 B. The extension totals 17.94 KB.
- Fresh mobile Lighthouse on `/?demo=1`: Performance 98, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.8 s, LCP 0.9 s, CLS 0, TBT 170 ms, Speed
  Index 0.8 s. Lighthouse used light mode and does not negate the dark-theme
  axe failure. Evidence: [Lighthouse summary](evidence/lighthouse-live-demo-summary.json).

## Required next steps

1. Derive context from the selected DOM Range (or an occurrence offset), not
   the first text match, and add a repeated-phrase regression test through the
   built extension.
2. Give dark-theme primary controls a foreground/background pair meeting
   4.5:1 and run axe in both color schemes.
3. Fingerprint the hero/social assets or remove `immutable` from stable asset
   paths.
