# S²IMS Status Config Migration Plan — Phase 2F

**Phase:** 2F — Status Config Migration Plan (Documentation only)
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-08
**Status:** Plan only. No runtime wiring in this phase.

---

## Purpose

This document defines the recommended migration order for adopting `src/config/statuses.ts`
across the codebase. It does not change any code. It exists so that a future phase can wire
the config safely, one domain at a time, without breaking governance flows or user-visible labels.

Read the inventory first: `STATUS_USAGE_INVENTORY_PHASE_2F.md`

---

## What Migration Means

"Migrating" a status domain means:

1. Components stop defining their own label/color/icon lookup locally.
2. Components call `getStatusConfig(domain, key)` (proposed helper — see below) instead.
3. The helper reads from `src/config/statuses.ts`.
4. Tailwind classes are generated from `BadgeTone` values via a tone→class mapping.
5. `APP_STATUS_MAP`, `SCH_STATUS_MAP`, and `ANN_STATUS_MAP` in `utils.ts` are replaced or deprecated.
6. Inline `getStatusLabel/getStatusColor/getStatusIcon` in individual components are removed.

Migration does NOT mean:
- Changing status key values in mock data (unless correcting a known mismatch like `current` → `fresh`).
- Changing routes or auth logic.
- Changing governance modal behavior.
- Removing TH/EN label support.

---

## Proposed Helper Functions (No Implementation Yet)

The following helpers are proposed for a future runtime phase. They are described here so the
plan is complete, not to authorize their implementation now.

```ts
// Returns the full StatusConfig for a given domain + key.
// Throws at development time if domain or key is unknown.
function getStatusConfig(
  domain: keyof typeof STATUS_GROUPS,
  key: string
): StatusConfig

// Returns the localized label for a given domain + key.
function getStatusLabel(
  domain: keyof typeof STATUS_GROUPS,
  key: string,
  lang: 'en' | 'th'
): string

// Returns the BadgeTone for a given domain + key.
function getStatusTone(
  domain: keyof typeof STATUS_GROUPS,
  key: string
): BadgeTone

// Returns true if the status is a terminal state (no further transitions expected).
function isTerminalStatus(
  domain: keyof typeof STATUS_GROUPS,
  key: string
): boolean

// Returns true if the status requires a user or staff action.
function requiresAction(
  domain: keyof typeof STATUS_GROUPS,
  key: string
): boolean
```

**Tone-to-class mapping** — a second helper converts `BadgeTone` to Tailwind classes:

```ts
// Produces the three-class string expected by <StatusBadge color={...} />
// Example: 'amber' → 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]'
function badgeToneToClass(tone: BadgeTone): string
```

This function is the single place where tone names map to color tokens. It replaces all
inline hardcoded `bg-[#FFFBEB] text-[#78350F]` strings in the codebase.

---

## Pre-Migration Prerequisites (Must Complete Before Any Phase 2G Work)

These issues must be resolved in config or mock data BEFORE wiring components.

### P1 — Fix `statuses.ts` casing inconsistency

`APPLICATION_STATUSES` and `SCHOLARSHIP_STATUSES` use UPPERCASE keys while all other groups
use lowercase. Before migration, decide one convention and apply it in the config only (no
component changes yet):

- Recommended: normalize all keys to `lower_snake_case` to match how status keys appear in
  filter logic and studentApplicationData.ts.
- Requires updating all `as const` arrays and `STATUS_GROUPS` map.
- Low risk if done in isolation before any component wiring.

### P2 — Resolve the `APPLICATION_STATUSES` / `studentApplicationData.ts` key gap

`studentApplicationData.ts` uses 8 lowercase keys (`draft`, `in_review`, etc.) that do not
match `APPLICATION_STATUSES` UPPERCASE keys. Two options:

- Option A: Add lowercase aliases to config (preferred — avoids changing mock data).
- Option B: Normalize studentApplicationData.ts to UPPERCASE keys (higher risk — touches mock data).

Recommend Option A. Document decision before Phase 2G.

### P3 — Add missing keys to config

Add to `APPLICATION_STATUSES`:
- `ready_to_submit` (student pre-submit state)
- `withdrawn` (student-initiated terminal state)

