# Audit Prototype Persistence Plan AP-9

**Planned on 2026-05-14.**

Branch:

`architecture/audit-prototype-persistence-plan-ap9`

## Overview

AP-9 plans the first safe transition from the current mock-only/in-memory audit event system toward prototype persistence. This is a **documentation-only** phase — no runtime code is created or modified, no database migrations are executed, and no backend/API behavior is added.

AP-9 defines the architecture, contracts, rollout strategy, and safety gates for a future AP-9A runtime implementation phase.

## Current Audit State (Post AP-8C)

| Component | Current Implementation | Status |
|-----------|----------------------|--------|
| AuditEvent type | `src/lib/audit/auditTypes.ts` | Stable contract |
| Event builder | `src/lib/audit/auditEventBuilder.ts` | Validates + constructs |
| Metadata guard | `src/lib/audit/auditMetadataRules.ts` | Client-side only |
| Shared mock writer | `src/lib/audit/sharedMockWriter.ts` | In-memory, session-scoped |
| Mock writer | `src/lib/audit/mockAuditWriter.ts` | Accepts `mock_only` only |
| Display adapter | `src/lib/audit/adminAuditDisplayAdapter.ts` | Composes fixture + writer rows |
| Presenter | `src/lib/audit/presenters/auditDisplayPresenter.ts` | Single formatting boundary |
| Admin page | `src/app/admin/audit-log/page.tsx` | Uses presenter output |
| Drawer | `src/components/admin/AdminAuditEventDetailDrawer.tsx` | Uses presenter fields |
| Contracts | `src/lib/audit/contracts/auditContracts.ts` | All interfaces defined |
| Service | `src/lib/audit/services/auditService.ts` | Skeleton exists (AP-8A) |
| Repository | `src/lib/audit/repositories/inMemoryAuditRepository.ts` | In-memory only |
| Policy | `src/lib/audit/policies/auditPolicy.ts` | Client-side guard |
| Writer events | `DEMO_WRITER_EVENTS` in adapter | Static, never persisted |
| Fixture data | `src/data/mock/audit-logs.ts` | 6 rows, unchanged |

- `persistenceMode` concept exists on `AuditEvent` but all current data is `mock_only`.
- `prototype_only` and `real_persisted` modes are defined types but not yet used.
- Admin display reads from the shared mock writer + fixture data through the adapter/presenter.

## Problem Statement

Transitioning from mock-only to prototype persistence requires careful planning because:

1. **Audit events are sensitive governance artifacts.** They record staff actions on student applications and must not be tampered with, lost, or leaked.

2. **Unsafe persistence can accidentally store PII.** The current metadata guard (`FORBIDDEN_AUDIT_METADATA_KEYS`) runs only client-side. Server persistence must enforce the same rules.

3. **Reason text may contain sensitive information.** Free-text reason fields can include student identifiers, personal details, or case notes that require access control.

4. **Source-of-truth ambiguity.** If both mock and prototype writers are active simultaneously, Admin display could mix data from different sources with different guarantees.

5. **Copy-stage claims.** The current UI says "Mock event" / "Demo" for all rows. Any transition to persistence must not accidentally imply official audit evidence exists when it does not.

6. **Rollback complexity.** Once events are written to a database, removing them without breaking audit trails requires soft-delete and archive strategies.

## AP-9 Target (Future State)

When AP-9 is fully implemented (in a subsequent runtime phase, not now):

- A **prototype persistence** mode (`prototype_only`) will be available behind a feature flag.
- Events written in prototype mode will be stored but clearly labeled as non-official.
- Real persistence (`real_persisted`) will remain disabled until compliance review.
- The Admin audit display will continue to read through the presenter boundary.
- The shared mock writer will remain active and untouched as a fallback.
- All existing safety contracts (privacy guard, policy, presenter) will be preserved.

## Proposed Architecture (Layered)

```
UI/Page (page.tsx, components)
  ↓ calls
Service Layer (AuditService)
  ↓ calls
Policy/Privacy Guard (AuditPolicy, AuditMetadataSanitizer)
  ↓ calls
Repository (AuditRepository — interface from AP-8A)
  ↓ calls
Storage Driver (new, planned here)
  → InMemory | PrototypeFile | Database
  ↓
Data Layer (tables defined in AP-8B)
```

