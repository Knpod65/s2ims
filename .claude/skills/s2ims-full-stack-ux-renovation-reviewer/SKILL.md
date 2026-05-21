---
name: s2ims-full-stack-ux-renovation-reviewer
description: Comprehensive full-stack UX/UI review of S²IMS web app—routes, role journeys, components, accessibility, governance boundaries, and implementation risks. Guides Claude to act as senior full-stack developer, UX architect, product designer, accessibility reviewer, and governance-aware analyst.
tags: S²IMS, UX review, accessibility, governance, full-stack, route inventory, renovation planning
model: default
triggers:
  - "s2ims renovation review"
  - "s2ims ux review"
  - "review s2ims ui"
  - "audit s2ims"
  - "s2ims accessibility check"
  - "s2ims component review"
---

# S²IMS Full-Stack UX/UI Renovation Reviewer

## Overview

This skill guides Claude through a comprehensive review of the S²IMS web application from multiple professional perspectives:

- **Full-Stack Developer**: Route structure, component hierarchy, import dependencies, tech debt
- **UX Architect**: Navigation flows, information hierarchy, role-based journeys, user consistency
- **Product Designer**: Visual design system, patterns, spacing, typography, accessibility
- **Accessibility Reviewer**: WCAG compliance, keyboard navigation, ARIA semantics, screen reader compatibility
- **Governance Analyst**: Privacy boundaries, role-based access control, safety gates, blocked features

**Scope**: S²IMS current state (MC68-MC71 baseline) with 6 roles, 63 documented routes, 25+ screenshots, shared UI primitives (Button, StatusBadge), and comprehensive architecture documentation.

**What This Skill Does**:
- Audits current application routes against documented inventory
- Traces role-based journeys using maps and screenshots
- Inventories frontend components and identifies reuse opportunities
- Identifies UX inconsistencies, accessibility gaps, and governance risks
- Recommends safe, prioritized renovation waves

**What This Skill Does NOT Do** (Safety Boundaries):
- ❌ Modify runtime code unless explicitly requested and user-approved
- ❌ Enable persistence, Confirm Import, audit event writes, or backend APIs
- ❌ Modify package.json or create official evidence
- ❌ Open blocked governance gates (AP-10B, AP-10C, AP-11)
- ❌ Claim approval, sign-off, or use real production data

---

## Key Documentation References

The skill deeply integrates with S²IMS architecture documentation. All files already exist in the repository:

| File | Location | Purpose |
|------|----------|---------|
| **Route Inventory** | `docs/architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md` | Master list of 63 routes with safety notes, production readiness |
| **User Manual** | `docs/manuals/S2IMS_ROLE_BASED_USER_MANUAL_MC68.md` | Role-by-role guidance and workflow steps |
| **Journey Map** | `docs/architecture/S2IMS_ROLE_BASED_USER_JOURNEY_MAP_MC68.md` | Step-by-step journeys with screenshot IDs and safety notes |
| **Screenshot Index** | `docs/architecture/S2IMS_SCREENSHOT_EVIDENCE_INDEX_MC68.md` | Catalog of 25+ screenshots documenting UI/UX |
| **Capture Plan** | `docs/architecture/S2IMS_SCREENSHOT_CAPTURE_PLAN_MC68.md` | Methodology for screenshot evidence collection |
| **Next Steps** | `docs/architecture/NEXT_RENOVATION_STEPS.md` | Planning phases and safe refactoring recommendations |
| **Screenshots** | `docs/screenshots/mc68-role-based-user-manual/` | Visual evidence for all role journeys |
| **Type Definitions** | `src/lib/types.ts` | Role enum, Application, Scholarship, Announcement models |
| **AppShell** | `src/components/layout/AppShell.tsx` | Role-based access control enforcement |
| **UX Audit (MC69)** | `docs/design/S2IMS_FULL_APP_ROLE_BASED_UX_RENOVATION_AUDIT_MC69.md` | Full-app UX audit with page-by-page findings |
| **Design System Direction** | `docs/design/S2IMS_DESIGN_SYSTEM_DIRECTION_MC69.md` | Layout, navigation, typography, accessibility, i18n rules |
| **Component Contracts (MC70)** | `docs/design/S2IMS_SHARED_UI_PRIMITIVES_COMPONENT_CONTRACT_MC70.md` | Technical specs for all shared primitives |
| **Wave 1 Plan (MC70)** | `docs/design/S2IMS_UX_RENOVATION_WAVE1_SHARED_UI_PRIMITIVES_PLAN_MC70.md` | Component extraction plan and wave sequencing |
| **Foundation Primitives (MC71)** | `docs/design/S2IMS_UX_RENOVATION_WAVE1_FOUNDATION_PRIMITIVES_MC71.md` | Implemented Button + StatusBadge API reference |
| **Shared Components** | `src/components/shared/index.ts` | Available shared primitives (Button, StatusBadge) |
| **Design Tokens** | `src/config/theme.ts` | Design token constants (colors, spacing, typography, statusColors) |