Add to `SHORTLIST_REQUEST_STATUSES`:
- Confirm whether `draft` should also appear in `providerData.ts` ShortlistStatus type.

Add a new group `ANNOUNCEMENT_STATUSES` (7 keys from `ANN_STATUS_MAP`):
- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, PUBLISHED, REVISION_REQUESTED, REJECTED

Do NOT add OCR job states, admin account states, or eligibility states — these are not
persistence statuses appropriate for the shared config.

### P4 — Fix critical-level gap before wiring admin risk

Add `critical` handling to `UserRiskBadge` and `ElevatedAccessWarning` before migrating the
`auditRisk` domain. The missing `critical` case is a governance gap — it is the most severe
level and is currently unrendered.

### P5 — Align the `failed` / `current` freshness gap in staffData.ts

Before migrating the `dataFreshness` domain, update `staffData.ts` type definition:
- Change `'current' | 'stale'` → `'fresh' | 'stale' | 'failed'`
- Update mock data objects using `dataFreshness: 'current'` → `dataFreshness: 'fresh'`
- This is mock data normalization, not a behavior change. Low risk.

---

## Recommended Migration Order

### Stage 0 — Prerequisites (before any runtime wiring)

1. Normalize config key casing (P1 above).
2. Add missing config keys — `ready_to_submit`, `withdrawn`, ANNOUNCEMENT_STATUSES group (P3).
3. Fix `staffData.ts` freshness key (`current` → `fresh`) (P5).
4. Add `critical` to admin risk components (P4).
5. Implement `badgeToneToClass()` helper with the full tone→class map.
6. Implement `getStatusConfig()`, `getStatusLabel()`, `getStatusTone()` as pure read-only functions.
7. Write tests for all helpers (at minimum: known key returns correct label + tone; unknown key throws).

**Gating condition:** All Stage 0 steps must be complete and tests passing before Stage 1.

---

### Stage 1 — Safest first: Data Freshness (recommended for Phase 2G)

**Domain:** `dataFreshness`
**Keys:** `fresh`, `stale`, `failed`
**Config alignment:** High — config, providerData.ts, and studentMatchingData.ts already agree.
**One mismatch to fix first:** staffData.ts `current` → `fresh` (Stage 0 prerequisite).

Files to update in Stage 1:
- `src/components/provider/ProviderDataFreshnessIndicator.tsx` — replace inline icon/color logic with `getStatusConfig('dataFreshness', status)`
- `src/components/student/DataFreshnessIndicator.tsx` — same if it has inline logic

Visual QA for Stage 1:
- Fresh: green pulse dot, "Synced X ago" text — unchanged
- Stale: amber dot, warning text — unchanged
- Failed: amber dot (or red in some views) — verify no visible change

**Do not touch** in Stage 1: application, document, disclosure, shortlist, risk domains.

---

### Stage 2 — Shortlist Request (low governance risk, small scope)

**Domain:** `shortlistRequest`
**Keys:** `none`, `draft`, `pending_staff_approval`, `approved`, `declined`
**Why second:** Only one display component (`ShortlistStatusBadge`); no reason-required modal involved.

Pre-checks before Stage 2:
- Resolve `declined` label ("Declined" → "Not approved" per config). Confirm with product whether label change is acceptable.
- Resolve `draft` key gap between config and `providerData.ts` type.

Files to update in Stage 2:
- `src/components/provider/ShortlistStatusBadge.tsx` — replace inline `statusConfig` with `getStatusConfig`

Visual QA for Stage 2:
- Verify "Not requested", "Pending Staff Approval", "Approved", "Declined/Not approved" all render correctly in TH + EN.
- Confirm `draft` state is handled (even if mock data does not currently produce it).

---

### Stage 3 — Scholarship Statuses (medium scope)

**Domain:** `scholarship`
**Why third:** Only two display maps; `ProviderScholarshipCard` uses role-tint for ACTIVE which
may stay as a per-role override, not a config violation.

Files to update in Stage 3:
- `src/lib/utils.ts` `SCH_STATUS_MAP` — replace with `getStatusConfig` calls or deprecate
- `src/components/provider/ProviderScholarshipCard.tsx` `scholarshipStatusLabel/scholarshipStatusColor` — replace inline logic

