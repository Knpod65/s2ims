Audit Admin Comparison Debug Panel Stage 4 QA Checklist AP-9G

1. Docs-only QA checklist

For the Stage 4 planning phase only. All items must be checked before the planning branch is merged.

- [ ] AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_PLAN_AP9G.md created and complete
- [ ] AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_PRODUCTION_SAFETY_AP9G.md created and complete
- [ ] AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_APPROVAL_GATE_AP9G.md created and complete
- [ ] AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md created and complete
- [ ] AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_QA_CHECKLIST_AP9G.md created and complete
- [ ] NEXT_RENOVATION_STEPS.md updated with Stage 4 plan section
- [ ] Daily report created in docs/daily-reports/
- [ ] No src/* files changed in this planning branch

2. Runtime safety checklist

For any Stage 4 runtime branch. All items must be confirmed before merging to main.

- [ ] adminDebugPanelEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] prototypeMetricsEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] adminComparisonStagingReviewEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] Role guard (role !== 'admin' → return null) is first check in AdminAuditComparisonDebugPanel
- [ ] Enabled guard (!enabled → return null) is second check in AdminAuditComparisonDebugPanel
- [ ] Stage 3 gate requires both prototypeMetricsEnabled AND stagingReviewEnabled to be true
- [ ] Panel renders null in default configuration (all flags false)
- [ ] No PII in Stage 3 aggregate render path
- [ ] "Prototype reads are diagnostic — not official audit evidence" note present in all non-null render states
- [ ] adminAuditDisplayAdapter.ts unchanged — boundary preserved
- [ ] sharedMockWriter.ts unchanged — source of truth preserved
- [ ] Official audit CSV export path unchanged

3. Production flag checklist

Confirm the following flag values in DEFAULT_AUDIT_PERSISTENCE_CONFIG (src/lib/audit/storage/auditPersistenceConfig.ts) before any merge to main:

- [ ] adminDebugPanelEnabled: false
- [ ] prototypeMetricsEnabled: false
- [ ] adminComparisonStagingReviewEnabled: false
- [ ] prototypeEnabled: false
- [ ] shadowWrites: false
- [ ] readFromPrototype: false

4. Privacy checklist

For any Stage 4 runtime branch and any staging enablement session. All items must be confirmed.

- [ ] actorId not rendered in any panel path
- [ ] targetId not rendered in any panel path
- [ ] reason not rendered in any panel path
- [ ] metadata values not rendered in any panel path
- [ ] raw event IDs (sourceEventId, prototypeEventId) not rendered in any panel path
- [ ] student ID not rendered in any panel path (in any format)
- [ ] national ID not rendered in any panel path (in any format)
- [ ] "Not official audit evidence" note mandatory in all non-null render states
- [ ] No PII in console logs or server logs from the panel or comparison service
- [ ] Session notes and screenshots are aggregate-only (no values from the forbidden list)

5. Access control checklist

- [ ] Role guard enforced — component returns null immediately for non-admin roles
- [ ] Non-admin sessions render null with no panel DOM trace
- [ ] No panel DOM artifacts visible to non-admin users in any environment
- [ ] Staging enablement sessions restricted to assigned internal Admin reviewer only
- [ ] Aggregate-only audit trail maintained for each flag enablement session

6. Export/logging checklist

- [ ] No comparison data in the Admin Audit Log CSV export (exportAuditCSV function unchanged)
- [ ] No comparison data accessible via clipboard, download, or any export action in the panel
- [ ] No PII in console logs from the debug panel
- [ ] No PII in server-side logs from the debug panel or comparison service
- [ ] Official CSV export path (src/app/admin/audit-log/page.tsx exportAuditCSV) confirmed unchanged

7. Rollback checklist

- [ ] Rollback owner identified by name and role
- [ ] Rollback procedure documented in AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md and reviewed
- [ ] Rollback tested in staging: all AP-9G flags disabled, panel confirmed to render null
- [ ] Post-rollback build passes: 40/40 routes, 0 type errors
- [ ] Post-rollback route smoke passes: five routes × 200 OK, dev log clean
- [ ] Post-rollback audit checks pass: 139/139

8. Final approval checklist

All five approvals must be confirmed before any Stage 4 runtime PR is merged to main:

- [ ] Engineering approved (implementation PR, diff scope, test coverage, flag defaults)
- [ ] Privacy/PDPA approved (aggregate-only surface, PII absence, logging restrictions)
- [ ] Product/Admin owner approved (admin-only access, staging-only enablement, non-admin null render)
- [ ] QA approved (full QA checklist pass: build, tokens, audit checks, route smoke, privacy checklist)
- [ ] Rollback owner approved (rollback plan, rollback owner identified, rollback tested in staging)
