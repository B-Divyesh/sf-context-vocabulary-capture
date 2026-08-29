# Polish 4 handoff — PASS

**Work order:** `context-vocabulary-capture-polish-4`

**Repair commit:** `5e99c29` (`fix: discard demo data on every exit`)

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Delivered

- Fixed the round-four blocker: Demo now deletes its isolated `demo:` vault
  and key whenever the visitor leaves Demo through **Start for real**, header
  navigation, `/#how`, browser Back, or a full-page navigation. Real storage
  is not read or changed. Returning to Demo seeds the original three samples.
- Added the registered `demo-discard-on-exit` claim and a real browser test
  that preserves a seeded encrypted real vault byte-for-byte while proving the
  changed sample cannot return.
- Rewrote all four flagged labels in plain language: the three-step section,
  privacy/export label, README demo heading, and static/SPA 404 h1.
- Regenerated the copy audit rows, refreshed demo documentation, and updated
  the catalog sentence to a verb-first 73-character description.
- Preserved all earlier repairs: source-context MV3 capture, isolated one-click
  demo, privacy claims, route metadata/focus/history, legal links, responsive
  layout, CSP-clean 404, cache policy, and dark-mode contrast.

See [polish-4.md](polish-4.md) for every historical finding mapped to its
repair and evidence.

## Verification

From a fresh clone of `5e99c29`:

```sh
npm ci
# Ran every exact command listed in .factory/claims.json, individually.
npm test
npm run test:copy
npm run lint
npx tsc --noEmit
npm run build
unzip -t dist/site/downloads/keep-the-sentence-extension.zip
```

Results: `npm ci` found 0 vulnerabilities; all 12 registered claim commands
passed; `npm test` passed 8 Vitest and 24 Playwright tests; copy audit, lint,
type check, production build, and ZIP integrity passed. Build output contains
`dist/site`, `dist/extension/chrome-mv3`, and the install ZIP. The landing
bundle is 13.92 KB (5.47 KB gzip), CSS is 8.77 KB (2.80 KB gzip), the extension
is 18.65 KB, and the original hero WebP is 74,024 bytes.

After deployment:

```sh
/opt/fleet/lib/verify-url.sh https://context-vocabulary-capture.sociobot.in .factory/evidence-polish-4-live-root
PLAYWRIGHT_BASE_URL=https://context-vocabulary-capture.sociobot.in \
  npx playwright test tests/browser/demo.spec.ts tests/browser/copy-audit.spec.ts
curl -fsS https://context-vocabulary-capture.sociobot.in/downloads/keep-the-sentence-extension.zip -o live.zip
unzip -t live.zip
```

`verify-url.sh` passed with no console errors. The cold live suite passed all
17 site/copy tests, including the changed-demo header exit, full navigation
exit, direct `?demo=1` route, reset/reseed, titles/metadata, focus/history,
404, mobile layout, privacy links, and light/dark axe checks. The live ZIP
returned HTTP 200 and passed integrity verification. Live JavaScript matched
the local deployed bundle by SHA-256. Lighthouse scores are Performance 100,
Accessibility 100, Best Practices 100, and SEO 100; LCP 0.8 s, CLS 0, TBT 0
ms.

Evidence is under `.factory/evidence-polish-4-live-root/`,
`evidence-polish-4-live-*.png`, and
`evidence-polish-4-lighthouse.json`.

## Deployment

Deployed `dist/site` with the static work-order configuration using
`/opt/fleet/lib/deploy-static.sh context-vocabulary-capture dist/site` after
the full test/build gate. The public landing bundle SHA-256 equals the local
production artifact.

## Known gaps

None. The researched `.factory/brief.json` was absent from the reviewed base;
scope validation used the committed product contract, README, visual thesis,
implementation, and all cumulative reviews.
