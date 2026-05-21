# MC70 Wave 1 File Impact Matrix: Shared UI Primitives

**Status**: MC70 Planning Phase (Future MC71 Implementation)  
**Created**: 2026-05-21  
**Scope**: Identifies all files affected by Wave 1 component extraction and consolidation

---

## Executive Summary

Wave 1 implementation will impact **35+ files** across 8 areas of the S²IMS application. The impact includes:
- **5 core components** to extract (DashboardShell, DataTable, FormShell, StatusBadge, Button)
- **35+ files** requiring updates in src/components/ and src/app/
- **5 dashboard** implementations affected
- **12 data table** usages consolidated
- **8+ form** implementations refactored
- **~1,400 LOC** reduction opportunity

This matrix serves as reference for scope planning in MC71.

---

## File Impact by Component

### 1. DashboardShell Extraction

**Purpose**: Unify dashboard layout patterns across 5 role-based dashboards (Admin, Staff, Provider, Student, ESQ)

**Current State**: 5 separate dashboard implementations with duplicated layout patterns

**Files Affected**:

| File Path | Impact | Change Type | Est. Effort |
|-----------|--------|-------------|------------|
| src/app/admin/dashboard/page.tsx | Extract layout to DashboardShell | Component extraction | 1-2 hours |
| src/app/staff/dashboard/page.tsx | Extract layout to DashboardShell | Component extraction | 1-2 hours |
| src/app/provider/dashboard/page.tsx | Extract layout to DashboardShell | Component extraction | 1-2 hours |
| src/app/student/dashboard/page.tsx | Extract layout to DashboardShell | Component extraction | 1-2 hours |
| src/app/esq/dashboard/page.tsx | Extract layout to DashboardShell | Component extraction | 1-2 hours |
| src/components/layout/DashboardShell.tsx | NEW: Create consolidated component | New file | 3-4 hours |
| src/components/layout/index.ts | Export DashboardShell | Update exports | 5 min |
| docs/design/S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md | Reference | Documentation | 0 |

**Total LOC Reduction**: ~400 lines (combined from 5 implementations)

**Rollback Strategy**: Component extraction is purely UI restructuring; rollback is straightforward revert of component imports

---

### 2. DataTable Consolidation

**Purpose**: Replace 9+ scattered table implementations with unified DataTable component (accessible, sortable, paginated, keyboard-navigable)

**Current State**: 9+ table implementations with varying degrees of accessibility and features

**Files Affected**:

| File Path | Impact | Change Type | Est. Effort |
|-----------|--------|-------------|------------|
| src/app/admin/audit-log/page.tsx | Replace table with DataTable | Component substitution | 30 min |
| src/app/admin/users/page.tsx | Replace table with DataTable | Component substitution | 30 min |
| src/app/staff/applications/page.tsx | Replace table with DataTable | Component substitution | 45 min |
| src/app/staff/candidates/page.tsx | Replace table with DataTable | Component substitution | 45 min |
| src/app/provider/schedules/page.tsx | Replace table with DataTable | Component substitution | 30 min |
| src/app/provider/students/page.tsx | Replace table with DataTable | Component substitution | 30 min |
| src/app/student/progress/page.tsx | Replace table with DataTable | Component substitution | 30 min |
| src/app/esq/cases/page.tsx | Replace table with DataTable | Component substitution | 45 min |
| src/app/admin/reports/page.tsx | Replace table with DataTable | Component substitution | 30 min |
| src/components/data-display/DataTable.tsx | NEW: Create consolidated component | New file | 4-5 hours |
| src/components/data-display/index.ts | Export DataTable | Update exports | 5 min |
| src/lib/hooks/useDataTable.ts | NEW: Data table utilities (sorting, filtering, pagination) | New utility file | 2-3 hours |
| src/types/table.ts | Add TypeScript interfaces | New/update type file | 30 min |

**Total LOC Reduction**: ~600 lines (combined from 9 implementations)

**Rollback Strategy**: Table component swap is reversible; existing table logic preserved in hooks

---

### 3. FormShell Implementation

**Purpose**: Standardize form layout, validation, and multi-step patterns across 5+ form implementations

**Current State**: Scattered form implementations with inconsistent validation and accessibility

**Files Affected**:

| File Path | Impact | Change Type | Est. Effort |
|-----------|--------|-------------|------------|
| src/app/admin/users/create/page.tsx | Extract form to FormShell | Component extraction | 45 min |
| src/app/admin/users/edit/page.tsx | Extract form to FormShell | Component extraction | 45 min |
| src/app/staff/applications/create/page.tsx | Extract form to FormShell | Component extraction | 1 hour |
| src/app/provider/schedules/create/page.tsx | Extract form to FormShell | Component extraction | 45 min |
| src/app/esq/cases/create/page.tsx | Extract form to FormShell | Component extraction | 1 hour |
| src/components/forms/FormShell.tsx | NEW: Create consolidated component | New file | 3-4 hours |
| src/components/forms/index.ts | Export FormShell | Update exports | 5 min |
| src/lib/hooks/useFormValidation.ts | NEW: Form validation utilities | New utility file | 2-3 hours |
| src/types/form.ts | Add form type definitions | New/update type file | 30 min |

