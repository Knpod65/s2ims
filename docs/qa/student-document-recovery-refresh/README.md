# Student Document Recovery Refresh QA

Date: 2026-05-11
Branch: `design/student-document-recovery-refresh`

## Routes Reviewed

Desktop:
- `http://localhost:3000/student/applications/app_002/documents`
- `http://localhost:3000/student/applications/app_002`
- `http://localhost:3000/student/scholarships/sch_001/apply`

Mobile 375px:
- `http://localhost:3000/student/applications/app_002/documents`
- `http://localhost:3000/student/applications/app_002`
- `http://localhost:3000/student/scholarships/sch_001/apply`

Thai locale:
- `http://localhost:3000/student/applications/app_002/documents`
- `http://localhost:3000/student/applications/app_002`
- `http://localhost:3000/student/scholarships/sch_001/apply`

## Screenshots Captured

Desktop:
- `desktop/documents-page.png`
- `desktop/application-detail.png`
- `desktop/apply-page.png`

Mobile 375px:
- `mobile-375/documents-page-mobile.png`
- `mobile-375/application-detail-mobile.png`
- `mobile-375/apply-page-mobile.png`

Thai locale:
- `th-locale/documents-page-th.png`
- `th-locale/application-detail-th.png`
- `th-locale/apply-page-th.png`

Document states:
- `states/needs-action-state.png`
- `states/pending-review-state.png`
- `states/ready-state.png`
- `states/next-best-action.png`

Console capture:
- `console-review.json`

## Console Result

Passed for the reported runtime issues:
- No duplicate key warnings.
- No unsupported `use(params)` errors.
- No hydration errors.
- No runtime crashes.
- No missing route errors for the reviewed routes.

Observed acceptable dev/browser noise:
- React DevTools informational messages.
- One `404 Not Found` resource request from Chrome. Route checks confirmed the reviewed pages return `200 OK`; the 404 matches the existing missing `/favicon.ico` browser request and is unrelated to the refresh routes.

## Visual QA Result

Passed:
- The documents page now reads as a readiness and recovery flow rather than only a repeated card stack.
- `StudentReadinessPath` is visible and meaningful on the documents, application detail, and apply surfaces.
- `DocumentRecoveryPanel` clearly groups documents into needs action, pending review, and ready states.
- The next-best-action panel makes the primary action obvious.
- Existing upload buttons still appear.
- Existing document status labels are preserved.
- `invalid_file_type` remains validation-oriented.
- `verification_pending` remains pending-review oriented.
- Thai text wraps without breaking the desktop layout.
- Aurora Blue is used for progress, active path, upload affordances, and primary actions.

Student-facing wording check:
- No harsh staff-facing `Rejected` wording was introduced.
- Recovery-oriented wording remains in the student document surfaces.
- `needs_replacement` remains recovery-oriented.

Mobile result:
- Mobile remains a long page because all mock document upload controls are still shown, but it is structured by readiness, recovery group, document state, and next action. It is readable and tappable at 375px.

## Known Issues / Follow-Up

- The mobile documents page is still lengthy because this slice intentionally preserved all existing upload cards and mock upload controls.
- `DocumentUploadCard` still has its previous internal card structure to preserve behavior.
- The browser requests `/favicon.ico`, which returns 404 in the current app. This is unrelated to the student refresh.

## Merge Recommendation

Recommended for PR review. The refresh is visually verified, route checks pass, validation passes, and no blocking console/runtime issues were found.
