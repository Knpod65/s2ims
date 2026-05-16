# S²IMS Employee and Personnel Role Mapping

## Purpose

This document defines how fields from the Employee and Personnel CSV sources map to S²IMS workflow display and assignment logic, and how division/unit and department codes map to workflow role categories.

---

## Employee Source Field Mapping

| Source Field | Use in S²IMS |
|---|---|
| `employee_id` | Internal staff source ID |
| `title` + `name` + `surname` | Display name for workflow UI |
| `role` | Staff level: Secretary, Head_of_Unit, Staff |
| `division` | Operational domain for assignment matching |
| `unit` | Assignment category — maps to workflow step |
| `cmu_mail` | Contact / identity matching (show where role-authorised) |
| `mobile` | Do NOT display by default |
| `ext` | Optional internal contact reference |
| `department` | Secondary affiliation tag (where present) |

---

## Personnel Source Field Mapping

| Source Field | Use in S²IMS |
|---|---|
| `teacher_id` | Faculty source ID |
| `title` + `name` + `surname` | Advisor display name |
| `department` | Student/program matching: GOV, PA, IA, STB |
| `cmu_mail` | Official contact (show where role-authorised) |
| `email` | Secondary contact — do NOT display by default |
| `mobile` | Do NOT display |
| `ext` | Optional |
| `remark` | Internal note only — do NOT display |

---

## Employee Division / Unit → S²IMS Workflow Role

| Division | Unit | S²IMS Workflow Role |
|---|---|---|
| Education_Student_Quality | Education_Services | Education-service processing / eligibility checking |
| Education_Student_Quality | Student_Development | Student support / scholarship follow-up |
| Strategic_Planning | IT_Communication | System support / technical operator candidate |
| Strategic_Planning | Strategy_Quality_Assurance | QA / checklist / review support |
| General_Administration | Finance_Supplies | Finance-related scholarship disbursement check |
| General_Administration | Human_Resources | Staff coordination / HR support |
| General_Administration | General_Administration | General administrative support |
| General_Administration | Audio_Visual_Environment | Facilities support (low priority for workflow) |
| Research_Academic_Services | Research | Research coordination / academic services |
| Research_Academic_Services | Academic_Services | Academic services processing |
| Research_Academic_Services | International_Relations | International student coordination |
| Political_Innovation_Center | (any) | Policy/political program support (low frequency) |

---

## Personnel Department → S²IMS Advisory Role

| Department Code | S²IMS Advisory Role |
|---|---|
| GOV | Government/policy program advisor / faculty reviewer |
| PA | Public administration advisor / program reviewer |
| IA | International affairs advisor / faculty reviewer |
| STB | Visiting/external faculty — lower priority; flag for manual confirmation |

---

## Priority Order for Candidate Selection

When multiple Employee records match a unit:

1. `Head_of_Unit` — highest priority
2. `Staff` — standard
3. `Secretary` — fallback only

When multiple Personnel records match a department, use stable sort by `teacher_id`.

---

## Privacy Summary

| Field | Default Visibility |
|---|---|
| `mobile` (Employee or Personnel) | Hidden — never shown in workflow UI |
| `email` (Personnel) | Hidden — shown only if role-authorised |
| `cmu_mail` | Shown where role-authorised |
| `remark` (Personnel) | Internal only — never shown |
| `title + name + surname` | Shown as workflow assignee label |
| Raw student ID | Always masked (not in these CSVs, but applies to any cross-referenced student record) |