**Total LOC Reduction**: ~300 lines (combined from 5+ implementations)

**Rollback Strategy**: Form extraction with preserved validation logic; no persistence changes

---

### 4. StatusBadge Implementation

**Purpose**: Replace 15+ scattered status, priority, and type indicators with unified StatusBadge component

**Current State**: Mixed usage of inline styled spans, custom components, and inconsistent color/styling

**Files Affected**:

| File Path | Impact | Change Type | Est. Effort |
|-----------|--------|-------------|------------|
| src/app/admin/users/page.tsx | Replace status elements with StatusBadge | Component substitution | 20 min |
| src/app/staff/applications/page.tsx | Replace status elements with StatusBadge | Component substitution | 30 min |
| src/app/staff/candidates/page.tsx | Replace status elements with StatusBadge | Component substitution | 20 min |
| src/app/provider/schedules/page.tsx | Replace priority/status with StatusBadge | Component substitution | 20 min |
| src/app/provider/students/page.tsx | Replace status with StatusBadge | Component substitution | 15 min |
| src/app/student/progress/page.tsx | Replace status with StatusBadge | Component substitution | 15 min |
| src/app/esq/cases/page.tsx | Replace status/priority with StatusBadge | Component substitution | 25 min |
| src/app/admin/audit-log/page.tsx | Replace event type with StatusBadge | Component substitution | 15 min |
| src/app/admin/reports/page.tsx | Replace status with StatusBadge | Component substitution | 15 min |
| src/app/staff/interviews/page.tsx | Replace interview status with StatusBadge | Component substitution | 15 min |
| src/app/admin/settings/page.tsx | Replace configuration status with StatusBadge | Component substitution | 15 min |
| src/app/provider/feedback/page.tsx | Replace feedback status with StatusBadge | Component substitution | 15 min |
| src/app/student/submissions/page.tsx | Replace submission status with StatusBadge | Component substitution | 15 min |
| src/app/esq/documents/page.tsx | Replace document status with StatusBadge | Component substitution | 15 min |
| src/app/admin/notifications/page.tsx | Replace notification type with StatusBadge | Component substitution | 15 min |
| src/components/indicators/StatusBadge.tsx | NEW: Create consolidated component | New file | 2-3 hours |
| src/components/indicators/index.ts | Export StatusBadge | Update exports | 5 min |
| src/types/status.ts | Add status type definitions | New/update type file | 20 min |

**Total LOC Reduction**: ~100 lines (consolidated from 15+ usages)

**Rollback Strategy**: Badge component swap is reversible; inline styles removed non-destructively

---

### 5. Button Component Consolidation

**Purpose**: Replace 30+ scattered button implementations with unified Button component (variants: primary/secondary/danger/ghost, sizes: sm/md/lg, states: normal/hover/focus/disabled/loading)

**Current State**: Mixed HTML buttons, custom button components, and inconsistent styling

**Files Affected**:

| File Path | Impact | Change Type | Est. Effort |
|-----------|--------|-------------|------------|
| src/app/admin/users/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/admin/users/create/page.tsx | Replace buttons with Button component | Component substitution | 25 min |
| src/app/admin/users/edit/page.tsx | Replace buttons with Button component | Component substitution | 25 min |
| src/app/admin/audit-log/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/admin/reports/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/admin/settings/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/staff/applications/page.tsx | Replace buttons with Button component | Component substitution | 25 min |
| src/app/staff/applications/create/page.tsx | Replace buttons with Button component | Component substitution | 25 min |
| src/app/staff/candidates/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/staff/interviews/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/provider/schedules/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/provider/schedules/create/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/provider/students/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/provider/feedback/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/student/progress/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/student/submissions/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/esq/cases/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/esq/cases/create/page.tsx | Replace buttons with Button component | Component substitution | 20 min |
| src/app/esq/documents/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/app/admin/notifications/page.tsx | Replace buttons with Button component | Component substitution | 15 min |
| src/components/buttons/Button.tsx | NEW: Create consolidated component | New file | 2-3 hours |
| src/components/buttons/index.ts | Export Button | Update exports | 5 min |
| src/types/button.ts | Add button type definitions | New/update type file | 15 min |

**Total LOC Reduction**: ~200 lines (consolidated from 30+ usages)

**Rollback Strategy**: Button component swap is reversible; existing button behavior preserved

---

## Impact Summary by Area

### Architecture Changes

| Area | Components | Files | LOC Reduction | Effort | Risk |
|------|-----------|-------|---------------|--------|------|
| Dashboard | DashboardShell | 6 | ~400 | 10-12 hrs | Low |
| Data Display | DataTable | 13 | ~600 | 10-12 hrs | Low |
| Forms | FormShell | 9 | ~300 | 8-10 hrs | Low |
| Indicators | StatusBadge | 18 | ~100 | 4-5 hrs | Very Low |
| Controls | Button | 22 | ~200 | 6-8 hrs | Very Low |

