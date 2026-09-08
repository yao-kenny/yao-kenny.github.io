# Case Rundown

## User Story

As a reader, I want to enter the blog, open a long article, scan or jump through its sections, copy its URL, and return to the article list without losing context.

## Experience Intent

- Focused, calm, readable and controllable.
- Content-first editorial rhythm with low-noise controls.
- No modal full-article reading; article reading uses a dedicated URL/page.

## Core Flow

1. Home -> article card/link.
2. Article page load and metadata/title review.
3. Open and close the table of contents.
4. Jump to a section and preserve heading focus.
5. Copy/share the article URL and observe feedback.
6. Return to the list with browser/back or the explicit return link.
7. Read at a narrow viewport and in light/dark themes.

## Objects And States

- Article: list item, loading, loaded, missing/error.
- TOC: collapsed, expanded, section target focused.
- Navigation: one-article hidden state; multi-article previous/next state is context-only because only one post exists.
- Theme: light and dark.
- Input: search idle/focused, tag selected, no-match empty state.
- Focus: keyboard entry, card/link, TOC toggle, copy action, section heading.

## Evidence And Boundaries

- Evidence: live site, fresh article URL, reference article, source files and project contract.
- Read-only only: no publish, edit, delete, upload, form submission or external action.
- Out of scope: CMS/backend, security, performance, deployment pipeline and content-authoring workflow.
