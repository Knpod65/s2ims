# S²IMS Mock Assignment Candidates Plan

## 1. Purpose

This document describes how S²IMS can source and assign mock workflow candidates for internal demo, test, and staging workflows. Candidates are drawn from two CMU-supplied CSV sources: an operational staff file (Employee190226.csv) and a faculty/personnel file (Personnel120226.csv).

This plan is entirely separate from AP-10B governance approval operations. AP-10B gate status is unaffected. AP-10C and AP-11 remain blocked.

**Mock candidates are only suggested workflow assignees. They are not official approvals, not verified authorities, and not AP-10B governance owners.**

---

## 2. Source Files

### Employee190226.csv

- 37 operational staff records
- Fields: `employee_id`, `title`, `name`, `surname`, `role`, `department`, `division`, `unit`, `ext`, `mobile`, `cmu_mail`
- Divisions: `General_Administration`, `Strategic_Planning`, `Political_Innovation_Center`, `Research_Academic_Services`, `Education_Student_Quality`
- Units: `Human_Resources`, `General_Administration`, `Finance_Supplies`, `Audio_Visual_Environment`, `Strategy_Quality_Assurance`, `IT_Communication`, `Research`, `Academic_Services`, `International_Relations`, `Education_Services`, `Student_Development`
- Roles: `Secretary`, `Head_of_Unit`, `Staff`

### Personnel120226.csv

- 45 faculty/teacher records
- Fields: `teacher_id`, `title`, `name`, `surname`, `department`, `ext`, `mobile`, `cmu_mail`, `email`, `remark`
- Department codes: `GOV`, `PA`, `IA`, `STB` (plus one guest/external entry)

---

## 3. What "Mock Candidate" Means

A mock candidate is a suggested workflow assignee drawn from the CSV sources for use in demo, test, or staging workflow runs. The suggestion is based on structural matching (unit, division, department) rather than real appointment or authority verification.

Mock candidates:
- Appear in workflow UI as suggested assignees for operator review
- Are replaceable at any point by a real operator assignment
- Have no binding effect on any process
- Generate no real notifications to the named person unless the system is connected to live channels in a production environment

---

## 4. What Mock Candidate Does NOT Mean

- Not an official approval
- Not a verified governance owner
- Not an AP-10B sign-off
- Not an authority confirmation
- Not a real appointment
- Not a personnel record change
- Not a workflow commitment

Mock candidates must never be treated as any of the above.

---

## 5. Employee Source Mapping

| Division | Unit | S²IMS Workflow Role Category |
|---|---|---|
| Education_Student_Quality | Education_Services | Education-service processing / eligibility checking |
| Education_Student_Quality | Student_Development | Student support / scholarship follow-up |
| Strategic_Planning | IT_Communication | System support / technical operator candidate |
| Strategic_Planning | Strategy_Quality_Assurance | QA / checklist / review support |
| General_Administration | Finance_Supplies | Finance-related scholarship disbursement check |
| General_Administration | Human_Resources | Staff coordination / HR support |
| General_Administration | Audio_Visual_Environment | Facilities support (low priority for workflow) |
| Research_Academic_Services | Research | Research coordination / academic services |
| Research_Academic_Services | Academic_Services | Academic services processing |
| Research_Academic_Services | International_Relations | International student coordination |

---

## 6. Personnel Source Mapping

| Department Code | S²IMS Advisory Role Category |
|---|---|
| GOV | Government/policy program advisor / faculty reviewer |
| PA | Public administration advisor / program reviewer |
| IA | International affairs advisor / faculty reviewer |
| STB | Visiting/external faculty — lower priority; flag for manual confirmation |

---

## 7. Candidate Generation Rules

When S²IMS selects a mock candidate for a workflow step:

1. Match by `unit` (Employee source) or `department` (Personnel source) to the workflow step type
2. Prefer `Head_of_Unit` role level over `Staff`; use `Secretary` only if no other match
3. If multiple records match, select by randomised stable sort (e.g., by employee_id or teacher_id mod N) so results are reproducible per workflow run
4. If no match found, leave the assignment slot blank and require manual operator assignment
5. Never generate a candidate from a record with incomplete or placeholder data

These rules describe future design intent only. No implementation exists in `src/` at this time.

---

## 8. Role Assignment Categories

| Workflow Step | Source | Match Basis |
|---|---|---|
| Scholarship eligibility check | Employee | unit = Education_Services |
| Student support follow-up | Employee | unit = Student_Development |
| Finance disbursement check | Employee | unit = Finance_Supplies |
| QA / review support | Employee | unit = Strategy_Quality_Assurance |
| Technical / system operator | Employee | unit = IT_Communication |
| HR coordination | Employee | unit = Human_Resources |
| Research services | Employee | unit = Research or Academic_Services |
| International student processing | Employee | unit = International_Relations |
| Advisor consent — GOV program | Personnel | department = GOV |
| Advisor consent — PA program | Personnel | department = PA |
| Advisor consent — IA program | Personnel | department = IA |
| Advisor consent — STB program | Personnel | department = STB |

---

## 9. Privacy and Display Rules

| Field | Rule |
|---|---|
| `mobile` | Do NOT display under any workflow UI view |
| Raw student ID | Always mask — display only a token or partial reference |
| `email` (Personnel) | Hidden by default; show only when role-authorised |
| `cmu_mail` | Show only where role-authorised (primary contact reference) |
| `remark` | Internal note only — do NOT display in any workflow-facing UI |
| `title + name + surname` | Display as workflow assignee label where candidate is shown |

These rules apply to all mock candidate display contexts, including prototype, test, staging, and production if feature is ever shipped.

---

## 10. Manual Override Rules

Any mock assignment generated by this system can be replaced by a real operator assignment without a code change. Replacement is performed through the admin assignment interface (not yet implemented). A manual override:

- Takes precedence over the mock suggestion immediately
- Does not affect the mock candidate record in the source CSV
- Is logged under the operator's user account, not the mock candidate's

---

## 11. Future Implementation Notes

This document is design-only. No `src/` changes accompany it. A future implementation task would:

- Add a CSV import utility at admin setup time
- Map CSV records into an in-memory or database-backed candidate store
- Wire candidate selection into workflow step assignment UI
- Apply privacy rules at the display layer
- Support manual override through the admin panel

That implementation is a separate task and is not in scope here.

---

## 12. QA Checklist

- [x] Docs-only — no `src/*` changes
- [x] No `scripts/*` changes
- [x] No `package.json` changes
- [x] No migration files created
- [x] No SQL created
- [x] No schema implementation files created
- [x] No runtime behavior changed
- [x] No persistence activated
- [x] No PII exposed (mobile omitted, remark omitted, email omitted by default)
- [x] AP-10B gate status unchanged — 0/7 owners, 9/9 blockers active
- [x] AP-10C: Blocked
- [x] AP-11: Blocked