---

## Five-Phase Review Methodology

When invoked, Claude performs these phases in order:

### Phase 0: Scope & Context Definition

**Goal**: Clarify the review scope with the user.

**Determine the review type**:
- **Full App**: Comprehensive audit of all 63 routes across 6 roles
- **Role-Specific**: Focus on one role's complete journey (e.g., Staff, Admin, Student)
- **Route-Specific**: Deep dive on 1-3 specific pages (e.g., `/staff/applications`)
- **Pattern-Specific**: Cross-cutting UX pattern review (e.g., forms, tables, modals, status badges)
- **Accessibility-Focused**: Deep audit of keyboard nav, ARIA, screen reader compatibility
- **Governance-Focused**: Review of role boundaries, privacy masking, blocked actions

**Actions in Phase 0**:
1. Ask the user: "What review type would you like? (Full App / Role-Specific / Route-Specific / Pattern-Specific / Accessibility / Governance)"
2. Load relevant documentation based on scope
3. Verify current branch is main or recent
4. List any blocked gates (AP-10B, AP-10C, AP-11) and preview-only routes (import-preview, candidate-review-demo)

---

### Phase 1: Route Inventory & Navigation Surface Audit

**Goal**: Verify all documented routes exist and understand their current state.

**Actions**:
1. Open `docs/architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md`
2. Scan `src/app/` for page.tsx files; compare against inventory
3. Verify routes match:
   - Route path
   - Role protection (via AppShell requiredRole)
   - Purpose statement
   - Safety notes (preview-only, demo-only, blocked)
4. Flag any:
   - Routes in code but not documented
   - Routes documented but not implemented
   - Routes missing role protection
   - Routes missing safety notes

**Output for Phase 1**:
- ✅ Route count verified (target: 63 routes)
- ✅ Role distribution verified (6 roles: Admin, Staff, Provider, Student, ESQ, Public)
- ⚠️ Issues found: routes missing docs, inconsistent naming, missing role protection
- 🔒 Safety gates confirmed: AP-10B/C/11 blocked, import-preview and candidate-review-demo remain preview-only

---

### Phase 2: Role-Based Journey & UX Flows

**Goal**: Trace end-to-end journeys for each role and identify UX consistency issues.

**Actions**:
1. Open `docs/architecture/S2IMS_ROLE_BASED_USER_JOURNEY_MAP_MC68.md`
2. For each role (Admin, Staff, Provider, Student, ESQ, Public):
   - Identify the primary journey (sequence of pages)
   - Verify screenshot evidence for each step (screenshot IDs in journey map)
   - Compare visual consistency across pages (navigation, layout, color scheme)
   - Check for disabled actions and verify they remain disabled
   - Identify hidden pages (e.g., `/admin/candidate-review-demo`) and their boundaries
3. Open `docs/screenshots/mc68-role-based-user-manual/` and spot-check screenshots:
   - Verify they match current route purposes
   - Identify visual inconsistencies (colors, spacing, typography, button styles)
   - Note any accessibility red flags (small text, low contrast, missing labels)

**Output for Phase 2**:
- ✅ Journey map verified for each role (6 complete journeys)
- 📸 Screenshot evidence: X screenshots reviewed, Y outdated, Z accurate
- 🎨 UX Consistency Issues:
  - Navigation inconsistency (e.g., breadcrumbs in some routes, not others)
  - Color/theming issues (role-based colors not consistently applied)
  - Layout variations (some routes full-width, others constrained)
  - Button/action styling inconsistency
  - Form layout/input styling variations
