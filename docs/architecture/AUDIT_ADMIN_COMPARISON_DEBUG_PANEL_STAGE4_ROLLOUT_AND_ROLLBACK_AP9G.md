Audit Admin Comparison Debug Panel Stage 4 Rollout and Rollback AP-9G

1. Stage 4 rollout stages

Stage 4 is divided into four sequential stages. No stage may begin before the previous stage is complete and all required approvals for that stage are obtained.

Stage A — Docs-only plan (current stage)
Create Stage 4 planning documentation. No runtime change. No flag change. Completed when all five Stage 4 plan docs and the daily report are committed and merged.

Stage B — Staging dry-run with flags disabled
Implement Stage 4 runtime on a separate feature branch. Deploy to staging with all flags defaulting false. Run build, token, and audit checks. Run route smoke. Confirm panel renders null. Collect engineering and QA approval.

Stage C — Staging flag enable for assigned admin reviewer
Apply staging-only flag override for one assigned internal Admin reviewer session. Collect aggregate-only session notes (no PII). Run post-session validation: flags disabled, build/tokens/audit re-run, routes re-smoked, rollback tested. Collect privacy/PDPA, product/admin owner, and rollback owner approval.

Stage D — Production merge with flags permanently disabled
Merge the Stage 4 runtime PR to main. Confirm all flags default false in DEFAULT_AUDIT_PERSISTENCE_CONFIG. Run post-merge build, token, and audit checks. Run route smoke. Confirm panel renders null in production. Push. Document in a merge checkpoint.

2. Production flag rollout sequence

The sequence for any Stage 4 runtime production merge:

1. Create feature branch from main
2. Implement Stage 4 runtime changes following this plan
3. Run: npm run build (expect 40/40), npm run check:tokens (expect 4/4), npm run check:audit-events (expect 139/139)
4. Run route smoke: five routes × 200 OK, dev log clean
5. Confirm DEFAULT_AUDIT_PERSISTENCE_CONFIG has all flags false
6. Open PR referencing these docs and the QA checklist
7. Collect all five approvals per AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_APPROVAL_GATE_AP9G.md
8. Merge with --no-ff
9. Run post-merge build, token, and audit checks
10. Run post-merge route smoke
11. Confirm panel renders null in default config on main
12. Push main
13. Create merge checkpoint daily report

3. Staging-to-production promotion criteria

All of the following must be true before a Stage 4 runtime branch may be merged to main:

- All five approvals obtained per the approval gate doc
- QA checklist 100% complete (build 40/40, tokens 4/4, audit 139/139, routes 5×200, dev log clean, privacy checklist)
- Staging session log reviewed — aggregate-only, no PII
- Rollback tested in staging: flags disabled, panel renders null, checks pass
- DEFAULT_AUDIT_PERSISTENCE_CONFIG confirms all flags false at time of merge

4. Rollback triggers

Immediate rollback is required for any of the following:

- PII appears in any surface: UI render, console log, server log, analytics event, screenshot, or session note
- Panel is visible to a non-admin session in any environment
- Comparison data appears in any export, CSV, download, or clipboard operation
- Build fails after any flag change
- Token checks fail after any flag change
- Audit/notification checks fail after any flag change
- Route smoke returns non-200 for any of the five required routes after any flag change
- Any gate condition removed, reordered, or weakened in the component
- "Not official evidence" note absent from any enabled render

5. Rollback actions

Execute in order:

1. Disable all AP-9G flags in the staging config override (set all to false or remove the override file)
2. Confirm DEFAULT_AUDIT_PERSISTENCE_CONFIG still has all flags false (no code change was made to it)
3. Run: npm run build — confirm 40/40, 0 type errors
4. Run: npm run check:tokens — confirm 4/4
5. Run: npm run check:audit-events — confirm 139/139
6. Kill dev server, clear .next, start dev server, wait 10s
7. Run route smoke: curl five routes, confirm all 200 OK
8. Grep dev log for error/warn/hydrat — confirm clean
9. Stop dev server
10. Document the rollback in aggregate-only language (no PII in rollback notes): what triggered the rollback, which checks were re-run, what the results were

6. Post-rollback validation

After all rollback actions are complete, confirm:

- Build: 40/40 routes, 0 type errors
- Token checks: 4/4
- Audit/notification checks: 139/139
- Routes: five smoke routes × 200 OK
- Dev log: clean
- Panel renders null in default config (adminDebugPanelEnabled: false confirmed)
- DEFAULT_AUDIT_PERSISTENCE_CONFIG unchanged from pre-rollback state

7. Route smoke requirements

The following five routes must return HTTP 200 OK in all smoke tests (pre-merge, post-merge, post-rollback):

- /login
- /admin/audit-log
- /admin/dashboard
- /staff/applications/app_001
- /staff/applications/app_002

Dev log must have no errors, warnings, or hydration issues for the smoke run to pass.

8. Audit checks required after rollback

After any rollback, the following checks must pass before the rollback is considered complete:

- npm run check:audit-events: must pass 139/139
- npm run check:tokens: must pass 4/4
- npm run build: must pass 40/40 routes, 0 type errors

Failure of any check after rollback is a secondary incident requiring immediate investigation before any further action.
