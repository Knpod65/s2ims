Audit Admin Comparison Debug Panel Stage 4 Approval Gate AP-9G

1. Required approvals before any Stage 4 runtime

All five of the following approvals must be obtained before any Stage 4 runtime feature branch is opened, any staging-only flag override is applied, or any production merge is considered. No single approval substitutes for another. Partial approval (fewer than all five owners) is a blocking condition.

2. Engineering approval

Scope: implementation PR review.

Required sign-off items:
- Implementation PR link provided and reviewed
- Diff scope confirmed: no forbidden files (src/data/mock/*, package.json, backend/API, database migration, notification runtime)
- All three AP-9G flags confirmed false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- Role guard confirmed first check in component
- Enabled guard confirmed second check in component
- Stage 3 gate confirmed to require both prototypeMetricsEnabled and stagingReviewEnabled
- Test coverage for gate enforcement, privacy filtering, and non-admin null render
- Build passes 40/40; token checks pass 4/4; audit checks pass 139/139
- All five route smoke tests return 200 OK
- Dev log clean

3. Privacy/PDPA approval

Scope: data surface and logging review.

Required sign-off items:
- Aggregate-only data surface confirmed (only items from section 5 of the production safety doc are shown)
- All forbidden data classes (section 4 of the production safety doc) confirmed absent from all render paths
- "Prototype reads are diagnostic — not official audit evidence" note confirmed present in all non-null render states
- No PII in any log line, analytics event, or session note
- Logging restrictions (section 8 of production safety doc) confirmed in implementation
- Export restrictions (section 7 of production safety doc) confirmed: no comparison data in CSV, clipboard, or download
- PDPA alignment confirmed for all data classes shown in the aggregate surface

4. Product/Admin owner approval

Scope: access model and user-facing behavior review.

Required sign-off items:
- Admin-only access confirmed: role guard enforced, non-admin sessions render null with no DOM trace
- Staging-only enablement confirmed: no flag defaults to true in any production config
- Assigned-reviewer-only access for any staging session confirmed
- No panel artifacts visible to non-admin users in any environment
- "Not official evidence" note reviewed and approved as user-facing copy
- Admin Audit Log table confirmed as sole authoritative display for all non-staging production states

5. QA approval

Scope: QA checklist completion.

Required sign-off items:
- All items in AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_QA_CHECKLIST_AP9G.md checked and confirmed
- Build: 40/40 routes, 0 type errors
- Token checks: 4/4
- Audit/event checks: 139/139
- Route smoke: five routes × 200 OK
- Dev log: clean
- Privacy checklist: all items confirmed
- Rollback checklist: all items confirmed

6. Rollback owner approval

Scope: rollback plan and readiness review.

Required sign-off items:
- Rollback owner identified by name and role
- Rollback procedure in AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md reviewed and confirmed applicable
- Rollback tested in staging: flags disabled, build/tokens/audit checks re-run, routes re-smoked, dev log reviewed
- Post-rollback validation results documented (aggregate-only: no PII in rollback notes)
- Rollback owner available and reachable during any staging session

7. Evidence required before approval

The following evidence must be assembled and available for review before any approval sign-off is collected:

- Implementation PR link with diff scope summary
- QA checklist (AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_QA_CHECKLIST_AP9G.md) with all items checked and dated
- Privacy review notes: aggregate-only; must not contain any value from the forbidden list in section 4 of the production safety doc
- Staging session log: aggregate-only counts and statuses; no PII; reviewer name and session duration included
- Rollback test results: build/tokens/audit check outputs; route smoke results; confirmation panel returns null after flags disabled
- Source-of-truth confirmation: Admin Audit Log table and CSV export unchanged before and after staging session

8. Blocking conditions

Any of the following prevents approval from proceeding:

- Any item on the evidence list in section 7 is missing or incomplete
- Any AP-9G flag defaults to true in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- Any PII found in any surface during review or staging
- Rollback not tested in staging before approval is requested
- Approval from fewer than all five owners
- QA checklist not 100% complete
- Build, token, or audit checks not passing at time of approval
- Route smoke not passing at time of approval
- Rollback owner not identified
