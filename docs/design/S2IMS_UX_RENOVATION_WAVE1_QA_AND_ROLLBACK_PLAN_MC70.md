# MC70 Wave 1 QA and Rollback Plan: Shared UI Primitives

**Status**: MC70 Planning Phase (Future MC71 Implementation)  
**Created**: 2026-05-21  
**Purpose**: Define comprehensive QA strategy and safe rollback procedures for Wave 1 component implementation

---

## Executive Summary

Wave 1 QA and rollback plan covers:
- **Pre-implementation validation** checklist (dependencies, build state, baseline metrics)
- **During-implementation QA** (component isolation, accessibility, visual regression)
- **Post-implementation validation** (build, tests, accessibility, performance)
- **Rollback strategy** (straightforward git revert, no data recovery needed)
- **Stop conditions** (when to halt and trigger rollback)
- **Success metrics** (definitive completion criteria)

This plan ensures Wave 1 can be safely implemented and rolled back with confidence.

---

## Pre-Implementation Validation

### Checklist: Environment and Dependencies

Before starting MC71 Wave 1 implementation, verify:

- [ ] **Branch Ready**: Create feature branch `feature/wave1-shared-ui-primitives-mc71` from main
- [ ] **Build Baseline**: Run `npm run build` and confirm 42/42 routes compile
- [ ] **Test Baseline**: Run `npm run test` and confirm all tests pass
- [ ] **Token Check**: Run `npm run check:tokens` and confirm 4/4 sections pass
- [ ] **Audit Check**: Run `npm run check:audit-events` and confirm 502/502 documented
- [ ] **Git Status**: Confirm working tree is clean (no uncommitted changes)
- [ ] **Main Updated**: `git pull --ff-only origin/main` to ensure latest
- [ ] **Components Present**: Confirm src/components/ directory has expected structure
- [ ] **Design System Ready**: Verify MC69 design token definitions are available in codebase
- [ ] **Type Definitions**: Confirm src/types/ directory exists and is writable

### Baseline Metrics (Record Before Implementation)

Record these metrics before starting Wave 1:

```
Date: 2026-05-21 (or implementation date)
Build: 42 routes compiling successfully
Tests: [number of test files and passing tests]
Tokens: 4 sections passing (colors, spacing, typography, breakpoints)
Audit Events: 502 events documented
Code Metrics:
  - Total LOC in src/: [record]
  - Total LOC in src/components/: [record]
  - Total file count: [record]
```

---

## During-Implementation QA

### Component Isolation Testing

As each component is created, test it in isolation:

**For Each Component** (Button, StatusBadge, DataTable, FormShell, DashboardShell):

1. **Component Creation Checklist**
   - [ ] Component file created: `src/components/[category]/[Component].tsx`
   - [ ] Type definitions created: `src/types/[component].ts` (if needed)
   - [ ] Export added to: `src/components/[category]/index.ts`
   - [ ] No TypeScript errors in component file
   - [ ] No console errors when importing component

2. **Accessibility Testing (During Component Development)**
   - [ ] All interactive elements are keyboard-navigable (Tab, Arrow, Enter, Escape)
   - [ ] All interactive elements have focus indicators (2px Primary outline)
   - [ ] All form inputs have associated labels
   - [ ] All required fields marked with aria-required
   - [ ] All error states marked with aria-invalid and aria-describedby
   - [ ] All ARIA roles specified correctly (button, form, region, etc.)
   - [ ] All dynamic content marked with aria-live (for alerts/status)
   - [ ] No empty alt text on images
   - [ ] Color contrast ratio ≥ 4.5:1 for text

3. **Visual Regression Testing (During Component Development)**
   - [ ] Screenshot captured for component in normal state
   - [ ] Screenshot captured for component in hover state
   - [ ] Screenshot captured for component in focus state
   - [ ] Screenshot captured for component in disabled state
   - [ ] Screenshot captured for component in loading state (if applicable)
   - [ ] Screenshot captured for component at mobile breakpoint (320px)
   - [ ] Screenshot captured for component at tablet breakpoint (768px)
   - [ ] Screenshot captured for component at desktop breakpoint (1024px)
   - [ ] All screenshots stored in `tests/visual-regression/[component].snap`

4. **TypeScript Type Coverage**
   - [ ] All component props have types defined
   - [ ] All component state variables have types defined
   - [ ] All function parameters and return values have types
   - [ ] No implicit `any` types
   - [ ] Run `npm run build` and confirm no TypeScript errors

