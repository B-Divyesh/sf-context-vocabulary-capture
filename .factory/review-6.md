# Adversarial first-read review 6 — FAIL

**Reviewed:** 2026-08-29

**Candidate:** `4a928b6c347a5e24c3aa2ae585947b5f8b974896`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Method:** cold Chromium contexts at 390 × 844 and 1440 × 900, a separate
clean clone, the published extension ZIP, live request and storage logs, every
registered claim command, all-severity Axe scans, and a complete review of the
source and prior review history. No product code was changed.
`.factory/brief.json` is absent, so the README, implementation, and
`.factory/design.md` were the available scope sources.

## Verdict

**FAIL.** The landing page passes the cold read, the one-click demo is useful
and isolated, all 13 registered claims pass, and the site structure is sound.
The published extension nevertheless repeats two findings previously marked
fixed: it promises capture from **“any page”** despite the registered regular-
web-page boundary, and it calls the learner's **“meaning”** a **“cue.”** Those
history regressions are blocking. Two README claims are also absent from the
claims registry, and two additional plain-copy findings remain. PASS requires
zero findings.

## 30-second cold read

Before scrolling at both widths, I understood:

- **What it does:** saves a phrase with its source sentence for later review.
- **For whom:** language learners reading web pages.
- **What to click first:** **Try it with sample data**; the adjacent sentence
  says it opens sample phrases ready to review.

The exact first-screen copy was **“Save phrases with their source sentence.”**,
**“For language learners reading web pages who want to remember a phrase and
its context.”**, and **“Try it with sample data”**. At 390 px, the action
result and all four privacy/account/offline/price facts were visible before
scrolling. There was one h1, no horizontal overflow, and no console or page
error. This blocking comprehension gate passes.

## Findings

### BLOCKING — F-1-3 reopened (F-6-1): The extension again promises capture from “any page”

- **Exact quote/location:** the published extension popup's empty state says
  **“Select a phrase on any page. Choose ‘Keep this sentence’.”** The same text
  is in `entrypoints/popup/main.ts:33` and the committed copy audit. The
  published ZIP contains it in `chunks/popup-BtbTwnWW.js`.
- **Why this fails:** review 1 rejected the former “any page” promise and
  required the supported boundary to be regular web pages in Chromium. The
  current `supported-chromium-pages` claim and test cover only a normal HTTP
  page. Chromium blocks extensions on pages such as `chrome://` and the Chrome
  Web Store, so the broader product instruction is misleading and unlisted.
  This is the earlier finding again, not a new wording preference.
- **Concrete fix:** rewrite the empty state as **“Select a phrase on a regular
  web page. Choose ‘Keep this sentence’.”** Add a copy assertion that rejects
  “any page” in the built extension and keeps the wording aligned with the
  registered `supported-chromium-pages` boundary.

### BLOCKING — F-1-4 reopened (F-6-2): The capture form still calls a meaning a “cue”

- **Exact quote/location:** the published capture dialog labels the field
  **“Your meaning”** but gives it the placeholder **“Write a short cue.”** The
  source is `entrypoints/content.ts:52`; the deployed ZIP contains the same
  string in `content-scripts/content.js`. The landing instructions instead say
  **“Write a short meaning.”**
- **Why this fails:** review 1 required one word for each product concept and
  specifically removed “cue” in favor of “meaning.” The committed terminology
  table still defines the learner-written definition as **“your meaning.”** A
  first-time user must decide whether a cue and a meaning are different inputs.
  The prior finding was only half-fixed and is therefore blocking again.
- **Concrete fix:** change the placeholder to **“Write a short meaning.”** Add
  the built extension's visible copy to the terminology assertion and reject
  “cue” outside historical review documents.

### HIGH — F-6-3: The README makes an unlisted no-network-service claim

- **Exact quote/location:** README, install section: **“No account or network
  service is needed.”**
- **Why this fails:** `no-account` lists and tests only the account half.
  `offline-review` proves that an already saved phrase can be reviewed offline,
  while `local-only` and `no-analytics` observe request destinations; none is
  an exact claim that every stated workflow needs no network service. The
  claims contract requires this separate promise to have its own entry and
  observable test.
