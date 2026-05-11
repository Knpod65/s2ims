# S2IMS Component Inventory

## Purpose

This inventory records the current component structure and identifies role boundaries, shared primitive candidates, and overlapping patterns. It is documentation only and does not propose moving files yet.

## Shared Components

| Component | Current role | Notes |
|---|---|---|
| `src/components/MatchScoreRing.tsx` | Shared role-aware match ring | Uses role CSS variables. Safe shared primitive for student/provider score display. |
| `src/components/ScholarshipCard.tsx` | Public scholarship card | Used for public scholarship feed. Currently wraps the shared match ring through student compatibility import. |
| `src/components/ApplicationTimeline.tsx` | Legacy/shared application timeline | Separate from student application timeline. Candidate for review before sharing further. |
| `src/components/ProfileCompletionRing.tsx` | Legacy/shared profile completion UI | Overlaps with student `ProfileCompletenessCard`. Candidate for consolidation review. |

## UI Primitives

| Component/file | Current purpose | Shared primitive potential |
|---|---|---|
| `src/components/ui/index.tsx` | `StatusBadge`, `StatCard`, `GlassCard`, `PageHeader`, `EmptyState`, `Skeleton`, `PrivacyNotice`, etc. | Already a shared primitive hub. Consider splitting when it grows further. |
| `src/components/ui/Toast.tsx` | Toast provider and notification UI | Shared. Future audit/action feedback can use this but should not replace real logging. |

## Layout Components

| Component | Purpose | Notes |
|---|---|---|
| `src/components/layout/AppShell.tsx` | Role shell, client auth redirect, layout structure | Central role guard today. Not a production security boundary. |
| `src/components/layout/Sidebar.tsx` | Desktop role navigation | Uses `NAV_CONFIG` and role CSS variables. |
| `src/components/layout/Topbar.tsx` | Brand, role badge, freshness, language, notifications, profile | Uses mock notifications. |
| `src/components/layout/MobileBottomNav.tsx` | Mobile role navigation | Uses `MOBILE_NAV`. |

## Student Components

| Component | Current purpose | Boundary guidance |
|---|---|---|
| `ApplicationReadinessCard` | Student application readiness summary | Keep student-specific. |
| `ApplicationRevisionNotice` | Student-facing revision request notice | Keep student-specific tone. |
| `ApplicationStatusCard` | Student application tracker card | Role-specific for student tracker. |
| `ApplicationTimeline` | Student application timeline | Do not import into Provider. Could become shared only after abstraction. |
| `DataFreshnessIndicator` | Student data freshness pill | Candidate for shared primitive if generalized. |
| `DocumentUploadCard` | Student mock document upload state | Keep student-specific. |
| `DocumentUploadChecklist` | Student document checklist | Keep student-specific. |
| `EligibilityChecklist` | Hard eligibility checklist | Candidate for shared primitive after removing student-specific typing/copy. |
| `FileValidationError` | Student upload validation message | Keep student-specific until upload architecture exists. |
| `FitBreakdown` | Student-friendly soft-fit explanation | Candidate for shared visual bar primitive only, not scoring semantics. |
| `MatchScoreRing` | Compatibility re-export to shared `MatchScoreRing` | Fine to keep for existing imports. |
| `MatchingExplanationCard` | Student explanation of matching | Keep student-specific. |
| `MissingDataPrompt` | Student supportive missing-data prompts | Do not import into Provider. Tone can inform future shared copy rules. |
| `ProfileCompletenessCard` | Student profile completeness card | Keep student-specific. |
| `RecommendationCard` | Student recommendation card | Keep student-specific. |
| `RequiredDocumentsList` | Student required documents | Do not import into Provider. |
| `ScholarshipDetailCard` | Student scholarship detail summary | Keep student-specific. |
| `StudentPrivacyNotice` | Student privacy explanation | Keep student-specific, but can continue using shared privacy primitives. |
| `SubmitConfirmationModal` | Student application submit confirmation | Keep student-specific. |
| `UploadProgressIndicator` | Student upload progress indicator | Candidate for shared progress primitive later. |
| `index.ts` | Student barrel exports | Useful internally, but Provider should not import from it. |

## Provider Components

| Component | Current purpose | Boundary guidance |
|---|---|---|
| `ProviderDashboardSummary` | Provider portfolio metrics | Provider-specific. |
| `ProviderScholarshipCard` | Provider scholarship card/actions | Provider-specific. |
| `ProviderScholarshipForm` | Provider create/edit mock form | Provider-specific until form primitives exist. |
| `ProviderCriteriaBuilder` | Provider hard/soft criteria builder | Provider-specific workflow. |
| `MatchingPreviewCard` | Provider anonymized matching volume preview | Provider-specific. |
| `CandidatePoolSummary` | Provider aggregate candidate pool metrics | Provider-specific. |
| `AnonymousCandidateCard` | Token-only candidate display | Provider-specific and privacy-critical. |
| `CandidatePoolTable` | Provider candidate pool table | Provider-specific and privacy-critical. |
| `CandidateSelector` | Provider sticky shortlist selector | Provider-specific. |
| `ShortlistRequestModal` | Reason-required shortlist request | Provider-specific and audit-sensitive. |
| `ShortlistReasonField` | Reason text field | Could become shared reason-required field after policy design. |
| `ShortlistConfirmationCard` | Pending staff approval confirmation | Provider-specific. |
| `ShortlistStatusBadge` | Shortlist status badge | Could become shared status badge mapping later. |
| `ProviderPrivacyNotice` | Provider privacy/PDPA notice | Provider-specific wrapper around shared privacy concept. |
| `ProviderImpactCard` | Provider impact metric card | Candidate for shared metric card if generalized. |
| `ProviderDataFreshnessIndicator` | Provider freshness pill | Candidate for shared freshness indicator. |

