# Sensitive Action Reason Inventory (Phase 2E)

## Scope

This is a documentation-only inventory of current reason-required, audit-warning, and sensitive-action flows.

- No wiring to `src/config/sensitiveActions.ts` in this phase.
- No behavior changes in this phase.

## Inventory Table

| Action name | Current route/component | Current reason field label | Current min length | Submit blocks empty reason | Audit warning shown | Mock-only | Current user-facing warning copy | Recommended future config key | Migration risk | Notes |
|---|---|---|---:|---|---|---|---|---|---|---|
| shortlist_request | `src/app/provider/scholarships/[scholarshipId]/candidates/page.tsx` + `src/components/provider/ShortlistRequestModal.tsx` | `Shortlist reason` / `เหตุผลในการขอคัดเลือก` | 10 | Yes | Partial (privacy warning, no shared audit card) | Yes | EN: `Staff will review your reason before any next step... identity details are not revealed in this phase.` | `shortlist_request` | Low | Most complete low-risk reason gate in provider flow. |
| matching_override | `src/app/staff/matching-review/page.tsx` + `src/components/staff/MatchOverrideModal.tsx` | `Reason (Required)` | 20 | Yes | Yes (`AuditWarningCard`) | Yes | EN: `This override will be logged in the audit trail. Please provide clear, documented justification.` | `matching_override` | Medium | Strong gating and warning present; still mock submit. |
| disclosure_approval | `src/app/staff/disclosure-requests/page.tsx` + `src/components/staff/DisclosureApprovalModal.tsx` | None (no input) | N/A | No | Yes (`AuditWarningCard` with `requiresReason`) | Yes | EN: `This decision is logged and irreversible...` | `disclosure_approval` | High | Warning says reason required, but UI has no reason field. |
| disclosure_rejection | `src/app/staff/disclosure-requests/page.tsx` + `src/components/staff/DisclosureRejectionModal.tsx` | `Rejection Reason (Required)` | 15 | Yes | Yes (`AuditWarningCard`) | Yes | EN: `This rejection will be logged in the audit trail. Please provide a clear reason.` | `disclosure_rejection` | Medium | Reason and warning exist; min-length differs from other flows. |
| role_change | `src/components/admin/RoleAssignmentPanel.tsx` (component inventory; not mounted in admin routes) | `Reason (min 20 characters)` | 20 | Yes | Yes (`AdminAuditWarningCard`) | Yes | EN: `* Documented reason required for this action` + consequence copy | `role_change` | Medium | Flow exists in component but is not currently wired in `src/app/admin/*`. |
| scope_change | No dedicated interactive modal/flow found in `src/app/admin/*` | N/A | N/A | N/A | N/A | N/A | N/A | `scope_change` | High | Present in config and audit display models, but no current submit surface to enforce reason rules. |
| export_report | `src/app/admin/export/page.tsx`, `src/app/admin/audit-log/page.tsx`, `src/app/staff/analytics/page.tsx` | None | N/A | No | No | Yes | Generic success toast only (no audit warning in UI action) | `export_report` | High | Export actions run without reason capture despite config expecting reason+audit. |
| sync_retry | No explicit flow found in current `src/app/**` | N/A | N/A | N/A | N/A | N/A | N/A | `sync_retry` | Medium | Config exists; implementation surface absent in current UI. |
| document_rejection | `src/components/staff/DocumentVerificationPanel.tsx` used by `src/app/staff/applications/[id]/page.tsx` | `Please specify reason...` | None | Yes | No (audit card imported but not rendered) | Yes | None specific for audit; only inline action labels | `document_rejection` | Medium | Non-empty required, but no min-length and no audit-warning card shown. |
| document_replacement_request | `src/components/staff/DocumentVerificationPanel.tsx` used by `src/app/staff/applications/[id]/page.tsx` | `Please specify what is needed...` | None | Yes | No | Yes | None specific for audit; inline replacement request UI only | `document_replacement_request` | Medium | Same inconsistency pattern as document rejection. |
| manual_data_correction | Closest current behavior: OCR confirm/save in `src/app/staff/ocr/page.tsx` | None | N/A | No | No | Yes | EN: `Data saved — logged in audit trail by ...` | `manual_data_correction` | High | No dedicated correction modal; only mock save confirmation text. |
| identity_reveal | `src/app/staff/applications/[id]/page.tsx` reveal modal | `Reason (Required)` | None | Yes | Yes (`AuditWarningCard`) | Yes | EN: `This reveal will be logged in the audit trail and cannot be undone.` | `identity_reveal` | Medium | Reason required but no minimum length policy enforced. |

## Inconsistencies Observed

1. Reason minimum length is inconsistent by flow:
   - 10 (`shortlist_request`), 15 (`disclosure_rejection`), 20 (`matching_override`, `role_change`), and none (`identity_reveal`, document actions).
2. Warning-to-validation mismatch exists:
   - `disclosure_approval` shows audit/reason warning but has no reason input.
3. Config-to-UI mismatch exists:
   - `export_report` requires reason in config, but current export buttons do not collect reason.
   - `scope_change`, `sync_retry`, `manual_data_correction` have config keys but no dedicated reason-gated UI flow.
4. Audit warning component usage is inconsistent:
   - Staff/Admin modals often show warning cards; document actions do not, despite being sensitive.
5. Several sensitive flows remain mock-only:
   - override/disclosure/shortlist/document/reveal flows primarily close modal + toast without persistent backend logging in this phase.

## Source Reference Notes (Phase 2E)

- Policy key source: `src/config/sensitiveActions.ts`
- Provider shortlist flow: `src/components/provider/ShortlistRequestModal.tsx`
- Staff override/disclosure flows: `src/components/staff/MatchOverrideModal.tsx`, `src/components/staff/DisclosureApprovalModal.tsx`, `src/components/staff/DisclosureRejectionModal.tsx`
- Staff document/reveal flows: `src/components/staff/DocumentVerificationPanel.tsx`, `src/app/staff/applications/[id]/page.tsx`
- Admin role component and export flows: `src/components/admin/RoleAssignmentPanel.tsx`, `src/app/admin/export/page.tsx`, `src/app/admin/audit-log/page.tsx`