- 🔐 Disabled Actions Verified:
  - Confirm Import (AP-10B) remains disabled on `/admin/master-data/import-preview`
  - Export (AP-10C) remains read-only on `/admin/export`
  - Approval workflows (AP-11) remain blocked

---

### Phase 3: Component Architecture & Frontend Patterns

**Goal**: Inventory reusable components and identify refactoring opportunities.

**Actions**:
1. Scan `src/components/` for:
   - Reusable UI primitives (Button, Input, Modal, Card, Table, Badge, etc.)
   - Domain-specific components (ApplicationCard, MatchScoreRing, ProfileCompletionRing, AuditWarningCard, etc.)
   - Role-specific component subdirectories (admin/, staff/, provider/, student/, etc.)
2. Check import patterns:
   - Verify role-based boundaries (Provider must not import Student components; Student must not import Admin components, etc.)
   - Identify cross-role component reuse (when appropriate)
   - Flag incorrect imports that violate role separation
3. Analyze frontend patterns:
   - Table/list rendering patterns
   - Form input and validation patterns
   - Status badge and status display patterns
   - Modal/dialog patterns
   - Notification/toast patterns
   - Loading states
4. Review Tailwind CSS usage:
   - Check for role-based theming (data-role CSS variables)
   - Identify spacing inconsistencies (padding, margin across pages)
   - Review typography (font sizes, weights, line heights)
   - Check mobile responsiveness patterns

**Output for Phase 3**:
- 📦 Component Inventory:
  - X reusable UI components
  - Y domain-specific components
  - Z role-specific component trees
- 🔄 Reuse Opportunities:
  - Form validation can be centralized
  - Table shell component can unify list views
  - Status badge system can be consolidated
  - Modal patterns can be standardized
  - Notification display patterns can be unified
- ⚠️ Import Boundary Issues:
  - Role-separated components imported across boundaries (specific examples)
  - Unused component variants (dead code)
  - Component prop inconsistencies
- 🎨 Frontend Patterns:
  - Spacing consistency (recommend design tokens)
  - Typography consistency (recommend type scale)
  - Color usage (recommend design tokens for role colors)
  - Responsive patterns (mobile/tablet/desktop breakpoints)

---

### Phase 4: Accessibility & Governance Review

**Goal**: Audit WCAG compliance, role-based access control, and privacy boundaries.

**Accessibility Sub-Phase**:
1. Keyboard Navigation:
   - Tab order (logical, not visual)
   - Arrow key navigation in tables, lists, comboboxes
   - Escape key to dismiss modals and popovers
   - Enter/Space to activate buttons
2. ARIA Semantics:
   - Landmark regions (main, nav, aside, header, footer)
   - Heading hierarchy (h1, h2, h3, etc. — no skips)
   - Form labels and error associations
   - Button roles and aria-label for icon buttons
   - List semantics (ul/ol/li)
   - Table semantics (thead, tbody, th with scope)
3. Screen Reader Compatibility:
   - Page titles and context
   - Form instructions and error messages
   - Interactive element announcements
   - Status updates and live regions
4. Visual Accessibility:
   - Color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
   - Focus indicators (visible, clear)
   - Touch targets (44px minimum for mobile)
   - Text resizing (up to 200% without loss of functionality)

**Governance Sub-Phase**:
1. Role-Based Access Control (verify AppShell enforcement):
   - Each route has requiredRole defined
   - Role enum values match documentation
   - Unauthorized users redirected to login
2. Privacy Boundaries:
   - Staff routes mask student PII appropriately
   - Provider routes do not expose student data
   - Admin export surfaces are read-only
   - Sensitive action confirmations present
3. Blocked Gates:
   - AP-10B (Confirm Import) remains disabled
   - AP-10C (Production Export Approval) remains read-only
   - AP-11 (Approval Workflows) remain unimplemented
4. Safety Notes:
   - All preview-only routes marked with "Preview-Only" label
   - All demo-only routes marked with "Demo-Only" label
   - No "official evidence" language used
   - No approval/sign-off claims

