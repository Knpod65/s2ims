# S²IMS Implementation Phasing Plan — Soft Civic Intelligence Handoff

**Purpose**: Safe, incremental plan for adopting the new visual language without breaking governance, safety, or existing functionality.

**Location**: docs/figma-handoff/s2ims-soft-civic-intelligence/handoff/implementation-phasing-plan.md

**Golden Rule**: Every phase must pass full validation (build + tokens + audit checks + route smoke + screenshot regression) before the next phase begins. Rollback is always possible.

---

## Phase 0 — Token Alignment (Foundation)

**Goal**: Introduce the new CSS custom properties and Tailwind mapping as a non-breaking layer.

**Files Likely Affected**:
- `src/app/globals.css` (or new `src/styles/tokens.css` imported globally)
- Possibly a small addition to `src/config/theme.ts` for reference (no breaking changes)

**Risk**: Very Low

**Validation**:
- `npm run build` still 42/42
- `npm run check:tokens` 4/4
- `npm run check:audit-events` 502/502
- Route smoke 7×200 OK
- No visual change yet (tokens present but not applied)

**Rollback**:
- Delete the new token file / CSS block — zero impact

**What Not To Touch**:
- Any component implementation
- Any route
- `package.json`
- Font loading (IBM Plex strategy deferred)

**AP Boundary Notes**:
- No governance surface is modified in this phase
- Purely additive CSS variables

---

## Phase 1 — Polish Existing Button & StatusBadge (No API Break)

**Goal**: Refactor the current Button (MC71) and StatusBadge to support the new variant union and color tokens while keeping every existing call site working.

**Files Likely Affected**:
- `src/components/ui/Button.tsx` (or wherever the primitive lives)
- `src/components/ui/StatusBadge.tsx`
- Any storybook or test files that exercise these components

**Risk**: Low (API surface preserved)

**Validation**:
- All existing Button/StatusBadge usages still render correctly
- New variants (preview, blocked, etc.) render with correct colors
- `--status-preview` is visually distinct from `--status-warning`
- Full test + build + audit checks pass

**Rollback**:
- Revert the component files to the pre-phase commit

**What Not To Touch**:
- Any governance action behavior
- Any route that uses these components
- `package.json`

**AP Boundary Notes**:
- Preview variant added but not yet used on any live AP-10B surface

---

## Phase 2 — Build Core Safety & Navigation Primitives

**Goal**: Implement the new safety and layout components that every later phase depends on.

**Components to Create / Refactor**:
- SafetyBanner
- DisabledActionHint
- RoleBadge
- PreviewOnlyNotice
- GovernanceBlockedNotice
- PageHeader, SectionHeader
- Sidebar (refactor existing)
- TopBar (refactor existing)
- MetricCard, FilterBar, FormShell (as needed)

**Files Likely Affected**:
- New files under `src/components/safety/`, `src/components/layout/`, etc.
- Updates to existing Sidebar / TopBar

**Risk**: Medium (new components, but isolated)

**Validation**:
- All new components render in isolation (dev route or storybook)
- Screenshot regression against MC68 reference images (no regression on existing screens yet)
- Full validation suite passes

**Rollback**:
- Delete or revert the new component files — no route is using them yet

**What Not To Touch**:
- Any production route
- Any governance action
- Confirm Import, Export, Approve/Reject

**AP Boundary Notes**:
- These components are the enforcement layer for all ten governance rules
- They must be proven correct before any route consumes them

---

## Phase 3 — /login Visual Redesign

**Goal**: First public-facing surface to receive the full Soft Civic Intelligence treatment.

**Files Likely Affected**:
- `src/app/login/page.tsx`
- Any login-specific components

**Risk**: Low-Medium (public entry point, high visibility)

**Validation**:
- Build + tokens + audit checks
- Screenshot comparison vs MC68-001-login.png
- SafetyBanner (if required) + correct role selector treatment
- No change to authentication logic

**Rollback**:
- Revert the login page + any new components it pulled in

**What Not To Touch**:
- Auth logic
- Role persistence
- Any other route

**AP Boundary Notes**:
- Login must not imply any data will be saved or approved

---

## Phase 4 — /admin/audit-log Visual Polish

**Goal**: Highest-governance surface receives SafetyBanner + evidence treatment + preview/blocked colors.

**Files Likely Affected**:
- `src/app/admin/audit-log/page.tsx`
- Any table or filter components it uses

**Risk**: High (critical governance surface)

