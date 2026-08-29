# Verification 4 handoff — FAIL

**Work order:** `context-vocabulary-capture-verify-4`

**Tested candidate:** `f89d740863f880a87e5e0acbdd6ff7a8c2d63321`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

## Result

**FAIL — do not release.** The live deployment matches the candidate and all
11 declared claim tests pass, but two release blockers remain:

1. Selecting the second occurrence of a repeated phrase saves the first
   occurrence's sentences. This breaks the core source-context promise.
2. Dark-mode primary actions have 2.35:1 text contrast. Axe rates the failures
   serious on the home, demo, and 404 pages.

A P2 cache issue also remains: the stable hero filename is served with a
one-year `immutable` policy.

Full evidence, reproduction details, hashes, commands, and screenshots are in
[verification-4.md](verification-4.md).

## What was verified

- `npm ci`: PASS, 0 vulnerabilities.
- Every exact `.factory/claims.json` command: PASS (11/11).
- `npm test`: PASS, 6 unit/contract and 20 browser tests.
- `npm run lint`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; site, MV3 extension, and ZIP produced.
- `npm run test:copy`: PASS.
- Live-targeted site/copy suite: PASS, 14/14.
- Live artifact identity: root HTML, JS, CSS, and hero match by SHA-256;
  extracted extension ZIP contents match byte-for-byte.
- Fresh mobile Lighthouse: 98 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 0.9 s, CLS 0, TBT 170 ms.
- Desktop/390 px, keyboard, focus, reduced motion, light/dark axe, console,
  requests, privacy storage, headers, caching, 404, and link checks completed.

No product code was modified during verification. Only this handoff, the new
verification report, and QA evidence were added.

## Next steps

Fix the repeated-occurrence context algorithm and dark-theme action colors,
add regression coverage for both, correct the non-hashed asset cache policy,
then rerun every claim and the full independent verification matrix.