- **Concrete fix:** rewrite it as **“No account is needed.”** If the broader
  promise is intended, add `no-network-service` to `claims.json` and one tagged
  test that captures, reviews, and exports a phrase with product-service
  requests blocked.

### HIGH — F-6-4: “Reproducible deployment” is an unlisted and imprecise README claim

- **Exact quote/location:** README, development section: **“`npm run build` is
  the reproducible deployment command.”** There is no corresponding
  `claims.json` entry.
- **Why this fails:** “reproducible” is a result a maintainer can rely on, but
  the repository does not define or test it. Two consecutive clean-clone
  builds produced the same site JavaScript hash but different extension ZIP
  hashes: `7f6158b9…` then `f6b6a386…`. The archive contents matched, indicating
  packaging metadata rather than source drift, but the public wording does not
  state that narrower meaning.
- **Concrete fix:** write **“Run `npm run build` to create `dist/site` and the
  extension ZIP.”** If byte-reproducible output is intended, normalize archive
  metadata and add a registered test that compares two clean builds.

### MINOR — F-6-5: The landing page gives saved phrases a second name

- **Exact quote/location:** landing privacy section: **“Records store a
  phrase, nearby text, source title and link, language, your meaning, and review
  details. Export your records as CSV.”** Elsewhere the same stored/exported
  items are consistently **“saved phrases.”**
- **Why this fails:** the committed terminology table says the saved collection
  is **“saved phrases,”** but these two sentences introduce “records.” A cold
  visitor has to infer whether records are another object or an export format.
- **Concrete fix:** use **“Each saved phrase includes nearby text, its source
  title and link, its language, your meaning, and review dates. Export saved
  phrases as CSV.”**

### MINOR — F-6-6: The README opening has an ambiguous pronoun

- **Exact quote/location:** README opening: **“Select a phrase, save nearby
  sentences and its source link, write your own meaning, and review it later in
  context.”**
- **Why this fails:** the nearest noun before “its” is the plural “sentences,”
  while the intended owner is either the phrase or page. The reader must
  backtrack to understand what the link identifies.
- **Concrete fix:** write **“Select a phrase, save it with nearby sentences and
  the page link, add your meaning, and review it later in context.”**

## Copy audit

Counts use whitespace-delimited tokens containing a letter or number. No unit
exceeds 22 words and no banned marketing adjective appears. F-6-1 and F-6-2
cover extension copy found by the historical check; the required landing and
README audit follows.

### Landing-page sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 6 | Save phrases with their source sentence. | Pass |
| 15 | For language learners reading web pages who want to remember a phrase and its context. | Pass |
| 6 | Open sample phrases ready to review. | Pass |
| 7 | Review a phrase with its source sentence. | Pass |
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
| 16 | Records store a phrase, nearby text, source title and link, language, your meaning, and review details. | F-6-5 |
| 5 | Export your records as CSV. | F-6-5 |
| 10 | Download the ZIP, then load its extracted folder in Chromium. | Pass |
| 5 | Download and extract the ZIP. | Pass |
| 4 | Open chrome://extensions in Chromium. | Pass |
| 4 | Turn on Developer mode. | Pass |
| 3 | Choose Load unpacked. | Pass; quoted Chromium control |
| 4 | Select the extracted folder. | Pass |
| 5 | Save phrases with source sentences. | Pass |
| 3 | Review them later. | Pass |

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
| 4 | Review saved phrases offline | Pass |
| 5 | Free to download and use | Pass |
| 19 | A blank open book, a bookmark, a flashcard, and halftone dots show a saved phrase beside its source sentence. | Pass |
| 2 | Phrase review | Pass |
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

All landing headings name their sections, and all landing product actions name
their result. There are no mood headings, generic marketing slogans, or
metaphors in this surface.

### README headings and sentences

