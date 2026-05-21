# S²IMS UX Renovation Implementation Waves — MC69

Phase-based implementation plan for the full-stack UX renovation. Sequences changes from low-risk, high-impact quick wins to comprehensive role journey redesigns.

---

## Wave Overview

| Wave | Scope | Duration | Risk | Safety | Effort | Status |
|------|-------|----------|------|--------|--------|--------|
| **Wave 0** | Foundation & Quick Wins | 3-4 days | Low | ✅ Fully Safe | 3-4 days | Next Phase |
| **Wave 1** | Core Components (DashboardShell, DataTable, FormShell) | 7-10 days | Low | ✅ Fully Safe | 7-10 days | After Wave 0 |
| **Wave 2** | Design System Implementation (Theme, Colors, I18n) | 3-4 days | Low | ✅ Fully Safe | 3-4 days | After Wave 1 |
| **Wave 3** | Admin & ESQ Role Redesigns | 4-5 days | Low | ✅ Fully Safe | 4-5 days | After Wave 2 |
| **Wave 4** | Staff Role Redesigns (Queues, Matching, Analytics) | 5-7 days | Low | ✅ Fully Safe | 5-7 days | After Wave 3 |
| **Wave 5** | Provider & Student Role Redesigns | 6-8 days | Low | ✅ Fully Safe | 6-8 days | After Wave 4 |
| **Wave 6** | Public / Unauthenticated Redesigns | 2-3 days | Low | ✅ Fully Safe | 2-3 days | After Wave 5 |
| **Wave 7** | Accessibility & Polish (WCAG AA 100%, Keyboard Nav, ARIA) | 3-4 days | Low | ✅ Fully Safe | 3-4 days | After Wave 6 |

**Total Effort**: ~33–45 days (6–9 weeks with 1 developer + designer for 2–3 hours per day)

**All Waves**: Fully safe (no persistence changes, no governance gate activation, demo data only)

---

## Wave 0: Foundation & Quick Wins (3–4 Days)

### Objectives
- Extract hard-coded configuration to centralized config files
- Create reusable layout patterns (DashboardShell skeleton)
- Fix critical accessibility issues (color contrast)
- Establish design tokens (colors, spacing, typography)

### Tasks

**Task 0.1: Create Design Token Configuration** (0.5 day)
- File: `src/config/theme.ts`
- Export: theme object (colors, spacing, font sizes, breakpoints)
- Update 3-5 existing components to use tokens instead of hard-coded values
- Example: Button component uses `theme.colors.primary` instead of `#3B82F6`
- Benefit: Single source of truth for design system

**Task 0.2: Centralize Hard-Coded Configuration** (0.5 day)
- File: `src/config/uiConfig.ts`
- Move: Dashboard widget labels, menu items, action buttons, status badge colors
- Example: Staff dashboard widget counts ("Pending Applications", "Matching Queue") from hard-coded strings to config
- Benefit: Easy to customize per role without code changes

**Task 0.3: Fix Color Contrast Issues** (1 day)
- Audit: Review all pages for WCAG AA contrast (4.5:1 minimum)
- Fix: Update 3-5 pages with light gray text that fails contrast (Gray400 → Gray500 or Gray600)
- Example: Help text currently Gray400 on White (3:1) → Gray500 (4:1+ pass)
- Priority: Focus on frequently-used components (buttons, labels, badges)
- Benefit: Quick accessibility win, no layout changes

**Task 0.4: Create Base DashboardShell Skeleton** (1 day)
- File: `src/components/layout/DashboardShell.tsx`
- Structure: Header, sidebar (optional), main grid, footer
- No styling yet, just layout structure
- Import into one dashboard (e.g., /admin/dashboard) for testing
- Benefit: Foundation for Wave 1 component extraction

**Task 0.5: Polish Quick Wins** (0.5 day)
- Button hover states: Add subtle shadow/color change
- Form field focus: Add 2px outline ring (no change to focus logic)
- Card shadows: Apply consistent subtle shadow to all cards
- Border colors: Update all Gray borders to Gray200 (consistency)
- Benefit: Visual improvement without major refactoring

