# S2IMS Import Preview Controlled Internal Demo Feedback Plan — MC65

## 1. Purpose
Define a controlled internal demo feedback plan for the import preview route using MC61-generated synthetic workbooks. This plan captures how demos are run, how feedback is captured and classified, and how follow-ups are handled. It is documentation-only and does not authorize production import, persistence, audit writes, or approvals.

## 2. Scope
In scope:
- Controlled internal demos using synthetic workbooks
- Feedback capture and classification
- Post-demo synthesis and prioritisation

Out of scope:
- Committing generated workbooks
- Using real data
- Enabling Confirm Import or persistence
- Writing audit events or creating official evidence
- AP-10B/AP-10C/AP-11 approval activities

## 3. Demo route
- /admin/master-data/import-preview (preview-only)

## 4. Demo prerequisites
- Latest main checked out and validated (Build 42/42; Tokens 4/4; Audit 502/502)
- Generator run locally to produce synthetic workbooks in artifacts/
- Demo host machine isolated and prepped with artifacts/ files
- Evidence capture location agreed (external store; references only in repo)

## 5. Allowed demo data
- MC61-generated synthetic workbooks only
- Emails must use example.test domain

## 6. Forbidden demo data
- Production or real identifiers
- Student/staff personal data
- Any committed fixture containing real data

## 7. Demo audience
- Product owners
- QA engineers
- Security/privacy representatives
- Technical leads
- Accessibility reviewers

## 8. Facilitator responsibilities
- Run generator locally and prepare artifacts/ (do not commit)
- Provide safety briefing and exact safety copy
- Walk through the demo facilitator script
- Ensure stop conditions are enforced
- Collect feedback using capture template

## 9. Participant responsibilities
- Review demonstrations with safety mindset
- Use feedback capture template without including PII
- Confirm “no approval” by checking no_approval_confirmed

## 10. Feedback capture rules
- Use template: docs/architecture/S2IMS_IMPORT_PREVIEW_CONTROLLED_DEMO_FEEDBACK_CAPTURE_TEMPLATE_MC65.md
- Do not include PII in feedback summaries or screenshots
- Record local screenshot references externally (do not commit)

## 11. No approval / no sign-off boundary
- Demos are feedback-only. They do not constitute approval, sign-off, or evidence for production import.
- Exact safety copy to communicate: “This walkthrough uses synthetic data only. It is for feedback, not approval. It does not authorize real data import, persistence, audit writes, official evidence, AP-10B, AP-10C, or AP-11.”

## 12. Stop conditions
- Confirm Import appears enabled or persistence observed → abort
- Any real PII appears in UI → abort and notify security
- UI crashes or validation behaves unexpectedly causing data leakage → abort

## 13. Post-demo synthesis rules
- Collate feedback in central register (docs/architecture/S2IMS_IMPORT_PREVIEW_CONTROLLED_INTERNAL_DEMO_FEEDBACK_PLAN_MC65_QA_SUMMARY.md)
- Classify per matrix and prioritise
- Create issue entries using MC63/MC65 issue register patterns
- Do not treat feedback entries as approval or evidence

## 14. AP-10B boundary
- AP-10B remains required before committing any fixtures or enabling persistence
- Demos do not substitute governance owner sign-off

## 15. Future MC66 requirements
- MC66 must record demo execution outcomes and synthesis results; include iteration counts, stakeholder attendance, and prioritised issue list

## References
- docs/architecture/S2IMS_IMPORT_PREVIEW_SYNTHETIC_TEST_CLOSURE_MC64.md
- docs/architecture/S2IMS_IMPORT_PREVIEW_CONTROLLED_DEMO_READINESS_MC64.md
- docs/architecture/S2IMS_IMPORT_PREVIEW_MANUAL_TEST_EVIDENCE_SUMMARY_MC63.md

