# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** https://context-vocabulary-capture.sociobot.in  
**Method:** fresh Chromium contexts at 390 × 844 and 1440 × 900, then a clean
`npm ci` checkout for the shipped checks. No product code was changed.

## Verdict

**FAIL.** The cold read and the one-click demo are clear, but the live 404
route produces a CSP console error and loses the required site structure.
Route metadata is also wrong for every SPA deep link, the main capture promise
is absent from the claims registry, and the remaining copy has terminology and
jargon problems. PASS requires zero findings.

## 30-second cold read

Before scrolling at both widths, I understood:

- **What it does:** saves vocabulary with the sentence where it appeared, for
  later review.
- **For whom:** people learning a language while reading web pages.
- **First click:** **Try it with sample data**, which says it will show a
  review queue immediately.

This part passes. At 390 px the first screen has no horizontal overflow,
contains one h1, and has no console or page errors. The distinctive paper,
ink, cobalt, and halftone artwork follows the recorded visual direction; it
does not look like a generic SaaS hero.

## Findings

### BLOCKING — F-1-1: The live 404 route violates CSP and is not the site shell

- **Exact location/evidence:** `https://context-vocabulary-capture.sociobot.in/missing`
  returns HTTP 404 but emits this browser-console error:
  `Applying inline style violates the following Content Security Policy directive 'style-src 'self'' ... The action has been blocked.`
  `public/404.html` contains the blocked inline `<style>`. The rendered route
  has no skip link, header/nav, footer, favicon, description, canonical link,
  or Open Graph metadata.
- **Why this fails:** a deliberately required route loads with a console error
  and its designed visual treatment is discarded by the deployed CSP. It also
  breaks the required consistent header/footer and the stated no-console-error
  quality gate.
- **Concrete fix:** move the 404 rules to a same-origin stylesheet allowed by
  the CSP (do not weaken CSP), and give `404.html` the same wordmark, skip
  link, header, footer, favicon, metadata, and “Go home” escape as the other
  routes. Add a browser test that requests a missing path, asserts 404,
  asserts no console errors, and verifies the site shell.

### HIGH — F-1-2: Deep-link metadata still describes the landing page

- **Exact location/evidence:** fresh live visits to `/demo`, `/privacy`, and
  `/terms` each retain `<link rel="canonical" href="https://context-vocabulary-capture.sociobot.in/">`, the landing description, and
  `og:title` “Keep the Sentence — save words in context”. Only `document.title`
  changes (for example, `/demo` is correctly titled “Demo — Keep the Sentence”).
- **Why this fails:** a visitor, crawler, or shared deep link is told that a
  distinct Demo, Privacy, or Terms page is the home page. This conflicts with
  the sitemap, which lists these routes separately, and does not meet the
  per-route canonical/OG requirement.
- **Concrete fix:** set description, canonical URL, Open Graph title/
  description/image, and Twitter title/description for every route during
  render (or serve route-specific documents). Add a deep-link test for all
  four public routes, including canonical equality to the requested route.

### HIGH — F-1-3: Two central visitor claims have no claims.json entry

- **Exact quote/location:** landing h1 **“Save words with their sentence.”**;
  README: **“Select a phrase, save its nearby sentences and source link...”**;
  landing install heading: **“Capture from any page you can read.”**
  `.factory/claims.json` has no `source-context-capture` or supported-pages
  claim. Its `offline-review` test happens to exercise a fixture capture, but
  its registered claim is only “Review saved phrases offline”; it is not a
  registry entry for either quoted promise.
- **Why this fails:** preserving source context is the product's core
  job-to-be-done, and “any page” is a broad compatibility promise. A first-time
  visitor can rely on both, yet neither is a listed, independently named,
  observable claim as required.
- **Concrete fix:** add a `source-context-capture` entry such as “Saves a
  selected phrase with nearby sentences and its source link”, with one tagged
  real-extension test that saves a selection and checks the stored/exported
  context and URL. Replace “Capture from any page you can read.” with “Capture
  from regular web pages in Chromium.”, or add a separate supported-pages claim
  and test the documented boundary. Update README wording to match.

