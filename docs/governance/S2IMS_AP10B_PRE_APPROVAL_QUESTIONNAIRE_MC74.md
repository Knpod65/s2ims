# S²IMS AP-10B Pre-Approval Questionnaire

**Classification**: Internal Governance Planning Document  
**Date**: 2026-05-21  
**Milestone**: MC74  
**Status**: QUESTIONNAIRE — All answers blank. Preparation only. No approval collected.

---

## IMPORTANT NOTICE

**Completing this questionnaire does NOT open AP-10B.**  
**This document does NOT constitute approval, sign-off, or authorization.**  
**It is a preparation instrument to be completed by designated governance owners before the go/no-go meeting.**

---

## Instructions

- Complete all sections with the designated owner for each section
- Leave "[Fill in]" entries blank until the relevant owner provides answers
- Once all sections are complete, present to the Decision Chair for the go/no-go meeting
- Do NOT submit this document as authorization — it feeds the go/no-go meeting only

---

## Section 1: Source Data

*Completed by: Data Owner*

| # | Question | Answer |
|---|----------|--------|
| 1.1 | What is the official source system for this data? (system name, owner, format) | [Fill in] |
| 1.2 | What file format will be used for import? (CSV, XLSX, JSON, API, other) | [Fill in] |
| 1.3 | What is the expected record volume per import cycle? | [Fill in] |
| 1.4 | How frequently will imports occur? (one-time, monthly, per cycle, etc.) | [Fill in] |
| 1.5 | Who is authorized to initiate an import from the source system? | [Fill in] |

---

## Section 2: Allowed Fields

*Completed by: Data Owner + Technical Owner*

| # | Question | Answer |
|---|----------|--------|
| 2.1 | List all fields included in the import dataset | [Fill in] |
| 2.2 | Which fields are mandatory (cannot be null)? | [Fill in] |
| 2.3 | Which fields are optional? | [Fill in] |
| 2.4 | Are there any fields in the source system that will be deliberately excluded from import? If so, why? | [Fill in] |
| 2.5 | Has the field mapping from source schema to S²IMS types been reviewed and confirmed? | [Fill in: Yes / No / Partially] |

---

## Section 3: PII Classification

*Completed by: PDPA Reviewer + Data Owner*

| # | Question | Answer |
|---|----------|--------|
| 3.1 | Which fields contain personally identifiable information (PII)? | [Fill in] |
| 3.2 | Which fields contain sensitive PII (e.g., national ID, health data)? | [Fill in] |
| 3.3 | Which PII fields will be masked for non-privileged roles? | [Fill in] |
| 3.4 | Has the PII classification been reviewed against PDPA requirements? | [Fill in: Yes / No] |
| 3.5 | What is the basis for processing each PII category? (consent, legal obligation, legitimate interest) | [Fill in] |

---

## Section 4: Data Retention

*Completed by: PDPA Reviewer + Data Owner*

| # | Question | Answer |
|---|----------|--------|
| 4.1 | What is the retention period for imported records? | [Fill in: e.g., 7 years] |
| 4.2 | What is the deletion/archiving schedule after the retention period? | [Fill in] |
| 4.3 | Is a data retention policy document available? If yes, provide reference. | [Fill in] |
| 4.4 | Who is responsible for executing retention policy enforcement? | [Fill in] |

---

## Section 5: Audit Write Rules

*Completed by: Technical Owner*

| # | Question | Answer |
|---|----------|--------|
| 5.1 | Will audit events be written on every import action? (Yes/No/Describe scope) | [Fill in] |
| 5.2 | What events will be audited? (e.g., import-initiated, row-validated, import-confirmed, import-failed) | [Fill in] |
| 5.3 | Where will audit events be persisted? (DB table, log file, external service) | [Fill in] |
| 5.4 | Has audit log persistence been tested and confirmed working in the target environment? | [Fill in: Yes / No] |

---

## Section 6: Official Evidence Definition

*Completed by: AP-10B Authority + PDPA Reviewer*

| # | Question | Answer |
|---|----------|--------|
| 6.1 | What constitutes "official evidence" in the context of this import? (e.g., signed import receipt, audit log export) | [Fill in] |
| 6.2 | Who has authority to generate official evidence? | [Fill in] |
| 6.3 | Is there a template or format for official evidence documents? | [Fill in] |
| 6.4 | Will imported records be considered legally binding records? Under what authority? | [Fill in] |

---

## Section 7: Rollback

*Completed by: Technical Owner*

| # | Question | Answer |
|---|----------|--------|
| 7.1 | Has a rollback procedure been documented for a failed import? | [Fill in: Yes / No — reference doc if yes] |
| 7.2 | Has the rollback procedure been tested in a non-production environment? | [Fill in: Yes / No] |
| 7.3 | What is the maximum time to complete a full rollback? | [Fill in: e.g., < 30 minutes] |
| 7.4 | Who is authorized to initiate a rollback? | [Fill in] |
| 7.5 | What is the rollback trigger condition? (e.g., > 5% validation errors, data mismatch, operator request) | [Fill in] |

