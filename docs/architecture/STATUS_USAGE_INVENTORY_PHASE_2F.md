# S²IMS Status Usage Inventory — Phase 2F

**Phase:** 2F — Status Config Migration Plan (Documentation only)
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-08
**Status:** Inventory complete. No runtime code changed.

---

## Purpose

This document inventories every status key, label, and tone used across the codebase and
compares each against `src/config/statuses.ts`. It identifies duplicates, label mismatches,
tone mismatches, and missing keys so that a future migration can be planned safely.

---

## Summary Counts

| Status Domain | Keys in config/statuses.ts | Active parallel maps | Mismatches found | Missing from config |
|---|---|---|---|---|
| Application | 14 | 2 (utils.ts, studentApplicationData.ts) | 6 | 2 (ready_to_submit, withdrawn) |
| Document | 9 | 3 (staffData.ts type, DocumentVerificationPanel, studentApplicationData.ts) | 5 | 1 (verification_pending missing from staffData.ts) |
| Scholarship | 9 | 2 (utils.ts SCH_STATUS_MAP, ProviderScholarshipCard) | 3 | 2 (PENDING_REVIEW/ACTIVE missing from utils.ts) |
| Shortlist Request | 5 | 1 (ShortlistStatusBadge) | 3 | 1 (draft missing from providerData.ts) |
| Disclosure Request | 3 | 1 (DisclosureRequestCard) | 2 | 0 |
| Review | 7 | 0 (config only, ANN_STATUS_MAP is adjacent) | 0 | — |
| Audit/Risk | 4 | 3 (UserRiskBadge, ElevatedAccessWarning, SensitiveAccessCard) | 3 | critical missing from 2 components |
| Data Freshness | 3 | 2 (ProviderDataFreshnessIndicator, staffData.ts) | 1 | 0 |
| Announcement | 0 | 1 (utils.ts ANN_STATUS_MAP only) | — | 7 (entire domain missing) |
| OCR Job | 0 | 1 (ocr/page.tsx inline) | — | 5 (entire domain missing) |
| Admin User/Access/Incident | 0 | 1 (adminData.ts inline) | — | 10+ (entire domain missing) |
| Eligibility/Matching | 0 | 2 (providerData.ts, studentMatchingData.ts) | — | 3 (entire domain missing) |

---

## Key Casing Inconsistency

`config/statuses.ts` uses **mixed case conventions** across groups:

| Group | Key case | Example |
|---|---|---|
| APPLICATION_STATUSES | UPPER_CASE | `DRAFT`, `UNDER_REVIEW` |
| DOCUMENT_STATUSES | lower_snake | `missing`, `invalid_file_type` |
| SCHOLARSHIP_STATUSES | UPPER_CASE | `DRAFT`, `PENDING_REVIEW` |
| SHORTLIST_REQUEST_STATUSES | lower_snake | `none`, `pending_staff_approval` |
| REVIEW_STATUSES | lower_snake | `pending`, `in_review` |
| DISCLOSURE_REQUEST_STATUSES | lower_snake | `pending_staff_approval` |
| AUDIT_RISK_STATUSES | lower_case | `low`, `high`, `critical` |
| DATA_FRESHNESS_STATUSES | lower_case | `fresh`, `stale`, `failed` |

The runtime code in `studentApplicationData.ts` also uses `lower_snake` for application states
(`draft`, `in_review`) — **opposite convention** to `APPLICATION_STATUSES` in config (`DRAFT`, `UNDER_REVIEW`).
These represent the same lifecycle but with different keys and different status sets.

---

## Domain 1 — Application Statuses

### Parallel Status Maps

**Map A — `src/lib/utils.ts` `APP_STATUS_MAP`** (14 keys, UPPERCASE)
**Map B — `src/data/mock/studentApplicationData.ts` `applicationStateLabels` / `applicationStateStyles`** (8 keys, lowercase)
**Config — `src/config/statuses.ts` `APPLICATION_STATUSES`** (14 keys, UPPERCASE)

### Inventory Table

