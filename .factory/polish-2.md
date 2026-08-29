# Polish 2 — cumulative review remediation evidence

**Repair commits:** `058371527c3479c470358c7545f83aed79c20938` (product repair), `862438e` (reviewed-record claim evidence)
**Reviewed base:** `4b3567582bf8864c08be3c7dd8824588eef49cad`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

Every finding in `.factory/review-1.md` and `.factory/review-2.md` was
rechecked in this round. The current public deployment serves the repaired
`index-BuRX8B4V.js` bundle.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the real CSP-clean `404.html` shell and same-origin stylesheet. | Cold live `/missing`: HTTP 404, one h1/main, canonical `/404`, no unexpected console error; [mobile screenshot](evidence-polish-2-live-404-mobile.png). |
| F-1-2 | Kept route-specific title, description, canonical, OG, and Twitter metadata for home, demo, privacy, terms, and 404. | `sets route-specific titles, descriptions, canonical URLs, and social metadata`; cold live audit checked all six URLs. |
| F-1-3 | Kept real MV3 source-context and Chromium-page claims with production-extension tests. | `@claim:source-context-capture` and `@claim:supported-chromium-pages` each pass in the clean clone. |
| F-1-4 | Kept **phrase** as the one public noun for selected and saved vocabulary. | Updated [copy audit](copy-audit.md); cold live demo and landing check. |
| F-1-5 | Kept the plain review/capture explanations. | [Copy audit](copy-audit.md); live 390 px demo screenshot. |
| F-1-6 | Regenerated the audit to include landing, demo, legal, terms, 404, controls, alt text, terminology, and this round’s changed README prose. | [Copy audit](copy-audit.md). |
| F-2-1 | Changed every SPA header’s shared link to `/#how`; routing now renders the landing section, focuses it, announces it, and returns focus to the prior page h1 on Back. | `routes How it works from every public page to the landing section and preserves back navigation`; cold live audit tested `/demo`, `/privacy`, and `/terms`. |
| F-2-2 | Added `storage-scope` and `no-analytics` to `claims.json`. The storage test decrypts a real MV3 vault and asserts the exact record fields. The network test records a capture, popup, and direct demo flow. Privacy and README now state the exact scope. | `@claim:storage-scope` and `@claim:no-analytics` each pass from the clean clone. [Live privacy screenshot](evidence-polish-2-live-privacy-desktop.png). |
| F-2-3 | Replaced “I remembered it” in the landing/demo board and extension popup with **Mark phrase as remembered**. | `works at 390px and with keyboard activation`; cold live demo audit clicked the new control and reset the sample data. |

## Final live re-check

A fresh 390 × 844 Chromium context checked `/`, `/demo`, `/?demo=1`,
`/privacy`, `/terms`, and `/missing`. It verified status, title, canonical,
single h1/main, no horizontal overflow, demo banner/reset/namespace isolation,
the updated review action, the cross-route How-it-works focus and Back flow,
and zero serious or critical axe findings on `/`, `/demo`, `/privacy`,
`/terms`, and `/missing`. The expected browser resource message for a 404
navigation was excluded; no other console error occurred.
