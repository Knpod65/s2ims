# S²IMS Governance Readiness Plan MC51

## 1. Purpose

MC51 documents a governance readiness plan and master data intake approach to prepare S²IMS for future AP-10B gate activities. This package is documentation-only and does not change runtime, open AP-10B, clear blockers, or enable persistence or audit writes.

Core rules:
- Current interim owner/approver proposal: Atikarn Saengwilai for all readiness roles (planning-only assumption).
- Future required design: admin-configurable owner/approver assignment from master personnel data.
- No AP-10B gate change occurs as part of MC51; blockers remain unresolved until a separate governance milestone.

---

## 2. Source Inputs

Primary inputs used to produce this plan:
- Filled readiness form: `docs/AnswerFROMMe_S2IMS_AP10B_Readiness_Input_Form_MC51.docx` (referenced only)
- MC49 three-section final handoff package and evidence index
- MC50 AP-10B blocked-gate handoff package and blocker matrix
- Personnel master file references (e.g., Personnel_120226.xlsx) — planning references only

Notes:
- No data import is performed in MC51.
- Personnel files are referenced as planning inputs only; no runtime data seeding occurs.

---

## 3. Corrected Interpretation of Filled MC51 Form

The MC51 form records a user-proposed/interim assignment: Atikarn Saengwilai is the current interim/default responsible person for all seven AP-10B readiness owner/approver roles in planning.

Interpretation rules:
- Treat Atikarn's listing as a planning-time interim/default assignment for coordination and contact during readiness work.
- Do not treat this as a permanent hardcoded owner in runtime; the production system must remain configurable.
- Use Atikarn as the operational contact for scheduling governance workshops, coordinating PDPA/legal reviews, and collecting planning artifacts.
- Any future change to owners or approvers must be performed through an admin-controlled, auditable, and versioned process.

---

## 4. Current Interim Owner/Approver Assignment

Current interim/default responsible person (planning-only):
- Atikarn Saengwilai — proposed contact for all 7 AP-10B readiness roles

Implementation note:
- This is a working assumption for MC51 planning activities only. It must not be hardcoded into runtime. Future systems must allow admin selection from master personnel data.

---

## 5. Future Admin-Configurable Owner/Approver Model

Requirements for a future production-ready model (design-only):
1. Admin UI to assign owners and approvers by role, process stage, scholarship, or workflow.
2. Owner/approver lookups sourced from `Staff_Master` and `Teacher_Master`.
   - Use `cmu_mail` as a recommended join key where present.
3. Assignment metadata: role, unit, contact, effective_from, effective_to, notes.
4. Change history and versioning: all assignment changes must be auditable with actor, timestamp, and reason.
5. Permissions: only authorized admin roles can change owners/approvers; changes are recorded in a governance audit trail.
6. Bulk import support from CSV/XLSX with validation and preview step (preview-first import flow).

Security & privacy:
- Master data must be stored and accessed under PDPA-compliant rules.
- UI and exported artifacts must avoid including PII unless approved by legal/PDPA.

---

## 6. Master Data Intake Planning (summary)

See separate Master Data Intake Plan (MC51) for full details. Key principles:
- Priority seed data: `Teacher_Master` and `Staff_Master` using Personnel_120226.xlsx as reference.
- Use `cmu_mail` as a reliable join key when available.
- Pilot import flow must be preview-first and aggregate-first for student/enrollment files.
- No production import until PDPA/legal, retention, and evidence rules are approved.

---

## 7. Governance Gaps Identified (summary)

- Owner identification & assignment governance
- Approval authority collection process
- PDPA / legal review pipeline
- Audit write policy and write authorization
- Persistence / data retention policy and schema approval
- Official evidence classification and rules
- Role/action authority matrix and permission model
- Production rollout decision and risk mitigation

Resolution of these gaps must be scheduled as separate governance milestones (not part of MC51 runtime).

---

## 8. AP-10B Readiness Decision (Planning Only)

Current planning decision:
- AP-10B remains blocked. Blockers remain active (9/9).
- Use Atikarn Saengwilai as the interim contact for coordinating readiness activities. This is not a runtime assignment.

---

## 9. Required Next Milestones (planning)

Short-term:
- Governance workshop to identify owners and responsibilities
- PDPA/legal scoping session
- Master-data intake pilot (preview-only) using Personnel_120226.xlsx as reference
- Role/action normalization workshop
- Draft retention and audit/write policies for governance review

Medium-term (separate approved milestones):
- Implement admin-configurable owner/approver registry with audit/versioning (MC52+)
- Implement guarded persistence and audit pipelines after AP-10B blockers resolved

---

## 10. Appendix

- Reference: `docs/AnswerFROMMe_S2IMS_AP10B_Readiness_Input_Form_MC51.docx` (form used as input)
- Related docs: MC49 final handoff, MC50 blocked-gate handoff & blocker matrix

---

**Prepared by:** S²IMS Engineering (MC51)
**Date:** 2026-05-20
**Status:** Planning-only. No runtime changes.