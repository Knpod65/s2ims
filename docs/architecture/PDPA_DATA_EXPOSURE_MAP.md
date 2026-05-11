# S2IMS PDPA Data Exposure Map

## Purpose

This document maps personal-data-like fields and sensitive surfaces in the current mock S2IMS UI. It is a current-state risk map and should guide future masking, audit, and access-control work.

## Exposure Categories

| Data category | Example fields | Current sources | Primary roles touching it |
|---|---|---|---|
| Student identity fields | `name_th`, `name_en`, `email`, `student_id`, avatar/profile info | `mockUsers`, `mockApplications`, staff local constants | Student, staff, admin |
| Candidate tokens | `Candidate #C-XXXX` | `providerData`, `staffData` | Provider, staff |
| Student tokens | `Student #S-XXXX` | Derived in staff pages/components | Staff |
| Scholarship/application data | Scholarship title, amount, deadline, application status, match score | `scholarships`, `applications`, `studentApplicationData`, `providerData` | Student, staff, provider, admin |
| Document data | Document names, upload state, verification state, rejection reason | `studentApplicationData`, `staffData` | Student, staff |
| Financial/need data | Need band, financial need percentile, financial context prompts | `studentMatchingData`, `staffData`, `providerData` | Student, staff, provider aggregate/banded |
| Academic data | GPA bands/ranges, academic year, major, department band | `mockUsers`, `studentMatchingData`, `staffData`, `providerData` | Student, staff, provider aggregate/banded |
| Audit events | actor, role, action, entity, IP, timestamp, reasons | `audit-logs`, `staffData`, `adminData` | Staff, admin |
| Export/report surfaces | Admin CSV/JSON export, staff analytics export, provider aggregate impact | Admin/staff/provider pages | Admin, staff, provider |

## Student Identity Fields

| Field | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Student name | Student dashboard/profile; staff follow-up local constants; staff student profile; admin users | Own student view unmasked; staff/admin may see unmasked in places | High | `PrivacyMaskingService`, staff policy, admin sensitive access policy |
| Student email | Topbar/sidebar for current user; admin users/export; staff student profile | Unmasked for current user/admin/staff profile page | High | Mask by role and action; audit staff/admin access |
| Student ID | Student profile; staff application list/detail; staff student profile; admin application export | Often raw | High | Display as token by default; reveal only through reason + audit |
| Major/academic year | Student profile; staff student profile | Unmasked in some staff views | Medium | Treat as educational record; mask or band when role does not need exact value |

## Candidate Tokens

| Token type | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Provider candidate token | Provider candidate pool, provider shortlist modal, provider data | Token-only `Candidate #C-XXXX` | Low if maintained | DTO boundary and import lint rule |
| Staff disclosure candidate token | Staff disclosure requests and audit events | Token plus possible fields requested | Medium | Disclosure policy and field-level approval |
| Student token | Staff application masked profile | Derived `Student #S-XXXX` | Low to medium | Standard token utility |

## Scholarship And Application Data

| Data | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Scholarship profile | Public, student, provider, admin export | Mostly public/non-sensitive | Low | Scholarship service |
| Application status | Student tracker, staff applications, admin export | Role-visible | Medium | Application ownership and staff policy |
| Match score | Student explanations, provider candidate pool, staff applications | Displayed as percent | Medium | Matching service should expose role-safe score views |
| Application timeline | Student and staff views | Student self-view, staff operational view | Medium | Application service and ownership check |

## Document Data

| Data | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Document checklist | Student apply/documents, provider scholarship requirements | Safe if generic | Low | Document config/service |
| Document upload states | Student documents, staff verification | Role-specific | Medium | Document service with ownership and staff permission checks |
| Rejection/replacement reasons | Student/staff document components | Visible in mock UI | Medium | Audit and notification service |
| File names | Student document mock data and staff document state | May reveal sensitive content | Medium to high | File metadata masking and upload policy |

## Financial And Need Data

| Data | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Student financial context | Student prompts/explanations | Student self-view | Medium | Student profile service |
| Financial need percentile | Staff masked profile data | Staff-visible aggregate-like value | Medium | Band or mask depending on staff action |
| Need band | Provider candidate pool | Banded only | Low if maintained | Provider DTO and grouping thresholds |
| Raw financial values | Not expected in Provider Phase 4 data | Not modeled for provider | High if introduced | Privacy schema and lint/test guard |

## Academic Data

| Data | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Exact GPA | Student self-view and some older staff/provider-like data patterns | Mixed | Medium to high | Role-safe academic display helper |
| GPA range/band | Staff masked card, provider candidate pool | Banded/ranged | Medium | Standard banding utility |
| Academic year | Student profile, staff views, provider criteria bands | Visible or banded depending route | Medium | Access policy and display mapper |
| Department/major | Student profile, staff profile, provider department band | Mixed | Medium | Department banding rules for provider |

## Audit Events

| Data | Current UI surfaces | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| Audit actor/action/IP | Admin audit log and export | Admin-visible | Medium | Immutable audit repository |
| Staff audit events | Staff application detail, staffData | Mock only | Medium | AuditLogService |
| Disclosure audit details | Staff/admin data | Mock only | High | Disclosure audit policy |
| Export audit | Admin export events in adminData | Mock only | High | Export service must write audit event |

## Export And Report Surfaces

| Surface | Current data | Current masking state | Risk | Recommended future enforcement point |
|---|---|---|---|---|
| `/admin/export` users | IDs, names, emails, roles | Unmasked admin export | High | ExportPolicyService and AuditLogService |
| `/admin/export` applications | IDs, scholarship IDs, student IDs, status, match score | Student IDs exported | High | Export field allowlist and masking |
| `/admin/audit-log` CSV | Audit log rows | Admin-only mock | Medium | Immutable audit access policy |
| `/staff/analytics` export | Aggregate funnel rows | Aggregate | Low to medium | Report policy |
| `/provider/impact` | Aggregate-only provider metrics | Aggregate | Low if no small-cell risk | Aggregate threshold service |

## Highest Priority PDPA Risks

1. Staff student profile says masked but currently displays student ID and email.
2. Staff application detail displays raw `app.student_id` in the page title.
3. Admin export can export user emails and application student IDs.
4. Sensitive actions say they are logged, but no central audit side effect exists.
5. Masking rules are component-specific and not testable.
6. Provider token-only boundary is good, but not enforced by lint or tests yet.

## Future Enforcement Points

Recommended utilities/services:

- `PrivacyMaskingService`
- `AuditLogService`
- `ExportPolicyService`
- `RolePermissionService`
- `StudentIdentityTokenService`
- `ProviderCandidateDtoService`
- `SensitiveAccessReasonValidator`

