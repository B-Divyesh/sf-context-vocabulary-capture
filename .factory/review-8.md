# Save phrases with their source sentence — review 8

**Work order:** `context-vocabulary-capture-review-8`

**Reviewed:** 2026-09-06

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Implementation candidate:** `376e64e8b8abd1918749345d7f2c46341a8840e7`

**Documentation baseline:** `8c60c3b22c149ae7b4acdbab2ae156ab3e277abf`

The later commits are reports and evidence only. The live product files match
the implementation candidate. No product code was changed during this review.

## Verdict

**FAIL.** There is one high-severity finding and one untested public claim.
The live install guide and the guide inside the ZIP say the extension does not
need a network service. That claim is not in `.factory/claims.json`, and no
test proves offline capture. PASS requires zero findings and zero untested
claims.

| Result | Count |
| --- | ---: |
| Findings | 1 |
| Untested claims | 1 |
| Release blocker | 0 |
| High | 1 |
| Medium | 0 |
| Low | 0 |
| Informational product defect | 0 |

## Job, audience, and first action

Fresh Chromium contexts were used at 1440 × 900 and 390 × 844. Before
scrolling, both showed:

- Job: **Save phrases with their source sentence.**
- Audience: language learners reading web pages who want to remember a phrase
  and its context.
- First action: **Try it with sample data.**
- Action result: **Open sample phrases ready to review.**

The heading and action were inside both initial viewports. There was no
horizontal overflow, console error, page error, or third-party request. The
paper, ink, cobalt, orange, serif, halftone, and printed-rule design matches
`.factory/design.md` and is specific to reading and source context.

## Finding

### HIGH — F-8-1: The install guide makes an unregistered network-service claim

The live file at `/downloads/INSTALL.md`, lines 12–13, says:

> Keep the Sentence stores your saved phrases in this browser. It does not need
> an account or a network service.

The same text is inside the downloaded live ZIP. The candidate copy is
byte-identical to both live copies.

The no-account part has the registered `no-account` claim. The separate
network-service statement has no claim entry. The `offline-review` test proves
that the popup can reload saved phrases offline. It does not prove that a
learner can capture a phrase without a network service. The `local-only` test
records requests during an online capture and also does not prove this claim.

This reopens the network-service part of F-6-3. The earlier repair removed it
from README but left it in the public install guide. The current copy and
coverage tests do not audit this sentence.

Fix it in one of these ways:

1. Remove “or a network service” from the public guide and packaged guide.
2. Register a precise offline-capture claim and add exactly one tagged test.
   The test must load the installed extension in a fresh profile, open a normal
   page, go offline, capture a selected phrase, then review and export it.

The first option matches the smallest current promise. No code change was made
because this work order is review-only.

## Declared claim commands

After `npm ci`, every exact command from `.factory/claims.json` ran
independently. All 13 registered claims passed.

| Claim | Result |
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

The failure is the additional public statement in F-8-1. A passing manifest
cannot cover a claim that the manifest omits.

## Sample demo

One click from the first screen opened `/demo`. The first rendered demo screen
already showed three English, Spanish, and German phrases with nearby text,
learner meanings, languages, and working source links.

The banner remained visible and said **Demo — sample data, nothing is saved**.
It provided **Reset demo** and **Start for real**. The first phrase was
**quietly held**. Revealing its meaning showed **remained still and calm**.
Marking it remembered advanced to **recoger el hilo**. Reset restored
**quietly held** and **3 total**.

Only these keys existed in demo mode:

- `demo:keep-the-sentence:device-key`
- `demo:keep-the-sentence:vault`

Start for real removed both keys and showed **Nothing due today**. No real key
was created in the fresh context. The registered exit test also seeded a real
encrypted vault and proved it remained byte-for-byte unchanged after demo use.
The whole live flow stayed on the product origin.

## Installed extension

The live ZIP passed `unzip -t`. Its seven runtime files are byte-for-byte
identical to `dist/extension/chrome-mv3`; only archive metadata differs. A
fresh Chromium profile loaded the extracted live ZIP as its only extension.

Normal, invalid, boundary, recovery, and offline paths passed:

- Selecting **quietly held** captured the three source sentences, title, URL,
  language, and learner meaning.
- Selecting the second **target** used the harbour passage, not the first
  occurrence.
- A blank meaning produced **Write a short meaning, then save it.** and returned
  focus to the field.
- The meaning field enforced its 240-character limit.
- Tab wrapped from the last dialog control to the first field.
- Escape closed the dialog and returned focus to the source-page control.
- The popup showed **1 saved locally** and exported a two-row CSV with the
  phrase, context, and source URL.
- The popup reloaded offline and still showed **quietly held**.
- Marking it remembered produced **No phrases due today**.
- The capture dialog and popup each had zero serious or critical Axe findings.
- Product use produced no console error. The separately recorded inline-style
  CSP diagnostic came only from the Axe probe injecting its test style.
