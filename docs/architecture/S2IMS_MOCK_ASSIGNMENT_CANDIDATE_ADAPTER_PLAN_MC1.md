# S²IMS Mock Assignment Candidate Pool Adapter Plan MC1

## 1. Purpose

MC1 plans a future adapter layer for normalizing Employee and Personnel records into safe selectable candidate pool objects for use in S²IMS workflow steps.

This is not an automatic assignment engine. The adapter prepares a candidate pool — a list of selectable people — that is presented to a human user on the web. A staff member, admin, or operator manually chooses the assignee from that pool. The system does not assign anyone by itself.

This document is design-only. No runtime implementation is included.

**Mock candidates are workflow suggestions only. Mock candidates are not AP-10B governance owners. Mock candidates are not approvals. Mock candidates are not verified authority. Manual selection on the web is workflow assignment only. Manual selection does not collect AP-10B approval.**

This plan is entirely separate from AP-10B governance approval operations. AP-10B gate status is unaffected. AP-10C and AP-11 remain blocked.

---

## 2. Scope

### In Scope

- Employee source normalization plan
- Personnel source normalization plan
- Safe selectable candidate pool object model
- Role category mapping
- Privacy-safe display model
- Candidate selection status model
- Manual selection boundary
- Manual override boundary
- QA checklist

### Out of Scope

- Runtime code
- Backend/API implementation
- Database migration
- SQL
- Real persistence
- **Automatic assignment** — the system must never assign anyone without human confirmation
- AP-10B governance approval
- AP-10C
- AP-11

---

## 3. Source Inputs

### Employee Source Fields (Employee190226.csv)

| Field | Description |
|-------|-------------|
| `employee_id` | Internal staff identifier |
| `title` | Title (e.g., Mr., Mrs., Dr.) |
| `name` | Given name |
| `surname` | Family name |
| `role` | Staff level: Secretary, Head_of_Unit, Staff |
| `department` | Secondary affiliation tag (where present) |
| `division` | Operational domain for pool matching |
| `unit` | Assignment category — maps to workflow step type |
| `ext` | Internal extension (optional) |
| `mobile` | Mobile number — must NOT be displayed |
| `cmu_mail` | Official CMU email — show where role-authorised only |

### Personnel Source Fields (Personnel120226.csv)

| Field | Description |
|-------|-------------|
| `teacher_id` | Internal faculty identifier |
| `title` | Title (e.g., อ., ผศ., รศ., ศ.) |
| `name` | Given name |
| `surname` | Family name |
| `department` | Program department code: GOV, PA, IA, STB |
| `ext` | Internal extension (optional) |
| `mobile` | Mobile number — must NOT be displayed |
| `cmu_mail` | Official CMU email — show where role-authorised only |
| `email` | Personal email — hidden by default |
| `remark` | Internal note — never displayed in any workflow UI |

---

## 4. Normalized Candidate Pool Object

The adapter normalizes source records into the following proposed type. This type is for design planning purposes only. No implementation exists in `src/` at this time.

```ts
type MockAssignmentCandidatePoolItem = {
  candidateId: string;
  sourceType: "employee" | "personnel";
  sourceId: string;
  displayName: string;
  roleCategory: string;
  roleLabel: string;
  unitOrDepartment: string;
  officialEmail?: string;
  selectableContexts: string[];
  selectionStatus:
    | "available_for_selection"
    | "selected_pending_confirmation"
    | "selected"
    | "rejected"
    | "inactive";
  confidence: "mock" | "rule_based" | "manual";
  isMock: true;
  privacyLevel: "safe_display" | "internal_only";
  notes?: string;
};
```

### Field Notes

- `candidateId` — generated identifier, not the raw `employee_id` or `teacher_id`
- `sourceId` — stores the raw source ID; internal only, not displayed
- `displayName` — assembled from `title + name + surname`; safe for display
- `selectableContexts` — which workflow step types this candidate may be shown for
- `isMock: true` — always set; used as a runtime safety guard in future implementation
- `privacyLevel` — `"safe_display"` for displayName/roleLabel; `"internal_only"` for sourceId/notes

---

## 5. Employee Mapping Rules

When normalizing Employee records, the adapter maps `division` + `unit` to a `roleCategory` and `roleLabel`:

| Division | Unit | roleCategory | roleLabel |
|----------|------|-------------|-----------|
| Education_Student_Quality | Education_Services | `scholarship_operations` | Scholarship / Eligibility Processing |
| Education_Student_Quality | Student_Development | `student_support` | Student Support / Scholarship Follow-up |
| Strategic_Planning | IT_Communication | `technical_support` | System Support / Technical Operator |
| Strategic_Planning | Strategy_Quality_Assurance | `qa_review` | QA / Checklist / Review Support |
| General_Administration | Finance_Supplies | `finance_check` | Finance / Disbursement Check |
| General_Administration | Human_Resources | `hr_coordination` | Staff Coordination / HR Support |
| General_Administration | General_Administration | `general_admin` | General Administrative Support |
| General_Administration | Audio_Visual_Environment | `facilities_support` | Facilities Support |
| Research_Academic_Services | Research | `research_coordination` | Research Coordination |
| Research_Academic_Services | Academic_Services | `academic_services` | Academic Services Processing |
| Research_Academic_Services | International_Relations | `international_coordination` | International Student Coordination |
| Political_Innovation_Center | (any) | `policy_support` | Policy / Political Program Support |