| Status key | Current file | Current EN label | Current color/class | Config key | Config tone | Mismatch | Duplicated elsewhere | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `DRAFT` | utils.ts APP_STATUS_MAP | Draft | `bg-surface-low text-ink-2 border-line` | `DRAFT` | neutral | None | studentApplicationData.ts `draft` (different key!) | Low | Key casing differs between systems |
| `SUBMITTED` | utils.ts APP_STATUS_MAP | Submitted | `bg-blue-50 text-blue-700 border-blue-200` | `SUBMITTED` | aurora | Tone: blue = aurora ✓ | studentApplicationData.ts `submitted` | Low | Labels match config |
| `UNDER_REVIEW` | utils.ts APP_STATUS_MAP | Under Review | `bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]` | `UNDER_REVIEW` | amber | Label casing: "Under Review" vs "Under review" | studentApplicationData.ts `in_review` (different key!) | Medium | Key name differs between systems |
| `NEEDS_DOCS` | utils.ts APP_STATUS_MAP | Needs Documents | `bg-red-50 text-red-700 border-red-200` | `NEEDS_DOCS` | amber | **Tone mismatch: danger color used, config says amber** | None | High | Danger red used for non-destructive action |
| `SHORTLISTED` | utils.ts APP_STATUS_MAP | Shortlisted | `bg-blue-50 text-blue-700 border-blue-200` | `SHORTLISTED` | success | **Tone mismatch: aurora/blue used, config says success/emerald** | None | Medium | Should be emerald per config intent |
| `INTERVIEW_SCHEDULED` | utils.ts APP_STATUS_MAP | Interview Scheduled | `bg-violet-50 text-violet-700 border-violet-200` | `INTERVIEW_SCHEDULED` | aurora | Tone mismatch: violet used, config says aurora/blue | None | Low | Violet arguably fits milestone context |
| `AWARDED` | utils.ts APP_STATUS_MAP | Awarded | `bg-emerald-50 text-emerald-700 border-emerald-200` | `AWARDED` | success | None | None | Low | Aligned |
| `NOT_AWARDED` | utils.ts APP_STATUS_MAP | Not Awarded | `bg-surface-low text-ink-2 border-line` | `NOT_AWARDED` | neutral | Label: "Not Awarded" vs "Not awarded" | None | Low | Minor casing |
| `CONFIRMED` | utils.ts APP_STATUS_MAP | Confirmed | `bg-emerald-50 text-emerald-700 border-emerald-200` | `CONFIRMED` | success | None | None | Low | Aligned |
| `FINANCE_PENDING` | utils.ts APP_STATUS_MAP | Finance Docs Needed | `bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]` | `FINANCE_PENDING` | amber | **Label mismatch: "Finance Docs Needed" vs "Finance pending"** | None | Medium | Label changes user-visible text |
| `PAYMENT_PROCESSING` | utils.ts APP_STATUS_MAP | Processing Payment | `bg-violet-50 text-violet-700 border-violet-200` | `PAYMENT_PROCESSING` | amber | **Tone mismatch: violet used, config says amber** | None | Medium | Color change would be visible |
| `COMPLETED` | utils.ts APP_STATUS_MAP | Completed | `bg-teal-50 text-teal-700 border-teal-200` | `COMPLETED` | success | Tone: teal vs emerald success | None | Low | Minor color variant |
| `FOLLOW_UP_REQUIRED` | utils.ts APP_STATUS_MAP | Follow-up Required | `bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]` | `FOLLOW_UP_REQUIRED` | amber | None | None | Low | Aligned |
| `REPORT_OVERDUE` | utils.ts APP_STATUS_MAP | Report Overdue | `bg-red-50 text-red-700 border-red-200` | `REPORT_OVERDUE` | amber | **Tone mismatch: danger red used, config says amber** | None | High | Config intent: overdue is amber urgency, not danger |
| `draft` | studentApplicationData.ts | Draft | `bg-surface-low text-ink-2 border-line` | `DRAFT` (different key) | neutral | Key naming convention differs | utils.ts DRAFT | Medium | Two separate systems for the same lifecycle |
| `ready_to_submit` | studentApplicationData.ts | Ready to submit | `bg-[#E5EDFF] text-role-primary border-[#0055FF]/20` | **None** | — | **Missing from config entirely** | None | Medium | Student-facing pre-submit state not in config |
| `submitted` | studentApplicationData.ts | Submitted | `bg-[#E5EDFF] text-role-primary border-[#0055FF]/20` | `SUBMITTED` (different key) | aurora | Tone aligned; key casing differs | utils.ts SUBMITTED | Medium | Two systems, consistent tone |
| `in_review` | studentApplicationData.ts | In review | `bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]` | `UNDER_REVIEW` (different key!) | amber | **Key name differs: `in_review` vs `UNDER_REVIEW`** | utils.ts UNDER_REVIEW | High | Fundamental key naming gap |
| `revision_requested` | studentApplicationData.ts | Revision requested | `bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]` | `NEEDS_DOCS` (partial) | amber | Semantically distinct from NEEDS_DOCS; no exact config match | None | Medium | May need its own config key |
| `approved` | studentApplicationData.ts | Approved | `bg-emerald-50 text-emerald-700 border-emerald-200` | `AWARDED` (approximate) | success | Semantically different: "approved" ≠ "awarded" | None | High | Student-facing approval vs scholarship award are distinct |
| `rejected` | studentApplicationData.ts | Not selected | `bg-surface-low text-ink-2 border-line` | `NOT_AWARDED` (approximate) | neutral | Label: "Not selected" — intentionally soft | None | Medium | Privacy-conscious label must be preserved |
| `withdrawn` | studentApplicationData.ts | Withdrawn | `bg-surface-low text-ink-2 border-line` | **None** | — | **Missing from config entirely** | None | Low | Withdraw is student-initiated terminal state |

