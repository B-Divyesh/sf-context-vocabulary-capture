# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-29

**Candidate:** `d45b2a9d71d46f93593bab8412dc709f3a757a2f`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Method:** fresh Chromium contexts at 390 × 844 and 1440 × 900, a separate
clean clone, live request/storage logs, and the shipped tests. No product code
was changed. `.factory/brief.json` is absent, so the README, implementation,
and `.factory/design.md` were the available scope sources.

## Verdict

**FAIL.** The cold first screen is clear, the main demo path works, every
listed claim test passes, and the site is structurally and visually sound.
However, demo changes survive an ordinary exit through the site header even
though Privacy says they are discarded when the visitor leaves. That is a
blocking sandbox-lifecycle failure and an unlisted live claim. Four remaining
headings also violate the supplied plain-words rules. PASS requires zero
findings.

## 30-second cold read

Before scrolling at both widths, I could answer all three required questions:

- **What it does:** saves a phrase with the source sentence where it appeared,
  for later review.
- **For whom:** language learners reading web pages.
- **What to click first:** **Try it with sample data**; the adjacent sentence
  says it opens sample phrases ready to review.

At 390 px the full headline, audience sentence, primary action, action result,
and all three privacy/offline/account facts were visible. The page had one h1,
no horizontal overflow, and no console or page error. This gate passes.

## Findings

### BLOCKING — F-4-1: Demo changes survive leaving, contrary to the Privacy page

- **Exact quote/location:** `/privacy` says **“The sample demo uses separate
  local storage and is discarded when you leave it.”** In a fresh live context
  I opened `/demo`, clicked **Mark phrase as remembered**, and confirmed the
  due phrase changed from *quietly held* to *recoger el hilo*. I then used the
  header’s **Privacy** link. The demo banner disappeared, but both
  `demo:keep-the-sentence:vault` and `demo:keep-the-sentence:device-key`
  remained. Returning with the header’s **Demo** link still showed *recoger el
  hilo*, proving the changed demo vault had not been discarded. In code,
  `clearVault('demo:')` runs only for links carrying `data-exit-demo`; the
  ordinary header links do not carry it.
- **Why this fails:** the visitor has visibly left demo mode, yet the demo
  state survives. This contradicts the privacy sentence and the demo-sandbox
  rule that leaving demo mode discards demo data. The discard promise also has
  no exact entry in `.factory/claims.json`; `demo-sandbox` promises only that
  sample data is separate from real data and tests only **Start for real**.
- **Concrete fix:** clear the demo namespace on every transition from demo to
  a non-demo route, including header links and browser/page exit, or keep the
  demo entirely in ephemeral session/in-memory storage. Add a
  `demo-discard-on-exit` claim and a tagged test that changes a sample, exits
  through Privacy, returns to Demo, and sees the original first phrase. Keep a
  seeded real vault byte-for-byte unchanged throughout.

### MINOR — F-4-2: The How-it-works h2 is a slogan, not a section name

- **Exact quote/location:** landing `/#how` h2: **“Keep reading. Keep the
  source.”**
- **Why this fails:** heard by itself in a screen-reader heading list, the two
  imperatives do not identify the three-step section. The informative **How it
  works** label is only a paragraph, not the heading.
- **Concrete fix:** use **“Save and review a phrase in three steps.”** as the
  h2. Keep **How it works** as the short eyebrow if desired.

### MINOR — F-4-3: The privacy section label does not name its content

- **Exact quote/location:** landing privacy section label: **“What it does not
  do”**. The section actually describes local storage fields and CSV export.
- **Why this fails:** “it” is ambiguous out of context, and the copy below
  states what the product does rather than what it does not do.
- **Concrete fix:** rename the label **“Privacy and data export”**, or replace
  the body with explicit, tested non-actions.

### MINOR — F-4-4: The README demo heading is unclear out of context

- **Exact quote/location:** README heading: **“Try it”**.
- **Why this fails:** a headings-only scan does not say what can be tried. It
  relies on the reader retaining the preceding product name.
- **Concrete fix:** rewrite it as **“Try the sample demo”**.

### MINOR — F-4-5: The 404 h1 uses a notebook metaphor

- **Exact quote/location:** live unknown-route h1: **“This page is not in the
  notebook.”**
- **Why this fails:** the product has no notebook concept elsewhere, so the
  visitor must decode brand mood before learning that the page is missing.
  This conflicts with the explicit no-metaphor rule for headings.
