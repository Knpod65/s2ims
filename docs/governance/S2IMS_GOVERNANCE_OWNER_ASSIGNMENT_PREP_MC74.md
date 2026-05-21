# S²IMS Governance Owner Assignment Preparation

**Classification**: Internal Governance Planning Document  
**Date**: 2026-05-21  
**Milestone**: MC74  
**Status**: PREPARATION ONLY — No owners have been assigned. No approvals have been collected.

---

## IMPORTANT NOTICE

**This document is NOT an assignment record.**  
**No governance owners have been designated as of 2026-05-21.**  
**No sign-off has been collected.**

This document defines the roles, authority requirements, and responsibilities that must be filled before governance gates (AP-10B, AP-10C, AP-11) can be opened. It is a discussion and planning instrument only.

---

## Current Gate Status

| Gate | Status | Owner | Date Assigned |
|------|--------|-------|---------------|
| AP-10B (Confirm Import) | 🔒 BLOCKED | TBD — not yet assigned | — |
| AP-10C (Export Approval) | 🔒 BLOCKED | TBD — not yet assigned | — |
| AP-11 (Approval Workflows) | 🔒 BLOCKED | TBD — not yet assigned | — |

---

## Role Definitions

### Role 1: AP-10B Authority (Confirm Import Decision Owner)

| Attribute | Description |
|-----------|-------------|
| **Purpose** | Holds final authority to open AP-10B (Confirm Import). Signs the go/no-go decision. |
| **Required authority** | Division head or above; must have direct responsibility for scholarship data operations |
| **Typical title** | Director of Scholarship Operations / Head of Data Management / Deputy Director |
| **Key responsibilities** | Review governance checklist completion; approve/deny import activation; accept data risk ownership |
| **Approval boundary** | Can authorize: AP-10B activation, pilot import scope, data retention policy adoption |
| **Cannot authorize alone** | AP-10C (export) or AP-11 (workflow approval) — separate authorities required |
| **Evidence needed before assignment** | Org chart showing direct line authority over scholarship data; written acceptance of responsibility |
| **Current assignment** | TBD — not yet assigned |

---

### Role 2: PDPA / Privacy Reviewer

| Attribute | Description |
|-----------|-------------|
| **Purpose** | Reviews and certifies that S²IMS data handling complies with Thailand's Personal Data Protection Act (PDPA) |
| **Required authority** | Designated Data Protection Officer (DPO) or Legal Counsel with PDPA training |
| **Typical title** | DPO / Legal Counsel / Privacy Officer |
| **Key responsibilities** | Review all PII fields in scope; assess masking and retention; sign PDPA impact assessment; flag any high-risk processing |
| **Approval boundary** | Can certify: PDPA compliance of proposed import scope; retention schedule; data subject rights procedures |
| **Cannot authorize** | AP-10B itself — PDPA review is a prerequisite, not the final decision |
| **Evidence needed before assignment** | PDPA training certification; DPO appointment documentation; access to field classification matrix |
| **Current assignment** | TBD — not yet assigned |

---

### Role 3: Technical Owner

| Attribute | Description |
|-----------|-------------|
| **Purpose** | Owns the technical implementation of the import pipeline, persistence layer, audit log, and rollback procedures |
| **Required authority** | Senior developer or IT systems owner with direct access to S²IMS codebase and infrastructure |
| **Typical title** | Lead Developer / IT Systems Manager / CTO (small team) |
| **Key responsibilities** | Validate technical readiness of AP-10B code path; provision database; test rollback; implement error handling; confirm audit log persistence |
| **Approval boundary** | Can confirm: infrastructure readiness, code review completion, technical risk acceptance |
| **Cannot authorize** | Go/no-go decision — that belongs to AP-10B Authority |
| **Evidence needed before assignment** | Access to production infrastructure; code review record of AP-10B path; load test results |
| **Current assignment** | TBD — not yet assigned |

---

### Role 4: Data Owner

| Attribute | Description |
|-----------|-------------|
| **Purpose** | Owns the definition of what data is allowed to enter the system, what fields are canonical, and what constitutes a valid import dataset |
| **Required authority** | Head of the data-producing unit (e.g., student records office, scholarship office) |
| **Typical title** | Registrar / Scholarship Database Manager / Director of Student Records |
| **Key responsibilities** | Define and sign off the data contract (source schema, required fields, allowed nulls, quality thresholds); approve duplicate detection strategy |
| **Approval boundary** | Can define: data contract, field classifications, import quality standards |
| **Cannot authorize** | System activation — data ownership defines scope, not the activation decision |
| **Evidence needed before assignment** | Access to source data schema documentation; authority to define data contracts for their unit |
| **Current assignment** | TBD — not yet assigned |

---

### Role 5: Decision Chair (Go/No-Go Meeting Convener)

| Attribute | Description |
|-----------|-------------|
| **Purpose** | Convenes the go/no-go governance meeting; ensures all checklist items are confirmed before meeting; records the decision |
| **Required authority** | Project Lead / Program Manager with authority to schedule decision-making meetings |
| **Typical title** | Project Manager / Programme Director / CIO |
| **Key responsibilities** | Schedule and facilitate the go/no-go meeting; present evidence from governance checklist; document the decision; notify stakeholders |
| **Approval boundary** | Can convene and record: the go/no-go meeting decision |
| **Cannot authorize alone** | Activation — that requires AP-10B Authority sign-off |
| **Evidence needed before assignment** | Authority to convene governance meetings; calendar access; documentation access |
| **Current assignment** | TBD — not yet assigned |

---

## Assignment Process

### Step 1: Identify Candidates (Leadership Action)

For each of the 5 roles above:
- Review the org chart to identify who holds the required authority
- Confirm the person is available and willing to take responsibility
- Obtain written acceptance of the role's responsibilities

### Step 2: Confirm Prerequisites

Before any owner is formally assigned:

| Role | Prerequisite |
|------|-------------|
| AP-10B Authority | Governance checklist reviewed; risk briefing completed |
| PDPA Reviewer | PDPA training certificate verified |
| Technical Owner | Infrastructure access confirmed; code review access granted |
| Data Owner | Data contract draft reviewed |
| Decision Chair | Project timeline agreed |

### Step 3: Document the Assignment

Once assigned, record in a formal assignment document (separate from this preparation doc):
- Name and title of each owner
- Date of assignment
- Scope of authority accepted
- Signed acknowledgment

---

## Evidence Required Before Any Owner Can Open AP-10B

| # | Evidence Item | Owner Responsible |
|---|---------------|------------------|
| 1 | PDPA impact assessment (signed) | PDPA Reviewer |
| 2 | Data retention policy (written) | PDPA Reviewer + Data Owner |
| 3 | Data contract (signed by source and destination) | Data Owner |
| 4 | Technical readiness report (code review + infra) | Technical Owner |
| 5 | Rollback runbook (tested) | Technical Owner |
| 6 | Audit log persistence (verified working) | Technical Owner |
| 7 | Import operator training record | Decision Chair |
| 8 | Go/no-go decision record (signed) | AP-10B Authority + Decision Chair |

---

**Document Status**: Preparation only  
**This document is NOT an assignment record.**  
**No owners have been designated as of 2026-05-21.**  
**To formally assign owners, create a separate signed assignment document after leadership review.**
