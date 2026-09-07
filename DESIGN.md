# Personal Notes Design Contract

## Direction

- Compact System-aligned personal blog: content first, scan-friendly, semantic and keyboard usable.
- Use the `--cs-*` semantic token layer for surfaces, text, borders, interaction fills and Accent.
- Keep the centered single-column reading layout, 4px spacing grid and 8px maximum content radius.

## Tokens

- `--cs-bg-*`: semantic elevation roles (base, body, content, card, modal).
- `--cs-text-*`: title, subtitle, body, describe and link roles.
- `--cs-fill-*`: hover, pressed and selected interaction fills.
- `--cs-border-*`: subtle, default and strong structural borders.
- `--cs-accent-*`: complete brand interaction state sequence.

## Typography

- Inter/system UI for all product text, with 12–14px UI sizing and 20px body line height.
- SFMono/Consolas for metadata, section indices, timestamps and keyboard hints.
- Display and Heading 1–3 sizes follow the Compact System typography ladder.

## Interaction

- Articles are persistent objects; opening one uses a native dialog with a focused reading view.
- Search is keyboard discoverable with `/`; filters update without navigation.
- Theme toggle maps the same semantic tokens to Light / Dark; no second stylesheet is maintained.
- All actionable elements have visible hover/focus affordances and keyboard access.

## Responsive behavior

- Two-column editorial composition collapses to one column below 800px.
- Feature media remains visible below feature copy on narrow screens.
- No fixed-width content or horizontally scrolling controls.
