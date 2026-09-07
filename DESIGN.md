# Personal Notes Design Contract

## Direction

- Content-first personal publishing space inspired by quiet editorial layouts and macOS restraint.
- No gradients, glass effects, fake desktop chrome, or card-wall composition.
- Use warm paper as the page base, ink for reading surfaces, and one terracotta accent for focus and links.

## Tokens

- `--paper`: page background and dialog surface.
- `--ink`: primary text and feature surface.
- `--muted`: secondary text and metadata.
- `--line`: hairline separators.
- `--accent`: active state, links, and status marker.

## Typography

- Newsreader for editorial headings and reading copy.
- Plus Jakarta Sans for navigation and UI labels.
- DM Mono for metadata, section indices, and timestamps.

## Interaction

- Articles are persistent objects; opening one uses a native dialog with a focused reading view.
- Search is keyboard discoverable with `/` and filters update without navigation.
- All actionable elements have visible hover/focus affordances and keyboard access.

## Responsive behavior

- Two-column editorial composition collapses to one column below 800px.
- Feature media remains visible below feature copy on narrow screens.
- No fixed-width content or horizontally scrolling controls.
