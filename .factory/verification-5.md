# Independent verification 5 — PASS

**Candidate:** `ac6cb3f281391b7c9f78c093421519a90cab6929` (`ac6cb3f`)

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Verified:** 2026-08-29, from a clean checkout at the candidate commit. Product
code was not changed during verification.

## Verdict

**PASS — release approved.** Fresh evidence disproves the earlier
deployment-only concern. The deployed site is the candidate build, the live
extension download returns a valid ZIP, and the extracted live extension files
are byte-identical to the fresh local build.

## First-read and demo check

Cold loading the live page returned HTTP 200 with no console or page errors.
The first screen says **“Save phrases with their source sentence.”** It says it
is for “language learners reading web pages” and offers the visible, one-click
**Try it with sample data** action with the result “Open sample phrases ready
to review.” The action opens `/demo`, immediately shows the three realistic
sample records, and displays the persistent “Demo — sample data, nothing is
saved” banner with Reset demo and Start for real. This passes the plain-words
and demo-sandbox gates.

## Required claims

After `npm ci`, every exact command registered in `.factory/claims.json` was
run individually through the configured test/demo entry point. All passed.

| Claim ID | Result |
| --- | --- |
| `csv-export` | PASS |
| `local-only` | PASS |
| `no-account` | PASS |
| `demo-sandbox` | PASS |
| `encrypted-storage` | PASS |
| `offline-review` | PASS |
| `source-context-capture` | PASS |
| `supported-chromium-pages` | PASS |
| `storage-scope` | PASS |
| `no-analytics` | PASS |
| `extension-download` | PASS |

The contract suite also passed, confirming that all 11 registered IDs have one
tagged test. Page and README reliance claims are represented by those entries.

## Local build and end-to-end evidence

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 272 packages; audit reports zero vulnerabilities |
| `npm test` | PASS; 8 Vitest tests and 22 Playwright tests |
| `npm run test:copy` | PASS |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS; emits `dist/site`, MV3 extension, and install ZIP |
| `unzip -t` live install ZIP | PASS |

The built-MV3 browser tests use a fresh persistent Chromium profile and the
same background-to-content message path as the right-click command. They
exercise normal capture (selection → capture dialog → learner gloss → save),
the blank-gloss recovery message, exact three-sentence context, a repeated
phrase occurrence, popup review, CSV export, and reopening review after the
browser is offline. This covers the brief’s core capture and offline-review
job rather than just the marketing demo.

Built size evidence: extension **18.46 KB**; landing JS **13,538 B**
(**5.35 KB gzip**); CSS **8,774 B** (**2.80 KB gzip**); hero WebP **74,024 B**.
All are within the applicable budgets.

## Live deployment, privacy, and headers

Fresh SHA-256 comparisons show the live `index.html`, JS, CSS, and hero WebP
match the fresh candidate build exactly. The outer ZIP hashes differ because
ZIP metadata timestamps differ, but `unzip -t` passes and recursive comparison
of every extracted live file against the local ZIP has no difference.

The live demo’s full review → reset → CSV-export flow made only these three
HTTP requests: `/demo`, its same-origin JS, and its same-origin CSS. There
were no third-party, analytics, or product-data requests, and demo storage
contained only `demo:keep-the-sentence:vault` and
`demo:keep-the-sentence:device-key`. Its CSV has the expected header and four
lines (one header plus three records).

Responses provide CSP with header-only `frame-ancestors 'none'`, `nosniff`,
strict-origin referrer policy, and HSTS. Fingerprinted JS has
`max-age=31536000, immutable`; stable hero media requires revalidation. The
download CTA returns HTTP 200 as `application/zip`; every public same-origin
link returns 200; an unknown route returns the designed page with HTTP 404.

There is no product backend/API endpoint, account/sign-in flow, paid unlock,
AI feature, or web-PWA service worker. API 429/`Retry-After`, Entra tenant,
payment, concurrency/persistence, and PWA update checks are therefore not
applicable. The extension’s own offline review behaviour is covered above.

## Accessibility, responsive, and performance evidence

Independent Playwright/Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and
`/missing` found **zero serious or critical findings** in light and dark
schemes at 1280 px and 390 px. Each route had one `h1` and one `main`; there
was no 390px horizontal overflow. Keyboard activation reviewed a phrase and
navigated to Privacy, where focus moved to the new `h1`; the visible focus
outline is 3 px. Normal routes produced no console/page errors. The stylesheet
has a reduced-motion branch that disables smooth scrolling.

Live Lighthouse 12.8.2 on `/demo`: **Performance 100, Accessibility 100,
Best Practices 100, SEO 100**; LCP **0.9 s**, CLS **0**, TBT **10 ms**, and
total transfer **9 KiB** for the demo route.

## Defects by severity

None found.
