# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://context-vocabulary-capture.sociobot.in>  
**Method:** fresh Chromium contexts at 390 × 844 and 1440 × 900; clean local
`npm ci`; no product code changed.

## Verdict

**FAIL.** The product is clear and immediately tryable, and all listed claim
commands pass. It still has a dead shared-navigation link, two privacy/data
claims with no claims-registry entry or tagged test, and one non-result-naming
action label. PASS requires zero findings.

## 30-second cold read

Before scrolling at both widths, I could answer all three required questions:

- **What it does:** It saves a phrase with the source sentence so a learner can
  review it later.
- **For whom:** Learners reading regular web pages.
- **What to click first:** **Try it with sample data**; the adjacent text says
  it will show phrases ready to review immediately.

This passes. At 390 px there was no horizontal overflow, one h1, no console or
page error, and a visible primary action. The paper/ink/cobalt, halftone,
editorial-art direction is distinct from a generic SaaS template and matches
`.factory/design.md`.

## Findings

### BLOCKING — F-2-1: The shared “How it works” navigation link is dead off the landing page

- **Exact location/evidence:** The header rendered on `/demo`, `/privacy`, and
  `/terms` contains `<a href="#how">How it works</a>`. A fresh mobile browser
  click changes the URL to, respectively, `/demo#how`, `/privacy#how`, and
  `/terms#how`, while `document.querySelector('#how')` is false and
  `scrollY` remains `0`. The link therefore has no destination on those
  routes. This is reproduced by `header()` in `site/src/main.ts`.
- **Why this fails:** The required consistent header contains a visible dead
  link on three of four public pages. A first-time visitor following it learns
  nothing and cannot reach the explanation promised by the label. This fails
  the no-dead-links and working-routing checks.
- **Concrete fix:** Make this an explicit cross-route anchor such as
  `href="/#how"`, then test a click from `/demo`, `/privacy`, and `/terms`
  reaches the landing page's `#how` element, changes focus appropriately, and
  preserves correct back-button behavior.

### HIGH — F-2-2: Privacy/data-scope promises are unlisted claims

- **Exact location/evidence:** The live landing says **“It saves only the
  phrase, nearby text, source link, and meaning you choose.”** The README says
  **“Only the phrase, nearby source text, source URL/title, language, and your
  meaning are stored.”** The live Privacy route says **“Keep the Sentence
  stores only the phrases and details you save.”** and **“It has no
  analytics.”** None has a matching entry in `.factory/claims.json`.
  `local-only` verifies a different claim, **“Saved phrases stay on your
  device,”** and its tagged extension test observes requests from the fixture
  page; it does not assert either the allowed stored-field set or the absence
  of analytics from the whole extension flow.
- **Why this fails:** These are precise promises a visitor may rely on when
  deciding whether to put reading history in the extension. The claims contract
  requires every such promise to be listed and observably tested, not inferred
  from a related local-storage claim.
- **Concrete fix:** Add `storage-scope` and `no-analytics` entries with one
  tagged test each. The first should capture a phrase and decrypt/read the
  saved record to assert the exact permitted fields and no extra fields. The
  second should record requests from the complete clean extension capture,
  popup, and demo flow and assert no analytics endpoint is contacted. Or remove
  the untestable “only” and “no analytics” promises from landing, README, and
  Privacy copy.

### MINOR — F-2-3: The review action does not name the result as a verb

- **Exact location/evidence:** The demo and review board button reads **“I
  remembered it.”**
- **Why this fails:** It is a past-tense self-report rather than a
  result-naming action. A visitor has to read the nearby helper text to learn
  that the click records a review. This misses the plain-words requirement for
  buttons to name their result.
- **Concrete fix:** Change the label to **“Mark phrase as remembered”** (or
  **“Record remembered review”**) and retain the concise explanation of what
  it changes.

## Copy audit

All audited prose is at or below 22 words. No banned marketing adjective or
jargon term was found. The one control-label exception is F-2-3. Product words
are consistent: **phrase** is the saved vocabulary, **source sentence/nearby
sentences** is the context, **your meaning** is the learner gloss, and
**review** is the recall action.

### Landing page sentences

| Words | Sentence |
| ---: | --- |
| 6 | Save phrases with their source sentence. |
| 13 | For learners reading real pages who need a meaning without losing their place. |
| 7 | See phrases ready to review right away. |
| 7 | Review the phrase where you met it. |
| 3 | Nothing due today. |
| 9 | Saved phrases will appear here after you capture one. |
| 4 | No saved phrases yet. |
| 2 | Keep reading. |
| 3 | Keep the source. |
| 8 | Choose “Keep this sentence” from the page menu. |
| 10 | Your saved phrase includes nearby sentences and the source link. |
| 10 | Try the phrase in context before you reveal your meaning. |
| 7 | Your saved phrases stay private and local. |
| 13 | It saves only the phrase, nearby text, source link, and meaning you choose. |
| 12 | Export your records as a CSV for Anki or your own archive. |
| 4 | Download the extension package. |
| 16 | Your browser will ask you to load it as an unpacked extension during this first release. |
| 3 | Save source sentences. |
| 3 | Review them later. |
| 5 | Illustration generated for this product. |

Landing headings/facts that are labels rather than prose sentences were also
checked: **A local browser extension** (5), **Try it with sample data** (6),
**Saved phrases stay on your device** (6), **Works without an account** (4),
**Review saved phrases offline** (4), **A sentence stays attached** (4),
**Your phrases to review** (4), **Saved phrases** (3), **How it works** (3),
**Select the phrase** (3), **Write a short meaning** (4), **Review today’s
phrases** (3), **What it does not do** (5), **Install the extension** (3),
and **Capture phrases from regular web pages in Chromium** (8). The hero alt
text is 19 words. Controls are result-naming verbs except F-2-3.