- **Concrete fix:** rewrite it as **“This page could not be found.”** Keep the
  existing home action and visual treatment.

## Copy audit

The live landing copy matched the candidate and the committed audit. Every
landing and README unit is at most 22 words; no banned marketing adjective was
found. The tables include headings, actions, facts, states, and alt text so the
non-sentence flags are visible too.

### Landing sentences

| Words | Text |
| ---: | --- |
| 6 | Save phrases with their source sentence. |
| 15 | For language learners reading web pages who want to remember a phrase and its context. |
| 6 | Open sample phrases ready to review. |
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

### Landing headings, facts, actions, states, and alt text

| Words | Text | Result |
| ---: | --- | --- |
| 3 | Skip to content | Pass |
| 7 | Keep the Sentence — save phrases in context | Pass |
| 3 | Keep the Sentence | Pass |
| 1 | Demo | Pass |
| 3 | How it works | Pass |
| 1 | Privacy | Pass |
| 4 | A local browser extension | Pass |
| 5 | Try it with sample data | Pass |
| 6 | Saved phrases stay on your device | Pass |
| 4 | Works without an account | Pass |
| 4 | Review saved phrases offline | Pass |
| 19 | A blank open book, a bookmark, a flashcard, and halftone dots show a saved phrase beside its source sentence. | Pass |
| 4 | A sentence stays attached | Pass |
| 4 | Your phrases to review | Pass |
| 2 | Export CSV | Pass |
| 3 | Try sample phrases | Pass |
| 2 | Saved phrases | Pass |
| 2 | 0 total | Pass |
| 3 | How it works | Pass |
| 5 | Keep reading. Keep the source. | F-4-2 |
| 5 | What it does not do | F-4-3 |
| 3 | Install the extension | Pass |
| 8 | Capture phrases from regular web pages in Chromium. | Pass |
| 3 | Download extension ZIP | Pass |
| 7 | Privacy · Terms · Built by Param Factory · v1.0.0 | Pass |
| 1 | Terms | Pass |

### README headings and sentences

| Words | Text | Result |
| ---: | --- | --- |
| 3 | Keep the Sentence | Pass |
| 17 | Keep the Sentence is a local browser extension for language learners reading regular web pages in Chromium. | Pass |
| 20 | Select a phrase, save nearby sentences and its source link, write your own meaning, and review it later in context. | Pass |
| 12 | It saves a selected phrase with nearby sentences and its source link. | Pass |
| 2 | Try it | F-4-4 |
| 11 | Open /?demo=1 after starting the site, or visit the live demo. | Pass |
| 11 | It loads three sample phrases in a separate demo: storage namespace. | Pass |
| 13 | The banner can reset the samples or discard them and start for real. | Pass |
| 3 | Install the extension | Pass |
| 3 | Run the build. | Pass |
| 6 | The packaged extension is at dist/site/downloads/keep-the-sentence-extension.zip. | Pass |
| 5 | Download and extract the ZIP. | Pass |
| 6 | Open your Chromium browser’s extensions page. | Pass |
| 4 | Turn on Developer mode. | Pass |
| 8 | Choose Load unpacked and select the extracted folder. | Pass |
| 16 | On a web page, select a phrase and choose Keep this sentence from the right-click menu. | Pass |
| 9 | The extension stores encrypted records in browser-local extension storage. | Pass |
| 7 | No account or network service is needed. | Pass |
| 6 | Saved phrases can be reviewed offline. | Pass |
| 13 | Use Export CSV from the popup to move your phrases to another tool. | Pass |
| 4 | Develop, test, and build | Pass |
| 8 | npm run build is the reproducible deployment command. | Pass |
| 12 | The static deploy root is dist/site, where index.html is at the root. | Pass |
| 1 | Privacy | Pass |
| 21 | It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates. | Pass |
| 11 | The extension sends no analytics or product data to any server. | Pass |
| 9 | Read the deployed /privacy and /terms pages for details. | Pass |
| 1 | License | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

Terminology is otherwise stable: **phrase** is the saved vocabulary,
**source sentence/nearby sentences** is its context, **your meaning** is the
learner-written gloss, and **review** is the recall action. All buttons name an
action or result.

## Demo and sandbox verification

- One click from the cold landing opens `/demo` with three realistic English,
  Spanish, and German records, sentence context, source links, and meanings.