| Words | Text | Result |
| ---: | --- | --- |
| 3 | Keep the Sentence | Pass |
| 17 | Keep the Sentence is a local browser extension for language learners reading regular web pages in Chromium. | Pass |
| 20 | Select a phrase, save nearby sentences and its source link, write your own meaning, and review it later in context. | F-6-6 |
| 4 | Try the sample demo | Pass |
| 11 | Open /?demo=1 after starting the site, or visit the live demo. | Pass |
| 10 | It keeps three sample phrases separate from your saved phrases. | Pass |
| 11 | The banner can reset the samples, and leaving Demo discards them. | Pass |
| 3 | Install the extension | Pass |
| 7 | It is free to download and use. | Pass |
| 3 | Run the build. | Pass |
| 6 | The packaged extension is at dist/site/downloads/keep-the-sentence-extension.zip. | Pass |
| 5 | Download and extract the ZIP. | Pass |
| 6 | Open your Chromium browser’s extensions page. | Pass |
| 4 | Turn on Developer mode. | Pass |
| 8 | Choose Load unpacked and select the extracted folder. | Pass |
| 16 | On a web page, select a phrase and choose Keep this sentence from the right-click menu. | Pass |
| 12 | The extension encrypts your saved phrases and stores them only in Chromium. | Pass |
| 7 | No account or network service is needed. | F-6-3 |
| 6 | Saved phrases can be reviewed offline. | Pass |
| 13 | Use Export CSV from the popup to move your phrases to another tool. | Pass |
| 4 | Develop, test, and build | Pass |
| 8 | npm run build is the reproducible deployment command. | F-6-4 |
| 12 | The static deploy root is dist/site, where index.html is at the root. | Pass |
| 1 | Privacy | Pass |
| 21 | It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates. | Pass |
| 11 | The extension sends no analytics or product data to any server. | Pass |
| 9 | Read the deployed /privacy and /terms pages for details. | Pass |
| 1 | License | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

## Demo and sandbox verification

**PASS.** A fresh mobile visitor reached `/demo` in one click. Before
scrolling, the page showed the persistent **“Demo — sample data, nothing is
saved”** banner, **Reset demo**, **Start for real**, a populated review card,
the realistic phrase *quietly held*, two source sentences, and its learner
meaning. Three English, Spanish, and German samples were present.

**Mark phrase as remembered** advanced the due phrase to *recoger el hilo*.
**Reset demo** restored *quietly held* and `3 total`. Only
`demo:keep-the-sentence:vault` and
`demo:keep-the-sentence:device-key` existed during the manual flow; **Start for
real** removed both and returned to an empty real board. The tagged discard
test separately seeded a valid real encrypted vault, changed a sample, exited
through Privacy, and confirmed the real values were byte-for-byte unchanged.
The live request log contained only the product origin.

## Claims verification

Every exact command in `.factory/claims.json` was run independently from a
fresh clone at the reviewed commit. All 13 registered claims passed:

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

There is no untested registered claim. The unlisted broad page-support and
README claims are F-6-1, F-6-3, and F-6-4.

## Earlier finding history

Every earlier `review-*.md`, `polish-*.md`, and the prior handoff was read.
The live site JavaScript and CSS match the clean build byte-for-byte, and the
extracted live extension ZIP matches the clean build file-for-file.

