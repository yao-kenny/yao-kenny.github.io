# Walkthrough Context Sources

| Source | Authority | Freshness | Relevance |
| --- | --- | --- | --- |
| User request and prior decisions in this task | Highest | Current turn | Read-only design-system walkthrough; dedicated article page; no modal |
| `DESIGN.md` | Project contract | Current worktree | Compact System tokens, typography, spacing, navigation and interaction rules |
| `/Users/yaocan.kenny/.codex/design/design.md` | Global design guide | Current local source | Semantic tokens, typography ladder, 4px spacing, states, accessibility and responsive verification |
| Live `https://yao-kenny.github.io/` | Runtime evidence | 2026-09-07 | Home, navigation, filters, theme and article entry |
| Live `https://yao-kenny.github.io/post.html?slug=enterprise-ai-world-model` | Runtime evidence | 2026-09-07 | Dedicated article page, TOC, copy feedback, error and one-article navigation |
| `https://lilianweng.github.io/posts/2026-07-04-harness/` | Visual/reference evidence | 2026-09-07 | Long-form article information hierarchy and interaction reference |

## Context Gaps

The repository has no product-design Level 0/1 constraint files. The canonical local directory also does not contain those files, so this walkthrough uses the project contract plus the global design guide and records Level 0/1 as unavailable rather than assuming compliance.

The browser session exposed two runtime variants: an already-open cached home tab still showed the former modal reading view, while a fresh load rendered the dedicated article link/page. This is recorded as a version/cache consistency finding, not treated as proof that every request receives the modal.
