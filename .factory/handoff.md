# Keep the Sentence handoff — PASS

## Accepted candidate

Independent verification accepted commit
`87032cb75598c4939c146c8538ba054a6e560ff5` on 2026-08-28 for
https://context-vocabulary-capture.sociobot.in. The full evidence is in
`.factory/verification-2.md`.

The prior capture and deploy failures are resolved: a real Chromium MV3 flow
now captures a selection, rejects an empty meaning, saves a cue and context,
reviews it in the popup while offline, and exports CSV. The live installer is
HTTP 200 and its contents are byte-identical to the freshly built package.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm exec tsc -- --noEmit
npm run build
npm audit --omit=dev
```

All seven exact commands in `.factory/claims.json` also pass when run
independently. The static deploy root is `dist/site`; the extension package is
`dist/site/downloads/keep-the-sentence-extension.zip`.

## Verification summary

- **PASS:** unit, browser, type, lint, production build, package integrity,
  and production dependency audit (0 vulnerabilities).
- **PASS:** cold first-read, one-click isolated demo, CSV export, encrypted
  local storage, no account, and offline popup review.
- **PASS:** live candidate hashes match the built HTML/CSS/JS; live extension
  archive contents match the built package; routes and all discovered internal
  links work.
- **PASS:** desktop and 390px mobile, keyboard flow, visible focus,
  reduced-motion behavior, zero axe serious/critical findings, no browser
  console/page errors, same-origin-only requests, CSP and security headers.
- **PASS:** live Lighthouse `/demo`: Performance 100, Accessibility 100,
  FCP 0.8 s, LCP 0.9 s, CLS 0, TBT 30 ms.

## Known gaps / next steps

None found. This is a local-first browser extension with no product API,
sign-in, payment flow, or service worker; rate limiting, Entra validation, and
PWA update testing do not apply.
