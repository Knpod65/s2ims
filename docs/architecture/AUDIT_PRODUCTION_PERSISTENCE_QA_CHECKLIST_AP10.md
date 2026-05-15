Audit Production Persistence QA Checklist AP-10

This checklist covers all QA gates for the AP-10 production audit persistence program. Each phase has its own checklist. Items marked with (*) require written sign-off from the named owner before the gate passes.

---

1. Docs-only QA checklist (phase (a))

This checklist must pass before the AP-10 planning branch is merged to main.

- [ ] `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md` — present and complete (14 sections)
- [ ] `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md` — present and complete (8 sections)
- [ ] `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md` — present and complete (10 sections)
- [ ] `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md` — present and complete (7 sections)
- [ ] `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md` — present (this file)
- [ ] `docs/architecture/NEXT_RENOVATION_STEPS.md` — AP-10 section appended
- [ ] `docs/daily-reports/2026-05-15-audit-production-persistence-plan-ap10.md` — present
- [ ] `git diff --name-only origin/main...HEAD | grep -v "^docs/"` — empty (no non-docs files changed)
- [ ] Build: `npm run build` passes 40/40 routes, 0 type errors
- [ ] Token check: `npm run check:tokens` passes 4/4
- [ ] Audit checks: `npm run check:audit-events` passes 139/139
- [ ] Route smoke: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` — all 200 OK
- [ ] Dev log: no errors, warnings, or hydration issues

---

2. Schema design checklist (phase (b))

This checklist must pass before any phase (c) implementation begins.

- [ ] All required fields from AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 2 are present in the schema
- [ ] No forbidden storage patterns from section 3 appear in the schema
- [ ] Indexing strategy from section 4 is reflected in the schema
- [ ] Retention periods from section 5 are encoded in the schema documentation
- [ ] Erasure/suppression procedure from section 6 is compatible with the schema (PII fields are nullable or have erasure token column)
- [ ] Migration strategy from section 7 is reflected in the schema (shadow write flag, dual-read flag)
- [ ] Backup and recovery requirements from section 8 are confirmed with the infrastructure owner
- [ ] (*) DPO written review of schema design completed
- [ ] (*) Legal review of schema design completed
- [ ] (*) Engineering review of schema design completed

---

3. Implementation checklist (phase (c))

This checklist must pass before the implementation PR is merged.

- [ ] `AuditPersistenceService` is isolated from `adminAuditDisplayAdapter` and the comparison debug panel
- [ ] `AuditPersistenceService` does not read from or write to `sharedMockWriter`
- [ ] Mock path (`sharedMockWriter`) remains fully functional when `shadowWrites: false`
- [ ] Shadow-write flag (`shadowWrites`) defaults `false` in `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- [ ] All persistence feature flags default `false`
- [ ] `adminAuditDisplayAdapter` reads from mock path when `readFromPrototype: false` (unchanged behavior)
- [ ] Build: `npm run build` passes 40/40 routes, 0 type errors
- [ ] Token check: `npm run check:tokens` passes 4/4
- [ ] Audit checks: `npm run check:audit-events` passes at the then-current baseline (139 minimum; persistence checks should expand this count)
- [ ] Route smoke: 5 routes × 200 OK, dev log clean
- [ ] No PII in any log line produced by `AuditPersistenceService`
- [ ] `checksumHash` computed and stored correctly for a test event (verified in unit test)
- [ ] Implementation PR references AP-10 planning docs and this QA checklist
- [ ] (*) Engineering sign-off on implementation PR

---

4. Privacy checklist (phase (c) and phase (e))

All items must be confirmed before any production flag is enabled.

- [ ] (*) Lawful basis documented in the DPO's privacy notice for each event type collected
- [ ] Data minimization confirmed: only fields from database model section 2 are stored
- [ ] `actorId` is stored as hash/token — raw actor identity not stored
- [ ] `targetId` is stored as hash/token — raw target identity not stored
- [ ] `reason` field is not full-text indexed in production
- [ ] Retention schedule defined and automated deletion trigger confirmed in place
- [ ] Erasure procedure tested: in-place suppression verified, skeletal record preserved, erasure log entry created
- [ ] Subject access request procedure documented and 30-day response window is achievable
- [ ] Cross-border transfer restriction confirmed: Thailand-region storage confirmed in writing from cloud provider
- [ ] Breach notification procedure in place: PDPC notification within 72 hours, DPO contacts identified
- [ ] (*) DPO written sign-off obtained (per AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 10)
- [ ] Privacy notice updated to reflect audit persistence system

---

5. Access control checklist (phase (c) and phase (e))

- [ ] Official audit records are accessible only via `adminAuditDisplayAdapter` — no direct table access from other components
- [ ] Every Admin access to official records is itself logged as an audit event
- [ ] No non-Admin role can access official audit records via any code path
- [ ] `exportAuditCSV` reads from the official store only — no comparison/prototype data
- [ ] Bulk export (> 1000 records) requires Admin role verification and a session log entry
- [ ] Export of records containing PDPA-sensitive fields requires DPO review before the export is permitted

---

6. Migration checklist (phase (d))

- [ ] Shadow-write tested in staging: persistence writes are confirmed for a representative sample of event types
- [ ] Dual-read comparison run in staging: mock path and production store results compared over a minimum 72-hour window
- [ ] Mismatch rate ≤ 0.1% confirmed before proceeding to phase (e)
- [ ] Mismatch alert is functional: a deliberate mismatch triggers the alert
- [ ] Promotion criteria defined in writing: what mismatch rate, what review window, what approval is required
- [ ] Rollback tested from each migration phase: shadow-write rollback, dual-read rollback, promotion rollback
- [ ] Data integrity verified: `checksumHash` verified for all staging events written during the dry-run

---

7. Rollback checklist (phase (d) and phase (e))

- [ ] Rollback owner identified by name and contact method
- [ ] Emergency rollback procedure documented and executable in < 5 minutes
- [ ] Emergency rollback tested in staging: confirm Admin display reverts to mock path after flag set to `false`
- [ ] Post-rollback build passes: 40/40 routes, 0 type errors
- [ ] Post-rollback routes pass: 5 routes × 200 OK, dev log clean
- [ ] Post-rollback audit checks pass: baseline count
- [ ] Post-rollback Admin display confirmed reading from mock/shared writer path
- [ ] Rollback documentation template prepared (aggregate-only, no PII fields)

---

8. Final approval checklist (phase (e) pre-merge)

All 7 approvals must be obtained in writing before any phase (e) PR is merged. Written approval means a dated, named sign-off from the named owner.

- [ ] (*) Engineering approval: implementation PR reviewed; diff scope, test coverage, flag defaults, persistence layer isolation confirmed
- [ ] (*) Privacy/PDPA approval: aggregate-only monitoring surface, PII pseudonymization, retention schedule, erasure procedure, logging restrictions, PDPA alignment confirmed
- [ ] (*) DPO approval (written): data minimization, lawful basis, retention schedule, erasure procedure, breach notification procedure all confirmed in place; privacy notice updated
- [ ] (*) Legal approval: regulatory compliance confirmed for audit retention period; export policy reviewed; cross-border transfer restriction confirmed
- [ ] (*) Product/Admin owner approval: Admin-only read, evidence review boundary, export policy, staging-only enablement of shadow write confirmed
- [ ] (*) QA approval: full QA checklist pass confirmed — build, tokens, audit checks, route smoke, privacy checklist, schema review, migration test
- [ ] (*) Rollback owner approval: emergency rollback documented (< 5 minutes), rollback owner identified, rollback tested in staging within the last 7 days
