# Keep the Sentence — visual thesis

## Direction

**Dithered reading margin.** The product lives beside a reader's text, not above it. Its visual language borrows from a well-used paperback: warm stock, ink-black type, a cobalt editorial mark, and halftone dots that gather at the edge of a sentence. The dots represent a word becoming memorable only when its surrounding sentence stays attached.

## Tokens

- Background: `#f5f0e4` (uncoated paper)
- Surface: `#fffaf0` (page edge)
- Ink: `#171614`
- Muted ink: `#625d54`
- Cobalt: `#1647b7`
- Cobalt ink: `#ffffff`
- Tangerine: `#d85a2a`
- Success: `#176b4d`; warning: `#9a4d08`; danger: `#a02323`
- 1px ink rules, 3px offset cobalt shadows, 12px rounded but visibly printed corners
- 8px spacing scale; generous 48/72px section breaks. Dark mode uses `#171614` paper, `#25231f` surface, and `#f8f2e7` ink.

## Type and interaction

Display text uses the local system serif stack (`Georgia, Times`) to feel like source prose. Interface text uses the local system sans stack (`Arial, Helvetica`) for crisp controls. No network font is loaded. Selection-like cobalt underlines, dotted rule dividers, and a small stitched page-corner mark are the recurring shape language.

Capture cards arrive from the selected text's edge over 180ms. A saved card gets a short cobalt stamp flash. Under `prefers-reduced-motion`, both changes are instant. Focus rings are a 3px cobalt outline with paper offset.

## Art plan and provenance

One generated editorial hero illustrates a folded source page, a cobalt underline, and a cluster of ink dots escaping into a small review card. It contains no readable text or brands. It is used only as supporting art; all needed words remain HTML.

Prompt sheet: "Use case: illustration-story. Asset type: browser-extension landing hero. A tactile editorial collage of a cream paperback page with one cobalt underline, an orange paper tab, a tiny blank flashcard, and halftone ink dots travelling between them. Flat screen-print / risograph texture, warm paper, black ink, cobalt and burnt orange only, high contrast, no people, no logos, no text, no watermark, no gradients. Wide landscape with empty paper area."

Generated with the factory image deployment on 2026-08-28. The original raster is stored in `assets/src/` with its prompt sidecar. It was checked for text artifacts, brands, seams, and unintended symbols, then exported as a 74,024-byte WebP for the site.
