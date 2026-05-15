# Audit Admin Comparison Debug Panel Stage 3 Runtime Rollout AP-9G

1. Purpose

This document outlines the staged rollout and rollback sequence for a future Stage 3 runtime implementation. It is documentation-only and must be followed by any implementer.

2. Preconditions

- Stage 3 planning and post-merge QA completed on main.
- Runtime to be implemented on a separate feature branch.
- Tests verifying privacy filters and gate enforcement must exist prior to staging deployment.

3. Stage 3A — Hidden verification

- Deploy implementation to staging with all flags false.
- Verify that the component renders hidden (null) for Admin and non-admin when flags are false.

4. Stage 3B — Admin-only staging render

- Enable required flags for a single Admin reviewer session in staging only.
- Confirm Admin-only visibility and non-admin no DOM trace in parallel sessions.

5. Stage 3C — Aggregate observability review

- Run comparison flows; collect aggregate mismatch metrics and reviewer notes (aggregate language only).

6. Stage 3D — Privacy review

- Verify no PII appears in UI, logs, or artifacts. Conduct sampling of logs and reviewer notes.

7. Stage 3E — Rollback rehearsal

- Disable flags and confirm panel hides and metrics clear. Run post-rollback validation.

8. Rollback triggers

- any PII exposure
- non-admin DOM trace
- prototype data mispresented as official
- admin audit table change
- export changed
- route/nav added
- build/check failures
- route regression
- dev log error

9. Rollback actions

- disable all AP-9G Stage 3 flags
- hide panel
- clear in-memory metrics
- run build/tokens/audit checks
- route smoke the five standard routes
- document incident (aggregate-only)

10. Post-rollback validation

- Build passes (40/40)
- Tokens pass (4/4)
- Audit/events pass (137/137)
- Five smoke routes return 200 OK
- Dev log clean

11. QA checklist

- Confirm all rollback triggers and actions are tested in staging.
- Confirm flags disable clears metrics and hides panel.
