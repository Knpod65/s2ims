# Audit Admin Comparison Debug Panel Stage 3 Observability Runtime AP-9G

1. Purpose

Define safe observability rules for a future Stage 3 runtime implementation. Observability is aggregate-only and privacy-preserving.

2. Safe observability principle

Observability outputs must never include PII or raw event identifiers. Logs and console output should use only aggregate fields and safe health labels.

3. Allowed metrics

- comparisonRunCount
- status counts (matched, mismatched, failed, skipped)
- mismatchCount (aggregate)
- mismatchCount by category (aggregate)
- mismatchCount by dimension (aggregate)
- lastRunTimestamp
- panelRenderStatus for Admin only (hidden/visible)
- guardBlockedCount by gate

4. Forbidden metrics

- actorId, targetId
- sourceEventId, prototypeEventId
- raw student ID, national ID, email, phone
- raw IP, filename, OCR text
- reason text, metadata values
- raw route params

5. In-memory metrics source

- Metrics are derived from ephemeral, in-memory comparison calculations fed by mock/shared writers and prototype shadow metrics (when enabled in staging). No database persistence.

6. Console/logging rules

- Log entries must use aggregated key=value pairs and safe labels only. Example:

  [AUDIT COMPARISON] status=mismatched sourceCount=12 prototypeCount=11 mismatchCount=1

- Forbidden in logs: event IDs, actor or target identifiers, reason text, metadata values, file identifiers.

7. UI health indicators

- Allowed: hidden, disabled, no_data, matched, mismatched, failed, skipped
- Health indicators must be enum-like labels only; never include raw details.

8. Aggregation rules

- Aggregation windows and bucketing must be documented and limited to reviewer-relevant scopes. Keep aggregation coarse enough to avoid accidental re-identification.

9. Staging review metrics

- Reviewer evidence may include counts and category/dimension summaries only. No screenshots with PII.

10. Privacy checks

- Any metric or log output that contains forbidden classes triggers immediate rollback and privacy incident procedure.

11. Failure handling

- On detection of forbidden metrics, runtime must: disable flags, hide panel, clear in-memory metrics, and surface safe failure state.

12. QA checklist

- Verify logs contain only allowed metrics.
- Verify no forbidden classes appear in logs, UI, or artifacts.
- Verify aggregation buckets are coarse and documented.
- Verify panel health labels are safe enum values.
