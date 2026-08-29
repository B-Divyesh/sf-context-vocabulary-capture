# Adversarial first-read review 5 — FAIL

**Reviewed:** 2026-08-29

**Candidate:** `2358365c8611d4f30627d9e2ad3fb852cb5193f6`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Method:** cold Chromium contexts at 390 × 844 and 1440 × 900, a separate
clean clone, live request and storage logs, every registered claim command,
the complete live route/copy/axe suite, and a source review. No product code
was changed. `.factory/brief.json` is absent, so the README, implementation,
and `.factory/design.md` were the available scope sources.

## Verdict

**FAIL.** The job, audience, and first action are clear; the one-click demo is
realistic and isolated; every registered claim passes; and the live routes are
sound. There are still nine findings. One earlier terminology finding was only
half-fixed and is blocking. The first screen also omits the required price
fact, the committed repository no longer passes its lint command, and six
other copy units remain redundant, technical, generic, or metaphorical. PASS
requires zero findings.

## 30-second cold read

Before scrolling, at both widths, I understood:

- **What it does:** a Chromium extension saves a selected phrase with the
  sentence around it so I can review the phrase later.
- **For whom:** language learners reading web pages.
- **What to click first:** **Try it with sample data**; the adjacent line says
  it opens sample phrases ready to review.

The exact first-screen copy was **“Save phrases with their source sentence.”**,
**“For language learners reading web pages who want to remember a phrase and
its context.”**, and **“Try it with sample data”**. At 390 px, all three facts
and the action result were visible before scrolling. There was one h1, no
horizontal overflow, and no console error. This blocking comprehension gate
passes.

## Findings

### BLOCKING — F-1-4 reopened (F-5-5): The footer still changes the object being saved

- **Exact quote/location:** landing/footer, **“Save source sentences.”**
- **Why this matters:** the rest of the product consistently says the saved
  object is a phrase and that source sentences are its context. This footer
  instead says the sentence itself is the saved object. Review 1 required one
  public word for the saved item, and the polish reports marked that finding
  fixed without correcting this line. The history rule therefore makes the
  half-fixed finding blocking again.
- **Concrete fix:** rewrite the footer line as **“Save phrases with source
  sentences. Review them later.”**

### HIGH — F-5-1: The first screen does not disclose the price

- **Exact location:** the three hero facts are **“Saved phrases stay on your
  device”**, **“Works without an account”**, and **“Review saved phrases
  offline”**. Neither the first screen nor the README says whether the
  extension is free or paid. `MIT` identifies the source licence, not the
  price offered to a visitor.
- **Why this matters:** the supplied first-screen contract requires short
  privacy, offline, and price facts. A visitor considering a browser install
  should not have to infer cost from the absence of a checkout.
- **Concrete fix:** add **“Free to download and use”** as a hero fact. Extend
  the registered download claim to say that a fresh visitor can download the
  ZIP without an account or payment, and assert that outcome in its existing
  tagged test.

### HIGH — F-5-2: The committed clean clone fails `npm run lint`

- **Exact location/evidence:** `npm run lint` at the reviewed commit reports
  74 errors in
  `.factory/verification-evidence-7/live-files/assets/index-Dzjv1zer.js`.
  The prior handoff says lint passed for candidate `402a96e`; commit `2358365`
  subsequently added the downloaded minified bundle, while `eslint.config.js`
  still ignores only `.wxt`, `dist`, `node_modules`, and `test-results`.
- **Why this matters:** the repository's own quality command is not
  reproducible at the handed-off HEAD. A maintainer running the advertised
  clean-clone checks gets a failure caused by committed verification output,
  not source.
- **Concrete fix:** exclude generated verification mirrors such as
  `.factory/verification-evidence-*/live-files/**` from ESLint, or do not
  commit fetched bundles. Run lint again from a clean clone after all evidence
  files are committed.

### MINOR — F-5-3: A section label is a slogan rather than a section name

- **Exact quote/location:** landing preview label, **“A sentence stays
  attached”**.
- **Why this matters:** it does not name the review section when heard in a
  headings/landmarks scan, and the passive phrase leaves “attached to what?”
  implicit.
- **Concrete fix:** rewrite it as **“Phrase review”**.

