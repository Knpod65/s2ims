# S2IMS Import Preview Controlled Demo Agenda & Runbook — MC67

## Purpose
Provide a compact agenda and facilitator runbook for a controlled internal demo walkthrough of the import preview route. This document is planning-only and does not claim the session occurred.

## 45-minute agenda
- 00:00 — Welcome & safety briefing (5m)
- 00:05 — Generator manifest & artifacts verification (5m)
- 00:10 — Upload canonical workbook and preview walkthrough (15m)
- 00:25 — Focused scenarios (duplicates/missing/forbidden/formula/row-limit) (15m)
- 00:40 — Q&A and capture notes (3m)
- 00:43 — Wrap-up and next steps (2m)

## 60-minute agenda
- 00:00 — Welcome & safety briefing (5m)
- 00:05 — Generator manifest & artifacts verification (10m)
- 00:15 — Upload canonical workbook and preview walkthrough (20m)
- 00:35 — Focused scenarios (duplicates/missing/forbidden/formula/row-limit) (20m)
- 00:55 — Q&A and capture notes (3m)
- 00:58 — Wrap-up and next steps (2m)

## Facilitator opening script
"Today’s walkthrough uses synthetic data only. The goal is to review the preview workflow and collect planning feedback. This is not an approval meeting, not a sign-off, and not authorization to import real data or enable persistence."

## Route walkthrough steps
1. Navigate to /admin/master-data/import-preview
2. Confirm route is reachable and labeled preview-only
3. Open generator manifest and confirm artefacts available in artifacts/
4. Upload synthetic_staff_master_valid.xlsx and observe preview
5. Walk through validation panel and expected messages

## Workbook preview walkthrough steps
- Show mapping behavior when cmu_mail present/absent
- Demonstrate duplicate email detection scenario
- Show forbidden column detection and formula cell handling
- Show row-limit warning behavior
- Confirm Confirm Import remains disabled on preview

## Validation behavior walkthrough
- Explain warning vs error vs blocked semantics
- Show how manual mapping is requested for missing cmu_mail

## Confirm Import disabled explanation
"Confirm Import is intentionally disabled in the preview route. Uploading files only shows diagnostic validation and does not persist data or trigger audit events."

## Feedback prompt sequence
- Prompt 1: What is unclear in the validation messages?
- Prompt 2: Are there accessibility or keyboard navigation concerns?
- Prompt 3: Are any privacy or data exposure concerns evident in the preview?

## Stop conditions
- Real data appears in UI
- Generated workbook contains suspicious or real-looking PII
- Participant requests enabling Confirm Import or enabling persistence
- Any High or Blocked severity feedback raised

## Closing script
"Any feedback collected from this session will be treated as planning input only. It will not become official evidence, approval, or AP-10B progress unless a future governance process explicitly authorizes that step. Thank you for observing the safety rules."