Pre-checks before Stage 3:
- Decide if ACTIVE → `bg-role-tint text-role-primary` is intentional provider-context override or a mismatch. If intentional, document it as an override slot in config.
- Add PENDING_REVIEW handling to SCH_STATUS_MAP (currently missing).

Visual QA for Stage 3:
- All scholarship status badges in /provider/scholarships, /scholarships (public), /staff — verify no label or color regression.

---

### Stage 4 — Application Statuses (high scope, split by system)

**Domain:** `application`
**Why fourth and split:** Two separate status systems exist with different key conventions.
Migrate them independently — utils.ts APP_STATUS_MAP first, then studentApplicationData.ts.

**Stage 4A — Migrate `utils.ts` APP_STATUS_MAP**

Prerequisite: Confirm and resolve label mismatches:
- `NEEDS_DOCS`: change from red/danger to amber? — confirm with product.
- `REPORT_OVERDUE`: change from red/danger to amber? — confirm with product.
- `FINANCE_PENDING`: label change from "Finance Docs Needed" → "Finance pending"? — confirm.
- `SHORTLISTED`: change from aurora/blue to success/emerald? — confirm.

Files to update in 4A:
- `src/lib/utils.ts` `APP_STATUS_MAP` — replace with config lookups or deprecate

Visual QA for 4A:
- Render every application status badge in /staff/applications, /student/applications, /esq — confirm no regression.

**Stage 4B — Migrate `studentApplicationData.ts` application states**

Prerequisite: Resolve the `in_review` vs `UNDER_REVIEW` key gap. Add `ready_to_submit` and `withdrawn` to config.

Files to update in 4B:
- `src/data/mock/studentApplicationData.ts` — `applicationStateLabels` / `applicationStateStyles` → helpers
- All student-facing components consuming these maps

Visual QA for 4B:
- Render student application list and detail pages in TH + EN — verify all 8 states.

---

### Stage 5 — Document Statuses (high complexity)

**Domain:** `document`
**Why fifth:** Three parallel systems; significant label and tone mismatches; `rejected` semantics
differ between staff panel and student view (intentional privacy distinction).

Pre-checks before Stage 5:
- Align `rejected` label decision: "Rejected" (staff sees) vs "Needs replacement" (student sees). This may need to remain a role-aware override, NOT a single config label.
- Align `missing` tone: danger (current panel) vs neutral (config). Decide correct severity.
- Align `invalid_file_type` tone: danger (current) vs amber (config).
- Add `verification_pending` handling to `DocumentVerificationPanel` and `staffData.ts` type.

Files to update in Stage 5:
- `src/components/staff/DocumentVerificationPanel.tsx` — replace inline functions
- `src/data/mock/studentApplicationData.ts` — `documentStateLabels` — replace or align
- `src/data/mock/staffData.ts` — update `DocumentVerificationState` type to include `verification_pending`

Visual QA for Stage 5:
- Staff document panel: all 7 states render with correct icon, label, and color.
- Student document upload: all 8 states render in TH + EN.
- Confirm `rejected` shows "Rejected" to staff and "Needs replacement" (or equivalent) to student.

**Caution:** This stage touches identity disclosure flows indirectly. QA must confirm that
`DocumentVerificationPanel` used inside `DisclosureApprovalModal` continues to function.

---

### Stage 6 — Announcement Statuses (requires new config group)

**Domain:** `announcement` (new)
**Why sixth:** Requires adding a new group to `statuses.ts` first.

Steps:
- Add `ANNOUNCEMENT_STATUSES` to `statuses.ts` (7 keys).
- Confirm tone alignment, especially `REJECTED` (utils.ts uses red/danger; config should clarify intent).
- Replace `ANN_STATUS_MAP` usage in announcement-related pages.

Visual QA for Stage 6:
- All announcement status badges in /staff/announcements, /esq — verify no regression.

---

### Stage 7 — Audit/Risk Statuses (governance-sensitive)

**Domain:** `auditRisk`
**Why last in plan:** Requires resolving the `critical` gap and the `high` tone disagreement
before touching admin-facing governance displays.

