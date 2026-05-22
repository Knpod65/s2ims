# S²IMS Soft Civic Token Implementation — MC87

**Date**: 2026-05-21  
**Source**: docs/figma-handoff/s2ims-soft-civic-intelligence/handoff/design-tokens.json  
**Target**: src/config/theme.ts  

---

## What Was Implemented

All tokens below were added as TypeScript const exports in `src/config/theme.ts`.
They are additive — zero existing exports were modified.

### Colors

| Token | Value | Export path |
|-------|-------|-------------|
| surface.paper | `#FBFAF6` | `softCivicColors.surface.paper` |
| surface.warm | `#F4F0E6` | `softCivicColors.surface.warm` |
| surface.card | `#FFFFFF` | `softCivicColors.surface.card` |
| text.ink | `#1B1D1F` | `softCivicColors.text.ink` |
| text.muted | `#4A4E52` | `softCivicColors.text.muted` |
| text.link | `#2E5B8C` | `softCivicColors.text.link` |
| status.preview.base | `#6B3B8C` | `softCivicColors.status.preview.base` |
| status.preview.light | `#F3E9F8` | `softCivicColors.status.preview.light` |
| status.preview.text | `#4A2A5C` | `softCivicColors.status.preview.text` |
| status.blocked.base | `#5C5C5C` | `softCivicColors.status.blocked.base` |
| status.blocked.light | `#F0F0F0` | `softCivicColors.status.blocked.light` |
| status.blocked.text | `#3A3A3A` | `softCivicColors.status.blocked.text` |
| *(+ success/warning/error/info/disabled)* | see theme.ts | `softCivicColors.status.*` |

### Role Colors

| Role | Base | Light |
|------|------|-------|
| admin | `#3B2E7E` | `#EDE9F8` |
| staff | `#2E5B4A` | `#E8F1ED` |
| provider | `#8B5E2B` | `#F5EDE3` |
| student | `#2E5B8C` | `#E8EEF6` |
| esq | `#6B3B6B` | `#F3E9F3` |
| public | `#4A5B3A` | `#EEF2E8` |

All accessible via `softCivicRoles[role]`.

### Governance Colors

| AP Code | Base | Light | Text |
|---------|------|-------|------|
| AP-10B | `#6B3B8C` | `#F3E9F8` | `#4A2A5C` |
| AP-10C | `#8B5E2B` | `#F5EDE3` | `#5C3E1C` |
| AP-11  | `#8B3B3B` | `#F5E9E9` | `#5C2727` |

All accessible via `softCivicGovernance.ap10b` / `.ap10c` / `.ap11`.

### Radius

| Token | Value | Purpose |
|-------|-------|---------|
| small | `4px` | Small elements, tags |
| control | `8px` | Buttons, inputs |
| card | `14px` | Cards, panels |
| full | `9999px` | Pills, badges |

### Shadow

| Token | Value |
|-------|-------|
| soft | `0 2px 8px rgba(27, 29, 31, 0.08)` |
| medium | `0 4px 16px rgba(27, 29, 31, 0.12)` |
| strong | `0 8px 32px rgba(27, 29, 31, 0.16)` |

### Typography (metadata only)

Font family strings included as constants. No npm package installed.

| Font | Stack |
|------|-------|
| sans | IBM Plex Sans → system fallbacks |
| thai | IBM Plex Sans Thai → IBM Plex Sans → system fallbacks |
| mono | IBM Plex Mono → ui-monospace → system fallbacks |

Scale: xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24) 3xl(28) 4xl(32)  
Weight: regular(400) medium(500) semibold(600) bold(700)  
LineHeight: tight(1.2) normal(1.5) relaxed(1.7)

---

## IBM Plex Font Strategy

**MC87 position**: Font family strings recorded in `softCivicTypography.fontFamily` as metadata.
These are system-fallback stacks that work without the actual font files.

**Future milestone (MC88+)**: Add `@font-face` declarations in `globals.css` or load from
Google Fonts CDN with `font-display: swap`. Do NOT install IBM Plex as an npm package.
No `package.json` change is required or permitted for font loading.

---

## What Remains Future

- Tailwind config extension with Soft Civic CSS variables (deferred — requires tailwind.config.ts change approval)
- IBM Plex @font-face loading (CSS-only, MC88+)
- Page-level token application (MC88+ — one page at a time)
- MetricCard, DataTable shell, FilterBar, FormField, FeedbackCaptureCard (MC88+ components)