---

## Domain 2 — Document Statuses

### Parallel Status Maps

**Map A — `src/data/mock/staffData.ts` DocumentVerificationState type** (7 values, no labels)
**Map B — `src/components/staff/DocumentVerificationPanel.tsx` inline `getStatusLabel/getStatusColor/getStatusIcon`** (7 values)
**Map C — `src/data/mock/studentApplicationData.ts` `documentStateLabels`** (8 values)
**Config — `src/config/statuses.ts` `DOCUMENT_STATUSES`** (9 keys)

### Inventory Table

| Status key | Found in | Current EN label | Current color/behavior | Config key | Config tone | Mismatch | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `missing` | studentApplicationData.ts, DocumentVerificationPanel | "Ready to add" / "Missing" | neutral (studentData) vs `bg-status-danger/10 text-status-danger` (Panel) | `missing` | neutral | **Tone mismatch: Panel uses danger; config says neutral** | High | Two components disagree on severity |
| `uploading` | statuses.ts only | — | — | `uploading` | aurora | Not used in DocumentVerificationPanel or staffData.ts type | Medium | Config has it; no component implements it |
| `uploaded` | staffData.ts type, DocumentVerificationPanel | "Uploaded" | `bg-role-tint text-role-primary` (Panel) | `uploaded` | aurora | Color: role-tint vs aurora — aligned if role is Student | Low | Aligned conceptually |
| `pending` | staffData.ts type, DocumentVerificationPanel | "Pending" | `bg-role-tint text-role-primary` (Panel) | `pending` | amber | **Tone mismatch: Panel uses role-tint/primary (aurora); config says amber** | Medium | Panel groups uploaded+pending together |
| `invalid_file_type` | staffData.ts type, DocumentVerificationPanel, studentApplicationData.ts | "Invalid File Type" / "Unsupported file type" | `bg-status-danger/10 text-status-danger` (Panel) | `invalid_file_type` | amber | **Tone mismatch: Panel uses danger; config says amber** | High | Divergent: Panel treats this as error, config as actionable warning |
| `verification_pending` | studentApplicationData.ts, statuses.ts | "Verification pending" | — (not in Panel) | `verification_pending` | amber | **Missing from staffData.ts type; not handled in DocumentVerificationPanel** | Medium | Config has it; staff verification flow ignores it |
| `verified` | All three + statuses.ts | "Verified" | `bg-status-success/10 text-status-success` (Panel) / emerald (studentData) | `verified` | success | None | Low | Well aligned across all sources |
| `rejected` | All three + statuses.ts | **"Rejected" (Panel) vs "Needs replacement" (studentData) vs "Needs replacement" (config)** | `bg-status-danger/10 text-status-danger` (Panel) | `rejected` | amber | **Label mismatch: Panel "Rejected", config "Needs replacement"; Tone: Panel uses danger, config says amber** | High | Most severe mismatch — label and tone both differ |
| `needs_replacement` | staffData.ts type, DocumentVerificationPanel, studentApplicationData.ts, statuses.ts | "Needs Replacement" (Panel) / "Replace file" (studentData) / "Replace document" (config) | `bg-status-warning/10 text-status-warning` (Panel) | `needs_replacement` | amber | Label varies across all three sources | Medium | Three label variants for same concept |

