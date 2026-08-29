# Polish 5 — cumulative remediation evidence

**Work order:** `context-vocabulary-capture-polish-5`
**Source repair:** `ba5077dce22ce417d70a2c7665fa779a7207269b`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Result

All findings from every available adversarial review and prior polish report are closed. The product retains its warm-paper, ink, cobalt, and halftone editorial identity; no remote font, tracker, or runtime AI service was introduced.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the CSP-clean static 404 with its shared header, footer, metadata, skip link, and home action. | Live `returns a CSP-clean, fully structured 404 response`; [404 screenshot](evidence-polish-5-live/not-found-mobile.png); [audit](evidence-polish-5-live/live-audit.json) records 404, h1/main, no errors. |
| F-1-2 | Retained route-specific title, description, canonical, Open Graph, and Twitter metadata for Home, Demo, Privacy, Terms, and 404. | Live `sets route-specific titles, descriptions, canonical URLs, and social metadata` passed. |
| F-1-3 | Retained real MV3 selected-phrase, nearby-sentence, and source-link capture with the Chromium regular-page boundary. | Clean-clone `@claim:source-context-capture` and `@claim:supported-chromium-pages` passed. |
| F-1-4 / F-5-5 | Rewrote runtime and static-404 footer text to **“Save phrases with source sentences. Review them later.”** | `uses literal phrase-review language and no generic provenance footer claim`; [home](evidence-polish-5-live/home-mobile.png) and [404](evidence-polish-5-live/not-found-mobile.png). |
| F-1-5 | Retained plain phrases-ready, saved-phrase, nearby-sentences, and meaning wording. | Clean-clone `npm run test:copy` passed. |
| F-1-6 / F-3-1 | Updated the complete rendered-copy/README audit and retained its mechanical coverage and word-count gate. | Clean-clone and live `copy audit matches every rendered landing label and every README prose line` passed. |
| F-2-1 | Retained cross-route `/#how` navigation, target focus, announcement, and Back behavior. | Live `routes How it works from every public page to the landing section and preserves back navigation`; [audit](evidence-polish-5-live/live-audit.json) records `#how` focus. |
| F-2-2 | Retained tested exact storage scope and no-analytics behavior. | Clean-clone `@claim:storage-scope` and `@claim:no-analytics` passed. |
| F-2-3 | Retained **Mark phrase as remembered** in demo and extension popup. | `@claim:demo-sandbox` passed; cold audit shows *quietly held* advancing to *recoger el hilo*. |
| F-4-1 | Retained demo namespace removal on route/full-page exit and real-data preservation. | `@claim:demo-discard-on-exit` passed; [audit](evidence-polish-5-live/live-audit.json) records no `demo:` keys after exit. |
| F-4-2 | Retained **Save and review a phrase in three steps.** | `npm run test:copy`; [home screenshot](evidence-polish-5-live/home-mobile.png). |
| F-4-3 | Retained **Privacy and data export** as the landing section name. | `npm run test:copy`; [home screenshot](evidence-polish-5-live/home-mobile.png). |
| F-4-4 | Retained explicit README heading **Try the sample demo**. | Clean-clone `npm run test:copy` passed. |
| F-4-5 | Retained **This page could not be found.** for SPA and static 404 routes. | Live structured-404 test; [404 screenshot](evidence-polish-5-live/not-found-mobile.png). |
| F-5-1 | Added first-screen **Free to download and use** and extended `extension-download` to prove a fresh visitor downloads the ZIP without account, checkout, or payment. | Clean-clone `@claim:extension-download lets a fresh visitor download the free extension ZIP without an account or payment`; [home screenshot](evidence-polish-5-live/home-mobile.png). |
| F-5-2 | Ignored only generated downloaded-bundle mirrors under `.factory/verification-evidence-*/live-files/**`; source remains linted. | Clean-clone `npm run lint` passed. |
| F-5-3 | Renamed preview label to **Phrase review**. | Literal-language regression test; [home screenshot](evidence-polish-5-live/home-mobile.png). |
| F-5-4 | Rewrote preview heading as **Review a phrase with its source sentence.** | Literal-language regression test; [home screenshot](evidence-polish-5-live/home-mobile.png). |
| F-5-6 | Removed the generic public generated-illustration line; provenance remains in `design.md`. | Literal-language test asserts absence on Home and 404; both live screenshots confirm it. |
| F-5-7 | Removed duplicated README source-context sentence. | Clean-clone `npm run test:copy` passed. |
| F-5-8 | Rewrote README demo copy as **“It keeps three sample phrases separate from your saved phrases.”** | Clean-clone `npm run test:copy` passed. |
| F-5-9 | Rewrote README storage copy as **“The extension encrypts your saved phrases and stores them only in Chromium.”** | Clean-clone `npm run test:copy` passed. |

## Clean-clone verification

A fresh clone of `origin/main` at `ba5077dce22ce417d70a2c7665fa779a7207269b` ran `npm ci`, then every exact command in `.factory/claims.json`. `csv-export`, `local-only`, `no-account`, `demo-sandbox`, `demo-discard-on-exit`, `encrypted-storage`, `offline-review`, `source-context-capture`, `supported-chromium-pages`, `storage-scope`, `no-analytics`, `extension-download`, and `unpacked-install` all passed.

`npm test` passed **8 Vitest and 31 Playwright tests**. `npm run test:copy`, `npm run lint`, `npx tsc --noEmit`, and `npm run build` also passed. Production site JavaScript is 16.58 KB (6.14 KB gzip), CSS is 9.69 KB (3.02 KB gzip), and the MV3 extension is 20.96 KB before packaging.

## Live verification

- `/opt/fleet/lib/deploy-static.sh context-vocabulary-capture dist/site` deployed Azure Static Web Apps deployment `cf31c50d-671a-429e-ae05-8bce3d5afd4f` and confirmed custom-domain HTTPS 200.
- `/opt/fleet/lib/verify-url.sh` recorded title, `lang=en`, one h1/main, image alt text, labelled controls, and zero console errors in [verify.json](evidence-polish-5-live-root/verify.json).
- `PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts`: **23 passed**, including mobile, keyboard, privacy, routing, metadata, 404, and Playwright Axe scans for both schemes.
- Cold checks in [live-audit.json](evidence-polish-5-live/live-audit.json) confirm 200 Home/Demo, 404 unknown route, no 390 px overflow or console errors, direct demo reset, demo exit clearing, and focused cross-route How-it-works navigation.
- Lighthouse mobile `/?demo=1`: **100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; FCP **0.77 s**, LCP **0.79 s**, TBT **0 ms**, CLS **0** in [the report](evidence-polish-5-live-lighthouse.json).

Catalog description: **“Save phrases with source sentences for later review in Chromium.”**
