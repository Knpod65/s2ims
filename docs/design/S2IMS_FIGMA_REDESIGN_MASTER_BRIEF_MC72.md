# S²IMS Figma Redesign Master Brief — MC72

**Status**: MC72 Design Documentation  
**Date**: 2026-05-21  
**Branch**: architecture/s2ims-figma-redesign-brief-role-screen-plan-mc72  
**Scope**: Figma-ready redesign brief for all S²IMS role screens

---

## MC72 Scope Statement

MC72 is documentation/design-only. It prepares Figma-ready redesign briefs, screen frame plans, and design prompts for the S²IMS application. It does not modify runtime code, does not migrate pages, does not enable persistence/audit writes/official evidence, and does not open AP-10B/AP-10C/AP-11.

---

## 1. Product Context

**Application**: S²IMS (Scholarship Management Information System)  
**Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS  
**State**: Preview/demo-safe — key governance gates remain locked  
**Roles**: Admin, Scholarship Staff, Provider, Student, ESQ (External Scholarship Qualifier), Public

**Key constraints for design**:
- AP-10B (Confirm Import) is disabled — import-preview screens must NOT show an active "Import" button
- AP-10C (Export Approval) is blocked — export screens are read-only display
- AP-11 (Approval Workflows) is blocked — candidate-review-demo screens must NOT show an active "Approve/Reject" button
- All mock data only — no real student PII should appear in design mockups
- PDPA compliance — PII fields must be masked based on viewer role

**Available shared primitives (from MC71)**:
- `Button` — 4 variants (primary, secondary, ghost, danger) × 3 sizes
- `StatusBadge` — 8 semantic statuses (success, warning, error, info, neutral, blocked, preview, disabled)
- Design tokens in `src/config/theme.ts` — colors, spacing, typography, statusColors

---

## 2. Visual Direction

**Character**: Clean, calm, trustworthy, professional  
**Tone**: Public-sector efficient — not corporate-glossy, not bureaucratic-heavy  
**Palette**: Blue-anchored (primary blue-500) with semantic status colors  
**Language**: Bilingual Thai/English — Thai primary, English secondary  
**Layout**: Dashboard-first, data-rich but not overwhelming  

**Do**:
- Use whitespace generously — avoid cramped tables
- Use card-based metric summaries on dashboards
- Use semantic color coding for status (green=success, amber=warning, red=error)
- Use role-aware sidebar navigation
- Use bilingual labels consistently (Thai label / English sub-label or tooltip)

**Don't**:
- Flat lists of raw data without summarization
- Mixed language buttons (e.g., Thai label with English-only tooltip)
- Decorative imagery that doesn't serve information
- Dark mode (not in scope)
- Animations beyond micro-transitions (load states, hover)

---

## 3. Design Principles

### P1 — Role-Aware
Every screen is designed for a specific role's cognitive context. Admin sees oversight controls. Staff sees workflow queues. Student sees their own journey only.

### P2 — Accessible First (WCAG 2.1 AA)
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- Focus rings on all interactive elements (2px blue ring on keyboard focus)
- ARIA landmarks: `<main>`, `<nav>`, `<header>`, skip-to-main link
- Screen reader labels on icons and status badges
- Keyboard-navigable tables (Tab to enter, arrow keys to navigate)

### P3 — Empty-State First
Design every list/table with an empty state — no data, filtered-empty, and loading skeleton states. Never leave blank white space.

### P4 — Governance-Honest
Disabled features are visibly disabled — not hidden. Use `DisabledActionHint` tooltip to explain why. Never imply a feature is available when the governance gate is locked.

### P5 — Bilingual
Thai is the primary language. English appears as:
- Secondary label below Thai label (on form fields)
- Tooltip on bilingual-ambiguous status terms
- Toggle option where space allows

### P6 — Performance-Conscious
Prefer CSS transitions over JavaScript animations. Use skeleton loaders over spinners for data-heavy screens. Lazy-load heavy chart components.

### P7 — Mobile-Tolerant
Core functionality is accessible on tablet (768px+). Mobile (≤640px) shows simplified navigation drawer. Desktop (1280px+) shows full sidebar + content area.

---

## 4. Role-Based UX Principles

### Admin
- Primary concern: oversight, auditability, data quality
- Key affordances: audit log access, master data import (preview-only), candidate review (demo-only), system-wide stats
- Visual priority: aggregate metrics first, drill-down second
- Governance note: import/approval buttons are disabled — show DisabledActionHint explaining system readiness status

