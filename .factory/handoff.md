# Repair 5 handoff — local verification complete

**Work order:** `context-vocabulary-capture-repair-5`

**Repair base:** verifier report commit `df7af8eff377346d61e992ba749903234979f671`

**Candidate repaired:** `cb7f5bb412f99bd4d6e47e49ca02ab78fb0a6b58`

**Product:** Keep the Sentence — Chromium browser extension with static landing
site.

## Repaired findings

- Replaced the false browser-install assertion with four visible Chromium
  unpacked-install steps: download and extract the ZIP, open
  `chrome://extensions`, enable Developer mode, and choose **Load unpacked**.
  The page links to a plain installation guide, and the same `INSTALL.md` now
  ships inside the ZIP.
- Registered the new `unpacked-install` claim. Its regression test reads the
  public steps, downloads and extracts the package, checks the bundled guide,
  and starts the extracted directory as a fresh MV3 extension in Chromium.
- Replaced the dead unreadable-vault screen with an accessible recovery flow
  on both the landing site and popup. It lets the person download the raw
  product-owned values, requires confirmation before deletion, and clears only
  the relevant real or `demo:` namespace. A demo-corruption regression test
  proves the real namespace remains byte-for-byte untouched.
- Removed initial programmatic h1 focus. Cold page loads now begin at the body,
  so the first forward Tab reaches **Skip to content**. In-app navigation and
  Back/Forward still focus and announce the new route heading.

## Local verification

From a clean dependency install:

```sh
npm ci
npm test
npm run test:copy
npm run lint
npx tsc --noEmit
npm run build
unzip -t dist/site/downloads/keep-the-sentence-extension.zip
```

`npm ci` installed 272 packages with 0 vulnerabilities. `npm test` passed 8
Vitest tests and 30 Playwright tests. The copy audit, lint, TypeScript, and
production build passed. The ZIP integrity check passed and lists
`INSTALL.md`.

All 13 exact commands in `.factory/claims.json` passed individually, including
the new `@claim:unpacked-install` consumer test. Existing demo isolation,
offline review, source-context capture, AES-GCM storage, local-only traffic,
and Chromium capture claims remain covered.

The browser suite covers desktop, 390 px mobile, keyboard activation, cold
Tab order, reduced motion, dark/light axe checks, recovery-dialog axe checks,
offline popup reload, and request isolation. The local response check found no
console errors and confirmed title, `lang`, one h1, main landmark, alt text,
self-only CSP, `nosniff`, referrer policy, immutable fingerprinted assets, and
the installation guide response.

Local Lighthouse on `/demo` (Chromium) scored Performance 100, Accessibility
100, Best Practices 100, and SEO 100. LCP was 1,054 ms, CLS 0, and TBT 0 ms.
Evidence is in `.factory/evidence-repair-5-local-root/` and
`.factory/evidence-repair-5-lighthouse.json`.

## Deployment

The static deployment and live verification are recorded after the repaired
commit is pushed.

## Known gaps

None. `.factory/brief.json` was absent from the supplied candidate; the product
contract, existing visual thesis, verifier report, and passing behavior were
preserved.