---

## Domain 3 — Scholarship Statuses

### Parallel Status Maps

**Map A — `src/lib/utils.ts` `SCH_STATUS_MAP`** (7 keys, UPPERCASE)
**Map B — `src/components/provider/ProviderScholarshipCard.tsx` `scholarshipStatusLabel/scholarshipStatusColor`** (4 keys)
**Config — `src/config/statuses.ts` `SCHOLARSHIP_STATUSES`** (9 keys)

### Inventory Table

| Status key | Found in | Current EN label | Current color | Config key | Config tone | Mismatch | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `DRAFT` | utils.ts, statuses.ts | "Draft" / "Draft" | `bg-surface-low text-ink-2` | `DRAFT` | neutral | None | Low | Aligned |
| `SUBMITTED` | utils.ts, statuses.ts | "Submitted" | `bg-blue-50 text-blue-700` (utils) | `SUBMITTED` | amber | **Tone mismatch: utils uses aurora/blue; config says amber** | Medium | Visible color change |
| `UNDER_REVIEW` | utils.ts, statuses.ts | "Under Review" / "Under review" | `bg-[#FFFBEB] text-[#78350F]` (utils) | `UNDER_REVIEW` | amber | Label casing only | Low | Aligned on tone |
| `PENDING_REVIEW` | providerData.ts, statuses.ts | — | — | `PENDING_REVIEW` | amber | **Missing from utils.ts SCH_STATUS_MAP** | Medium | SCH_STATUS_MAP incomplete |
| `ACTIVE` | providerData.ts, ProviderScholarshipCard, statuses.ts | "Active" | `bg-role-tint text-role-primary` (Card) | `ACTIVE` | emerald | **ProviderScholarshipCard uses role-tint (context-dependent); config says emerald** | Medium | Role-tint is provider context — may be intentional |
| `PUBLISHED` | utils.ts, statuses.ts | "Published" | `bg-emerald-50 text-emerald-700` | `PUBLISHED` | success | None | Low | Aligned |
| `OPEN` | utils.ts, statuses.ts | "Open" | `bg-emerald-50 text-emerald-700` | `OPEN` | success | None | Low | Aligned |
| `CLOSED` | utils.ts, providerData.ts, statuses.ts | "Closed" | `bg-surface-low text-ink-2` | `CLOSED` | neutral | None | Low | Aligned |
| `AWARDED` | utils.ts, statuses.ts | "Awarded" | `bg-teal-50 text-teal-700` (utils) | `AWARDED` | success | Tone: teal vs emerald (minor variant) | Low | Near-aligned |

---

## Domain 4 — Shortlist Request Statuses

### Parallel Status Maps

**Map A — `src/components/provider/ShortlistStatusBadge.tsx` inline `statusConfig`** (4 keys)
**Config — `src/config/statuses.ts` `SHORTLIST_REQUEST_STATUSES`** (5 keys)
**Type source — `src/data/mock/providerData.ts` `ShortlistStatus`** (4 values)

### Inventory Table

