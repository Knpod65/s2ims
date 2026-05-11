# Staff Document Workbench Component Plan

Date: 2026-05-11
Scope: proposed components only. No runtime components were added in this planning phase.

## Component Overview

| Component | Purpose | Source To Replace Or Compose | Risk | Ownership | Screenshot QA | Reason/Audit Policy |
| --- | --- | --- | --- | --- | --- | --- |
| `StaffDocumentEvidenceWorkbench` | Top-level page workbench that coordinates evidence, context, action, and audit surfaces | Compose `src/app/staff/applications/[id]/page.tsx`, `DocumentVerificationPanel`, `MaskedStudentProfileCard`, timeline, notes, audit trail | High | Staff-only | Required desktop/mobile/Thai | Indirect |
| `EvidenceDocumentRail` | Shows document list, required status, current status, and selected document | Compose or gradually replace `DocumentVerificationPanel` document loop | Medium | Staff-only first | Required all document states | Indirect |
| `StaffDocumentStatusPanel` | Shows selected document status, file metadata, rejection/replacement/staff-note evidence | Compose expanded document details from `DocumentVerificationPanel` | Medium | Staff-only first | Required rejected/replacement/missing/verified | Indirect |
| `DocumentActionRail` | Holds verify, reject, replacement, and unsafe/disabled action states | Extract from `DocumentVerificationPanel` only after SW-1 | High | Staff-only | Required action states | Direct |
| `AuditRequirementStrip` | Makes reason and audit requirements visible near staff actions | Compose `AuditWarningCard` and `SENSITIVE_ACTION_CONFIG` copy | High | Staff/admin candidate later | Required EN/TH | Direct |
| `StaffReviewContextPanel` | Consolidates masked profile, application summary, scholarship context, timeline, match score | Compose `MaskedStudentProfileCard`, `ApplicationTimeline`, status badge | Medium | Staff-only first | Required masked profile and mobile | Indirect |
| `ReplacementReasonPanel` | Captures replacement request message and supporting guidance | Extract from replacement block in `DocumentVerificationPanel` only after SW-2 | High | Staff-only | Required empty/filled/disabled states | Direct |
| `VerificationDecisionPanel` | Shows verify/reject decision controls with evidence and reason capture | Extract verify/reject controls from `DocumentVerificationPanel` only after SW-2 | High | Staff-only | Required verify/reject/reason states | Direct |

## Component Details

### `StaffDocumentEvidenceWorkbench`

Purpose:

- Create one staff operations surface for application document review.
- Coordinate evidence, context, action, and audit views without changing behavior.

Props/data needed:

- application record
- document states
- masked profile summary
- staff notes
- audit events
- callbacks currently passed to `DocumentVerificationPanel`
- current application status and status update callback
- identity reveal callback

Source to replace or compose:

- First compose inside `src/app/staff/applications/[id]/page.tsx`.
- Do not delete `DocumentVerificationPanel` in SW-1.

Risk level:

- High, because staff page layout touches audit-sensitive review workflow.

Staff-only or shared candidate:

- Staff-only for at least the first runtime section.

Screenshot QA required:

- `/staff/applications/app_001`
- `/staff/applications/app_002`
- desktop, mobile 375px, Thai locale

Reason/audit policy involved:

- Indirectly. It hosts action panels that may involve policy.

### `EvidenceDocumentRail`

Purpose:

- Show all documents as a review queue/rail rather than hidden accordion cards.
- Make status and required evidence scannable.

Props/data needed:

- `DocumentVerificationState[]`
- selected document id
- `onSelectDocument`
- language context or localized labels from the document state

Source to replace or compose:

- The document `.map()` loop in `DocumentVerificationPanel`.

Risk level:

- Medium.

Staff-only or shared candidate:

- Staff-only first. Could later inspire provider/admin evidence rails, but not shared now.

Screenshot QA required:

- verified documents
- rejected document
- needs replacement
- missing document
- Thai labels

Reason/audit policy involved:

- Indirectly, because document status determines available actions.

