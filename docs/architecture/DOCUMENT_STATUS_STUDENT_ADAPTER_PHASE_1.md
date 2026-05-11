# Document Status Student Adapter Phase 1

Date: 2026-05-11  
Branch: `renovation/document-status-planning`  
Scope: student `RequiredDocumentsList` display adapter only.

## Files Inspected

- `src/components/student/RequiredDocumentsList.tsx`
- `src/components/student/DocumentUploadCard.tsx`
- `src/components/student/DocumentUploadChecklist.tsx`
- `src/components/student/ApplicationReadinessCard.tsx`
- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/app/student/applications/page.tsx`
- `src/app/student/applications/[applicationId]/page.tsx`
- `src/app/student/applications/[applicationId]/documents/page.tsx`
- `src/app/student/scholarships/[scholarshipId]/page.tsx`
- `src/app/student/scholarships/[scholarshipId]/apply/page.tsx`
- `src/app/staff/applications/page.tsx`
- `src/app/staff/applications/[id]/page.tsx`
- `src/data/mock/studentApplicationData.ts`
- `src/data/mock/staffData.ts`
- `src/data/mock/applications.ts`
- `src/config/statuses.ts`

## Files Changed

- Created `src/config/documentStatusDisplay.ts`
- Updated `src/components/student/RequiredDocumentsList.tsx`

## Product Decisions Applied

- Student-facing `rejected` remains recovery-oriented:
  - EN: `Needs replacement`
  - TH: `ควรอัปโหลดใหม่`
- Staff-facing `rejected` remains operational and was not changed in this phase.
- `pending` and `verification_pending` remain separate.
  - `pending` means a general pending state or not-yet-started staff work.
  - `verification_pending` means the student has submitted the document and it is waiting for staff verification.
- `invalid_file_type` remains a UI validation/display state in this phase.
- Staff severity colors remain unchanged pending a separate staff semantic review.

## Adapter Added

Created `src/config/documentStatusDisplay.ts` with student-only helpers:

- `getStudentDocumentStatusLabel(status, lang)`
- `getStudentDocumentStatusClassName(status)`
- `requiresStudentDocumentAttention(status)`
- `isStudentDocumentStatusRecoverable(status)`

The adapter intentionally preserves the existing student display labels and Tailwind class strings instead of mapping through generic status tones. This avoids changing visual output while still centralizing the student document display metadata.

## Labels Preserved

The student labels moved from `RequiredDocumentsList` / `documentStateLabels` usage into the adapter with identical rendered output:

| Status | EN | TH |
| --- | --- | --- |
| `missing` | Ready to add | เพิ่มเอกสารได้ |
| `uploading` | Uploading | กำลังอัปโหลด |
| `uploaded` | Uploaded | อัปโหลดแล้ว |
| `invalid_file_type` | Unsupported file type | ชนิดไฟล์ไม่รองรับ |
| `verification_pending` | Verification pending | รอตรวจสอบ |
| `verified` | Verified | ตรวจสอบแล้ว |
| `rejected` | Needs replacement | ควรอัปโหลดใหม่ |
| `needs_replacement` | Replace file | ควรแทนที่ไฟล์ |

## Styles Preserved

The student badge class strings were copied exactly into the adapter:

- `missing`: role-aware blue
- `uploading`: blue upload state
- `uploaded`: role-aware blue
- `invalid_file_type`: amber validation state
- `verification_pending`: amber review-pending state
- `verified`: emerald success
- `rejected`: amber recovery state
- `needs_replacement`: amber recovery state

Icons remain local to `RequiredDocumentsList` and were not changed.

## Why Staff Was Skipped

Staff document verification has nearby decision behavior:

- verify/reject/request replacement actions
- rejection reason display
- replacement message display
- staff-specific danger and warning severity
- future audit requirements

Changing staff display in the same phase would increase risk and could accidentally alter decision semantics. Staff migration should remain a separate phase after severity and wording are approved.

## Behavior Unchanged

This phase did not change:

- document data keys
- upload logic
- upload progress display
- invalid file type validation display
- student attention logic
- application readiness logic
- routes
- auth or role guards
- exports
- disclosure behavior
- backend/API/database behavior
- staff document verification display or actions

`RequiredDocumentsList` now reads labels, badge class names, and attention status membership from the student adapter, but the rendered output and conditional behavior remain the same.

## QA Checklist

- `npm run build`
- `npm run check:tokens`
- Confirm `RequiredDocumentsList` renders the same labels in Thai and English.
- Confirm `rejected` never appears as `Rejected` to students.
- Confirm `rejected` remains `Needs replacement` / `ควรอัปโหลดใหม่` for students.
- Confirm `missing`, `invalid_file_type`, `rejected`, and `needs_replacement` still show the action button when `showActions` is enabled.
- Confirm `uploading` still shows upload progress.
- Confirm `invalid_file_type` still shows the validation guidance component.
- Smoke test student document surfaces:
  - `/student/applications`
  - `/student/applications/app_001`
  - `/student/applications/app_001/documents`
  - `/student/scholarships/sch_001`
  - `/student/scholarships/sch_001/apply`
- Confirm staff document verification remains visually and behaviorally unchanged.

## Recommended Next Step

Recommended next phase: review screenshots for student document surfaces, then plan a separate staff document status display adapter only after staff severity colors and operational wording are approved.
