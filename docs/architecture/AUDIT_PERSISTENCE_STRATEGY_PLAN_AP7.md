# Audit Persistence Strategy Plan — AP-7

Date: 2026-05-13
Branch: `architecture/audit-persistence-strategy-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

AP-7 defines the strategy for transitioning from the current `mock_only` in-memory audit system
to future real audit persistence. It establishes the architectural boundaries, migration stages,
DRY principles, and Laravel/PHP-inspired service contracts that must be agreed before any
backend persistence is implemented.

This plan does not implement persistence. It does not change runtime behavior.

---

## Current Mock-Only State (Post AP-6D)

### What exists

| Module | Location | Role |
|--------|----------|------|
| `AuditEvent` type | `src/lib/audit/auditTypes.ts` | Core DTO — stable contract |
| `BuildAuditEventInput` | `src/lib/audit/auditTypes.ts` | Builder input DTO |
| `StaffDocumentAuditInput` | `src/lib/audit/auditTypes.ts` | Typed staff-document input |
| `buildAuditEvent` | `src/lib/audit/auditEventBuilder.ts` | DTO factory — validates + constructs |
| Builder helpers | `src/lib/audit/auditEventBuilder.ts` | `buildStaffDocumentRejectEvent`, etc. |
| `createMockAuditWriter` | `src/lib/audit/mockAuditWriter.ts` | In-memory writer — accepts `mock_only` only |
| `sharedMockAuditWriter` | `src/lib/audit/sharedMockWriter.ts` | Session singleton — resets on page reload |
| `adminAuditDisplayAdapter` | `src/lib/audit/adminAuditDisplayAdapter.ts` | Presenter — fixture + demo + live rows |
| `validateAuditMetadata` | `src/lib/audit/auditMetadataRules.ts` | Privacy/allowlist guard |
| `check-audit-events.mjs` | `scripts/check-audit-events.mjs` | Contract tests — 42 checks |

### What is wired (mock-only)

| Action | Builder | Writer | Persistence |
|--------|---------|--------|-------------|
| Staff document reject | `buildStaffDocumentRejectEvent` | `sharedMockAuditWriter` | In-memory only |
| Staff document replacement request | `buildStaffDocumentReplacementRequestEvent` | `sharedMockAuditWriter` | In-memory only |
| Staff document verify | toast only | None | None |
| All other actions | None | None | None |

### Known gaps before AP-8

- Writer is session-scoped — resets on page reload.
- Actor identity is prototype placeholder (`staff_demo_session`).
- `AuditWarningCard` copy is Stage 0 — still says "real audit-log persistence is not connected yet."
- Reason min-length not enforced (non-empty only).
- Admin display reads from shared in-memory writer — cannot survive navigation or reload.
- No server-side timestamp authority.
- No append-only guarantee.
- No role-scoped audit view enforcement.
- No export/review workflow.

---

## Target Future Persistence State

### What real persistence must deliver

| Capability | Requirement |
|-----------|-------------|
| Append-only storage | Audit events must not be silently mutated after write |
| Server-side timestamp | `createdAt` must be set by the server — not the client |
| Real actor identity | `actorId` from authenticated session — not placeholder |
| Durable across sessions | Events survive page reloads, logouts, and server restarts |
| Role-scoped read | Admin can read full events; provider cannot see staff metadata |
| Allowlisted metadata | Forbidden keys rejected at write time — not just UI side |
| Immutable event contract | `AuditEvent` shape is stable before persistence is wired |
| Policy version stamped | `policyVersion` traces which contract governed the event |
| Exportable | Events can be queried, filtered, and exported for authorized review |

### What must change at AP-8 and beyond

| Item | Current | After real persistence |
|------|---------|----------------------|
| `persistenceMode` on events | `mock_only` | `real_persisted` |
| Actor identity | `staff_demo_session` (placeholder) | Real authenticated `actorId` |
| `createdAt` authority | Client `new Date().toISOString()` | Server-set timestamp |
| Storage | `sharedMockAuditWriter` (in-memory) | Backend DB / API endpoint |
| Admin display source | In-memory + fixture | API + real DB rows |
| `AuditWarningCard` copy | Stage 0 | Stage 2 (after persistence confirmed) |
| Reason min-length | Non-empty only | Enforced per event type (SW-3B/SD-3) |

---

## Why Real Persistence Must Be Planned Before Implementation

1. **Actor identity requires backend auth.** The current placeholder `actorId` cannot be used for
   official audit records. A session/token context must be threaded from the auth layer into
   every audit write call.

2. **Server-side timestamps prevent tampering.** Client-supplied `createdAt` can be faked.
   Real audit events must have a server-side timestamp authority.

3. **Append-only design requires database schema planning.** An append-only audit table has
   specific indexing, partitioning, retention, and redaction design needs. These cannot be bolted
   on after the schema is in production.

4. **Copy stage rules must change atomically with persistence.** The `AuditWarningCard` copy
   can only upgrade from Stage 0 to Stage 2 once persistence is confirmed. Changing copy
   before persistence creates false governance claims.

5. **Reason min-length enforcement should not race persistence.** SW-3B must not enforce
   20-character minimums before audit records actually persist — users should not be forced to
   write longer reasons for a system that cannot record them yet.

6. **Admin audit display will need an API.** The current `getAdminAuditDisplayRows` function
   reads from in-memory state. With real persistence, it must read from an authenticated API.
   The display adapter shape is ready; the data source must be replaced cleanly.

7. **PDPA/privacy compliance requires write-time validation.** Forbidden metadata keys must
   be rejected at the server boundary, not just in the client builder. The `auditMetadataRules`
   contract must be enforced server-side before AP-7 can claim real compliance.

---

## Staged Migration Approach

See `AUDIT_PERSISTENCE_MIGRATION_SEQUENCE_AP7.md` for full stage-by-stage rollback plans.

| Stage | Label | Gate |
|-------|-------|------|
| Stage 0 | Mock-only (current) | Completed — AP-6D runtime |
| Stage 1 | Contract + tests | AP-7 planning → AP-8 contract tests |
| Stage 2 | Repository abstraction | AP-8 runtime |
| Stage 3 | DB schema planning | AP-8 / AP-9 |
| Stage 4 | Write-through shadow mode | AP-9 |
| Stage 5 | Real persisted display | AP-9 / AP-10 |
| Stage 6 | Copy upgrade | After Stage 5 confirmed |
| Stage 7 | Reason validation + modal | After Stage 5 + product approval |

---

## Laravel/PHP-Inspired Architecture Map

See `AUDIT_PERSISTENCE_LARAVEL_ARCHITECTURE_MAP.md` for the full mapping.

### Summary

| Current TypeScript | Laravel/PHP concept |
|-------------------|-------------------|
| `page.tsx` callback | Controller action |
| `StaffDocumentAuditInput` | FormRequest / DTO |
| `buildStaffDocumentRejectEvent` | Action class input builder |
| `AuditEvent` | Eloquent model shape / Resource |
| `MockAuditWriter` interface | Repository interface |
| `sharedMockAuditWriter` | In-memory repository (test/mock) |
| `validateAuditMetadata` | Policy / Privacy guard |
| `getAdminAuditDisplayRows` | Resource/Presenter |
| `check-audit-events.mjs` | Feature/integration test |
| future API route | Controller + Route |
| future DB table | Migration + Eloquent Model |

---

## DRY Boundaries

| DRY Rule | Current status | Future requirement |
|----------|---------------|-------------------|
| Single event construction site per action type | Builder helpers centralize construction — ✓ | Keep builders; do not allow UI components to build events inline |
| Single writer interface per persistence mode | `MockAuditWriter` interface is the contract — ✓ | Add `PersistentAuditWriter` implementing same interface |
| Single metadata validation path | `validateAuditMetadata` called only inside `buildAuditEvent` — ✓ | Also validate server-side before DB write |
| Single display normalization | `getAdminAuditDisplayRows` / `writerEventToRow` — ✓ | Extend adapter to accept API response shape; do not duplicate mapping |
| Single copy stage decision | `AuditCopyStageGuide.md` + `AuditWarningCard` — ✓ | Copy stage must change globally, not per-component |
| Single reason validation path | Scattered (non-empty in `buildAuditEvent`, min-length in builders) | SW-3B must unify reason validation config before modal |

### Anti-patterns to avoid in AP-8+

- Rebuilding `AuditEvent` from raw form state inside UI components.
- Duplicating `validateAuditMetadata` logic in API routes.
- Hardcoding reason min-lengths in multiple UI components.
- Bypassing the builder to write directly to any writer.
- Mixing display logic and persistence logic in the same module.

---

## Risk Analysis

### High risks

| Risk | Description | Mitigation |
|------|-------------|-----------|
| Client-supplied `createdAt` | Client clock can be set to any value | Server must set timestamp; reject client-provided timestamp |
| Prototype actor `staff_demo_session` used in production | Placeholder identity is not auditable | Block events with placeholder actorId at server boundary |
| Metadata PII leak | `FORBIDDEN_AUDIT_METADATA_KEYS` enforced only client-side | Duplicate validation server-side before DB write |
| Copy stage mismatch | Stage 0 copy while Stage 2 behavior exists (or vice versa) | Copy stage upgrade must be gated on persistence confirmation |
| Session reset losing events | Shared writer resets on reload — admin may miss events | Must not rely on in-memory writer for any compliance claim |
| Admin display reads stale data | In-memory adapter does not survive navigation | Replace data source with API before making persistence claims |

### Medium risks

| Risk | Description | Mitigation |
|------|-------------|-----------|
| Reason min-length too short in production | Non-empty only is too weak for compliance | Enforce at AP-7/AP-8 after persistence is confirmed |
| Multiple writers coexisting | Mock and persistent writer both active during migration | Repository abstraction must ensure only one writer is active per event |
| Event ID collision | `stableId()` is deterministic but not globally unique | Server-generated UUID replaces client ID in real persistence |
| Admin display mixing mock and real rows | Confusing to reviewers | Badge/filter must clearly separate `mock_only` from `real_persisted` |

### Low risks

| Risk | Description | Mitigation |
|------|-------------|-----------|
| `DEMO_WRITER_EVENTS` still visible after real persistence | Static demo rows appear alongside real rows | Remove or suppress `DEMO_WRITER_EVENTS` when `real_persisted` rows exist |
| Check script covers only mock path | `check-audit-events.mjs` does not test real persistence path | Add persistence-aware checks in AP-8 |

---

## What Must Not Change Until AP-8 Is Approved

| Item | Reason |
|------|--------|
| `AuditEvent` type shape | Core contract — breaking changes require version bump |
| `auditEventBuilder.ts` | Core DTO factory — must not be modified for AP-7 planning |
| `mockAuditWriter.ts` | Writer implementation — must remain in place for mock path |
| `sharedMockWriter.ts` | Session singleton — do not add persistence in place |
| `AuditWarningCard` copy | Stage 0 → Stage 2 upgrade requires persistence confirmation |
| `src/data/mock/audit-logs.ts` | Mock fixture — must never be mutated |
| Reason validation min-length | Deferred to SW-3B/SD-3 after persistence |
| `ReasonRequiredModal` | Deferred to SD-3 after persistence and copy upgrade |
| Staff verify action wiring | Deferred to AP-6E |
| Provider/Student/ESQ flows | Not in AP-7 scope |

---

## Recommended AP-8 Next Step

AP-8 should be split into two sequential sub-phases:

**AP-8A — Repository/Service Contract** (planning + tests)

- Define `AuditWriterInterface` that both `MockAuditWriter` and `PersistentAuditWriter` implement.
- Define `AuditRepository` abstraction.
- Add contract tests for the interface boundary.
- Do not implement the persistent writer yet.

**AP-8B — Schema and API Design**

- Plan the database table schema for audit events.
- Plan the API endpoint contract (POST `/api/audit-events`).
- Plan the Admin read API (`GET /api/audit-events` with filters).
- Map to FormRequest/Policy/Resource equivalents.
- Do not implement the DB migration or API route yet.

Do not start AP-8A or AP-8B without explicit approval.
Do not add real persistence in AP-8A.
Do not change reason validation before AP-8B is confirmed.
