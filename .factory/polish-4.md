# Polish 4 — cumulative remediation evidence

**Reviewed release candidate:** `ac6cb3f281391b7c9f78c093421519a90cab6929`

**Review base:** `1e1001ab71712c9821625e73a80045d58d089b04`

**Repair commit:** `5e99c29`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

Every finding from `review-1.md` through `review-4.md` was treated as
acceptance work. The live browser suite was rerun after deployment, rather
than carrying forward an earlier “fixed” label.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the structured, same-origin stylesheet 404 and replaced its remaining metaphor with direct missing-page copy. | Test `returns a CSP-clean, fully structured 404 response`; live `https://context-vocabulary-capture.sociobot.in/missing-polish-4` returned 404 without unexpected console errors; [mobile screenshot](evidence-polish-4-live-404-mobile.png). |
| F-1-2 | Retained per-route title, description, canonical, Open Graph, and Twitter metadata for home, Demo, Privacy, Terms, and 404. | Test `sets route-specific titles, descriptions, canonical URLs, and social metadata`; post-deploy suite: 17 passed. |
| F-1-3 | Retained the real MV3 selected-phrase/context/source-link capture and Chromium-page claim coverage. | Exact clean-clone claims `@claim:source-context-capture` and `@claim:supported-chromium-pages` passed; live install ZIP returned 200 and passed `unzip -t`. |
| F-1-4 | Retained **phrase** as the one public word for selected and saved vocabulary. | `npm run test:copy` passed; live [home screenshot](evidence-polish-4-live-home-mobile.png) confirms the current first screen. |
| F-1-5 | Retained result-naming actions and plain source-context explanations. | Tests `works at 390px and with keyboard activation` and `@claim:demo-sandbox`; live [reset demo screenshot](evidence-polish-4-live-demo-reset-mobile.png). |
| F-1-6 | Kept the mechanical rendered-copy/README audit, then regenerated changed rows and counts for this round. | `npm run test:copy` passed locally and against the deployed site; [copy audit](copy-audit.md). |
| F-2-1 | Retained the real `/#how` route, target focus, route announcement, and Back restoration from Demo, Privacy, and Terms. | Test `routes How it works from every public page to the landing section and preserves back navigation`; post-deploy suite: 17 passed. |
| F-2-2 | Retained exact encrypted-record scope and request-observation claims. | Exact clean-clone claims `@claim:storage-scope` and `@claim:no-analytics` passed. |
| F-2-3 | Retained **Mark phrase as remembered** in the site demo and extension popup. | Exact clean-clone claim `@claim:demo-sandbox` and the mobile keyboard test passed; [live demo screenshot](evidence-polish-4-live-demo-reset-mobile.png). |
| F-3-1 | Retained the drift gate and corrected all newly changed audit rows. | `npm run test:copy` passed; the audit covers rendered landing/README wording and enforces the 22-word cap. |
| F-4-1 | Added namespace removal to every demo-to-non-demo SPA transition and synchronous removal on `pagehide`; the demo link, header links, `/#how`, Back, and full-page navigation now discard only `demo:` keys. Added the `demo-discard-on-exit` claim. | Exact clean-clone `@claim:demo-discard-on-exit` seeds a real encrypted vault, changes a sample, exits through Privacy, verifies byte-for-byte real-vault preservation, then confirms a newly seeded demo starts at **quietly held**. The separate `discards demo keys on a full page navigation away from Demo` test covers document exit. Live suite: 17 passed; [header-exit screenshot](evidence-polish-4-live-demo-exit-mobile.png) and [reseeded demo screenshot](evidence-polish-4-live-demo-reset-mobile.png). |
| F-4-2 | Replaced the slogan h2 with **Save and review a phrase in three steps.** | `npm run test:copy` and the cross-route How-it-works test passed; [live home screenshot](evidence-polish-4-live-home-mobile.png). |
| F-4-3 | Renamed the privacy-section label to **Privacy and data export**. | `npm run test:copy` passed; [live home screenshot](evidence-polish-4-live-home-mobile.png). |
| F-4-4 | Renamed the README heading to **Try the sample demo** and updated its lifecycle sentence. | `npm run test:copy` passed; [README](../README.md). |
| F-4-5 | Replaced both the SPA and static 404 h1s with **This page could not be found.** | Structured-404 test and post-deploy live suite passed; [mobile screenshot](evidence-polish-4-live-404-mobile.png). |

## Required acceptance paths

- **Direct and isolated demo:** `/?demo=1` opens three realistic phrases with
  the persistent banner, **Reset demo**, and **Start for real**. Reset restores
  the original records. Leaving through header navigation, Back, or a document
  navigation removes the full demo namespace without reading or changing the
  real namespace.
- **Claims:** a clean clone ran every exact command in `claims.json`, including
  the new discard-on-exit claim. The contract suite verifies exactly one tagged
  test per registered claim.
- **Routes and accessibility:** the live suite checked metadata, focus,
  announcements, 404, same-origin links, desktop/390px layout, touch targets,
  and axe in light and dark schemes. Factory `verify-url.sh` found a title,
  `lang=en`, one h1, main landmark, no missing img alt text, no unnamed
  buttons, and no console errors.
- **Performance:** live mobile Lighthouse on `/?demo=1` reported Performance
  100, Accessibility 100, Best Practices 100, SEO 100, LCP 0.8 s, CLS 0, and
  TBT 0 ms. See `evidence-polish-4-lighthouse.json`.

The warm paper, ink, cobalt, tangerine, serif/sans, halftone reading-margin
identity remains unchanged; this repair does not replace it with a generic
template.
