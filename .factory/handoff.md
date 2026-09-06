# Save phrases with their source sentence — repair 6 handoff

**Work order:** `context-vocabulary-capture-repair-6`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Completed:** 2026-09-06

**Implementation SHA:** `cd52ba72f4389a46628b5bdd39ca3708a973b0c8`

**Documentation SHA:** the final report-only commit at delivery; it follows the
implementation SHA above and does not change deployed product files.

**Deployment:** `3ad5b856-d091-45d0-80fc-fee2bdd618c0`

**Verdict:** **PASS — zero known findings and zero untested claims.**

## Repair

Review 8 found that the public and packaged install guides made a network-
service claim that was neither registered nor fully tested. The guide now
makes the precise promise that capture, review, and CSV export work without a
network service on a regular page that is already open.

The new `offline-capture` claim has exactly one tagged installed-extension
test. A fresh Chromium profile opens the source page, goes offline before
capture, saves the selected phrase, exports its nearby sentence and source URL,
records a review, and observes zero HTTP requests after going offline. This is
an outcome test, not a source-string assertion. The copy audit now includes
the public install guide, so later guide changes cannot bypass the word-count
and coverage gate.

## Clean-checkout verification

A new clone at the implementation SHA ran `npm ci`, then every exact command
in `.factory/claims.json` independently. All 14 claims passed, including
`offline-capture`.

- `npm audit --omit=dev`: zero vulnerabilities.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm test`: 8 unit/contract and 33 browser tests passed.
- `npm run test:copy`: 2 tests passed.
- `npm run build`: produced `dist/site`, the MV3 directory, and the ZIP.
- `unzip -t dist/site/downloads/keep-the-sentence-extension.zip`: passed.

The built initial JavaScript is 16,591 bytes raw and 6,161 bytes gzip. CSS is
9,693 bytes raw and 3,034 bytes gzip. The first-screen WebP is 74,024 bytes.

## Live verification

The deployment published the verified static output. All 17 served files,
including the install guide and ZIP, are byte-identical to the local build.
The extracted downloaded extension also matches the local package.

- The 24-test live site suite passed Home, Demo, Privacy, Terms, 404, links,
  metadata, history, focus, keyboard, mobile, both themes, recovery, caching,
  demo isolation, and all serious/critical Axe scans.
- `verify-url.sh` found HTTPS 200, the correct title and language, one h1 and
  main, complete image alt text, labelled buttons, and zero console errors.
- Standalone Axe CLI found zero violations on Home, Demo, Privacy, and Terms.
- Lighthouse mobile scored 100 for Performance, Accessibility, Best Practices,
  and SEO. FCP was 0.77 s, LCP 1.21 s, TBT 0 ms, CLS 0, and transfer 84.9 KB.
- An unknown route returned the expected designed HTTP 404 with the common
  header, footer, skip link, route metadata, and a way home.
- Responses retained HSTS, `nosniff`, strict-origin referrer policy, and a
  restrictive same-origin CSP with header-delivered `frame-ancestors 'none'`.

The live ZIP was loaded as the only extension in a new Chromium profile. With
the source page already open, the browser went offline before capture. The
extension saved `quietly held`, exported its source sentence and live URL,
recorded the review, and made no HTTP request after the offline boundary.

Fresh 1440 × 900 and 390 × 844 contexts showed the job, audience, and **Try it
with sample data** action before scrolling. One click showed three realistic
English, Spanish, and German phrases. The persistent demo label remained
visible; the meaning for `quietly held` was present; review advanced the phrase;
Reset restored all three records; and no real-data key was created. The
registered exit test also proves a seeded real vault remains byte-for-byte
unchanged.

## Earlier findings

The complete review, verification, and polish history was read before repair.
The retained regression suite proves the current disposition:

- Core MV3 capture, selected repeated-occurrence context, meaning validation,
  240-character boundary, focus return, encryption, review, CSV, and offline
  reload pass through the built extension.
- The public install flow includes extraction, Developer mode, Load unpacked,
  a packaged guide, a valid ZIP, and a fresh service worker.
- The structured 404, route metadata, links, focus and announcements, first-
  focus skip link, reduced motion, 200% layout, dark contrast, and stable-media
  cache policy all pass their browser or contract checks.
- Demo reset and every tested exit use only `demo:` keys and preserve real
  data. Corrupt real and demo vaults retain their scoped recovery paths.
- Prior terminology, heading, footer, and README findings remain absent under
  the mechanical landing, public-document, and extension-copy audit.

## Scope and known constraints

The researched brief was supplied in the work order; `.factory/brief.json`
remains absent. The extension is installed through Chromium's documented
**Load unpacked** flow rather than a browser store. Its offline-capture promise
is intentionally limited to a regular page that was open before connectivity
was lost.

This static browser-extension product has no backend, account, site service
worker, remote sync, AI call, analytics, payment flow, or advertised paid
offer. Backend tenancy, SQLite persistence, API health/rate limiting, PWA
updates, and billing metadata are therefore not applicable. No product defect
or authorised next step remains.

The catalog description is: **Save phrases with source sentences to review
later in Chromium.**