### MINOR — F-1-4: The same saved item has three names

- **Exact quote/location:** landing h1 **“Save words with their sentence.”**;
  instructions **“Select the phrase.”** and **“The capture card keeps...”**;
  review copy **“reveal your cue.”** The README also begins with “Select a
  phrase”.
- **Why this fails:** “word”, “phrase”, “capture”, and “cue” require a cold
  visitor to infer whether these are different objects. The existing
  terminology table already calls the selected vocabulary a “phrase”, but the
  public copy does not follow it.
- **Concrete fix:** use **phrase** for the selected/saved item throughout:
  “Save phrases with their source sentence.”, “The saved phrase keeps nearby
  sentences and its source link.”, and “reveal your meaning.” Keep “sentence”
  only for the surrounding source text.

### MINOR — F-1-5: Two labels use unexplained jargon or incomplete wording

- **Exact quote/location:** landing action result **“See a review queue right
  away.”** and step text **“The capture card keeps the nearby sentences and
  source link.”**
- **Why this fails:** “review queue” and “capture card” are internal product
  labels, not immediate learner language. The latter also leaves it unclear
  whether the phrase itself is saved.
- **Concrete fix:** rewrite as “See phrases ready to review right away.” and
  “Your saved phrase includes nearby sentences and the source link.”

### MINOR — F-1-6: The committed copy audit is incomplete and has wrong counts

- **Exact location/evidence:** `.factory/copy-audit.md` says it contains all
  landing sentences, but it omits visible text including **“Nothing due
  today.”**, **“Saved phrases will appear here after you capture one.”**,
  **“No saved phrases yet.”**, **“Capture from any page you can read.”**, and
  the footer sentences. It also records **“Review the word where you met it.”**
  as 8 words (it is 7), and treats the two separate privacy sentences as one.
- **Why this fails:** the required proof of plain copy cannot be relied on to
  catch regressions.
- **Concrete fix:** regenerate the audit from rendered landing copy, include
  alt text and action/heading labels in a separate section, and use the
  complete count table below as the baseline.

## Copy audit

All visible landing and README sentences are at or below 22 words. The items
flagged above are terminology/jargon or unsupported-claim issues, not length
failures. Headings and action labels that are not sentences are checked in the
findings; product/version names and code snippets are not counted as prose.

### Landing page

| Words | Sentence |
| ---: | --- |
| 5 | Save words with their sentence. |
| 13 | For learners reading real pages who need a meaning without losing their place. |
| 6 | See a review queue right away. |
| 5 | Captures stay on your device |
| 4 | Works without an account |
| 4 | Review saved phrases offline |
| 4 | A sentence stays attached |
| 7 | Review the word where you met it. |
| 3 | Nothing due today. |
| 9 | Saved phrases will appear here after you capture one. |
| 4 | No saved phrases yet. |
| 2 | Keep reading. |
| 3 | Keep the source. |
| 3 | Select the phrase. |
| 8 | Choose “Keep this sentence” from the page menu. |
| 4 | Write a short meaning. |
| 10 | The capture card keeps the nearby sentences and source link. |
| 3 | Review today’s queue. |
| 10 | Try the phrase in context before you reveal your cue. |
| 6 | Your captures stay private and local. |
| 13 | It saves only the phrase, nearby text, source link, and meaning you choose. |
| 12 | Export your records as a CSV for Anki or your own archive. |
| 7 | Capture from any page you can read. |
| 4 | Download the extension package. |
| 16 | Your browser will ask you to load it as an unpacked extension during this first release. |
| 3 | Save source sentences. |
| 3 | Review them later. |
| 5 | Illustration generated for this product. |
| 18 | A blank open book, a bookmark, a flashcard, and halftone dots show a sentence becoming a review cue. *(hero alt)* |

### README