### Scholarship Staff
- Primary concern: application processing, status tracking, candidate coordination
- Key affordances: application queue, status updates, analytics, OCR corrections, follow-up communications
- Visual priority: queue with urgency/priority signals, then workflow progress
- Data sensitivity: can see student names + IDs but not financial details

### Provider
- Primary concern: scholarship management, candidate visibility, outcome tracking
- Key affordances: scholarship CRUD, matched candidate list, application status, outcome recording
- Visual priority: scholarship health overview, then candidate pipeline
- Data sensitivity: can see candidate match scores but not raw application essays

### Student
- Primary concern: application submission, status tracking, notifications
- Key affordances: scholarship discovery, application form, status timeline, notification center
- Visual priority: call-to-action (apply now), then status tracking
- Privacy: sees only their own data

### ESQ (External Scholarship Qualifier)
- Primary concern: pre-qualification review, recommendation
- Key affordances: review queue, qualification criteria checklist, history
- Visual priority: pending reviews first
- Governance note: qualification is read-only recommendation — no binding approval

### Public
- Primary concern: scholarship discovery, eligibility check
- Key affordances: scholarship browse, filter/search, eligibility quiz
- Visual priority: search/filter first, scholarship cards second
- No auth required — no personal data shown

---

## 5. Accessibility Principles

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Color contrast (body) | ≥ 4.5:1 | Use gray-700 on white (#374151 on #FFF = 10.7:1) |
| Color contrast (large text) | ≥ 3:1 | Use gray-500 on white for secondary labels |
| Focus ring | Visible, 2px | `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2` |
| ARIA landmarks | Required | `<header>`, `<main>`, `<nav>`, `<aside>` |
| Skip link | Required | "Skip to main content" as first focusable element |
| Icon labels | Required | All icon-only buttons have `aria-label` |
| Table navigation | Keyboard | Tab enters table, arrow keys navigate cells |
| Status badges | Screen reader | `role="img"` + `aria-label` with full status description |
| Form errors | Screen reader | `aria-invalid`, `aria-describedby` linking to error message |
| Loading states | Announced | `aria-live="polite"` on data loading regions |

---

## 6. Bilingual Copy Rules

1. **Thai primary, English secondary**: Thai label is the primary display label. English appears as tooltip, sub-label, or toggle.
2. **No mixed-language buttons**: A button is either fully Thai OR fully English. Never split.
3. **Status terms**: Translate all status terms to Thai with English in parentheses for first occurrence on a page.
4. **Error messages**: Thai error message with English equivalent available on expand/tooltip.
5. **Empty states**: Bilingual — Thai headline + English sub-copy (or vice versa based on screen context).
6. **Number formatting**: Use Thai numerals for official Thai-language contexts; Arabic numerals for technical IDs.
7. **Date formatting**: Thai Buddhist Era (พ.ศ.) for official documents; Gregorian for API/technical display.

---

## 7. Governance Visual Rules

### Preview-Only Routes
Routes flagged as `preview-only` or `demo-only` in ROUTE_INVENTORY_MC68.md must show a `SafetyBanner` at the top of the screen.

**SafetyBanner design**:
- Yellow/amber background (bg-amber-50, border-amber-200)
- Icon: `AlertTriangle` from lucide-react
- Thai text: "หน้าจอตัวอย่างเท่านั้น — ยังไม่เปิดใช้งานจริง"
- English sub-text: "Preview only — feature not yet enabled"
- No dismiss button (permanent while on that route)

### Import-Preview Route (`/admin/master-data/import-preview`)
- Table shows mock data with SafetyBanner
- "Import" button shows as `<Button variant="primary" disabled>นำเข้า (ปิดใช้งาน)</Button>` with `DisabledActionHint` tooltip: "นำเข้าข้อมูลจริงยังไม่เปิดให้ใช้งาน (AP-10B)"
- No drag-and-drop file upload affordance

### Candidate Review Demo (`/admin/candidate-review-demo`)
- Candidate cards show with SafetyBanner
- "Approve" and "Reject" buttons show as disabled with DisabledActionHint: "ระบบอนุมัติยังไม่เปิดใช้งาน (AP-11)"
- Score rings and match indicators are visible (read-only review is the feature)

### Export Route (`/admin/export`)
- Table/list is visible (read-only)
- "Export CSV" shows as disabled: "การส่งออกข้อมูลยังไม่เปิดใช้งาน (AP-10C)"

---

## 8. Design Token Reference

From `src/config/theme.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `colors.primary` | `#3B82F6` (blue-500) | Primary actions, links, brand |
| `colors.success` | `#10B981` (emerald-500) | Success states, completed |
| `colors.warning` | `#F59E0B` (amber-500) | Warning, pending review |
| `colors.error` | `#EF4444` (red-500) | Error, rejection, danger |
| `colors.info` | `#0EA5E9` (sky-500) | Informational, neutral highlight |
| `colors.gray.700` | `#374151` | Body text (primary) |
| `colors.gray.500` | `#6B7280` | Secondary text, labels |
| `colors.gray.200` | `#E5E7EB` | Borders, dividers |
| `colors.gray.50` | `#F9FAFB` | Page background, card backgrounds |
| `spacing.md` | `16px` | Standard component padding |
| `spacing.lg` | `24px` | Section spacing |
| `spacing.xl` | `32px` | Page section gaps |
| `radius.md` | `6px` | Component border radius |
| `radius.lg` | `8px` | Card border radius |
| `radius.full` | `9999px` | Badge/pill border radius |

**StatusBadge colors** (from `statusColors` in theme.ts):

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| success | bg-emerald-100 | text-emerald-800 | border-emerald-200 |
| warning | bg-amber-100 | text-amber-800 | border-amber-200 |
| error | bg-red-100 | text-red-800 | border-red-200 |
| info | bg-sky-100 | text-sky-800 | border-sky-200 |
| neutral | bg-gray-100 | text-gray-700 | border-gray-200 |
| blocked | bg-gray-200 | text-gray-600 | border-gray-300 |
| preview | bg-purple-100 | text-purple-800 | border-purple-200 |
| disabled | bg-gray-100 | text-gray-400 | border-gray-200 |

---

## 9. Component Inventory (Available in MC71)

| Component | Import | Key Props |
|-----------|--------|-----------|
| `Button` | `@/components/shared` | variant, size, loading, iconStart, iconEnd, disabled |
| `StatusBadge` | `@/components/shared` | label, status, icon, size |

**Planned components (future MCs, design-phase reference)**:
- `PageHeader` — title + breadcrumb + action area
- `SafetyBanner` — preview-only/governance-blocked notice
- `PreviewOnlyNotice` — route-level preview warning
- `GovernanceBlockedNotice` — AP-10B/C/11 blocking explanation
- `EmptyState` — no-data/filtered/loading skeleton
- `MetricCard` — KPI dashboard card with optional trend
- `DataTable` — sortable, paginated, keyboard-navigable table shell
- `FormShell` — field layout, validation error display, multi-step
- `RoleBadge` — current user role indicator in header
- `FilterBar` — search + filter row above data tables
- `DisabledActionHint` — tooltip explaining why an action is disabled
- `DashboardShell` — sidebar + header + main content layout

---

## 10. Figma Setup Recommendations

### Frame Size
- Desktop: 1440 × 900px
- Tablet: 1024 × 768px
- Mobile: 390 × 844px (iPhone 14 Pro reference)

### Layer Naming Convention
- Role prefix: `[admin]`, `[staff]`, `[provider]`, `[student]`, `[esq]`, `[public]`
- Screen: `[admin] Dashboard — Overview`
- State suffix: `–default`, `–hover`, `–loading`, `–empty`, `–error`

### Component Library Structure
- `Primitives/` — Button, StatusBadge, Input, Select, Checkbox
- `Layout/` — Sidebar, Header, PageHeader, DashboardShell
- `Feedback/` — SafetyBanner, EmptyState, DisabledActionHint, MetricCard
- `Data/` — DataTable, FilterBar, RoleBadge
- `Forms/` — FormShell, FormField, ValidationError

### Auto-Layout Guidelines
- Use auto-layout for all components
- Set gap values matching spacing tokens: xs=4, sm=8, md=16, lg=24, xl=32
- Set padding matching spacing tokens

---

## Safety Statement

MC72 is documentation/design-only. It prepares Figma-ready redesign briefs and screen frame plans but does not modify runtime code, does not migrate pages, does not enable persistence/audit writes/official evidence, and does not open AP-10B/AP-10C/AP-11.

---

**Document Status**: MC72 Design Documentation  
**Last Updated**: 2026-05-21  
**Phase**: MC72 Implementation (Phase 3 — Document Creation)
