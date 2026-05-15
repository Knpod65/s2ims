# Audit Admin Comparison Debug Panel Stage 3 Staging Review AP-9G

## 1. Purpose

This document defines the staging-only review process for a future AP-9G Stage 3 runtime.

The review is internal, Admin-only, aggregate-only, and must not make prototype reads official.

## 2. Who May Review

Allowed reviewers:

- internal Admin reviewers
- engineers assigned to AP-9G validation
- privacy/compliance reviewers assigned to the staging review

Forbidden reviewers:

- non-admin roles
- external users
- production users
- anyone without explicit review assignment

## 3. Required Environment

Stage 3 review may occur only in staging/internal environments.

Production enablement is not allowed in Stage 3. Local development may be used for implementation validation, but the review evidence must describe staging-only behavior.

## 4. Required Feature Flags

Future Stage 3 review requires all gates to be enabled in staging only:

- Admin role gate
- AP-9F comparison feature gate
- read comparison gate
- AP-9G admin debug panel gate
- staging/internal environment gate

All flags remain false by default and must be disabled after the review.

## 5. Review Session Checklist

- Confirm environment is staging/internal.
- Confirm reviewer role is Admin.
- Confirm non-admin role has no DOM trace.
- Confirm the panel shows aggregate-only comparison status.
- Confirm no raw event rows are displayed.
- Confirm no export, CSV, download, or clipboard behavior exists.
- Confirm Admin Audit Log table behavior is unchanged.
- Confirm prototype reads are labeled diagnostic only.
- Confirm reviewer notes use aggregate language only.
- Disable flags after review.

## 6. What Reviewers May Inspect

Reviewers may inspect:

- status labels
- sourceCount
- prototypeCount
- mismatchCount
- mismatch category
- mismatch dimension
- safeMessage
- aggregate health indicators
- feature flag state labels
- last run timestamp

## 7. What Reviewers Must Not Inspect

Reviewers must not inspect:

- student names
- student IDs
- actor IDs
- target IDs
- reason text
- metadata values
- file names
- raw route params
- raw event rows
- internal event IDs
- export files
- screenshots containing PII

## 8. Reviewer Notes Format

Reviewer notes must use aggregate language only.

Allowed examples:

- "2 mismatches found in event count dimension"
- "Prototype missing one staff.document.reject event"
- "Panel remained hidden for non-admin roles"

Forbidden examples:

- student names
- student IDs
- actor IDs
- target IDs
- reason text
- metadata values
- file names
- raw route params

## 9. Evidence Capture Rules

- No screenshots containing PII.
- No screen recordings containing PII.
- No raw event rows.
- No export, CSV, or download.
- No copying mismatch tables to external docs unless aggregate-only.
- Evidence must record only counts, categories, dimensions, safe messages, and pass/fail outcomes.

## 10. Exit Criteria

Stage 3 staging review may exit only when:

- Admin-only visibility is confirmed.
- Non-admin no DOM trace is confirmed.
- Aggregate-only output is confirmed.
- No PII exposure is found.
- Admin Audit Log table, drawer, filters, and export are unchanged.
- Rollback by disabling flags is verified.
- Validation and route smoke pass.

## 11. QA Checklist

- [ ] Staging-only environment confirmed.
- [ ] Admin reviewer confirmed.
- [ ] Non-admin no DOM trace confirmed.
- [ ] No production enablement.
- [ ] No screenshots containing PII.
- [ ] No raw event rows displayed.
- [ ] No export/CSV/download.
- [ ] Reviewer notes aggregate-only.
- [ ] Admin Audit Log table unchanged.
- [ ] Flags disabled after review.
