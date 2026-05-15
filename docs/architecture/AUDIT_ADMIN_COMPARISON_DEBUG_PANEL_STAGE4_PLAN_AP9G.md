Audit Admin Comparison Debug Panel Stage 4 Plan AP-9G

1. Overview

This document defines a documentation-only Stage 4 plan for the Admin Audit Comparison Debug Panel (AP-9G). Stage 4 goal is production-disabled-by-default readiness: the component is included in the production build, all feature flags remain false by default, and no DOM trace appears for any user without explicit flag enablement through a separate, approved, staging-only config override. This file does not implement runtime behavior — it is a plan only.

2. Why Stage 4 exists

Stage 3 runtime delivered a staging-only aggregate observability surface gated behind three boolean flags, all defaulting to false. Stage 4 formalizes the production posture: the component ships in the production build permanently disabled, subject to all existing gates, with a documented approval process, rollout sequence, rollback plan, and privacy checklist required before any enablement attempt in any environment.

Stage 4 does not activate the panel. It defines the requirements, approvals, and verification steps that must be satisfied before any future activation is considered.

3. Current state after Stage 3 runtime

- Implementation commit: 663ab54
- Merge commit: c5ba835
- Post-merge QA commit: 76e0f63
- All three feature flags default false in DEFAULT_AUDIT_PERSISTENCE_CONFIG:
  - adminDebugPanelEnabled: false
  - prototypeMetricsEnabled: false
  - adminComparisonStagingReviewEnabled: false
- Panel renders null in default configuration — no DOM trace
- Build: 40/40 routes, 0 type errors
- Audit/notification checks: 139/139
- AP-10 not started
- Prototype persistence not activated
- Real persistence not added

4. Stage 4 goal

Ensure the production build meets the following criteria before any enablement is considered:

- Component is present in the production bundle but returns null in the default config
- All three flags permanently default false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- No flag is enabled via DEFAULT_AUDIT_PERSISTENCE_CONFIG — only staging-only environment-scoped overrides are permitted
- All existing gating logic is preserved: role guard first, enabled guard second, Stage 3 metrics gate third
- All approval, privacy, rollout, rollback, and QA requirements defined in the companion docs are satisfied
- The Admin Audit Log table remains the authoritative display source in all production states

5. Explicit non-goals

