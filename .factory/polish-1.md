# Polish 1 — review remediation evidence

**Repair commit:** `58b398c3e64eff7d727c7ea7b95b22a9986d87c5`

**Base reviewed:** `87032cb75598c4939c146c8538ba054a6e560ff5`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the inline 404 stylesheet with `/404.css`; gave `404.html` the same skip link, wordmark, nav, footer, favicon, canonical/description/OG/Twitter metadata, and a home escape. The local deployment-style server now serves unknown routes as real 404 responses. | `returns a CSP-clean, fully structured 404 response`; live `GET /missing` returned **404** and the shell loaded with no CSP error; [live mobile screenshot](evidence-polish-1-live-404-mobile.png). |
| F-1-2 | Added route metadata records and updates for `/`, `/demo`, `/privacy`, `/terms`, and the SPA 404: title, description, canonical, Open Graph, and Twitter title/description now follow the rendered route. | `sets route-specific titles, descriptions, canonical URLs, and social metadata`; cold live Chromium check passed all four routes. |
| F-1-3 | Added `source-context-capture` and `supported-chromium-pages` entries to `claims.json`. The production MV3 test selects text on a normal HTTP page, saves it through the context-menu message path, and checks phrase, nearby sentence, and source URL in the exported CSV. The install copy now names the Chromium boundary. | `@claim:source-context-capture` and `@claim:supported-chromium-pages`, each passed from the clean clone; live ZIP returned **200** and `unzip -t` passed. |
| F-1-4 | Standardized public product language on **phrase** for the selected/saved item; removed competing “word”, “capture card”, and “cue” labels from the landing/demo copy. | Updated [copy audit](copy-audit.md); cold live first-screen check reads “Save phrases with their source sentence.” |
| F-1-5 | Rewrote internal labels: “See phrases ready to review right away,” “Your saved phrase includes nearby sentences and the source link,” and “reveal your meaning.” | `works at 390px and with keyboard activation`; [live demo mobile screenshot](evidence-polish-1-live-demo-mobile.png). |
| F-1-6 | Rebuilt the copy audit with all landing sentences, headings, controls, facts, alt text, terminology, and README prose. Counts were corrected and all prose is at most 22 words. | [copy audit](copy-audit.md), manually cross-checked against the rendered landing and README. |

## Re-checks

- Direct `/?demo=1` and `/demo` retain the separate `demo:` storage namespace,
  persistent banner, reset control, and Start-for-real exit. `@claim:demo-sandbox`
  passed from the clean clone.
- The full MV3 capture → validation → save → CSV → offline popup flow passed in
  `@claim:offline-review`. It also proves the local-only, source-context, and
  Chromium-page claims without a mocked extension.
- Cold live Chromium checks passed at 390 × 844 for `/`, `/demo`, `/privacy`,
  `/terms`, and `/missing`: one h1, correct title/canonical where applicable,
  no horizontal overflow, and no unexpected console error.
- Playwright axe scans of those five live routes found no serious or critical
  violations. The standalone `@axe-core/cli` could not find Chrome in this
  container, so the repository’s Playwright axe integration was used instead.
