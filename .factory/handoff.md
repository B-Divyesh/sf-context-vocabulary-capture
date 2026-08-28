# Review 2 handoff — FAIL

## What was done

An independent, no-code-change adversarial review was run against the live
site and the current repository. The complete report is
`.factory/review-2.md`.

## How verified

After `npm ci` (zero vulnerabilities), these passed:

```sh
npm run lint
npm exec tsc -- --noEmit
npm test
npm run build
```

Each command in `.factory/claims.json` also passed independently. Fresh live
Chromium checks covered mobile 390 × 844 and desktop 1440 × 900, `/`, `/demo`,
`/?demo=1`, `/privacy`, `/terms`, and `/missing`; live axe scans found no
serious or critical issues. The one-click demo, demo storage namespace, reset,
Start-for-real behavior, request log, metadata, 404, and actual link targets
were checked.

## Known gaps / next steps

The release is **not accepted**. Fix the three findings in `.factory/review-2.md`:

1. `F-2-1` (blocking): make “How it works” point to `/#how` on every route
   and add cross-route navigation/back/focus coverage.
2. `F-2-2`: register and test the data-scope and no-analytics promises, or
   remove the unsupported promises from public copy.
3. `F-2-3`: change “I remembered it” to a result-naming action label.

No product implementation files were modified by this review.
