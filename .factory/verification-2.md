# Independent verification 2 — PASS

**Candidate:** `87032cb75598c4939c146c8538ba054a6e560ff5` (`87032cb`)

**Live URL:** https://context-vocabulary-capture.sociobot.in

**Verified:** 2026-08-28 from a clean checkout; no product code was changed.

## Verdict

**PASS — release candidate accepted.** The repair addressed the failures in
the previous verification: the deployed installer works, the MV3 content
script receives the capture request, and a full local capture and offline
review flow succeeds.

## Required cold-read and demo check

PASS. In a fresh browser context, the first screen plainly says:

- What it does: “Save words with their sentence.”
- Who it is for: learners reading real pages.
- What to do first: **Try it with sample data**, with the immediate outcome
  “See a review queue right away.”

The action opens `/demo` in one click. It shows three realistic sample
phrases and the persistent “Demo — sample data, nothing is saved” banner with
**Reset demo** and **Start for real**. Reviewing advances from “quietly held”
to “recoger el hilo”; reset restores three records; Start for real shows an
empty real queue. The demo made requests only to the deployed origin.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every listed command was run
independently through its shipped demo/browser entry point and passed. Each
`@claim:<id>` occurs exactly once in the test suite.

| Claim | Exact command | Result |
| --- | --- | --- |
| `csv-export` | `npm run test:browser -- --grep @claim:csv-export` | PASS — CSV has header and three sample rows |
| `local-only` | `npm run test:browser -- --grep @claim:local-only` | PASS — same-origin requests; encrypted demo storage does not expose source URL |
| `no-account` | `npm run test:unit -- --testNamePattern @claim:no-account` | PASS |
| `demo-sandbox` | `npm run test:browser -- --grep @claim:demo-sandbox` | PASS — direct demo URL, review/reset, namespaced keys |
| `encrypted-storage` | `npm run test:unit -- --testNamePattern @claim:encrypted-storage` | PASS — AES-GCM ciphertext excludes clear phrase text |
| `offline-review` | `npm run test:browser -- --grep @claim:offline-review` | PASS — extension capture, validation, save, popup review after offline reload |
| `extension-download` | `npm run test:browser -- --grep @claim:extension-download` | PASS — deployment output responds as ZIP (`PK\\003\\004`) |

## Local build and product QA

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 0 audited vulnerabilities |
| `npm test` | PASS — 4 Vitest and 8 Playwright tests |
| `npm run lint` | PASS |
| `npm exec tsc -- --noEmit` | PASS |
| `npm run build` | PASS; produces `dist/site` and `dist/extension/chrome-mv3` |
| Extension package | PASS; ZIP integrity test passes |

The Chromium MV3 test loads the production extension in a clean persistent
profile, selects **quietly held** from a three-sentence source, sends the same
message as the context menu, checks the empty-meaning error, saves a learner
cue, checks it in the popup, exports CSV, then sets the browser offline and
reloads the popup successfully. This exercises the normal case, invalid
input/recovery, source context, export, and offline boundary.

## Live deployment, privacy, and policy evidence

The live `/`, `/demo`, `/privacy`, `/terms`, demo source links, and extension
ZIP all return HTTP 200. A missing route returns HTTP 404 with the designed
404 page. A live link crawl found no dead same-origin links.

Fresh-build and deployed `index.html`, JavaScript, and CSS SHA-256 hashes are
identical. The downloaded live ZIP differs only in archive timestamps; its
extracted contents are byte-identical to this candidate's ZIP and `unzip -t`
passes.

The static site has no server-side product API, sign-in, payment, service
worker/PWA, or third-party request path; rate limiting and Entra checks are
therefore not applicable. The extension manifest contains only `storage` and
`contextMenus` permissions plus host access needed to capture an explicit
selection. Demo and extension test traffic was same-origin only.

Responses include HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP. Hashed
JS and CSS are cached `max-age=31536000, immutable`. Build sizes are 4.97 KB
gzip JS, 2.57 KB gzip CSS, and a 74 KB hero WebP; all meet the static budgets.

## Accessibility, responsive, and performance checks

Live desktop and 390 px `/demo` each had exactly one `<h1>` and `<main>`,
`lang="en"`, image alt text, no horizontal overflow, no console/page errors,
and no outbound origin. Keyboard activation of review and navigation works;
visible focus and the skip link are present. Under reduced motion,
`scroll-behavior` is `auto`.

Live axe scans of `/`, `/demo`, `/privacy`, and `/terms` at 390 px found zero
serious or critical findings. (No repository `verify-url.sh` exists; the
equivalent title/lang/main/alt/console checks above were run directly.)

Lighthouse on live `/demo`: Performance **100**, Accessibility **100**, FCP
**0.8 s**, LCP **0.9 s**, CLS **0**, and TBT **30 ms**. INP is not reported by
this non-interactive Lighthouse run; interaction was separately exercised with
Playwright.

## Defects

None found. No release-blocking gaps remain from the prior report.