| Status key | Found in | Current EN label | Current color | Config key | Config tone | Mismatch | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `none` | ShortlistStatusBadge, providerData.ts, statuses.ts | "Not requested" (Badge) | `bg-white border border-line text-ink-3` | `none` | neutral | **Label: "Not requested" vs "No request"** | Low | Minor copy difference |
| `draft` | statuses.ts only | "Draft request" | — | `draft` | neutral | **Missing from ShortlistStatusBadge and providerData.ts type** | Medium | Config has draft state; components don't handle it |
| `pending_staff_approval` | ShortlistStatusBadge, providerData.ts, statuses.ts | "Pending Staff Approval" (Badge) | `bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]` | `pending_staff_approval` | amber | Label casing: "Pending Staff Approval" vs "Pending staff approval" | Low | Tone aligned |
| `approved` | ShortlistStatusBadge, providerData.ts, statuses.ts | "Approved" | `bg-emerald-50 border-emerald-200 text-emerald-700` | `approved` | success | None | Low | Aligned |
| `declined` | ShortlistStatusBadge, providerData.ts, statuses.ts | "Declined" (Badge) | `bg-surface-low border-line text-ink-2` | `declined` | neutral | **Label: "Declined" vs "Not approved"** | Medium | Privacy-sensitive: "Not approved" is intentionally opaque; "Declined" reveals decision framing |

---

## Domain 5 — Disclosure Request Statuses

### Parallel Status Maps

**Map A — `src/components/staff/DisclosureRequestCard.tsx` inline functions** (3 keys)
**Config — `src/config/statuses.ts` `DISCLOSURE_REQUEST_STATUSES`** (3 keys)

### Inventory Table

| Status key | Found in | Current EN label | Current color | Config key | Config tone | Mismatch | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `pending_staff_approval` | DisclosureRequestCard, staffData.ts, statuses.ts | "Pending Approval" (Card) | `bg-[#FFFBEB]` | `pending_staff_approval` | amber | Label: "Pending Approval" vs "Pending staff approval" | Low | Tone aligned |
| `approved` | DisclosureRequestCard, staffData.ts, statuses.ts | "Approved" | `bg-emerald-50` | `approved` | success | None | Low | Aligned |
| `rejected` | DisclosureRequestCard, staffData.ts, statuses.ts | "Rejected" (Card) | `bg-red-50 text-red-700` | `rejected` | neutral | **Label: "Rejected" vs "Not approved"; Tone: Card uses red/danger; config says neutral** | High | Governance concern: "Rejected" may reveal decision reasoning to wrong audience; config says neutral intentionally |

---

## Domain 6 — Review Statuses

### Notes

`src/config/statuses.ts` `REVIEW_STATUSES` defines 7 states (pending, in_review, revision_requested,
approved, rejected, overridden, resolved). No component currently imports and uses this group
directly as a unified map. It overlaps with but does not replace `ANN_STATUS_MAP` which is
the only active review-style map.

`ANN_STATUS_MAP` in `src/lib/utils.ts` covers announcement lifecycle (DRAFT → SUBMITTED →
UNDER_REVIEW → APPROVED → PUBLISHED → REVISION_REQUESTED → REJECTED). This domain
is **entirely absent from `statuses.ts`** — no `ANNOUNCEMENT_STATUSES` group exists.

| Status key | Found in | Current EN label | Color | Config match | Risk | Notes |
|---|---|---|---|---|---|---|
| `APPROVED` | ANN_STATUS_MAP | "Approved" | `bg-emerald-50 text-emerald-700` | REVIEW_STATUSES `approved` (partial) | Low | Concept maps to review approval |
| `REVISION_REQUESTED` | ANN_STATUS_MAP | "Revision Requested" | `bg-[#FFFBEB] text-[#78350F]` | REVIEW_STATUSES `revision_requested` (partial) | Low | Conceptually aligned |
| `REJECTED` | ANN_STATUS_MAP | "Rejected" | `bg-red-50 text-red-700` | REVIEW_STATUSES `rejected` | Medium | Config `rejected` → neutral tone; utils uses red/danger — **tone mismatch** |
| `PUBLISHED` | ANN_STATUS_MAP | "Published" | `bg-emerald-50 text-emerald-700` | SCHOLARSHIP_STATUSES `PUBLISHED` (partial) | Low | Announcement publish ≠ scholarship publish |
| `overridden` | statuses.ts only | — | — | REVIEW_STATUSES `overridden` | Low | No component uses this yet |
| `resolved` | statuses.ts only | — | — | REVIEW_STATUSES `resolved` | Low | No component uses this yet |

