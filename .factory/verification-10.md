# Save phrases with their source sentence — verification 10

**Work order:** `context-vocabulary-capture-verify-10`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Verified:** 2026-09-06 from a clean checkout. Product code was not changed.

**Implementation candidate:** `cd52ba72f4389a46628b5bdd39ca3708a973b0c8`

**Documentation baseline:** `1ac8da4300a654112fe7b36b391c89e1ce055916`

The documentation baseline adds only reports and evidence after the
implementation candidate. A source diff outside `.factory/` is empty.

## Verdict

**PASS — zero findings of every severity and zero untested claims.**

| Result | Count |
| --- | ---: |
| Findings | 0 |
| Untested claims | 0 |
| Blocker | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Informational product defect | 0 |

The live site and downloaded extension complete the researched job. A learner
can select a phrase on a regular Chromium web page, retain its exact source
context and link, add a meaning, review it offline, and export it as CSV.

## Job, audience, and first action before scrolling

Fresh 1440 × 900 and 390 × 844 Chromium contexts showed all required copy
without scrolling:

- Job: **Save phrases with their source sentence.**
- Audience: language learners reading web pages who want to remember a phrase
  and its context.
- First action: **Try it with sample data.**
- Stated result: **Open sample phrases ready to review.**

The action ended at 553 px on desktop and 519 px on phone. Both layouts had no
horizontal overflow, one h1, one main landmark, `lang="en"`, and no console or
page error. The plain job title, warm paper, cobalt reading marks, serif source
text, and halftone illustration match the product-specific design thesis.

Evidence: [desktop first screen](verification-evidence-10/live-first-screen-desktop.png),
[phone first screen](verification-evidence-10/live-first-screen-phone.png), and
[recorded DOM facts](verification-evidence-10/live-first-read-and-demo.json).

## One-click sample and isolation

One click opened `/demo` with three realistic English, Spanish, and German
phrases. The first phrase was **quietly held**, with its harbour sentence,
source link, language, and meaning **remained still and calm**. The persistent
banner said **Demo — sample data, nothing is saved** and exposed **Reset demo**
and **Start for real**.

Marking the phrase remembered advanced to **recoger el hilo**. Reset restored
**quietly held** and **3 total**. A fresh demo created only these keys:

- `demo:keep-the-sentence:device-key`
- `demo:keep-the-sentence:vault`

The registered exit test seeded an encrypted real vault, changed the sample,
left Demo, and proved that the real vault remained byte-for-byte unchanged.
No real key was created in the fresh manual contexts.

Evidence: [desktop demo](verification-evidence-10/live-demo-desktop.png),
[phone demo](verification-evidence-10/live-demo-phone.png), and the recorded
flow linked above.

## Declared claims

After `npm ci` in a clean checkout at the documentation baseline, every exact
command in `.factory/claims.json` ran independently. All 14 passed. The
contract test also confirms that each ID has exactly one tagged test.

| Claim | Exact command | Result |
| --- | --- | --- |
| `csv-export` | `npm run test:browser -- --grep @claim:csv-export` | PASS |
| `local-only` | `npm run test:browser -- --grep @claim:local-only` | PASS |
| `no-account` | `npm run test:unit -- --testNamePattern @claim:no-account` | PASS |
| `demo-sandbox` | `npm run test:browser -- --grep @claim:demo-sandbox` | PASS |
| `demo-discard-on-exit` | `npm run test:browser -- --grep @claim:demo-discard-on-exit` | PASS |
| `encrypted-storage` | `npm run test:unit -- --testNamePattern @claim:encrypted-storage` | PASS |
| `offline-review` | `npm run test:browser -- --grep @claim:offline-review` | PASS |
| `offline-capture` | `npm run test:browser -- --grep @claim:offline-capture` | PASS |
| `source-context-capture` | `npm run test:browser -- --grep @claim:source-context-capture` | PASS |
| `supported-chromium-pages` | `npm run test:browser -- --grep @claim:supported-chromium-pages` | PASS |
| `storage-scope` | `npm run test:browser -- --grep @claim:storage-scope` | PASS |
| `no-analytics` | `npm run test:browser -- --grep @claim:no-analytics` | PASS |
| `extension-download` | `npm run test:browser -- --grep @claim:extension-download` | PASS |
| `unpacked-install` | `npm run test:browser -- --grep @claim:unpacked-install` | PASS |

Landing, legal, README, install-guide, and extension copy were cross-checked
against the manifest. No additional public claim was found.

## Installed extension paths

The live ZIP returned 200, passed `unzip -t`, and loaded as the only extension
in a new Chromium profile. Its seven runtime files and packaged install guide
are byte-for-byte identical to the clean candidate build.

Normal, invalid, boundary, keyboard, recovery, and offline paths passed:

- The extension captured **quietly held**, its three-sentence context, source
  title and URL, language, and a learner-written meaning.
- Selecting the second occurrence of **target** retained the later harbour
  passage, not the earlier station passage.
