# Staff Document Evidence Workbench Plan

Date: 2026-05-11
Branch: `design/staff-document-evidence-workbench-plan`
Scope: planning and design documentation only. No runtime UI, status, route, mock data, auth, upload, export, disclosure, backend, or staff verification behavior changed.

## Purpose

Plan the next S2IMS UI refresh section before touching runtime code: Staff Application Detail -> Document Evidence Workbench.

The goal is to move staff application detail away from separated generic cards and toward an operations workbench where evidence, context, actions, reasons, and audit expectations are visible together.

## Source Context

This plan builds on:

- `docs/architecture/STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`
- `docs/architecture/DRY_SYSTEM_AUDIT.md`
- `docs/architecture/DO_NOT_DRY_YET.md`
- `docs/design/UI_PATTERN_FATIGUE_AUDIT.md`
- `docs/design/S2IMS_DESIGN_REFRESH_DIRECTION.md`
- `docs/design/PATTERN_BREAKER_COMPONENT_ROADMAP.md`
- `docs/design/DO_NOT_GENERIC_UI_RULES.md`
- `docs/daily-reports/2026-05-11-s2ims-design-refresh-section-summary.md`

## Files Inspected

Staff routes and components:

- `src/app/staff/applications/[id]/page.tsx`
- `src/app/staff/applications/page.tsx`
- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/components/staff/AuditWarningCard.tsx`
- `src/components/staff/MaskedStudentProfileCard.tsx`
- `src/components/staff/DisclosureApprovalModal.tsx`
- `src/components/staff/DisclosureRejectionModal.tsx`
- `src/components/staff/MatchReviewCard.tsx`
- `src/components/staff/MatchOverrideModal.tsx`

Configs and data:

- `src/config/documentStatusDisplay.ts`
- `src/config/statuses.ts`
- `src/config/statusHelpers.ts`
- `src/config/sensitiveActions.ts`
- `src/config/privacy.ts`
- `src/data/mock/staffData.ts`
- `src/data/mock/applications.ts`
- `src/data/mock/users.ts`

Shared UI:

- `src/components/ui/index.tsx`

## Current Page Problems

`src/app/staff/applications/[id]/page.tsx` currently contains the right operational pieces, but the page model is scattered:

- Masked student profile is one card.
- Document verification is another standalone accordion panel.
- Staff notes are another card.
- Status update is another card.
- Timeline and match score are a sidebar card.
- Audit trail is another sidebar card.
- Identity reveal is handled by a modal.

This makes review work feel like moving between independent panels rather than completing a controlled operational task.

## Current Layout Fatigue

Observed fatigue patterns:

- Three-column generic card layout rather than a staff workbench.
- Accordions hide evidence and action context inside each document.
- Notes, status, audit history, and document decisions are visually separated.
- The page relies on multiple card blocks rather than one coherent evidence flow.
- The sidebar is passive context instead of a decision support column.
- The action controls live inside expanded document panels, so staff must open the item before seeing what actions are available.

## Current Governance / Audit Risks

Planning risks from `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` and current code:

- Document rejection reason has no minimum length.
- Replacement request message has no minimum length.
- `AuditWarningCard` is imported in `DocumentVerificationPanel` but not rendered.
- Rejection and replacement are medium-risk sensitive actions in `src/config/sensitiveActions.ts`.
- Staff document actions currently show toast messages but do not write real audit events.
- Application detail shows mock audit events, but document actions do not create persisted audit records.
- Identity reveal has reason capture, but it is modal-separated from the rest of the workbench.
- Staff sees operational status wording and must not inherit Student recovery wording.

This plan does not authorize fixing those behavior gaps. It defines where they should appear visually before runtime implementation.

## Current Document Status Behavior

`DocumentVerificationPanel` owns an inline staff status system:

- `uploaded`
- `pending`
- `verified`
- `invalid_file_type`
- `rejected`
- `needs_replacement`
- `missing`

Current inline behavior:

- `verified` uses success tone.
- `pending` and `uploaded` use role tint.
- `rejected`, `invalid_file_type`, and `missing` use danger tone.
- `needs_replacement` uses warning tone.
- Verify is available when a document is not verified and not already rejected/replacement.
- Reject is available when the document is not already rejected.
- Request replacement is available when the document is not rejected.
- Reject and replacement buttons are disabled only when the text field is empty.

## Behavior That Must Be Preserved

The first runtime phase must preserve:

- Document status keys.
- Mock data shape and values.
- Verify callback contract: `onVerify(docId)`.
- Reject callback contract: `onReject(docId, reason)`.
- Replacement callback contract: `onRequestReplacement(docId, message)`.
- Existing button availability.
- Existing staff status labels unless separately approved.
- Existing student-facing document wording.
- Existing identity reveal route and modal behavior.
- Existing application status update behavior.
- Existing staff notes behavior.
- Existing mock audit display behavior.

## Proposed Workbench Structure

### A. Evidence Column

Purpose: make document evidence and document state the primary work surface.

Contains:

- document list
- status
- uploaded file metadata
- required indicator
- rejection reason
- replacement message
- staff note
- evidence history if available

Design intent:

- Replace isolated accordions with an evidence rail/workbench.
- Keep status and supporting evidence visible before the action.
- Use operational staff language.
- Preserve current document card internals in the first runtime phase if needed.

### B. Review Context Column

Purpose: keep staff review context visible without making it another sidebar pile.

Contains:

- masked student profile
- application summary
- scholarship context
- eligibility/application status
- match score
- sensitive exposure indicators
- timeline/status context

Design intent:

- Make identity masking and scholarship context persistent.
- Keep reveal identity as clearly sensitive, not a routine button.
- Avoid exposing additional student PII.

### C. Action Rail

Purpose: attach decisions to evidence and audit requirements.

Contains:

- verify document
- reject document
- request replacement
- reveal identity if allowed
- reason/audit requirements
- disabled states when action is unsafe

Design intent:

- Keep one active document decision visible.
- Show reason requirement before staff submits sensitive action.
- Preserve callbacks and button availability until behavior changes are explicitly approved.

### D. Audit Strip

Purpose: make governance visible without pretending real audit persistence exists.

Contains:

- sensitive action warning
- reason requirement indicator
- last action timestamp from existing mock data when available
- "audit event will be recorded" copy only if matching current behavior
- "mock audit context" copy when no real write exists

Design intent:

- Keep audit expectations near action controls.
- Avoid fake certainty about persistence.
- Do not imply real audit writes have been implemented.

## Proposed Page Shape

Recommended desktop structure:

```text
PageHeader
└── StaffDocumentEvidenceWorkbench
    ├── Evidence Column
    │   ├── EvidenceDocumentRail
    │   └── StaffDocumentStatusPanel
    ├── Review Context Column
    │   ├── StaffReviewContextPanel
    │   └── MaskedStudentProfileCard composition
    ├── Action Rail
    │   ├── VerificationDecisionPanel
    │   ├── ReplacementReasonPanel
    │   └── DocumentActionRail
    └── Audit Strip
        └── AuditRequirementStrip
