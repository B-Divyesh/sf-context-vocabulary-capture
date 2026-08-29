# Independent verification 6 — FAIL

**Candidate:** `cb7f5bb412f99bd4d6e47e49ca02ab78fb0a6b58` (`cb7f5bb`)

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Verified:** 2026-08-29 from the clean candidate checkout. Product code was
not changed.

## Verdict

**FAIL — do not release this candidate.** The build, deployed bytes, declared
claim tests, demo, and installed extension behavior are healthy. The public
install path is not end to end, however: the live page says the browser will
ask the visitor to load the downloaded ZIP, but Chromium only downloads it.
The page gives none of the extraction, extensions-page, Developer Mode, or
Load unpacked steps, and the ZIP contains no instructions. That false,
unlisted install assertion and the resulting dead end violate the claims and
real-job acceptance contracts.

Two additional defects affect failure recovery and keyboard order.

## Mandatory first read and one-click demo

**PASS.** A cold, fresh desktop and 390×844 Chromium load answers all three
questions above the fold:

- What: “Save phrases with their source sentence.”
- For whom: language learners reading web pages.
- First action: **Try it with sample data**, followed by “Open sample phrases
  ready to review.”

The action is visible without scrolling at both widths and opens `/demo` in
one click. Three realistic English, Spanish, and German records appear with
the persistent “Demo — sample data, nothing is saved” banner. Space activates
review, Reset demo restores the first record, and Start for real removes both
`demo:` keys. The flow produced no console/page errors and contacted only the
deployed origin.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact registered command
was run individually through its configured demo/browser entry point. All 12
commands passed; the contract test confirms one tag per registered ID.

| Claim ID | Result |
| --- | --- |
| `csv-export` | PASS |
| `local-only` | PASS |
| `no-account` | PASS |
| `demo-sandbox` | PASS |
| `demo-discard-on-exit` | PASS |
| `encrypted-storage` | PASS |
| `offline-review` | PASS |
| `source-context-capture` | PASS |
| `supported-chromium-pages` | PASS |
| `storage-scope` | PASS |
| `no-analytics` | PASS |
| `extension-download` | PASS |

This does not clear the claims contract. The live install section additionally
asserts, “Your browser will ask you to load it as an unpacked extension during
this first release.” No claim entry or test covers that assertion, and the
observed result contradicts it. The registered `extension-download` test only
checks HTTP success, content type, and ZIP magic bytes.

## Release-blocking defect

### P1 — the public install flow ends at a ZIP and makes a false claim

On the live page, activating **Download extension ZIP** produced one download
named `keep-the-sentence-extension.zip`. The page stayed at `/`; there was no
dialog, popup, or next step. Loading that ZIP directly with Chromium's
`--load-extension` produced zero extension workers or background pages because
Chromium requires an extracted directory. The archive contains only the nine
runtime extension entries; it has no README or installation guide.

The necessary steps do exist in the repository README—extract the ZIP, open
the Chromium extensions page, enable Developer Mode, and select **Load
unpacked**—but the live product neither shows nor links them. A normal visitor
cannot complete the real browser-extension job from the distributed product,
and the statement that the browser will ask is false. This is also an
unlisted claim, which independently fails the claims acceptance rule.

## Other defects

### P1 — an unreadable real vault has no usable recovery path

I placed a malformed encrypted vault/key pair in the real local namespace and
reloaded `/`. The entire product was replaced with:

> Your local notes could not load. Reload this page. If it still fails, reset
> the demo and try again.

The only interactive element was the skip link. There was no reset, clear,
download-corrupt-data, Demo, Privacy, or home action. “Reset the demo” is
irrelevant to the damaged real namespace and is not actionable from this
screen. The product remains unusable until the visitor knows how to clear site
storage outside the product. This violates the required error-and-recovery
path. A corrupted demo namespace does self-heal on reload because page exit
discards it; the failure is specific to real data.

### P2 — cold-load focus skips the skip link and header navigation

The initial render programmatically focuses the `<h1>`. From a cold `/` load,
forward Tab order was: Try it with sample data → Try sample phrases → Download ZIP →
footer Privacy → footer Terms → Body → Skip to content → wordmark → header
Demo → How it works → header Privacy. Thus a keyboard user does not encounter
the skip link or header navigation until a complete page cycle. Focus rings
are visible and all controls are eventually reachable, but the initial order
does not follow the document order. Focus should move to the new heading after
client-side navigation, not on the initial document load.