| Words | Sentence |
| ---: | --- |
| 15 | Keep the Sentence is a local browser extension for language learners reading real web pages. |
| 20 | Select a phrase, save its nearby sentences and source link, write your own meaning, and review it later in context. |
| 11 | It keeps the source sentence attached to a phrase you chose. |
| 6 | Open `/demo` after starting the site. |
| 11 | It loads three sample phrases in a separate `demo:` storage namespace. |
| 13 | The banner can reset the samples or discard them and start for real. |
| 3 | Run the build. |
| 13 | The packaged extension is at `dist/site/downloads/keep-the-sentence-extension.zip`. |
| 5 | Download and extract the ZIP. |
| 6 | Open your Chromium browser’s extensions page. |
| 4 | Turn on Developer mode. |
| 8 | Choose **Load unpacked** and select the extracted folder. |
| 17 | On a web page, select a phrase and choose **Keep this sentence** from the right-click menu. |
| 10 | The extension stores encrypted records in browser-local extension storage. |
| 7 | No account or network service is needed. |
| 6 | Saved phrases can be reviewed offline. |
| 13 | Use **Export CSV** from the popup to move your phrases to another tool. |
| 8 | `npm run build` is the reproducible deployment command. |
| 14 | The static deploy root is `dist/site`, where `index.html` is at the root. |
| 15 | Only the phrase, nearby source text, source URL/title, language, and your meaning are stored. |
| 10 | The extension does not send those records to a server. |
| 9 | Read the deployed `/privacy` and `/terms` pages for details. |
| 1 | MIT. |
| 3 | See [LICENSE](LICENSE). |

## Demo, privacy, and claim verification

- **Demo: PASS.** In a fresh 390 px context, `/?demo=1` immediately showed
  three realistic phrases, the first contextual review card, and the persistent
  **“Demo — sample data, nothing is saved”** banner. **I remembered it** moved
  from *quietly held* to *recoger el hilo*; **Reset demo** restored *quietly
  held* and `3 total`; **Start for real** reached `/` without adding either
  real-storage key. The only keys were `demo:keep-the-sentence:vault` and
  `demo:keep-the-sentence:device-key`. No outbound requests were observed.
- **Claim commands: PASS.** Each listed command passed serially after clean
  dependency installation: `csv-export`, `local-only`, `no-account`,
  `demo-sandbox`, `encrypted-storage`, `offline-review`, and
  `extension-download`. Each `@claim:` identifier occurs once. The offline
  test loaded the built MV3 extension, captured a phrase, saved it, set the
  browser offline, and reopened the popup successfully.
- **Important limitation:** the passing manifest does not remove F-1-3:
  `claims.json` still does not name the headline/source-context or
  any-page promises.

## Structure and quality checks

- `/`, `/demo`, `/privacy`, and `/terms` responded 200; the installer ZIP,
  source links, robots file, sitemap, and every discovered same-origin link
  responded 200. `/missing` responded 404.
- The normal routes had one h1, main, lang=en, skip link, designed focus,
  header/footer, privacy/terms links, and no desktop or 390 px overflow.
  Navigation, deep linking, back/forward focus, and route announcement work.
- `npm test`, `npm run lint`, `npm exec tsc -- --noEmit`, and `npm run build`
  all passed. The production site JS is 4.97 KB gzip; the art is 74 KB WebP.
- The normal-route browser checks found no outbound requests or console/page
  errors. The exception is the 404 CSP error in F-1-1.

## Earlier review history

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
I read `.factory/verification.md`, `.factory/verification-2.md`, and the
previous handoff. The former core capture, download, source-link, demo
namespace, type-check, and route-focus failures were confirmed fixed on the
live site and in source/tests. This review's findings are newly observed;
they are not merely restatements of a prior “fixed” label.

## Missed leverage

No additional AI, sync, or import feature is required by the available product
scope. CSV export is present, and an AI feature would be decorative for this
local, context-preserving capture tool. The concrete leverage still missing is
the independently claimed and tested source-context capture in F-1-3.

## What would make this perfect

Ship a CSP-clean, fully branded 404; make every deep route self-describing in
metadata; add explicit source-context and supported-page claims/tests; and use
one plain noun—“phrase”—for the saved item. Then regenerate the committed copy
audit from the rendered copy and repeat this full fresh-context review.