5. **Component Integration Testing**
   - [ ] Create `src/components/[category]/__tests__/[Component].test.tsx`
   - [ ] Test component mounts without errors
   - [ ] Test component accepts all documented props
   - [ ] Test component renders expected output
   - [ ] Test component handles user interactions (click, keyboard)
   - [ ] Test component accessibility features (keyboard nav, ARIA)
   - [ ] Test component responsive behavior (mobile/tablet/desktop)
   - [ ] Test component state changes
   - [ ] Test component error states

### File Update Validation

As each file is updated to use new components:

1. **File Update Checklist** (for each impacted file)
   - [ ] Import statement added correctly
   - [ ] Old component references removed
   - [ ] New component props passed correctly
   - [ ] No TypeScript errors in updated file
   - [ ] File compiles successfully
   - [ ] No console warnings or errors

2. **Functionality Preservation** (for each updated file)
   - [ ] Page/component still mounts without errors
   - [ ] All interactive elements still function
   - [ ] All data displays still render correctly
   - [ ] No visual regressions introduced
   - [ ] Keyboard navigation still works
   - [ ] Accessibility features still functional

---

## Post-Implementation Validation

### Build and Test Suite Validation

After all Wave 1 changes are implemented:

1. **Run Full Build**
   ```bash
   npm run build
   ```
   - [ ] All 42/42 routes compile successfully
   - [ ] No TypeScript errors
   - [ ] No warnings about unused variables or imports
   - [ ] Build time reasonable (< 2 minutes)

2. **Run Full Test Suite**
   ```bash
   npm run test
   ```
   - [ ] All tests pass
   - [ ] No test failures or skipped tests
   - [ ] Code coverage ≥ 80% for new components
   - [ ] All component unit tests pass
   - [ ] All integration tests pass
   - [ ] All accessibility tests pass
   - [ ] All visual regression tests pass (no diffs)

3. **Run Token Validation**
   ```bash
   npm run check:tokens
   ```
   - [ ] 4/4 sections pass
   - [ ] All design tokens properly referenced
   - [ ] No orphaned token references

4. **Run Audit Event Validation**
   ```bash
   npm run check:audit-events
   ```
   - [ ] 502/502 events documented
   - [ ] No broken event references
   - [ ] All event paths valid

### Route Smoke Tests

Test critical user journeys across all roles:

**Admin Role**:
- [ ] /admin/dashboard loads
- [ ] /admin/users page shows data table with new DataTable
- [ ] /admin/audit-log displays status badges correctly
- [ ] /admin/settings forms work with new FormShell

**Staff Role**:
- [ ] /staff/dashboard loads with DashboardShell
- [ ] /staff/applications shows DataTable with sorting/pagination
- [ ] /staff/candidates status badges display correctly
- [ ] /staff/interviews form works

**Provider Role**:
- [ ] /provider/dashboard loads
- [ ] /provider/schedules DataTable functional
- [ ] /provider/students status badges correct
- [ ] /provider/feedback form submits

**Student Role**:
- [ ] /student/dashboard loads
- [ ] /student/progress status badges display
- [ ] /student/submissions DataTable works

**ESQ Role**:
- [ ] /esq/dashboard loads
- [ ] /esq/cases DataTable functional
- [ ] /esq/documents status badges correct

### Accessibility Audit

Run comprehensive accessibility audit:

1. **WCAG 2.1 AA Compliance Audit**
   ```bash
   # Using axe DevTools or similar
   ```
   - [ ] All pages pass Level A checks
   - [ ] All pages pass Level AA checks
   - [ ] No new accessibility violations introduced
   - [ ] Previous violations (if any) not worsened

2. **Keyboard Navigation Audit**
   - [ ] Tab order logical on all pages
   - [ ] Focus visible on all interactive elements
   - [ ] All form inputs operable via keyboard
   - [ ] Modal dialogs trappable (focus returns to trigger on close)
   - [ ] No keyboard traps

3. **Screen Reader Audit** (using NVDA/JAWS/VoiceOver)
   - [ ] All page content announced in correct order
   - [ ] Form labels properly announced
   - [ ] Error messages announced
   - [ ] Status updates announced
   - [ ] Table headers announced correctly
   - [ ] No spurious announcements

4. **Color Contrast Audit**
   - [ ] All text ≥ 4.5:1 contrast ratio
   - [ ] All UI controls ≥ 3:1 contrast ratio
   - [ ] No information conveyed by color alone

