# Audit Shadow Write Privacy and Failure Boundary AP-9C

**Planned on 2026-05-14.**

Branch: `architecture/audit-shadow-write-runtime-plan-ap9c`

## 1. Purpose

Define the privacy enforcement rules and failure handling boundaries that must govern every prototype shadow write in a future runtime phase. This ensures that no PII is exposed through shadow writes, that all failures are non-blocking, and that the system remains safe for Staff and Admin users at all times.

## 2. Privacy Principle

Shadow writes must enforce the **same privacy boundaries** as the existing event builder and `FORBIDDEN_AUDIT_METADATA_KEYS` rules. No data that is forbidden in the current system may be written to prototype storage. The privacy gates execute **before** the shadow write, not after.

## 3. Forbidden Data

The following data classes must **never** appear in any shadow write payload, prototype storage record, metric, or log:

| Data Class | Examples | Source |
|------------|----------|--------|
| Raw student ID | `650912345`, `S-2345` | Student records, event targetId |
| National ID / NID | Government-issued identifier | Student records |
| Email address | `user@example.com` | User profiles |
| Phone number | `+66-812-345-678` | User profiles |
| Bank account | Account numbers, routing codes | Financial records |
| Raw IP address | `192.168.1.1` | Request metadata |
| Raw uploaded file name | `สมัครเรียน_นางสาวก_1234.pdf` | File upload records |
| Raw document / file path | `/uploads/students/...` | Server file system |
| Full OCR text | Complete document text content | OCR pipeline output |
| Unredacted reason with PII | Reason containing student name + ID | Staff input |
| Uploaded file metadata that identifies a person | EXIF data, embedded names | File metadata |
| Arbitrary URL | May contain PII in query parameters | Various sources |
| Raw route parameter containing PII | URL segments with identifiers | Route params |

## 4. Safe Data

The following data classes are safe for shadow write payloads and prototype storage:

| Data Class | Examples | Notes |
|------------|----------|-------|
| Target display token | `Student #S-2345` | Privacy-masked identifier |
| Actor role | `staff`, `admin`, `provider` | Role only, not identity |
| Event type | `staff.document.reject` | Action classification |
| Document type | `transcript`, `id_card` | Classification only |
| Reason category/code | `INSUFFICIENT_DOCS`, `INVALID_FORMAT` | Coded, not free text |
| Source route name | `/staff/applications/app_001` | Route name, no query params |
| Policy version | `v1`, `v2` | Contract version |
| Severity | `info`, `low`, `medium`, `high`, `critical` | Classification |
| Persistence mode | `prototype_only` | Mode indicator |
| Timestamps | `2026-05-14T10:30:00.000Z` | Server-generated |
| Actor internal ID | App-internal UUID | Not national ID |

## 5. Privacy Gate Sequence

Before any shadow write, the following gates execute **in order**:

| Step | Gate | Action on Failure |
|------|------|------------------|
| 1 | Event builder validation — required fields present | Reject event entirely |
| 2 | Metadata sanitizer — `FORBIDDEN_AUDIT_METADATA_KEYS` check | Strip forbidden keys or reject event |
| 3 | Privacy policy guard — `AuditPolicyGuardContract.requiresAudit()` | Skip shadow write |
| 4 | Mode check — only `prototype_only` events accepted | Skip shadow write |
| 5 | Real persistence block — `real_persisted` must never reach storage | Throw error, block write |
| 6 | IP check — raw IP must not be in payload | Skip shadow write |
| 7 | Reason text check — must not contain PII | Skip shadow write |

If any gate fails, the shadow write is **skipped**. The primary `sharedMockWriter` write has already completed and is **unaffected**.

## 6. Failure Classes

| Class | Example | Severity | User Impact |
|-------|---------|----------|-------------|
| Feature flag disabled | `auditPrototypeEnabled` is `false` | Info | None — system behaves as today |
| Event type not in candidate list | Action not approved for shadow write | Info | None |
| Unsafe metadata detected | Forbidden key in event metadata | Warning | None — event rejected before write |
| Duplicate event ID | Event ID already exists in prototype storage | Warning | None — idempotent, overwrite safe |
| Prototype driver unavailable | In-memory driver internal error | Error | None — logged, UI continues |
| Shadow write failure | Unexpected error during append | Error | None — logged, UI continues |
| Unexpected persistence mode | `real_persisted` event reaches guard | Critical | None — blocked by guard |
| Privacy gate violation | PII bypasses sanitizer | Critical | None — event rejected |

## 7. Failure Behavior

### Hard Rules