- Empty meaning submission announced **Write a short meaning, then save it.**
- The meaning field accepted 240 characters and rejected a 241st character.
- Initial focus moved to the meaning field. Tab and Shift+Tab wrapped inside
  the modal. Escape closed it and returned focus to the source-page control.
- The popup showed the saved phrase, review worked, and CSV contained the
  phrase, source context, and URL.
- With the already-open source page taken offline before capture, capture,
  export, and review completed with zero HTTP requests after the boundary.
- Malformed site, demo, and extension vaults retain scoped download, cancel,
  and confirmed-clear recovery paths. The full suite proves those paths.
- Independent Axe scans of the live-ZIP capture dialog and popup found zero
  violations at every severity.

Evidence: [invalid, boundary, and keyboard result](verification-evidence-10/live-extension-invalid-boundary-keyboard.json),
[offline result](verification-evidence-10/live-extension-offline.json),
[repeated-context and Axe result](verification-evidence-10/live-extension-repeated-context-axe.json),
and [populated popup](verification-evidence-10/live-extension-popup-boundary.png).

## Site structure, accessibility, and links

The 24-test live suite passed Home, Demo, Privacy, Terms, source links,
downloads, navigation history, focus, mobile layout, cache policy, recovery,
both color schemes, and the designed 404.

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with distinct titles,
  descriptions, canonical URLs, social metadata, one h1, and one main.
- An unknown route returns the expected HTTP 404. It has the shared header,
  footer, skip link, direct missing-page wording, and a way home. This expected
  404 is not a defect.
- `robots.txt`, `sitemap.xml`, all same-origin links, all sample sources, the
  install guide, and the extension ZIP resolve.
- The first Tab reaches **Skip to content**. Enter reaches main. SPA route
  changes focus and announce the new heading. Back restores route focus.
- All visible mobile links, buttons, and summaries meet the 44 px target check.
- At 200% root text size, every route retained its structure with no horizontal
  overflow or undersized control.
- Reduced-motion mode computed `scroll-behavior: auto` and no primary-action
  transform.
- Independent all-severity Axe scans found zero violations on Home, Demo,
  Privacy, Terms, and the 404 in both light and dark modes.
- `verify-url.sh` passed title, language, h1, main, alt, control-label, and
  console checks.

Evidence: [all-severity Axe](verification-evidence-10/live-axe-all-severities.json),
[200% and reduced-motion result](verification-evidence-10/live-text-200-reduced-motion.json),
[200% phone view](verification-evidence-10/live-home-text-200.png),
[404 phone view](verification-evidence-10/live-404-phone.png), and
[verify-url result](verification-evidence-10/verify-url/verify.json).

## Privacy, legal pages, and applicable scope

The Privacy page names the exact stored fields, AES-GCM encryption, local
extension storage, absence of analytics/product-data requests, demo
separation, CSV export, and local deletion risk. Fresh site and extension
request logs stayed on the product or selected-source origin. Source and built
files contain no analytics, remote fonts, remote scripts, AI gateway, billing
call, sign-in flow, or embedded credential.

There is no remote user record to answer a privacy request. A user can export
their phrases, remove the extension, or clear its browser storage. There is no
backend, tenant, shared database, paid flow, API, CLI, desktop package, or site
service worker. Backend tenant isolation, restart persistence, health,
429/`Retry-After`, billing, and PWA update checks are therefore not applicable.
The promised extension offline behavior passed against both the clean build
and the downloaded live ZIP.

No additional AI step is required. The brief intentionally uses a
learner-written meaning, and CSV export already covers the implied handoff to
another study tool.

## Performance, headers, and deployment identity

Fresh mobile Lighthouse on Home scored:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.82 s |
| LCP | 1.25 s |
| TBT | 0 ms |
| CLS | 0 |
| Transfer | 84,869 B |

The initial JavaScript is 16,591 B raw and 6.13 KB gzip. CSS is 9,693 B raw
and 3.02 KB gzip. The hero WebP is 74,024 B. These are within budget.

All 16 served non-ZIP files are byte-identical between the clean
candidate build and production. ZIP container hashes differ because of
archive metadata; extracted contents are identical. Responses include HSTS,
`nosniff`, strict-origin referrer policy, and a same-origin CSP with
header-delivered `frame-ancestors 'none'`. Stable art revalidates, while hashed
JS and CSS are immutable.

Evidence: [Lighthouse report](verification-evidence-10/lighthouse-live-home.json)
and [site parity](verification-evidence-10/live-site-parity.json).

## Clean-checkout quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 273 packages audited, 0 vulnerabilities |
| `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm test` | PASS; 8 unit/contract and 33 browser tests |
| `npm run test:copy` | PASS; 2 tests |
| `npm run build` | PASS; site, MV3 directory, and ZIP produced |
| ZIP integrity | PASS |
| Live site suite | PASS; 24 tests |
| `verify-url.sh` | PASS |
| Independent Axe | PASS; zero violations at every severity |
| Lighthouse mobile | PASS; 100/100/100/100 |

