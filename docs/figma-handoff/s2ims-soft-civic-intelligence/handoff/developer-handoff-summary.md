# S²IMS Claude Design Developer Handoff Summary

**Bundle**: docs/figma-handoff/s2ims-soft-civic-intelligence/  
**Handoff Location**: handoff/  
**Date**: 2026-05-22  
**Status**: Documentation-only package complete. Implementation has **not** occurred.

---

## What This Handoff Is

This developer handoff package translates the "Soft Civic Intelligence" visual direction (generated through Claude Design Rounds 1–3) into actionable implementation guidance for the existing S²IMS Next.js codebase.

It is **not** a new design system project. It is a bridge between:
- Existing production routes and components (MC54 import-preview, MC8 candidate review, MC17–MC47 feedback synthesis, etc.)
- The new friendly, abstract, role-aware visual language defined in the Figma handoff bundle

The goal is to allow a future implementation team (or Claude Code session MC86) to adopt the new visual system **without breaking** current governance, safety, and accessibility constraints.

---

## Source Materials Used

- **Bundle root documents**:
  - README.md
  - 00_START_HERE.md
  - MANIFEST.md
- **Figma Prompts**:
  - FIGMA_MASTER_PROMPT.md
  - FIGMA_ROUND_1_DESIGN_SYSTEM_PROMPT.md
  - FIGMA_ROUND_2_CORE_SCREENS_PROMPT.md
  - FIGMA_ROUND_3_ROLE_JOURNEYS_PROMPT.md
- **Design Briefs (MC72)**:
  - S2IMS_FIGMA_REDESIGN_MASTER_BRIEF_MC72.md
  - S2IMS_ROLE_BASED_SCREEN_FRAME_PLAN_MC72.md
  - S2IMS_FIGMA_COMPONENT_LIBRARY_BRIEF_MC72.md
  - S2IMS_PAGE_LEVEL_DESIGN_PROMPTS_MC72.md
- **Routes & Journeys (MC68)**:
  - S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md
  - S2IMS_ROLE_BASED_USER_JOURNEY_MAP_MC68.md
  - S2IMS_SCREENSHOT_EVIDENCE_INDEX_MC68.md
- **Screenshots**: 31 reference images in 04_SCREENSHOTS/mc68-role-based-user-manual/
- **Governance Boundaries** (current S²IMS constraints documented in task context and existing architecture docs)
- **Claude Design Round Outputs** (Rounds 1–3) provided in this session:
  - Round 1: Design system tokens, color OKLCH palettes, typography (IBM Plex Sans + Thai + Mono), radius 14/8/4, abstract motifs, component library (Button, StatusBadge, SafetyBanner, etc.)
  - Round 2: Core screens (/login, /admin/dashboard, /admin/audit-log, /admin/master-data/import-preview, /staff/applications)
  - Round 3: Six role-based journeys (Admin Governance, Staff Review, Provider, Student, ESQ, Public Discovery)

---

## Soft Civic Intelligence Summary

