# S²IMS Soft Civic Intelligence Foundation Primitives — MC87

**Branch**: feature/s2ims-soft-civic-foundation-primitives-mc87  
**Date**: 2026-05-21  
**Milestone**: MC87  
**Status**: Implementation complete — pending QA and merge

---

## Purpose

MC87 is the first visual implementation wave for the Soft Civic Intelligence design system.
It establishes the design-token foundation and reusable safety-governance primitives that
future page-level redesigns (MC88+) will build upon.

**Scope**: Additive token constants, internal visual polish on Button/StatusBadge, and seven
new shared components. No pages are migrated. No AP gates are opened. No persistence or
audit writes are introduced.

---

## Files Changed

### Runtime files

| File | Change |
|------|--------|
| `src/config/theme.ts` | Additive: 7 new exported token objects + 2 new types. All 8 existing exports unchanged. |
| `src/components/shared/Button.tsx` | Visual polish (variant colors → Soft Civic palette). Optional `apCode` prop added (backward-compatible). All existing props unchanged. |
| `src/components/shared/StatusBadge.tsx` | Internal color update using Soft Civic tokens. Preview → magenta-violet. Non-color icon signals added. All existing props unchanged. |
| `src/components/shared/index.ts` | Additive: 7 new component + type exports appended. Existing exports on same lines. |
| `src/components/shared/SafetyBanner.tsx` | NEW |
| `src/components/shared/DisabledActionHint.tsx` | NEW |
| `src/components/shared/RoleBadge.tsx` | NEW |
| `src/components/shared/PreviewOnlyNotice.tsx` | NEW |
| `src/components/shared/GovernanceBlockedNotice.tsx` | NEW |
| `src/components/shared/PageHeader.tsx` | NEW |
| `src/components/shared/SectionHeader.tsx` | NEW |

### Documentation files

- `docs/design/S2IMS_SOFT_CIVIC_FOUNDATION_PRIMITIVES_MC87.md` (this file)
- `docs/design/S2IMS_SOFT_CIVIC_TOKEN_IMPLEMENTATION_MC87.md`
- `docs/design/S2IMS_SAFETY_PRIMITIVES_CONTRACT_MC87.md`
- `docs/daily-reports/2026-05-21-s2ims-soft-civic-foundation-primitives-mc87.md`
- `docs/architecture/NEXT_RENOVATION_STEPS.md` (updated)

---

## Tokens Added (`src/config/theme.ts`)

New exports (additive — existing 8 exports unchanged):

- `softCivicColors` — surface (paper/warm/card/overlay), text (ink/muted/inverse/link), 7 status palettes
- `softCivicRoles` — 6 role palettes (admin/staff/provider/student/esq/public) with base+light hex
- `softCivicGovernance` — 3 AP gate palettes (ap10b/ap10c/ap11) with base+light+text
- `softCivicRadius` — small 4px / control 8px / card 14px / full 9999px
- `softCivicShadow` — soft / medium / strong with warm ink opacity
- `softCivicTypography` — font family strings (IBM Plex Sans/Thai/Mono), scale, weight, lineHeight
- `softCivicSpacing` — 8-unit grid spacing map
- `softCivicTheme` — aggregate of all above
- `SoftCivicRoleKey` type, `SoftCivicGovernanceKey` type

**IBM Plex Font strategy**: Font family strings included as metadata only.
No npm package installed. CSS-first (`@font-face` / Google Fonts) deferred to future milestone.

---

## Button Polish

**API preserved**: All props identical to MC71. No props removed or renamed.

Added: optional `apCode?: 'AP-10B' | 'AP-10C' | 'AP-11'` — forwarded as `data-ap-code` HTML
attribute. No behavior change in MC87. Enables future DisabledActionHint wiring.

**Visual changes** (internal only):
- `primary`: `bg-blue-500` → Soft Civic staff green `#2E5B4A`
- `secondary`: generic gray → warm paper `#FBFAF6` / warm border `#4A4E52`
- `ghost`: `hover:bg-gray-50` → warm paper `#F4F0E6`
- `danger`: unchanged (red kept for destructive actions)
- Focus ring color updated to civic green `#2E5B4A` for primary/secondary/ghost

---

## StatusBadge Polish

**API preserved**: All props (label, status, icon, size, className, aria-label) unchanged.
All 8 status values preserved.

**Visual changes** (internal only):
- `preview` → magenta-violet `#F3E9F8/#4A2A5C/#6B3B8C` (was purple-100/800/200)
  — now precisely distinct from warning amber
- `blocked` → soft civic gray `#F0F0F0/#3A3A3A/#5C5C5C` (was gray-200/600/300)
- `success/warning/error/info` → updated to Soft Civic warm tones from design-tokens.json
- `neutral/disabled` → unchanged

Non-color signals added: `preview` badge shows `○` icon, `blocked` shows `⊘` icon (aria-hidden).
Color is not the only meaning signal.

---

## Safety Primitives Created

7 new components in `src/components/shared/`:

1. **SafetyBanner** — full-width non-dismissible banner with tone (preview/blocked/warning/info),
   title, description, items, apCodes. `role="status"` `aria-live="polite"`.
2. **DisabledActionHint** — lock icon + reason text wrapping a disabled control.
   Control always visible. `role="note"`.
3. **RoleBadge** — role pill using softCivicRoles palette. Abbreviation non-color signal.
   `aria-label="Current role: {role}"`.
4. **PreviewOnlyNotice** — inline callout in preview palette. Thai/English bilingual defaults.
   `role="note"`.
5. **GovernanceBlockedNotice** — AP gate notice using softCivicGovernance palette. Lock icon.
   Default copy per AP code. Explicit "not currently approved" language.
6. **PageHeader** — `<h1>` semantic title, eyebrow, description, badge slot, actions slot.
   Warm paper styling.
7. **SectionHeader** — `<h2>` semantic heading, description, action slot.

---

## Governance Constraints Preserved

- Confirm Import (AP-10B) remains disabled — no page file changed
- Export (AP-10C) remains disabled — no page file changed
- Approve/Reject (AP-11) remains disabled — no page file changed
- No new audit event types introduced
- No persistence / browser storage / API calls in any new component
- No page migrations in MC87

---

## Validation Results

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Pass (42/42) |
| `npm run check:tokens` | ✅ Pass (4/4) |
| `npm run check:audit-events` | ✅ Pass (502/502) |
| Package changes | ✅ None |
| Page file changes | ✅ None |
| Browser storage introduced | ✅ None |
| API/network calls introduced | ✅ None |
| Audit writes introduced | ✅ None |

---

## Recommended Next Milestone

**MC88** — limited page integration. Begin with one low-risk page using the new primitives
(e.g., add SafetyBanner + PageHeader to /staff/applications list). Full rollback plan required.
Do not migrate /login or /admin/audit-log until MC88 baseline is proven.
