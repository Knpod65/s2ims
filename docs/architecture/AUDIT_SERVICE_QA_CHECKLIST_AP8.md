# Audit Service QA Checklist AP-8

## A. Docs-Only Safety
- [ ] No runtime files (`src/*`) were modified.
- [ ] No scripts (`scripts/*`) were modified.
- [ ] No `package.json` was modified.
- [ ] No test files were modified.
- [ ] All files are in `docs/architecture/`.

## B. DRY Review
- [ ] UI/page layer is separated from service layer.
- [ ] Service layer is separated from repository layer.
- [ ] DTOs are defined separately from interfaces.
- [ ] Factory is separate from writer.
- [ ] Presenter is separate from repository.
- [ ] Copy-stage resolver is separate from persistence.

## C. Laravel/PHP Boundary Review
- [ ] TypeScript interfaces have PHP equivalents documented.
- [ ] Folder structures for Laravel are planned.
- [ ] DTO concepts map to PHP DTOs.
- [ ] Service concepts map to PHP services.
- [ ] Repository concepts map to PHP repositories.
- [ ] Policy concepts map to Laravel policies.

## D. Interface Completeness
- [ ] `AuditEventFactory` interface is defined.
- [ ] `AuditWriter` interface is defined.
- [ ] `AuditRepository` interface is defined.
- [ ] `AuditMetadataSanitizer` interface is defined.
- [ ] `AuditPolicyGuard` interface is defined.
- [ ] `AuditDisplayPresenter` interface is defined.
- [ ] `AuditCopyStageResolver` interface is defined.
- [ ] `AuditService` interface is defined.

## E. Repository Contract Review
- [ ] CRUD operations are specified (append, findById, list, count).
- [ ] Filter contract is defined.
- [ ] Pagination contract is planned.
- [ ] Persistence mode behavior is documented.
- [ ] Privacy rules are noted (repository stores sanitized data only).

## F. Policy/Privacy Contract Review
- [ ] Metadata key policy is reproduced from AP-2/AP-4.
- [ ] Role visibility matrix is documented.
- [ ] Target privacy levels are defined.
- [ ] Forbidden metadata keys are listed.
- [ ] Safe metadata examples are given.

## G. Presenter/Display Contract Review
- [ ] Display row shape is defined.
- [ ] Persistence label rules are documented.
- [ ] Localization (Thai/English) boundary is specified.
- [ ] Drawer display contract is considered.
- [ ] CSV/export contract is specified.

## H. Copy-Stage Safety
- [ ] Copy-stage resolver is defined.
- [ ] Mock-only copy is specified (does not claim real persistence).
- [ ] Real-persisted copy is planned.
- [ ] Prototype copy is planned.
- [ ] No overclaiming of persistence in any copy text.

## I. Notification Navigation Note
- [ ] Issue is documented (notification not clickable).
- [ ] Future phase (UX-N1) is proposed.
- [ ] Notification payload shape is sketched.
- [ ] Laravel mapping is included.
- [ ] QA checklist for future notification work is included.

## J. Runtime Non-Regression
- [ ] Build passes 40/40 routes.
- [ ] Token check passes 4/4.
- [ ] Audit event check passes current repo expectation (42/42).
- [ ] No hydration errors.
- [ ] No console errors.
- [ ] `/login` returns 200 OK.
- [ ] `/admin/audit-log` returns 200 OK.
- [ ] `/admin/dashboard` returns 200 OK.
- [ ] `/staff/applications/app_001` returns 200 OK.
- [ ] `/staff/applications/app_002` returns 200 OK.

## K. Future AP-8A Readiness
- [ ] TypeScript folder shape is planned.
- [ ] Django folder shape is planned.
- [ ] Interface contracts are concrete enough to implement.
- [ ] DRY boundaries are clear.
- [ ] No implementation details leaked into this planning document.

## L. Future AP-8B Schema Readiness
- [ ] Repository filters are comprehensive enough for DB schema design.
- [ ] Persistence mode enum is defined.
- [ ] Privacy level enum is defined.
- [ ] No direct DB schema code in this document.

## M. Final Approval Checklist
- [ ] All docs-only rules are satisfied.
- [ ] No forbidden files changed.
- [ ] No runtime behavior changed.
- [ ] No reason validation changed.
- [ ] No ReasonRequiredModal introduced.
- [ ] No Staff verify wired.
- [ ] AP-8 is planning only.
- [ ] Ready for review.