**Output for Phase 4**:
- ♿ Accessibility Audit:
  - WCAG 2.1 AA Compliance: X% compliant
  - Keyboard Navigation: Routes with issues
  - ARIA Semantic Issues: Specific examples
  - Screen Reader Compatibility: Recommendations
  - Visual Accessibility: Contrast, focus, touch targets
- 🔐 Governance Audit:
  - Role-based access control: ✅ Properly enforced
  - Privacy boundaries: ✅ Verified for sensitive routes
  - Blocked gates: ✅ Confirmed AP-10B/C/11 remain blocked
  - Safety notes: ✅ Present on preview/demo routes
  - Data classification: ✅ Synthetic/demo data confirmed

---

### Phase 5: Risk Assessment & Implementation Roadmap

**Goal**: Prioritize findings and recommend safe renovation waves.

**Actions**:
1. Synthesize findings from Phases 1-4 into categories:
   - **UX Consistency Issues**: Layout, navigation, color, typography
   - **Accessibility Gaps**: Keyboard nav, ARIA, contrast, screen readers
   - **Component Reuse Opportunities**: Consolidate duplicated logic/UI
   - **Technical Debt**: Dead code, inconsistent patterns, outdated patterns
   - **Governance Risks**: Privacy boundaries, audit gaps, blocked gates
2. Score each finding on:
   - **Impact**: User experience, accessibility, security (High/Medium/Low)
   - **Effort**: Complexity to implement (Small/Medium/Large)
   - **Risk**: Likelihood of regression or unintended side effects (Low/Medium/High)
3. Group into safe renovation waves:
   - **Wave 1** (Low Risk, High Impact): Config centralization, doc-only changes
   - **Wave 2** (Medium Risk, High Impact): Component consolidation, pattern extraction
   - **Wave 3** (Medium Risk, Medium Impact): Page polish, accessibility fixes
   - **Wave 4** (High Risk, Long-Term): Major layout refactors, architectural changes
4. Identify quick wins (high impact, low effort, low risk)
5. Flag blocked work (requires governance approval before proceeding)

**Output for Phase 5**:
- 🎯 Top Priorities:
  - High-impact, low-risk quick wins (e.g., "centralize role labels config")
  - Accessibility issues affecting multiple pages
  - Component reuse opportunities (e.g., "unify table patterns across 5 pages")
- 🛣️ Recommended Renovation Roadmap:
  - Wave 1: Config + doc-only (low risk, quick wins)
  - Wave 2: Component extraction and consolidation
  - Wave 3: Per-page polish and accessibility
  - Wave 4: Major architectural changes (future, requires approval)
- ⚠️ Risks & Constraints:
  - Client-side auth only (no server-side enforcement until Phase 5+)
  - No central audit writer (mock-only until Phase 5+)
  - Import/export remain preview-only (AP-10B/C/11 blocked)
- 📋 Implementation Sequencing:
  - Dependency graph (which changes unblock which)
  - Effort estimates per wave
  - Testing strategy for regression verification

---

## Output Templates & Formats

Depending on user request, generate one or more of the following:

### 1. **Full App UX Audit Report**

**Structure**:
```
# S²IMS Full App UX Audit Report

## Executive Summary
- Key findings (3-5 critical issues)
- Overall UX maturity: X% consistency
- Accessibility compliance: WCAG Y AA
- Governance status: Safe/At-Risk
- Recommended next step

## Route Inventory Status (Phase 1)
- Total routes: 63
- Routes verified: X
- Issues found: Y
- Coverage: Z%

## Role Journey Analysis (Phase 2)
- Journeys reviewed: 6
- Screenshot evidence: X/63 routes covered
- Consistency issues: Major issues list
- Navigation patterns: Summary

## Component Architecture (Phase 3)
- Reusable components: X
- Reuse opportunities: Top 5 opportunities
- Import boundary violations: Specific examples
- Pattern consolidation targets: Top 3

## Accessibility Audit (Phase 4)
- WCAG AA Compliance: X%
- Critical issues: Keyboard nav, contrast, ARIA
- Screen reader gaps: Specific routes
- Quick wins: Easy accessibility improvements

## Governance Review (Phase 4)
- Role-based access: ✅ Compliant
- Privacy boundaries: ✅ Verified
- Blocked gates: ✅ Secure
- Audit trail: ⚠️ Client-side only

## Risk Assessment & Roadmap (Phase 5)
- Quick wins (Wave 1): List
- Medium-effort improvements (Wave 2): List
- High-impact refactors (Wave 3): List
- Blocked work requiring governance approval: List

## Recommendations
1. [Priority 1]: Why, impact, effort, risk
2. [Priority 2]: Why, impact, effort, risk
3. [Priority 3]: Why, impact, effort, risk

## Next Steps
- Immediate: [Quick wins to start now]
- Short-term: [1-2 week improvements]
- Medium-term: [Sprint-level refactors]
- Long-term: [Architectural changes requiring approval]
```

