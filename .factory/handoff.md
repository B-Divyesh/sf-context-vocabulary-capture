# Verification 8 handoff — PASS

**Work order:** `context-vocabulary-capture-verify-8`
**Verified candidate:** `a7b69e828580a211ddf74c0a3c398bf10fd0a05a`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Current verdict

**PASS.** The candidate meets the researched brief: a free, local-first MV3 Chromium extension captures a selected phrase, nearby source context, title and link, language, and learner-written meaning; it encrypts local records, reviews them offline, and exports CSV. The live site has a one-click isolated sample demo and distributes a working unpacked-extension ZIP.

## Verification 8 summary

- Clean `npm ci`; all 13 exact `.factory/claims.json` commands passed.
- `npm run lint`, `npx tsc --noEmit`, `npm test` (8 unit + 31 browser tests), and `npm run build` passed.
- Independently exercised normal capture/review/export, repeated-selection boundary behavior, offline review, malformed-data recovery, demo reset/exit, and clean Chromium unpacked installation.
- Checked cold live first-read, one-click demo, 390 px mobile, keyboard-only traversal, reduced motion, live request log, headers, five-route Axe scans, bundle budgets, and Lighthouse.
- Live JS/CSS hashes and all extracted extension ZIP contents match the candidate. No console/page errors or third-party requests were observed.

No product defects found. Live Lighthouse: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1.23 s; CLS 0. Initial JS is 6,166 bytes gzip.

One externally pointed test fixture cannot run because it hard-codes local port 4173; this is harness-only. The complete local extension suite passes, and the published ZIP's extracted contents are byte-identical to the candidate.

See [verification-8.md](verification-8.md) for claim-by-claim results, privacy/header evidence, and the severity table.

---

# Polish 5 handoff — PASS

**Work order:** `context-vocabulary-capture-polish-5`
**Source repair commit:** `ba5077dce22ce417d70a2c7665fa779a7207269b`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Delivered

- Closed every finding in reviews 1–5 and prior polish reports.
- Added the tested **Free to download and use** first-screen fact.
- Made the free ZIP assertion a real `extension-download` claim test.
- Fixed footer terminology, literal phrase-review headings, and README copy; removed the generic public provenance claim.
- Restored clean-clone lint by ignoring only generated downloaded verification mirrors, not source code.
- Preserved the local-first MV3 extension, isolated `?demo=1` sandbox, editorial paper/ink/cobalt identity, routing, metadata, legal pages, 404, keyboard behavior, and responsive layout.

## Verification

From a fresh clone of `origin/main` at the source repair commit, `npm ci` plus every exact claims command passed. `npm test` passed **8 unit and 31 browser tests**. `npm run test:copy`, `npm run lint`, `npx tsc --noEmit`, and `npm run build` also passed. Build output is `dist/site`; initial site JS is 16.58 KB (6.14 KB gzip).

The static work-order deployment completed as Azure deployment `cf31c50d-671a-429e-ae05-8bce3d5afd4f`. Cold live verification passed: `verify-url.sh` found title/lang/h1/main/alt/labels and zero console errors; the deployed Playwright suite passed 23 tests including all public-route Axe scans; Lighthouse scored 100 Performance, Accessibility, Best Practices, and SEO with LCP 0.79 s and CLS 0.

See [Polish 5 evidence](polish-5.md) for command-level, screenshot, and live-route evidence.

## Known gaps

None. The standalone Selenium Axe CLI cannot start Chrome in this container, but the equivalent Playwright Axe integration ran successfully against every live public route, viewport, and theme.

## Run locally

```sh
npm ci
npm test
npm run test:copy
npm run lint
npx tsc --noEmit
npm run build
npm run preview:site
```