### Deliverables
- ✅ `src/config/theme.ts` (tokens file)
- ✅ `src/config/uiConfig.ts` (configuration)
- ✅ `src/components/layout/DashboardShell.tsx` (skeleton)
- ✅ Updated 3-5 components using theme tokens
- ✅ Contrast fixes applied to 3-5 pages
- ✅ Git commit: "chore: foundation config, theme tokens, contrast fixes WaveO"

### Safety Verification
- ✅ No route changes
- ✅ No persistence changes
- ✅ No gate activation
- ✅ Demo data still works
- ✅ Build passes (npm run build)

### Effort
**Total**: 3-4 days (1 developer, no design needed yet)

---

## Wave 1: Core Components (7–10 Days)

### Objectives
- Extract DashboardShell into reusable component (5 dashboards)
- Consolidate DataTable (12 tables → 1 component)
- Consolidate FormShell (8 forms → 1 component)
- Add keyboard navigation + ARIA labels to all components

### Tasks

**Task 1.1: DashboardShell Component** (2 days)
- File: `src/components/layout/DashboardShell.tsx` (expand from Wave 0 skeleton)
- Features:
  - Summary widget grid (responsive, 1-3 columns per row)
  - Quick actions card (button grid)
  - Recent activity widget (table or timeline)
  - Keyboard nav: Tab through sections, Arrow keys in tables
  - ARIA: dashboard role="main", widgets role="region", buttons accessible
- Import into 5 dashboards:
  - /admin/dashboard → DashboardShell with system health widgets
  - /staff/dashboard → DashboardShell with queue widgets
  - /provider/dashboard → DashboardShell with portfolio widgets
  - /student/dashboard → DashboardShell with progress widgets
  - /esq/dashboard → DashboardShell with review widgets
- Benefit: Consistency across all dashboards, ~400 LOC reduction

**Task 1.2: DataTable Consolidation** (3 days)
- File: `src/components/table/DataTable.tsx` (new)
- Consolidate from: 12 existing table implementations across pages
- Features:
  - Sortable columns (click header to toggle ascending/descending)
  - Filterable (search + multi-column filters)
  - Pagination (10/20/50/100 per page)
  - Keyboard navigation: Arrow keys between rows, Enter to expand/edit, Escape to close
  - ARIA labels: grid role, gridcell roles, aria-sort, aria-label
  - Row expand (collapse/expand details)
  - Responsive: Desktop table, tablet scroll, mobile card layout
  - Accessibility: Focus visible on all interactive elements (headers, buttons, rows)
- Import into 9 tables:
  - /admin/audit-log
  - /staff/applications
  - /staff/matching-review
  - /staff/follow-up
  - /staff/disclosure-requests
  - /provider/scholarships
  - /student/applications
  - /student/notifications
  - /esq/history
- Benefit: ~600 LOC reduction, consistent sort/filter/paginate, keyboard nav on all tables

**Task 1.3: FormShell Component** (2 days)
- File: `src/components/form/FormShell.tsx` (new)
- Features:
  - Multi-step form support (progress indicator)
  - FormField wrapper (label, input, error, help text)
  - Real-time validation (green ✓ / red ✗ indicators)
  - Success/error banners
  - Keyboard navigation: Tab through fields, Arrow keys in dropdowns/radios, Enter to submit
  - ARIA: form role, labels with for="[id]", required fields aria-required, validation aria-invalid + aria-describedby
  - Button states: Disabled during submit, loading spinner
- Import into 5 forms:
  - /admin/settings → Settings form (sections: System, I18n, Audit, Advanced)
  - /staff/announcements/new → Announcement creation form
  - /provider/scholarships/new → New scholarship form
  - /student/applications/new → New application wizard (5 steps)
  - /student/profile → Profile edit form (inline)
- Benefit: ~300 LOC reduction, consistent validation display, improved accessibility

