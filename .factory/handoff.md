# Review 3 handoff — FAIL

**Reviewed candidate:** `bca7a3c12622e2f2c5a5370ad550f5ab003887b1`
**Live URL:** <https://context-vocabulary-capture.sociobot.in>

No product code was changed. The full adversarial report is in [review-3.md](review-3.md).

## Result

The live first read, one-click demo, privacy/request isolation, registered claims, route structure, accessibility, and visual identity passed. This review fails because prior finding **F-1-6** has regressed: the committed `.factory/copy-audit.md` omits visible landing controls and contains incorrect word counts.

## How verified

- Ran `npm ci`, every command in `.factory/claims.json`, `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`; all passed.
- Used fresh live Chromium contexts at 390 px and desktop, inspected the demo storage namespace and request log, crawled all discovered links, checked metadata and browser history/focus, and scanned five routes with axe.

## Next step

Regenerate `.factory/copy-audit.md` from rendered copy, including every visible control and README prose, correct the reported counts, and add a repeatable check to prevent future drift. Re-run the complete review after that documentation repair.
