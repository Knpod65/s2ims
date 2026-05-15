Audit Admin Comparison Debug Panel Stage 3 Runtime Plan AP-9G

1. Overview

This document defines a documentation-only runtime implementation plan for AP-9G Stage 3. It lays out how a future runtime implementation should be designed, gated, and validated. This file does not implement runtime behavior — it is a plan only.

2. Why Stage 3 runtime exists

Stage 3 runtime provides a controlled staging-only review surface for internal Admin reviewers to inspect safe, aggregate-only comparison diagnostics between official audit display rows and prototype/read comparison outputs. The runtime's purpose is diagnostic: to surface mismatches and high-level signals, not to change or replace the official Admin Audit Log.

3. Current state after Stage 3 planning

- Stage 3 planning and post-merge QA completed on main (merge f6c5e56, checkpoint bd3a420, QA commit 4aa1e27).
- Build, token, and audit checks have passed (40/40, 4/4, 137/137).
- Stage 3 runtime has not been implemented or started.
- AP-10 not started. Prototype persistence remains disabled.

4. Runtime goals

- Provide a staging-only Admin surface showing aggregate comparison metrics.
- Preserve privacy: show aggregate counts, categories, dimensions, safe messages and timestamps only.
- Preserve the Admin Audit Log as the authoritative display and data source.
- Keep all feature flags disabled by default; require explicit staging-only enablement.
- Ensure fail-closed behavior: if any gate or privacy check fails, the panel hides.

5. Explicit non-goals

- This planning phase is documentation-only; no runtime code will be changed.
- Do not change routes, navigation, exports, backend/API, migrations, or mock fixtures as part of the plan.
- Do not activate prototype or real persistence in the plan phase.
- Do not expose PII, raw events, or event-level identifiers.

6. Proposed future runtime architecture (conceptual)

- UI: gated Admin-only panel (existing AdminAuditComparisonDebugPanel component may be extended in the future) rendered inside the audit-log page without adding routes or nav.
- Flags: staging-only flag set controlling visibility and comparison reads.
- Read path: comparison metrics derived from safe, aggregated comparison service that reads mock/shared writers and prototype metrics — never switching the official display source.
- Storage: in-memory, ephemeral metrics in staging only; no database persistence or migration required.
- Observability: aggregate metric emitters with strict PII filter.

7. Staging-only review model

- Implementation must support staging-only enablement (feature flags plus environment gate).
- Access restricted to assigned internal Admin reviewers only.
- Non-admin sessions must see no DOM trace or panel artifacts.

8. Admin-only gated render model

- Panel visibility requires all gates: Admin role, `auditAdminComparisonDebugPanelEnabled`, `auditPrototypeReadCompareEnabled`, `auditAdminComparisonStagingReviewEnabled`, and staging environment.
- Any failed gate results in hide-only (return null) behavior identical to Stage 2 gating.

9. Aggregate-only observability model

- Panel displays only aggregated metrics: comparison run count, status counts, mismatch counts, mismatch categories, mismatch dimensions, safeMessage summaries, and last run timestamp.
- No row-level event identifiers, actor/target IDs, reason text, metadata values, or raw route params are permitted.

10. Privacy and PII boundary

- Follow the privacy rules defined in Stage 3 planning: mask or omit any field considered PII. Forbidden classes include actorId, targetId, student ID, national ID, email, phone, bank account, IP, file names, OCR text, reason text, metadata values, and uploaded document identifiers.
- Evidence captured in staging must be aggregate-only. Screenshots or notes containing PII must trigger rollback.

11. Source-of-truth boundary

- The Admin Audit Log display (`adminAuditDisplayAdapter`, `AuditDisplayPresenter`, `sharedMockWriter`) remains the authoritative source of record.
- Prototype read comparisons are diagnostics only and must never be presented as official audit evidence or wired into export/CSV behavior.

12. Export boundary

- No export, CSV, download, or clipboard copy of row-level comparison data is allowed. Any export functionality must remain limited to the official display rows and use the established export paths.

13. Rollout sequence (conceptual)

1. Implement runtime on a separate feature branch with tests and review evidence referencing these docs.
2. Validate local implementation against the QA checklist (docs-only QA pass required before staging rehearsals).
3. Deploy to a staging/internal environment with feature flags defaulted to false.
4. Enable staging-only flags for an assigned internal Admin reviewer session only.
5. Run QA gates, collect aggregate-only reviewer notes, then disable flags.

14. Rollback sequence

- Immediate rollback triggers: any PII exposure, non-admin visibility, prototype data presented as official, export or audit table changes, route/nav changes, or dev log errors.
- Rollback actions: disable all AP-9G Stage 3 flags, hide panel, clear in-memory metrics, run build/tokens/audit checks, route smoke tests, and document the incident in aggregate-only language.

15. QA gates

- Build: `npm run build` passes and shows generated pages are valid.
- Token checks: `npm run check:tokens` pass.
- Audit/event checks: `npm run check:audit-events` pass.
- Routes: Five smoke routes return 200 OK.
- Dev log: no errors or warnings.
- Privacy: No PII found in UI, logs, or artifacts.
- Source-of-truth: Admin Audit Log unchanged and exports unchanged.

16. Recommended next phase

- Implement Stage 3 runtime only in a feature branch after explicit approval and a documented implementation PR that references these docs and the QA checklist.
- Ensure tests cover privacy filtering, gate enforcement, and non-admin absence of DOM traces.
- Do not start AP-10 until AP-9G runtime is approved and staged.

Appendix: Quick references

- Admin Audit Log authoritative paths: `src/lib/audit/adminAuditDisplayAdapter.ts`, `src/lib/audit/sharedMockWriter.ts`.
- Existing staged component: `src/components/admin/AdminAuditComparisonDebugPanel.tsx` (for reference only).