- This planning phase is documentation-only; no runtime or src/* changes will be made
- Do not enable any AP-9G flag in this planning phase
- Do not activate prototype or real persistence
- Do not add backend/API behavior, database migrations, or mock fixture changes
- Do not change routes, navigation, exports, Staff callbacks, or notification behavior
- Do not expose PII in any form
- Do not start AP-10

6. Required approvals before any Stage 4 runtime

All five of the following approvals are required before any Stage 4 runtime work begins on a feature branch:

- Engineering approval: implementation PR, diff scope, test coverage, flag defaults confirmed
- Privacy/PDPA approval: aggregate-only surface, PII absence, "not official evidence" note, logging restrictions
- Product/Admin owner approval: admin-only access, staging-only enablement, non-admin null render
- QA approval: full QA checklist pass including build, tokens, audit checks, route smoke, and privacy checklist
- Rollback owner approval: rollback plan documented, rollback owner identified, rollback tested in staging

See AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_APPROVAL_GATE_AP9G.md for the full approval evidence requirements.

7. Environment policy

- Production: DEFAULT_AUDIT_PERSISTENCE_CONFIG must always have all three flags set to false. No production code path may set any AP-9G flag to true.
- Staging: flags may be enabled only via a staging-only config override file or environment variable that is not committed to the repository and not promoted to production.
- Local development: flags may be enabled only for assigned internal Admin reviewer sessions during a documented QA gate.
- Any change to DEFAULT_AUDIT_PERSISTENCE_CONFIG that sets any flag to true is a blocking violation and must not be merged.

8. Feature flag policy

The three AP-9G flags and their required states:

- adminDebugPanelEnabled — must default false; controls top-level panel visibility
- prototypeMetricsEnabled — must default false; controls Stage 3 metrics surface availability
- adminComparisonStagingReviewEnabled — must default false; controls Stage 3 aggregate render path

All three must be false in DEFAULT_AUDIT_PERSISTENCE_CONFIG at all times. Environment-scoped overrides for staging sessions are the only permitted enablement mechanism. Overrides must not be committed to main. Each override session must be logged in aggregate-only language with no PII.

9. Admin-only production access rules

- The role guard (role !== 'admin' → return null) is the first check in the component and must not be removed or reordered
- No panel DOM must appear for non-admin sessions in any production state
- Any flag enablement session must restrict access to an assigned internal Admin reviewer only
- An aggregate-only audit trail of each flag enablement session must be maintained
- Non-admin users must have zero visible panel artifacts regardless of flag state

10. Privacy/compliance requirements

Thailand PDPA and internal PII policy alignment:

- Only aggregate counts, status categories, safeMessage summaries, and last run timestamps may be shown in any enabled state
- Forbidden display classes (must never appear in any surface):
  - actorId, targetId, student ID, national ID
  - email address, phone number, bank account number
  - IP address, file names, OCR text, uploaded document identifiers
  - reason text, metadata values, raw event IDs (sourceEventId, prototypeEventId)
- The note "Prototype reads are diagnostic — not official audit evidence" is mandatory in all enabled render states
- Any PII discovered in the UI, logs, screenshots, or session notes triggers immediate rollback
- Evidence and session notes from any staging review must use aggregate-only language

11. Monitoring/observability requirements

- Aggregate metrics only may appear in logs, analytics, or observability pipelines from the debug panel
- No row-level identifiers, actor/target values, or event payloads may appear in any log emitted by the panel or its comparison service
- No comparison data may be exported, copied to clipboard, or downloaded
- Any PII detected in monitoring data is an incident trigger (see section 12)
- The official Admin Audit Log CSV export path must remain unchanged and must not include comparison data

12. Rollback criteria

Immediate rollback is required if any of the following occur:

- PII appears in any surface (UI, logs, screenshots, session notes, analytics)
- Panel is visible to non-admin sessions in any environment
- Comparison data appears in any export, download, or CSV
- Dev log contains errors or warnings with PII context
- Build, token, or audit checks fail after a flag change
- Route smoke returns non-200 for any of the five required routes after a flag change
- Any gate is bypassed or reordered in the component

See AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md for the full rollback procedure.

13. QA gates

The following checks must all pass before any Stage 4 runtime PR may be merged:

- Build: npm run build passes and shows 40/40 routes generated, 0 type errors
- Token checks: npm run check:tokens passes 4/4
- Audit/event checks: npm run check:audit-events passes 139/139
- Routes: five smoke routes (/login, /admin/audit-log, /admin/dashboard, /staff/applications/app_001, /staff/applications/app_002) return 200 OK
- Dev log: no errors, warnings, or hydration issues
- Privacy checklist: all items in AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_QA_CHECKLIST_AP9G.md signed off
- Source-of-truth: Admin Audit Log table and CSV export unchanged

See AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_QA_CHECKLIST_AP9G.md for the full checklist.

14. Recommendation

Do not proceed to AP-10 until:

1. All five approvals from section 6 are obtained in writing
2. Stage 4 runtime is implemented on a separate feature branch with tests referencing these docs
3. The full QA gate from section 13 is passed on that branch
4. A staging-only enablement session has been completed, reviewed, and closed with aggregate-only session notes
5. The rollback plan has been tested in staging

Appendix: Quick references

- Feature flags: src/lib/audit/storage/auditPersistenceConfig.ts
- Component: src/components/admin/AdminAuditComparisonDebugPanel.tsx
- Page wiring: src/app/admin/audit-log/page.tsx
- Admin display adapter: src/lib/audit/adminAuditDisplayAdapter.ts
- Shared mock writer: src/lib/audit/sharedMockWriter.ts
- Production safety rules: docs/architecture/AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_PRODUCTION_SAFETY_AP9G.md
- Approval gate: docs/architecture/AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_APPROVAL_GATE_AP9G.md
- Rollout and rollback: docs/architecture/AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md
- QA checklist: docs/architecture/AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_QA_CHECKLIST_AP9G.md
