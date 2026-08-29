# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-29
**Live URL:** <https://context-vocabulary-capture.sociobot.in>
**Method:** clean checkout, fresh Chromium contexts at 390 × 844 and 1440 × 900, live request logs, and shipped tests. No product code was changed.

## Verdict

**FAIL.** The live product is clear, tryable, and locally scoped in the tested flow. All registered claims pass. The required committed copy-audit evidence has regressed: it omits visible landing controls and reports several incorrect counts. This reopens F-1-6; under the required history rule, it is blocking.

## 30-second cold read

Before scrolling at both widths, the site answered all three questions:

- **What it does:** saves a phrase with its source sentence for later review.
- **For whom:** language learners reading real web pages.
- **First click:** **Try it with sample data**, which says it will show phrases ready to review immediately.

This passes. At 390 px there is one h1, no horizontal overflow, and no page or console error. The paper, ink, cobalt, and halftone reading-margin art is distinct from a generic SaaS template and follows `design.md`.

## Findings

### BLOCKING — F-1-6 (this round’s F-3-1): The required copy audit is again incomplete and inaccurate

- **Exact location/evidence:** `.factory/copy-audit.md` says it covers “Landing labels, controls, facts, and alt text,” but the live landing’s visible **“Export CSV”** and **“Try sample phrases”** controls are absent. The audit also gives incorrect counts for visible text: **“A local browser extension”** is 4 words, not 5; **“Write a short meaning.”** is 4, not 5; **“Review today’s phrases.”** is 3, not 4; and **“Saved phrases”** is 2, not 3. Its README/privacy row **“It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates.”** is 21 words, not 20.
- **Why this fails:** review 1 required a complete, correct audit as proof that plain copy will not regress. `polish-1.md` and `polish-2.md` record F-1-6 as fixed, but the committed evidence does not substantiate that status. This is the same prior finding and is blocking under the history check.
- **Concrete fix:** regenerate `.factory/copy-audit.md` from the rendered landing and README. Include every visible heading, sentence, fact, button, link, empty state, footer line, and meaningful alt text; correct the counts above; then add a repeatable extraction/check command to prevent drift.

## Copy audit performed in this review

All landing and README prose is at or below 22 words. No banned marketing adjective, unexplained jargon, inconsistent item noun, mood-only heading, or non-result-naming product button was found. **Phrase** is consistently the saved vocabulary. The incomplete committed audit is the finding above.

### Landing sentences

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
| 3 | Select the phrase. |
| 8 | Choose “Keep this sentence” from the page menu. |
| 4 | Write a short meaning. |
| 10 | Your saved phrase includes nearby sentences and the source link. |
| 3 | Review today’s phrases. |
| 10 | Try the phrase in context before you reveal your meaning. |
| 7 | Your saved phrases stay private and local. |
| 16 | Records store a phrase, nearby text, source title and link, language, your meaning, and review details. |
| 5 | Export your records as CSV. |
| 4 | Download the extension package. |
| 16 | Your browser will ask you to load it as an unpacked extension during this first release. |
| 3 | Save source sentences. |
| 3 | Review them later. |
| 5 | Illustration generated for this product. |

### Landing headings, facts, controls, and alt text

These are not prose sentences but were checked for plain wording and count.

| Words | Text |
| ---: | --- |
| 3 | Skip to content |
| 4 | A local browser extension |
| 6 | Try it with sample data |
| 6 | Saved phrases stay on your device |
| 4 | Works without an account |
| 4 | Review saved phrases offline |
| 4 | A sentence stays attached |
| 4 | Your phrases to review |
| 2 | Export CSV |
| 3 | Try sample phrases |
| 2 | Saved phrases |
| 3 | How it works |
| 5 | What it does not do |
| 3 | Install the extension |
| 8 | Capture phrases from regular web pages in Chromium |
| 3 | Download extension ZIP |
| 19 | A blank open book, a bookmark, a flashcard, and halftone dots show a saved phrase beside its source sentence. |

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
| 21 | It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates. |
| 12 | The extension sends no analytics or product data to any server. |
| 9 | Read the deployed `/privacy` and `/terms` pages for details. |
| 1 | MIT. |
| 2 | See [LICENSE](LICENSE). |