**Validation**:
- Permanent evidence SafetyBanner visible
- All status badges use correct new colors (preview vs warning distinction proven)
- PII masking verified for each role
- Full validation suite + screenshot regression vs MC68-003-admin-audit-log.png
- `npm run check:audit-events` still 502/502 (no new events introduced)

**Rollback**:
- Immediate revert of the audit-log page and any shared components it touched

**What Not To Touch**:
- Any audit write path
- Export controls (still disabled)
- Any new audit event types

**AP Boundary Notes**:
- This phase proves the evidence-boundary banner and preview color discipline

---

## Phase 5 — /admin/master-data/import-preview Visual Safety Polish

**Goal**: AP-10B gate surface receives the full locked + disabled + preview treatment.

**Files Likely Affected**:
- `src/app/admin/master-data/import-preview/page.tsx`
- Any parser or preview table components

**Risk**: Critical (AP-10B gate)

**Validation**:
- SafetyBanner ("AP-10B Gate — Preview Only") at top
- Confirm Import button permanently disabled with lock + DisabledActionHint
- Preview color used correctly and distinctly
- No persistence or audit write on file selection
- Screenshot regression vs MC68-005-admin-master-data-import-preview.png
- Full validation suite passes

**Rollback**:
- Immediate revert + security review

**What Not To Touch**:
- Confirm Import behavior (must stay disabled)
- Any persistence, backend, or audit write
- ExcelJS parsing logic

**AP Boundary Notes**:
- This is the single most important AP-10B enforcement surface
- Any regression here is a security incident

---

## Phase 6 — /staff/applications Visual Polish

**Goal**: Staff review queue receives safety overlays while preserving all existing MC8 / MC17 local-state behavior.

**Files Likely Affected**:
- `src/app/staff/applications/page.tsx`
- `src/app/staff/applications/[id]/page.tsx`
- Candidate review shell and feedback components

**Risk**: Medium-High

**Validation**:
- SafetyBanner on list and detail
- All actions that are not yet approved remain visibly disabled with hints
- Local review state (MC8) continues to work exactly as before
- Screenshot regression vs MC68-007 and MC68-008 images
- Full validation suite passes

**Rollback**:
- Revert the two staff application routes + any shared safety components

**What Not To Touch**:
- Local review state persistence (still local only)
- Any path that would create official evidence
- Any AP-10B / AP-11 action

**AP Boundary Notes**:
- All feedback remains planning-only
- "Reset Preview" (if present) must remain UI-only

---

## Phase 7 — /admin/dashboard Governance Command Center Polish

**Goal**: Admin overview surface receives governance status cards and safety treatment.

**Files Likely Affected**:
- `src/app/admin/dashboard/page.tsx`
- MetricCard, DataTable, SafetyBanner usage

**Risk**: Medium

**Validation**:
- Governance blocker status visible at top
- SafetyBanner present
- All metrics respect preview/blocked colors
- Screenshot regression vs MC68-002-admin-dashboard.png
- Full validation suite passes

**Rollback**:
- Revert the dashboard page

**What Not To Touch**:
- Any actual governance action enablement
- Any data that would imply AP-10B progress

**AP Boundary Notes**:
- Dashboard may surface blocker status but must never imply that blockers are cleared

---

## Phase 8 — Screenshot Regression QA & Final Sign-off

**Goal**: Final gate before any broader rollout. Every changed screen is compared against the MC68 reference set.

**Activities**:
- Automated or manual visual diff of all 31 MC68 screenshots
- Full validation suite (build, tokens, audit events, routes)
- Manual role-by-role walkthrough of every Tier 1 screen
- Governance boundary checklist (all 10 items) re-verified

**Risk**: Low (verification only)

**Validation**:
- Zero critical visual or governance regressions
- All new components pass accessibility audit
- No new audit events, no persistence, no AP gate openings

**Rollback**:
- Any phase that introduced a regression can be individually reverted

**What Not To Touch**:
- Anything outside the approved scope of the 8 phases

**AP Boundary Notes**:
- Final confirmation that none of the ten governance boundaries were violated

---

## Overall Constraints That Apply to Every Phase

- No change to `package.json` or dependencies
- IBM Plex font loading is a later CSS-only concern (not in Phase 0–8)
- No new audit event types
- No persistence, backend, or API work
- Confirm Import, Export, and Approve/Reject remain disabled
- All disabled actions remain visible with hints
- SafetyBanner is non-dismissible on every affected route
- Preview color is used only for AP-10B contexts

This phasing plan is the authoritative sequence for any future implementation of the Soft Civic Intelligence redesign.

**End of Implementation Phasing Plan**
