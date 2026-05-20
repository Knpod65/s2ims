# S2IMS Import Preview Controlled Demo Readiness — MC64

## Purpose
Define criteria and facilitator script for a controlled internal synthetic demo of the import preview route using MC61-generated synthetic workbooks.

## Demo audience
- Internal stakeholders: Product, QA, Security, Owners (no external participants)

## Demo prerequisites
- Latest main branch checked out and validated (Build 42/42; Tokens 4/4; Audit 502/502)
- Generator run locally to create synthetic workbooks in artifacts/
- Demo host machine isolated, with local artifacts available
- Evidence capture plan agreed (screenshots only; no Excel attachments)

## Allowed demo data
- Only MC61-generated synthetic workbooks from artifacts/synthetic-master-data-workbooks/
- Emails must use example.test domain

## Forbidden demo data
- Any production or real-identifying data
- Any committed fixtures containing real data

## Demo route
- /admin/master-data/import-preview (preview-only, Confirm Import disabled)

## Facilitator script (high level)
1. Intro: state this is a controlled synthetic demo, confirm no real data will be shown
2. Show generator summary (command used and manifest)
3. Upload synthetic_staff_master_valid.xlsx and walk through preview UI
4. Show validation messages and confirm Confirm Import disabled
5. Repeat for duplicate email / missing email / forbidden columns / formula cells / row-limit warning / unknown sheet / th_en_names
6. Capture screenshots for internal QA evidence (no attachments to repo)
7. Conclude with readiness statement and next steps

## Stop conditions
- Confirm Import appears enabled or persistence observed (abort immediately)
- Any real PII appears in UI (abort, clear artifacts, notify security)

## Q&A guardrails
- Keep answers limited to preview-only behaviors
- Do not discuss timeline for persistence or production import without governance approval

## Allowed evidence
- Screenshots of UI showing synthetic data only (store externally)

## Forbidden evidence
- Committing generated files to repo
- Screenshots containing real PII or production evidence

## Readiness decision
- Demo allowed: Controlled internal synthetic demo only
- Not allowed: Public demos with real data or production import
