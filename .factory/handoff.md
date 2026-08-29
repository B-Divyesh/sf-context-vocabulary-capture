# Review 5 handoff — FAIL

**Work order:** `context-vocabulary-capture-review-5`

**Reviewed candidate:** `2358365c8611d4f30627d9e2ad3fb852cb5193f6`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Result

The adversarial review is complete and recorded in `.factory/review-5.md`.
The verdict is **FAIL** with nine findings: one blocking reopened terminology
finding, one missing first-screen price fact, one clean-clone lint regression,
and six other plain-copy issues. Product code was not changed.

The product itself remains clear and immediately tryable. The demo, sandbox,
registered claims, routing, metadata, accessibility checks, build, and tests
pass. All earlier findings except F-1-4 remain fixed in the deployed
implementation; F-1-4 was only half-fixed and is blocking again as F-5-5.

## Verification performed

From a separate clean clone:

```sh
npm ci
# Every exact command in .factory/claims.json, run independently
npm test
npm run test:copy
npm run lint
npx tsc --noEmit
npm run build

PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in \
  npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts
```

- All 13 registered claim commands passed.
- `npm test` passed 8 Vitest and 30 Playwright tests.
- The live route/copy/accessibility suite passed 22/22.
- `npm run test:copy`, TypeScript, and the production build passed.
- `npm run lint` failed with 74 errors in the committed downloaded bundle at
  `.factory/verification-evidence-7/live-files/assets/index-Dzjv1zer.js`.
- Fresh 390 px and desktop contexts confirmed the cold first read. One click
  opened realistic sample data with the persistent demo banner. Reset and
  demo-exit isolation passed, and the live request log stayed same-origin.
- The deployed hashed JS and CSS matched the clean build byte-for-byte.

## Known gaps and next steps

See F-5-1 through F-5-9 in `.factory/review-5.md`. Add a tested price fact,
exclude generated verification mirrors from lint (or stop committing them),
and apply the exact copy rewrites in the review. Then rerun the commands above
from a clean clone after all artifacts are committed.
