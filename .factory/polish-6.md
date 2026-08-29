# Polish 6 — complete repair evidence

**Work order:** `context-vocabulary-capture-polish-6`
**Reviewed candidate:** `4a928b6c347a5e24c3aa2ae585947b5f8b974896`
**Product repair commit:** `376e64e8b8abd1918749345d7f2c46341a8840e7`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

All findings in `review-1.md` through `review-6.md` and every earlier polish
record were checked again. The product remains a local-first MV3 extension
with its warm-paper, cobalt, ink, and halftone reading-margin identity.

## Finding map

| Finding | Change made or current verified state | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the real 404 shell, same-origin stylesheet, metadata, skip link, footer, and home action. | Live `https://context-vocabulary-capture.sociobot.in/missing-polish-6` returned 404; `returns a CSP-clean, fully structured 404 response`; [live 404](evidence-polish-6-live/not-found-mobile.png). |
| F-1-2 | Kept per-route title, description, canonical, Open Graph, and Twitter metadata. Privacy metadata now says “each saved phrase,” matching the public vocabulary. | Live `sets route-specific titles, descriptions, canonical URLs, and social metadata` passed; [verify result](evidence-polish-6-live-root/verify.json). |
| F-1-3 / F-6-1 | Replaced the extension’s unsupported “any page” instruction with “regular web page”; expanded the supported-Chromium claim’s where/sandbox data and its built-bundle assertion. | Clean-clone `@claim:supported-chromium-pages states and uses the regular Chromium web-page boundary`; live ZIP check found `regular web page` and rejected `any page`; live ZIP URL returned 200. |
| F-1-4 / F-5-5 / F-6-2 | Kept **phrase** for saved vocabulary and changed the capture placeholder from **cue** to **meaning**. Landing privacy and metadata now say “saved phrase”; the audit’s stale recovery rows were corrected. | Clean-clone built-extension test checks visible placeholder and rejects `cue`; live ZIP check found “Write a short meaning” and rejected `cue`; [live home](evidence-polish-6-live/home-mobile.png). |
| F-1-5 | Kept the direct source-context explanations and result-naming review action. | `works at 390px and with keyboard activation`; live demo suite passed; [live demo](evidence-polish-6-live/demo-mobile.png). |
| F-1-6 / F-3-1 | Rebuilt the extension portion of the copy audit with real recovery text and added source-to-audit assertions alongside the existing rendered landing/README coverage. | `copy audit matches every rendered landing label and every README prose line`; `copy audit keeps the documented extension boundary and meaning vocabulary`; `npm run test:copy` passed. |
| F-2-1 | Kept `/#how` cross-route navigation, focus movement, announcement, and Back restoration. | Live `routes How it works from every public page to the landing section and preserves back navigation` passed. |
| F-2-2 | Kept exact storage-scope and no-analytics claims with observable tests. | Clean-clone `@claim:storage-scope` and `@claim:no-analytics` passed. |
| F-2-3 | Kept **Mark phrase as remembered** in the review board and popup. | Clean-clone `@claim:demo-sandbox`; live 390 px keyboard check in the 24-test route suite. |
| F-4-1 | Kept demo namespace deletion on every demo exit while preserving real data. | Clean-clone `@claim:demo-discard-on-exit` passed; live direct demo and header-exit checks passed. |
| F-4-2 | Kept the concrete How-it-works heading. | Live focused `#how` route test passed. |
| F-4-3 | Kept **Privacy and data export** as the section name. | [Live home](evidence-polish-6-live/home-mobile.png); copy audit passed. |
| F-4-4 | Kept **Try the sample demo** as the README heading. | Clean-clone copy audit passed. |
| F-4-5 | Kept **This page could not be found.** on both 404 surfaces. | Live 404 check; [live 404](evidence-polish-6-live/not-found-mobile.png). |
| F-5-1 | Kept the first-screen price fact and free anonymous ZIP download. | Clean-clone `@claim:extension-download` passed; live landing download URL returned 200. |
| F-5-2 | Kept generated verification mirrors excluded while all source remains linted. | Clean-clone `npm run lint` passed. |
| F-5-3 | Kept **Phrase review** as the preview label. | `uses literal phrase-review language and no generic provenance footer claim` passed. |
| F-5-4 | Kept **Review a phrase with its source sentence.** as the preview heading. | `uses literal phrase-review language and no generic provenance footer claim` passed. |
| F-5-6 | Kept generated-asset provenance in `design.md`, not as generic visitor copy. | Literal-language regression test passes on Home and 404. |
| F-5-7 | Kept the redundant README workflow sentence removed. | Clean-clone copy audit passed. |
| F-5-8 | Kept sample separation in plain language rather than implementation jargon. | Clean-clone copy audit passed. |
| F-5-9 | Kept encrypted Chromium storage in plain language. | Clean-clone copy audit passed. |
| F-6-3 | Replaced the broad, untested “No account or network service is needed” with **No account is needed.** | `@claim:no-account` passed from the clean clone; README audit passed. |
| F-6-4 | Replaced the unsupported “reproducible deployment” promise with the concrete build output instruction. | README now says “Run npm run build to create dist/site and the extension ZIP”; copy audit passed. |
| F-6-5 | Replaced the landing’s competing **records** copy with **Each saved phrase… Export saved phrases as CSV.** | Live cold landing assertion; [live home](evidence-polish-6-live/home-mobile.png). |
| F-6-6 | Rewrote the README opening so the phrase is saved with nearby sentences and the page link. | Clean-clone copy audit passed; the updated sentence is 21 words. |

## Verification

- A fresh local clone at `376e64e8b8abd1918749345d7f2c46341a8840e7` ran
  `npm ci`, then every exact `claims.json` command independently: all 13
  claims passed.
- The same clone passed `npm test` (8 Vitest and 32 Playwright tests),
  `npm run lint`, `npx tsc --noEmit`, `npm run test:copy`, and `npm run build`.
  The built site JavaScript is 16.59 KB (6.13 KB gzip); CSS is 9.69 KB
  (3.02 KB gzip); the MV3 extension is 20.97 KB before ZIP packaging.
- Deployment `5d94eabf-d7cc-45fa-b3e4-b8b0014d8899` published the verified
  `dist/site` through `/opt/fleet/lib/deploy-static.sh`.
- Cold live `verify-url.sh` passed with one h1/main, `lang=en`, title, alt
  text, labelled buttons, and zero console errors. Its measured load was 779 ms.
- `PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in npx
  playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts
  --workers=3` passed all 24 live route/demo/copy/accessibility tests.
- A fresh manual Axe scan found **zero violations at every severity** across
  Home, Demo, Privacy, Terms, and 404 in both light and dark mobile contexts.
- Mobile Lighthouse on `/?demo=1`: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP **0.8 s**, LCP **0.8 s**, TBT
  **0 ms**, CLS **0**. See [report](evidence-polish-6-live-lighthouse.json).

## Final live re-check

From cold contexts, `/?demo=1` opened the isolated three-phrase sample with
the persistent banner, **Reset demo**, and **Start for real**. The live ZIP
was valid, contained the regular-web-page wording and “Write a short meaning,”
and contained neither `any page` nor `cue`. The landing used only saved-phrase
wording in the privacy section. The unknown route retained its styled 404.
No current finding remains.
