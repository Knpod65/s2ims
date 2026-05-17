# S²IMS Candidate Review Audit No-op Implementation Checklist (MC11)

## Purpose
This checklist outlines the required and forbidden files, code checks, and validation steps for a future runtime branch implementing no-op wiring connecting MC8 local review actions to MC10 diagnostic event objects. It is documentation-only. No runtime changes are performed by this document.

## Allowed Files for Future Runtime
A future no-op wiring runtime branch may only modify or create the following files (all other files are forbidden unless explicitly documented in a separate plan):
- `src/lib/assignment/candidateReviewNoopWiring.ts` — new module for wiring MC8 to MC10 (must be pure TypeScript, no React)
- `src/lib/assignment/index.ts` — to export the new wiring types/functions (if needed)
- `docs/architecture/` — additional documentation only
- `scripts/check-audit-events.mjs` — may be updated to increase audit checks (must not introduce writes)
- `docs/daily-reports/` — daily reports only
- `docs/qa/` — QA artifacts only
- `package.json` — only if updating dev dependencies that do not affect build/output (must not change build behavior)
- `.eslintrc.js`, `.prettierrc`, etc. — only if tooling updates that do not affect source

## Forbidden Files for Future Runtime
A future no-op wiring runtime branch must NOT modify or create the following files:
- Any file in `src/` outside of the allowed list above (especially `src/components/`, `src/pages/`, `src/app/`, `src/lib/` non-assignment)
- Any file that introduces persistence, backend/API, browser storage, or official evidence
- Any file that modifies UI behavior or enables assignment/approval actions
- Any file that changes AP-10B, AP-10C, or AP-11 artifacts
- `src/lib/assignment/candidateReviewState.ts` — must not modify MC8 state machine
- `src/lib/assignment/candidateReviewAuditEvent.ts` — must not modify MC10 builder (only import and use)
- `src/components/assignment/CandidateSelectionReviewShell.tsx` — must not modify MC8 UI shell
- `package.json` — must not change build scripts, output, or dependencies that affect runtime behavior
- Any configuration file that would enable audit writes, persistence, or backend calls

## Required Code Checks
A future no-op wiring runtime branch must:
- Import only from allowed MC8 and MC10 modules (`candidateReviewState.ts` and `candidateReviewAuditEvent.ts`).
- Build diagnostic event objects using the MC10 builder function.
- Validate the built event objects using the existing audit-check pattern (or equivalent) without mutation.
- Discard the event objects after validation (no write, no persistence, no export).
- Ensure the lifecycle ends at discard; nothing is saved to browser storage, backend, or official audit log.
- Keep UI copy boundary: label events as "diagnostic preview", "not saved", "not official evidence", etc. (if any UI is touched, which is discouraged).
- Maintain safe metadata boundary: no PII, no forbidden fields, no approval/assignment semantics.
- Use the `validateAuditMetadata` pattern or equivalent to check metadata.
- Not introduce any new state persistence beyond React `useState` (if any).
- Not introduce any backend/API calls (`fetch`, `axios`, etc.).
- Not introduce any browser storage (`localStorage`, `sessionStorage`, `IndexedDB`).
- Not introduce any audit writer calls (`sharedMockWriter.write`, `AuditService.record*`).
- Not override the `diagnosticOnly: true` and `officialEvidence: false` from the MC10 builder.
- Not introduce any forbidden event names or metadata fields.
- Not modify the `FORBIDDEN_ACTIONS` set in MC8.
- Not change the AP-10B gate status.
- Not introduce any AP-10C or AP-11 artifacts.

## Required Audit Checks
A future no-op wiring runtime branch must:
- Pass the existing audit-check script (`npm run check:audit-events`) with an equal or higher number of checks than the MC10 baseline.
- The audit-check script must validate that no forbidden event names or metadata are introduced.
- The audit-check script must validate that the no-op wiring does not write, persist, or call backend/API.
- The audit-check script must validate that the `diagnosticOnly` and `officialEvidence` flags are set correctly.
- The audit-check script must validate that the UI copy boundary is respected (if UI is touched).

## Required Route Smoke
A future no-op wiring runtime branch must:
- Pass route smoke checks for:
  - `/login`
  - `/admin/audit-log`
  - `/admin/dashboard`
  - `/staff/applications/app_001`
  - `/staff/applications/app_002`
- All routes must return 200 OK.
- The dev log must be clean (no warnings or errors).

## Required Dev Log Checks
A future no-op wiring runtime branch must:
- Have a clean dev log (no warnings or errors) during build and route smoke.
- Not introduce any new warnings or errors related to audit writes, persistence, or backend calls.

## Rollback Checklist
A future no-op wiring runtime branch must:
- Have no persistence, so rollback is implicit (nothing to roll back).
- On validation failure, discard the event object and log a dev-only warning (no UI impact).
- On build/test failure, the branch must not be merged.
- On any forbidden detection (write, persistence, PII, etc.), the branch must be rejected.
- Failure to meet the no-op runtime gate blocks merge.

## Merge Checklist
A future no-op wiring runtime branch must:
- Pass all required code checks, audit checks, route smoke, and dev log checks.
- Have a docs-only diff for the planning phase (if applicable).
- Be reviewed and approved via the standard code review process.
- Be merged only after the no-op runtime gate is satisfied.

## Post-Merge QA Checklist
After merging a future no-op wiring runtime branch:
- Run build/tokens/audit/route smoke/dev log to confirm nothing broke.
- Confirm that the no-op wiring does not introduce audit writes, persistence, or backend/API.
- Confirm that the MC1–MC10 boundaries are preserved.
- Confirm that AP-10B gate remains unchanged.
- Confirm that AP-10C and AP-11 remain blocked.
- Update documentation and daily reports as needed.
