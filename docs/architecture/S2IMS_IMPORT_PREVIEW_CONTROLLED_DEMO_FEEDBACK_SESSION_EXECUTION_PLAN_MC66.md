# S2IMS Import Preview Controlled Demo Feedback Session Execution Plan — MC66

## 1. Purpose
Document a controlled internal demo feedback session execution plan for the import preview route. This is a plan only — the session is not conducted as part of MC66.

## 2. Scope
- Execution plan for a future controlled internal demo feedback session using synthetic workbooks
- Roles, agendas, checklists, feedback capture, and escalation rules

Out of scope:
- Conducting the demo session (MC66 does not execute the session)
- Collecting real feedback or approvals
- Committing generated workbooks

## 3. Session status
- Plan only. No session executed in MC66.

## 4. Demo route
- /admin/master-data/import-preview

## 5. Demo prerequisites
- Latest main validated: Build 42/42; Tokens 4/4; Audit 502/502
- Synthetic workbooks created locally via tools/generate-synthetic-master-data-workbooks.mjs
- Demo host environment isolated; artifacts/ directory available locally

## 6. Attendee categories
- Product owners
- QA engineers
- Security/privacy representatives
- Technical leads
- Accessibility reviewers
- Operational stakeholders (observers)

## 7. Facilitator responsibilities
- Present safety disclaimer and exact safety copy
- Run through agenda and demo scenarios using synthetic workbooks
- Enforce stop conditions
- Ensure note-takers use capture template and mark no_approval_confirmed

## 8. Observer / Note-taker responsibilities
- Capture feedback using capture template (no PII)
- Mark governance_sensitive items clearly
- Avoid recording screenshots containing PII

## 9. Session agenda
- Opening and safety briefing (5m)
- Generator manifest & artifacts verification (5m)
- Upload and preview canonical workbooks (30m)
- Focused scenarios: duplicates/missing/forbidden/formula/row-limit (20m)
- Q&A and live notes (15m)
- Wrap-up and next steps (5m)

## 10. Feedback capture workflow
- Use template: docs/architecture/S2IMS_IMPORT_PREVIEW_CONTROLLED_DEMO_FEEDBACK_CAPTURE_TEMPLATE_MC65.md
- Store screenshots externally; reference in feedback entry (do not commit)
- No PII in feedback summaries

## 11. Stop conditions
- Confirm Import becomes enabled or persistence observed
- Real PII surfaced in UI
- Unexpected writes or audit logs generated
- Any Blocked severity identified

## 12. Governance-sensitive escalation
- Any governance_sensitive=yes entries escalate to governance_review_group
- Escalation must avoid treating entries as approval; they are for review only

## 13. Post-session handling
- Collate captured feedback into MC67 (execution report) when session actually occurs
- Prioritise items per classification matrix and assign owners
- Record actions in issue tracker (no approval or sign-off recorded in MC66)

## 14. MC67 execution report requirements
- MC67 must record attendance, artefacts used, feedback entries, prioritised actions, and remediation timeline
- MC67 must not claim approvals or enable AP-10B without governance

Safety copy (exact):
"This walkthrough uses synthetic data only. It is for feedback, not approval. It does not authorize real data import, persistence, audit writes, official evidence, AP-10B, AP-10C, or AP-11."