**Task 1.4: StatusBadge Standardization** (1 day)
- File: `src/components/ui/StatusBadge.tsx` (standardize)
- Consolidate: 6 badge types (Status, Priority, Type, Result, State) into 1 with variants
- Variants:
  - Status: Pending (Yellow), Approved (Green), Rejected (Red), Blocked (Gray)
  - Priority: High (Red), Medium (Yellow), Low (Gray)
  - Type: Notification (Blue), Announcement (Purple), Alert (Red)
- Features: Color-coded, scalable, ARIA label (role="img" aria-label="[Status Name]")
- Usage: Replace 6 scattered badge components across 15+ pages
- Benefit: ~100 LOC reduction, visual consistency

**Task 1.5: Button Consolidation & Variants** (1 day)
- File: `src/components/ui/Button.tsx` (standardize)
- Consolidate: 4 button types → 1 with variants (primary, secondary, danger, ghost)
- Features: Sizes (sm, md, lg), disabled state, loading spinner, keyboard nav (Tab, Enter, Space)
- ARIA: button role, aria-label (if icon-only)
- Benefit: Cleaner API, consistent keyboard nav

**Task 1.6: Keyboard Navigation & ARIA Audit** (1.5 days)
- Audit: All 5 components (DashboardShell, DataTable, FormShell, StatusBadge, Button)
- Add: Focus indicators (2px primary ring), tab order (tabindex), focus trap in modals, focus restoration
- Add: ARIA labels, roles, aria-describedby, aria-required, aria-invalid, aria-live
- Test: Keyboard only navigation (Tab, Arrow, Enter, Escape) on each component
- Benefit: 100% keyboard accessible

### Deliverables
- ✅ DashboardShell component (5 imports, tested on 5 dashboards)
- ✅ DataTable component (9 imports, tested on 9 tables)
- ✅ FormShell component (5 imports, tested on 5 forms)
- ✅ StatusBadge standardized (15+ pages updated)
- ✅ Button consolidated (30+ pages updated)
- ✅ Keyboard nav + ARIA audit (all components tested)
- ✅ Git commit: "refactor: extract core components DashboardShell DataTable FormShell Wave1"

### Safety Verification
- ✅ No logic changes (just refactoring existing UI)
- ✅ No persistence changes
- ✅ No gate activation
- ✅ Demo data still works
- ✅ Build passes
- ✅ All pages render correctly

### Effort
**Total**: 7-10 days (1 developer + designer for Figma mockups 2-3 hours)

---

## Wave 2: Design System Implementation (3–4 Days)

### Objectives
- Implement design tokens (colors, spacing, fonts) globally
- Create reusable theme configuration
- Extract hard-coded text to i18n dictionaries
- Setup Storybook for component documentation

### Tasks

**Task 2.1: Apply Design Tokens Globally** (1 day)
- Extend Wave 0 theme config with complete token library
- Update all components to use tokens (no hard-coded hex colors or pixel values)
- Files affected: 30+ components, 50+ pages
- Example: `background: theme.colors.gray[50]` instead of `background: #F9FAFB`
- Benefit: Single source of truth, easy theme switching (future dark mode)

**Task 2.2: I18n Framework Setup** (1 day)
- Setup: react-i18next (or similar)
- Create: `src/locales/` directory with en/ and th/ folders
- Files: auth.json, forms.json, tables.json, navigation.json, notifications.json, help.json
- Extract: ~150 hard-coded strings from all pages
- Example: "Save Changes" → `t("forms.save")`, "Pending" → `t("status.pending")`
- Benefit: Enable Thai/English switching, prepare for additional languages

**Task 2.3: Component Storybook Setup** (1 day)
- Create: `.storybook/` directory (if not present)
- Add: Stories for DashboardShell, DataTable, FormShell, Button, Badge
- Document: Props, variants, keyboard nav, accessibility checklist
- Build: Storybook site for team reference
- Benefit: Component documentation, design-dev alignment