### MINOR — F-5-4: A landing heading uses a metaphor

- **Exact quote/location:** landing preview h2, **“Review the phrase where you
  met it.”**
- **Why this matters:** a reader does not literally meet a phrase. The heading
  makes the visitor decode the metaphor instead of naming the source-context
  review shown below it.
- **Concrete fix:** rewrite it as **“Review a phrase with its source
  sentence.”**

### MINOR — F-5-6: The public provenance line is generic and unlisted

- **Exact quote/location:** landing/footer, **“Illustration generated for this
  product.”**
- **Why this matters:** it is unchanged by the product's purpose and gives a
  visitor no usable product information. It is also a factual public claim
  with no `.factory/claims.json` entry or sandbox test. Asset provenance is
  already recorded in `.factory/design.md`.
- **Concrete fix:** remove the public footer sentence. Keep the detailed
  provenance in `.factory/design.md`; do not add a visitor-facing claim solely
  to describe the build process.

### MINOR — F-5-7: The README repeats the preceding workflow without adding information

- **Exact quote/location:** README opening standalone sentence, **“It saves a
  selected phrase with nearby sentences and its source link.”** The sentence
  immediately before it already says **“Select a phrase, save nearby sentences
  and its source link…”**.
- **Why this matters:** the supplied copy rule requires every sentence to add
  information a reader can use. This repetition delays the sample-demo path.
- **Concrete fix:** delete the repeated sentence.

### MINOR — F-5-8: The README uses storage implementation jargon

- **Exact quote/location:** README demo section, **“It loads three sample
  phrases in a separate `demo:` storage namespace.”**
- **Why this matters:** “storage namespace” is an implementation term, not an
  outcome a language learner needs to understand.
- **Concrete fix:** rewrite it as **“It keeps three sample phrases separate
  from your saved phrases.”**

### MINOR — F-5-9: The README uses a second storage implementation term

- **Exact quote/location:** README install section, **“The extension stores
  encrypted records in browser-local extension storage.”**
- **Why this matters:** “browser-local extension storage” makes a simple
  privacy outcome sound like an API description.
- **Concrete fix:** rewrite it as **“The extension encrypts your saved phrases
  and stores them only in Chromium.”**

## Copy audit

Word counts follow the repository checker: whitespace-delimited tokens that
contain a letter or number. No unit exceeds 22 words and no banned marketing
adjective appears. The semantic flags are identified by finding ID below.

### Landing-page sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 6 | Save phrases with their source sentence. | Pass |
| 15 | For language learners reading web pages who want to remember a phrase and its context. | Pass |
| 6 | Open sample phrases ready to review. | Pass |
| 7 | Review the phrase where you met it. | F-5-4 |
| 3 | Nothing due today. | Pass |
| 9 | Saved phrases will appear here after you capture one. | Pass |
| 4 | No saved phrases yet. | Pass |
| 8 | Save and review a phrase in three steps. | Pass |
| 3 | Select the phrase. | Pass |
| 8 | Choose “Keep this sentence” from the page menu. | Pass |
| 4 | Write a short meaning. | Pass |
| 10 | Your saved phrase includes nearby sentences and the source link. | Pass |
| 3 | Review today’s phrases. | Pass |
| 10 | Try the phrase in context before you reveal your meaning. | Pass |
| 7 | Your saved phrases stay private and local. | Pass |
| 16 | Records store a phrase, nearby text, source title and link, language, your meaning, and review details. | Pass |
| 5 | Export your records as CSV. | Pass |
| 10 | Download the ZIP, then load its extracted folder in Chromium. | Pass |
| 5 | Download and extract the ZIP. | Pass |
| 4 | Open chrome://extensions in Chromium. | Pass |
| 4 | Turn on Developer mode. | Pass |
| 3 | Choose Load unpacked. | Pass |
| 4 | Select the extracted folder. | Pass |
| 3 | Save source sentences. | F-5-5 |
| 3 | Review them later. | Pass after F-5-5 rewrite |
| 5 | Illustration generated for this product. | F-5-6 |

### Landing headings, facts, controls, links, states, and alt text