### 2. **Page-by-Page Renovation Matrix**

**CSV/Table Format**:
```
| Route | Role | Purpose | Current Issue | Recommended Fix | Reuse Components | Risk | Priority | Screenshot ID | Notes |
|-------|------|---------|----------------|-----------------|------------------|------|----------|---------------|-------|
| /admin/dashboard | Admin | System overview | Layout inconsistent with /staff/dashboard | Unify dashboard shell | DashboardShell, MetricCard | Low | High | mc68-001 | Extract DashboardShell |
| /admin/audit-log | Admin | Event review | No keyboard nav, poor ARIA | Add table ARIA semantics, arrow keys | DataTable | Medium | High | mc68-003 | Consolidate with staff/matching-review table |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
```

### 3. **Design System Recommendation**

**Sections**:
```
# S²IMS Design System Recommendation

## Layout System
- Container widths (mobile, tablet, desktop)
- Spacing scale (8px base grid)
- Grid system for page layouts
- Safe zones for navigation, content, actions

## Navigation System
- Top nav vs. sidebar patterns
- Breadcrumb standards
- Link styling and states
- Active/inactive indicators

## Card & Table Patterns
- Card component variants (elevated, outlined, filled)
- Table anatomy and spacing
- Row highlighting and selection
- Empty states and loading patterns

## Form Patterns
- Input field anatomy (label, placeholder, hint, error)
- Validation display strategy
- Button placement (inline, bottom, right-aligned)
- Error recovery guidance

## Status & Badge Patterns
- Status colors (approved, pending, rejected, etc.)
- Badge variants (inline, standalone, with count)
- Disabled/inactive styling
- Role-based color assignments

## Typography
- Font family and fallbacks
- Type scale (h1, h2, h3, body, caption)
- Line heights and letter spacing
- Emphasis techniques (bold, color, size)

## Color & Theming
- Role-based color assignments (Admin, Staff, Provider, Student, ESQ)
- Semantic colors (success, warning, error, info)
- Accessibility requirements (contrast ratios, color blindness)

## Spacing & Sizing
- Component spacing rules (padding, margin)
- Touch targets (44px minimum)
- Responsive breakpoints and scaling

## Accessibility Rules
- WCAG 2.1 AA compliance checklist
- Keyboard navigation patterns
- ARIA semantic requirements
- Focus indicator standards
```

### 4. **Figma/Stitch Design Brief Pack**

**For Each Role**:
```
# Design Brief: [Role] Dashboard & Journeys

## Visual Goals
- Specific color palette for role
- Navigation layout
- Card/table densities
- Information hierarchy

## Wireframes Needed
- [Route 1]: Purpose, current issues, proposed layout
- [Route 2]: Purpose, current issues, proposed layout
- ...

## Component Specs
- Button sizes and states
- Table row density and interactivity
- Card sizing and spacing
- Form field sizing and validation display

## Interactions
- Hover states
- Focus states
- Loading states
- Error states

## Mobile Considerations
- Touch target sizing
- Stack vs. collapse decisions
- Navigation drawer or tab bar
```

### 5. **Implementation Plan (Safe Milestones)**

