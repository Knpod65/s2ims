# Document Status Student Upload Card Phase 2

## Files inspected
- `src/components/student/DocumentUploadCard.tsx`
- `src/config/documentStatusDisplay.ts`
- `src/components/student/DocumentUploadChecklist.tsx`
- `src/app/student/applications/[applicationId]/documents/page.tsx`

## Files changed
- `src/components/student/DocumentUploadCard.tsx`

## Adapter functions reused
- `getStudentDocumentStatusLabel`
- `getStudentDocumentStatusClassName`
- `requiresStudentDocumentAttention`

## Labels and styles preserved
- Student status badge text is still sourced from the shared student adapter.
- Status badge class names are still sourced from the shared student adapter.
- TH/EN labels for document metadata, file guidance, and action copy remain unchanged.
- The missing-state border treatment, progress indicator, invalid-file helper, and add-or-replace action remain visually the same.

## Behavior unchanged
- Upload behavior was not changed.
- Upload simulation was not changed.
- File validation behavior was not changed.
- Routes, auth, role guards, exports, disclosure, and backend behavior were not changed.
- Staff document display was not changed.
- Document data keys were not changed.

## Skipped files and why
- `src/components/student/DocumentUploadChecklist.tsx`: already only composes the upload cards; changing it would not improve the adapter migration boundary.
- `src/app/student/applications/[applicationId]/documents/page.tsx`: it only wires the checklist into the page and computes attention counts; changing it would risk unrelated readiness behavior.
- `src/config/documentStatusDisplay.ts`: already contains the shared adapter and did not need further changes.

## QA checklist
- `npm run build`
- `npm run check:tokens`
- Confirm the student upload card still renders the same document metadata, status badge, helper text, progress, invalid-file state, and action button.
- Confirm the student documents page still loads and readiness counts are unchanged.

## Recommended next step
- Review the student documents page visually to confirm the card still matches the previous rendering exactly, then proceed to the next migration slice only if the visual review stays clean.