**Task 2.4: Documentation & Accessibility Checklist** (0.5 day)
- Create: `docs/COMPONENT_LIBRARY.md` with:
  - Component list (DashboardShell, DataTable, FormShell, etc.)
  - Usage examples (code snippets)
  - Accessibility checklist (keyboard nav, ARIA, color contrast)
  - Design tokens reference (colors, spacing, fonts)
- Benefit: Onboarding docs for new developers

### Deliverables
- ✅ Extended theme config with all tokens
- ✅ All components updated to use tokens (no hard-coded colors)
- ✅ I18n framework setup with en/th locales
- ✅ Storybook site with component documentation
- ✅ COMPONENT_LIBRARY.md documentation
- ✅ Git commit: "docs: design tokens, i18n setup, storybook Wave2"

### Safety Verification
- ✅ No logic changes
- ✅ No persistence changes
- ✅ No gate activation
- ✅ Demo data still works
- ✅ Build passes
- ✅ All pages render correctly with new theme tokens

### Effort
**Total**: 3-4 days (1 developer, 2-3 hours)

---

## Wave 3: Admin & ESQ Role Redesigns (4–5 Days)

### Objectives
- Redesign /admin dashboard with enhanced system health widgets
- Redesign /admin/audit-log with accessible DataTable
- Redesign /esq dashboard with review queue visibility
- Redesign /esq/history with accessible DataTable

### Tasks (High-Level)
- Import DashboardShell into /admin/dashboard and /esq/dashboard
- Configure role-specific widgets (system health for admin, review queue for ESQ)
- Update audit-log and history tables to use new DataTable component
- Add keyboard nav + ARIA to all interactive elements
- Test accessibility (keyboard-only, screen reader, color contrast)

### Deliverables
- ✅ /admin/dashboard redesigned (DashboardShell + system health widgets)
- ✅ /admin/audit-log redesigned (DataTable, accessible, sortable)
- ✅ /esq/dashboard redesigned (DashboardShell + review queue widgets)
- ✅ /esq/history redesigned (DataTable, accessible, sortable)
- ✅ Git commit: "design: admin & ESQ role redesigns Wave3"

### Effort
**Total**: 4-5 days (developer + designer)

---

## Wave 4: Staff Role Redesigns (5–7 Days)

### Objectives
- Redesign /staff/dashboard with operational queue widgets
- Consolidate application/matching/follow-up/disclosure tables under DataTable
- Add keyboard navigation + ARIA to all staff surfaces
- Polish analytics and data quality dashboards

### Tasks (High-Level)
- /staff/dashboard: DashboardShell + queue widgets (applications, matching, follow-ups, disclosures)
- /staff/applications: DataTable + status badges + row expand
- /staff/matching-review: DataTable + match score display + decision controls
- /staff/follow-up: DataTable + priority color coding + quick actions
- /staff/disclosure-requests: Redesign card layout → DataTable
- /staff/analytics: Polish metric cards + charts
- /staff/data-quality: Expand metric display

### Deliverables
- ✅ /staff/dashboard redesigned (DashboardShell + 4-widget queue)
- ✅ All staff tables consolidated (9 tables) to use DataTable
- ✅ All staff surfaces keyboard-accessible + ARIA labeled
- ✅ Analytics and data-quality polished
- ✅ Git commit: "design: staff role redesigns Wave4"

### Effort
**Total**: 5-7 days (developer + designer)

---

## Wave 5: Provider & Student Role Redesigns (6–8 Days)

### Objectives
- Redesign 5 provider surfaces (dashboard, scholarships, candidates, impact, insights, outcomes)
- Redesign 8 student surfaces (dashboard, applications, profile, recommendations, etc.)
- Add FormShell to student new application form
- Add progress indicators to profile and applications

### Tasks (High-Level)
- Provider surfaces: DashboardShell, DataTable consolidation, privacy clarity, impact polish
- Student surfaces: DashboardShell, DataTable, FormShell (new app form), progress indicators, recommendation improvements
- New app form: 5-step wizard with real-time validation
- Profile completion: Progress bar + section breakdown