**Core Visual Language**:
- Friendly, modern, abstract civic aesthetic (not corporate or bureaucratic)
- Warm paper surfaces (#FBFAF6 paper, #F4F0E6 warm card)
- Deep readable ink (#1B1D1F)
- Unified OKLCH role accent system (distinct hue per role, same lightness/saturation for harmony)
- 14 / 8 / 4 radius system (cards, controls, small elements)
- Preview actions use distinct magenta-violet (never confused with warning amber)
- Soft shadows, generous whitespace, high-contrast typography
- Abstract geometric motifs reinforcing "civic intelligence" themes

**Design Principles** (from MC72 master brief):
- Role clarity without visual overload
- Safety and governance boundaries must be immediately visible
- Disabled actions remain visible (never hidden)
- Preview-only and governance-blocked states are first-class citizens
- Thai + English bilingual support is non-negotiable

---

## Round 1 / 2 / 3 Summary

**Round 1 – Design System**:
- Complete token set (colors, typography, spacing, radius, shadow, motion)
- Base component library: Button (primary/secondary/ghost/danger/disabled), StatusBadge (8 states), RoleBadge, SafetyBanner, PreviewOnlyNotice, GovernanceBlockedNotice, DisabledActionHint, MetricCard, DataTable shell, FilterBar, FormField, FeedbackCaptureCard, RouteVerificationPanel, DocCompletenessRing, EmptyState, PageHeader, SectionHeader, Sidebar, TopBar

**Round 2 – Core Screens**:
- /login (role selector + safe entry)
- /admin/dashboard (governance command center)
- /admin/audit-log (evidence boundary + preview-only)
- /admin/master-data/import-preview (AP-10B locked, Confirm Import disabled)
- /staff/applications (review queue with safety overlays)

**Round 3 – Role Journeys**:
- Admin Governance journey (AP-10B/AP-10C/AP-11 blocked gates visible)
- Staff Review journey (local state + diagnostic preview only)
- Provider journey (upload → preview → feedback loop)
- Student journey (discovery → recommendations → applications)
- ESQ reviewer journey (recommendation-only outputs)
- Public discovery journey (read-only transparency views)

All journeys preserve the invariant: **no approval language, no persistence promises, no AP-10B clearance**.

---

## Safest Implementation Order

**Recommended sequence for MC86 or future implementation**:

1. **Token alignment first** (Phase 0) — no visual change, just CSS vars + Tailwind mapping
2. **Polish existing primitives** (Phase 1) — Button, StatusBadge (MC71/MC17 lineage) without API break
3. **Add safety/governance primitives** (Phase 2) — SafetyBanner, DisabledActionHint, RoleBadge, PreviewOnlyNotice, GovernanceBlockedNotice, PageHeader/SectionHeader, Sidebar/TopBar
4. **High-visibility public & login surfaces** (Phase 3) — /login visual redesign
5. **Audit & evidence surfaces** (Phase 4) — /admin/audit-log (highest governance visibility)
6. **Import preview safety polish** (Phase 5) — /admin/master-data/import-preview (AP-10B lock icon + DisabledActionHint)
7. **Staff review queue** (Phase 6) — /staff/applications (existing MC8/MC17 patterns)
8. **Admin command center** (Phase 7) — /admin/dashboard (governance overview)
9. **Screenshot regression QA** (Phase 8) — compare before/after against 04_SCREENSHOTS/

**Pages safest to implement first** (lowest risk, highest visibility of new language):
- /login
- /admin/audit-log
- /admin/master-data/import-preview (Confirm Import remains disabled)
- /staff/applications list + detail (existing safety copy already present)

**Pages that should wait** (higher risk or lower immediate value):
- Deep student/provider detail flows until core primitives and safety banners are proven
- Any new routes or navigation changes
- Anything touching export, confirm import, approve/reject, or audit write paths

---

## Non-Negotiable Governance Constraints

These are **hard requirements** that must survive any visual implementation:

1. Confirm Import on /admin/master-data/import-preview remains **permanently disabled** with lock icon + DisabledActionHint
2. Export actions (AP-10C) remain disabled with DisabledActionHint
3. Approve/Reject actions (AP-11) remain disabled
4. ESQ outputs are always labeled "Recommendation" — never "Approval"
5. SafetyBanner is permanent on every preview/blocked/governance route
6. PII is masked per viewer role with ★ indicator (never raw values)
7. Disabled actions are **visible** (never hidden)
8. --preview (magenta-violet) is reserved exclusively for AP-10B preview contexts
9. /admin/audit-log carries permanent evidence-boundary banner
10. No new audit event types are introduced by visual work
11. "Reset Preview" (if present) is strictly UI-only and writes no audit event

Any implementation that violates these constraints fails the handoff.

---

## Recommended Next Claude Code Milestone: MC86

**MC86** is the designated next step after this handoff package is complete:

- **Purpose**: Execute the developer handoff — align existing codebase with the new Soft Civic Intelligence visual system
- **Scope**: Token alignment → primitive polish → safety components → high-priority screen visual updates
- **Constraints**: Same as this task (docs-only until implementation branch is approved; no AP-10B/AP-10C/AP-11 opening; no persistence; no audit writes)
- **Validation**: Build 42/42, tokens 4/4, audit checks 502/502, route smoke 7×200 OK, screenshot regression against existing MC68 images

This handoff package is the authoritative input for MC86.

---

## Explicit Statement

**Implementation has not occurred.**

This package contains only:
- Documentation
- Design tokens (JSON + CSS)
- Component contracts
- Screen maps
- Governance notes
- Phasing plan

No source code, no runtime changes, no new dependencies, no UI commits, no Excel/DOCX/temp files, and no opening of any blocked governance gates (AP-10B, AP-10C, AP-11) have been performed.

The bundle and this handoff folder are ready for MC86 or any future approved implementation branch.

---

**End of Developer Handoff Summary**
