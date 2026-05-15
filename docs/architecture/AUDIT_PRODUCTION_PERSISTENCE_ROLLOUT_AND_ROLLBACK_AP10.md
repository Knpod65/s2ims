Audit Production Persistence Rollout and Rollback AP-10

1. AP-10 rollout phases

AP-10 is a five-phase program. Each phase is gated by the completion criteria of the previous phase and requires explicit approval before proceeding.

| Phase | Name | Status |
|-------|------|--------|
| (a) | Docs-only planning | Current phase |
| (b) | Schema design and DPO/legal review | Not started |
| (c) | Implementation on feature branch | Not started |
| (d) | Staging migration dry-run | Not started |
| (e) | Production rollout | Not started |

Phase (a) — Docs-only planning (current):
Create the AP-10 planning document package. No runtime code changes. No schema files. No migration files. No DB ORM files. Completed when all 5 architecture docs and the daily report are merged to main and post-merge QA passes.

Phase (b) — Schema design and DPO/legal review:
Design the production event store schema. DPO, legal, and engineering review the schema. No implementation. All 7 approvals from AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md section 11 are required before this phase begins.

Phase (c) — Implementation (feature branch):
Implement `AuditPersistenceService` on a new feature branch. Shadow-write flag defaults `false`. All feature flags default `false`. Build, QA gate, privacy checklist, schema review. PR must reference the AP-10 planning docs and the QA checklist.

Phase (d) — Staging migration dry-run:
Enable shadow write in staging using a staging-only config override (never a change to `DEFAULT_AUDIT_PERSISTENCE_CONFIG`). Run dual-read comparison. Confirm data integrity. Test rollback from each migration phase. Document session log in aggregate-only language.

Phase (e) — Production rollout:
Full 7-owner approval gate. Merge to main. Enable shadow write in production. Monitor. Promote persistence store to authoritative source only after dual-read comparison is stable. Deprecate mock path in a separate, subsequent PR.

2. Phase-by-phase entry criteria

Phase (b) entry requirements:
- All 5 AP-10 architecture docs merged to main.
- Post-merge QA passed (build 40/40, tokens 4/4, audit 139/139, routes 5×200 OK, dev log clean).
- All 7 approvals from AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md section 11 obtained in writing.
- DPO written sign-off per AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 10.
- Legal has confirmed regulatory compliance for the audit retention period and cross-border transfer restriction.

Phase (c) entry requirements:
- Phase (b) complete: schema reviewed and approved by DPO and engineering.
- All 7 approvals confirmed in writing.
- Implementation PR scope confirmed: `AuditPersistenceService` isolated from display layer; shadow-write defaults `false`; no Admin UI changes; no route changes.
- QA checklist (AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md) reviewed and accepted as the gate for the implementation PR.

Phase (d) entry requirements:
- Phase (c) implementation PR merged to main and QA gate passed.
- Rollback owner identified and rollback procedure tested in a development environment.
- Staging config override prepared (not a `DEFAULT_AUDIT_PERSISTENCE_CONFIG` change).
- DPO notified of planned staging dry-run and has not objected.

Phase (e) entry requirements:
- Phase (d) staging dry-run completed: shadow-write tested, dual-read comparison run, rollback tested from each migration phase, data integrity confirmed.
- All 7 approvals re-confirmed as still valid (they may have a time limit — verify before proceeding).
- Production config override prepared.
- On-call escalation plan confirmed.
- Rollback owner confirmed available for the duration of the production rollout window.

3. Production rollout sequence

The following 12-step ordered procedure applies to phase (e). Steps must be executed in order. Do not skip steps.