### Deliverables
- ✅ All provider surfaces redesigned
- ✅ All student surfaces redesigned
- ✅ New app form with FormShell (5-step wizard)
- ✅ Profile completion with progress indicator
- ✅ Git commit: "design: provider & student role redesigns Wave5"

### Effort
**Total**: 6-8 days (developer + designer, largest wave)

---

## Wave 6: Public / Unauthenticated Redesigns (2–3 Days)

### Objectives
- Polish home page (/)
- Enhance login page (role selection with descriptions)
- Consolidate /scholarships (public list) with student /scholarships

### Tasks (High-Level)
- Home page: Hero section, featured scholarships preview
- Login page: Enhanced role selection with icons + descriptions
- /scholarships: DataTable (shared between public and student views)

### Deliverables
- ✅ Home page polished
- ✅ Login page enhanced
- ✅ /scholarships consolidated (public + student, single DataTable)
- ✅ Git commit: "design: public role redesigns Wave6"

### Effort
**Total**: 2-3 days (developer + designer, smallest wave)

---

## Wave 7: Accessibility & Polish (3–4 Days)

### Objectives
- Audit all 54 pages for WCAG 2.1 AA compliance (target 100%)
- Add keyboard navigation to any missed surfaces
- Add ARIA labels to all interactive elements
- Test with screen reader (accessibility tool)
- Polish animations, hover states, loading states

### Tasks (High-Level)
- WCAG audit: Color contrast (4.5:1 minimum), semantic HTML, keyboard nav
- Screen reader test: All pages navigable by screen reader
- Keyboard-only test: All pages usable with Tab/Arrow/Enter/Escape only
- Polish: Animations (smooth, not jarring), loading spinners, empty states, error messages

### Deliverables
- ✅ All 54 pages WCAG 2.1 AA compliant (100%)
- ✅ All pages keyboard-accessible (100%)
- ✅ All pages screen-reader friendly (80%+)
- ✅ Polish improvements (animations, states, messages)
- ✅ Accessibility report with checklist
- ✅ Git commit: "a11y: WCAG AA audit & polish Wave7"

### Effort
**Total**: 3-4 days (developer + accessibility specialist or auditor)

---

## Implementation Sequencing & Dependencies

```
Wave 0 (3-4 days)
    ↓
Wave 1 (7-10 days)  ← Depends on Wave 0 (theme config)
    ↓
Wave 2 (3-4 days)   ← Depends on Wave 1 (component library)
    ├─ Wave 3 (4-5 days)   ← Parallel after Wave 2
    ├─ Wave 4 (5-7 days)   ← Parallel after Wave 2
    ├─ Wave 5 (6-8 days)   ← Parallel after Wave 2
    └─ Wave 6 (2-3 days)   ← Parallel after Wave 2
        ↓ (All waves complete)
Wave 7 (3-4 days)   ← Depends on all role redesigns
    ↓
Complete: Full-Stack UX Renovation
```

**Total Duration**: ~33-45 days (6-9 weeks at 5 days/week, 1 developer + designer)

**Parallelization Opportunity**: Waves 3-6 can run in parallel after Wave 2 (4 role redesigns simultaneously with 4 developers, or sequentially with 1 developer)

---

## Risk Assessment

| Wave | Risk Level | Mitigation |
|------|---|---|
| Wave 0 | Low | Config changes only, no component extraction yet |
| Wave 1 | Low | Refactoring only, no logic changes, build validates |
| Wave 2 | Low | Configuration only, no route/logic changes |
| Wave 3 | Low | Redesign only, no persistence or gate activation |
| Wave 4 | Low | Redesign only, demo data unchanged |
| Wave 5 | Low | Largest redesign but still demo-safe, forms read-only for student new app |
| Wave 6 | Low | Minimal changes, consolidation only |
| Wave 7 | Low | Accessibility audit only, no logic changes |

**Overall Risk**: ✅ **All Low** (no persistence, no gates, no production changes, demo data only)

---

