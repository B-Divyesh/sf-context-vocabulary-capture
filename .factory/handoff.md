# Review 1 handoff — FAIL

## What was done

Performed the adversarial first-read review against the live deployment in
fresh desktop and 390 px Chromium contexts. Read the product design, claims,
demo documentation, earlier verification records, handoff, source, README,
and tests. Wrote the complete evidence and copy audit to
`.factory/review-1.md`. No product code was changed.

## How to verify

```sh
npm ci
npm test
npm run lint
npm exec tsc -- --noEmit
npm run build
```

All commands pass. Each of the seven commands recorded in
`.factory/claims.json` also passed when run serially. Live demo verification
confirmed the direct demo entry, banner, sample queue, review, reset,
Start-for-real behavior, demo-only storage keys, and no outbound requests.

## Remaining work

The review verdict is **FAIL**, not a release acceptance. See
`.factory/review-1.md` for the six findings and exact fixes. The blocker is a
live `/missing` CSP violation that blocks its inline 404 stylesheet and leaves
that route outside the site shell. The remaining work is per-route metadata,
explicit claim coverage for the core source-context/compatibility promises,
consistent plain terminology, and a complete generated copy audit.