## Earlier findings

Every prior review, verification, polish report, and handoff was inspected.
Passing reports were not accepted as proof by themselves; the current clean
suite, live browser checks, and downloaded extension were used to recheck the
underlying behavior.

### Initial verification

| Earlier finding | Current disposition |
| --- | --- |
| Capture message receiver was absent | Fixed; the downloaded extension opens, saves, reviews, and exports. |
| Live ZIP returned 404 | Fixed; 200, valid ZIP, clean-profile load succeeds. |
| Type checking failed | Fixed; `npx tsc --noEmit` passes. |
| Claims were duplicate or incomplete | Fixed; 14 unique claims have one passing tagged test each. |
| Demo source links were dead | Fixed; all three source pages return 200. |
| Dependency advisories | Fixed; clean install and production audit report zero. |
| Route focus and announcement were absent | Fixed; focus, announcement, and Back tests pass live. |
| Unknown routes returned 200 | Fixed; unknown routes return the designed 404. |
| Demo wrote an unprefixed device key | Fixed; fresh demo uses only two `demo:` keys. |

### Review findings 1 through 8

| Finding | Current disposition and proof |
| --- | --- |
| F-1-1 | Fixed; structured, styled, CSP-clean 404 returns 404. |
| F-1-2 | Fixed; all routes expose distinct title, description, canonical, Open Graph, and Twitter metadata. |
| F-1-3 | Fixed; regular-page source capture is registered and passes in the built and downloaded extension. |
| F-1-4 | Fixed; site and extension consistently use **phrase** and **meaning**. |
| F-1-5 | Fixed; review-queue, capture-card, and cue jargon is absent. |
| F-1-6 | Fixed; complete copy audit and mechanical coverage/count test pass. |
| F-2-1 | Fixed; How it works routes, focuses, announces, and restores focus on Back. |
| F-2-2 | Fixed; storage-scope and no-analytics claims are registered and pass. |
| F-2-3 | Fixed; the action is **Mark phrase as remembered**. |
| F-3-1 | Fixed; `npm run test:copy` passes against current public copy. |
| F-4-1 | Fixed; demo exit removes demo keys and preserves seeded real data. |
| F-4-2 | Fixed; the heading names the three-step save and review task. |
| F-4-3 | Fixed; the section is named **Privacy and data export**. |
| F-4-4 | Fixed; README uses **Try the sample demo**. |
| F-4-5 | Fixed; both 404 surfaces use direct missing-page wording. |
| F-5-1 | Fixed; free use is visible before scrolling and anonymous download passes. |
| F-5-2 | Fixed; clean-checkout lint passes. |
| F-5-3 | Fixed; the preview label is **Phrase review**. |
| F-5-4 | Fixed; the preview heading names review with the source sentence. |
| F-5-5 | Fixed; footer says phrases are saved with source sentences. |
| F-5-6 | Fixed; generic public provenance copy is absent; provenance remains in the design file. |
| F-5-7 | Fixed; README no longer repeats the workflow. |
| F-5-8 | Fixed; README explains sample separation without storage jargon. |
| F-5-9 | Fixed; README explains encrypted Chromium storage in plain words. |
| F-6-1 | Fixed; the live extension states the regular-page boundary, not “any page.” |
| F-6-2 | Fixed; the capture form asks for a meaning, not a cue. |
| F-6-3 | Fixed; README limits itself to the no-account claim. The guide's narrower offline statement is now registered as `offline-capture`. |
| F-6-4 | Fixed; README names build outputs and makes no reproducibility claim. |
| F-6-5 | Fixed; landing export copy says saved phrases, not records. |
| F-6-6 | Fixed; README directly names the phrase, nearby sentences, and page link. |
| F-8-1 | Fixed; `offline-capture` now tests capture, review, CSV, and zero requests after going offline in a fresh installed extension. |

### Verification 4 and 6

| Earlier finding | Current disposition and proof |
| --- | --- |
| Repeated phrase used the first context | Fixed; the downloaded extension retained the selected harbour occurrence. |
| Dark primary actions failed contrast | Fixed; both-theme all-severity Axe scans have zero violations. |
| Stable hero was cached immutable | Fixed; it uses `max-age=0, must-revalidate`. |
| Install flow ended at a ZIP | Fixed; instructions, guide, extraction, Load unpacked, and worker start pass. |
| Unreadable real vault lacked recovery | Fixed; export, cancel, confirmation, and scoped clear pass. |
| Cold load skipped the skip link | Fixed; the first Tab reaches the skip link and Enter focuses main. |

Reviews 7 and verifications 2, 3, 5, 7, 8, and 9 reported no additional
findings. Their covered behaviors were included in the current checks.

## Known gaps and next step

No known product gap or required repair remains. `.factory/brief.json` is
absent; the complete researched brief supplied with this work order was used
as acceptance context.
