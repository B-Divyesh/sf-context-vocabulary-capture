# Polish 6 handoff — PASS

**Work order:** `context-vocabulary-capture-polish-6`
**Base reviewed:** `4a928b6c347a5e24c3aa2ae585947b5f8b974896`
**Product repair:** `376e64e8b8abd1918749345d7f2c46341a8840e7`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## What changed

- The shipped popup now says **regular web page**, matching the documented and
  tested Chromium boundary; its built-bundle test rejects the prior “any page”
  wording.
- The capture form now uses **meaning** in both label and placeholder; the
  built bundle rejects the prior “cue” terminology.
- README promises now describe only what is registered and tested. Its opening
  names the page link clearly, and its build instruction names the artifacts.
- Landing privacy wording consistently calls the stored/exported items **saved
  phrases**. The privacy metadata and copy audit follow the same vocabulary.
- The copy audit now contains the actual extension recovery text and tests it
  against the extension sources, preventing another silent audit drift.

## Verification

- Fresh clean clone at the product repair commit: `npm ci`, every one of the
  13 exact `claims.json` commands, `npm test` (8 Vitest + 32 Playwright),
  `npm run lint`, `npx tsc --noEmit`, `npm run test:copy`, and `npm run build`
  all passed.
- Deployed through `/opt/fleet/lib/deploy-static.sh` as deployment
  `5d94eabf-d7cc-45fa-b3e4-b8b0014d8899`; custom-domain HTTPS returned 200.
- `verify-url.sh` passed live: 779 ms load, correct title/lang/h1/main, no
  missing alt text or unnamed buttons, and no console errors. Evidence is in
  [evidence-polish-6-live-root](evidence-polish-6-live-root).
- Live route/demo/copy suite: 24 passed. Manual all-severity Axe scans of
  Home, Demo, Privacy, Terms, and 404 in light and dark schemes found zero
  violations. Mobile Lighthouse scored 100/100/100/100 with 0.8 s LCP.
- Cold live ZIP inspection confirmed the package is valid and contains neither
  `any page` nor `cue`; direct `/?demo=1` remained isolated with its banner,
  reset, and real-data exit.

## Known gaps and next steps

None. `.factory/brief.json` remains absent, so scope was assessed from the
README, implementation, and design thesis as recorded in the review. The
factory can deploy the committed static artifact normally.

See [polish-6.md](polish-6.md) for the finding-by-finding evidence map.