**Total Files Affected**: 68 files (including new components and utilities)  
**Total LOC Reduction**: ~1,600 lines  
**Total Effort**: 38-47 hours (~5-6 days for 1 developer)

---

## Dependency Graph

```
Button (new)
  ↓
StatusBadge (new)
  ↓ ↓
DataTable (new) ← requires Button for pagination/action buttons
FormShell (new) ← requires Button for form actions
  ↓ ↓ ↓
DashboardShell (new) ← requires DataTable, FormShell, StatusBadge, Button
```

**Safe Implementation Order**:
1. Button (no dependencies)
2. StatusBadge (depends on Button)
3. DataTable (depends on Button)
4. FormShell (depends on Button)
5. DashboardShell (depends on all above + additional utilities)

---

## Component Dependency on Design Tokens

All 5 components depend on design tokens defined in MC69:

| Component | Required Tokens | Token Count |
|-----------|-----------------|-------------|
| Button | Primary, Secondary, Danger, Gray300, Gray500, Gray700, White | 7 colors + spacing + typography |
| StatusBadge | Success, Warning, Error, Info, Gray colors | 5 colors + sizing |
| DataTable | Primary, Gray50-700, spacing, typography | 8 colors + utilities |
| FormShell | Primary, Error, Success, spacing, typography | 5 colors + layout tokens |
| DashboardShell | All colors, all spacing, all typography | 14 colors + 5 spacing + 8 typography |

**Token Configuration File** (to create in MC71):
- `src/config/theme.ts` — centralized token definitions
- Supports responsive breakpoints (mobile 320px, tablet 768px, desktop 1024px+)
- Exports CSS variables for use in component styling

---

## Testing Impact

Each component requires:
- **Unit tests** (component behavior, props, states)
- **Integration tests** (component interactions, data flow)
- **Accessibility tests** (keyboard nav, ARIA, screen reader)
- **Visual regression tests** (screenshot comparisons)

Files affected for testing:

| Test Type | Files | Coverage |
|-----------|-------|----------|
| Unit Tests | src/components/*/\_\_tests\_\_/ | 5 new test files (1 per component) |
| Integration Tests | src/app/*/\_\_tests\_\_/ | 20+ test files (dashboard, tables, forms) |
| A11y Tests | src/components/*/\_\_tests\_\_/a11y.test.tsx | 5 new a11y test files |
| Visual Regression | tests/visual-regression/ | 10+ snapshot files |

---

## Rollback Safety Analysis

All Wave 1 changes are **design/UI-only** with **no persistence or data flow modifications**. Rollback is straightforward:

| Component | Rollback Complexity | Risk | Notes |
|-----------|-------------------|------|-------|
| Button | Very Low | Very Low | Pure UI substitution, no logic changes |
| StatusBadge | Very Low | Very Low | Pure display component, no data changes |
| DataTable | Low | Low | Utility logic preserved in hooks, reversible |
| FormShell | Low | Low | Validation logic preserved in hooks, reversible |
| DashboardShell | Low | Low | Layout restructure only, no behavior changes |

**Rollback Procedure** (in case of issues):
1. Revert component files: `git revert <commit-range>`
2. Revert app page files: `git revert <commit-range>`
3. Verify build and tests pass
4. No data recovery needed (no persistence touched)

---

## Success Criteria

**File Impact Validation** (MC71 completion):
- ✅ All 5 components created with full implementation
- ✅ All 35+ files updated to use new components
- ✅ All new utility files created (hooks, types, theme config)
- ✅ All test files created (unit, integration, a11y, visual regression)
- ✅ No orphaned old component files remaining
- ✅ Build succeeds with no type errors
- ✅ All 42/42 routes compile successfully
- ✅ All tests pass (unit, integration, a11y, visual regression)
- ✅ ~1,600 LOC reduction achieved
- ✅ WCAG 2.1 AA 100% compliance verified
- ✅ Zero accessibility regressions

---

## Notes

- **Scope Boundaries**: This matrix includes only Wave 1 component extraction; Wave 2+ will handle additional refactoring
- **Token Dependency**: All components require MC69 design tokens to be available in codebase (configure in MC71 Phase 1)
- **Responsive Design**: All components implement responsive variants per design system (mobile/tablet/desktop)
- **Accessibility**: All components include full ARIA requirements and keyboard navigation (WCAG 2.1 AA)
- **Type Safety**: All components include TypeScript interfaces and type definitions
- **Testing Coverage**: All components require comprehensive test coverage (unit, integration, a11y, visual)

---

**Document Status**: ✅ MC70 Planning Phase — Ready for MC71 Implementation Reference  
**Last Updated**: 2026-05-21  
**Phase**: Design Documentation (No Code Implementation)
