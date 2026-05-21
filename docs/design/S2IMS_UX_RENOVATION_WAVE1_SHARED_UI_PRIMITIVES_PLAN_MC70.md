# S²IMS UX Renovation Wave 1: Shared UI Primitives Implementation Plan — MC70

**Phase**: Planning Phase (MC70)  
**Status**: Documentation-Only Plan (No Code Implementation)  
**Date**: 2026-05-21  
**Effort**: 7–10 days (future MC71 implementation)  
**Risk Level**: Low (refactoring-only, no logic changes)

---

## Executive Summary

Wave 1 is the core component extraction phase that consolidates 35+ scattered UI implementations into 5 reusable, accessible, design-system-compliant primitives. This plan documents the future implementation strategy **without creating any components or modifying source code**.

**MC70 Scope**: Planning and documentation only. No code changes, no components created, no runtime behavior modifications.

**MC71 Scope** (future): Implementation of all planned components based on this plan.

### Wave 1 Objectives

1. **Extract DashboardShell**: Unify layout across 5 role dashboards (Admin, Staff, Provider, Student, ESQ)
2. **Consolidate DataTable**: Replace 9+ scattered table implementations with single accessible component
3. **Extract FormShell**: Standardize form patterns across 5+ forms with consistent validation
4. **Standardize StatusBadge**: Consolidate 6 badge types into single component with variants
5. **Consolidate Button**: Unify 4 button types into single component with consistent keyboard nav
6. **Add Keyboard Navigation & ARIA**: Full WCAG 2.1 AA accessibility compliance across all components

### Key Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Components to Extract** | 5 core | DashboardShell, DataTable, FormShell, StatusBadge, Button |
| **Files Currently Affected** | 35+ | Scattered implementations across 54 pages |
| **Expected LOC Reduction** | ~1,400 | From consolidating duplicated implementations |
| **Effort Estimate** | 7–10 days | 1 developer + designer for Figma mockups |
| **Accessibility Target** | WCAG 2.1 AA 100% | Current: 72%, Target: 100% |
| **Keyboard Nav Coverage** | 100% | All interactive components fully keyboard accessible |
| **Dependencies** | Design System MC69 | Uses tokens, patterns, and accessibility standards from MC69 |

---

## Wave 1 Component Overview

### 1. DashboardShell Component

**Purpose**: Unified dashboard layout for all roles with responsive widget grid, quick actions, and recent activity.

**Reuse Scope**: 5 dashboards
- /admin/dashboard
- /staff/dashboard
- /provider/dashboard
- /student/dashboard
- /esq/dashboard

**Future File**: `src/components/layout/DashboardShell.tsx`

**Key Features**:
- Responsive widget grid (3 cols desktop, 2 tablet, 1 mobile)
- Summary widgets (counts with trend indicators)
- Quick actions button grid (role-specific actions)
- Recent activity table/timeline
- Full keyboard navigation (Tab, Arrow keys, Enter, Escape)
- ARIA labels and roles for screen readers
- Design token compliance (colors, spacing, typography)

**Accessibility Requirements**:
- `role="main"` on dashboard container
- `role="region"` on each widget with `aria-label`
- Focus indicators: 2px solid Primary color
- Keyboard nav: Tab through sections, Arrow keys within sections

