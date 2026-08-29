# Verification 6 handoff — FAIL

**Work order:** `context-vocabulary-capture-verify-6`

**Candidate:** `cb7f5bb412f99bd4d6e47e49ca02ab78fb0a6b58`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Result

**FAIL — do not release.** Fresh hashes and extracted ZIP contents prove the
live deployment is this candidate, so the earlier deployment-only concern is
resolved. The public install flow is nevertheless incomplete and misleading:
the CTA only downloads a ZIP, Chromium does not prompt or install it, the ZIP
has no instructions, and the live page omits extraction/Developer Mode/Load
unpacked steps while claiming the browser will ask. That sentence is also an
unlisted, untested claim.

Two other defects remain: malformed real local storage leaves a non-actionable
error with no recovery, and cold-load h1 focus makes forward Tab skip the skip
link and header navigation until the keyboard user cycles through the page.

Full evidence, severity, hashes, and reproduction details are in
[verification-6.md](verification-6.md).

## What passed

- Mandatory cold first-read and one-click isolated demo.
- All 12 exact `.factory/claims.json` commands after clean `npm ci`.
- `npm test` (8 Vitest + 24 Playwright), copy test, lint, TypeScript, and build.
- Downloaded/extracted live MV3 capture, repeated occurrence context, blank
  input recovery, 240-character boundary, Escape focus restoration, safe text
  rendering, offline popup reload, and axe smoke tests.
- Live route/link/cache/header/privacy checks and 17/17 live Playwright tests.
- Desktop/390 px, light/dark axe, reduced motion, and 200% desktop reflow.
- Lighthouse `/demo`: 100/100/100/100; LCP 0.9 s, CLS 0, TBT 0 ms.

## Re-run

```sh
npm ci
# Run each command in .factory/claims.json individually.
npm test
npm run test:copy
npm run lint
npx tsc --noEmit
npm run build
PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in \
  npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts
```

## Product changes

None. Verification changed only `.factory/verification-6.md` and this handoff.