| Words | Text | Result |
| ---: | --- | --- |
| 3 | Skip to content | Pass |
| 7 | Keep the Sentence — save phrases in context. | Pass |
| 3 | Keep the Sentence | Pass |
| 1 | Demo | Pass |
| 3 | How it works | Pass |
| 1 | Privacy | Pass |
| 4 | A local browser extension | Pass |
| 5 | Try it with sample data | Pass |
| 6 | Saved phrases stay on your device | Pass |
| 4 | Works without an account | Pass |
| 4 | Review saved phrases offline | F-5-1: price fact absent |
| 19 | A blank open book, a bookmark, a flashcard, and halftone dots show a saved phrase beside its source sentence. | Pass |
| 4 | A sentence stays attached | F-5-3 |
| 4 | Your phrases to review | Pass |
| 2 | Export CSV | Pass |
| 3 | Try sample phrases | Pass |
| 2 | Saved phrases | Pass |
| 2 | 0 total | Pass |
| 4 | Privacy and data export | Pass |
| 3 | Install the extension | Pass |
| 8 | Capture phrases from regular web pages in Chromium. | Pass |
| 2 | Load unpacked | Pass; quoted Chromium control |
| 4 | Read the install guide | Pass |
| 3 | Download extension ZIP | Pass |
| 7 | Privacy · Terms · Built by Param Factory · v1.0.0 | Pass |
| 1 | Terms | Pass |

### README headings and prose

| Words | Text | Result |
| ---: | --- | --- |
| 3 | Keep the Sentence | Pass |
| 17 | Keep the Sentence is a local browser extension for language learners reading regular web pages in Chromium. | Pass |
| 20 | Select a phrase, save nearby sentences and its source link, write your own meaning, and review it later in context. | Pass |
| 12 | It saves a selected phrase with nearby sentences and its source link. | F-5-7 |
| 4 | Try the sample demo | Pass |
| 11 | Open /?demo=1 after starting the site, or visit the live demo. | Pass |
| 11 | It loads three sample phrases in a separate demo: storage namespace. | F-5-8 |
| 11 | The banner can reset the samples, and leaving Demo discards them. | Pass |
| 3 | Install the extension | Pass |
| 3 | Run the build. | Pass |
| 6 | The packaged extension is at dist/site/downloads/keep-the-sentence-extension.zip. | Pass |
| 5 | Download and extract the ZIP. | Pass |
| 6 | Open your Chromium browser’s extensions page. | Pass |
| 4 | Turn on Developer mode. | Pass |
| 8 | Choose Load unpacked and select the extracted folder. | Pass |
| 16 | On a web page, select a phrase and choose Keep this sentence from the right-click menu. | Pass |
| 9 | The extension stores encrypted records in browser-local extension storage. | F-5-9 |
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

Terminology is otherwise consistent: **phrase** is the saved vocabulary,
**source sentence/nearby sentences** is its context, **your meaning** is the
learner-written gloss, and **review** is the recall action. Buttons name their
result. F-5-5 is the one inconsistent saved-object sentence.

## Demo and sandbox verification

**PASS.** From a fresh mobile context, one click on **Try it with sample data**
opened `/demo`. Before scrolling, the screen showed the persistent **“Demo —
sample data, nothing is saved”** banner, **Reset demo**, **Start for real**,
the review heading, and the realistic *quietly held* record with two source
sentences and a learner meaning.

The demo created only `demo:keep-the-sentence:device-key` and
`demo:keep-the-sentence:vault`. **Mark phrase as remembered** advanced to
*recoger el hilo*; **Reset demo** restored *quietly held*. The live
`@claim:demo-discard-on-exit` flow seeded a valid real encrypted vault, changed
the sample, exited through Privacy, and confirmed that the real bytes were
unchanged and the next demo was reset. The request log contained only the
product origin and its same-origin JS, CSS, and hero image.

## Claims verification

Every exact command in `.factory/claims.json` was run independently from the
clean clone. All 13 passed:

| Claim id | Result |
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

The behavior and privacy claims on the landing page and in the README map to
those entries. The only unlisted factual public sentence is **“Illustration
generated for this product.”**; that is F-5-6. There is no untested registered
claim.

## Earlier finding history

Every earlier review, polish report, and the prior handoff was read. The live
bundle and stylesheet match the clean build byte-for-byte, so the source and
deployed checks below cover the same implementation.

