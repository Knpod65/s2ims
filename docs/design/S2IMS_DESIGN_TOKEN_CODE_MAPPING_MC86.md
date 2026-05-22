# S²IMS Design Token Code Mapping — MC86

**Companion to**: S2IMS_DESIGN_HANDOFF_INTAKE_REVIEW_MC86.md  
**Purpose**: Detailed side-by-side mapping of every token in the Claude Design handoff (design-tokens.json + .css) to current implementation in src/config/theme.ts and tailwind.config.ts.

**Status**: Read-only analysis. No changes made.

---

## 1. Color Surfaces

| Handoff Token (CSS var) | Handoff Value | Current theme.ts | Current tailwind.config.ts | Gap | Priority |
|-------------------------|---------------|------------------|----------------------------|-----|----------|
| --surface-paper | #FBFAF6 (warm paper) | Not present (uses #F9FAFB / #FAF8FF) | bg-000: #FAF8FF, surface.DEFAULT: #FAF8FF | High — warm paper is the defining "Soft Civic" surface | Phase 0 |
| --surface-warm | #F4F0E6 | Not present | surface.low / muted are purple-tinted | High | Phase 0 |
| --surface-card | #FFFFFF | white | bright | None (matches) | — |
| --text-ink | #1B1D1F | gray-900 / ink.DEFAULT #0F172A (close but cooler) | ink-1 | Medium — warmer ink needed | Phase 0 |

**Finding**: Current palette is cool purple-tinted "daylight". New direction is warm paper + deep ink. Requires new surface scale in both theme.ts and Tailwind.

---

## 2. Role Accents (OKLCH Harmony)

Handoff defines 6 distinct OKLCH hues at consistent lightness/saturation:
- admin: 280 (deep purple)
- staff: 160 (teal-green)
- provider: 55 (warm brown)
- student: 240 (blue)
- esq: 320 (magenta)
- public: 130 (olive)

Current:
- theme.ts: no role colors (only generic primary/secondary).
- tailwind: role via CSS vars (--role-primary-hex etc.) set on [data-role] — excellent existing hook, but values not yet the new OKLCH set.

**Gap**: Role color system exists in Tailwind but is empty/placeholder. Handoff provides the exact values to populate the CSS vars.

**Recommendation**: In Phase 0, add the 6 role OKLCH + light tint values as CSS vars in a new tokens.css, then map to Tailwind role.* scale.

---

## 3. Status Colors (Critical: Preview vs Warning Distinction)

| Status | Handoff (new) | Current theme.ts statusColors | Current Tailwind / Badge | Gap |
|--------|---------------|-------------------------------|--------------------------|-----|
| success | emerald tones | emerald | emerald-100/800 | Minor |
| warning | amber | amber | amber-100/800 | Minor |
| preview | #6B3B8C magenta-violet + light | purple-100/800 (same hue family as secondary) | purple-100/800 in Badge | **Critical** — not visually distinct from warning in practice |
| blocked | gray-200/600 | blocked gray | gray-200/600 | Good |
| disabled | gray-100/400 | disabled | gray | Good |

**Finding**: StatusBadge.tsx already declares 'preview' status (good from MC71 lineage), but the color is Tailwind purple, which collides visually with the "preview" semantic the handoff wants to reserve exclusively for AP-10B (distinct magenta-violet).

**Action for Phase 1**: Update status preview classes to use the new --status-preview var (magenta-violet) and enforce in documentation that it is AP-10B only.

---

## 4. Radius System

| Handoff | Value | Current theme.ts | Current Tailwind | Gap |
|---------|-------|------------------|------------------|-----|
| --radius-small | 4px | sm: 4px | xs: 4px | None |
| --radius-control | 8px | md: 6px, lg: 8px | sm: 6px, md: 10px | Inconsistent |
| --radius-card | 14px | xl: 12px | lg: 16px, xl: 24px | 14px missing; current jumps from 12→16 |

**Finding**: Current radius is inconsistent across theme vs Tailwind. Handoff standardizes 14/8/4 for cards/controls/small.

**Recommendation**: Add exact 14/8/4 to both theme.ts radius and Tailwind borderRadius in Phase 0/1.

---

## 5. Typography & Fonts

Handoff: IBM Plex Sans + Thai + Mono as primary.

Current:
- theme.ts: mono declared as 'monospace', others generic.
- tailwind: fontFamily display/body/mono via CSS vars (--font-display, --font-body, --font-mono).
- No IBM Plex loaded yet (system fallback or limited usage).

**Gap**: Font strategy note in handoff: "CSS first, no npm package in Phases 0-8".

**Action**: Populate the CSS font vars with IBM Plex stack (or system fallback) via @font-face or Google Fonts in a later CSS layer after visual primitives are stable. Do not touch package.json for fonts in MC87.

---

## 6. Shadow & Motion

Handoff provides soft/medium/strong shadows and 120/200/320ms + easings.

Current theme.ts has sm/md/lg shadows (similar).

Tailwind uses standard.

**Gap**: Minor — can adopt the exact handoff values in Phase 0 for consistency.

---

## 7. Mapping Summary Table (for implementers)

| Handoff Concept | Target File(s) | Current State | Work Needed in MC87 |
|-----------------|----------------|---------------|---------------------|
| Warm paper surfaces | theme.ts + tokens.css + Tailwind | Cool purple scale | Add new surface-paper/warm tokens + update components |
| Role OKLCH accents | CSS vars on [data-role] + Tailwind role.* | Vars exist but empty | Populate 6 roles + light tints from handoff JSON |
| Preview distinct (magenta-violet) | StatusBadge + theme statusColors | Purple (collides) | Force --status-preview var, update docs |
| 14/8/4 radius | theme + Tailwind + all cards/controls | 4/6/8/12/16/24 | Standardize to handoff values |
| Button variants (preview/disabled + data-governance) | shared/Button.tsx | primary/secondary/ghost/danger only | Extend variant union + data attr |
| SafetyBanner / DisabledActionHint / RoleBadge etc. | New components in shared/ | Missing (only Button/StatusBadge exported) | Create 10+ new primitives in Phase 2 |
| IBM Plex fonts | CSS @font-face or link | System + limited | CSS layer only (post Phase 2) |

**No package.json changes** required or allowed in the first MC87 wave.

---

**End of Token Code Mapping — MC86**