Pre-checks before Stage 7:
- Add `critical` to `UserRiskBadge`, `ElevatedAccessWarning`, `SensitiveAccessCard` (Stage 0 prerequisite).
- Decide: should `high` be amber or red? Config says amber. Admin components use red. This is a governance decision about how "serious but not emergency" risk is communicated — must be decided before migration.
- Decide: is StaffDataQualityIssueCard `critical/warning/info` a separate vocabulary? It likely should remain distinct and not be merged with `auditRisk`.

Files to update in Stage 7:
- `src/components/admin/UserRiskBadge.tsx`
- `src/components/admin/ElevatedAccessWarning.tsx`
- `src/components/admin/SensitiveAccessCard.tsx`

Visual QA for Stage 7:
- Admin audit log: all 4 risk levels render correctly.
- ElevatedAccessWarning renders for `medium`, `high`, and now `critical`.
- No regression in admin permission/audit pages.

---

### Do Not Migrate (in any stage)

| Item | Reason |
|---|---|
| `REVIEW_STATUSES` from config | No component currently consumes this group; no migration path yet |
| OCR job statuses (idle/uploading/extracting/needs_review/confirmed) | Transient UI state; not persistence data; does not belong in status config |
| Admin user account statuses (active/inactive/suspended) | Admin-specific; would need a new config group; not shared |
| Admin access request statuses (pending/approved/denied) | Admin-specific; would need a new config group |
| Security incident statuses (open/investigating/escalated/closed) | Admin-specific; highly domain-specific lifecycle |
| Eligibility/matching statuses (met/unmet/unknown) | Matching-pipeline-specific; requires a dedicated matching domain design |
| Candidate rank bands (top_band/strong_band/etc.) | Privacy-sensitive data classification; requires separate design |
| Disclosure request modal behavior | Phase 2E established this is governance-sensitive and should not be refactored yet |
| Export/report generation statuses | No config group; admin-only; out of scope for this migration |

---

## Risk Summary by Domain

| Domain | Migration risk | Primary risk factor |
|---|---|---|
| Data freshness | **Low** | Only 3 keys; one naming fix needed in mock data; no governance implication |
| Shortlist request | **Low** | One badge component; label decision needed for `declined` |
| Scholarship | **Medium** | Two maps; role-tint override question; label casing changes |
| Application (utils.ts path) | **Medium** | Tone decisions needed for NEEDS_DOCS, SHORTLISTED, REPORT_OVERDUE |
| Application (student path) | **Medium** | Key convention gap (`in_review` vs `UNDER_REVIEW`) requires alignment decision |
| Document | **High** | Three systems; label semantics differ by role; privacy-sensitive path |
| Announcement | **Medium** | New config group needed; tone decision on REJECTED |
| Audit/risk | **High** | Missing `critical` level; tone decision on `high`; governance display |
| Disclosure | **High** | Governance-sensitive; label "Rejected" vs "Not approved" is intentional |

---

## Required Visual QA Per Domain (Summary)

| Domain | QA scope | Routes |
|---|---|---|
| Data freshness | Fresh/stale/failed indicator — all roles | /provider/dashboard, /student/dashboard, /staff/matching-review |
| Shortlist request | 4 badge states in TH + EN | /provider/candidates, /provider/scholarships/[id]/candidates |
| Scholarship | 9 badge states in TH + EN | /provider/scholarships, /scholarships, /staff/applications |
| Application (utils) | 14 badge states in TH + EN | /staff/applications, /student/applications, /esq/dashboard |
| Application (student) | 8 badge states in TH + EN | /student/applications/[id] |
| Document | 9 states, icon + label + color | /staff/applications/[id], /student/applications/[id]/documents |
| Announcement | 7 badge states in TH + EN | /staff/announcements, /esq/history |
| Audit/risk | 4 risk levels including critical | /admin/audit-log, /admin/users |

---

## What Should Stay Untouched Until After All Stages

- `src/lib/auth.ts` — auth logic
- Route files and their URLs
- `src/lib/navigation.ts` — nav structure
- `DisclosureApprovalModal`, `DisclosureRejectionModal` — Phase 2E established not ready
- `MatchOverrideModal`, `AuditWarningCard` — reason-required logic pending modal redesign
- Any mock data field that is not a status key (financial data, student records, provider info)
- Governance modal reason validation behavior
