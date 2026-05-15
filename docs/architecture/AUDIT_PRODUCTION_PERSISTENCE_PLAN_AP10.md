Audit Production Persistence Plan AP-10

1. Overview

AP-10 is the production audit persistence and evidence readiness planning phase for the S2IMS audit modernization project. This document defines the architecture, evidence requirements, privacy/PDPA model, rollout/rollback procedure, and QA gates required before any production-grade audit persistence is implemented. This document is planning-only — no runtime code is changed in this phase.

2. Why AP-10 exists

AP-9G established the Admin Audit Comparison Debug Panel lifecycle: from a hidden skeleton (Stage 1) through gated renders (Stage 2), staging-only aggregate observability (Stage 3), and production-disabled-by-default planning (Stage 4). The comparison and observability model confirmed that the prototype read path is diagnostic only and must never become the source of official audit evidence.

AP-10 defines what official audit evidence requires: a production-grade, append-only, checksummed persistence layer that is separate from the prototype comparison path, aligned with Thailand PDPA requirements, and subject to a 7-owner approval gate before any production activation.

3. Current state

- `adminAuditDisplayAdapter` and `sharedMockWriter` are the active Admin Audit Log source of truth — unchanged.
- `AuditDisplayPresenter` is the formatting boundary — unchanged.
- All AP-9G feature flags default `false` in `DEFAULT_AUDIT_PERSISTENCE_CONFIG`.
- `AdminAuditComparisonDebugPanel` renders null in default config.
- 139/139 audit/notification checks pass.
- Build: 40/40 routes, 0 type errors.
- Prototype comparison reads are diagnostic only — not official audit evidence.
- No real persistence has been activated.

4. AP-10 scope (this planning phase)

This planning phase covers:
- Production audit persistence architecture (conceptual)
- Evidence-grade audit log requirements
- Database/storage model planning — see AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md
- Migration strategy (mock → production, phased)
- Privacy/PDPA model — see AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md
- Retention and deletion policy
- Access control and Admin evidence review boundary
- Export/reporting policy
- Observability and incident response
- Rollout/rollback plan — see AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md
- QA gates — see AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md

5. Explicit non-goals