## Local quality gates and extension QA

| Check | Evidence |
| --- | --- |
| Install | `npm ci` PASS; 272 packages, zero audit vulnerabilities |
| Full suite | `npm test` PASS; 8 Vitest and 24 Playwright tests |
| Copy | `npm run test:copy` PASS |
| Lint | `npm run lint` PASS |
| Types | `npx tsc --noEmit` PASS |
| Production build | `npm run build` PASS; emits site, MV3 directory, and ZIP |
| Live site suite | 17/17 site/copy Playwright tests PASS against the deployed URL |
| Factory URL check | PASS: title, `lang`, one h1, main, alt text, and no normal-route console errors |

The downloaded live ZIP was extracted and loaded into a clean Chromium
profile. Independent checks selected the second repeated `target`, captured
the correct harbour context, rejected a whitespace-only meaning, capped the
input at 240 characters, restored the source button's focus on Escape, saved
literal HTML-like text without executing it, rendered the popup with zero axe
serious/critical findings, and reloaded the review offline. Stored record
fields matched the documented scope. HTTP traffic stayed on the source origin.

## Deployment identity, privacy, and headers

Fresh candidate and live SHA-256 values match exactly for `index.html`, the
fingerprinted JS and CSS, and the hero WebP. The live and local ZIP containers
have metadata differences, but recursive comparison of their extracted files
found no differences and `unzip -t` passed. The prior deployment-only concern
does not reproduce: the candidate is deployed.

Observed hashes:

- HTML: `93326bf6915a18bdb1fc55eb6803566269dbdcd732494eb84adb1dd340797721`
- JS: `35fb84973124cf134e92fbf9074ab697223a5be5c6e9e7b7d0b134594811a8ba`
- CSS: `65adceceef67a76e5f282300f6058fecbb6deacf61a4dd26e02b0e3aea36b7e0`
- hero: `577133a35f72431ea15e1da1b77dfcbc2594f7a0da679258b74258a7eabef029`

Normal cold load, complete demo, and extension capture/popup traffic had no
third-party, analytics, or product-data request. Demo keys were isolated and
discarded. Responses include HSTS, `nosniff`, strict-origin referrer policy,
and a self-only CSP with header-only `frame-ancestors 'none'`. Fingerprinted
JS/CSS use one-year immutable caching; HTML and ZIP revalidate after 30
seconds; stable hero media uses `max-age=0, must-revalidate`. Unknown routes
return the designed page with HTTP 404.

There is no product backend/API, sign-in, paid-unlock request, AI request, or
web service worker. API allowance/429/`Retry-After`, Entra authority, backend
concurrency/persistence/identity, payment, and PWA update checks are therefore
not applicable. Offline behavior belongs to the MV3 extension and passed.

## Accessibility, responsive behavior, and performance

Independent axe scans of `/`, `/demo`, `/privacy`, `/terms`, and the 404 page
at 1280 px and 390 px, in both light and dark themes, found zero serious or
critical violations. Every route has `lang="en"`, one h1, one main, no
horizontal overflow, no undersized visible target, and no unexpected normal-
route console/page errors. Reduced motion computes `scroll-behavior: auto` and
zero hero animation duration. A 640 px layout, representing 200% zoom on a
1280 px viewport, retained the headline and CTA without horizontal overflow.

Bundles are within budget: JS 13,919 B (5,472 B gzip), CSS 8,774 B (2,810 B
gzip), hero WebP 74,024 B, and the extension 18,650 B. Fresh Lighthouse 12.8.2
on `/demo` scored Performance 100, Accessibility 100, Best Practices 100, and
SEO 100; FCP/LCP were 0.9 s, CLS 0, TBT 0 ms, and transfer 10 KiB.

## Required repairs

1. Replace the false install sentence with complete live extraction and
   Load-unpacked steps (or a real store install), and register/test every
   install claim. Link the steps beside the download; do not strand the user.
2. Give the unreadable-vault error a safe, explicit recovery path, including a
   confirmation before clearing local data and a way to preserve the damaged
   blob for support if practical.
3. Preserve body/skip-link focus on initial load; focus and announce the h1
   only after in-app route changes.