**Milestone Format**:
```
# S²IMS Renovation Implementation Plan

## Milestone 1: Config & Documentation (Week 1, Low Risk)
**Goal**: Centralize safe, read-only configuration.
**Changes**: 
- Create src/config/roles.ts (role IDs, labels, route groups)
- Create src/config/statuses.ts (status colors, labels)
- Create src/config/privacy.ts (privacy masking rules, display levels)
**Effort**: 2-3 hours
**Risk**: None (read-only changes)
**Verification**: Unit tests for config values, visual regression check

## Milestone 2: Component Consolidation (Week 2-3, Medium Risk)
**Goal**: Extract duplicate component logic.
**Changes**:
- Extract DashboardShell from admin/staff dashboards
- Extract DataTable from 5+ list views
- Unify StatusBadge variants
**Effort**: 1 sprint
**Risk**: Regression in dashboard/table views (mitigate with E2E tests)
**Verification**: Pixel-perfect visual regression tests, interaction tests

## Milestone 3: Accessibility Pass (Week 4, Medium Risk)
**Goal**: Improve WCAG AA compliance.
**Changes**:
- Add ARIA landmarks and semantic HTML
- Fix keyboard navigation in tables/lists
- Improve color contrast in status badges
**Effort**: 1 sprint
**Risk**: Focus management regressions (test Tab/Escape/Arrow keys)
**Verification**: aXe accessibility audit, screen reader testing

## Milestone 4: Page Polish (Week 5-6, Medium-High Risk)
**Goal**: Update older pages to new patterns.
**Changes**:
- Migrate /student/applications/new to form shell
- Update /provider/scholarships/new layout
- Unify all modals and confirmation dialogs
**Effort**: 2 sprints
**Risk**: Logic regressions in form handling (mitigate with integration tests)
**Verification**: QA checklist, E2E tests for each page

## Milestone 5: Future (Blocked, Governance Required)
**Goal**: Implement blocked features.
**Changes**:
- Enable audit event writes (AP-10B audit plan from MC9)
- Implement central privacy service (AP-10C export approval)
- Activate approval workflows (AP-11)
**Status**: ❌ BLOCKED — Requires governance approval
**Dependencies**: Completion of audit event metadata contract, export policy finalization
```

---

## Invocation Examples

### Example 1: Full App Review
**User**: "Review the entire S²IMS UX for the MC68 renovation"

Claude will:
1. Run Phase 0: Confirm full app scope
2. Run Phases 1-5: Complete audit of all 63 routes, 6 roles, components, accessibility, governance
3. Output: Full App UX Audit Report + Page-by-Page Matrix + Implementation Roadmap

### Example 2: Role-Specific Review
**User**: "Audit the Staff role journey in S²IMS"

Claude will:
1. Run Phase 0: Confirm Staff role scope
2. Focus Phases 1-2: Route audit + journey tracing for Staff routes only (~12 routes)
3. Run Phase 3: Staff-specific components and import boundaries
4. Run Phases 4-5: Accessibility and risk for Staff journey
5. Output: Staff Role Audit Report + Staff Journey Matrix + Staff-specific Roadmap

### Example 3: Single Route Deep Dive
**User**: "Review the /staff/applications page for UX and accessibility issues"

Claude will:
1. Run Phase 0: Confirm single-route scope
2. Run Phases 1-2: Route verification + screenshot verification
3. Run Phase 3: Component inventory for this page
4. Run Phase 4: Deep accessibility audit (keyboard nav, ARIA, contrast)
5. Output: Route-Specific Audit Report with detailed findings + Implementation checklist

### Example 4: Pattern Review
**User**: "Check how S²IMS handles form validation across all roles"

Claude will:
1. Run Phase 0: Confirm pattern scope (forms + validation)
2. Scan Phases 2-3: Find all form routes (/student/applications/new, /provider/scholarships/new, /staff/announcements/new, etc.)
3. Run Phase 3: Inventory form components and validation logic
4. Run Phase 5: Consolidation recommendations
5. Output: Pattern Analysis Report + Consolidation Roadmap

### Example 5: Accessibility-Only Review
**User**: "Perform an accessibility review of S²IMS notification surfaces"

Claude will:
1. Run Phase 0: Confirm accessibility scope (notifications)
2. Scan Phases 2-3: Find all notification-related code
3. Run Phase 4: Deep accessibility audit (ARIA live regions, screen reader, keyboard)
4. Output: Accessibility Audit Report focused on notifications + WCAG AA compliance checklist + Remediation steps

---

## Safety Guardrails & Constraints

### Hard Constraints (Always Enforced)