- The first demo screen already shows *quietly held* in context. The persistent
  banner contains **Reset demo** and **Start for real**.
- **Mark phrase as remembered** advances to *recoger el hilo*. **Reset demo**
  restores *quietly held* and `3 total`.
- A seeded valid real encrypted vault remained byte-for-byte unchanged during
  review, reset, and **Start for real**. The live request log contained only
  `https://context-vocabulary-capture.sociobot.in`.
- **Start for real** clears the demo records and works as tested. The separate
  ordinary-header exit fails as described in F-4-1.

## Claims verification

All 11 exact commands from `.factory/claims.json` passed independently in a
clean clone at the candidate commit.

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

The landing and README behavior claims map to registered entries. The Privacy
sentence’s general discard-on-leave promise is the one unlisted claim and is
covered by F-4-1.

## Earlier finding history

I read `review-1.md`, `review-2.md`, `review-3.md`, all three polish reports,
and the current handoff. Each earlier finding was checked in the live site and
current code rather than accepted from its repair note.

| Earlier id | Status in this audit | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | An unknown URL returns the structured, CSP-clean 404 with header, footer, metadata, and a home action. |
| F-1-2 | Fixed | Home, Demo, Privacy, Terms, and 404 expose route-specific title, description, canonical, and social metadata. |
| F-1-3 | Fixed | Source-context capture and Chromium-page support have registered, passing built-MV3 tests. |
| F-1-4 | Fixed | The selected/saved vocabulary is consistently called a phrase. |
| F-1-5 | Fixed | The former “review queue,” “capture card,” and “cue” wording is absent. |
| F-1-6 | Fixed | The committed audit includes the rendered landing/README units, correct counts, and a passing mechanical drift test. |
| F-2-1 | Fixed | How it works routes from Demo, Privacy, and Terms to `/#how`; focus and Back restoration pass. |
| F-2-2 | Fixed | `storage-scope` and `no-analytics` are registered and their observable tests pass. |
| F-2-3 | Fixed | The action is **Mark phrase as remembered**. |
| F-3-1 | Fixed | `npm run test:copy` passes against both the clean local build and current live copy. |

The later verification-4 regressions are also fixed: the built extension uses
the selected repeated occurrence, all Axe scans pass in both color schemes,
and stable hero/social assets require revalidation rather than immutable
caching.

## Structure, accessibility, privacy, and quality checks

- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200. An unknown
  path returns the designed 404. Every discovered same-origin link, all three
  sample source links, and the extension ZIP responded successfully.
- Each route has `lang="en"`, one h1, one main, a skip link, consistent
  header/footer, Privacy and Terms links, favicon, meta description, canonical,
  OG/Twitter data, and the expected route title. The social image is 1200 ×
  630; the apple-touch icon is 180 × 180.
- Direct links, History API navigation, Back, route-change heading focus, and
  the polite announcement passed. Reduced motion disables smooth scrolling.
- Independent Axe scans found zero violations at any severity on Home, Demo,
  Privacy, Terms, and an unknown route in light and dark schemes at 390 px and
  desktop. No tested route overflowed or logged an unexpected error.
- The warm paper, ink, cobalt, tangerine, halftone art, serif/sans pairing, and
  offset print shapes match `.factory/design.md` and do not resemble a generic
  gradient-card SaaS template.
- First-load JavaScript is 13,538 bytes (5.35 KB gzip). No third-party font,
  script, tracker, provider key, AI endpoint, or product backend was found.
- From the clean clone: `npm test` passed 8 unit/contract and 22 browser tests;
  `npm run test:copy`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`
  also passed. The build produced `dist/site`, the MV3 extension, and its ZIP.

F-4-5 remains a copy defect on the otherwise functional 404. F-4-1 remains the
only observed privacy/sandbox failure.

## Missed leverage

No additional AI, sync, or import feature is clearly implied by the available
scope. CSV export is present and tested. Generating meanings would be optional
and would weaken the deliberately local workflow unless explicitly requested;
no decorative AI or embedded provider key is present. Because
`.factory/brief.json` is missing, this conclusion is limited to the product
scope stated in the README and implementation.

## What would make this perfect

Discard demo state on every exit path and register/test that promise. Replace
the two landing section labels, the README demo heading, and the 404 metaphor
with the concrete rewrites above. Then rerun every claim command and the full
live suite from fresh contexts; no other product-flow or structural change is
indicated by this review.
