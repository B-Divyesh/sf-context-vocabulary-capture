# Adversarial review 4 handoff — FAIL

**Work order:** `context-vocabulary-capture-review-4`

**Reviewed candidate:** `d45b2a9d71d46f93593bab8412dc709f3a757a2f`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## What was done

Performed the required cold mobile/desktop review, complete landing/README
copy audit, live demo and storage-isolation exercise, all registered claim
tests from a clean clone, history regression check, route/link/metadata review,
light/dark accessibility scan, and missed-leverage assessment. No product code
was changed. The full result is in `.factory/review-4.md`.

## Result

**FAIL.** One blocking and four minor findings remain:

- `F-4-1` — changed demo data survives leaving through the header, contradicting
  the Privacy sentence that it is discarded when the visitor leaves. The
  general discard promise is also absent from `claims.json`.
- `F-4-2` — the How-it-works h2 is a slogan rather than a section name.
- `F-4-3` — “What it does not do” does not name the privacy/export content.
- `F-4-4` — the README heading “Try it” is unclear out of context.
- `F-4-5` — the 404 h1 uses an unexplained notebook metaphor.

The cold first screen, one-click sample view, Reset, Start-for-real isolation,
real-data preservation, claim suite, prior review repairs, routing, metadata,
link crawl, visual identity, and accessibility checks otherwise passed.

## How to verify

From a clean clone:

```sh
npm ci
npm test
npm run test:copy
npm run lint
npx tsc --noEmit
npm run build
PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts
```

All commands above passed in this review. Each of the 11 exact commands in
`.factory/claims.json` also passed independently.

To reproduce the blocker, open `/demo` in a fresh context, mark the first
phrase as remembered, use the header Privacy link, then use the header Demo
link. The demo returns on the second phrase because the changed `demo:` vault
was never cleared.

## Next steps

Clear ephemeral demo state on every exit path, add and test the missing
discard-on-exit claim, apply the four proposed heading rewrites, and rerun the
same clean and live matrices. `.factory/brief.json` is absent; restore it if
future scope or missed-leverage reviews need the researched opportunity.