---

## Section 8: Pilot Scope

*Completed by: AP-10B Authority + Data Owner*

| # | Question | Answer |
|---|----------|--------|
| 8.1 | Is the first import a limited pilot (subset of data) or full production import? | [Fill in] |
| 8.2 | If pilot: what subset of data will be used? (e.g., one scholarship cycle, anonymized records) | [Fill in] |
| 8.3 | If pilot: what is the success criterion for graduating to full import? | [Fill in] |
| 8.4 | What is the timeline for the pilot period? | [Fill in] |

---

## Section 9: Go/No-Go Authority

*Completed by: Decision Chair*

| # | Question | Answer |
|---|----------|--------|
| 9.1 | Who is the designated AP-10B Authority (name and title)? | [Fill in] |
| 9.2 | Who is the designated PDPA Reviewer (name and title)? | [Fill in] |
| 9.3 | Who is the designated Technical Owner (name and title)? | [Fill in] |
| 9.4 | Who is the designated Data Owner (name and title)? | [Fill in] |
| 9.5 | Who will chair the go/no-go meeting? | [Fill in] |
| 9.6 | When is the go/no-go meeting scheduled? | [Fill in] |

---

## Section 10: Support & Training

*Completed by: Operations + Decision Chair*

| # | Question | Answer |
|---|----------|--------|
| 10.1 | Who will provide operational support during the first live import? | [Fill in] |
| 10.2 | Has the import operator received training on the AP-10B workflow? | [Fill in: Yes / No] |
| 10.3 | Is a training record available? | [Fill in: Yes / No — reference if yes] |
| 10.4 | Is there an escalation path if the operator encounters an unexpected state? | [Fill in] |

---

## Section 11: Incident Response

*Completed by: IT / Operations*

| # | Question | Answer |
|---|----------|--------|
| 11.1 | Is an incident response plan in place for data import failures? | [Fill in: Yes / No — reference if yes] |
| 11.2 | What is the first action if a data breach is suspected during import? | [Fill in] |
| 11.3 | Who is the incident response lead? | [Fill in] |
| 11.4 | What is the PDPA breach notification timeline if PII is compromised? | [Fill in: e.g., 72 hours per PDPA Art. 37] |

---

## Section 12: Security Acceptance

*Completed by: IT Security + Technical Owner*

| # | Question | Answer |
|---|----------|--------|
| 12.1 | Has a security review of the import pipeline been completed? | [Fill in: Yes / No] |
| 12.2 | Are API authentication and session management configured for the production environment? | [Fill in: Yes / No] |
| 12.3 | Has a vulnerability scan been performed on the deployment environment? | [Fill in: Yes / No] |
| 12.4 | Are there any open security findings that must be resolved before import? | [Fill in] |

---

## Section 13: Import Ownership

*Completed by: AP-10B Authority*

| # | Question | Answer |
|---|----------|--------|
| 13.1 | Who owns the imported data after it enters S²IMS? | [Fill in] |
| 13.2 | Who is responsible for data quality disputes after import? | [Fill in] |
| 13.3 | What is the process for requesting corrections to imported records? | [Fill in] |
| 13.4 | Who can authorize deletion of imported records? | [Fill in] |

---

## Questionnaire Completion Status

| Section | Owner | Status |
|---------|-------|--------|
| 1. Source Data | Data Owner | ⬜ Not started |
| 2. Allowed Fields | Data Owner + Technical Owner | ⬜ Not started |
| 3. PII Classification | PDPA Reviewer + Data Owner | ⬜ Not started |
| 4. Data Retention | PDPA Reviewer + Data Owner | ⬜ Not started |
| 5. Audit Write Rules | Technical Owner | ⬜ Not started |
| 6. Official Evidence | AP-10B Authority + PDPA Reviewer | ⬜ Not started |
| 7. Rollback | Technical Owner | ⬜ Not started |
| 8. Pilot Scope | AP-10B Authority + Data Owner | ⬜ Not started |
| 9. Go/No-Go Authority | Decision Chair | ⬜ Not started |
| 10. Support & Training | Operations | ⬜ Not started |
| 11. Incident Response | IT / Operations | ⬜ Not started |
| 12. Security Acceptance | IT Security | ⬜ Not started |
| 13. Import Ownership | AP-10B Authority | ⬜ Not started |

**All sections complete**: ⬜ No — questionnaire not yet started

---

**Completing this questionnaire does NOT open AP-10B.**  
**This document does NOT constitute approval, sign-off, or authorization.**  
**Document date**: 2026-05-21 (MC74)
