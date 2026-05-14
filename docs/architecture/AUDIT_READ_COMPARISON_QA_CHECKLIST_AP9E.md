# Audit Read Comparison QA Checklist AP-9E

## A. Docs-Only Safety

- [ ] No `src/*` changes
- [ ] No `scripts/*` changes
- [ ] No `package.json` changes
- [ ] No backend/API changes
- [ ] No database migrations
- [ ] No mock fixture mutation
- [ ] AP-9E runtime not started
- [ ] AP-10 not started

## B. Read Source Preservation

- [ ] `sharedMockWriter` remains source of truth
- [ ] `adminAuditDisplayAdapter` remains active read path
- [ ] `AuditDisplayPresenter` remains display boundary
- [ ] Admin table still reads from current adapter
- [ ] Admin drawer still reads presenter output from current adapter
- [ ] CSV/export remains unchanged

## C. Comparison Dimensions

- [ ] event count planned
- [ ] event ids planned
- [ ] event types planned
- [ ] actor role planned
- [ ] target display token planned
- [ ] persistence mode planned
- [ ] severity planned
- [ ] timestamp order planned
- [ ] source route category planned
- [ ] safe metadata key set planned
- [ ] presenter output consistency planned
- [ ] copy-stage consistency planned

## D. Privacy / Logging Safety

- [ ] no actorId in logs
- [ ] no targetId in logs
- [ ] no reason text in logs
- [ ] no metadata values in logs
- [ ] no raw route params in logs
- [ ] no raw student ID, national ID, email, phone, bank, IP, file names, or OCR text
- [ ] mismatch logs limited to counts, event type, safe tokens, and category
- [ ] no user-facing mismatch display in AP-9E planning
- [ ] no PII exposure

## E. Admin Display Boundary

- [ ] no Admin read switch
- [ ] prototype comparison does not alter table rows
- [ ] prototype comparison does not alter drawer rows
- [ ] prototype comparison does not alter CSV/export
- [ ] future debug panel remains separate, admin-only, disabled by default, and PII-safe
- [ ] real persisted filter remains safe/empty until separately approved

## F. Feature Flags

- [ ] all future comparison flags default false
- [ ] prototype persistence remains disabled by default
- [ ] `readFromPrototype` remains false
- [ ] comparison can be disabled independently
- [ ] no feature flag activates real persistence

## G. Rollback Readiness

- [ ] rollback by disabling comparison flag
- [ ] mismatch threshold trigger documented
- [ ] unsafe metadata trigger documented
- [ ] route/UI regression trigger documented
- [ ] check failure trigger documented
- [ ] latency degradation trigger documented
- [ ] rollback validation includes build, tokens, audit checks, route smoke, and dev log

## H. Existing Runtime Preservation

- [ ] no Staff callback change
- [ ] Staff verify remains unwired
- [ ] reason validation unchanged
- [ ] no `ReasonRequiredModal`
- [ ] notification behavior unchanged
- [ ] no real persistence
- [ ] no DB/API/migrations

## I. Future Runtime Readiness

- [ ] comparison input sources identified
- [ ] normalization boundary identified
- [ ] mismatch categories identified
- [ ] privacy-safe logging model identified
- [ ] Admin display boundary identified
- [ ] rollout and rollback model identified

## J. Final Approval Checklist

- [ ] AP-9E plan reviewed
- [ ] AP-9E QA docs-only review complete
- [ ] AP-9F runtime explicitly approved before implementation
- [ ] no real persistence approval implied
- [ ] no AP-10 approval implied