**Design Token Dependencies**:
- Colors: Primary (#3B82F6), Gray50, Gray100, Gray500, Gray700, White
- Spacing: md 16px (card padding), lg 24px (gap between cards)
- Typography: Headline 28px, Title 20px, Body 14px

**Estimated LOC Reduction**: ~400 lines (consolidating 5 dashboard implementations)

---

### 2. DataTable Component

**Purpose**: Reusable, accessible data table with sortable columns, filtering, pagination, and keyboard navigation.

**Reuse Scope**: 9 tables across multiple roles
- /admin/audit-log
- /staff/applications
- /staff/matching-review
- /staff/follow-up
- /staff/disclosure-requests
- /provider/scholarships
- /student/applications
- /student/notifications
- /esq/history

**Future File**: `src/components/table/DataTable.tsx`

**Key Features**:
- Sortable columns (click header to sort A-Z, Z-A, unsorted)
- Filterable with search and multi-column filters
- Pagination (10/20/50/100 per page selector)
- Keyboard navigation (Arrow keys, Tab, Enter, Escape)
- Responsive: Desktop table, tablet scroll, mobile card layout
- Row expand for detail views
- Accessibility: Grid role, ARIA sort attributes, focus visible

**Accessibility Requirements**:
- `role="grid"` on table
- `aria-sort="ascending|descending|none"` on sortable headers
- Keyboard nav: Arrow Up/Down between rows, Left/Right between cells, Enter to expand
- Focus indicators: 2px Primary outline on all interactive cells
- ARIA labels: `aria-label="Row [N]"`, `aria-label="[Column]: [Value]"`

**Design Token Dependencies**:
- Colors: Gray50, Gray100, Gray200, Gray300, Primary, Success, Warning, Error, White
- Typography: Header 14px bold, Body 14px
- Spacing: Cell padding 12px, Row gap 8px
- Height: Row 48px (touch-friendly minimum)

**Estimated LOC Reduction**: ~600 lines (consolidating 9 table implementations)

---

### 3. FormShell Component

**Purpose**: Standardized form layout with real-time validation, progress indicators (multi-step), and accessibility.

**Reuse Scope**: 5+ forms
- /admin/settings
- /staff/announcements/new
- /provider/scholarships/new
- /student/applications/new (5-step wizard)
- /student/profile

**Future File**: `src/components/form/FormShell.tsx`

**Key Features**:
- Multi-step form support with progress indicator
- FormField wrapper with label, input, error, help text
- Real-time validation (green ✓ / red ✗ indicators)
- Success/error banners with accessibility roles
- Full keyboard navigation (Tab, Arrow keys, Enter, Escape)
- ARIA: form role, labels, aria-required, aria-invalid, aria-describedby
- Button states: disabled during submit, loading spinner

**Accessibility Requirements**:
- `role="form"` on form container
- Labels with `for="[input-id]"` for all inputs
- `aria-required="true"` on required fields
- `aria-invalid="true"` on error fields with `aria-describedby` linking to error message
- Error messages: `role="alert"` with `aria-live="assertive"`
- Success messages: `role="status"` with `aria-live="polite"`
- Keyboard nav: Tab through fields, Arrow keys in dropdowns

**Design Token Dependencies**:
- Colors: Primary, Success (#10B981), Error (#EF4444), Gray300, Gray400, Gray500, Gray700
- Typography: Title 28px, Label 14px, Body 14px, Help 12px
- Spacing: Field gap 16px, Section gap 24px, Padding 24px
- Height: Input 40px, Textarea 120px, Button 44px

**Estimated LOC Reduction**: ~300 lines (consolidating 5+ form implementations)

---

### 4. StatusBadge Component

**Purpose**: Standardized, color-coded status indicator used across 15+ pages.

**Reuse Scope**: 15+ pages across all roles

**Future File**: `src/components/ui/StatusBadge.tsx`

**Key Features**:
- Variants: Status, Priority, Type, Result, State
- Color-coded (Success green, Warning amber, Error red, Neutral gray)
- Scalable (sm, md, lg sizes)
- ARIA label for screen readers: `role="img" aria-label="[Status Name]"`

**Badge Variants**:
- **Status**: Pending (Yellow), Approved (Green), Rejected (Red), Blocked (Gray)
- **Priority**: High (Red), Medium (Yellow), Low (Gray)
- **Type**: Notification (Blue), Announcement (Purple), Alert (Red)

**Accessibility Requirements**:
- `role="img"` with `aria-label` for screen readers
- Color contrast: 4.5:1 minimum (WCAG AA)
- No color-only information (include icon or text)

**Design Token Dependencies**:
- Colors: Success (#10B981), Warning (#F59E0B), Error (#EF4444), Info (#0EA5E9), Gray200, Gray500
- Spacing: Padding 8px (sm), 12px (md), 16px (lg)
- Typography: Body 14px, SmallText 12px

**Estimated LOC Reduction**: ~100 lines (consolidating 6 badge implementations)

---

### 5. Button Component

**Purpose**: Unified button component with variants, sizes, and full keyboard navigation.

**Reuse Scope**: 30+ pages across all roles

**Future File**: `src/components/ui/Button.tsx`

**Key Features**:
- Variants: Primary, Secondary, Danger, Ghost
- Sizes: sm (32px), md (40px), lg (44px)
- States: Normal, Hover, Focus, Disabled, Loading
- Full keyboard navigation: Tab, Enter, Space to activate
- ARIA: button role, aria-label (if icon-only)

**Button Variants**:
- **Primary**: Primary background, white text (main actions)
- **Secondary**: Gray border, gray text (secondary actions)
- **Danger**: Error background, white text (delete/destructive)
- **Ghost**: Transparent background, text color (tertiary actions)

**Accessibility Requirements**:
- Focus indicators: 2px solid Primary outline
- Keyboard nav: Tab to focus, Enter/Space to activate
- Disabled state: Gray background, cursor not-allowed
- ARIA label required for icon-only buttons
- Touch-friendly minimum: 44px height (sm: 32px for inline)

**Design Token Dependencies**:
- Colors: Primary, Secondary, Error, Gray300, Gray400, Gray700, White
- Spacing: Padding 12px (sm), 16px (md), 20px (lg)
- Typography: Body 14px (consistent across sizes)
- Border radius: 6px (standard), 4px (compact)

**Estimated LOC Reduction**: ~200 lines (consolidating 4+ button implementations)

---

### Supporting Primitive Components (Future Planning)

These are optional components identified for future consideration. Not part of Wave 1 core scope but documented for context:

- **PageHeader**: Page title, breadcrumb, action buttons (Future Wave 2)
- **SectionHeader**: Section title with optional subtitle (Future Wave 2)
- **SafetyBanner**: Informational banner for safety notes (Future Wave 1)
- **EmptyState**: Empty list indicator with optional action (Future Wave 1)
- **FilterBar**: Reusable filter UI with badge cleanup (Future Wave 1)
- **DisabledActionHint**: Hint for why action is disabled (Future Wave 1)
- **PreviewOnlyNotice**: Demo-mode notice banner (Current, informational only)
- **GovernanceBlockedNotice**: Notice for blocked/locked features (Current, informational only)

---

## Component Dependencies & Safe Implementation Order

```
Phase 1: Foundation
├── Design tokens (use from MC69)
└── Base accessibility patterns

Phase 2: Atomic Components
├── Button (lowest dependencies)
├── StatusBadge (depends on colors)
└── FilterBar (optional, low dependencies)

Phase 3: Complex Components
├── DataTable (depends on Button, StatusBadge)
├── FormShell (depends on Button, error patterns)
└── SafetyBanner, EmptyState (supporting)

Phase 4: Layout Components
└── DashboardShell (depends on Button, StatusBadge, DataTable)
```

**Safe Sequencing**:
1. Button (baseline, no dependencies)
2. StatusBadge (depends on Button, colors)
3. DataTable (depends on Button, StatusBadge)
4. FormShell (depends on Button, error patterns)
5. DashboardShell (depends on all above)

---

## Safety & Governance Boundaries

### What MC70 Does NOT Do

✅ **MC70 Documentation Only**:
- ❌ Does NOT create any components
- ❌ Does NOT modify src/* files
- ❌ Does NOT create src/components/* directories
- ❌ Does NOT create src/config/theme.ts yet
- ❌ Does NOT modify routes or navigation
- ❌ Does NOT enable Confirm Import (AP-10B)
- ❌ Does NOT enable persistence
- ❌ Does NOT write audit events
- ❌ Does NOT create backend/API
- ❌ Does NOT change runtime behavior
- ❌ Does NOT activate AP-10C or AP-11

### What MC71 Will Do

✅ **MC71 Implementation** (future phase):
- Create all 5 core components
- Create src/config/theme.ts with design tokens
- Import components into respective pages
- Add keyboard navigation + ARIA to all components
- Run validation and tests
- Merge to main

### Governance Gates (Locked)

All governance gates remain blocked throughout MC70 and into MC71:

- **AP-10B (Confirm Import)**: ✅ Remains disabled
- **AP-10C (Export Approval)**: ✅ Remains blocked
- **AP-11 (Approval Workflows)**: ✅ Remains blocked

---

## Design System Integration

### Design Tokens (From MC69)

All Wave 1 components will use design tokens from MC69:

**Colors**:
- Primary: #3B82F6
- Secondary: #8B5CF6
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #0EA5E9
- Neutrals: 9 Gray levels (Gray50–Gray900)

**Spacing Tokens**:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

**Typography Tokens**:
- Display1: 48px / bold
- Display2: 36px / bold
- Headline: 28px / semi-bold
- Title: 20px / semi-bold
- Subtitle: 16px / medium
- Body: 14px / regular
- SmallText: 12px / regular
- Mono: 13px / monospace

**Responsive Breakpoints**:
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: > 1024px

### Accessibility Standards (WCAG 2.1 AA)

All Wave 1 components must meet WCAG 2.1 AA compliance:

**Keyboard Navigation**:
- Tab: Focus navigation
- Arrow Keys: Within dropdowns, tables, radio groups
- Enter: Activate buttons, submit forms
- Escape: Close dropdowns, modals
- Space: Toggle checkboxes, activate buttons

**ARIA Standards**:
- All interactive elements have role attributes
- Labels: Every input has associated `<label>`
- Required fields: `aria-required="true"`
- Error fields: `aria-invalid="true"` + `aria-describedby`
- Dynamic content: `aria-live` regions

**Color Contrast**:
- Body text: 4.5:1 minimum
- Large text: 3:1 minimum
- All text: No color-only information (icon + text or text alone)

**Focus Management**:
- Focus visible: 2px solid Primary outline (use `:focus-visible`)
- Focus indicator: On all interactive elements
- Focus trap: In modals (cycle within modal, Escape to close)
- Focus restoration: When modal closes, return to trigger

---

## Implementation Readiness

### Pre-Implementation Checklist (MC70)

✅ **Completed in MC70**:
- [x] Component contracts documented
- [x] File impact matrix created
- [x] Implementation sequence defined
- [x] QA/rollback plan documented
- [x] Accessibility requirements specified
- [x] Design token mapping complete
- [x] Risk assessment per component
- [x] Effort estimates provided
- [x] Dependencies mapped
- [x] Safety boundaries confirmed

### Post-Implementation Checklist (MC71)

📋 **To Complete in MC71**:
- [ ] All 5 core components created
- [ ] Design token configuration (src/config/theme.ts)
- [ ] All components imported into target pages
- [ ] Keyboard navigation tested
- [ ] ARIA labels verified
- [ ] Build validation passed (npm run build)
- [ ] Token checks passed (npm run check:tokens)
- [ ] Audit event checks passed (npm run check:audit-events)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Screenshot regression tests
- [ ] QA sign-off

---

## Validation Strategy

### Build Validation Commands

```bash
# Expected: Build success with no errors
npm run build
# Expected: 42/42 routes or current successful count

# Expected: 4/4 token sections pass
npm run check:tokens

# Expected: 502/502 audit events documented
npm run check:audit-events
```

### Accessibility Validation

```
WCAG 2.1 AA Checklist:
✓ Color contrast: 4.5:1 minimum
✓ Keyboard navigation: Full keyboard access
✓ ARIA labels: All interactive elements labeled
✓ Focus indicators: 2px Primary outline visible
✓ Screen reader: Page structure logical
✓ Form validation: Real-time feedback with accessible errors
```

### Component Testing

```
Per Component:
✓ Render correctly with design tokens
✓ Respond to keyboard input (Tab, Arrow, Enter, Escape)
✓ Display focus indicators
✓ Show ARIA labels in accessibility tree
✓ Handle disabled/loading states
✓ Responsive across breakpoints (mobile, tablet, desktop)
```

---

## Risk Assessment

| Risk | Level | Mitigation | Notes |
|------|-------|-----------|-------|
| Component API changes mid-phase | Low | Finalize contracts in MC70 | Documented in component contract file |
| Dependency conflicts | Low | Sequential implementation order | Build validation before proceeding |
| Accessibility oversights | Low | QA checklist + audit | WCAG 2.1 AA target defined |
| Performance regression | Low | Component isolation testing | Measure LOC reduction benefit |
| Keyboard nav incompleteness | Low | Comprehensive keyboard testing | All interactive elements must support keyboard |

---

## Success Criteria

### Wave 1 Success

✅ **Implementation Successful When**:
1. ✓ All 5 core components created and tested
2. ✓ 100% keyboard accessible (all interactive elements)
3. ✓ 100% WCAG 2.1 AA compliant (contrast, ARIA, focus)
4. ✓ ~1,400 LOC reduction achieved
5. ✓ All 9 tables consolidated to DataTable
6. ✓ All 5 dashboards using DashboardShell
7. ✓ All 5+ forms using FormShell
8. ✓ All 15+ pages using StatusBadge
9. ✓ All 30+ pages using Button component
10. ✓ Build passes (42/42 routes or current count)
11. ✓ Token checks pass (4/4)
12. ✓ Audit event checks pass (502/502)
13. ✓ No performance regression
14. ✓ Screenshot regression tests pass
15. ✓ QA sign-off complete

---

## Recommendations for MC71

1. **Start with Button** (lowest dependencies)
2. **Establish component testing strategy** before extraction
3. **Create Storybook entries** for each component
4. **Document component prop interfaces** clearly
5. **Plan screenshot regression tests** early
6. **Coordinate with designer** for Figma mockups (from MC69 briefs)
7. **Create component-specific test cases** for keyboard nav
8. **Plan rollback strategy** per component (if needed)

---

## References

### Source Documents (MC69)
- `docs/design/S2IMS_UX_RENOVATION_IMPLEMENTATION_WAVES_MC69.md` (Wave 1 scope)
- `docs/design/S2IMS_DESIGN_SYSTEM_DIRECTION_MC69.md` (Design tokens, accessibility)
- `docs/design/S2IMS_FIGMA_STITCH_PROMPT_PACK_MC69.md` (Briefs 1–3: DashboardShell, DataTable, FormShell)

### Design Tokens Reference
- Colors: 14 defined colors across roles
- Spacing: 5 tokens (xs–xl)
- Typography: 8 scales (Display1–Mono)
- Breakpoints: 3 responsive breakpoints (Mobile, Tablet, Desktop)

### Accessibility Standards
- WCAG 2.1 AA target: 100% compliance
- Keyboard navigation: All interactive elements
- ARIA: All interactive elements with roles, labels

---

## Approval

**MC70 Status**: ✅ **PLANNING PHASE COMPLETE**

**Documentation**: ✅ All component contracts documented  
**File Impact**: ✅ All files and changes mapped  
**QA Plan**: ✅ Testing and rollback strategy defined  
**Safety**: ✅ All boundaries verified, no code changes  
**Readiness for MC71**: ✅ Ready for implementation phase

**Next Phase**: MC71 (Implementation of Wave 1 components)

---

**Document Generated**: 2026-05-21  
**Plan Lead**: Claude Haiku 4.5  
**Status**: ✅ MC70 PLANNING PHASE READY FOR EXECUTION