---

## Domain 7 — Audit/Risk Statuses

### Parallel Status Maps

**Map A — `src/components/admin/UserRiskBadge.tsx` inline config** (3 levels: low/medium/high only)
**Map B — `src/components/admin/ElevatedAccessWarning.tsx` inline conditionals** (2 levels: medium/high only)
**Map C — `src/components/admin/SensitiveAccessCard.tsx` `getRiskColor()`** (2 levels: high/medium only)
**Config — `src/config/statuses.ts` `AUDIT_RISK_STATUSES`** (4 levels: low/medium/high/critical)

### Inventory Table

| Risk level | Found in | Current EN label | Current color | Config key | Config tone | Mismatch | Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `low` | UserRiskBadge | "Low" | `text-status-success bg-status-success/10` | `low` | neutral | **Tone: UserRiskBadge uses success/green; config says neutral** | Medium | Success green may overstate safety |
| `medium` | UserRiskBadge, ElevatedAccessWarning, SensitiveAccessCard | "Medium" | amber colors (`bg-[#FFFBEB]`, `text-status-warning`) | `medium` | amber | None | Low | Aligned on amber |
| `high` | UserRiskBadge, ElevatedAccessWarning, SensitiveAccessCard | "High" | `bg-red-50 text-status-danger` (various) | `high` | amber | **Tone mismatch: components use red/danger; config says amber** | High | High risk ≠ danger per config intent |
| `critical` | statuses.ts only | — | — | `critical` | amber | **Missing from UserRiskBadge, ElevatedAccessWarning, SensitiveAccessCard** | Critical | Most severe level unhandled in components |
| `critical`/`warning`/`info` | StaffDataQualityIssueCard | — | — | None direct | — | **StaffDataQualityIssueCard uses completely different severity vocabulary** | Medium | Parallel severity system; not aligned with AUDIT_RISK_STATUSES |

---

## Domain 8 — Data Freshness Statuses

### Parallel Status Maps

**Map A — `src/components/provider/ProviderDataFreshnessIndicator.tsx`** (3 values: fresh/stale/failed)
**Map B — `src/data/mock/staffData.ts` type** (2 values: current/stale — note `current` not `fresh`)
**Map C — `src/data/mock/providerData.ts` type** (3 values: fresh/stale/failed)
**Map D — `src/data/mock/studentMatchingData.ts` `DataFreshnessStatus`** (3 values: fresh/stale/failed)
**Config — `src/config/statuses.ts` `DATA_FRESHNESS_STATUSES`** (3 keys: fresh/stale/failed)

### Inventory Table

| Status key | Found in | Current label | Config key | Config tone | Mismatch | Risk | Notes |
|---|---|---|---|---|---|---|---|---|
| `fresh` | providerData.ts, studentMatchingData.ts, statuses.ts | — | `fresh` | success | None | Low | Consistent across provider+student |
| `current` | **staffData.ts only** | — | **None — `fresh` is the config key** | success | **Key mismatch: `current` vs `fresh`** | Medium | staffData.ts uses `current`; every other source uses `fresh` |
| `stale` | All sources | — | `stale` | amber | None | Low | Consistent |
| `failed` | All except staffData.ts | — | `failed` | amber | **Missing from staffData.ts type** | Low | staffData.ts doesn't model the failed state |

---

## Domain 9 — OCR Job Statuses (Not in config)

| Status key | File | Notes |
|---|---|---|
| `idle` | `src/app/staff/ocr/page.tsx` | Component-local UI state only |
| `uploading` | `src/app/staff/ocr/page.tsx` | Overlaps with document `uploading` but distinct context |
| `extracting` | `src/app/staff/ocr/page.tsx` | No config equivalent |
| `needs_review` | `src/app/staff/ocr/page.tsx` | No config equivalent |
| `confirmed` | `src/app/staff/ocr/page.tsx` | No config equivalent |

**Migration risk: Low.** These are transient UI states for a local workflow simulation. Not
appropriate for config/statuses.ts — they are not data persistence states.

---

