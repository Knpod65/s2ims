# Staff Document Workbench Behavior Contract

Date: 2026-05-11
Scope: non-negotiable preservation rules for future runtime work.

## Purpose

This contract defines what a Staff Document Evidence Workbench implementation must preserve. Staff document review is high risk because it touches document status, rejection/replacement reasons, student identity masking, and audit expectations.

## Non-Negotiable Preservation Rules

Future runtime work must not:

- Change document status keys.
- Change mock data.
- Change verify callback behavior or signature.
- Change reject callback behavior or signature.
- Change request replacement callback behavior or signature.
- Change button availability unless explicitly approved.
- Change staff label wording yet unless explicitly approved.
- Change Student document wording.
- Expose additional student PII.
- Add real audit writes without a separate approved audit implementation.
- Imply audit is persisted if it is visual-only.
- Merge Student recovery wording with Staff operational wording.
- Use Student `verification_pending` in the Staff document surface.
- Use Staff `pending` in the Student document surface.
- Use red for recoverable Student states.
- Collapse `rejected` and `needs_replacement`.
- Collapse `invalid_file_type` into a staff manual rejection action.

## Status Key Contract

Staff document status keys currently used by `DocumentVerificationPanel`:

- `uploaded`
- `pending`
- `verified`
- `invalid_file_type`
- `rejected`
- `needs_replacement`
- `missing`

These must remain unchanged until a backend schema decision is approved.

## Staff Wording Contract

Staff wording remains operational:

- `rejected` -> "Rejected" / `ปฏิเสธแล้ว`
- `needs_replacement` -> "Needs Replacement" / `ต้องส่งแทน`
- `invalid_file_type` -> "Invalid File Type" / `ประเภทไฟล์ไม่ถูกต้อง`
- `missing` -> "Missing" / `ขาดหายไป`
- `pending` -> "Pending" or future approved "Pending Review"

No runtime wording migration is authorized by this planning branch.

## Student Wording Boundary

Student wording remains recovery-oriented:

- Student `rejected` remains "Needs replacement" style copy.
- Student `missing` remains invitation/action copy.
- Student `invalid_file_type` remains validation-oriented.
- Student `needs_replacement` remains recovery-oriented.

Future staff work must not import or reuse Student document label helpers for staff displays.

## Action Contract

Current action contracts:

- `onVerify(docId)`
- `onReject(docId, reason)`
- `onRequestReplacement(docId, message)`

Current availability rules:

- Verify is not shown for `verified`, `rejected`, or `needs_replacement`.
- Reject is not shown for `rejected`.
- Replacement request is not shown for `rejected`.
- Reject and replacement buttons are disabled when their text values are empty.

Future runtime layout work must preserve these rules unless a separate product/audit decision approves a behavior change.

## Reason / Audit Contract

Sensitive actions:

- `document_rejection`
- `document_replacement_request`
- `identity_reveal`

Current state:

- Reasons/messages are captured for rejection and replacement.
- No minimum length is enforced in `DocumentVerificationPanel`.
- No real audit write occurs.
- `AuditWarningCard` is not rendered for document rejection/replacement.

Planning expectation:

- Future UI may show audit requirements visually.
- Future UI must not claim a real persisted audit event has occurred unless a real audit write is implemented.
- Any minimum-length enforcement change is behavior change and needs explicit approval.

## Privacy Contract

Future work must preserve:

- masked student token default
- no additional raw student name/email/phone exposure
- reveal identity as an explicit sensitive action
- reason requirement for identity reveal
- staff-only access context

Do not generalize staff masked profile display with provider candidate display. Provider sees candidate tokens under a different privacy boundary.

## Design Contract

The workbench should:

- reduce generic card stacking
- keep evidence and action connected
- keep audit warning near sensitive actions
- keep staff operational language
- remain readable in Thai and English
- work at mobile 375px

The workbench should not:

- hide the primary review action below unrelated cards
- turn audit warnings into decorative alerts
- make role color the only staff-specific signal
- create a large visual redesign that changes behavior accidentally
