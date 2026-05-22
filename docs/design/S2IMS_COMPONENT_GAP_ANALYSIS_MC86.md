# S²IMS Component Gap Analysis — MC86

**Companion to**: S2IMS_DESIGN_HANDOFF_INTAKE_REVIEW_MC86.md

**Inspected (read-only)**: src/components/shared/Button.tsx, StatusBadge.tsx, index.ts, theme.ts, tailwind.config.ts, and key routes via grep.

---

## Current Exported Shared Primitives (as of MC86 branch)

From `src/components/shared/index.ts`:
- Button (variants: primary, secondary, ghost, danger; sizes sm/md/lg; disabled/loading props)
- StatusBadge (statuses: success, warning, error, info, neutral, blocked, preview, disabled)

**Total**: 2 of the 18 components specified in the handoff component-contracts.md.

---

## Gap Matrix (Handoff Contract vs Current)

| Handoff Component | Required by Contract | Current State | Gap Severity | Phase to Close |
|-------------------|----------------------|---------------|--------------|----------------|
| Button | Extend with 'preview'|'disabled' variant + data-governance prop + warm surfaces + role accents | Has 4 variants; hard Tailwind colors; no preview variant; no data-governance | High | Phase 1 |
| StatusBadge | Use new --status-preview (distinct magenta-violet) + CSS vars | Already has 'preview' status (good); colors are Tailwind purple (collides) | High (visual safety) | Phase 1 |
| SafetyBanner | Permanent, non-dismissible, first element, 4 variants (preview/blocked/governance/evidence) | Not present | Critical (governance) | Phase 2 |
| DisabledActionHint | Inline/tooltip explaining why disabled + keep control visible | Not present (some disabled states exist but no standardized hint) | Critical | Phase 2 |
| RoleBadge | 6 role pills with icons + a11y | Not present (role info in TopBar but not reusable badge) | Medium | Phase 2 |
| PreviewOnlyNotice | Light preview tint callout | Not present (copy exists in screens) | High | Phase 2 |
| GovernanceBlockedNotice | Stronger blocked variant | Not present | High | Phase 2 |
| PageHeader / SectionHeader | Consistent h1 + safety banner slot | Ad-hoc headers | Medium | Phase 2 |
| MetricCard | Role/status aware cards | Some dashboard cards exist | Low-Medium | Phase 2/3 |
| DataTable shell | Consistent header/row/empty + PII ★ masking | Tables in many places (audit, staff, etc.) | Medium | Phase 2 |
| FilterBar | Horizontal filter control | Present in lists | Low | Phase 2 |
| FormField / FormShell | Consistent labels + states | Forms exist | Low | Phase 2 |
| FeedbackCaptureCard | Planning-feedback only card with explicit copy | MC27+ feedback components exist (diagnostic) | Low | Phase 2 |
| RouteVerificationPanel | Dev-only panel showing required safety state | Not present (MC75 route verification is docs) | Low (dev only) | Phase 2 |
| DocCompletenessRing | Circular progress for docs/evidence | Not present | Low | Phase 2 |
| Sidebar | Role-aware, blocked items visible | Exists (MC22/MC35) | Medium (refactor) | Phase 2 |
| TopBar | Global header with RoleBadge + safety indicators | Exists | Medium (refactor) | Phase 2 |

**Total new components to create in Phase 2**: ~12–14 (many are small presentational).

**Positive inheritance**:
- StatusBadge already anticipates the 'preview'/'blocked'/'disabled' semantic (from MC71+).
- Many screens already contain the required safety copy ("Preview only", "Recommendation not approval", "Blocked until future governance") from prior MC54/MC8/MC17/MC67 work.

**Risk**: The visual "personality" (warm paper, distinct preview violet, 14px radius, role OKLCH) is 0% present. Button/StatusBadge are the only shared primitives — everything else is duplicated or missing.

---

## Recommended Closure Order (for MC87)

1. Phase 0/1: Token alignment + Button/StatusBadge polish (no API break) — unlocks visual consistency.
2. Phase 2: SafetyBanner + DisabledActionHint + RoleBadge + PreviewOnlyNotice + GovernanceBlockedNotice + PageHeader/SectionHeader + Sidebar/TopBar refactor.
3. Then apply to Tier 1 screens (/login, audit-log, import-preview, staff/applications).

This order ensures governance enforcement primitives exist before any high-visibility screen is restyled.

**End of Component Gap Analysis — MC86**
