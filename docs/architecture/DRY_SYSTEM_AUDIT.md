# DRY System Audit

## Purpose

Document repeated patterns across the s2ims codebase. Identify what is already shared, what
is duplicated, and what should eventually be extracted. This is a discovery document only —
no refactoring is authorized here.

---

## A. Status Display Repetition

### Already Centralized (Good)

| Resource | Location | What it provides |
|----------|----------|-----------------|
| Status config registry | `src/config/statuses.ts` | All status groups: application, document, scholarship, shortlist, candidate pool, review, disclosure, audit risk, data freshness — each with key, bilingual label, semantic intent, badge tone, terminal flag |
| Status helper functions | `src/config/statusHelpers.ts` | `getStatusConfig()`, `getStatusLabel()`, `getStatusTone()`, `isTerminalStatus()`, `requiresAction()` |
| Document status student config | `src/config/documentStatusDisplay.ts` | Student-facing label, class, attention, recoverable helpers |
| Generic badge primitive | `src/components/ui/index.tsx` — `StatusBadge` | Accepts `label` + `color` string; does not map status→color internally |

### Components Using Shared Helpers (Compliant)

- `src/components/provider/ShortlistStatusBadge.tsx` — uses `getStatusLabel()`, `getStatusTone()`; has minor inline tone→CSS override
- `src/components/student/DataFreshnessIndicator.tsx` — uses `getStatusConfig()`; has inline `STYLE_MAP` and `ICON_MAP`
- `src/components/provider/ProviderDataFreshnessIndicator.tsx` — uses `getStatusConfig()`; has duplicate inline `styles` object

### Components with Inline Status Logic (DRY Violations)

| Component | Inline functions | What is duplicated |
|-----------|-----------------|-------------------|
| `src/components/staff/DocumentVerificationPanel.tsx` | `getStatusIcon()`, `getStatusLabel()`, `getStatusColor()` | Status→icon switch, bilingual label map, status→CSS class map |
| `src/components/admin/AccessRequestCard.tsx` | `getStatusIcon()`, `getStatusLabel()`, `getStatusColor()` | Same three inline functions as DocumentVerificationPanel |
| `src/components/staff/DisclosureRequestCard.tsx` | `getStatusIcon()`, `getStatusLabel()`, `getStatusColor()` | Same three inline functions; hardcoded hex colors |
| `src/components/admin/SensitiveAccessCard.tsx` | `getEventIcon()`, `getEventLabel()`, `getRiskColor()` | Event type→icon/label, risk level→CSS (custom domain, not using STATUS_GROUPS) |
| `src/components/admin/PermissionStatusBadge.tsx` | Inline `config` object | Status-specific icon, bg, text, bilingual label — not using statusHelpers |
| `src/components/staff/MatchReviewCard.tsx` | `getConfidenceBandColor()`, `getConfidenceBandLabel()` | Confidence band→CSS, confidence band→bilingual label (custom domain) |
| `src/components/provider/ProviderScholarshipCard.tsx` | `scholarshipStatusLabel()`, `scholarshipStatusColor()`, `candidatePoolStatusLabel()`, `candidatePoolStatusColor()` | Wraps shared helpers but adds inline color logic |
| `src/components/student/EligibilityChecklist.tsx` | `STATUS_STYLE`, `STATUS_ICON`, `statusLabel` inline objects | Custom eligibility status display (not in STATUS_GROUPS) |

### Tone-to-CSS Color Repetition

The tone→Tailwind class conversion is written inline in at least 3 components:

| Component | Pattern |
|-----------|---------|
| `ShortlistStatusBadge.tsx` | Inline `styleForTone()` function |
| `ProviderDataFreshnessIndicator.tsx` | Inline `styles` object |
| `ProviderScholarshipCard.tsx` | Inline `scholarshipStatusColor()` + `candidatePoolStatusColor()` |

A shared `badgeToneToClass(tone)` function exists via the status migration work. These components
should use it once they are migrated.

### Data Freshness Style Duplication

`DataFreshnessIndicator.tsx` and `ProviderDataFreshnessIndicator.tsx` both define:
- An inline `STYLE_MAP` / `styles` object mapping fresh/stale/failed to CSS classes
- An inline `ICON_MAP` / icon selection
- A fallback label map

These should share a single style/icon map, but this is low risk because both already use
`getStatusConfig()` for the underlying data.

---

## B. Token / Masking Repetition

### Already Centralized (Good)

| Resource | Location | What it provides |
|----------|----------|-----------------|
| Token format functions | `src/config/tokenFormats.ts` | `formatCandidateToken()`, `formatStudentToken()`, `formatAuditEventToken()`, `normalizeTokenSuffix()` |
| Privacy field lists | `src/config/privacy.ts` | `STUDENT_IDENTITY_FIELDS`, `CANDIDATE_IDENTITY_FIELDS`, role-safe field lists, `PRIVACY_BOUNDARY_NOTES` |

