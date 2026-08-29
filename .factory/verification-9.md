# Independent verification 9 — PASS

**Candidate:** `376e64e8b8abd1918749345d7f2c46341a8840e7` (`376e64e`)
**Verified URL:** <https://context-vocabulary-capture.sociobot.in>
**Date:** 2026-08-29
**Acceptance contract:** the researched brief and work order supplied to this
verification. `.factory/brief.json` is absent from the repository.

## Verdict

**PASS.** The candidate performs the complete local-first browser-extension
job: select a phrase on a regular Chromium web page, retain nearby sentences
and the source title/link, require the learner's meaning, encrypt the record in
extension storage, review it offline in context, and export it as CSV.

The live site and downloadable extension match the candidate. No release
blocker, high, medium, low, or informational product defect was found.

## Mandatory gates performed first

`.factory/claims.json` exists with 13 entries. After `npm ci` in the clean
candidate checkout, every exact listed command ran independently before the
rest of the review. All passed:

| Claim | Result |
| --- | --- |
| `csv-export` | PASS |
| `local-only` | PASS |
| `no-account` | PASS |
| `demo-sandbox` | PASS |
| `demo-discard-on-exit` | PASS |
| `encrypted-storage` | PASS |
| `offline-review` | PASS |
| `source-context-capture` | PASS |
| `supported-chromium-pages` | PASS |
| `storage-scope` | PASS |
| `no-analytics` | PASS |
| `extension-download` | PASS |
| `unpacked-install` | PASS |

The individual outputs are in
[`qa-artifacts/claim-logs`](qa-artifacts/claim-logs).

The next action was a cold live read in fresh desktop and 390 × 844 browser
profiles. Before scrolling, the page said:

- What: **“Save phrases with their source sentence.”**
- Who: **“For language learners reading web pages who want to remember a
  phrase and its context.”**
- First action: **“Try it with sample data”**, followed by **“Open sample
  phrases ready to review.”**