### Performance Metrics

Measure performance impact:

1. **Build Performance**
   - [ ] Build time: record and compare to baseline
   - [ ] Bundle size: record and compare to baseline
   - [ ] No significant regressions (±10% acceptable)

2. **Runtime Performance**
   - [ ] Page load time: record on critical dashboards
   - [ ] Component mount time: measure for new components
   - [ ] Interaction responsiveness: verify instant feedback on clicks

3. **Code Quality**
   - [ ] No console errors on any page
   - [ ] No console warnings (except expected third-party warnings)
   - [ ] No React strict mode violations
   - [ ] No memory leaks (verify in DevTools)

---

## Stop Conditions (Rollback Triggers)

If ANY of the following conditions are met during or after implementation, **STOP and trigger rollback**:

### Critical Stop Conditions

1. **Build Failure**
   - Build fails to compile any of the 42 routes
   - TypeScript errors prevent compilation
   - **Action**: Revert last commit and fix issues

2. **Test Failures**
   - Any test fails that was passing before Wave 1
   - Code coverage drops below 80% for new components
   - **Action**: Revert to last passing commit and debug

3. **Accessibility Regression**
   - Any WCAG AA violation introduced by Wave 1
   - Keyboard navigation broken on any page
   - Screen reader announcing incorrect content
   - **Action**: Revert the specific file changes and reapproach

4. **Data Integrity Issue**
   - Any data not displaying correctly
   - Any form unable to submit
   - Any API calls failing
   - **Action**: Revert all Wave 1 changes immediately

5. **Security Vulnerability**
   - Any security vulnerability introduced
   - Any auth/role boundaries violated
   - Any private data exposed
   - **Action**: Revert immediately and escalate

### Warning Conditions (Review Before Proceeding)

1. **Performance Regression** (>10%)
   - Build time increased >10%
   - Page load time increased >10%
   - **Action**: Profile and optimize, or rollback if unfixable

2. **Visual Regression** (unexpected diffs)
   - Screenshot tests show unexpected visual changes
   - Component appearance differs from design system
   - **Action**: Review and correct styling, or rollback

3. **Minor Console Warnings**
   - New console warnings (not errors) introduced
   - Missing keys in React lists
   - Deprecated API usage
   - **Action**: Fix issues or accept with documented reason

---

## Rollback Procedure

If rollback is triggered, follow this procedure:

### Step 1: Identify Rollback Point

Determine which commit to revert to:

```bash
# View recent commits
git log --oneline -10

# Find the commit before Wave 1 started
# This is the last main commit before feature branch was created
```

### Step 2: Execute Rollback

**Option A: Revert Specific Commits** (preferred if multiple commits)

```bash
# Get the first Wave 1 commit hash
FIRST_COMMIT="abc1234"

# Revert all commits from FIRST_COMMIT to HEAD
# This creates new "revert" commits rather than deleting history
git revert HEAD...${FIRST_COMMIT}
# or revert one by one in reverse order
git revert <latest-commit>
git revert <previous-commit>
# ... continue for each Wave 1 commit
```

**Option B: Reset to Previous Commit** (if branch not yet pushed)

```bash
# Reset to commit before Wave 1
git reset --hard <pre-wave1-commit>
```

**Option C: Revert from Main** (if changes were merged to main)

```bash
# Create a new branch from main
git checkout main
git pull origin main

# Revert the merge commit
git revert -m 1 <merge-commit-hash>
```

### Step 3: Verify Rollback

After rollback:

```bash
# Verify build succeeds with 42/42 routes
npm run build

# Verify all tests pass
npm run test

# Verify git status is clean
git status

# Verify no rolled-back changes remain
git diff
git diff --cached
```

### Step 4: Document Rollback

Create a post-rollback document:

**File**: `docs/daily-reports/2026-05-21-wave1-rollback-report.md`

Include:
- What triggered rollback (stop condition violated)
- When rollback executed
- What changes were reverted
- Build verification (passed/failed)
- Test verification (passed/failed)
- Root cause analysis (why did the issue occur)
- Remediation plan (how to fix and reapproach)

### Step 5: Communicate

- Document the rollback in comments on any related PR/issue
- Brief team on root cause and remediation plan
- Schedule follow-up implementation with fixes

---

## Success Metrics (Post-Implementation)

Define success as achieving ALL of the following:

1. **Build Success**
   - ✅ `npm run build` passes with 42/42 routes
   - ✅ No TypeScript errors
   - ✅ Build time ≤ 2 minutes