1. **Never throw into the UI.** All shadow write errors are caught and logged as warnings.
2. **Never block the Staff action.** The try/catch wrapper ensures the Staff UI flow completes regardless.
3. **Never prevent the toast.** Staff feedback (toast notification) fires independently of shadow write result.
4. **Never change Admin display.** `adminAuditDisplayAdapter` is not affected by shadow writes.
5. **Never retry infinitely.** Single attempt per shadow write. No exponential backoff, no retry queue.
6. **Never send notification side effects.** No email, push notification, or webhook on shadow write failure.
7. **Never block the primary write path.** `sharedMockWriter.write()` completes before any shadow write is attempted.

### Logging Rules

- All shadow write warnings/errors are prefixed with `[AUDIT PROTOTYPE]`.
- Log content must not include any PII.
- Log level: `warn` for expected failures (flag disabled, mode mismatch), `error` for unexpected failures.
- Logs are developer-facing only, not exposed in UI.

### Metric Rules

- Metrics are aggregate counts only (no individual event data).
- Metric labels may include event type and failure reason category, but **never** PII.
- Metrics are opt-in (disabled by default via `auditPrototypeMetricsEnabled`).
- Example metrics: `shadow_write_count`, `shadow_write_success`, `shadow_write_failure`, `metadata_rejected_count`.

## 8. User-Visible Behavior

**There is no user-visible change in AP-9C.** All shadow write logic is silent and background:

- Staff sees the same toast messages as today.
- Staff UI flow is identical regardless of shadow write success or failure.
- Admin display continues reading from `adminAuditDisplayAdapter` (mock path).
- No "prototype" banner, indicator, or label appears in production UI.
- No notification or side effect is triggered by shadow writes.
- If all flags are `false` (the default), the system is **byte-for-byte identical** to current behavior.

## 9. Rollback Behavior

### Immediate Rollback

Disable any feature flag to stop its behavior immediately:

| Flag Set to `false` | Effect |
|---------------------|--------|
| `auditPrototypeEnabled` | Stops all prototype writes and reads |
| `auditPrototypeShadowWriteEnabled` | Stops shadow writes; prototype storage stops growing |
| `auditPrototypeMetricsEnabled` | Stops metric emission |

### Post-Rollback Verification

After rollback:

1. `sharedMockWriter` remains the sole write path (was never changed).
2. `adminAuditDisplayAdapter` continues reading from mock/fixture data.
3. All routes return 200 OK.
4. Full check suite passes: `npm run build` (40/40), `npm run check:audit-events` (92/92).
5. Dev log shows no new errors or warnings.

### Why Rollback Is Always Possible

- All flags default to `false`.
- `sharedMockWriter` is **never** replaced — it is always the source of truth.
- Shadow writes are additive — they do not modify existing mock data.
- Prototype storage (`InMemoryPrototypeAuditStorageDriver`) is in-memory only and resets on process exit.
- No database migrations or schema changes are involved.

## 10. QA Checklist

### Privacy

- [ ] No raw student ID in shadow write payload
- [ ] No national ID in shadow write payload
- [ ] No email in shadow write payload
- [ ] No phone number in shadow write payload
- [ ] No bank account in shadow write payload
- [ ] No raw IP in shadow write payload
- [ ] No raw file names in shadow write payload
- [ ] No full OCR text in shadow write payload
- [ ] Reason text stored separately from metadata
- [ ] Metadata allowlist enforced before shadow write
- [ ] Forbidden keys rejected (not masked or redacted)
- [ ] Unknown keys dropped with diagnostic count
- [ ] Role visibility rules respected

### Failure Handling

- [ ] Shadow write failure does not block Staff UI
- [ ] Shadow write failure does not prevent toast
- [ ] Shadow write failure is logged as warning
- [ ] No retry loop on shadow write failure
- [ ] No notification side effects on failure
- [ ] `real_persisted` mode always blocked
- [ ] Feature flag disabled = shadow write skipped
- [ ] Privacy gate failure = shadow write skipped

### Logs and Metrics

- [ ] All log messages prefixed with `[AUDIT PROTOTYPE]`
- [ ] No PII in any log message
- [ ] Metrics are aggregate counts only
- [ ] Metrics disabled by default
- [ ] Developer-safe metric labels (no PII)

### User-Visible Behavior

- [ ] No UI changes when shadow writes are enabled
- [ ] No new banners, labels, or indicators in UI
- [ ] Admin display reads from `adminAuditDisplayAdapter` only
- [ ] Staff callback signatures unchanged
- [ ] Toast behavior unchanged
- [ ] Reason validation unchanged
- [ ] Notification behavior unchanged
- [ ] No `ReasonRequiredModal` introduced
- [ ] All 92 existing checks still pass
- [ ] Route smoke tests pass (all 5 routes → 200 OK)