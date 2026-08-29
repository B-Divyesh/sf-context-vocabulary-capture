# Polish 3 — cumulative remediation evidence

**Reviewed base:** `352911f5a043538566713cc5f93f0eb350aec8d6`

**Final product commit tested from a clean clone:** `8e3e596c24f8665cd2422462b74948f10b926aec`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

Every finding in `review-1.md`, `review-2.md`, and `review-3.md` was checked
again. “Minor” findings were treated as required work.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the same-origin `404.css` and complete 404 shell, then added 44 px wordmark/footer targets. Unknown URLs still return a real 404 without weakening CSP. | Test: `returns a CSP-clean, fully structured 404 response`. Screenshot: [live mobile 404](evidence-polish-3-live-404-mobile.png). Live: `/missing-polish-3` returned 404 with one h1/main, header/footer, metadata, home link, and no unexpected console error. |
| F-1-2 | Retained per-route title, description, canonical, Open Graph, and Twitter metadata; expanded assertions to exact descriptions, images, and the `/?demo=1` canonical. | Test: `sets route-specific titles, descriptions, canonical URLs, and social metadata`. Screenshot: [live Privacy route](evidence-polish-3-live-privacy-mobile.png). Live suite passed `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms`. |
| F-1-3 | Retained explicit source-context and supported-Chromium-page claim entries with real MV3 capture/export tests. The extension ZIP now contains only the 17.94 KB extension build instead of copied site assets. | Tests: `@claim:source-context-capture`, `@claim:supported-chromium-pages`, and `@claim:extension-download`. Screenshot: [live first screen](evidence-polish-3-live-root/screenshot-mobile.png). Live ZIP returned 200; clean-clone ZIP was 9,478 bytes and passed its signature check. |
| F-1-4 | Kept **phrase** as the only public noun for selected and saved vocabulary. | Test: `copy audit matches every rendered landing label and every README prose line`. Screenshot: [live demo](evidence-polish-3-live-demo-mobile.png). Live cold read found no competing item noun. |
| F-1-5 | Rewrote the first-screen support line to name language learners, web pages, phrases, and context. The action result is now “Open sample phrases ready to review.” Existing plain saved-phrase and meaning wording remains. | Test: `copy audit matches every rendered landing label and every README prose line`. Screenshot: [live first screen](evidence-polish-3-live-root/screenshot-mobile.png). Live first screen shows the job, audience, action, outcome, and three facts before scrolling. |
| F-1-6 | Regenerated `copy-audit.md` with every landing heading, sentence, fact, link, button, empty state, footer line, alt text, and all README headings/prose. Added the repeatable `npm run test:copy` extraction and count check. | Test: `copy audit matches every rendered landing label and every README prose line`. It explicitly covers **Export CSV**, **Try sample phrases**, and all corrected counts. Screenshot: [live first screen and board](evidence-polish-3-live-root/screenshot-mobile.png). Live copy matched the committed audit. |
| F-2-1 | Retained `/#how` cross-route navigation and focus/announcement behavior; broadened the live-capable suite so the same test runs against production. | Test: `routes How it works from every public page to the landing section and preserves back navigation`. Screenshot: [live Privacy route](evidence-polish-3-live-privacy-mobile.png). Live click from Privacy focused `#how`; Back restored Privacy and its h1 focus. |
| F-2-2 | Retained exact storage-scope and no-analytics claims. The tests decrypt a real extension vault, assert its field set, and log the complete capture/popup/demo request flow. | Tests: `@claim:storage-scope` and `@claim:no-analytics`. Screenshot: [live Privacy route](evidence-polish-3-live-privacy-mobile.png). Live demo requests stayed on `context-vocabulary-capture.sociobot.in`. |
| F-2-3 | Kept the result-naming action **Mark phrase as remembered** in both the demo and extension popup. | Tests: `works at 390px and with keyboard activation` and `@claim:demo-sandbox`. Screenshot: [live demo](evidence-polish-3-live-demo-mobile.png). Live keyboard activation advanced the due phrase. |
| F-3-1 | Fixed the reopened copy-audit regression and added a mechanical drift gate. Corrected the report’s named rows and every additional inaccurate historical count found by the checker. | Test: `npm run test:copy` passed in the final clean clone and against the live page. Screenshot: [live rendered copy](evidence-polish-3-live-root/screenshot-desktop.png). The test extracts live landing units and README prose, checks every row, and enforces the 22-word maximum. |

## Required acceptance paths

- **One click and isolated:** `/?demo=1` opens three sample phrases with the
  persistent banner, **Reset demo**, and **Start for real**. The tagged demo
  test decrypts the demo vault after exit, finds zero records, and finds no
  real-storage keys.
- **Real routing:** the live-capable browser suite checks statuses, all
  same-origin links, route metadata, focus, announcements, history, legal
  links, 404 structure, and CSP.
- **Mobile and accessibility:** every public route is checked at 390 × 844 for
  overflow, a single h1/main, and 44 px link/button/summary height. Axe reports
  no violations. A cold screenshot review found and fixed legal-page edge
  spacing before the second deployment.
- **Identity preserved:** the warm paper, ink, cobalt, tangerine, serif/sans,
  halftone reading-margin system and original hero art remain intact.

## Clean-clone claim gate

From a new clone at `8e3e596c24f8665cd2422462b74948f10b926aec`,
`npm ci` found zero vulnerabilities. Every exact command in `claims.json`
passed independently:

| Claim | Result |
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

The same clean clone then passed `npm test` (6 unit/contract and 20 browser
tests), `npm run lint`, `npx tsc --noEmit`, `npm run build`, and
`npm run test:copy`. The source worktree remained clean.

## Live evidence

- `PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts`: **14 passed** after the second deployment.
- Factory `verify-url.sh`: 200, correct title/lang, one h1/main, zero missing alt text, zero unlabeled buttons, and zero console errors. See [verify.json](evidence-polish-3-live-root/verify.json).
- Lighthouse mobile on `/?demo=1`: Performance **100**, Accessibility **100**, FCP **0.8 s**, LCP **0.8 s**, CLS **0**, TBT **0 ms**.
