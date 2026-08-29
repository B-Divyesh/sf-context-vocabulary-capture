# Independent verification 7 — PASS

**Candidate:** `402a96e5f2674b6f794f1fb2bcee3d111413c084`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Verified:** 2026-08-29 from the clean candidate checkout. Product code was
not changed.

## Verdict

**PASS — this candidate is ready to release.** The previously reported
deployment/install dead end does not reproduce. The live site matches this
candidate, gives complete unpacked-install instructions, distributes a valid
ZIP containing the guide, and the downloaded extension completes capture,
encrypted local storage, review, CSV export, and offline reload.

No P0, P1, P2, or P3 product defect was found.

## Mandatory first read and one-click demo

**PASS.** A cold browser read, before implementation inspection, answered all
three required questions on the first screen at desktop and 390 px:

- What: “Save phrases with their source sentence.”
- For whom: language learners reading web pages.
- First click: **Try it with sample data**, beside “Open sample phrases ready
  to review.”

At 390×844 the primary action ends at 519 px, inside the initial viewport.
One click opened `/demo`, immediately showing three realistic English,
Spanish, and German records. The persistent banner says “Demo — sample data,
nothing is saved” and includes **Reset demo** and **Start for real**. Only the
two `demo:` storage keys were created. The cold flow made only same-origin
requests and produced no console or page error.

## Claims gate

`.factory/claims.json` exists. Following the lockfile install, every exact
registered command was run individually through its configured browser/demo
entry point. All 13 passed:

| Claim | Result |
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
| `unpacked-install` | PASS |

The contract test also confirms unique IDs and exactly one tagged test for
each registered claim. Landing, legal, install, demo, and README statements
are covered by those claims; no contradictory or unlisted material product
claim was found.

Their individual logs and result table are in
`.factory/verification-evidence-7/claims/`.

## Clean local gates and production build

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 272 packages, zero audit vulnerabilities |
| `npm test` | PASS — 8 Vitest and 30 Playwright tests |
| `npm run test:copy` | PASS |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS |
| production ZIP `unzip -t` | PASS, including `INSTALL.md` |
| live site/copy suite | PASS — 22/22 against the public origin |
| factory `verify-url.sh` | PASS — 200, title/lang/main/alt/labels, no errors |

The exact production build emits `dist/site`, `dist/extension/chrome-mv3`, and
the downloadable extension ZIP.

## Independent product exercise

The downloaded live ZIP was extracted into a clean profile and loaded as the
only enabled MV3 extension. A normal phrase selection retained the selected
phrase, surrounding sentences, title, URL, language, and learner-written
meaning. The popup showed the saved item, exported a two-row CSV containing
the phrase/context/source, recorded a review, and reloaded while the browser
was offline.

Boundary, invalid, and recovery evidence:

- a blank/whitespace meaning is rejected with an actionable inline message;
- the meaning field enforces its 240-character boundary;
- a repeated phrase uses the selected occurrence's context;
- HTML-like input is rendered literally and creates no injected element;
- the capture dialog traps Tab, Escape closes it, and focus returns to the
  originating page control;
- corrupt real vault data offers raw-data download, a specific confirmation,
  Cancel preserves the values, and confirmation removes only product keys;
- corrupt demo data can be cleared without changing the real namespace;
- demo reset restores all three samples, and leaving demo discards its keys.

## Accessibility and responsive behavior

Independent axe scans covered `/`, `/demo`, `/privacy`, `/terms`, and the 404
response at 1280 px and 390 px, in light and dark themes: **zero serious or
critical findings**. Each route has `lang="en"`, one h1, one main landmark, no
missing image alt, no horizontal overflow, and no visible interactive target
under 44 px.

Cold keyboard order starts at **Skip to content**, Enter moves focus to main,
and the next Tab reaches the sample-data action. In-app route changes focus
and announce the new heading. Keyboard activation works for review, reset,
navigation, and recovery. Site and popup controls show a 3 px orange focus
ring. The native recovery dialog initially focuses Cancel, traps focus, and
returns focus to its trigger on Escape. Reduced-motion mode computes no
animation/transition duration, uses `scroll-behavior: auto`, and removes the
hover transform. A 200% text-layout check retained the headline and primary
action without lost content.

## Privacy, network, headers, and deployment identity

Fresh request logs for the landing/demo flow and the installed extension
capture/popup flow contain only the public product/source origin. Product
source contains no analytics, AI, billing, sign-in, or product API call. The
encrypted payload does not contain the clear phrase; decrypting it showed only
the documented record fields.

Live responses include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
referrer policy, and a self-only CSP with header-delivered
`frame-ancestors 'none'`. HTML and downloads revalidate after 30 seconds;
fingerprinted JS/CSS have one-year immutable caching; stable art revalidates.
Unknown routes return the designed page with HTTP 404. Normal routes and
product flows had no console/page errors; the deliberate 404 navigation
produced only Chromium's expected failed-resource message.

Candidate and live files match byte-for-byte:

- HTML: `4aec38c620c5721f56be8a811452abe02aa8c9b503aa22679e2defc5d184d4c8`
- JS: `1e64da9cc01a70a1777ae11fe0127d176e89b6beb7e0472f6f16d5fa6fa9e8cf`
- CSS: `1c223fb9ec64dea66bb4cbe27bf93f0f7c4bfa7cfe988520c5051fcc35a10738`
- hero WebP: `577133a35f72431ea15e1da1b77dfcbc2594f7a0da679258b74258a7eabef029`

The live and local ZIP containers may differ in archive metadata, but their
recursively extracted contents have no differences and both pass integrity
checks. This is sufficient build identity for the browser-extension artifact.

## Performance

Initial production assets are within budget: JS 16,609 B (6,199 B gzip), CSS
9,724 B (3,046 B gzip), and hero WebP 74,024 B. The extension totals 20.96 KB.

Fresh mobile Lighthouse 12.8.2 on live `/demo` scored Performance 100,
Accessibility 100, Best Practices 100, and SEO 100. FCP was 922 ms, LCP 994
ms, CLS 0, TBT 42 ms, and transferred bytes 10,715.

## Applicability notes and remaining gaps

This product has no backend/API, sign-in, payment/product-unlock request, AI
feature, site service worker, library, or CLI. API allowance/429/
`Retry-After`, Entra authority, backend concurrency/persistence/health,
payment, package-consumer, and PWA update checks are therefore not applicable.
Offline behavior belongs to the installed extension and passed.

`.factory/brief.json` is absent from the candidate. Verification used the
researched brief supplied in the work order plus `.factory/design.md`. This is
an informational repository gap, not a product defect because the complete
acceptance brief was available to this verification.

Detailed raw evidence is under `.factory/verification-evidence-7/`.
