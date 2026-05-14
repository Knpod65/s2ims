# Audit Prototype Privacy QA AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

## Purpose

Define privacy enforcement rules that must be followed during any future prototype integration phase, ensuring PII is never exposed through shadow writes, read comparison, or any new code path.

## Forbidden Data Classes

The following data must **never** appear in prototype storage, comparison output, logs, or any diagnostic data:

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
| Unredacted reason text with PII | Reason containing student name + ID | Staff input |
| Uploaded file metadata that identifies a person | EXIF data, embedded names | File metadata |

## Safe Data Classes

The following data is safe for prototype storage and comparison:

| Data Class | Examples | Notes |
|------------|----------|-------|
| Target display token | `Student #S-2345` | Privacy-masked identifier |
| Actor role | `staff`, `admin`, `provider` | Role only, not identity |
| Event type | `staff.document.verify` | Action classification |
| Document type | `transcript`, `id_card` | Classification only |
| Reason category/code | `INSUFFICIENT_DOCS`, `INVALID_FORMAT` | Coded, not free text |
| Source route name | `/staff/applications/app_001` | Route name, no query params |
| Policy version | `v1`, `v2` | Contract version |
| Severity | `info`, `low`, `medium`, `high`, `critical` | Classification |
| Persistence mode | `mock_only`, `prototype_only` | Mode indicator |
| Timestamps | `2026-05-14T10:30:00.000Z` | Server-generated |
| Actor internal ID | App-internal UUID | Not national ID |

## Metadata Allowlist

Only the following metadata keys are allowed in prototype storage. This list is derived from `SAFE_AUDIT_METADATA_KEYS` in `auditMetadataRules.ts`.

- `documentId`
- `applicationId`
- `studentToken` (masked, e.g., `Student #S-2345`)
- `nextStatus`
- `roleBefore`
- `roleAfter`
- Any key not in this list is **rejected** before storage.

## Reason Text Rules

1. Reason text is **stored separately** from metadata in a dedicated table (`audit_reasons`).
2. The `audit_events` table stores only a `reason_id` foreign key.
3. Reason text is **not exported** in CSV/JSON unless the exporter has admin role and explicit override.
4. Reason text is **never mixed into the metadata JSON blob**.
5. During shadow writes, reason text follows the same separation rule.
6. Free-text reason content is validated upstream by Staff UI — the storage layer accepts only validated reason IDs.

## IP / Session Rules

1. Raw IP addresses are **never** stored in plain text.
2. An optional salted SHA-256 hash (`ip_hash`) may be stored for deduplication.
3. The hash salt is deployment-specific and stored separately from the database.
4. IP is never shown in any UI — not even to admin users.
5. User agent strings are **not stored** until a separate privacy review is completed.
6. During shadow writes, IP from the original event is handled by these same rules.

## Role Visibility Matrix

| Capability | Student | Staff | Provider | Executive/ESQ | Admin | System |
|------------|---------|-------|----------|---------------|-------|--------|
| View event existence | Own events only | Own + unit | None | Aggregate only | All | All |
| View target token | Own events | Own + unit | Own candidates | Aggregate only | All events | All |
| View actor identity | Masked | Own events | Role only | Role only | All | Masked |
| View reason text | Never | Own events | Never | Never | All | All |
| View metadata | Never | Sanitized only | Never | Aggregate only | Raw + sanitized | Sanitized |
| Export events | Never | Unit-limited | Never | Aggregate only | Full | Full |

## Display Presenter Safety

- `AuditDisplayPresenter` continues as the single formatting boundary.
- All display output passes through the presenter, regardless of data source.
- The presenter replaces raw IDs with display tokens.
- The presenter applies role-based label masking.
- No raw PII fields are included in `AuditDisplayRow` or `AdminAuditDisplayRow`.
- CSV export uses `CsvAuditRow` with additional redaction.

## Shadow Write Privacy Gates

Before any shadow write, the following gates execute in order:

1. **Event builder validation** — Rejects events with missing required fields.
2. **Metadata sanitizer** — Rejects events with forbidden metadata keys.
3. **Privacy policy guard** — Validates actor/target/action authorization.
4. **Mode check** — Only `prototype_only` events are accepted.
5. **IP check** — Raw IP is not included in the shadow write payload.

If any gate fails, the shadow write is skipped. The primary `sharedMockWriter` write has already completed and is unaffected.

## Read Comparison Privacy Gates

Before any read comparison, the following gates execute:

1. **Comparison is read-only** — No writes occur during comparison.
2. **Privacy-safe fields only** — Comparison queries request only allowlisted fields.
3. **No PII in output** — Comparison results exclude forbidden data classes.
4. **Role-based filtering** — Comparison respects the viewer's role visibility.
5. **Aggregate reporting** — Mismatch counts, not individual events, are surfaced in non-admin views.

## QA Checklist

- [ ] No raw student ID in prototype storage
- [ ] No raw national ID in prototype storage
- [ ] No email in prototype storage
- [ ] No phone number in prototype storage
- [ ] No bank account in prototype storage
- [ ] No raw IP in prototype storage
- [ ] No raw file names in prototype storage
- [ ] No full OCR text in prototype storage
- [ ] Reason text stored separately from metadata
- [ ] Metadata allowlist enforced before storage
- [ ] Forbidden keys rejected, not masked
- [ ] Unknown keys dropped with diagnostic count
- [ ] Role visibility matrix enforced
- [ ] Display presenter produces privacy-safe output
- [ ] Shadow write privacy gates block forbidden data
- [ ] Read comparison privacy gates block forbidden data
- [ ] No PII in diagnostic logs or metrics
- [ ] IP hash only (not raw IP) in storage
- [ ] User agent not stored until reviewed