The first screen therefore passes the plain-words gate at both widths. One
click opened `/demo` with three realistic phrases and the persistent **“Demo —
sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 273 packages, 0 vulnerabilities |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm test` | PASS; 8 Vitest and 32 Playwright tests |
| `npm run build` | PASS; creates `dist/site`, `dist/extension/chrome-mv3`, and the extension ZIP |
| Live site suite | PASS; 24/24 route, demo, copy, keyboard, mobile, cache, and accessibility tests |

The build is small: initial site JavaScript is 16,591 bytes (6,127 gzip), CSS
is 9,693 bytes (3,024 gzip), the hero WebP is 74,024 bytes, and the unpacked
MV3 extension is 20.97 KB. No web font is shipped.

## End-to-end product exercise

Normal, boundary, invalid-input, and recovery paths all passed:

- Captured `quietly held` from a selected occurrence on a normal HTTPS page,
  retained its three-sentence context and page source, wrote a learner meaning,
  reopened it in the extension popup, marked it remembered, and exported CSV.
- Selected the second repeated occurrence of `target`; the saved context came
  from the second passage, not the first.
- Blank meaning was rejected with **“Write a short meaning, then save it.”**
  The input regained focus, its 240-character limit held, Escape closed the
  dialog, and focus returned to the source-page control.
- Corrupt site and extension vaults showed named recovery screens. Download,
  cancel, and confirmed clear paths preserved or removed only the named product
  keys as intended.
- The popup reloaded offline with the saved phrase. The downloaded ZIP loaded
  as an MV3 extension with a running `chrome-extension:` service worker.
- Demo review advanced to the next multilingual phrase; CSV contained one
  header plus three records and source context; reset restored the first
  phrase; leaving Demo removed both `demo:` keys and left real storage empty.

The independent published-extension exercise is recorded in
[`live-extension-audit.json`](verification-evidence-9/live-extension-audit.json).
Opening the product capture UI added no console error. Axe's probe itself
caused the separately labelled CSP diagnostic in that evidence file; it did
not come from the extension, and the UI retained its computed styling.

## Deployment, privacy, and headers

All candidate site files checked against production were byte-identical,
including HTML, 404, JavaScript, CSS, imagery, icons, source fixtures, install
guide, robots, and sitemap. The downloaded ZIP's archive metadata differs from
fresh packaging, but every one of its seven extracted files is byte-identical
to the candidate build.

A fresh mobile Playwright session performed the complete demo flow while
recording requests. It made four requests: `/`, the hashed JavaScript and CSS,
and the hero WebP. Every request was same-origin; there were no request
failures, console errors, or page errors. The installed extension made no HTTP
request except loading the selected source page. Source and bundle inspection
found no tracker, runtime AI endpoint, external script/font, embedded provider
key, or product-data request.

Public routes `/`, `/demo`, `/privacy`, and `/terms` return 200. Unknown routes
return the designed 404. HTML is short-revalidated; hashed assets use one-year
immutable caching. Live responses include HSTS, `nosniff`, strict-origin
referrer policy, and a restrictive same-origin CSP with `frame-ancestors
'none'`.

This product has no account, sign-in, paid unlock, product API, or other
server-side endpoint. Entra-authority and 429/`Retry-After` allowance checks are
therefore not applicable. It is not a PWA, library, CLI, or backend; its MV3
offline behavior and installation were tested instead.

## Accessibility, responsive behavior, and performance

- Live Axe found zero serious or critical findings across Home, Demo, Privacy,
  Terms, 404, and recovery in light and dark modes at desktop and 390 px.
  Independent Axe checks also found zero serious/critical issues in the
  extension capture dialog and popup.
- Every public route has `lang="en"`, a route-specific title, one h1, one main
  landmark, a skip link, labelled controls, useful image alt text, and the
  shared header/footer. There was no 390 px horizontal overflow.
- Keyboard-only use starts at a visible skip link, moves focus to main, reaches
  every demo control, and activates review/navigation. The tested focus ring is
  a visible 3 px solid outline. Dialog focus, Escape return, route focus, and
  the polite announcement passed.
- Reduced-motion media matched and the 200% layout retained all first-screen
  content without horizontal overflow or overlap. Visible mobile controls met
  the 44 px target check.
- Fresh Lighthouse mobile on `/`: Performance **97**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP **0.8 s**, LCP **1.2 s**, TBT
  **180 ms**, CLS **0**, 83 KiB transferred. `/demo` scored **100/100/100/100**
  with 1.0 s LCP, 50 ms TBT, and CLS 0.

## Claim and copy audit

The landing, legal pages, README, demo, recovery UI, capture dialog, and popup
were cross-checked against the claims registry and copy audit. The review-six
regressions are closed in source, candidate bundles, and the published ZIP:
the extension says **regular web page**, uses **meaning** rather than **cue**,
and the landing/README consistently use **saved phrase**. No unlisted public
claim or sentence over 22 words was found.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Release blocker | None |
| High | None |
| Medium | None |
| Low | None |
| Informational | None |

## Evidence index

- [`live-manual-audit.json`](verification-evidence-9/live-manual-audit.json) —
  cold first screen, keyboard, demo, storage, network, and errors.
- [`full-site-parity.tsv`](verification-evidence-9/full-site-parity.tsv) and
  [`site-sha256.txt`](verification-evidence-9/site-sha256.txt) — live/candidate
  parity.
- [`security-header-summary.txt`](verification-evidence-9/security-header-summary.txt)
  and [`header-matrix.tsv`](verification-evidence-9/header-matrix.tsv) — status,
  caching, and security headers.
- [`lighthouse-home-summary.json`](verification-evidence-9/lighthouse-home-summary.json)
  and [`lighthouse-summary.json`](verification-evidence-9/lighthouse-summary.json)
  — Lighthouse results.
- [`live-site-suite.log`](verification-evidence-9/live-site-suite.log) — 24
  production tests.