- The extension made one HTTP request: the selected source page. It made no
  product-data or third-party request.

## Invalid data and recovery

A malformed real vault showed **Your local notes could not load.** The page
kept its navigation and offered download, Privacy, Demo, and clear actions.
The confirmation dialog focused Cancel. Cancel preserved the values. Confirmed
clear removed only product keys and restored the empty board.

The live suite separately proved that corrupt demo data can be cleared without
changing the real namespace. Recovery and dialog scans found no serious or
critical Axe issue.

## Site structure, accessibility, and links

The 24-test live site suite passed. It covered Home, Demo, Privacy, Terms, the
designed 404, copy, demo isolation, route history, keyboard use, caching,
mobile layout, and both color schemes.

- `/`, `/demo`, `/privacy`, and `/terms` return 200.
- An unknown route returns the expected designed HTTP 404. The 404 has the
  shared header, footer, skip link, one h1, one main landmark, direct wording,
  route metadata, and a way home. The expected 404 status is not a defect.
- `robots.txt`, `sitemap.xml`, every same-origin link, every demo source, the
  install guide, and the ZIP resolve.
- Each public route has `lang="en"`, one h1, one main landmark, a route title,
  description, canonical URL, social metadata, favicon, shared navigation,
  and legal links.
- Cold keyboard order starts with **Skip to content**. Enter moves focus to
  main. Route changes focus and announce the new heading. Back restores focus.
- Focus uses a visible 3 px outline. Measured light and dark focus contrast is
  at least 3.41:1.
- Text, muted text, links, and primary actions measure at least 5.75:1 in the
  recorded light and dark palettes.
- Visible mobile controls meet the 44 px target check.
- At 200% root text size, the phone layout kept its heading and action with no
  horizontal overflow.
- Reduced motion matched, used `scroll-behavior: auto`, and computed zero
  animation and transition duration for the hero.
- Playwright Axe found zero serious or critical findings across all public
  routes, both themes, desktop, phone, and recovery.
- The required `verify-url.sh` check passed with title, language, h1, main,
  image alt, labels, and zero errors.
- After installing matching Chrome and ChromeDriver, `npx @axe-core/cli`
  reported zero violations. It marked body-gradient contrast as incomplete;
  the palette ratios and both-theme browser scans above cover that manual item.

## Privacy, legal pages, and offline scope

Privacy and Terms have real routes and route-specific titles. The Privacy page
states the stored fields, AES-GCM encryption, local extension storage, no
analytics or product-data requests, demo separation, export, and local removal
risk. Their registered tests passed.

Fresh site and demo traffic was same-origin only. The installed extension made
no request beyond its source page. Source and built files contain no analytics,
external font, external script, AI gateway, billing call, sign-in flow, or
embedded provider credential.

There is no backend, tenant, product API, payment flow, site service worker,
CLI, library, or desktop package. Backend tenant isolation, restart
persistence, health, 429/`Retry-After`, paid unlock, and PWA update checks are
not applicable. Offline review belongs to the MV3 extension and passed. The
site does not promise offline reload or installable PWA behavior.

There is no remote user record to answer a privacy request. Users can export
their local phrases, remove the extension, or clear its browser storage.

## Performance and deployment match

Fresh Lighthouse mobile on Home scored:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.8 s |
| LCP | 1.3 s |
| TBT | 0 ms |
| CLS | 0 |
| Transfer | 83 KiB |

Built initial assets remain within budget:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 16,591 B | 6,161 B |
| CSS | 9,693 B | 3,034 B |
| Hero WebP | 74,024 B | not applicable |

All 16 deployable static files, excluding the platform configuration file and
ZIP container, are byte-identical between the candidate build and production.
The live ZIP has valid contents that match the candidate extension. HTML and
downloads revalidate. Hashed assets are immutable. Stable art revalidates.

Responses include HSTS, `nosniff`, strict-origin referrer policy, and a
same-origin CSP with header-delivered `frame-ancestors 'none'`.

## Clean-checkout commands

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 273 packages audited, 0 vulnerabilities |
| `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm test` | PASS; 8 unit and 32 browser tests |
| `npm run test:copy` | PASS; 2 tests |
| `npm run build` | PASS; produced `dist/site`, extension directory, and ZIP |
| Live site suite | PASS; 24 tests |
| `verify-url.sh` | PASS |
| Axe CLI after matching browser install | PASS; 0 violations |
| Lighthouse mobile | PASS; 100/100/100/100 |

## Earlier findings

Every earlier review, verification, polish report, and handoff was inspected.

### Initial verification findings

