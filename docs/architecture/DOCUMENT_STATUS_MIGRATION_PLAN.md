# Document Status Migration Plan

Date: 2026-05-11  
Branch: `renovation/document-status-planning`  
Scope: planning only; no runtime migration in this phase.

## Purpose

Document statuses touch student upload guidance, staff verification, readiness counts, review actions, audit events, and reason capture. They should not be migrated with the same low-risk approach used for read-only provider display statuses until the product wording, audit expectations, and role-specific display rules are explicit.

This plan inventories current usage and defines a safe future sequence for centralizing document status display while preserving internal keys and existing behavior.

## Files Inspected

- `src/config/statuses.ts`
- `src/data/mock/studentApplicationData.ts`
- `src/data/mock/staffData.ts`
- `src/data/mock/applications.ts`
- `src/lib/types.ts`
- `src/components/student/RequiredDocumentsList.tsx`
- `src/components/student/DocumentUploadCard.tsx`
- `src/components/student/DocumentUploadChecklist.tsx`
- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/app/student/applications/page.tsx`
- `src/app/student/applications/[applicationId]/page.tsx`
- `src/app/student/applications/[applicationId]/documents/page.tsx`
- `src/app/staff/applications/page.tsx`
- `src/app/staff/applications/[id]/page.tsx`

## Current Document Status Keys

The central config currently defines these document status keys:

| Key | Current config label EN | Current config label TH | Current config tone |
| --- | --- | --- | --- |
| `missing` | Add document | เพิ่มเอกสาร | neutral |
| `pending` | Pending | รอตรวจสอบ | amber |
| `uploading` | Uploading | กำลังอัปโหลด | aurora |
| `uploaded` | Uploaded | อัปโหลดแล้ว | aurora |
| `invalid_file_type` | File type needs update | ต้องเปลี่ยนประเภทไฟล์ | amber |
| `verification_pending` | Verification pending | รอยืนยันเอกสาร | amber |
| `verified` | Verified | ยืนยันแล้ว | success |
| `rejected` | Needs replacement | ต้องส่งเอกสารใหม่ | amber |
| `needs_replacement` | Replace document | เปลี่ยนเอกสาร | amber |

Current runtime types are not fully aligned:

- `StudentDocumentState` uses `missing`, `uploading`, `uploaded`, `invalid_file_type`, `verification_pending`, `verified`, `rejected`, and `needs_replacement`.
- `DocumentVerificationState.status` uses `uploaded`, `pending`, `verified`, `invalid_file_type`, `rejected`, `needs_replacement`, and `missing`.
- Legacy `DocumentItem.status` uses `pending`, `uploaded`, `verified`, `rejected`, and `missing`.

Do not normalize these keys in the first runtime migration. The first migration should only introduce a display adapter that accepts the existing role-specific key sets.

## Where Each Status Appears

| Status key | Current usage |
| --- | --- |
| `missing` | Student document mocks, student attention counts, student upload card dashed state, required document action button, legacy application mock docs, legacy shared type, staff verification type and fallback display. |
| `pending` | Staff verification type, staff verification labels/styles, staff application document summary counts, legacy application mock type. Not currently part of `StudentDocumentState`. |
| `uploading` | Student document mocks, student upload progress display, student required document icon/style. Not currently part of staff verification state. |
| `uploaded` | Student document type, config, staff verification type, staff verification display, legacy shared type. |
| `invalid_file_type` | Student document mocks, student error copy, student attention counts, staff verification type, staff verification danger display. |
| `verification_pending` | Student document mocks, student readiness calculation, student required document display. Not currently part of staff verification state. |
| `verified` | Student document mocks, student readiness calculation, staff verification type and actions, staff application document summary counts, legacy application mock docs. |
| `rejected` | Student document mocks, student attention counts, staff verification type and rejection reason display, staff application rejected count, staff audit event type, legacy shared type. |
| `needs_replacement` | Student document mocks, student attention counts, staff verification type and replacement message display, staff audit event type. |

## Current Display Surfaces

Student-facing document display:

- `RequiredDocumentsList` owns local styles, icons, and attention logic.
- `DocumentUploadCard` adds a dashed upload card treatment when `state === 'missing'`.
- Student application pages count attention statuses with inline arrays: `missing`, `invalid_file_type`, `rejected`, `needs_replacement`.
- `documentStateLabels` in `studentApplicationData.ts` supplies student-facing labels.

Staff-facing document display:

- `DocumentVerificationPanel` owns local label, color, and icon helpers.
- Staff actions are coupled to status checks:
  - verify is hidden for `verified`, `rejected`, and `needs_replacement`
  - reject is hidden when already `rejected`
  - replacement request is hidden when already `needs_replacement`
- `DocumentVerificationPanel` displays `rejectionReason` and `replacementMessage`.
- `src/app/staff/applications/page.tsx` counts `pending`, `rejected`, and `verified` directly.

Status badge usage:

- Document statuses are mostly not using the shared `StatusBadge` component today.
- Student document badges are custom pills in `RequiredDocumentsList`.
- Staff document badges are custom pills in `DocumentVerificationPanel`.
- Application pages use status badges for application state, not document state.

## Label Recommendations

Keep internal keys stable. If labels change, they should change through role-specific display helpers rather than data migrations.

| Key | Student-facing EN | Student-facing TH | Staff-facing EN | Staff-facing TH |
| --- | --- | --- | --- | --- |
| `missing` | Ready to add | เพิ่มเอกสารได้ | Missing | ขาดหายไป |
| `pending` | Verification pending | รอตรวจสอบ | Pending | รอตรวจสอบ |
| `uploading` | Uploading | กำลังอัปโหลด | Uploading | กำลังอัปโหลด |
| `uploaded` | Uploaded | อัปโหลดแล้ว | Uploaded | อัปโหลดแล้ว |
| `invalid_file_type` | Unsupported file type | ชนิดไฟล์ไม่รองรับ | Invalid file type | ประเภทไฟล์ไม่ถูกต้อง |
| `verification_pending` | Verification pending | รอตรวจสอบ | Verification pending | รอยืนยันเอกสาร |
| `verified` | Verified | ตรวจสอบแล้ว | Verified | ยืนยันแล้ว |
| `rejected` | Needs replacement | ควรอัปโหลดใหม่ | Rejected | ปฏิเสธแล้ว |
| `needs_replacement` | Replace file | ควรแทนที่ไฟล์ | Needs replacement | ต้องส่งแทน |

Notes:

- `rejected` needs role-specific wording. Student-facing copy should remain recovery-oriented; staff-facing copy should preserve the review decision.
- `pending` and `verification_pending` need a product decision before any key normalization. They overlap semantically but are used in different runtime contexts.
- `missing` should remain supportive for students and operational for staff.

## Tone Recommendations

| Key | Student tone recommendation | Staff tone recommendation | Notes |
| --- | --- | --- | --- |
| `missing` | role-aware / action available | neutral or warning by context | Current student UI uses role-blue. Staff missing currently trends danger in the verification panel. Confirm desired staff severity before migration. |
| `pending` | amber | role-aware or amber | Staff panel currently uses role-aware blue for pending. Config currently says amber. Preserve current staff style unless product approves changing it. |
| `uploading` | info / aurora | info / aurora | Transient status; should not imply review outcome. |
| `uploaded` | role-aware / aurora | role-aware / aurora | Present but not final. |
| `invalid_file_type` | amber | danger or amber | Current student UI uses amber; current staff UI uses danger. Preserve role-specific difference until reviewed. |
| `verification_pending` | amber | amber | Student readiness treats this as present, not missing. |
| `verified` | success | success | Final for the current uploaded file. |
| `rejected` | amber | danger | Student UI should guide replacement; staff UI should show the negative review decision. |
| `needs_replacement` | amber | warning | Requires replacement but is not final. |

## Recoverable And Final Statuses

Recoverable statuses:

- `missing`
- `pending`
- `uploading`
- `uploaded`
- `invalid_file_type`
- `verification_pending`
- `rejected`
- `needs_replacement`

Final status for the current uploaded file:

- `verified`

`verified` should be treated as final only for the specific file under review. A later replacement flow may create a new document version and move the new version back into a recoverable status. Do not encode `verified` as lifecycle-final without a document version model.

## Statuses Requiring Audit Or Reason Later

Already represented staff audit event actions include:

- `document_verified`
- `document_rejected`
- `document_replacement_requested`

Recommended future audit/reason rules:

| Status transition or decision | Audit needed | Reason/message needed | Notes |
| --- | --- | --- | --- |
| staff marks `verified` | yes | optional reviewer note | Confirms acceptance of a submitted file. |
| staff marks `rejected` | yes | required rejection reason | Current staff panel already captures a reason. |
| staff marks `needs_replacement` | yes | required replacement message | Current staff panel already captures a message. |
| system marks `invalid_file_type` | yes, if persisted | no staff reason required | Could be a validation event rather than a staff decision. |
| student uploads from `missing` | useful | no | Could be an upload event, not a review event. |
| `uploading` to `uploaded` | useful | no | Transient client state should not create noisy audit unless persisted. |
| `uploaded` to `pending` or `verification_pending` | useful | no | Needs product decision on whether both keys remain. |

Do not centralize action behavior until audit and reason requirements are explicit.

## Migration Risks

- Student and staff labels intentionally differ for the same key, especially `rejected`, `missing`, and `invalid_file_type`.
- `pending` and `verification_pending` overlap semantically but are used by different types today.
- Student readiness and next-step counts use inline status arrays. Moving labels without touching logic is safe; moving recoverability logic is higher risk.
- Staff verification actions are status-gated. Display migration must not alter button availability.
- Staff rejection and replacement copy carries reason/message content. A generic status helper should not hide or rewrite those details.
- Config tone values do not exactly match current role-specific styling. A small adapter may be safer than directly applying `getStatusTone`.
- Legacy `DocumentItem.status` still exists in `src/lib/types.ts` and `src/data/mock/applications.ts`; it may be unused by current student/staff document pages but should be checked before removal or normalization.

## Recommended Safe Runtime Migration Sequence

1. Add a document-specific display adapter only.
   - Preferred location: `src/config/documentStatusDisplay.ts` or a small document section in `src/config/statusHelpers.ts`.
   - It should accept a `role` or `surface` such as `student` or `staff`.
   - It should preserve existing labels, tones, and classes exactly.
   - It should not change action gating, readiness counts, or data keys.

2. Migrate student labels and badge styles in `RequiredDocumentsList`.
   - Preserve `documentStateLabels` output or replace it with an adapter returning identical labels.
   - Preserve `STATE_STYLE`, `STATE_ICON`, upload progress, invalid file type message, and action button rules.
   - Do not change the attention statuses array in this step.

3. Migrate staff labels, badge styles, and icons in `DocumentVerificationPanel`.
   - Preserve staff-specific `rejected` and `invalid_file_type` danger styling unless product approves amber wording/tone.
   - Preserve action visibility conditions.
   - Preserve rejection reason and replacement message display.

4. Migrate display-only summary badges in `src/app/staff/applications/page.tsx`.
   - Preserve the existing counts for `pending`, `rejected`, and `verified`.
   - Do not change the status aggregation function except to use display metadata for labels/classes if needed.

5. Review whether `pending` and `verification_pending` should remain separate.
   - This should be a product/data-model decision before any type or data migration.
   - If they remain separate, document the difference clearly in config.
   - If they merge later, migrate data and tests in a dedicated phase.

6. Review legacy document mocks and shared type.
   - Confirm whether `src/data/mock/applications.ts` and `src/lib/types.ts` are still active surfaces.
   - Do not delete or normalize them during display migration unless a separate cleanup phase is approved.

## QA Checklist For Future Runtime Migration

- Run `npm run build`.
- Run `npm run check:tokens`.
- Student route smoke tests:
  - `/student/applications`
  - `/student/applications/app_001`
  - `/student/applications/app_001/documents`
- Staff route smoke tests:
  - `/staff/applications`
  - `/staff/applications/app_001`
  - `/staff/applications/app_002`
- Verify English and Thai labels for every visible document status.
- Verify student attention count still includes only `missing`, `invalid_file_type`, `rejected`, and `needs_replacement`.
- Verify student ready document count still includes `verified`, `uploaded`, and `verification_pending`.
- Verify upload progress still renders for `uploading`.
- Verify invalid file type guidance still renders for `invalid_file_type`.
- Verify staff verify/reject/request replacement buttons appear in the same states as before.
- Verify staff rejection reason and replacement message are still visible.
- Verify no provider candidate privacy surfaces expose raw student names, emails, or IDs.
- Verify no application, disclosure, export, auth, route guard, or backend behavior changed.

## Recommended Next Phase

Recommended next phase: a small runtime Phase 2M that adds a document-specific display adapter and migrates only the student `RequiredDocumentsList` display if screenshots confirm the output is identical.

Do not migrate staff verification in the same phase. Staff document review has audit and reason behavior nearby, so it should remain a separate follow-up after the student display adapter proves stable.