**Priority for pool ordering:** `Head_of_Unit` first, then `Staff`, then `Secretary`.

If no unit match is found, the record is excluded from the pool for that workflow step. The pool slot is left empty and requires manual operator input.

---

## 6. Personnel Mapping Rules

When normalizing Personnel records, the adapter maps `department` to an advisory role:

| Department | roleCategory | roleLabel |
|------------|-------------|-----------|
| GOV | `advisor_gov` | Government / Policy Program Advisor |
| PA | `advisor_pa` | Public Administration Advisor / Program Reviewer |
| IA | `advisor_ia` | International Affairs Advisor / Faculty Reviewer |
| STB | `advisor_stb` | Visiting / External Faculty (flag for manual confirmation) |

**Privacy rules for Personnel:**
- `mobile` — never in pool output; stripped at normalization
- `email` — stripped at normalization; shown only if explicitly role-authorised at display time
- `cmu_mail` → stored as `officialEmail`; shown only where role-authorised
- `remark` — stored in `notes` with `privacyLevel: "internal_only"`; never shown in workflow UI
- STB entries should carry a warning flag in `notes` that manual confirmation is required

---

## 7. Candidate Selection Status Model

| Status | Meaning |
|--------|---------|
| `available_for_selection` | Candidate is in the pool; visible to authorised user for selection |
| `selected_pending_confirmation` | A human user selected this candidate; awaiting workflow confirmation |
| `selected` | Confirmed workflow assignment by a human user on the web |
| `rejected` | Human user or workflow logic removed this candidate from consideration |
| `inactive` | Candidate record is inactive or excluded from the pool |

**Disclaimer:**

`available_for_selection` means the candidate is in the pool and can be chosen by a human user. `selected` means a human user made a manual assignment on the web. `selected` does not mean AP-10B authority. `selected` does not mean approval collected. Candidate listing is not approval.

Selection state transitions are driven by human action, not by the adapter. The adapter only populates and maintains the pool.

---

## 8. Privacy Rules

| Rule | Detail |
|------|--------|
| Mobile number | Never included in any pool object or workflow UI view |
| Personal email (`email` field, Personnel) | Stripped at normalization; never in pool output |
| Raw source ID (`employee_id`, `teacher_id`) | Stored in `sourceId` as internal-only; not shown in UI |
| `remark` field (Personnel) | Stored in `notes` with `privacyLevel: "internal_only"`; never shown in workflow UI |
| `cmu_mail` | Stored as `officialEmail`; shown only where the requesting user's role is authorised |
| `displayName` | Assembled from title + name + surname; safe for display |
| Student identity (if cross-referenced) | Always masked — use token only; no raw student ID |
| Audit log entries | Log only safe action/status (e.g., `selected`, `rejected`); never log reason text or personal contact |

These rules apply at normalization time, not only at display time. The pool object must be safe before it reaches the UI layer.

---

## 9. Manual Selection and Override Rules

- **Assignment is always performed by a human user on the web.** The adapter prepares the pool; it does not assign anyone.
- The UI presents the pool as a selectable list. A staff member, admin, or operator chooses from the pool.
- Selecting a candidate sets `selectionStatus` to `selected_pending_confirmation` until the workflow step confirms.
- A human operator may override any pool suggestion at any time — including replacing a suggested candidate with someone outside the pool.
- Override must be auditable: the override action is logged under the operator's user account, not the candidate's.
- Override does not collect AP-10B approval.
- Override metadata must not contain PII (no mobile, no personal email, no remark text).
- The source CSV record is not modified by any selection or override.

---

## 10. Future Runtime Implementation Notes

This document is design-only. No `src/` changes accompany it. Future implementation phases:

| Phase | Description |
|-------|-------------|
| S2IMS-MC1 | Runtime candidate pool adapter — CSV normalization into pool objects |
| S2IMS-MC2 | Advisor candidate pool generator — Personnel-to-advisor pool for scholarship workflows |
| S2IMS-MC3 | Staff candidate pool generator — Employee-to-staff pool for eligibility/QA/finance workflows |
| S2IMS-MC4 | Advisor review workflow UI — manual selection interface for advisor consent steps |
| S2IMS-MC5 | Manual assignment override audit awareness — log and surface override events in audit trail |

Each phase is a separate branch and separate task. None may be started until the previous phase's QA + merge + post-merge QA is complete.

---

## 11. QA Checklist

- [x] Docs-only — no `src/*` changes
- [x] No `scripts/*` changes
- [x] No `package.json` changes
- [x] No migration files created
- [x] No SQL created
- [x] No schema implementation files created
- [x] No backend/API files created
- [x] No runtime behavior changed
- [x] No persistence activated
- [x] No auto-assignment language in this document
- [x] Employee/Personnel mapping reviewed — consistent with S2IMS_EMPLOYEE_PERSONNEL_ROLE_MAPPING.md
- [x] Privacy rules reviewed — mobile stripped, personal email stripped, remark internal only
- [x] AP-10B separation reviewed — mock candidates are not governance owners; selection is not approval
- [x] AP-10C: Blocked
- [x] AP-11: Blocked
- [x] AP-10B gate status: 0/7 owners, 0/7 approvals, 9/9 blockers active — unchanged
