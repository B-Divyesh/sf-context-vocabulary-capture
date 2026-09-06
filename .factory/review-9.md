# Save phrases with their source sentence — review 9

**Work order:** `context-vocabulary-capture-review-9`  
**Reviewed:** 2026-09-06  
**Live URL:** <https://context-vocabulary-capture.sociobot.in>  
**Implementation candidate:** `cd52ba72f4389a46628b5bdd39ca3708a973b0c8`  
**Documentation SHA:** `9059a20b91df851a6c2c22543f28fca47ffce15a`

The implementation candidate and documentation SHA differ only because later
commits add factory reports and evidence. The non-`.factory` diff is empty.
No product code was changed for this review.

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

## Job, audience, and first action

Fresh 1440 × 900 desktop and iPhone 13 browser contexts were opened at the
live URL before scrolling. Both showed:

- Job: **Save phrases with their source sentence.**
- Audience: language learners reading web pages who want to remember a phrase
  and its context.
- First action: **Try it with sample data.**
- Result stated beside the action: **Open sample phrases ready to review.**

In both contexts the heading and action were inside the initial viewport. Each
had one h1, a main landmark, the correct title, no horizontal overflow, and no
page or console error. Evidence: `/work/.evidence/review-9-live-fresh.json`,
`review-9-live-first-desktop.png`, and `review-9-live-first-phone.png`.

## Sample demo and real data

One click opened `/demo` with three realistic English, Spanish, and German
phrases. The persistent banner said **Demo — sample data, nothing is saved**
and exposed **Reset demo** and **Start for real**. The initial phrase was
**quietly held**. Marking it remembered advanced to **recoger el hilo**. Reset
restored **quietly held** and **3 total**.

In each fresh context Demo created only
`demo:keep-the-sentence:device-key` and `demo:keep-the-sentence:vault`.
There were no real keys. Leaving through Start for real removed both demo keys
and did not create a real-data key. This independently rechecks the prior
demo-exit finding and the registered sandbox claims.

## Declared claims

After `npm ci`, every exact command in `.factory/claims.json` was run
independently. All 14 passed. The first `offline-review` invocation started
after a command runner had ended its local server; its clean independent rerun
passed. This was a test-server interruption, not a product outcome.

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

The copied commands and outputs are in `/work/.evidence/review-9-claim-*.log`.
The offline rerun is `review-9-claim-offline-review-rerun.log`. The claim
contract test and copy audit passed. Landing, Privacy, README, and install
guide copy were checked against the registry; no public claim was unlisted.

## Extension check

The live download returned a valid ZIP. Its extracted runtime files match the
fresh candidate build byte for byte; the ZIP additionally includes the
documented `INSTALL.md`. A fresh Chromium profile loaded that downloaded
extension. On the live regular-page fixture, selecting **quietly held**, adding
the meaning **remained still and calm**, and saving produced a popup review
with the three-sentence context. Extension storage contained only the encrypted
vault and device-key entries.

Evidence: `/work/.evidence/review-9-live-zip-extension.json`,
`review-9-live-zip-popup.png`, `review-9-live-zip-sha256.txt`, and
`review-9-local-extension-sha256.txt`. The full suite also passed invalid
meaning, the 240-character boundary, keyboard/focus and Escape behavior,
repeated-phrase context, corrupt-data recovery, offline capture, review, and
CSV export.

## Site, accessibility, privacy, and routes

The live site suite passed 24 tests against the production URL. It covers
links, route titles and metadata, demo reset and exit, route focus and Back,
keyboard activation, 390 px layout, text resize, reduced motion, cache policy,
Privacy and Terms, and the designed 404. The factory URL check passed title,
`lang=en`, one h1, main, image alt text, labelled controls, and no console
errors. Its output is in `/work/.evidence/review-9-verify-url/`.

The Playwright Axe integration passed serious and critical checks in light and
dark themes at desktop and 390 px for Home, Demo, Privacy, Terms, and 404. It
also passed the recovery dialog. The privacy copy matches the tested
local-only, encrypted-storage, storage-scope, and no-analytics claims. There
is no backend, account, payment flow, remote user data, site service worker,
runtime AI, CLI, or desktop application. Checks specific to those systems do
not apply.

An unknown live route returned the expected HTTP 404 with the designed page,
header, footer, skip link, title, and route back home. This deliberate 404 is
not a defect.

## Quality gates

| Command or check | Result |
| --- | --- |
| `npm ci` | PASS; 273 packages audited, 0 vulnerabilities |
| `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm test` | PASS; 8 unit/contract and 33 browser tests |
| `npm run test:copy` | PASS; 2 tests |
| `npm run build` | PASS; emits `dist/site`, MV3 extension, and ZIP |
| Live site suite | PASS; 24 tests |
| Factory URL check | PASS |
| Downloaded ZIP integrity and fresh-profile load | PASS |

Logs are in `/work/.evidence/review-9-{lint,tsc,test,copy,build,audit}.log`
and `/work/.evidence/review-9-live-site-suite.log`.

## Earlier findings

All earlier review, verification, and polish reports were inspected, including
their minor findings. Their current dispositions are proven by the checks above:

| Earlier finding group | Current disposition |
| --- | --- |
| 404 shell/CSP, metadata, and missing source-context claim | Closed: live route, metadata, URL check, and registered claim pass. |
| Terminology, jargon, labels, headings, and copy-audit counts | Closed: `npm run test:copy` passes and public copy uses phrase and meaning. |
| Cross-route How-it-works link and focus/Back behavior | Closed: live navigation, heading focus, and history tests pass. |
| Unlisted privacy, storage, analytics, and offline claims | Closed: all are registered and their exact commands pass. |
| Demo writes or retains real data | Closed: fresh storage checks prove separate keys, reset, and discard on exit. |
| Price fact, install steps, and ZIP availability | Closed: free download copy is visible, the ZIP is valid, and Chromium loads it. |
| “Any page”, “cue”, duplicate saved-item name, and unclear README copy | Closed: copy-audit coverage uses the regular-page boundary, meaning, and phrase wording. |
| Repeated phrase context, dark contrast, and cache policy | Closed: browser suite passes selected context, two-theme Axe, and cache tests. |
| Unreadable-vault recovery and first-focus skip link | Closed: full suite passes recovery, skip-link, and keyboard checks. |

No earlier finding reopened and no new finding was found.

## Evidence and next step

The required external copy is `/work/.evidence/qa-report.md` and the matching
machine result is `/work/.evidence/qa-result.json`. No repair is needed.