**Display path (read):**

```
Admin page → adapter → repository.query() → presenter → table/drawer/CSV
```

**Write path:**

```
Staff callback → service → builder → policy guard → sanitizer → repository → storage driver
```

## Persistence Modes

| Mode | Value | Storage Allowed | Display Label | Who Can See |
|------|-------|----------------|---------------|-------------|
| `mock_only` | `mock_only` | In-memory only (session) | "Demo (fixture)" / "Demo (generated)" | Dev/QA only |
| `prototype_only` | `prototype_only` | Prototype storage (file or DB) | "Prototype event" | Admin only, internal |
| `real_persisted` | `real_persisted` | Production database | No mock banner | Authorized roles per policy |

### Mode Transition Rules

- Events written as `mock_only` can never be promoted to `real_persisted`. New events must be written at the target mode.
- `prototype_only` events must display a clear "prototype" banner in the Admin UI.
- `real_persisted` display requires a separate UI treatment (no "Demo" banner, official evidence language).
- Mode is set at write time and is immutable for the event's lifetime.

## Scope for Future AP-9A (Runtime)

AP-9A would implement the runtime skeleton derived from this plan:

- `AuditStorageDriver` interface and implementations
- `PrototypeAuditRepository` using the storage driver
- Feature flag / config switch for prototype mode
- Write adapter connecting `AuditService` to the prototype repository
- Read adapter for Admin display through the presenter
- Tests and contract checks for the new storage layer

AP-9A must NOT:
- Enable `real_persisted` mode
- Bypass privacy policy or metadata sanitizer
- Store raw PII in any field
- Change Staff workflow behavior unexpectedly
- Remove the shared mock writer before prototype is proven stable
- Remove any existing mock/fixture data paths

## Non-Goals (Explicit Exclusions)

This plan does NOT:
- Create runtime code (`src/*`)
- Create database migrations
- Add backend/API routes
- Modify existing audit behavior
- Wire Staff verify action
- Change reason validation
- Introduce ReasonRequiredModal
- Change notification behavior
- Add real persistence
- Start AP-10

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| PII leakage through metadata | Medium | Critical | Sanitizer at write time + server-side enforcement |
| False official audit evidence claim | Medium | High | Clear UI banners for prototype/mock modes |
| Reason text sensitivity | High | Medium | Separate storage, role-based access, redaction in exports |
| Metadata over-collection | Medium | Medium | Allowlist-only approach, forbidden key rejection |
| Rollback difficulty | Low | High | Feature flag, additive migrations, soft-delete |
| Source-of-truth ambiguity (mock vs prototype) | Medium | Medium | Separate source discriminator, Admin filter |
| Duplicate audit events | Low | Medium | Deterministic IDs, duplicate detection in repository |
| Policy bypass in new code path | Low | Critical | Policy guard called before every write |

## Prerequisites Before Runtime (AP-9A)

1. ✅ AP-8A — Service/repository/policy/presenter contracts (done)
2. ✅ AP-8B — Database schema plan (done)
3. ✅ AP-8C — Display presenter refactor (done)
4. ⬜ AP-8C-QA — QA checkpoint (recommended)
5. ⬜ Compliance review of privacy model
6. ⬜ Decision: database engine (PostgreSQL recommended)
7. ⬜ Decision: prototype storage backend (in-memory extension, file, or database)
8. ⬜ Security team review of forbidden metadata list

## Recommended Next Step

After AP-9 plan review and approval:

**AP-9A — Prototype Audit Persistence Runtime Skeleton**

Scope:
- `AuditStorageDriver` interface
- `InMemoryAuditStorageDriver` (dev/test)
- `PrototypeFileAuditStorageDriver` (optional)
- Feature flag disabled by default
- Prototype mode (`prototype_only`) only
- Write path: service → sanitizer → repository → driver
- Read path: repository → presenter → Admin display
- No `real_persisted` mode
- No database migration unless separately approved
- Comprehensive tests for storage contract compliance

Do not start AP-9A without explicit approval.
Do not start real persistence.
Do not start AP-10.