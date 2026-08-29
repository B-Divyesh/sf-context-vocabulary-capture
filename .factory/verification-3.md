# Independent verification 3 — PASS

**Candidate:** `249da340df379e2161077ac8c04034846aba43bf` (`249da34`)
**Live URL:** <https://context-vocabulary-capture.sociobot.in>
**Verified:** 2026-08-29 from this clean checkout. No product code changed.

## Verdict

**PASS — release candidate accepted.** Fresh evidence confirms the live static
site and downloadable extension are this candidate. The prior
deployment-only concern does not reproduce.

## Mandatory first read and demo

PASS in a cold, fresh Chromium context. The first screen says what it does
(“Save phrases with their source sentence”), for whom (“learners reading real
pages”), and what to click first: **Try it with sample data**, followed by the
plain immediate outcome “See phrases ready to review right away.”

That one click opens `/demo`, shows three realistic records and the persistent
“Demo — sample data, nothing is saved” banner with **Reset demo** and **Start
for real**. Reviewing advances from “quietly held” to “recoger el hilo”; reset
returns to “3 total”; exiting leaves the real board empty. The demo request log
contained only `https://context-vocabulary-capture.sociobot.in`.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact command listed in
the manifest was run individually before the wider suite. All passed and every
`@claim:` ID occurs exactly once in `tests/`.

| Claim | Exact command | Result |
| --- | --- | --- |
| `csv-export` | `npm run test:browser -- --grep @claim:csv-export` | PASS |
| `local-only` | `npm run test:browser -- --grep @claim:local-only` | PASS |
| `no-account` | `npm run test:unit -- --testNamePattern @claim:no-account` | PASS |
| `demo-sandbox` | `npm run test:browser -- --grep @claim:demo-sandbox` | PASS |
| `encrypted-storage` | `npm run test:unit -- --testNamePattern @claim:encrypted-storage` | PASS |
| `offline-review` | `npm run test:browser -- --grep @claim:offline-review` | PASS |
| `source-context-capture` | `npm run test:browser -- --grep @claim:source-context-capture` | PASS |
| `supported-chromium-pages` | `npm run test:browser -- --grep @claim:supported-chromium-pages` | PASS |
| `storage-scope` | `npm run test:browser -- --grep @claim:storage-scope` | PASS |
| `no-analytics` | `npm run test:browser -- --grep @claim:no-analytics` | PASS |
| `extension-download` | `npm run test:browser -- --grep @claim:extension-download` | PASS |

## Local product verification

| Check | Evidence |
| --- | --- |
| Install | `npm ci` completed; audit found 0 vulnerabilities. |
| Unit and browser suites | `npm test` PASS: 4 Vitest and 16 Playwright tests (`test-results/.last-run.json`: passed). |
| Static analysis | `npm run lint` and `npx tsc --noEmit` PASS. |
| Exact production build | `npm run build` PASS; creates `dist/site` and `dist/extension/chrome-mv3`. |
| Bundle budgets | Site JS: 13,533 B / 5.35 KB gzip; CSS: 8,504 B / 2.76 KB gzip; hero WebP: 74,024 B. All are within the stated static budgets. |

The built MV3 extension was loaded into a clean persistent Chromium profile.
It captured a selected phrase on a normal HTTP page, retained nearby sentences
and the URL, required a learner meaning, saved it, reviewed it from the popup,
exported CSV, and reloaded the popup while offline. Independent boundary and
recovery checks confirmed a blank meaning gets “Write a short meaning, then
save it.”, a meaning is capped at 240 characters, Shift+Tab/Tab stays within
the capture dialog, and Escape restores the original page focus.

## Live deployment and privacy

The live root HTML SHA-256 matches `dist/site/index.html`; live JS, CSS, and
hero WebP hashes match their candidate artifacts exactly. The downloadable ZIP
has different archive metadata but `unzip -t` passes and its extracted contents
are byte-identical to the candidate ZIP.

Live `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, all
rendered same-origin links, demo source pages, and the ZIP return 200. A
missing route returns the designed 404 with status 404. Cold-load, demo, and
extension claim request logs observed no outbound product/analytics requests.
There are no accounts, product API endpoints, paid-unlock calls, or service
worker/PWA behavior in this static extension product, so Entra, rate-limit,
server persistence, and PWA-update checks are not applicable.

Responses provide HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP that
includes `frame-ancestors 'none'`. Hashed JS/CSS have
`Cache-Control: public, max-age=31536000, immutable`; HTML and ZIP use the
short 30-second revalidation cache policy. No third-party scripts or fonts are
loaded.

## Accessibility and responsive QA

Live axe scans on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` at
desktop and 390×844 found **zero serious or critical violations**. Every scan
found `lang="en"`, exactly one `<h1>`, and one `<main>`; there were no console
or page errors and no horizontal overflow. Keyboard activation of review and
navigation works; visible focus is a 3px orange outline. With reduced motion,
computed `scroll-behavior` is `auto`. The repository contains no
`verify-url.sh`; its title/lang/main/alt/console checks were performed directly
with Playwright.

## Defects by severity

None found.
