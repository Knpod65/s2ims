# S2IMS Staff Applications PDPA And Decision Boundary MC95

**Date**: 2026-05-21  
**Route**: `/staff/applications`

## PII Visible Before And After

| Data | Before MC95 | After MC95 | Status |
|------|-------------|------------|--------|
| Scholarship title | Visible | Visible | unchanged |
| Student identifier | `student_id` visible | `student_id` visible | unchanged |
| Application status | Visible | Visible | unchanged |
| Document counts | Visible as icon counts | Visible as icon + text counts | clarified |
| Match score | Visible | Visible | unchanged |
| Updated date | Visible | Visible | unchanged |
| Student name/email/contact | Not visible | Not visible | protected |
| Financial/academic profile | Not visible on list | Not visible on list | protected |

## Decision-Support Boundary

MC95 labels the list as a mock work queue for review preparation only. It does not add approve, reject, award, not-award, status mutation, persistence, or audit-write behavior to the list page.

Approved copy:
- Mock work queue
- Decision-support only
- No approval is recorded from this screen
- Prototype data only
- Document completeness is shown for review preparation

Avoided copy:
- Official decision
- Final review
- Approved
- Persisted
- Audit evidence created

## AP-11 Relevance

AP-11 applies because staff application review can be mistaken for official approval or rejection. MC95 surfaces AP-11 in the page banner and keeps the list page read-only.

## Disabled Action Rules

No approve/reject controls exist on the list page, so no new disabled controls were added. If future decision controls are added, they must remain visible, disabled, and paired with AP-11 `DisabledActionHint`.

## Safety Notes

- No additional PII is exposed.
- No route permissions changed.
- No backend/API calls added.
- No persistence added.
- No audit writes added.
- No official evidence created.
- AP-10B/AP-10C/AP-11 remain blocked.