## Safety Boundaries (Enforced Across All Waves)

✅ **Will NOT**:
- Modify persistence logic or APIs
- Enable Confirm Import (AP-10B)
- Enable export approval (AP-10C)
- Enable approval workflows (AP-11)
- Write audit events
- Create backend/API changes
- Use real data
- Claim approval/sign-off

✅ **Will DO**:
- Redesign UI (layout, components, styling)
- Improve accessibility (WCAG AA compliance)
- Refactor components (consolidation, reuse)
- Enhance keyboard navigation
- Polish interactions (animations, states)
- Extract configuration and i18n

---

## Go/No-Go Criteria Per Wave

**Before Starting Wave N+1**:
- ✅ All tasks in Wave N complete
- ✅ Build passes (npm run build)
- ✅ All pages render correctly
- ✅ No console errors
- ✅ Keyboard navigation tested (at least one page per role)
- ✅ ARIA labels verified (at least one page per role)
- ✅ Color contrast verified (at least one page per role)

**Example Go/No-Go for Wave 1**:
- ✅ DashboardShell imported into all 5 dashboards, renders correctly
- ✅ DataTable imported into all 9 tables, keyboard nav works
- ✅ FormShell imported into all 5 forms, validation displays correctly
- ✅ Build passes with zero errors
- ✅ Keyboard-only navigation tested on /admin/dashboard, /staff/applications, /student/applications
- ✅ ARIA labels verified on DataTable and FormShell
- ✅ All page renders match Figma designs (visually)

---

## Post-Wave Documentation

After **Wave 7** completion:
- Create: `docs/RENOVATION_COMPLETION_REPORT.md` with:
  - Before/after screenshots (all 54 pages)
  - Component reuse metrics (82 → 50 components, ~1,400 LOC reduction)
  - Accessibility metrics (72% → 100% WCAG AA)
  - Keyboard navigation audit (0% → 100%)
  - ARIA label audit (50% → 100%)
  - Code quality metrics (build time, bundle size if tracked)
  - Team feedback (what went well, what to improve next)

---

## Success Metrics

| Metric | Target | Wave |
|--------|---|---|
| Component count | 50 (from 82) | Wave 1 |
| Code reduction | 1,400 LOC (from duplication) | Wave 1-2 |
| WCAG AA compliance | 100% (from 72%) | Wave 7 |
| Keyboard nav coverage | 100% (from 40%) | Wave 7 |
| ARIA label coverage | 100% (from 50%) | Wave 7 |
| Design system adoption | 100% of new components | Wave 2 |
| I18n coverage | 100% of user-facing text | Wave 2 |
| Build success | 100% (all waves) | All Waves |
| Page render success | 100% (all waves) | All Waves |

---

## Recommended Execution Model

**Small Team (1 developer, 1 designer)**:
- Execute Waves 0-2 sequentially (2-3 weeks)
- Execute Waves 3-6 sequentially (4-5 weeks)
- Execute Wave 7 (1 week)
- **Total**: 6-9 weeks

**Medium Team (2 developers, 1 designer)**:
- Execute Waves 0-2 sequentially (2-3 weeks)
- Execute Waves 3-6 in parallel pairs (2-3 weeks)
- Execute Wave 7 (1 week)
- **Total**: 4-6 weeks

**Large Team (4 developers, 1-2 designers)**:
- Execute Waves 0-2 sequentially (2-3 weeks)
- Execute Waves 3-6 in parallel (all 4 developers, 2-3 weeks)
- Execute Wave 7 (1 week)
- **Total**: 3-5 weeks

---

## Next Steps After MC69

After this audit is reviewed and approved:
1. **MC70**: Planning phase — Detailed task breakdown for Waves 0-1 (foundation + core components)
2. **MC71**: Execution phase — Implement Waves 0-1
3. **MC72+**: Continue through Waves 2-7 as per sequencing

**MC69 Deliverable**: This roadmap (implementation waves, safety boundaries, success metrics) provides the blueprint for all future renovation work.
