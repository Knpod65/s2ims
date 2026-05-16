# S²IMS Advisor Review Workflow Plan

## Purpose

This document describes the two advisor-consent flow options for S²IMS scholarship workflows that require faculty endorsement. Advisor candidates are sourced from Personnel120226.csv using the department-based matching rules defined in `S2IMS_EMPLOYEE_PERSONNEL_ROLE_MAPPING.md`.

This document is design-only. No `src/` changes accompany it.

**Mock candidates are only suggested workflow assignees. They are not official approvals, not verified authorities, and not AP-10B governance owners.**

---

## Option A — Advisor-First Flow

Student submits application → system suggests an advisor candidate from Personnel (by department) → advisor reviews and recommends → scholarship staff reviews → committee/admin decision.

```
[Student submits]
       ↓
[Advisor candidate suggested from Personnel CSV (by department match)]
       ↓
[Advisor: review — recommend / needs more info / decline]
       ↓
[Scholarship staff: review (receives advisor recommendation)]
       ↓
[Committee / admin: final decision]
```

Use when: the scholarship criteria require academic endorsement before staff screening.

---

## Option B — Staff-First Flow

Student submits application → staff pre-screens for eligibility → advisor review triggered only when scholarship criteria require academic endorsement → scholarship staff final review.

```
[Student submits]
       ↓
[Scholarship staff: pre-screening / eligibility check]
       ↓
[If academic endorsement required:]
       ↓
[Advisor candidate suggested → advisor reviews → recommends or declines]
       ↓
[Scholarship staff: final review]
```

Use when: most applications are resolved without advisor involvement; advisor is only engaged for specific scholarship types.

---

## Advisor Workflow Statuses

| Status | Meaning |
|---|---|
| `not_required` | This application type does not require advisor review |
| `pending_advisor_review` | Advisor candidate assigned; awaiting advisor action |
| `advisor_recommended` | Advisor has reviewed and recommends proceeding |
| `advisor_needs_more_info` | Advisor has requested additional information from student or staff |
| `advisor_declined` | Advisor has declined to recommend; escalation required |
| `released_to_scholarship_staff` | Advisor review complete; handed off to scholarship staff |

---

## Staff Next-Action by Advisor Status

| Advisor Status | Staff Next Action |
|---|---|
| `not_required` | Proceed directly with staff review |
| `pending_advisor_review` | Wait; no staff action until advisor responds |
| `advisor_recommended` | Proceed with scholarship review |
| `advisor_needs_more_info` | Route to student for additional documents |
| `advisor_declined` | Escalate to program coordinator or reject per policy |
| `released_to_scholarship_staff` | Begin staff final review |

---

## Privacy Rules

| Item | Rule |
|---|---|
| Student identity in advisor view | Masked token only — no raw student ID |
| Advisor mobile number | Do NOT display in any workflow UI |
| Advisor personal email (`email` field) | Hidden by default; show only if role-authorised |
| Advisor official contact (`cmu_mail`) | Shown where role-authorised |
| Advisor name + department | Shown in assignee label where advisor is involved |
| Reason text (advisor notes) | Shown only to role-authorised users (staff, coordinator) — not to student by default |
| Log entries | Log only aggregate/safe action status (e.g., `advisor_recommended`) — never log reason text to public-facing audit trail |

---

## Mock Candidate Disclaimer

Advisor candidates sourced from Personnel120226.csv are mock suggestions for demo, test, and staging use. They:

- Have no binding effect on any real process
- Are not official advisor assignments
- Do not generate real notifications unless the system is connected to live channels
- Must be confirmed by a real operator before any production use
- Are not AP-10B governance owners

Actual advisor assignments for production use require real operator confirmation through the admin assignment interface.

---

## Future Integration Notes

This document does not implement any backend code. Future `src/` work would:

- Integrate with CMU directory or import Personnel CSV at admin setup time
- Build advisor assignment UI within the scholarship workflow step
- Apply privacy rules at the display layer
- Support manual override of suggested advisor
- Log advisor status transitions in the audit trail using safe, role-gated access

That implementation is a separate task.