## Demo and sandbox verification

**PASS.** A fresh `/?demo=1` immediately showed a realistic review board with three English, Spanish, and German phrases, sentence context, source links, and learner meanings. The persistent banner read **“Demo — sample data, nothing is saved”** and included **Reset demo** and **Start for real**.

**Mark phrase as remembered** advanced from *quietly held* to *recoger el hilo*. **Reset demo** restored *quietly held* and three total records. Start-for-real returned to an empty real board without creating either unprefixed real-storage key; only `demo:keep-the-sentence:vault` and `demo:keep-the-sentence:device-key` existed during the demo. The live request log contained only `https://context-vocabulary-capture.sociobot.in`.

## Claims verification

`.factory/claims.json` has 11 entries. From the clean checkout after `npm ci`, each exact registered command passed. No live landing or README claim-like sentence lacked a relevant registered claim: source context, Chromium-page support, CSV export, local-only storage, no account, offline review, demo separation, AES-GCM storage, data scope, no analytics, and the ZIP download are each covered.

| Claim id | Result |
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

`npm test` passed (4 unit and 16 browser tests), as did `npm run lint`, `npx tsc --noEmit`, and `npm run build`. The build produced `dist/site` and the extension package.

## Earlier finding history

Every prior review, polish record, verification record, and handoff was read. The live site and current source were rechecked rather than accepting an earlier “fixed” marker.

| Earlier id | Status in this audit | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | `/missing` returns a 404 with the CSP-clean shared shell, metadata, header, footer, and home escape. |
| F-1-2 | Fixed | Home, Demo, Privacy, Terms, and 404 have route-specific title, description, canonical, and social metadata. |
| F-1-3 | Fixed | `source-context-capture` and `supported-chromium-pages` are registered and production-extension checks pass. |
| F-1-4 | Fixed | Public copy consistently calls the saved vocabulary a phrase. |
| F-1-5 | Fixed | Earlier internal review/capture wording is replaced by plain learner language. |
| F-1-6 | **Regressed — BLOCKING** | The committed audit omits visible controls and has incorrect counts; see the finding. |
| F-2-1 | Fixed | From Privacy, the How-it-works link reaches `/#how`, focuses the section, announces it, and Back returns focus to the Privacy h1. |
| F-2-2 | Fixed | Storage scope and no-analytics are registered with passing observable tests. |
| F-2-3 | Fixed | The review action is **Mark phrase as remembered**. |

## Structure, accessibility, and visual checks

- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` returned 200; `/missing` returned 404. Every discovered same-origin link, three source pages, and the extension ZIP returned 200.
- The checked public routes have `lang="en"`, a single h1 and main, skip link, focus movement and polite route announcement, consistent header/footer, favicon, description, canonical, OG/Twitter metadata, robots, sitemap, and a styled 404. The 404 resource console line is the expected network error from its HTTP 404 response; no executable-page error occurred.
- Axe found zero violations at every severity on `/`, `/demo`, `/privacy`, `/terms`, and `/missing` at 390 px. No horizontal overflow or unexpected console/page error was observed. Reduced-motion computes `scroll-behavior: auto`.
- The original illustration is supporting art with useful HTML copy, and the visual treatment matches the documented dithered-reading-margin direction.

## Missed leverage

No additional AI feature is implied by this local vocabulary-capture brief; adding one would be decorative. CSV export is present and tested. No provider key or AI runtime call was found. Import or sync is not necessary for the stated individual local-first use case.

## What would make this perfect

Regenerate and mechanically verify the committed copy audit so it contains every rendered landing and README string with correct counts. Then repeat this full cold-context review; no product-flow repair is indicated by this round.
