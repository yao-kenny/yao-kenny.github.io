# Design-System Walkthrough Report

## Design Conclusion

The product has a workable low-noise reading foundation: the fresh article URL is a dedicated page, the TOC is keyboard-toggleable, headings have stable anchors, copy feedback is announced, and the one-post previous/next state is correctly hidden. The main design-system risk is not one isolated control; it is a split contract between the current product direction and legacy implementation. The live cached home variant still exposes a modal, while the fresh route exposes the intended page. The stylesheet also retains dead modal rules and broad one-off values, making the system difficult to reason about and easy to regress.

Recommended work package: first establish one canonical runtime/version, then remove legacy modal surface and normalize tokens/spacing; next make article content semantic and theme state persistent; finally complete mobile and keyboard regression checks.

## Findings

### F-01 [Major] Runtime can still present the retired modal article surface

**Fact:** In the existing open home tab, clicking the article exposed `article-dialog` with backdrop and `关闭文章`; a fresh load of the same site exposed a link to the dedicated `post.html?slug=...` page.

**Judgment:** Runtime/version consistency failure and direct conflict with the user's explicit no-modal decision. The project contract still says native dialog, but that rule is superseded by the user's latest instruction.

**Impact:** A reader can receive two different reading models depending on cache/tab state, weakening URL semantics, back navigation and trust in the published result.

**Action / acceptance:** Make the deployed home bundle canonical and invalidate stale assets. Verify from a new tab and a hard reload that article entry is always a same-domain link and never creates `article-dialog` or a backdrop.

**Evidence:** `evidence/home/ax-state.txt`; `index.html:20`; legacy modal CSS in `styles.css:3,8-9`.

### F-02 [Major] Article body loses semantic content structure

**Fact:** The article runtime exposes most content as generic text nodes and containers. Lists, quotes, emphasis, links, tables and code are not represented as semantic elements. `post.js` classifies content by exact heading text and arrow/box-drawing heuristics.

**Judgment:** Content-model and accessibility failure, not merely typography.

**Impact:** Screen readers cannot reliably announce list structure; readers lose predictable scan landmarks; future posts using Markdown-like structure will render incorrectly or as plain paragraphs.

**Action / acceptance:** Store/render typed blocks (`heading`, `paragraph`, `list`, `quote`, `code`, `table`, `image`, `link`) or use a constrained Markdown renderer. Verify AX roles for headings/lists/code and visual parity on a representative article.

**Evidence:** `post.js:29-39`; article AX tree in `evidence/article/ax-state.txt`.

### F-03 [Major] Token and spacing discipline is not enforced

**Fact:** `styles.css` contains raw palette values, many non-grid spacing values (`9px`, `10px`, `14px`, `18px`, `22px`, `45px`), negative letter spacing, and direct shadow values. The stylesheet is minified into a base block plus appended overrides.

**Judgment:** System-level design debt against `DESIGN.md` token, 4px-grid and global semantic-token guidance.

**Impact:** Small changes can drift between surfaces; visual rhythm and typography are inconsistent; dead modal rules continue to influence maintenance decisions.

**Action / acceptance:** Refactor into readable layers: token definitions, base elements, product wrappers, page styles and responsive states. Replace feature-level raw values with `--cs-*` tokens and 4px increments; remove negative letter spacing unless explicitly approved.

**Evidence:** `DESIGN.md:5-21`; `styles.css:1-5,7-60`.

### F-04 [Major] Theme state is not continuous across navigation

**Fact:** Toggling dark mode updates the current page and accessible label, but navigating from home to the article page resets the document to light mode.

**Judgment:** Cross-page state continuity failure.

**Impact:** A reader in dark mode experiences an unexpected flash/context change when opening an article, especially disruptive during long reading sessions.

**Action / acceptance:** Persist the theme preference in a non-sensitive browser preference and apply it before first paint on both pages. Verify home -> article -> back and reload in both directions.

**Evidence:** Fresh home and article AX/screenshot sequence; `index.html:2`; `post.html:2`; `post.js:108`.

### F-05 [Major] Navigation labels do not describe distinct destinations

**Fact:** `Posts` and `Archive` both point to `#writing`/`index.html#writing`; no archive view exists.

**Judgment:** Information-architecture and action-contract ambiguity.

**Impact:** Users cannot form a reliable expectation from the header, and the navigation does not scale when the archive grows beyond the recent list.

**Action / acceptance:** Either remove Archive until it has a distinct destination, or implement a real archive route grouped by date/year. Ensure current-state styling follows the actual route.

**Evidence:** `index.html:14`; `post.html:14`; home AX tree nodes for Posts/Archive.

### F-06 [Minor] Iconography and visible shortcuts are inconsistent with the system

**Fact:** Theme, social and search affordances use glyphs (`◐`, `⌘`, `⌕`) and the article action shows `目录` without an `Alt+C` hint, while the reference makes shortcut help explicit.

**Judgment:** Discoverability and icon-system inconsistency.

**Impact:** Meaning depends on platform font rendering and prior knowledge; keyboard affordances are discoverable only by experimentation.

**Action / acceptance:** Use a consistent icon source or accessible text labels; expose the TOC shortcut in a tooltip/help affordance and keep names stable across light/dark states.

**Evidence:** `index.html:14,18,20`; `post.html:14,25`; reference AX tree node 18.

### F-07 [Minor] Loading and error states are visually present but operationally thin

**Fact:** Missing article ends with plain text `没有找到这篇文章。`; fetch failure shows a message but no retry action and no explicit status role.

**Judgment:** Incomplete state contract.

**Impact:** Users receive information but limited recovery or assistive-technology announcement.

**Action / acceptance:** Mark async state as a live status, distinguish network failure from missing content, and provide a retry or clear return action. Verify loading -> success, loading -> network error and missing-slug states.

**Evidence:** `post.html:19`; `post.js:85-100`; `evidence/error/ax-state.txt`.

### F-08 [Minor] Responsive contract is narrower than the project contract and not runtime-verified

**Fact:** Project contract says the editorial composition collapses below 800px; CSS switches at 640px, and no mobile screenshot was captured in this environment.

**Judgment:** Verification gap with likely breakpoint mismatch.

**Impact:** Tablet widths between 641-799px may retain desktop spacing/navigation behavior; long Chinese titles and header links remain unverified.

**Action / acceptance:** Align the breakpoint with the approved contract or document an exception, then run 390px and 768px screenshots covering header, title, TOC, content and footer.

**Evidence:** `DESIGN.md:30-34`; `styles.css:4,39,60`; `evidence/mobile/NOT_CAPTURED.txt`.

## Preserved Assets

- Dedicated article URL and browser title update.
- Stable heading IDs, TOC anchors and focus handoff.
- Keyboard `/` search focus and `Alt+C` TOC toggle.
- Copy feedback via an `aria-live` status node.
- One-article previous/next navigation correctly removed from layout.
- Semantic token layer and light/dark variable strategy exist as a foundation.

## System Work Orders

1. Canonicalize deployment and remove legacy modal code/assets.
2. Establish readable token and component layers with 4px spacing and approved typography.
3. Replace heuristic article rendering with typed semantic content blocks.
4. Persist theme state and define real navigation destinations.
5. Add mobile, reduced-motion, keyboard and async-state regression coverage.

## Evidence Boundary

This is a read-only walkthrough, not an implementation approval. The report intentionally does not change product code or publish a new deployment.
