# S2IMS Role And Permission Map

## Purpose

This document records expected role access, sensitive actions, data visibility, masking rules, and future enforcement needs. It is based on current code and should guide future access-control renovation.

Current implementation uses mock auth:

- `AuthProvider` stores selected role in `localStorage` as `s2ims_role`.
- `AppShell requiredRole` performs client-side redirect to `/login`.
- No `middleware.ts` or server policy layer exists.

## Role Summary

| Role | Main route groups | Current guard | Future enforcement need |
|---|---|---|---|
| student | `/student/**`, public scholarship routes | `AppShell requiredRole="student"` | Session-backed self-access checks |
| provider | `/provider/**` | `AppShell requiredRole="provider"` | Provider ownership and token-only candidate policy |
| staff | `/staff/**` | `AppShell requiredRole="staff"` | Staff permission policy for review, reveal, disclosure, OCR |
| esq / executive | `/esq/**` | `AppShell requiredRole="esq"` | Approval permission policy |
| admin | `/admin/**` | `AppShell requiredRole="admin"` | Admin permission matrix and export policy |

## Student

| Category | Current expectation |
|---|---|
| Allowed route groups | `/student/**`, public routes |
| Sensitive actions | Submit application, edit application, manage mock documents, view own profile/matching explanations |
| Data visibility | Own profile, own applications, own recommendations, own document states |
| Masking rules | No masking needed for own data, but should not see other student data |
| Export/report access | None currently |
| Audit requirements | Future audit for application submit, document upload, profile update, consent/privacy acknowledgement |
| Current implementation status | Client-side role guard only; ownership checks are implicit in mock data |
| Future enforcement requirement | `canViewOwnApplication`, `canEditOwnProfile`, `canUploadOwnDocument`, route-level self checks |

## Provider

| Category | Current expectation |
|---|---|
| Allowed route groups | `/provider/**` |
| Sensitive actions | Create/edit scholarship, edit criteria, view candidate pool, request shortlist |
| Data visibility | Provider organization data, provider scholarships, anonymous candidate tokens, banded/aggregate candidate data, aggregate impact |
| Masking rules | Must never see student name, raw student ID, email, phone, address, exact GPA, raw financial values, or identifiable profile details |
| Export/report access | Aggregate impact only; no individual student export |
| Audit requirements | Future audit for criteria updates, scholarship submissions, shortlist requests, export/report actions |
| Current implementation status | Phase 4 uses token-only `Candidate #C-XXXX` mock candidate data and provider-specific components |
| Future enforcement requirement | Provider-to-student import lint rule, candidate DTO boundary, provider ownership checks, grouping thresholds for reports |

## Staff

| Category | Current expectation |
|---|---|
| Allowed route groups | `/staff/**` |
| Sensitive actions | Review applications, verify documents, reveal identity, add staff notes, change status, approve/reject disclosure, override match, resolve data quality |
| Data visibility | Operational application data, masked student profile, selected staff review data, disclosure requests |
| Masking rules | Student identity should be masked by default; reveal requires reason and audit trail |
| Export/report access | Staff analytics export exists as local UI; future permissions needed |
| Audit requirements | Required for identity reveal, status changes, document verification/rejection, match override, disclosure decisions, data quality resolution |
| Current implementation status | Visual audit warnings and mock audit events exist; some staff routes still display raw student ID/email |
| Future enforcement requirement | Staff policy map, `PrivacyMaskingService`, `AuditLogService`, reason-required helper, sensitive access records |

## ESQ / Executive

| Category | Current expectation |
|---|---|
| Allowed route groups | `/esq/**` |
| Sensitive actions | Approve/reject/revision announcements |
| Data visibility | Announcement review data and approval history |
| Masking rules | Should see only data needed for governance decision |
| Export/report access | None currently |
| Audit requirements | Approval, rejection, revision requests, comments, SLA decisions |
| Current implementation status | Mock approval UI and history using `mockAnnouncements` |
| Future enforcement requirement | `canApproveAnnouncement`, audit writer for approval outcomes, SLA policy config |

## Admin

| Category | Current expectation |
|---|---|
| Allowed route groups | `/admin/**` |
| Sensitive actions | Manage users, view permissions, export data, view audit log, adjust settings |
| Data visibility | Broadest current mock visibility: users, emails, audit logs, application student IDs, settings |
| Masking rules | Admin may have privileged visibility, but export and sensitive access should still be controlled and audited |
| Export/report access | Admin export center can download users, applications, scholarships, audit log |
| Audit requirements | Required for export, permission/role changes, settings changes, sensitive access, failed login/security events |
| Current implementation status | Static permission matrix and mock export UI; no real permission enforcement |
| Future enforcement requirement | Admin permission map, export policy, audit log immutability, reason/approval for high-risk exports |

## Sensitive Action Matrix

| Action | Student | Provider | Staff | ESQ | Admin | Future policy requirement |
|---|---|---|---|---|---|---|
| View own profile | Yes | No | Limited/masked | No | Admin only if justified | Ownership and masking |
| View candidate pool | No | Token-only | Staff review only | No | Admin audit only | Candidate DTO boundary |
| Reveal identity | No | No | With reason/future approval | No | With strict audit only | Reason + audit + policy |
| Export users/applications | No | No | No by default | No | Yes with audit | Export policy |
| Approve disclosure | No | No | Yes | No | Oversight only | Staff disclosure policy |
| Approve announcement | No | No | Submit only | Yes | Oversight only | ESQ policy |
| Manage roles | No | No | No | No | Yes | Admin permission policy |
| Override match | No | No | Yes with reason | Oversight later | Oversight later | Reason + audit |

## Implementation Gaps

- No server-side role enforcement.
- No permission checks beyond role shell.
- No central action policy map.
- No real audit side effects.
- No central masking rules.
- No export policy.
- No automated tests for access control or privacy boundaries.

## Future Enforcement Requirements

Recommended order:

1. Document route and action permissions.
2. Centralize role and permission constants.
3. Add no-restricted-imports rule for Provider-to-Student component boundary.
4. Add pure `canAccess` and `canPerform` helpers without changing behavior.
5. Add tests for policy helpers.
6. Only then consider `middleware.ts` and real session enforcement.