```

Recommended mobile structure:

```text
PageHeader
Review Context Summary
EvidenceDocumentRail
Selected Document Details
DocumentActionRail
AuditRequirementStrip
Timeline / Notes / Audit History
```

## Proposed Component Breakdown

Initial runtime components should compose existing behavior instead of rewriting it:

- `StaffDocumentEvidenceWorkbench`
- `EvidenceDocumentRail`
- `StaffDocumentStatusPanel`
- `DocumentActionRail`
- `AuditRequirementStrip`
- `StaffReviewContextPanel`
- `ReplacementReasonPanel`
- `VerificationDecisionPanel`

The first implementation should not extract all at once. See `STAFF_DOCUMENT_WORKBENCH_IMPLEMENTATION_SEQUENCE.md`.

## What Should Remain Staff-Specific

Keep staff-specific:

- staff document labels
- staff document status tone
- document rejection wording
- replacement request wording
- identity reveal warning
- staff reason requirements
- staff action availability
- staff audit framing
- masked profile exposure rules

## What Can Become Shared Later

Possible future shared primitives:

- non-copy-specific workbench shell
- token display styling
- reason field with configurable policy
- audit warning wrapper
- status badge primitive
- document metadata row

These should only be shared after staff runtime behavior is stable and privacy semantics are proven.

## What Must Not Be DRY'd Yet

Do not DRY yet:

- Student `rejected` label with Staff `rejected` label.
- Student `missing` label with Staff `missing` label.
- Student `verification_pending` with Staff `pending`.
- Staff document actions with provider shortlist or disclosure actions.
- Identity reveal with ordinary modal patterns.
- Audit trail display with real audit write utilities.
- Admin raw evidence components with staff masked evidence components.

## Planning Conclusion

The next runtime slice should begin with a layout-only workbench shell around the existing `DocumentVerificationPanel`, plus a visible but non-persistent audit requirement strip. Action extraction and staff status adapter work should wait until screenshot QA confirms the workbench model and product approves any reason/audit behavior changes.
