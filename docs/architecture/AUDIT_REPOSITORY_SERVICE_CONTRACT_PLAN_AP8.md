# Audit Repository/Service Contract Plan AP-8

## 1. Overview
### AP-8 Purpose
This document turns the AP-7 Audit Persistence Strategy into concrete TypeScript and Laravel/PHP-inspired interface contracts for the audit repository and service layer. It remains documentation-only and does not modify runtime code.

### Why AP-8 Exists After AP-7
AP-7 defined the migration strategy and Laravel/PHP-inspired boundaries. AP-8 specifies the concrete contracts (interfaces, DTOs, service methods) that will enable future runtime implementation while preserving DRY architecture.

### Current Mock-Only Audit State
- Mock audit writer (`mockAuditWriter.ts`) is in-memory and isolated.
- Admin display uses `adminAuditDisplayAdapter.ts` to read from the mock fixture.
- Staff document actions (reject/replacement request) are wired to the mock writer via `sharedMockWriter.ts`.
- No real persistence, no backend/API, no database mutations.

### Future Persistence Goal
Enable real audit persistence (e.g., database) while keeping the same contracts, allowing a seamless swap from mock to real storage.

### What AP-8 Does and Does Not Do
**Does:**
- Define TypeScript interfaces for DTOs, repositories, services, policies, presenters, and copy resolvers.
- Map these to Laravel/PHP equivalents for future backend consistency.
- Document DRY boundaries to prevent duplicated audit construction.
- Note the notification click issue as a UX/navigation follow-up.

**Does Not:**
- Modify any runtime files (`src/*`, `scripts/*`).
- Add real persistence or backend/API.
- Change reason validation or introduce ReasonRequiredModal.
- Wire Staff verify action.
- Fix the notification click issue (documented as future work).

## 2. Current State Inventory
The following modules are relevant to audit behavior:
- `src/lib/audit/auditTypes.ts`: Core audit event types and interfaces.
- `src/lib/audit/auditEventBuilder.ts`: Pure builder for audit events with metadata validation.
- `src/lib/audit/auditMetadataRules.ts`: Privacy-safe metadata rules (allowed/blocked keys).
- `src/lib/audit/mockAuditWriter.ts`: In-memory mock audit writer (create, write, list, etc.).
- `src/lib/audit/sharedMockWriter.ts`: Shared instance used by Staff document actions.
- `src/lib/audit/adminAuditDisplayAdapter.ts`: Adapter that maps mock audit log rows to Admin display rows.
- `src/app/staff/applications/[id]/page.tsx`: Staff application detail page where reject/replacement request actions are wired to the mock writer.
- `src/components/staff/DocumentVerificationPanel.tsx`: Panel that contains the action buttons.
- `src/app/admin/audit-log/page.tsx`: Admin audit log table with AP-6A badge/filter and AP-6B drawer planning.
- `src/components/admin/AdminAuditEventDetailDrawer.tsx`: Planned drawer component (AP-6B).
- `src/data/mock/audit-logs.ts`: Mock audit log fixture (must not be mutated).
- `scripts/check-audit-events.mjs`: Validation script for audit event builder and writer.

## 3. Problem Statement
Current risks if we proceed to real persistence without AP-8 contracts:
- UI callbacks (e.g., in Staff application page) directly build audit events and call the mock writer, mixing UI logic with audit construction and persistence.
- The mock writer is an in-memory detail; swapping to a real repository would require changing every UI callback.
- Admin display and Staff workflows read from different places (mock fixture vs. shared writer) without a unified repository.
- Without a service/repository boundary, future persistence implementation would scatter audit construction, validation, privacy rules, and storage across UI, services, and components.
- The notification click issue (visible but non-clickable alert) is a separate UX/navigation concern but must not be conflated with audit persistence work.

## 4. AP-8 Target Architecture
We propose the following layers and contracts:

### Core DTOs and Contexts
- `AuditEventInput`: DTO for creating an audit event (immutable, validated).
- `AuditActionContext`: Describes the action (type, label, sub-action).
- `AuditActorContext`: Describes the actor (ID, role, name, token).
- `AuditTargetContext`: Describes the target (ID, type, name, token, privacy level).
- `AuditMetadataInput`: Structured metadata (key-value pairs, already sanitized).
- `AuditWriteResult`: Result of a write attempt (success, event ID, or error).

### Writer and Repository Interfaces
- `AuditWriter`: Validates input, delegates to repository, returns `AuditWriteResult`.
- `AuditRepository`: Handles storage and retrieval (append, findById, list, count).
- `AuditPersistenceDriver`: Chooses between mock and real repository based on configuration (future).

### Policy and Privacy
- `AuditPolicy`: Determines if an action requires audit and what metadata is allowed.
- `AuditPrivacyGuard`: Applies target privacy level and metadata rules to produce safe values for storage/display.

### Presentation and Copy
- `AuditDisplayPresenter`: Converts a stored audit event to a UI-ready display row (for table, drawer, export).
- `AuditCopyStageResolver`: Determines copy stage and text based on persistence mode and configuration.

### Factory and Service
- `AuditEventFactory`: Builds an audit event from DTOs and contexts (pure function).
- `AuditService`: Highest-level orchestrator used by UI; validates action via policy, builds event via factory, writes via writer.

## 5. DRY Boundaries
The following table outlines responsibilities and prohibitions:

| Layer                      | Responsibility                                                                 | Must Not Do                                                                 |
|----------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| UI/page layer              | Call service methods only; pass user input as DTOs.                           | Build raw audit events, call writer/repository directly, apply privacy rules. |
| Service/action layer       | Orchestrate workflow: validate input, build event, write via writer.          | Render UI, know about routes, handle HTTP requests directly.                |
| Event factory              | Build audit event shape from DTOs; apply metadata rules via privacy guard.    | Write to storage, know about persistence mode, return UI strings.           |
| Writer                     | Validate input (policy), delegate to repository, map result to `AuditWriteResult`. | Render copy, know about UI labels, decide persistence mode.                 |
| Repository                 | Store and retrieve audit events; apply persistence mode logic (mock/real).    | Decide what to store based on UI, return copy-specific strings, validate input. |
| Policy/privacy guard       | Determine audit requirement, filter metadata, apply target privacy rules.     | Know about storage details, return UI-ready strings, build audit events.    |
| Presenter                  | Convert stored event to display row (for Admin table, drawer, export).        | Mutate the event, write to storage, validate input, decide persistence mode. |
| Copy resolver              | Determine copy stage and text (e.g., "mock/demo") based on configuration.     | Know about storage, return audit event data, validate input.                |

## 6. Laravel/PHP-Inspired Mapping
| S2IMS Concept (TS)         | Laravel/PHP Equivalent                                                        |
|----------------------------|-------------------------------------------------------------------------------|
| UI/page callback (e.g., in Staff application page) | Controller method (e.g., `DocumentController@reject`) |
| `AuditService`             | `App\Services\Audit\AuditService`                                             |
| `AuditWriter` interface    | `App\Contracts\Audit\AuditWriterInterface`                                    |
| `AuditRepository` interface| `App\Repositories\Audit\AuditRepositoryInterface`                             |
| `AuditEventInput` DTO      | `App\Data\Audit\AuditEventData`                                               |
| FormRequest-like validation| `App\Http\Requests\Audit\StoreAuditEventRequest`                              |
| `AuditPolicy`              | `App\Policies\AuditPolicy`                                                    |
| `AuditDisplayPresenter`    | `App\Http\Resources\AuditEventResource` (for JSON/API)                        |
| Event/Listener             | `App\Events\AuditEventCreated` / `App\Listeners\PersistAuditEvent`            |
| Configuration              | `config/audit.php`                                                            |
| Routes                     | `routes/web.php` (for notification links, if any)                             |