| Earlier id | Status now | Fresh evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Unknown live URL returns 404 with shared shell, same-origin CSS, metadata, and no unexpected console error. |
| F-1-2 | Fixed | Home, Demo, Privacy, Terms, and 404 have route-specific title, description, canonical, OG, and Twitter data. |
| F-1-3 | Fixed | Source-context and supported-Chromium claims are registered and their real MV3 tests pass. |
| F-1-4 | **Half-fixed — BLOCKING** | Most copy now says phrase, but the footer still instructs visitors to **“Save source sentences.”** See F-5-5. |
| F-1-5 | Fixed | The earlier “review queue,” “capture card,” and “cue” wording is absent. |
| F-1-6 / F-3-1 | Fixed | The committed audit contains every rendered landing/README unit; its mechanical count and coverage test passes. |
| F-2-1 | Fixed | How it works reaches `/#how` from Demo, Privacy, and Terms; focus, announcement, and Back restoration pass live. |
| F-2-2 | Fixed | Exact storage scope and no-analytics claims are registered and pass. |
| F-2-3 | Fixed | The action is **Mark phrase as remembered** in both demo and extension. |
| F-4-1 | Fixed | All tested demo exits remove only `demo:` keys, preserve real data, and reseed the samples. |
| F-4-2 | Fixed | The How-it-works h2 is **“Save and review a phrase in three steps.”** |
| F-4-3 | Fixed | The section label is **“Privacy and data export.”** |
| F-4-4 | Fixed | The README heading is **“Try the sample demo.”** |
| F-4-5 | Fixed | Both SPA and static 404 h1s say **“This page could not be found.”** |

F-5-2 is a later repository regression introduced by committed evidence.
F-5-3, F-5-4, and F-5-6 through F-5-9 are semantic copy issues found by this
from-scratch pass; the copy-audit coverage gate can pass while those listed
strings remain weak.

## Structure, accessibility, visual identity, and quality gates

- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200. An unknown
  path returns the designed 404. All crawled same-origin links, three sample
  sources, the install guide, and the extension ZIP respond successfully.
- Every checked route has `lang="en"`, one h1, one main, a skip link,
  consistent header/footer, Privacy and Terms links, route-specific metadata,
  canonical/OG/Twitter data, favicon, and a correctly sized 1200 × 630 social
  image. `robots.txt` and `sitemap.xml` list the public routes.
- Deep links, History API navigation, Back, route-change focus, and the polite
  announcement pass. The live 22-test site suite also reports zero serious or
  critical axe findings in light and dark schemes at desktop and 390 px.
  Touch targets and horizontal overflow checks pass. Reduced-motion CSS
  disables smooth scrolling and hover movement.
- The warm paper, black ink, cobalt/tangerine marks, serif/sans pairing,
  halftone reading-margin art, and offset print shapes match
  `.factory/design.md`. The site does not resemble a generic centered-gradient
  SaaS template. The hero has useful alt text and no required text in the
  image.
- `npm test`: PASS — 8 Vitest and 30 Playwright tests. `npm run test:copy`:
  PASS. `npx tsc --noEmit`: PASS. `npm run build`: PASS; it produced
  `dist/site`, the MV3 extension, and the install ZIP. Initial site JavaScript
  is 16.61 KB (6.17 KB gzip). `npm run lint`: FAIL as F-5-2 records.

## Missed leverage

No extra AI, sync, or import feature is clearly required by the available
scope. CSV export is present and tested. Automatic meaning generation would
be optional rather than part of the core capture/review job, and would weaken
the local-only workflow unless the user explicitly chose it. No AI runtime,
provider endpoint, embedded provider key, tracker, or third-party font/script
was found. This conclusion is necessarily limited because
`.factory/brief.json` is absent.

## What would make this perfect

Add and test a plain price fact on the first screen; restore clean-clone lint
after committing verification evidence; replace the two preview slogans with
literal section wording; correct the footer's saved object; remove the generic
public provenance sentence; and simplify the three flagged README sentences.
Then rerun every registered claim command, the full local suite, lint, build,
and the complete live route/copy/accessibility suite from fresh contexts.