### README sentences

| Words | Sentence |
| ---: | --- |
| 17 | Keep the Sentence is a local browser extension for language learners reading regular web pages in Chromium. |
| 20 | Select a phrase, save nearby sentences and its source link, write your own meaning, and review it later in context. |
| 12 | It saves a selected phrase with nearby sentences and its source link. |
| 6 | Open `/demo` after starting the site. |
| 11 | It loads three sample phrases in a separate `demo:` storage namespace. |
| 13 | The banner can reset the samples or discard them and start for real. |
| 3 | Run the build. |
| 6 | The packaged extension is at `dist/site/downloads/keep-the-sentence-extension.zip`. |
| 5 | Download and extract the ZIP. |
| 6 | Open your Chromium browser’s extensions page. |
| 4 | Turn on Developer mode. |
| 8 | Choose **Load unpacked** and select the extracted folder. |
| 16 | On a web page, select a phrase and choose **Keep this sentence** from the right-click menu. |
| 9 | The extension stores encrypted records in browser-local extension storage. |
| 7 | No account or network service is needed. |
| 6 | Saved phrases can be reviewed offline. |
| 13 | Use **Export CSV** from the popup to move your phrases to another tool. |
| 8 | `npm run build` is the reproducible deployment command. |
| 12 | The static deploy root is `dist/site`, where `index.html` is at the root. |
| 14 | Only the phrase, nearby source text, source URL/title, language, and your meaning are stored. |
| 10 | The extension does not send those records to a server. |
| 9 | Read the deployed `/privacy` and `/terms` pages for details. |
| 1 | MIT. |
| 2 | See [LICENSE](LICENSE). |

The storage-scope rows above are included in F-2-2; their length is acceptable,
but they remain unlisted claims.

## Demo, sandbox, and claims

- **Demo: PASS.** Fresh `/?demo=1` at 390 px opened directly into a review
  board with the three realistic English, Spanish, and German sample phrases.
  The banner was visible: **“Demo — sample data, nothing is saved”**, with
  **Reset demo** and **Start for real**. **I remembered it** advanced the due
  phrase; Reset restored **quietly held** and **3 total**. Demo storage used
  only `demo:keep-the-sentence:vault` and
  `demo:keep-the-sentence:device-key`; no real key was created. Start for real
  clears the demo vault to an empty encrypted vault before returning home.
- **Privacy/network: PASS for observed behavior.** The fresh demo flow made
  same-origin requests only, and source review showed no runtime API, tracker,
  third-party font, AI provider, or embedded provider key. This does not clear
  F-2-2's registry/test requirement.
- **Listed claims: PASS.** From a clean dependency install, every command in
  `.factory/claims.json` passed: `csv-export`, `local-only`, `no-account`,
  `demo-sandbox`, `encrypted-storage`, `offline-review`,
  `source-context-capture`, `supported-chromium-pages`, and
  `extension-download`. Each `@claim:` identifier occurs once in the test
  suite. The real MV3 test covers selection, empty-meaning recovery, save,
  CSV context/source link, and offline popup reload.

## Earlier review history

I read `.factory/review-1.md`, `.factory/polish-1.md`, both verification
reports, and the preceding handoff. Each earlier finding was checked live and
in code:

| Earlier id | Status in this audit | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | `/missing` returns HTTP 404 with the header/footer shell, same-origin `404.css`, metadata, and no unexpected console error. |
| F-1-2 | Fixed | `/`, `/demo`, `/privacy`, and `/terms` each have their own title, description, canonical, and OG title. |
| F-1-3 | Fixed | `source-context-capture` and `supported-chromium-pages` exist in `claims.json` and pass through the production MV3 flow. |
| F-1-4 | Fixed | Landing/demo/README use **phrase** for the saved item; the previous conflicting item nouns are gone. |
| F-1-5 | Fixed | The prior “review queue” and “capture card” wording is replaced by plain learner language. |
| F-1-6 | Fixed | `.factory/copy-audit.md` now contains the rendered copy, labels, terminology table, and corrected counts. |

The new F-2-1 is a regression/newly observed shared-nav defect, not a merely
marked-fixed earlier item. F-2-2 and F-2-3 are newly identified in this full
checklist rerun.

## Structure and quality checks

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; `/missing` returned
  404. The installer ZIP and all actual source/footer links returned 200.
  F-2-1 remains the exception: the fragment target is absent on three routes.
- Every checked route has `lang="en"`, one h1, one main, a skip link,
  title/description/canonical/OG/Twitter metadata, favicon, consistent
  header/footer, and designed 404. `robots.txt` and `sitemap.xml` list the
  expected public routes.
- Direct deep links, route title updates, heading focus, and the polite route
  announcement work for SPA navigation. Back/forward worked in the tested
  route flow. The broken same-route fragment link is F-2-1.
- Live axe scans at 390 px for `/`, `/demo`, `/privacy`, `/terms`, and
  `/missing` reported zero serious or critical violations. No route had a
  console error or horizontal overflow.
- `npm run lint`, `npm exec tsc -- --noEmit`, `npm test`, and `npm run build`
  all passed. The build produced `dist/site` and the MV3 ZIP. `npm ci` reported
  zero vulnerabilities.

## Missed leverage

No additional AI, import, export, or sync feature is implied by the available
scope. CSV export is present and tested. An AI feature would be decorative for
this local capture-and-review tool; no provider keys are embedded.

## What would make this perfect

Make the shared How-it-works link navigate to the actual landing section from
every route, add observable claims/tests for the exact privacy/data-scope
promises (or remove them), and change the review control to a result-naming
verb. Then repeat this complete cold-context audit and link crawl.
