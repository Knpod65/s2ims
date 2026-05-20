# S2IMS Import Preview Controlled Demo Facilitator Script — MC65

## Opening statement
"This walkthrough uses synthetic data only. It is for feedback, not approval. It does not authorize real data import, persistence, audit writes, official evidence, AP-10B, AP-10C, or AP-11."

## Safety disclaimer
- Confirm no real data is present and artifacts are synthetic-only
- Confirm artifacts folder is local and not committed

## Route walkthrough
1. Navigate to /admin/master-data/import-preview
2. Upload synthetic_staff_master_valid.xlsx and demonstrate preview
3. Show validation panel and explain each item
4. Repeat with duplicate email, missing email, forbidden columns, formula cells

## File preview explanation
- Show how validator highlights rows and messages
- Explain manual mapping for missing cmu_mail

## Validation behavior explanation
- Describe warning vs error vs blocked semantics

## Confirm Import disabled explanation
- Emphasize that Confirm Import is disabled and preview is diagnostic only

## What feedback to give
- UX clarity, copy, validation clarity, accessibility issues

## What feedback not to give
- Do not request enabling Confirm Import, persistence, or audit writes

## Q&A guardrails
- Keep discussions focused on preview-only behavior
- Do not assume timelines for production readiness

## Closing statement
- Thank participants; collect feedback via capture template; next steps will be documented in MC66 if approved