### Token Display Styling — Repeated Pattern

Six or more components display tokens using `font-mono` with optional dashed border:

| Component | Token displayed | Pattern |
|-----------|----------------|---------|
| `src/components/provider/CandidatePoolTable.tsx` | `candidate.candidateToken` | `font-mono` class |
| `src/components/provider/AnonymousCandidateCard.tsx` | `candidate.candidateToken` | `font-mono` wrapper |
| `src/components/staff/DisclosureRequestCard.tsx` | `request.candidateToken` | `font-mono` + dashed border |
| `src/components/staff/MatchReviewCard.tsx` | `review.studentToken` | `font-mono` + dashed border |
| `src/components/staff/DisclosureApprovalModal.tsx` | `candidateToken` param | `font-mono` |
| `src/components/staff/DisclosureRejectionModal.tsx` | `candidateToken` param | `font-mono` |

All components receive pre-formatted token strings (from mock data) rather than calling
`formatCandidateToken()` / `formatStudentToken()` at render time. The display styling is
consistently applied but not centralized into a `<TokenDisplay>` component.

### Token Prefix Strings in Documentation

`privacy.ts` and `roles.ts` reference `"Candidate #C-"` and `"Student #S-"` as string literals
in documentation/comments rather than importing the constants from `tokenFormats.ts`. This is
a documentation-only issue and does not affect runtime behavior.

---

## C. Privacy / Governance Repetition

### Already Centralized (Good)

| Resource | Location | What it provides |
|----------|----------|-----------------|
| Privacy categories | `src/config/privacy.ts` | `PRIVACY_CATEGORIES`, field lists by domain, role-safe field lists |
| Sensitive actions config | `src/config/sensitiveActions.ts` | Action keys, risk levels, reason requirements |
| Generic PrivacyNotice primitive | `src/components/ui/index.tsx` | `PrivacyNotice` with variants (default/warning/strict) |

### Audit Warning Card Duplication

Two separate audit warning card components exist with different prop structures but the same
visual design and hardcoded colors:

| Component | Props | Used by |
|-----------|-------|---------|
| `src/components/staff/AuditWarningCard.tsx` | `title`, `message`, `requiresReason` | `DisclosureRejectionModal`, `DisclosureApprovalModal`, `MatchOverrideModal` |
| `src/components/admin/AdminAuditWarningCard.tsx` | `action_th`, `action_en`, `consequence_th`, `consequence_en` | Admin action flows |

Both use hardcoded amber: `bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]`.
Neither uses design system tokens for these colors.

### Privacy Notice Duplication

Two role-specific privacy notice components exist with different implementations:

| Component | Pattern |
|-----------|---------|
| `src/components/provider/ProviderPrivacyNotice.tsx` | Wraps `PrivacyNotice` UI primitive; has inline bilingual `copy` object with 4 modes |
| `src/components/student/StudentPrivacyNotice.tsx` | Does NOT use `PrivacyNotice` wrapper; has hardcoded HTML and inline bilingual strings; uses hardcoded hex colors `border-[#0055FF]/15 bg-[#E5EDFF]/70` |

`StudentPrivacyNotice` should eventually adopt the same wrapper pattern as `ProviderPrivacyNotice`.

### Disclosure Workflow Repetition

Three components share structural and color patterns:

| Component | Repeated logic |
|-----------|---------------|
| `src/components/staff/DisclosureRequestCard.tsx` | Inline `getStatusIcon()`, `getStatusLabel()`, `getStatusColor()`; hardcoded amber/emerald hex colors; bilingual label strings for request metadata |
| `src/components/staff/DisclosureApprovalModal.tsx` | Hardcoded emerald styling; bilingual strings for approval metadata |
| `src/components/staff/DisclosureRejectionModal.tsx` | Uses `AuditWarningCard`; bilingual strings for rejection metadata; reason textarea |

### Hardcoded Color Values — High Repetition

| Color | Usage count | Where | Should be |
|-------|-------------|-------|-----------|
| Amber `#FFFBEB` / `#FDE68A` / `#78350F` | 10+ | `AuditWarningCard`, `AdminAuditWarningCard`, `DisclosureRequestCard`, various badges | Design system amber token or Tailwind config extension |
| Emerald `emerald-50` / `emerald-200` / `emerald-700` | 8+ | `DisclosureApprovalModal`, `DataFreshnessIndicator`, `AnonymousCandidateCard`, others | Design system success token (already exists as `status-success`) |
| Role blue `#E5EDFF` / `#0055FF` | 5+ | `StudentPrivacyNotice`, `documentStatusDisplay.ts` (student), others | Design system role token (`role-tint` already exists) |