- No `src/*` changes in this planning phase
- No database schema, ORM, or migration files added
- No real persistence activation
- No AP-9G feature flag changes
- No change to `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- No change to `adminAuditDisplayAdapter`, `sharedMockWriter`, or `AuditDisplayPresenter`
- No change to Admin Audit Log UI
- No new routes, navigation, or export behavior changes
- No mock fixture mutations
- No Staff callback, reason validation, or notification changes
- No PII exposure
- No AP-10 runtime start

6. Production audit persistence architecture

Conceptual design (to be implemented on a separate feature branch after all approvals):

Persistence layer:
- `AuditPersistenceService` — an isolated service that writes audit events to a production store. It does not read from or write to `sharedMockWriter`. It does not affect the comparison debug panel.
- Shadow write pattern — during the migration phase, `AuditPersistenceService` writes in parallel with the existing `sharedMockWriter`. The Admin display adapter reads from the mock path until persistence is promoted.
- Promotion — once dual-read comparison confirms data integrity, the Admin display adapter is switched to read from the production store. The mock path is deprecated (not deleted immediately).

Boundaries:
- The prototype/comparison path (`auditReadComparisonMetrics`) remains separate and never becomes the source of record.
- The comparison debug panel remains diagnostic only.
- The `adminAuditDisplayAdapter` is the only component that may read from the official store for display purposes.
- `exportAuditCSV` must read from the official store only — never from the comparison or prototype path.

7. Evidence-grade audit log requirements

A production audit record is official evidence when it satisfies all of the following:

- Immutability: records are append-only; no post-write updates to core fields are permitted.
- Completeness: all required fields are present (see AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 2).
- Checksummed: `checksumHash` (SHA-256 of core fields) is recorded at write time and verified at read time.
- Timestamped: `createdAt` is a server-side UTC timestamp; client-provided timestamps are not accepted.
- Isolated: the persistence store is not shared with the prototype comparison path.
- Audited: each Admin access to official records is itself logged.
- Non-exportable prototype data: comparison and prototype read data must never appear in any export or official report.

8. Admin evidence review boundary

- Admin reads official audit records only via `adminAuditDisplayAdapter`.
- The `AdminAuditComparisonDebugPanel` is a diagnostic tool — never a source of official evidence. Its output must not be referenced in legal, compliance, or regulatory contexts.
- The note "Prototype reads are diagnostic — not official audit evidence" is mandatory in all non-null panel render states.
- Export via `exportAuditCSV` must read from the official store only. Comparison or prototype data must never appear in any CSV export.
- Admin access to official records must be logged as an audit event.

9. Export/reporting policy

- Official CSV export may include only official persisted records.
- The export file must include a header disclaimer line identifying it as official persisted audit evidence (or demo data, in the pre-production state).
- Comparison, prototype, or diagnostic data must never appear in any export, report, or clipboard copy.
- Bulk export (> 1000 records) requires Admin role verification and a session log entry.
- Export of any record containing PDPA-sensitive fields requires DPO review before the export is permitted.

10. Observability and incident response

- Monitoring pipelines may receive only aggregate metrics from the persistence layer: write count, error rate, latency percentiles. No event payloads, no PII.
- PII in any log line, metric, or alert payload is an immediate incident trigger.
- Incident procedure:
  1. Disable the affected persistence write path (set flag to false in staging config).
  2. Notify DPO within 1 hour.
  3. Assess scope using aggregate-only data — no additional PII access during assessment.
  4. If > 50 data subjects or sensitive PII is confirmed, notify PDPC within 72 hours.
  5. Document incident in aggregate-only language — no PII in the incident report.
- Write failure rate > 1% triggers an alert (not an immediate incident) but requires engineering review within 2 hours.

11. Required approvals before any AP-10 runtime

All seven of the following approvals are required before any AP-10 runtime feature branch is opened or any production persistence is activated:

- Engineering approval: implementation PR, diff scope, test coverage, flag defaults, persistence layer isolation confirmed
- Privacy/PDPA approval: aggregate-only surface, PII pseudonymization, retention schedule, erasure procedure, logging restrictions, PDPA alignment
- DPO approval (written): data minimization, lawful basis, retention schedule, erasure procedure, and breach notification procedure all confirmed in place; privacy notice updated
- Legal approval: regulatory compliance confirmed for audit retention period; export policy reviewed; cross-border transfer restriction confirmed
- Product/Admin owner approval: Admin-only read, evidence review boundary, export policy, staging-only enablement of shadow write
- QA approval: full QA checklist pass — build, tokens, audit checks, route smoke, privacy checklist, schema review, migration test
- Rollback owner approval: emergency rollback documented (< 5 minutes), rollback owner identified, rollback tested in staging

12. QA gates

The following checks must all pass before any AP-10 runtime PR may be merged:

- Build: `npm run build` passes 40/40 routes, 0 type errors.
- Token checks: `npm run check:tokens` passes 4/4.
- Audit/event checks: `npm run check:audit-events` must pass at the then-current count (139 minimum; persistence checks should be added to expand this).
- Routes: five smoke routes return 200 OK.
- Dev log: no errors, warnings, or hydration issues.
- Privacy checklist: all items in AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md signed off.
- Schema review: DPO and engineering have approved the schema design.
- Migration tested: shadow-write and dual-read phases tested in staging with rollback confirmed.

13. AP-10 roadmap

Phase (a) — Docs-only plan (current phase)
Create this planning document package. No runtime changes. Completed when all 5 architecture docs are merged to main and post-merge QA passes.

Phase (b) — Schema design and review
Design the production event store schema. DPO, legal, and engineering review. No implementation. Requires all 7 approvals from section 11 before proceeding.

Phase (c) — Implementation (feature branch)
Implement `AuditPersistenceService` with shadow-write disabled by default. All feature flags default `false`. Build, QA gate, privacy checklist, schema review. PR must reference these docs and the QA checklist.

Phase (d) — Staging migration dry-run
Enable shadow write in staging for an authorized session. Run dual-read comparison. Confirm data integrity. Test rollback. Document aggregate-only session log.

Phase (e) — Production rollout
Full approval gate. Merge to main. Enable shadow write in production. Monitor. Promote to authoritative source only after dual-read comparison is stable. Deprecate mock path.

14. Recommendation

Do not proceed to phase (b) until:
1. All 7 approvals from section 11 are obtained in writing.
2. The DPO has issued a written sign-off per AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 10.
3. Legal has confirmed regulatory compliance for the audit retention period and cross-border transfer restriction.
4. The schema design is reviewed and approved before any implementation begins.

Appendix: Quick references
- Current Admin display adapter: src/lib/audit/adminAuditDisplayAdapter.ts
- Current source of truth: src/lib/audit/sharedMockWriter.ts
- Current persistence config: src/lib/audit/storage/auditPersistenceConfig.ts
- Current component: src/components/admin/AdminAuditComparisonDebugPanel.tsx
- Database model: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md
- Privacy/PDPA model: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md
- Rollout/rollback: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md
- QA checklist: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md
