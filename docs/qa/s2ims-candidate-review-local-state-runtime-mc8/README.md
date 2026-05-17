# QA — S2IMS Candidate Review Local State Runtime (MC8)

This folder contains QA guidance and evidence checklist for MC8 (local-only candidate review state runtime).

Checklist:
- Build: `npm run build` → success
- Tokens: `npm run check:tokens` → pass
- Audit checks: `node scripts/check-audit-events.mjs` → pass
- Route smoke: 5 routes `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` → 200 OK each
- Dev logs: no errors/warnings
- Confirm UI: when rendering `CandidateSelectionReviewShell` with `readonly={false}`, action buttons update state locally and do not call APIs or write audits.

Evidence:
- Add screenshots or pasted terminal outputs here during QA runs.