## Staff Components

| Component | Current purpose | Boundary guidance |
|---|---|---|
| `AuditWarningCard` | Warning for auditable sensitive actions | Candidate shared governance primitive, but keep behavior/copy reviewed. |
| `DisclosureApprovalModal` | Staff disclosure approval | Staff/governance-specific. |
| `DisclosureRejectionModal` | Staff disclosure rejection | Staff/governance-specific. |
| `DisclosureRequestCard` | Staff disclosure request display/actions | Staff/governance-specific. |
| `DocumentVerificationPanel` | Staff document verification workflow | Staff-specific. |
| `FairnessAlertCard` | Staff fairness alert | Governance-specific. |
| `MaskedStudentProfileCard` | Masked student profile card | Candidate for shared masking display after privacy service exists. |
| `MatchOverrideModal` | Staff match override modal | Staff/governance-specific and audit-sensitive. |
| `MatchReviewCard` | Staff matching review list card | Staff-specific. |
| `StaffDataQualityIssueCard` | Staff data quality issue card | Staff-specific. |

## Admin Components

| Component | Current purpose | Boundary guidance |
|---|---|---|
| `AccessRequestCard` | Access request card | Admin/security-specific. |
| `AdminAuditWarningCard` | Admin audit warning | Overlaps with staff `AuditWarningCard`. Candidate for shared governance warning. |
| `AdminKpiCard` | Admin KPI card | Candidate for shared metric card if needed. |
| `AuditFilterPanel` | Audit filters | Admin-specific for now. |
| `AuditLogEventCard` | Audit log event display | Candidate for shared audit event primitive. |
| `ElevatedAccessWarning` | Elevated access warning | Governance/security primitive candidate. |
| `ExportEventCard` | Export event display | Admin/security-specific. |
| `PermissionMatrixTable` | Permission matrix | Admin-specific. |
| `PermissionStatusBadge` | Permission state badge | Candidate for shared status mapping later. |
| `RoleAssignmentPanel` | Role assignment UI | Admin-specific and audit-sensitive. |
| `RoleBadge` | Role badge | Candidate for shared role badge after config centralization. |
| `SecurityAlertCard` | Security alert display | Admin/security-specific. |
| `SensitiveAccessCard` | Sensitive access event display | Governance/security primitive candidate. |
| `UserRiskBadge` | User risk label | Admin-specific. |

## Governance And Privacy Components

Current governance/privacy surfaces:

- `PrivacyNotice` in `src/components/ui/index.tsx`
- `ProviderPrivacyNotice`
- `StudentPrivacyNotice`
- `AuditWarningCard`
- `AdminAuditWarningCard`
- `ElevatedAccessWarning`
- `SensitiveAccessCard`
- `FairnessAlertCard`
- `MaskedStudentProfileCard`
- Disclosure approval/rejection modals
- Provider `AnonymousCandidateCard`

Recommended future boundary:

- Create a small governance primitive set only after policy and masking rules are documented.
- Avoid making role-specific privacy workflows generic too early.

## Components That Should Remain Role-Specific

- Student application/document components.
- Student missing-data and recommendation components.
- Provider candidate pool components.
- Provider shortlist request components.
- Staff disclosure approval/rejection components.
- Staff document verification and match override components.
- Admin role assignment and permission matrix components.

Reason: these components encode role-specific copy, data visibility, and audit expectations.

## Candidates For Shared Primitives

Good candidates after approval:

- Form field wrapper and error text.
- Table wrapper with responsive behavior.
- Status badge configuration.
- Role badge.
- Data freshness indicator.
- Metric card.
- Audit/governance warning card.
- Reason-required textarea.
- Empty/loading/error state patterns.
- Privacy notice base component.

## Duplicate Or Overlapping Components

| Overlap | Current files | Renovation note |
|---|---|---|
| Match score ring | `src/components/MatchScoreRing.tsx`, `src/components/student/MatchScoreRing.tsx`, public wrapper in `ScholarshipCard.tsx` | Shared ring exists. Later cleanup can simplify import paths. |
| Application timeline | `src/components/ApplicationTimeline.tsx`, `src/components/student/ApplicationTimeline.tsx` | Review behavior before merging. |
| Profile completion | `ProfileCompletionRing`, `ProfileCompletenessCard` | Keep until student profile UX is stabilized. |
| Audit warning | `AuditWarningCard`, `AdminAuditWarningCard`, `PrivacyNotice` warning variant | Candidate for governance primitive. |
| Status badges | Shared `StatusBadge` plus domain-specific badge maps/components | Centralize config gradually. |
| Freshness indicators | Topbar freshness pill, student freshness, provider freshness | Candidate for shared freshness primitive. |
| Forms | Provider form, student application form, admin settings, staff announcement forms | Create field primitives before refactoring. |
| Tables | Admin/users/audit, staff/applications, provider candidate table | Candidate for shared table shell. |

## Cross-Role Boundary Rules

Current high-priority boundary:

- Provider routes and provider components should not import from `src/components/student/*`.
- Provider candidate pool must show `Candidate #C-XXXX` only.
- Provider components should not use student application timelines, missing data prompts, required document lists, or document upload components.

Future lint rule candidate:

`src/app/provider/**` and `src/components/provider/**` should reject imports matching `@/components/student/*`.