2. **Test Success**
   - ✅ `npm run test` passes with 100% of tests passing
   - ✅ Code coverage ≥ 80% for new components
   - ✅ No flaky tests

3. **Validation Success**
   - ✅ `npm run check:tokens` passes (4/4 sections)
   - ✅ `npm run check:audit-events` passes (502/502 documented)
   - ✅ No new console errors or warnings

4. **Accessibility Success**
   - ✅ All routes pass WCAG 2.1 AA compliance
   - ✅ Keyboard navigation works on all pages
   - ✅ Screen reader announces content correctly
   - ✅ Color contrast ≥ 4.5:1 on all text

5. **Functional Success**
   - ✅ All critical user journeys work (smoke tests pass)
   - ✅ All data displays correctly
   - ✅ All forms submit correctly
   - ✅ All status badges display correct colors/icons

6. **Code Quality Success**
   - ✅ All component type definitions complete
   - ✅ All component tests written and passing
   - ✅ All component stories in Storybook updated
   - ✅ All old component implementations removed

7. **Design System Success**
   - ✅ All components use design tokens from config/theme.ts
   - ✅ All components responsive at mobile/tablet/desktop breakpoints
   - ✅ All components follow accessibility guidelines
   - ✅ Visual consistency verified with design team

8. **Performance Success**
   - ✅ Build time ≤ 10% regression from baseline
   - ✅ Page load time ≤ 10% regression from baseline
   - ✅ No memory leaks or performance issues
   - ✅ All interactions feel responsive

---

## Risk Mitigation Strategies

### Strategy 1: Incremental Implementation

Instead of implementing all 5 components at once, implement in order:

1. **Phase 1** (3-4 hours): Button component
   - Lowest complexity
   - No dependencies
   - Verify build/tests before moving to Phase 2

2. **Phase 2** (4-5 hours): StatusBadge + migrate 15+ usages
   - Depends on Button only
   - Verify build/tests before moving to Phase 3

3. **Phase 3** (10-12 hours): DataTable + migrate 9 table usages
   - Depends on Button only
   - More complex (sorting, pagination, keyboard nav)
   - Verify build/tests before moving to Phase 4

4. **Phase 4** (8-10 hours): FormShell + migrate 5+ forms
   - Depends on Button only
   - Verify build/tests before moving to Phase 5

5. **Phase 5** (10-12 hours): DashboardShell + migrate 5 dashboards
   - Depends on all components above
   - Final integration step

**Between Phases**: Run full build, tests, validation — stop if any failure.

### Strategy 2: Feature Flags (Optional)

For added safety, use feature flags to control rollout:

```typescript
// src/lib/featureFlags.ts
export const WAVE1_FEATURES = {
  useNewButton: process.env.NEXT_PUBLIC_WAVE1_BUTTON === 'true',
  useNewStatusBadge: process.env.NEXT_PUBLIC_WAVE1_STATUS_BADGE === 'true',
  useNewDataTable: process.env.NEXT_PUBLIC_WAVE1_DATATABLE === 'true',
  useNewFormShell: process.env.NEXT_PUBLIC_WAVE1_FORMSHELL === 'true',
  useNewDashboardShell: process.env.NEXT_PUBLIC_WAVE1_DASHBOARDSHELL === 'true',
};
```

Then conditionally render old or new components:

```typescript
// src/app/admin/users/page.tsx
import { WAVE1_FEATURES } from '@/lib/featureFlags';

export default function UsersPage() {
  const Table = WAVE1_FEATURES.useNewDataTable ? NewDataTable : LegacyTable;
  return <Table data={users} />;
}
```

This allows testing each component in production without full commit.

### Strategy 3: Screenshot Regression Detection

Use visual regression testing to catch unexpected changes:

```bash
# First run: capture baseline screenshots
npm run test:visual -- --update-snapshots

# Subsequent runs: compare against baseline
npm run test:visual
# Fails if components don't match baseline visually
```

Automated detection prevents subtle visual regressions from slipping through.

---

## QA Sign-Off

**QA Plan Status**: ✅ MC70 Planning Phase — Ready for MC71 Implementation  
**Reviewed By**: MC70 Planning Phase  
**Date**: 2026-05-21  
**Confidence Level**: High (comprehensive QA strategy with multiple validation layers)

This plan ensures Wave 1 can be safely implemented with confidence, and provides clear rollback procedures if issues arise.