1. Confirm all 7 approvals are current and in writing.
2. Confirm staging dry-run results are documented and mismatch rate ≤ 0.1%.
3. Confirm rollback owner is available and the emergency rollback procedure has been tested within the last 7 days.
4. Create the production feature branch from main.
5. Implement the production config override (set `shadowWrites: true` only — all other flags remain `false`).
6. Submit PR. Engineering and QA review.
7. Run QA gate: build 40/40, tokens 4/4, audit 139/139, routes 5×200 OK, dev log clean.
8. Merge to main with `--no-ff`.
9. Deploy to production. Verify shadow write is active: check persistence write count metric (aggregate only, no event payloads).
10. Monitor for 24 hours minimum: write failure rate, checksum verification rate, Admin display behavior.
11. If stable, proceed to dual-read comparison phase. If not stable, execute rollback (section 5).
12. Document the session checkpoint in aggregate-only language. Notify DPO that phase (e) is active.

Promotion from shadow write to authoritative source is a separate step requiring a separate PR and the same 7-owner approval gate.

4. Rollback triggers

Any of the following conditions triggers an immediate rollback:

- PII appears in any log line, metric label, alert payload, or Admin display surface.
- Persistence write failure rate exceeds 1% over any 5-minute window.
- Admin display shows incorrect data (mismatch between expected and displayed records).
- `checksumHash` verification fails for any record.
- Build fails after a flag change.
- `npm run check:tokens` fails after a flag change.
- `npm run check:audit-events` count drops below the pre-rollout baseline.
- Any route smoke test returns non-200.
- Dev log shows errors, warnings, or hydration issues introduced after flag change.
- DPO revokes authorization or requests an immediate halt.

5. Rollback actions

Execute the following 8 steps in order:

1. Set `shadowWrites: false` in the production config override (or staging config override, as applicable).
2. Verify that `adminAuditDisplayAdapter` is reading from the mock/shared writer path (not from the production store).
3. Run build: `npm run build` — must pass 40/40 routes, 0 type errors.
4. Run token check: `npm run check:tokens` — must pass 4/4.
5. Run audit checks: `npm run check:audit-events` — must return baseline count (139 minimum; if persistence checks were added, must return the new baseline).
6. Run route smoke: 5 routes must return 200 OK. Dev log must be clean.
7. Document the rollback in aggregate-only language: what triggered the rollback, what flag was changed, what checks were run, what the results were. No PII in the rollback report.
8. Notify DPO immediately after rollback is confirmed stable.

Do not re-enable any persistence flag until the root cause of the rollback trigger is identified and a remediation plan is reviewed by the engineering and privacy owners.

6. Post-rollback validation

All of the following must be confirmed after any rollback before the system is considered stable:

- Build: `npm run build` passes 40/40 routes, 0 type errors.
- Token check: `npm run check:tokens` passes 4/4.
- Audit checks: `npm run check:audit-events` returns baseline count.
- Routes: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` all return 200 OK.
- Dev log: no errors, warnings, or hydration issues.
- `adminAuditDisplayAdapter` confirmed reading from mock/shared writer path — not from production store.
- `sharedMockWriter` confirmed active and unmodified.
- No PII in any log line or metric.

Post-rollback validation is required before the rollback is reported as complete. It is not sufficient to set the flag to `false` and assume the system is stable — the checks must be run and the results documented.

7. Emergency rollback

The emergency rollback procedure must be executable in under 5 minutes. It is tested in staging before phase (e) begins.

Step 1: Set `shadowWrites: false` in the staging or production config override.

Step 2: Restart the service (or trigger a config reload, depending on the deployment model).

Step 3: Verify that the Admin Audit Log display reads from the mock/shared writer path. Spot-check one Admin audit log page load — it must show mock data, not a persistence error.

Step 4: Alert the DPO and rollback owner that an emergency rollback was executed, the time it was executed, and the immediate trigger.

The emergency rollback does not require running the full QA gate — that follows as post-rollback validation. The goal of the emergency rollback is to restore the known-good state within 5 minutes and protect the Admin display path.

Emergency rollback contact: the rollback owner must be identified by name and contact method before phase (e) begins. The rollback owner must be reachable within 10 minutes at any time during the production rollout window.
