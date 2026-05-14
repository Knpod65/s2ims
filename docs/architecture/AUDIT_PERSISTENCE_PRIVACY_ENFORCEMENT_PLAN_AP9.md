# Audit Persistence Privacy Enforcement Plan AP-9

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-persistence-plan-ap9`

## Purpose

Define the privacy enforcement layers that must be in place before any audit event data is persisted beyond the current in-memory mock writer. This plan ensures PII is never stored in persistence records, metadata is sanitized before write, and access control is enforced at every layer.

This is a **documentation-only** phase. No runtime code is created or modified.

## Enforcement Layers

Privacy enforcement follows a defense-in-depth model. No single layer is solely responsible for PII protection.

### Layer 1: DTO / FormRequest-like Validation

- Input validation occurs before event construction.
- Fields are type-checked against `BuildAuditEventInput` and `StaffDocumentAuditInput` contracts.
- Rejects unexpected fields, wrong types, and missing required fields.
- Maps directly to Laravel `FormRequest` validation in future backend.

### Layer 2: Event Builder Safety

- `auditEventBuilder.ts` constructs `AuditEvent` from validated input.
- The builder applies default values, generates deterministic IDs, and enforces type constraints.
- No raw PII should enter the builder — caller must tokenize before calling.

### Layer 3: Metadata Sanitizer

- `AuditMetadataSanitizerContract` (planned interface) sanitizes every metadata key-value pair.
- Uses `FORBIDDEN_AUDIT_METADATA_KEYS` allowlist from `auditMetadataRules.ts`.
- Forbidden keys are rejected, not masked or redacted — they never reach storage.
- Unknown keys (not in `SAFE_AUDIT_METADATA_KEYS`) are removed with a diagnostic warning count.
- Nested objects are inspected recursively.
- Sanitizer output is the only data that reaches the persistence layer.

### Layer 4: Policy / Privacy Guard

- `AuditPolicyGuardContract` evaluates whether the actor, action, and target combination is authorized.
- Checks role-based visibility, target privacy level, and action sensitivity.
- Prevents writes that bypass role restrictions.
- Enforces `targetPrivacyLevel` classification before persistence.

### Layer 5: Repository Write Gate

- The repository is the last checkpoint before storage.
- Validates that the event has passed through sanitizer and policy.
- Rejects events with `persistenceMode` not matching the configured write mode.
- Ensures deduplication via deterministic event ID check.

### Layer 6: Storage Driver Input Contract

- The storage driver interface (`AuditStorageDriver`) receives only `AuditStorageWriteInput`.
- This input type contains no raw PII fields — only hashed, tokenized, or sanitized values.
- The driver cannot add arbitrary fields; it stores exactly what it receives.

### Layer 7: Presenter / Resource Display Filter

- Even if data somehow reaches storage with unexpected content, the presenter filters output.
- `AuditDisplayPresenter` produces `AuditDisplayRow` with privacy-safe labels.
- Sensitive fields (`targetId`, `actorId`) are replaced with display tokens.
- Export paths (`CsvAuditRow`) apply additional redaction rules.

### Layer 8: Export Policy

- CSV/JSON export applies role-based field filtering.
- Reason text is redacted by default in exports for non-admin roles.
- Export logs record who exported, when, and how many rows.
- Export is disabled entirely in `prototype_only` mode.

## Forbidden Persistence Fields

The following fields must **never** appear in any stored record:

| Field | Why |
|-------|-----|
| Raw student ID | Direct identifier — use `studentToken` (`Student #S-XXXX`) |
| National ID / NID | Government identifier — highest PII category |
| Email address | Personal contact information |
| Phone number | Personal contact information |
| Bank account | Financial data — strict regulatory requirement |
| Raw full name (unless approved) | PII — use role display name or token |
| Raw uploaded file name | May contain personal info in filename |
| Raw file path | Server structure exposure |
| Raw IP address | Direct identifier — store only salted hash |
| Full OCR text | Document content may contain PII |
| Unstructured metadata blob | Must be broken into allowlisted fields |
| Reason text mixed into metadata | Reason stored separately with independent access control |

## Safe Persistence Fields

