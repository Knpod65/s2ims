# MC70 Wave 1 Implementation Sequence: Shared UI Primitives

**Status**: MC70 Planning Phase — Ready for MC70 QA Review  
**Created**: 2026-05-21  
**Purpose**: Define safe, sequenced implementation plan for Wave 1 component extraction — for future MC71 reference only

---

## IMPORTANT: MC70 SCOPE BOUNDARY

**MC70 is documentation-only.** This document:
- ✅ Defines a future implementation sequence for MC71 reference
- ✅ Specifies verification gates, rollback procedures, and success criteria
- ❌ Does NOT create any source files, components, or test files
- ❌ Does NOT create src/config/theme.ts or any src/* files
- ❌ Does NOT start MC71 implementation
- ❌ Does NOT modify runtime behavior, routes, or navigation

All file paths listed in this document are **future MC71 candidate files only**. They are not created in MC70.

MC71 implementation may only begin after explicit approval.

---

## Executive Summary

Wave 1 implementation sequence covers 8 phases with verification gates between each phase. This document specifies:
- Safe sequencing based on component dependencies
- Verification gates (build, tests, accessibility) before proceeding — future MC71 gates only
- Rollback decision points (when to rollback component vs full wave)
- Stop conditions triggering rollback
- MC71 readiness checklist for implementation kickoff

---

## Scope

**In Scope for Future MC71 Implementation** (not performed in MC70):
- Create 5 core components (Button, StatusBadge, DataTable, FormShell, DashboardShell)
- Create supporting utilities (hooks, types, theme config)
- Update 35+ files to use new components
- Create comprehensive test coverage
- Verify accessibility (WCAG 2.1 AA)
- Perform visual regression testing

**Explicitly NOT Modified in MC70**: src/*, tools/*, scripts/*, package.json, package-lock.json. MC70 creates no source files and no components. All listed src/* files are future MC71 candidates only.

**Not In Scope for MC70 or MC71**:
- Modifying route behavior
- Enabling AP-10B/AP-10C/AP-11 gates
- Creating real persistence/backend
- Writing audit events
- Enabling Confirm Import

---

## Dependency Graph

```
Phase 0: Foundation (future MC71 candidate action — not performed in MC70)
  ↓
Phase 1: Button (future MC71 candidate action — not performed in MC70)
  ↓
Phase 2: StatusBadge (future MC71 candidate action — not performed in MC70)
  ↓
Phases 3-4: DataTable & FormShell (future MC71 candidate actions — not performed in MC70)
  ↓
Phase 5: DashboardShell (future MC71 candidate action — not performed in MC70)
  ↓
Phase 6: File Updates (future MC71 candidate action — not performed in MC70)
  ↓
Phase 7: Testing & Accessibility (future MC71 candidate action — not performed in MC70)
  ↓
Phase 8: Visual Regression (future MC71 candidate action — not performed in MC70)
```

**Key Rule**: Never proceed to next phase if current phase fails verification.

---

## Phase 0: Foundation & Baseline Verification

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 candidate files** (not created in MC70):
- `src/config/theme.ts` — Design token configuration (colors, spacing, typography, breakpoints)
- `src/components/shared/index.ts` — Shared exports

**MC70 Baseline Verification Commands** (these DO run in MC70 Phase 3 validation):
```bash
npm run build        # Must show 42/42 routes
npm run check:tokens # Must show 4/4 sections
npm run check:audit-events # Must show 502/502 events
```

**Future MC71 Stop Condition**: If any validation fails at MC71 Phase 0, do not proceed to Phase 1.

**Future Effort Estimate**: 2-3 hours (MC71 only)

---

## Phase 1: Button Component Implementation

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 candidate files** (not created in MC70):
- `src/components/buttons/Button.tsx` — Button component with variants/sizes/states
- `src/components/buttons/index.ts` — Export Button
- `src/types/button.ts` — Button props interface
- `src/components/buttons/__tests__/Button.test.tsx` — Unit tests
- `src/components/buttons/__tests__/Button.a11y.test.tsx` — Accessibility tests
- `tests/visual-regression/Button.snap` — Screenshot baseline

**Contract Reference**:
- See `S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md` Section 2 for full Button contract
- Props: variant (primary/secondary/danger/ghost), size (sm/md/lg), disabled, loading, icon, onClick
- States: normal, hover, focus (2px outline), disabled, loading
- Keyboard: Tab for focus, Enter/Space to activate
- ARIA: role="button", aria-label, aria-disabled, aria-pressed

**Future MC71 Validation Gate** (not applicable in MC70):
```bash
npm run build        # Must compile with 42/42 routes
npm run test         # All tests must pass — future MC71 validation candidate only
npm run check:tokens # Must pass (4/4)
npm run check:audit-events # Must pass (502/502)
```

Note: `npm run test` and `npm run test:visual` are future MC71 validation candidates only. MC70 validation uses only `npm run build`, `npm run check:tokens`, and `npm run check:audit-events`.

**Future Effort Estimate**: 3-4 hours (MC71 only)

---

## Phase 2: StatusBadge Component Implementation

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 candidate files** (not created in MC70):
- `src/components/indicators/StatusBadge.tsx` — StatusBadge component
- `src/components/indicators/index.ts` — Export StatusBadge
- `src/types/status.ts` — Status badge type definitions
- `src/components/indicators/__tests__/StatusBadge.test.tsx` — Unit tests
- `src/components/indicators/__tests__/StatusBadge.a11y.test.tsx` — Accessibility tests
- `tests/visual-regression/StatusBadge.snap` — Screenshot baseline

**Contract Reference**:
- See `S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md` Section 3 for full StatusBadge contract
- Props: status (success/warning/error/info), size (sm/md/lg), icon, label
- States: default, hover (slight scale), disabled
- Colors: Map status values to design tokens (success green, warning orange, error red, info blue)
- ARIA: role="status" or role="img", aria-label

**Future MC71 Validation Gate** (not applicable in MC70):
```bash
npm run build        # Must compile with 42/42 routes
npm run test         # All tests must pass — future MC71 validation candidate only
npm run check:tokens # Must pass (4/4)
npm run check:audit-events # Must pass (502/502)
```

**Future Effort Estimate**: 2-3 hours (MC71 only)

---

## Phase 3: DataTable Component Implementation

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 candidate files** (not created in MC70):
- `src/components/data-display/DataTable.tsx` — DataTable component
- `src/components/data-display/index.ts` — Export DataTable
- `src/types/table.ts` — Table type definitions
- `src/lib/hooks/useDataTable.ts` — Data table utilities (sorting, filtering, pagination)
- `src/components/data-display/__tests__/DataTable.test.tsx` — Unit tests
- `src/components/data-display/__tests__/DataTable.a11y.test.tsx` — Accessibility tests
- `tests/visual-regression/DataTable.snap` — Screenshot baseline

**Contract Reference**:
- See `S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md` Section 4 for full DataTable contract
- Props: columns, data, sortable, onSort, pagination, pageSize, onPageChange
- Features: Sortable headers (click to sort), pagination (prev/next buttons), keyboard nav (Tab through table, arrow keys for cells)
- ARIA: role="table", role="row", role="columnheader" with aria-sort

**Future MC71 Validation Gate** (not applicable in MC70):
```bash
npm run build        # Must compile with 42/42 routes
npm run test         # All tests must pass — future MC71 validation candidate only
npm run check:tokens # Must pass (4/4)
npm run check:audit-events # Must pass (502/502)
```

**Future Effort Estimate**: 4-5 hours (MC71 only)

---

## Phase 4: FormShell Component Implementation

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 candidate files** (not created in MC70):
- `src/components/forms/FormShell.tsx` — FormShell component
- `src/components/forms/index.ts` — Export FormShell
- `src/types/form.ts` — Form type definitions
- `src/lib/hooks/useFormValidation.ts` — Form validation utilities
- `src/components/forms/__tests__/FormShell.test.tsx` — Unit tests
- `src/components/forms/__tests__/FormShell.a11y.test.tsx` — Accessibility tests
- `tests/visual-regression/FormShell.snap` — Screenshot baseline

**Contract Reference**:
- See `S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md` Section 5 for full FormShell contract
- Props: fields, onSubmit, validation, multiStep, step
- Features: Field layout, validation errors (aria-invalid + aria-describedby), multi-step support
- ARIA: aria-label on form, aria-invalid on error fields, aria-describedby linking error messages

**Future MC71 Validation Gate** (not applicable in MC70):
```bash
npm run build        # Must compile with 42/42 routes
npm run test         # All tests must pass — future MC71 validation candidate only
npm run check:tokens # Must pass (4/4)
npm run check:audit-events # Must pass (502/502)
```

**Future Effort Estimate**: 3-4 hours (MC71 only)

---

## Phase 5: DashboardShell Component Implementation

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 candidate files** (not created in MC70):
- `src/components/layout/DashboardShell.tsx` — DashboardShell component
- `src/components/layout/index.ts` — Export DashboardShell
- `src/components/layout/__tests__/DashboardShell.test.tsx` — Unit tests
- `tests/visual-regression/DashboardShell.snap` — Screenshot baseline

**Contract Reference**:
- See `S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md` Section 6 for full DashboardShell contract
- Props: role, user, children, sidebar, navigation
- Layout: Sidebar + header + main content, responsive (mobile drawer)
- ARIA: aria-label on main regions, skip-to-main link

**Future MC71 Validation Gate** (not applicable in MC70):
```bash
npm run build        # Must compile with 42/42 routes
npm run test         # All tests must pass — future MC71 validation candidate only
npm run check:tokens # Must pass (4/4)
npm run check:audit-events # Must pass (502/502)
```

**Future Effort Estimate**: 3-4 hours (MC71 only)

---

## Phase 6: File Update & Component Migration

**Future MC71 candidate action — not performed in MC70.**

Strategy (future MC71 only):
1. Import new component
2. Add conditional rendering using a feature flag — **Future MC71 design option only. No feature flags are created in MC70.**
3. Run tests (must pass with both old and new)
4. Once all files updated, remove old implementations

**Future MC71 candidate files to update** (not modified in MC70):
- Button: 20+ files in src/app/
- StatusBadge: 15+ files in src/app/
- DataTable: 9+ files in src/app/
- FormShell: 5+ files in src/app/
- DashboardShell: 5+ dashboard pages

**Future Effort Estimate**: 10-15 hours (MC71 only)

---

## Phase 7: Old Implementation Cleanup

**Future MC71 candidate action — not performed in MC70.**

Strategy (future MC71 only):
1. Verify all 35+ files updated successfully
2. Remove old component files from src/components/
3. Remove old type definitions
4. Clean up unused imports

**Future Effort Estimate**: 4-5 hours (MC71 only)

---

## Phase 8: Testing & Visual Regression

**Future MC71 candidate action — not performed in MC70.**

**Future MC71 validation candidates** (not run in MC70):
```bash
npm run test                              # future MC71 only
npm run test:visual -- --update-snapshots # future MC71 only
```

MC70 validation commands (only these are run in MC70):
```bash
npm run build
npm run check:tokens
npm run check:audit-events
```

**Future Effort Estimate**: 5-7 hours (MC71 only)

---

## Rollback Decision Tree (Future MC71 Reference)

| Phase | Failure | Action | Recovery Time |
|-------|---------|--------|---|
| 0 | Build fails | Do not proceed to Phase 1 | N/A (don't start) |
| 1 | Button tests fail | `git revert <phase-1-commit>` | 30 min |
| 2 | StatusBadge a11y fails | `git revert <phase-2-commit>` | 30 min |
| 3 | DataTable keyboard nav broken | `git revert <phase-3-commit>` | 1 hour |
| 4 | FormShell validation broken | `git revert <phase-4-commit>` | 1 hour |
| 5 | DashboardShell layout broken | `git revert <phase-5-commit>` | 1 hour |
| 6 | File update compilation fails | `git revert <failing-file-commit>` | 30 min |
| 7 | Old code removal breaks build | Restore removed files | 30 min |
| 8 | Visual regression issues | Fix styling, regenerate snapshots | 1-2 hours |

Full-wave rollback (if multiple phases fail):
```bash
git revert HEAD...origin/main
npm run build
npm run test
git push origin main
```

---

## Success Metrics (Future MC71 Post-Implementation)

Define success as achieving ALL of the following in MC71:

1. **Build Success**: `npm run build` passes with 42/42 routes, no TypeScript errors, build time ≤ 2 minutes
2. **Test Success**: `npm run test` passes (100%), coverage ≥ 80% new components, no flaky tests
3. **Accessibility Success**: All routes pass WCAG 2.1 AA compliance, keyboard navigation works, color contrast ≥ 4.5:1
4. **Component Success**: All 5 components created, 35+ files updated, ~1,600 LOC reduction achieved
5. **Performance Success**: Build time ≤ 10% regression from baseline, no memory leaks, all interactions responsive

---

## MC71 Readiness Checklist

Before starting component implementation (MC71), verify:

- [ ] MC70 deliverables reviewed and approved
- [ ] **Explicit approval received to begin MC71**
- [ ] Design token config reviewed (src/config/theme.ts is a future MC71 candidate file to be created in MC71)
- [ ] Component contracts fully understood (see S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md)
- [ ] File impact matrix consulted for scope (see S2IMS_UX_RENOVATION_WAVE1_FILE_IMPACT_MATRIX_MC70.md)
- [ ] QA/rollback plan read and understood (see S2IMS_UX_RENOVATION_WAVE1_QA_AND_ROLLBACK_PLAN_MC70.md)
- [ ] All developers briefed on safe sequencing
- [ ] Dev environment verified (Node version, npm version, git configured)
- [ ] Feature branch naming convention: `feature/wave1-shared-ui-primitives-mc71`
- [ ] Merge strategy decided (bundled PR vs per-phase PRs)
- [ ] Reviewer(s) assigned
- [ ] CI/CD pipeline verified (passes on current main)
- [ ] Baseline metrics recorded (build time, bundle size, test count)
- [ ] Design system documentation accessible to team
- [ ] Figma/Stitch prompts shared with design team
- [ ] Command-first operating layer decision made
- [ ] Communication plan for team established

---

## Effort Estimate Summary (Future MC71 Reference)

| Phase | Component(s) | Effort | Cumulative |
|-------|-------------|--------|-----------|
| 0 | Foundation | 2-3 hours | 2-3 hours |
| 1 | Button | 3-4 hours | 5-7 hours |
| 2 | StatusBadge | 2-3 hours | 7-10 hours |
| 3 | DataTable | 4-5 hours | 11-15 hours |
| 4 | FormShell | 3-4 hours | 14-19 hours |
| 5 | DashboardShell | 3-4 hours | 17-23 hours |
| 6 | File Updates | 10-15 hours | 27-38 hours |
| 7 | Cleanup | 4-5 hours | 31-43 hours |
| 8 | Testing & QA | 5-7 hours | 36-50 hours |

**Total Estimated Effort**: 36-50 hours (6-8 days for 1 developer) — future MC71 reference only

---

## Document Safety Statement

**MC70 is documentation-only.** MC70 does not create components, does not create configuration files, does not modify source code, does not create tests, does not change runtime behavior, and does not start MC71.

All file paths listed in this document are future MC71 candidate files only. They are not created in MC70. MC71 implementation may only begin after explicit approval.

---

**Document Status**: Ready for MC70 QA review. MC71 implementation may only begin after explicit approval.  
**Last Updated**: 2026-05-21  
**Phase**: MC70 Design Documentation (No Code Implementation)