## Domain 10 — Admin-Specific Statuses (Not in config)

| Status key | File | Domain | Notes |
|---|---|---|---|
| `active`, `inactive`, `suspended`, `pending_approval` | adminData.ts | User account | No config equivalent |
| `pending`, `approved`, `denied` | adminData.ts | Access request | Note: `denied` vs `rejected` naming differs from disclosure domain |
| `open`, `investigating`, `reviewed`, `escalated`, `closed` | adminData.ts | Security incident | No config equivalent; rich lifecycle |

**Migration risk: Low for now.** These are mock-data-only states. No shared badge component
renders them; they are rendered inline in admin page components.

---

## Domain 11 — Announcement Statuses (Entirely missing from config)

**Source: `src/lib/utils.ts` `ANN_STATUS_MAP`**

| Status key | EN label | Color | Absent from config? |
|---|---|---|---|
| `DRAFT` | Draft | neutral | Yes (ANNOUNCEMENT_STATUSES group does not exist) |
| `SUBMITTED` | Pending ESQ | blue/aurora | Yes |
| `UNDER_REVIEW` | Under Review | amber | Yes |
| `APPROVED` | Approved | emerald | Yes |
| `PUBLISHED` | Published | emerald | Yes |
| `REVISION_REQUESTED` | Revision Requested | amber | Yes |
| `REJECTED` | Rejected | red/danger | Yes |

**Migration risk: Medium.** Entire domain needs addition to config before migration.

---

## Domain 12 — Eligibility / Matching Statuses (Not in config)

| Status key | File | Notes |
|---|---|---|
| `met`, `unmet`, `unknown` | studentMatchingData.ts `EligibilityStatus` | Eligibility gate state |
| `met`, `review` | providerData.ts criteria status | Criteria check result |
| `verified`, `self-reported` | studentMatchingData.ts `ProfileSignalStatus` | Signal quality indicator |
| `top_band`, `strong_band`, `developing_band`, `watch_band` | providerData.ts `CandidateRankBand` | Candidate banding |

**Migration risk: Low for now.** These are matching-pipeline-specific concepts not appropriate
for the general status config without first designing a matching domain section.

---

## Top Inconsistency Summary

| # | Inconsistency | Files affected | Severity |
|---|---|---|---|
| 1 | `NEEDS_DOCS` uses danger-red; config says amber | utils.ts, all consumers | High |
| 2 | `REPORT_OVERDUE` uses danger-red; config says amber | utils.ts, all consumers | High |
| 3 | Document `rejected` label is "Rejected" in panel vs "Needs replacement" in config | DocumentVerificationPanel.tsx | High |
| 4 | Document `rejected` uses danger color; config tone is amber | DocumentVerificationPanel.tsx | High |
| 5 | Document `missing` uses danger color; config tone is neutral | DocumentVerificationPanel.tsx | High |
| 6 | Audit/risk `critical` level missing from all three admin components | UserRiskBadge, ElevatedAccessWarning, SensitiveAccessCard | Critical |
| 7 | Audit/risk `high` uses red/danger; config says amber | UserRiskBadge, ElevatedAccessWarning | High |
| 8 | Disclosure `rejected` uses red/danger; config says neutral (privacy-aware) | DisclosureRequestCard | High |
| 9 | `in_review` (studentApplicationData) ≠ `UNDER_REVIEW` (config/utils.ts) — same lifecycle, different keys | studentApplicationData.ts | High |
| 10 | staffData.ts uses `current` for freshness; all other sources use `fresh` | staffData.ts | Medium |
| 11 | `SHORTLISTED` uses aurora/blue; config says success/emerald | utils.ts | Medium |
| 12 | Shortlist `declined` label is "Declined"; config says "Not approved" | ShortlistStatusBadge | Medium |
| 13 | `FINANCE_PENDING` label "Finance Docs Needed" vs "Finance pending" | utils.ts | Medium |
| 14 | Announcement domain entirely absent from statuses.ts | utils.ts ANN_STATUS_MAP | Medium |
| 15 | StaffDataQualityIssueCard uses `critical/warning/info` vs `low/medium/high/critical` | StaffDataQualityIssueCard | Medium |