## 7. Proposed TypeScript Folder Shape
```text
src/lib/audit/
  contracts/
    AuditWriter.ts
    AuditRepository.ts
    AuditPolicy.ts
    AuditPrivacyGuard.ts
    AuditDisplayPresenter.ts
    AuditCopyStageResolver.ts
    AuditEventFactory.ts
    AuditService.ts
  dto/
    AuditEventInput.ts
    AuditActionContext.ts
    AuditActorContext.ts
    AuditTargetContext.ts
    AuditMetadataInput.ts
    AuditWriteResult.ts
  services/
    AuditServiceImpl.ts   // implements AuditService
  repositories/
    InMemoryAuditRepository.ts // implements AuditRepository (mock)
    DatabaseAuditRepository.ts // future real persistence
  policies/
    DefaultAuditPolicy.ts   // implements AuditPolicy
  presenters/
    AdminAuditDisplayPresenter.ts // implements AuditDisplayPresenter
  drivers/
    AuditPersistenceDriver.ts   // chooses repo based on config
  copy/
    DefaultCopyStageResolver.ts // implements AuditCopyStageResolver
  tests/
    (unit tests for each module)
```

## 8. Proposed Laravel/PHP Folder Shape
```text
app/
  Contracts/Audit/
    AuditWriterInterface.php
    AuditRepositoryInterface.php
  Data/Audit/
    AuditEventData.php
  Services/Audit/
    AuditService.php
  Actions/Audit/
    StaffDocumentRejectionAction.php
    StaffDocumentReplacementRequestAction.php
  Repositories/Audit/
    AuditRepositoryInterface.php
    InMemoryAuditRepository.php
    DatabaseAuditRepository.php
  Policies/
    AuditPolicy.php
  Http/Requests/Audit/
    StoreAuditEventRequest.php
  Http/Resources/
    AuditEventResource.php
  Events/
    AuditEventCreated.php
  Listeners/
    PersistAuditEvent.php
database/
  migrations/
    2026_05_13_000000_create_audit_table.php
```

## 9. Notification Click Issue Note
**Observed Issue**: A notification/alert area is visible in the UI (e.g., topbar) but is not clickable. This was noted during validation but is **not** part of AP-8 scope.

**Why Document It Here?**
- Future audit events may generate notifications (e.g., "Document rejected").
- Clickable notifications must not expose raw PII in URLs or payloads.
- Notification action must respect role permissions (e.g., only staff can see staff document notifications).

**Future Phase Recommendation**
- Create a separate UX/navigation planning phase: `UX-N1 — Notification Navigation Contract Plan`.
- That phase should inspect notification routes, payload shape, link targets, and permission checks.
- **Do not** mix notification click runtime with audit persistence runtime in AP-8 or AP-8A/AP-8B.

## 10. Non-Goals
AP-8 explicitly does not:
- Modify any runtime code (`src/*`, `scripts/*`).
- Add real persistence or backend/API.
- Create database migrations.
- Mutate `src/data/mock/audit-logs.ts`.
- Change reason validation.
- Introduce ReasonRequiredModal.
- Wire Staff verify action.
- Change notification click behavior (documented as future work).
- Change `package.json` (no new dependencies planned).

## 11. Recommended Next Phase
After AP-8 planning is reviewed and approved, the next step is to implement a minimal runtime skeleton.

**Recommended: AP-8A — Audit Service/Repository Runtime Skeleton**
- Create the TypeScript interface files and a minimal in-memory repository implementation.
- Keep the existing mock writer in place for Staff actions; the new skeleton would be optional/config-driven.
- This allows us to test the contract boundaries without switching the current mock behavior.

**Alternative: AP-8B — Audit Database Schema Plan**
- Docs-only: design the database schema (tables, columns, indexes) for real persistence.
- Safer if we want to finalize the storage shape before writing any contract code.

**Why AP-8A Is Recommended First**
- It validates the contract boundaries early with minimal code.
- We can later swap the in-memory repository for a real one without changing UI or service usage.
- It keeps the door open for AP-8B to follow, ensuring the schema matches the contract.

Do not jump directly to real persistence (AP-9) or change reason validation yet.
