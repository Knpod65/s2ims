# Audit Admin Comparison Debug Panel Stage 3 Observability AP-9G

## 1. Purpose

This document defines safe observability and diagnostics rules for a future AP-9G Stage 3 staging-only review.

## 2. Observability Goals

- Show whether comparison diagnostics are healthy.
- Support internal staging review with aggregate-only evidence.
- Help reviewers identify mismatch categories and dimensions.
- Avoid PII, raw event IDs, raw route params, reason text, and metadata values.
- Keep diagnostics developer-safe and non-user-facing.

## 3. Safe Metrics

Safe metrics may include:

- total comparison runs
- count by status
- mismatchCount
- mismatch count by category
- mismatch count by dimension
- last run timestamp
- panel render status: hidden/visible for admin only
- feature flag state labels

## 4. Forbidden Metrics

Forbidden metrics include:

- actorId
- targetId
- sourceEventId
- prototypeEventId
- reason text
- metadata values
- raw route params
- file identifiers
- any raw PII

## 5. Console / Logging Rules

Console and log output must use aggregate-only fields.

Allowed example:

```text
[AUDIT COMPARISON] status=mismatched sourceCount=12 prototypeCount=11 mismatchCount=1
[AUDIT COMPARISON] category=missing_in_prototype dimension=event_count count=1
```

Forbidden:

- event IDs
- actor or target identifiers
- reason text
- metadata values
- file identifiers
- raw route params
- PII

## 6. Health Indicators

Allowed health indicators:

- hidden
- disabled
- no data
- matched
- mismatched
- failed
- skipped

Health indicators must not include raw event details or user-identifying context.

## 7. Mismatch Summary Rules

Mismatch summaries may aggregate by:

- category
- dimension
- status
- count

Mismatch summaries must not include row-level event data or exportable details.

## 8. Reviewer Diagnostics

Reviewer diagnostics may record:

- validation command result
- route smoke status
- dev log clean/not clean
- aggregate mismatch count
- mismatch category count
- mismatch dimension count
- non-admin no DOM trace result
- rollback result

## 9. Failure Categories

Failure categories for Stage 3 review:

- privacy_failure
- unauthorized_visibility
- official_source_confusion
- export_leak
- route_regression
- build_or_check_failure
- dev_log_error
- reviewer_confusion
- rollback_failure

Failure categories are safe enum-like labels only.

## 10. QA Checklist

- [ ] Metrics are aggregate-only.
- [ ] No forbidden metrics are emitted.
- [ ] Logs use safe labels and counts only.
- [ ] Health indicators are safe enum labels.
- [ ] Mismatch summaries are category/dimension/count only.
- [ ] Reviewer diagnostics exclude PII.
- [ ] Failure categories are safe enum labels.
- [ ] No user-facing observability surface added.