| Earlier finding | Current disposition and proof |
| --- | --- |
| Core capture had no message receiver | Fixed. The downloaded live extension opened the capture dialog and saved the phrase. |
| Live extension ZIP returned 404 | Fixed. It returns 200, passes integrity, loads, and completes the product job. |
| Type check failed | Fixed. `npx tsc --noEmit` passes. |
| Duplicate and missing claims | **Reopened in part by F-8-1.** Registered IDs are unique and pass, but the install guide adds one unregistered network-service claim. |
| Demo source links were dead | Fixed. All three same-origin source pages return 200. |
| Production dependency advisories | Fixed. `npm ci` and `npm audit --omit=dev` report zero vulnerabilities. |
| Route focus and announcement were missing | Fixed. Route and Back focus tests pass with a polite announcement. |
| Unknown routes returned 200 | Fixed. Unknown routes return the designed 404 with status 404. |
| Demo wrote an unprefixed device key | Fixed. Demo uses only its two `demo:` keys and preserves the real namespace. |

### Review findings 1 through 6

| Finding | Current disposition and proof |
| --- | --- |
| F-1-1 | Fixed. The 404 shell is structured, styled, and CSP-clean in normal use. |
| F-1-2 | Fixed. Every route has its own title, description, canonical, Open Graph, and Twitter data. |
| F-1-3 | Fixed. The landing and installed extension state and test the regular Chromium page boundary. |
| F-1-4 | Fixed. Public UI and the installed extension use phrase and meaning consistently. |
| F-1-5 | Fixed. Earlier review-queue, capture-card, and cue wording is absent. |
| F-1-6 / F-3-1 | Fixed. The mechanical landing/README/extension copy audit and count test pass. |
| F-2-1 | Fixed. How it works routes, focuses, announces, and restores focus on Back. |
| F-2-2 | Fixed. Storage scope and no-analytics claims are registered and pass. |
| F-2-3 | Fixed. The action says **Mark phrase as remembered**. |
| F-4-1 | Fixed. Demo exit removes demo keys and preserves seeded real data. |
| F-4-2 | Fixed. The heading names the three-step save and review task. |
| F-4-3 | Fixed. The section is named **Privacy and data export**. |
| F-4-4 | Fixed. README uses **Try the sample demo**. |
| F-4-5 | Fixed. Both 404 surfaces use direct missing-page wording. |
| F-5-1 | Fixed. Free use is on the first screen, and anonymous download passes. |
| F-5-2 | Fixed. Clean-checkout lint passes. |
| F-5-3 | Fixed. The preview label is **Phrase review**. |
| F-5-4 | Fixed. The preview heading names review with the source sentence. |
| F-5-5 | Fixed. The footer says phrases are saved with source sentences. |
| F-5-6 | Fixed. Generic public asset-provenance copy is absent; provenance remains in the design file. |
| F-5-7 | Fixed. README no longer repeats the workflow. |
| F-5-8 | Fixed. README explains sample separation without storage jargon. |
| F-5-9 | Fixed. README explains encrypted Chromium storage in plain words. |
| F-6-1 | Fixed. The live ZIP says regular web page and does not promise any page. |
| F-6-2 | Fixed. The capture form says **Write a short meaning** and contains no cue wording. |
| F-6-3 | **Reopened by F-8-1.** README is fixed, but the public install guide still says no network service is needed. |
| F-6-4 | Fixed. README names concrete build outputs and makes no reproducibility claim. |
| F-6-5 | Fixed. Landing export copy says saved phrases, not records. |
| F-6-6 | Fixed. README directly names the phrase, nearby sentences, and page link. |

### Verification 4 and 6 findings

| Earlier finding | Current disposition and proof |
| --- | --- |
| Repeated phrase used the first context | Fixed. The selected second occurrence saved the harbour passage. |
| Dark primary actions failed contrast | Fixed. Dark primary contrast is 7.68:1; both-theme Axe scans pass. |
| Stable hero used immutable caching | Fixed. It uses `max-age=0, must-revalidate`. |
| Public install flow ended at a ZIP | Fixed. Live steps, guide, ZIP, extraction, Load unpacked, and worker start pass. |
| Unreadable real vault had no recovery | Fixed. Download, Cancel, confirmed clear, and scoped removal pass. |
| Cold load skipped the skip link | Fixed. Body starts focused; the first Tab reaches the skip link. |

## Missed leverage

No additional AI, sync, or import feature is required by this scope. CSV
export is present. Automatic meanings would send selected reading text outside
the local-first workflow and would change the learner-written-meaning job.

## Repository scope note

`.factory/brief.json` is absent. The complete researched brief was supplied in
this work order, and `AGENTS.md` only requires the repository file when
present. This is not counted as a product defect.

## Required next step

Remove or register and test the network-service claim in F-8-1. Then rerun all
13 registered claim commands, the copy checks, build, and live ZIP comparison.
Until that happens, the product verdict remains **FAIL**.
