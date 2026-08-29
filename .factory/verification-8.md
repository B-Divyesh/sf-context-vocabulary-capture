# Independent verification 8 — PASS

**Candidate:** `a7b69e828580a211ddf74c0a3c398bf10fd0a05a` (`a7b69e8`)
**Verified URL:** <https://context-vocabulary-capture.sociobot.in>
**Date:** 2026-08-29

## Verdict

**PASS.** The candidate delivers the researched job: language learners can capture a selected phrase with nearby source sentences, title/link, language, and their own meaning; records stay encrypted locally, can be reviewed offline, and export to CSV. The live deployment matches the candidate’s site bundles and extracted extension contents.

No release-blocking, high, medium, low, or informational product defects were found.

## Mandatory cold-read and demo check

Fresh live desktop load, without prior storage, showed:

- Headline: “Save phrases with their source sentence.”
- Audience/outcome: “For language learners reading web pages who want to remember a phrase and its context.”
- First action: “Try it with sample data,” with “Open sample phrases ready to review.”

This answers what it does, for whom, and what to click first in plain words. One click opened `/demo`, showed the persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, and three realistic multilingual sample phrases. At 390 px there was no horizontal overflow; keyboard order began with the skip link.

## Clean-checkout quality gates

`npm ci` completed cleanly (273 packages audited; 0 vulnerabilities). The following all passed at the candidate commit:

| Check | Result |
| --- | --- |
| `npm run lint` | pass |
| `npx tsc --noEmit` | pass |
| `npm test` | pass: 8 Vitest tests and 31 Playwright tests |
| `npm run build` | pass; produces `dist/site` and `dist/extension/chrome-mv3` |
| Local extension suite | pass: 8/8 capture, repeated-selection boundary, CSV, offline, privacy, scope, and corrupt-data recovery tests |
| Live site suite | pass: 23/23 site/demo/route tests, including desktop and 390 px Axe scans |

The full externally pointed suite has one harness-only error and skips seven dependent extension tests: its extension fixture hard-codes `http://127.0.0.1:4173`, which is intentionally absent when `PLAYWRIGHT_BASE_URL` targets production. This is not a product defect: the same eight extension tests passed against the candidate build locally, and the live ZIP's extracted file contents equal the candidate's byte-for-byte.

## Claims — required exact commands

`.factory/claims.json` exists and declares 13 claims. Every exact listed command was run from the clean checkout and passed:

| Claim ID | Result |
| --- | --- |
| `csv-export` | pass |
| `local-only` | pass |
| `no-account` | pass |
| `demo-sandbox` | pass |
| `demo-discard-on-exit` | pass |
| `encrypted-storage` | pass |
| `offline-review` | pass |
| `source-context-capture` | pass |
| `supported-chromium-pages` | pass |
| `storage-scope` | pass |
| `no-analytics` | pass |
| `extension-download` | pass |
| `unpacked-install` | pass |

The browser claims use `/demo` or `?demo=1`. They prove CSV records, encryption before storage, demo isolation and discard-on-exit, capture on regular HTTP pages, exact encrypted record fields, offline review, no analytics/product-data requests, anonymous ZIP download, and loading the extracted MV3 extension in fresh Chromium.

## Product and recovery exercise

Independent and suite evidence covered normal selection/capture, three-sentence source context, source title/link, learner gloss, review, and CSV export; the repeated-phrase boundary (the selected second `target` stored its own context); offline popup reload; demo reset/exit with a separate seeded real vault; malformed vault/key recovery with download, cancel, and confirmed clear; and clean Chromium unpacked installation.

## Live deployment, privacy, headers, and parity

A cold live Playwright session made only same-origin requests: `/`, the hashed JS/CSS, and the hero WebP. It logged zero console and page errors. No third-party requests, tracking, account, sign-in, server-side product API, or product-unlock endpoint exists; rate-limit and Entra checks are not applicable.

Public routes returned HTTPS 200 and a missing route returned HTTPS 404. Headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive same-origin CSP with `frame-ancestors 'none'`. HTML is short-revalidated; hashed JS is `max-age=31536000, immutable`.

Candidate/live SHA-256 comparison:

- `assets/index-DgMVRR5K.js`: identical, `1d33a30294235b20f831ad0f47533d1c61dff58c6d446df9e21bfcf540116f25`
- `assets/index-DIQ-UEVh.css`: identical, `5012c52d3276ab5ad82796f6f6dd72f659eac51db9dfa6fe4d42e2f2ed181f03`
- ZIP container hashes differ because of archive metadata; extraction comparison found all seven delivered files byte-identical.

## Accessibility and performance

Live Axe found **zero serious or critical violations** on `/`, `/demo`, `/privacy`, `/terms`, and `/not-found` at 390 px. Existing browser checks also passed Axe on both themes at desktop and 390 px. Manual keyboard traversal confirmed a first-focus skip link, named controls, functional keyboard activation, and visible focus. Reduced-motion media query was active in a reduced-motion context. Checked pages have route-specific titles, English language, one h1, and a main landmark.

Fresh Lighthouse mobile result: **Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1.23 s; CLS 0**. Built initial JS is 16,579 bytes (6,166 gzip) and CSS is 9,693 bytes (3,032 gzip). The first-screen WebP is 74,024 bytes. The 1.27 MB social PNG is metadata-only and was not requested on first load. Lighthouse was run with full-page screenshot disabled because Chromium's screenshot process crashed; the completed report has no runtime error.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Release blocker | None |
| High | None |
| Medium | None |
| Low | None |
| Informational | None |