### `StaffDocumentStatusPanel`

Purpose:

- Show file metadata and evidence messages for the selected document.

Props/data needed:

- selected `DocumentVerificationState`
- staff status label/color helper, initially inline or passed through existing panel
- optional mock audit events filtered by document if future data exists

Source to replace or compose:

- Expanded details inside `DocumentVerificationPanel`.

Risk level:

- Medium.

Staff-only or shared candidate:

- Staff-only.

Screenshot QA required:

- `rejected` reason
- `needs_replacement` message
- `staffNote`
- `fileName`
- `uploadedAt`

Reason/audit policy involved:

- Indirect.

### `DocumentActionRail`

Purpose:

- Keep staff decisions close to evidence and audit requirements.

Props/data needed:

- selected document
- `onVerify`
- `onReject`
- `onRequestReplacement`
- current reason/message values
- setter callbacks if state remains in parent
- action availability derived from current behavior

Source to replace or compose:

- Action block inside `DocumentVerificationPanel`.

Risk level:

- High.

Staff-only or shared candidate:

- Staff-only. Do not generalize with provider shortlist or disclosure actions yet.

Screenshot QA required:

- verify visible
- reject visible
- replacement visible
- disabled empty reason
- verified document no action
- rejected document no replacement action changes unless approved

Reason/audit policy involved:

- Direct. Rejection and replacement are sensitive actions.

### `AuditRequirementStrip`

Purpose:

- Show why a reason is required and whether an action is auditable.
- Avoid implying real audit persistence when only mock behavior exists.

Props/data needed:

- sensitive action key, for example `document_rejection` or `document_replacement_request`
- optional last action timestamp
- visual-only flag if no real audit write exists
- language

Source to replace or compose:

- Compose `AuditWarningCard`.
- Use `src/config/sensitiveActions.ts` copy where safe.

Risk level:

- High.

Staff-only or shared candidate:

- Staff-only first. Could later become shared with admin after separate review.

Screenshot QA required:

- rejection warning
- replacement warning
- no fake persisted-audit wording
- Thai text wrapping

Reason/audit policy involved:

- Direct.

### `StaffReviewContextPanel`

Purpose:

- Keep masked profile, scholarship, application status, match score, and timeline visible as context.

Props/data needed:

- application
- masked profile
- application status label
- timeline steps
- match score
- reveal identity handler

Source to replace or compose:

- `MaskedStudentProfileCard`
- timeline/sidebar card in `src/app/staff/applications/[id]/page.tsx`

Risk level:

- Medium.

Staff-only or shared candidate:

- Staff-only. Do not share with provider/admin because masking rules differ.

Screenshot QA required:

- masked profile
- reveal identity affordance
- application status
- mobile stacking

Reason/audit policy involved:

- Indirect; identity reveal remains sensitive.

### `ReplacementReasonPanel`

Purpose:

- Capture replacement request wording while keeping guidance and audit requirement visible.

Props/data needed:

- selected document
- replacement message value
- `onChange`
- `onSubmit`
- disabled state matching current behavior
- future optional minimum length when approved

Source to replace or compose:

- Replacement textarea/button block inside `DocumentVerificationPanel`.

Risk level:

- High.

Staff-only or shared candidate:

- Staff-only for now.

Screenshot QA required:

- empty state disabled
- filled state enabled
- Thai labels
- audit strip context

Reason/audit policy involved:

- Direct.

### `VerificationDecisionPanel`

Purpose:

- Put verify/reject decisions in a controlled panel attached to selected evidence.

Props/data needed:

- selected document
- reject reason value
- `onVerify`
- `onReject`
- `onReasonChange`
- current action availability

Source to replace or compose:

- Verify and reject blocks inside `DocumentVerificationPanel`.

Risk level:

- High.

Staff-only or shared candidate:

- Staff-only for now.

Screenshot QA required:

- verify path
- rejection reason path
- rejected status path
- verified status path
- Thai labels

Reason/audit policy involved:

- Direct for rejection; indirect for verify.
