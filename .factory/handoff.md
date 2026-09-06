# Save phrases with their source sentence — review 9 handoff

**Work order:** `context-vocabulary-capture-review-9`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Implementation SHA:** `cd52ba72f4389a46628b5bdd39ca3708a973b0c8`

**Documentation SHA:** `9059a20b91df851a6c2c22543f28fca47ffce15a`

**Verdict:** **PASS — zero findings and zero untested claims.**

No product code was changed. Review 9 used a clean checkout, fresh desktop and
phone live browsers, and the downloaded live extension ZIP.

## Verified result

- All 14 exact claim commands passed independently.
- `npm test` passed 8 unit/contract and 33 browser tests.
- Lint, TypeScript, copy audit, build, ZIP integrity, and production audit
  passed.
- The 24-test live suite passed routes, links, demo isolation, history,
  keyboard, mobile, recovery, cache, and accessibility checks.
- All-severity Axe scans found zero violations on all public routes in light
  and dark modes.
- Lighthouse mobile scored 100/100/100/100. LCP was 1.25 s, TBT 0 ms, and CLS
  0.
- The live ZIP passed integrity and loaded in a fresh Chromium profile. A
  selected live-page phrase saved with its source context and appeared in the
  popup review. Full tests also cover invalid, boundary, keyboard, recovery,
  repeated-phrase, offline, and CSV paths.
- One-click Demo showed three realistic phrases, kept its persistent sample
  label, reset correctly, and did not create or modify real data.
- The expected unknown route returned the designed HTTP 404.
- Live files match the implementation candidate. The regenerated ZIP differs
  only in container metadata; extracted contents are byte-identical.
- Every earlier review and verification finding, including minor findings,
  was rechecked and is closed.

## Run again

```sh
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run test:copy
npm run build
unzip -t dist/site/downloads/keep-the-sentence-extension.zip
PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts --workers=2
```

The complete claim matrix, earlier-finding disposition, and evidence links are
in [review-9.md](review-9.md). Required external evidence is in
`/work/.evidence/`.

## Known gaps

None. The product has no backend, account, payment flow, remote user data,
site service worker, runtime AI, CLI, or desktop package, so checks specific to
those systems do not apply.
