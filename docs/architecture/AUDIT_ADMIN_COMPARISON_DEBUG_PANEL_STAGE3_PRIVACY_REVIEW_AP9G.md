# Audit Admin Comparison Debug Panel Stage 3 Privacy Review AP-9G

## 1. Purpose

This document defines the privacy review requirements for future AP-9G Stage 3 staging-only review.

## 2. Privacy Review Objective

The objective is to confirm that the debug panel, logs, screenshots, reviewer notes, and supporting documentation expose only safe aggregate comparison data.

Prototype reads remain diagnostic only and must not become official audit evidence.

## 3. Forbidden Data Classes

The following must never be displayed, logged, exported, copied, screenshot, or written into reviewer notes:

- actorId
- targetId
- raw student ID
- national ID
- email
- phone
- bank account
- raw IP
- file name
- file path
- OCR text
- reason text
- metadata values
- raw route params
- sourceEventId
- prototypeEventId
- uploaded document identifiers
- unmasked names

## 4. Allowed Display Classes

The following may be displayed when aggregate-only and reviewed:

- status
- sourceCount
- prototypeCount
- mismatchCount
- mismatch category
- mismatch dimension
- safeMessage
- masked token only if already approved
- createdAt timestamp
- aggregate health indicator
- feature flag state labels

## 5. Mismatch Table Privacy Rules

If a future Stage 3 runtime displays mismatch summaries, the table may show only:

- mismatch category
- mismatch dimension
- safeMessage
- aggregate counts
- approved masked token only when already safe

It must not show raw event identifiers, actor identifiers, target identifiers, reason text, metadata values, file identifiers, route params, or unmasked names.

## 6. Screenshot / Screen Recording Rules

- Screenshots must not contain PII.
- Screen recordings must not contain PII.
- Browser devtools panels must not be captured if they include raw event data.
- Evidence screenshots must be cropped to aggregate status where possible.
- If any PII is captured, delete the artifact and trigger privacy rollback review.

## 7. Logs and Console Rules

Logs and console output may include:

- status
- sourceCount
- prototypeCount
- mismatchCount
- mismatch category
- mismatch dimension
- safeMessage
- feature flag state labels

Logs and console output must not include forbidden data classes.

## 8. Reviewer Notes Rules

Reviewer notes must use aggregate-only wording.

Allowed:

- "Mismatch count was 2"
- "Category missing_in_prototype appeared once"
- "Non-admin role had no DOM trace"

Forbidden:

- raw IDs
- names
- emails
- reason text
- metadata values
- document identifiers
- route params

## 9. Privacy Failure Conditions

Privacy review fails if:

- any forbidden data class appears in the panel
- any forbidden data class appears in logs
- any forbidden data class appears in screenshots or recordings
- reviewer notes include PII
- prototype data is presented as official audit evidence
- comparison rows can be exported
- non-admin users can inspect comparison output

## 10. Privacy Rollback Trigger

Any privacy failure triggers immediate rollback:

- disable all AP-9G debug flags
- disable read comparison flags
- confirm panel hidden
- preserve incident evidence securely if required
- delete accidental PII artifacts when policy permits
- document incident with aggregate-only language

## 11. QA Checklist

- [ ] Forbidden data classes absent from UI.
- [ ] Forbidden data classes absent from logs.
- [ ] Forbidden data classes absent from screenshots and recordings.
- [ ] Reviewer notes aggregate-only.
- [ ] No raw event identifiers displayed.
- [ ] No reason text displayed.
- [ ] No metadata values displayed.
- [ ] No export or clipboard path.
- [ ] Non-admin no DOM trace confirmed.
- [ ] Privacy rollback trigger documented.