| Field | Storage Column | Notes |
|-------|---------------|-------|
| Event ID | `id` | Deterministic UUID v4 |
| Event type | `event_type` | Enum from `AuditEventType` |
| Actor role | `actor_role` | Enum from `AuditActorRole` |
| Actor internal ID | `actor_id` | App-internal, not national ID |
| Target display token | `target_display_token` | Privacy-masked, e.g., "Student #S-2345" |
| Target type | `target_type` | Enum from `AuditTargetType` |
| Target privacy level | `target_privacy_level` | Enum from `AuditPrivacyLevel` |
| Severity | `severity` | Enum from `AuditSeverity` |
| Source route | `source_route` | Route name only, no query params |
| Policy version | `policy_version` | Contract version at write time |
| Persistence mode | `persistence_mode` | Enum: `mock_only`, `prototype_only`, `real_persisted` |
| Metadata reference ID | `metadata_id` | FK to separate metadata table (sanitized copy) |
| Reason reference ID | `reason_id` | FK to separate reason table (access-controlled) |
| Created at | `created_at` | Server-side timestamp (not client-provided) |
| IP hash | `ip_hash` | SHA-256 of IP, salted per deployment |

## Reason Text Handling

- Reason text is stored in a **separate table** (`audit_reasons`) with its own access control.
- The `audit_events` table stores only a `reason_id` foreign key — never the raw text.
- Reason text is **not** exported in CSV unless the exporter has `admin` role and explicit override.
- Retention policy for reasons may differ from event retention (configurable per policy version).
- Reason text is never mixed into the metadata JSON blob.

## Metadata Handling

- All metadata passes through the sanitizer before persistence.
- The sanitizer uses an **allowlist** approach: only `SAFE_AUDIT_METADATA_KEYS` are permitted.
- Forbidden keys (`FORBIDDEN_AUDIT_METADATA_KEYS`) are rejected with an error.
- Unknown keys (not in either list) are **dropped**, and the drop count is recorded in diagnostics.
- The dropped key count is logged but the key names and values are not stored.
- Nested objects are flattened and inspected at each level.
- The raw (unsanitized) metadata may be stored in a separate restricted column (`metadata_json`) accessible only to admin roles, per the AP-8B schema plan.

## IP / Session Handling

- Raw IP addresses are **never** stored in plain text.
- An optional salted SHA-256 hash (`ip_hash`) may be stored for deduplication and abuse detection.
- The hash salt is deployment-specific and not stored in the database.
- IP is never shown in the UI — not even to admin users.
- User agent strings are not stored until a separate privacy review is completed.

## Role Matrix

| Capability | Student | Staff | Provider | Executive/ESQ | Admin | System |
|------------|---------|-------|----------|---------------|-------|--------|
| View event existence | Own events only | Own + unit | None | Aggregate only | All | All |
| View target token | Own events | Own + unit | Own candidates | Aggregate only | All events | All |
| View actor identity | Masked | Own events | Role only | Role only | All | Masked |
| View reason text | Never | Own events | Never | Never | All | All |
| View metadata | Never | Sanitized only | Never | Aggregate only | Raw + sanitized | Sanitized |
| Export events | Never | Unit-limited | Never | Aggregate only | Full | Full |

## Laravel / PHP Mapping

| TypeScript Contract | Laravel / PHP Equivalent |
|---------------------|--------------------------|
| `AuditMetadataSanitizerContract` | `App\Services\Audit\AuditMetadataSanitizer` |
| `AuditPolicyGuardContract` | `App\Policies\AuditPolicy` |
| `StoreAuditEventRequest` (FormRequest) | `App\Http\Requests\StoreAuditEventRequest` |
| `AuditEventData` (DTO) | `App\Data\AuditEventData` |
| `AuditEventResource` (presenter) | `App\Http\Resources\AuditEventResource` |
| `AuditExportPolicy` | `App\Policies\AuditExportPolicy` |
| `AuditReason` model | `App\Models\AuditReason` |
| `AuditMetadataBlob` model | `App\Models\AuditMetadataBlob` |

## Non-Goals

- ❌ No runtime implementation of sanitizer or policy.
- ❌ No backend API endpoint.
- ❌ No database migration.
- ❌ No changes to Staff workflow.
- ❌ No changes to reason validation.
- ❌ No ReasonRequiredModal.
- ❌ No notification behavior changes.
- ❌ No changes to existing mock writer.