# Independent verification — FAIL

**Candidate:** `673de417ca8e6e038bf8470a03778e8a0e2d06c9` (`673de41`)

**Live URL:** https://context-vocabulary-capture.sociobot.in

**Verified:** 2026-08-28 (fresh `main` checkout; no product-code changes)

## Verdict

**FAIL — do not release.** The packaged extension cannot open a capture UI on a
selected phrase, so the brief's core job (save a selected phrase with context
and a learner-written gloss) is impossible. Independently, the live download
link for that extension returns 404.

## First-read check

PASS. A cold live visit returned 200 with no console/page errors. The first
screen says “Save words with their sentence.”, identifies “learners reading
real pages”, and offers the one-click **Try it with sample data** action with
the plain result “See a review queue right away.” The action opens `/demo` and
the sample review queue.

## Required claim checks

All commands in `.factory/claims.json` were run exactly after `npm ci`, using
the configured demo entry point. They passed:

| Claim | Command | Result |
| --- | --- | --- |
| `csv-export` | `npm run test:browser -- --grep @claim:csv-export` | PASS: CSV header, sample phrase, 4 rows |
| `local-only` | `npm run test:browser -- --grep @claim:local-only` | PASS: demo requests stayed same-origin; cipher did not expose sample URL |
| `no-account` | `npm run test:unit -- --testNamePattern @claim:no-account` | PASS |
| `demo-sandbox` | `npm run test:browser -- --grep @claim:demo-sandbox` | PASS: direct `?demo=1`, review, reset, 3 records |

This does **not** clear the claims gate: `csv-export` and `local-only` are
each tagged in two tests (`tests/browser/demo.spec.ts` and
`tests/core.test.ts`), while the contract requires exactly one tagged test per
claim. Also, page/README claims about encrypted records, no analytics/no
server transmission, no subscription, and a signed extension have no matching
claim entry/test.

## Local checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS; audit reported 10 production dependency advisories (3 critical, 4 high, 2 moderate, 1 low) |
| `npm test` | PASS: 5 Vitest + 4 Playwright tests |
| `npm run build` | PASS: creates `dist/extension/chrome-mv3`, `dist/site`, and local ZIP |
| `npm exec tsc -- --noEmit` | **FAIL:** `entrypoints/content.ts:5` TS2554 and `entrypoints/content.ts:43` TS2339 |
| lint | No lint script/configuration is provided |
| local ZIP | PASS integrity (`unzip -t`); contains manifest and extension files |

## End-to-end browser-extension evidence

FAIL. I loaded the freshly built MV3 directory into Chromium with a clean
persistent profile, selected “Save words with their sentence.” on the local
site, and had the extension background send the exact `open-capture` message
that its context-menu handler sends. Chromium returned:

```
Could not establish connection. Receiving end does not exist.
```

The built `dist/extension/chrome-mv3/content-scripts/content.js` contains only
the WXT bootstrap and no application callback. The source calls
`defineContentScript({ ... }, () => { ... })` at `entrypoints/content.ts:5`,
which is also the first TypeScript error; the second callback is not compiled.
Consequently no dialog, gloss validation/recovery, save, review, or extension
CSV flow can be reached from a real web page. This is not covered by the
passing site-only Playwright tests.

## Live deployment comparison and policy checks

The live `index.html`, `assets/index-BsFk2XmK.js`, and
`assets/index-D66LgOuP.css` SHA-256 values exactly equal the fresh candidate
build. Therefore the live static shell is from this candidate. However:

* `GET /downloads/keep-the-sentence-extension.zip` returns **404** (the local
  build creates a valid 1.41 MB ZIP at that path). The primary install CTA is
  unusable in production.
* `/missing` returns **200** and the SPA fallback rather than the configured
  404 response; the required real 404 status is not delivered.
* The three demo source links return 404:
  `https://example.org/harbour`, `/conversation`, and `/wald`.

Positive checks: `/`, `/demo`, `/privacy`, and `/terms` load; demo review,
keyboard activation, reset, start-for-real, and CSV download work; requests
on the demo were same-origin only; no account, server endpoint, service
worker/PWA, or sign-in path exists. Rate limiting and Entra validation are
not applicable because there are no product server endpoints or sign-in.

Live headers include CSP (`default-src 'self'` with same-origin scripts,
styles, images, and connects), `X-Content-Type-Options: nosniff`, and strict
origin referrer policy. Hashed assets are `max-age=31536000, immutable`.
The site build is 4.96 KB gzip JS, 2.52 KB gzip CSS, and a 74 KB hero WebP.
Lighthouse on live `/demo` was Performance **100**, Accessibility **100**
(FCP/LCP 0.9 s, CLS 0, TBT 50 ms).

## Accessibility and responsive QA

Desktop and 390px live `/demo` had no horizontal overflow, no browser
console/page errors, and no axe serious/critical violations. Tab order reaches
the visible skip link, navigation, demo controls, export, source link,
`<summary>`, and review action; focus rings are visible. Reduced motion has
no essential animation.

Route accessibility still fails the stated navigation requirement:
`site/src/main.ts:34` calls `focus()` on a non-focusable `<h1>`, leaving focus
on `BODY` after navigation, and there is no `aria-live="polite"` route
announcement. In demo mode, the shared unprefixed
`keep-the-sentence:device-key` is created even though the demo vault itself is
prefixed; this weakens the requirement for a fully separate demo storage
namespace (no real phrase vault was created in the tested flow).

## Defects

### Blocker

1. **Core capture is nonfunctional.** The generated content script omits the
   callback, producing no message receiver/capture dialog. The core
   browser-extension job cannot be done.
2. **Live installer is missing.** The public **Download extension ZIP** CTA
   returns HTTP 404, so even a corrected local extension cannot be installed
   from the deployed product.

### High

1. **Type check fails.** `npm exec tsc -- --noEmit` reports two errors in the
   content script; the first explains the missing compiled callback.
2. **Claim contract is incomplete.** Two claim IDs have duplicate tags, and
   several user-reliance claims are unlisted/untested, contrary to the claims
   contract.
3. **All demo source links are dead** (HTTP 404), violating the no-dead-links
   requirement and making the shown source cues unusable.
4. **Build supply-chain advisories require remediation/triage.** `npm audit
   --omit=dev` reports 3 critical and 4 high advisories through WXT/web-ext
   build dependencies.

### Medium

1. SPA route changes neither focus the new heading nor announce it.
2. Unknown routes return 200 instead of a real 404 status.
3. Demo initialisation writes the unprefixed device-key storage entry, rather
   than using a wholly `demo:`-namespaced storage set.

## Required release evidence after repair

Re-run every command above from a clean checkout; add a real Chromium
extension end-to-end test (selection → context-menu capture → empty-gloss
error → save → popup review → CSV); deploy and fetch the ZIP with HTTP 200;
then re-run the claim commands, link crawl, TypeScript check, and live checks.
