# Polish 1 handoff — PASS

## Released repair

Repair implementation: `58b398c3e64eff7d727c7ea7b95b22a9986d87c5`.
It is pushed to `origin/main` and deployed to the configured production Azure
Static Web App (`sf-context-vocabulary-capture`) from `dist/site`.

The release resolves every finding in `.factory/review-1.md`:

- a fully branded, CSP-clean, HTTP 404 response now uses a same-origin stylesheet;
- SPA routes now set their own title, description, canonical, Open Graph, and
  Twitter metadata;
- source-context and regular-Chromium-page promises are listed in
  `.factory/claims.json` and tested through the real MV3 extension;
- the public noun is consistently **phrase**, and the first-screen/instruction
  wording is plain learner language;
- the copy audit is complete and counted correctly;
- local preview uses the production route/404 behavior so browser tests exercise
  the deployment behavior rather than Vite's permissive fallback.

`/demo` and `/?demo=1` remain one-click, isolated sample entry points with the
persistent demo banner, reset, and Start-for-real controls. The distinct
dithered reading-margin visual direction is unchanged; dark mode now follows
the documented ink-on-paper palette.

## Verification

From a fresh clone at `58b398c`, after `npm ci` (0 vulnerabilities):

```sh
npm run lint
npm exec tsc -- --noEmit
npm test
npm run build
```

All passed. `npm test` passed 4 unit and 10 Playwright tests. The production
build creates `dist/site`, `dist/extension/chrome-mv3`, and
`dist/site/downloads/keep-the-sentence-extension.zip`; the site JavaScript is
5.30 KB gzip and CSS is 2.73 KB gzip.

Every claim command in `.factory/claims.json` was also run independently from
that clean clone and passed:

```sh
npm run test:browser -- --grep @claim:csv-export
npm run test:browser -- --grep @claim:local-only
npm run test:unit -- --testNamePattern @claim:no-account
npm run test:browser -- --grep @claim:demo-sandbox
npm run test:unit -- --testNamePattern @claim:encrypted-storage
npm run test:browser -- --grep @claim:offline-review
npm run test:browser -- --grep @claim:source-context-capture
npm run test:browser -- --grep @claim:supported-chromium-pages
npm run test:browser -- --grep @claim:extension-download
```

Cold production checks at <https://context-vocabulary-capture.sociobot.in>
passed for `/`, `/demo`, `/privacy`, `/terms`, and `/missing` at 390 × 844:
correct route metadata, one h1, no overflow, no unexpected console error, demo
banner, and the 404 header/footer shell. `/missing` returns HTTP 404; the live
installer ZIP returns HTTP 200 and `unzip -t` reports no errors. Playwright axe
scans on all five live routes found no serious or critical violations. See
`.factory/polish-1.md` and its committed screenshots for the finding-by-finding
evidence.

## Run and deploy

```sh
npm ci
npm run dev             # extension development
npm run dev:site        # landing site
npm test
npm run build           # static deploy root: dist/site
```

No known gaps remain.