---

## D. Form and Validation Repetition

### Reason Field Validation — Inconsistent Minimum Lengths

Reason/text fields with minimum length validation exist in at least five components:

| Component | Minimum length | Enforcement style |
|-----------|---------------|-------------------|
| `src/components/provider/ShortlistRequestModal.tsx` | 10 characters | Inline conditional |
| `src/components/provider/ShortlistReasonField.tsx` | 10 characters | Shared component (partially) |
| `src/components/staff/DisclosureRejectionModal.tsx` | `trim()` only — no minimum | Button disabled if empty |
| `src/components/staff/MatchOverrideModal.tsx` | 20 characters | Inline conditional |
| `src/components/admin/RoleAssignmentPanel.tsx` | 20 characters | Inline + character counter |
| `src/components/staff/DocumentVerificationPanel.tsx` | None currently | Button disabled if empty |

Policy per `SENSITIVE_ACTION_POLICY_PHASE_2E.md` is 20 characters for medium-risk actions.
Three components (ShortlistRequestModal, ShortlistReasonField, DisclosureRejectionModal) use
lower or no minimum. This is a governance gap.

### Modal Shell Repetition

Five modal components share an identical structural pattern:

- Backdrop: `fixed inset-0 bg-slate-950/35 backdrop-blur-sm flex items-center justify-center z-50`
- Close button: `<button onClick={onClose} className="p-1 hover:bg-surface-low rounded">`
- Header: `flex items-center justify-between p-4 border-b border-line`
- Body: `p-4 space-y-4`
- Info box: `bg-surface-low rounded-lg p-3`

Files:
- `src/components/student/SubmitConfirmationModal.tsx`
- `src/components/provider/ShortlistRequestModal.tsx`
- `src/components/staff/DisclosureApprovalModal.tsx`
- `src/components/staff/DisclosureRejectionModal.tsx`
- `src/components/staff/MatchOverrideModal.tsx`

No shared `<Modal>` wrapper exists yet. Each modal reimplements the full shell.

### Document Upload State Guidance

Document upload guidance text and state-to-button logic is distributed across:
- `src/components/student/DocumentUploadCard.tsx` — uses shared config helpers
- `src/components/student/RequiredDocumentsList.tsx` — uses shared config helpers
- `src/components/staff/DocumentVerificationPanel.tsx` — inline logic, not using config

The student side is now largely config-driven. The staff side is not yet.

---

## E. Layout / Card / Table Repetition

### Card Shell — Already Centralized

The `.card` Tailwind utility class is defined centrally (via Tailwind config). All 31+
card/modal components use `card p-4` or `card p-5`. The class is shared; only the padding
variant is inlined.

Low risk. No action needed now.

### KPI / Stat Cards — Partially Centralized

`StatCard` component exists in `src/components/ui/index.tsx` with `roleAccent` and `delta` props.
Used in all 5 dashboard pages. The component is shared; the data calculation per dashboard is
inline in each page (`.filter()`, `.length`, metric computation).

This is acceptable for mock data phase. The dashboard metric logic is role-specific enough that
inline calculation is reasonable.

### Empty / Loading / Error States — Centralized

`EmptyState` component is centralized in `src/components/ui/index.tsx`. Already widely used.
No action needed.

### Filter / Search Panels

Only `src/components/admin/AuditFilterPanel.tsx` exists as a named filter panel.
All other search/filter logic is inlined in page components. Limited repetition currently.

---

## F. Role / Theme Repetition

### Role Config — Centralized but Not Fully Consumed

`src/config/roles.ts` defines `ROLE_CONFIG` with labels, route prefixes, home routes, and
data visibility notes for all 5 roles. Helper `getRoleConfig(role)` is exported.

Despite this, role labels are redefined inline in:

| File | Duplicated |
|------|-----------|
| `src/components/admin/RoleBadge.tsx` | Hardcoded label object (5 roles × EN/TH) + hardcoded Tailwind color map |
| `src/app/admin/users/page.tsx` | Inline hardcoded role list |
| `src/app/login/page.tsx` | Inline role label display |
| `src/components/layout/Topbar.tsx` | Inline role display |
| `src/components/layout/Sidebar.tsx` | Inline route and role handling |

`RoleBadge.tsx` is the most significant issue: it hardcodes Tailwind color classes
(`bg-blue-100 text-blue-700`, etc.) rather than using the CSS variable system (`var(--role-surface)`,
`var(--role-primary-hex)`) that the rest of the application uses. A role color change would
update everywhere except `RoleBadge`.

### Dashboard Separation — Intentional

Five separate dashboard pages exist (`student`, `staff`, `provider`, `esq`, `admin`). Each has
role-specific data, components, and metric calculations. This is correct domain separation and is
not a DRY violation.

