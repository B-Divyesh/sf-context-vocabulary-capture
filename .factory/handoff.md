# Polish 2 handoff — PASS

**Repair commit:** `058371527c3479c470358c7545f83aed79c20938`
**Deployed URL:** <https://context-vocabulary-capture.sociobot.in>
**Deploy:** `/opt/fleet/lib/deploy-static.sh context-vocabulary-capture dist/site`

## What changed

- Repaired the cross-route **How it works** link. It now routes to `/#how`,
  focuses and announces that section, and restores the previous page heading
  on Back.
- Added tested `storage-scope` and `no-analytics` claims. The former decrypts
  a real extension vault and checks its exact record schema; the latter logs
  the capture, popup, and direct demo flow and permits only the product origin.
- Rewrote the privacy and README scope language to match those claims.
- Replaced every review action with **Mark phrase as remembered**.
- Regenerated the complete copy audit, updated the verb-first catalog line,
  preserved the isolated `?demo=1` sample path, and recorded the cumulative
  finding map in [polish-2.md](polish-2.md).

## Exact verification evidence

From clean clone `/tmp/context-vocabulary-capture-clean-YZf1Tp` after `npm ci`
(0 vulnerabilities), all passed:

```sh
npm run lint
npm exec tsc -- --noEmit
npm test                         # 4 Vitest + 16 Playwright tests
npm run build                    # dist/site and dist/extension/chrome-mv3
```

Every command in `.factory/claims.json` also passed independently from that
clean clone:

```sh
npm run test:browser -- --grep @claim:csv-export
npm run test:browser -- --grep @claim:local-only
npm run test:unit -- --testNamePattern @claim:no-account
npm run test:browser -- --grep @claim:demo-sandbox
npm run test:unit -- --testNamePattern @claim:encrypted-storage
npm run test:browser -- --grep @claim:offline-review
npm run test:browser -- --grep @claim:source-context-capture
npm run test:browser -- --grep @claim:supported-chromium-pages
npm run test:browser -- --grep @claim:storage-scope
npm run test:browser -- --grep @claim:no-analytics
npm run test:browser -- --grep @claim:extension-download
```

Fresh live Chromium verification at 390 × 844 covered `/`, `/demo`,
`/?demo=1`, `/privacy`, `/terms`, and `/missing`: expected HTTP statuses,
route titles/canonicals, one h1/main, no overflow, no unexpected console
errors, direct-demo banner/reset/separate `demo:` keys, action wording,
cross-route anchor focus/back behavior, and axe serious/critical = 0 for five
public routes. Screenshots: [demo mobile](evidence-polish-2-live-demo-mobile.png),
[privacy desktop](evidence-polish-2-live-privacy-desktop.png), and
[404 mobile](evidence-polish-2-live-404-mobile.png).

The production build is 5.35 KB gzip JavaScript, 2.76 KB gzip CSS, and uses a
74 KB WebP hero; all are inside the static budgets.

## Known gaps

None. The browser extension remains local-first and the static landing site
remains the deployment artifact; no external product API, tracking, paid flow,
or AI path was added.
