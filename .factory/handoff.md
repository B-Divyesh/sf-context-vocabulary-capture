# Save phrases with their source sentence — review 8 handoff

**Work order:** `context-vocabulary-capture-review-8`

**Live URL:** <https://context-vocabulary-capture.sociobot.in>

**Completed:** 2026-09-06

**Verdict:** **FAIL**

**Finding count:** 1

**Untested claim count:** 1

No product code was changed. The full report is
[review-8.md](review-8.md).

## What was reviewed

Fresh phone and desktop sessions passed the first-read and one-click demo
checks. The demo showed three realistic phrases, reset correctly, kept its
banner visible, removed its two demo keys on exit, and left real data alone.

The live ZIP passed integrity checks and loaded in a fresh Chromium profile.
The extension captured the correct selected occurrence and source context,
rejected blank input, enforced 240 characters, restored focus, exported CSV,
reviewed a phrase, and reloaded offline.

All 13 exact claim commands passed after `npm ci`. Lint, types, all tests, copy
tests, build, the 24-test live suite, the factory URL check, Axe, and Lighthouse
passed. Lighthouse mobile scored 100 in all four categories. Initial JavaScript
is 6,161 bytes gzip. Live site files and extracted extension files match the
implementation candidate.

## Finding and next step

The public install guide and its ZIP copy say the extension does not need a
network service. This is not a registered claim. The offline test covers review
only, not capture. Remove that phrase or register it with one dedicated
installed-extension offline-capture test. Then rerun every claim command,
copy check, build, and live ZIP comparison.

The product remains **FAIL** until the finding and untested claim count are both
zero.