---

## G. Mock Data Access Repetition

### No Data Access Layer Exists

Every page and component that needs data directly imports mock files and writes its own query logic:

**`.find()` queries scattered across pages:**

| File | Query |
|------|-------|
| `src/app/scholarships/[id]/page.tsx` | `mockScholarships.find(x => x.id === id)` |
| `src/app/staff/students/[id]/page.tsx` | `mockUsers.find(u => u.id === id && u.role === 'student')` |
| `src/app/staff/applications/[id]/page.tsx` | `mockApplications.find(a => a.id === id)` |
| `src/app/esq/announcements/[id]/review/page.tsx` | `mockAnnouncements.find(a => a.id === id)` |
| `src/app/staff/matching-review/[matchId]/page.tsx` | `mockMatchReviews.find(r => r.id === matchId)` |

**`.filter()` / aggregate queries repeated across dashboards:**

| File | Query |
|------|-------|
| `src/app/staff/dashboard/page.tsx` | `mockMatchReviews.filter(m => m.fairnessFlag).length` |
| `src/app/esq/dashboard/page.tsx` | `mockAnnouncements.filter(a => a.status === 'SUBMITTED')` |
| `src/app/student/dashboard/page.tsx` | `mockApplications.filter(a => !['COMPLETED', 'NOT_AWARDED'].includes(a.status))` |

**Mock data directory:**

```
src/data/mock/
├── adminData.ts        (25 KB — users, roles, audit logs)
├── announcements.ts    (3 KB)
├── applications.ts     (5 KB)
├── audit-logs.ts       (1.7 KB)
├── notifications.ts    (3 KB)
├── providerData.ts     (25 KB — scholarships, impact)
├── scholarships.ts     (4.6 KB)
├── staffData.ts        (15 KB — match reviews, disclosures, data quality)
├── studentApplicationData.ts (20 KB)
├── studentMatchingData.ts    (22 KB)
└── users.ts            (1.5 KB)
```

Total: 11 files, ~100 KB of mock data, no unified access layer.

### Not-Found Handling — Inconsistent

Each dynamic route page implements its own fallback for missing data:
- Some return early with an inline error div
- Some return null
- No shared `NotFoundBoundary` or standardized error page for this case

Low risk while mock data is static and complete, but will become fragile with real data.

---

## Summary Table

| Area | Violation | Files affected | Risk | Status |
|------|-----------|---------------|------|--------|
| Status: inline `getStatusColor()` | 5+ components duplicate tone→CSS | DocumentVerificationPanel, AccessRequestCard, DisclosureRequestCard, ShortlistStatusBadge (partial), ProviderScholarshipCard | Medium | Inline |
| Status: inline `getStatusLabel()` / `getStatusIcon()` | 6+ components duplicate status→label/icon | DocumentVerificationPanel, AccessRequestCard, DisclosureRequestCard, SensitiveAccessCard, MatchReviewCard, PermissionStatusBadge | Medium | Inline |
| Status: data freshness style map | 2 components duplicate style/icon maps | DataFreshnessIndicator, ProviderDataFreshnessIndicator | Low | Inline |
| Token: display styling | 6 components repeat `font-mono` + dashed border | CandidatePoolTable, AnonymousCandidateCard, DisclosureRequestCard, MatchReviewCard, DisclosureApprovalModal, DisclosureRejectionModal | Low | Inline |
| Privacy: audit warning card variants | 2 components duplicate amber card | AuditWarningCard, AdminAuditWarningCard | Low | Separate files |
| Privacy: privacy notice implementation | 2 components use different patterns | ProviderPrivacyNotice, StudentPrivacyNotice | Low | Separate files |
| Privacy: hardcoded amber hex | 10+ usages of `#FFFBEB` / `#FDE68A` / `#78350F` | Multiple components | Low | Inline |
| Form: reason min length inconsistency | 3 different minimum lengths | ShortlistRequestModal, DisclosureRejectionModal, MatchOverrideModal, RoleAssignmentPanel, DocumentVerificationPanel | Medium | Governance gap |
| Form: modal shell duplication | 5 modals share identical backdrop/header/body | All five modal components | Medium | Inline |
| Roles: labels duplicated despite config | 5 files hardcode labels instead of reading ROLE_CONFIG | RoleBadge, login page, admin users, Topbar, Sidebar | Medium | Inline |
| Roles: RoleBadge colors not using CSS vars | `RoleBadge` uses Tailwind classes instead of `var(--role-*)` | RoleBadge.tsx only | Low | Inline |
| Mock data: no access layer | 20+ pages write their own `.find()` / `.filter()` | All dynamic route pages | Medium | Inline |
| Mock data: not-found handling | No shared 404/empty boundary | 2+ pages | Low | Inline |