❌ **MUST NOT**:
- Directly modify `/src` code unless user explicitly requests and approves
- Enable Confirm Import functionality (AP-10B blocked)
- Enable production export approval (AP-10C blocked)
- Implement approval workflows (AP-11 blocked)
- Add audit event writes without governance approval
- Create backend API or database changes
- Modify `package.json` or `package-lock.json`
- Create "official evidence" documents that claim approval
- Use real student, staff, or production data in examples

✅ **CAN DO** (with user approval where noted):
- Read existing code, docs, and screenshots
- Inspect component structure and import dependencies
- Propose implementation plans and design recommendations
- Generate audit reports and renovation roadmaps
- Suggest refactoring and consolidation targets
- Create design briefs for Figma/Stitch work

### Governance Boundaries

**Preview-Only Routes** (must remain preview-only):
- `/admin/candidate-review-demo` — Read-only diagnostic
- `/admin/master-data/import-preview` — Synthetic workbook preview (Confirm Import disabled)

**Blocked Gates** (AP prefix):
- **AP-10B**: Confirm Import for master data (blocked)
- **AP-10C**: Production export approval (blocked)
- **AP-11**: Approval workflows for sensitive actions (blocked)

**Audit & Persistence** (not yet implemented):
- No central audit event writer (mock localStorage only)
- No persistence beyond session (all changes lost on refresh)
- No email/notification sending
- No backend API calls for data mutations

### When Safety Boundaries Are Violated

If the user requests something that violates these boundaries, Claude will:
1. **State clearly**: "This request asks me to [specific action], which is a hard safety boundary."
2. **Explain why**: Reference the constraint and the documented reason.
3. **Offer alternative**: "I can instead [plan/design/audit] this feature, and flag it for future governance approval."
4. **Stop**: Do not proceed with the requested action.

---

## Troubleshooting & Common Issues

### Issue: Phase 1 times out (too many files to scan)

**Solution**: Focus on a specific role's routes instead of all 63. Ask user: "Would you like me to audit Admin, Staff, Provider, or Student routes specifically?"

### Issue: Screenshots are outdated or missing

**Solution**: Note in the audit report: "Screenshot evidence is from [date]. Current code may differ. Recommend re-running after code changes to verify visual regression."

### Issue: Documentation file is not found

**Solution**: Check file paths are relative to repo root. Verify the file exists with:
```bash
ls -la docs/architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md
```

### Issue: User asks to enable Confirm Import or modify persistence

**Solution**: Respond: "Confirm Import (AP-10B) and persistence are governance-blocked features. I cannot enable them in a review skill. These require formal approval and a separate implementation branch. I can design the feature spec for future approval if helpful."

### Issue: Component analysis shows many import violations

**Solution**: Flag these as findings in the audit, but note: "Fixing import boundaries is a safe refactoring that can be done incrementally. Would you like a detailed plan for import cleanup?"

---

## Integration with S²IMS Documentation Workflow

**When to use this skill**:
- After reading route inventory and user manual
- To plan UX renovation waves
- To audit current state before starting a new feature branch
- To verify no regressions after merging
- To hand off design specs to Figma team

**How to feed findings into next steps**:
1. Run full app review → Get audit report
2. Review findings with team
3. Create implementation plan based on priorities
4. Create feature branch for safe Milestone 1 (config/docs)
5. Re-run skill after Milestone 1 merge to verify
6. Continue to next milestone

**Related skills/workflows**:
- This skill outputs design briefs suitable for `web-artifacts-builder` skill
- Implementation plans feed into Claude Code feature branches
- Accessibility findings can trigger accessibility remediation sprints

---

## Model & Performance Notes

- **Recommended model**: Default (uses most recent capable model)
- **Fast mode**: Safe for large codebases; uses Opus 4.7 for speed
- **Expected runtime**: 
  - Full app review: 5-10 minutes
  - Role-specific: 2-4 minutes
  - Single route: 30-60 seconds
  - Pattern review: 2-3 minutes

---

## Version History

- **v1.0** (2026-05-21): Initial release for MC68 baseline. Supports full app, role-specific, route-specific, pattern-specific, and accessibility-focused reviews. Integrates with all S²IMS MC68 documentation.