| Earlier id | Status now | Fresh evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Unknown live URL returns 404 with shared shell, same-origin CSS, metadata, and no unexpected console error. |
| F-1-2 | Fixed | Home, Demo, Privacy, Terms, and 404 have route-specific title, description, canonical, OG, and Twitter data. |
| F-1-3 | **Regressed — BLOCKING** | Landing says regular pages, but the shipped extension again says **“any page.”** See F-6-1. |
| F-1-4 | **Half-fixed — BLOCKING** | Saved vocabulary uses “phrase,” but the shipped input still changes “meaning” to **“cue.”** See F-6-2. |
| F-1-5 | Fixed | “Review queue” and “capture card” are absent; action/result explanations are direct. |
| F-1-6 | Fixed | The committed copy audit covers rendered landing, README, extension, legal, recovery, and 404 text; its count/coverage test passes live and locally. |
| F-2-1 | Fixed | How it works reaches `/#how` from Demo, Privacy, and Terms; focus, announcement, and Back restoration pass live. |
| F-2-2 | Fixed | Exact storage-scope and no-analytics entries exist and their observable tests pass. |
| F-2-3 | Fixed | Demo and extension use **Mark phrase as remembered**. |
| F-3-1 | Fixed | The mechanical copy audit contains the previously omitted controls and accurate counts. |
| F-4-1 | Fixed | Every tested demo exit removes only `demo:` keys, preserves real data, and reseeds unchanged samples. |
| F-4-2 | Fixed | How-it-works h2 is **Save and review a phrase in three steps.** |
| F-4-3 | Fixed | Landing label is **Privacy and data export**. |
| F-4-4 | Fixed | README heading is **Try the sample demo**. |
| F-4-5 | Fixed | SPA and static 404 h1s say **This page could not be found.** |
| F-5-1 | Fixed | **Free to download and use** is visible on the first screen and the free download claim passes. |
| F-5-2 | Fixed | `npm run lint` passes in the final clean clone with committed evidence present. |
| F-5-3 | Fixed | Preview label is **Phrase review**. |
| F-5-4 | Fixed | Preview h2 is **Review a phrase with its source sentence.** |
| F-5-5 | Fixed | Footer says **Save phrases with source sentences. Review them later.** |
| F-5-6 | Fixed | The generic public illustration-provenance sentence is absent; provenance remains in `design.md`. |
| F-5-7 | Fixed | The repeated README source-context sentence remains removed. |
| F-5-8 | Fixed | README explains sample separation without “storage namespace.” |
| F-5-9 | Fixed | README explains encrypted local storage without “browser-local extension storage.” |

## Structure, accessibility, identity, and quality gates

- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200. An unknown
  route returns the designed 404. Every crawled same-origin link, sample source,
  install guide, and extension ZIP resolved successfully.
- Home uses **Keep the Sentence — save phrases in context**; Demo, Privacy,
  Terms, and 404 use route-specific product titles. Every route has one h1,
  `lang="en"`, one main landmark, a skip link, description, canonical, OG and
  Twitter metadata, favicon, consistent header/footer, Privacy, and Terms.
- Deep links, History API navigation, Back, route-change heading focus, and the
  polite announcement passed. The live 23-test route/copy suite passed.
- Axe reported zero violations at any severity on Home, Demo, Privacy, Terms,
  and 404 in light and dark schemes at 390 px and desktop. Touch targets,
  keyboard activation, reduced motion, and horizontal overflow checks passed.
- The warm paper, ink, cobalt, tangerine, serif/sans, halftone reading-margin
  system follows `.factory/design.md`. It is distinct from a generic centered
  gradient/card SaaS template, and its original hero art has useful alt text.
- Clean-clone `npm run lint`, `npx tsc --noEmit`, `npm test` (8 unit and 31
  browser tests), and `npm run build` passed. Build output includes `dist/site`
  and the MV3 extension. Initial site JavaScript is 16.58 KB, 6.14 KB gzip.
- No third-party font/script, tracker, runtime AI endpoint, provider key, or
  Azure endpoint was found. Live demo requests were same-origin only.

## Missed leverage

No additional AI, sync, or import feature is clearly required by the available
scope. CSV export is present and tested. Automatic meaning generation would be
optional, would send selected reading text away from the local workflow, and
is not needed for the core capture/review job. No decorative AI or embedded
provider key is present. This conclusion is limited because
`.factory/brief.json` is absent.

## What would make this perfect

Restore the regular-web-page boundary inside the extension, use **meaning** in
the capture field, remove or register the two unsupported README claims, use
**saved phrases** instead of **records** on the landing page, and remove the
README opening's ambiguous pronoun. Then rerun every claim command, the full
clean-clone quality suite, and the complete live mobile/desktop review. Nothing
else remains from this pass.
