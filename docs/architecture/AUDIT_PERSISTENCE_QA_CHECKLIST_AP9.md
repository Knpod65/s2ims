# Audit Persistence QA Checklist AP-9

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-persistence-plan-ap9`

Use checkbox-style review. Each item must be verified before AP-9 is considered complete.

---

## A. Docs-Only Safety

- [ ] No runtime code (`src/*`) was created or modified
- [ ] No scripts (`scripts/*`) were modified
- [ ] No `package.json` was modified
- [ ] No backend/API routes were added
- [ ] No database migrations were created
- [ ] No mock fixture (`src/data/mock/audit-logs.ts`) was mutated
- [ ] No Staff callbacks were changed
- [ ] No Staff verify action was wired
- [ ] No reason validation was changed
- [ ] No `ReasonRequiredModal` was introduced
- [ ] No notification behavior was changed
- [ ] No PII was exposed in routes, labels, payloads, exports, logs, metadata, or display output
- [ ] AP-9A was not started
- [ ] AP-10 was not started
- [ ] Real persistence was not added
- [ ] Prototype persistence runtime was not added

## B. Architecture Boundary Review

- [ ] Layered architecture flow is documented (UI → Service → Policy → Repository → Driver → Storage)
- [ ] Display path (read) is documented separately from write path
- [ ] `AuditDisplayPresenter` remains the single formatting boundary for all read paths
- [ ] Storage driver contract does not build events, validate reasons, or decide visibility
- [ ] Existing mock writer (`sharedMockWriter`) is preserved as fallback
- [ ] `AuditRepositoryContract` interface from AP-8A is referenced, not modified
- [ ] `AuditStorageDriver` interface is new and separate from `AuditWriterContract`

## C. Storage Driver Contract Review

- [ ] `AuditStorageDriver` interface defined with all required methods: `write`, `writeMany`, `findById`, `query`, `count`, `healthCheck`
- [ ] Optional utility methods: `clear`, `seed`
- [ ] `AuditStorageWriteInput` type includes all safety fields (no raw PII)
- [ ] `AuditStorageRecord` type includes `storedAt` timestamp
- [ ] `AuditStorageQuery` type supports pagination and filtering
- [ ] `AuditStorageDriver` failure handling specified (return error, log warning, do not throw)
- [ ] Driver types compared: `InMemory`, `PrototypeFile`, `Database`
- [ ] Recommendation to start with `InMemoryAuditStorageDriver` documented
- [ ] Duplicate prevention mechanism documented (deterministic IDs, idempotent writes)

## D. Repository Implementation Readiness

- [ ] Write flow documented: Staff callback → Service → Builder → Policy → Sanitizer → Repository → Driver
- [ ] Read flow documented: Admin page → Repository query → Policy filter → Presenter → Display
- [ ] Migration strategy from `sharedMockWriter` defined in stages (shadow → compare → read → write → cleanup)
- [ ] Duplicate prevention mechanisms documented (deterministic IDs, dedup in repository, idempotent writes)
- [ ] Query filters mapped to AP-8B indexes
- [ ] Future file paths listed (not created)
- [ ] Prototype storage recommendation documented (start with in-memory)
- [ ] Laravel/PHP mapping provided for all future classes

## E. Privacy Enforcement Review

- [ ] Enforcement layers documented (DTO validation, event builder, sanitizer, policy, repository gate, storage contract, presenter, export policy)
- [ ] Forbidden persistence fields list matches `FORBIDDEN_AUDIT_METADATA_KEYS` in source
- [ ] Safe persistence fields listed and justified
- [ ] Reason text handling plan: separate storage, access controlled, redacted in export by default
- [ ] Metadata handling plan: allowlist, reject forbidden keys, drop unknown keys, record drop count
- [ ] IP handling plan: no raw IP, optional salted hash, never shown in UI
- [ ] Role matrix documented for all 6 roles (Student, Staff, Provider, Executive/ESQ, Admin, System)
- [ ] Role matrix covers: view event, view target token, view actor, view reason, view metadata, export
- [ ] Laravel/PHP mapping provided for all privacy components

## F. Reason Text Handling Review

- [ ] Reason stored in separate table (`audit_reasons`) with own access control
- [ ] `audit_events` stores only `reason_id` FK, never raw text
- [ ] Reason not exported in CSV by default for non-admin roles
- [ ] Reason retention policy configurable independently
- [ ] Reason never mixed into metadata blob
- [ ] Consistent with AP-8B schema plan (`audit_reasons` table definition)

## G. Metadata Sanitizer Review

- [ ] Sanitizer uses allowlist approach (`SAFE_AUDIT_METADATA_KEYS`)
- [ ] Forbidden keys (`FORBIDDEN_AUDIT_METADATA_KEYS`) are rejected, not masked
- [ ] Unknown keys dropped with diagnostic count
- [ ] Nested objects inspected recursively
- [ ] Dropped key names and values not stored
- [ ] Raw metadata may be stored in restricted column for admin-only access (per AP-8B)
- [ ] Consistent with `AuditMetadataSanitizerContract` interface from AP-8A

## H. Policy / Access Control Review

- [ ] Policy guard called before every write (documented in write flow)
- [ ] `AuditPolicyGuardContract` referenced for authorization checks
- [ ] Target privacy level classified before persistence
- [ ] Role-based visibility enforced at policy layer, not storage layer
- [ ] Export disabled in prototype mode
- [ ] No policy bypass in new code path

## I. Presenter / Export Safety Review

- [ ] `AuditDisplayPresenter` produces identical output regardless of data source
- [ ] Admin display uses presenter for all rows (no inline formatting)
- [ ] Export (CSV) uses presenter-safe labels
- [ ] Export disabled or produces safe empty state in prototype mode
- [ ] No PII in presenter output fields
- [ ] `targetDisplayToken` used instead of raw identifiers
- [ ] Consistent with AP-8C presenter refactor

## J. Rollout Plan Review

- [ ] Stage 0 (mock only) current state documented
- [ ] Stage 1 (prototype disabled behind config) defined
- [ ] Stage 2 (shadow writes) defined with exit criteria
- [ ] Stage 3 (read comparison) defined with exit criteria
- [ ] Stage 4 (prototype read) defined with exit criteria
- [ ] Stage 5 (write path switch) defined with exit criteria
- [ ] Stage 6 (cleanup) defined with exit criteria
- [ ] Stage 7 (real persistence) explicitly deferred
- [ ] Feature flag config structure documented
- [ ] All stages are reversible

## K. Rollback Plan Review

- [ ] Rollback triggers listed with severity and detection method
- [ ] Immediate rollback action: disable feature flags
- [ ] Display fallback to `sharedMockWriter` path documented
- [ ] Write fallback to `sharedMockWriter` path documented
- [ ] Prototype storage clearing procedure (only if safe) documented
- [ ] Mock-only flow preserved through rollback
- [ ] Incident documentation step included
- [ ] Rollback never breaks existing mock-only behavior

## L. Laravel / PHP Mapping Review

- [ ] `AuditStorageDriverInterface` mapped
- [ ] `InMemoryAuditStorageDriver` mapped
- [ ] `DatabaseAuditStorageDriver` mapped
- [ ] `AuditRepositoryInterface` mapped
- [ ] `EloquentAuditRepository` mapped
- [ ] `AuditPersistenceMapper` mapped
- [ ] `AuditMetadataSanitizer` mapped
- [ ] `AuditEvent` Eloquent model mapped
- [ ] `AuditReason` Eloquent model mapped
- [ ] `AuditMetadataBlob` Eloquent model mapped
- [ ] `StoreAuditEventRequest` (FormRequest) mapped
- [ ] `AuditPolicy` mapped
- [ ] `AuditEventResource` mapped
- [ ] `config/audit.php` structure defined
- [ ] All mappings consistent with AP-8B schema

## M. Runtime Non-Regression

- [ ] Build passes 40/40 routes
- [ ] Token check passes 4/4
- [ ] Audit/notification event check passes (71/71 as of AP-8C QA)
- [ ] All 5 routes return 200 OK (`/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`)
- [ ] Dev log clean (no errors, no warnings)
- [ ] No hydration errors
- [ ] No visual regression in Admin audit display
- [ ] Mock worker events still displayed correctly
- [ ] Fixture data unchanged and loading correctly
- [ ] Staff document reject/replacement callbacks still work (AP-6D)

## N. Future AP-9A Readiness

- [ ] AP-9A scope defined: minimal storage driver skeleton, prototype repository, feature flag disabled by default
- [ ] AP-9A explicitly excludes `real_persisted` mode
- [ ] AP-9A excludes database migration unless separately approved
- [ ] AP-9A excludes official evidence copy
- [ ] AP-9A readiness does not block current AP-9 completion
- [ ] AP-9A requires separate approval before starting

## O. Final Approval Checklist

- [ ] All sections A–N reviewed and checked
- [ ] No forbidden files modified
- [ ] No runtime code touched
- [ ] All validation checks pass
- [ ] Daily report written
- [ ] `NEXT_RENOVATION_STEPS.md` updated with AP-9 result
- [ ] Branch contains only documentation files in `docs/`
- [ ] PR description drafted with explicit non-goals
- [ ] Recommended next step (AP-9A) documented but not started