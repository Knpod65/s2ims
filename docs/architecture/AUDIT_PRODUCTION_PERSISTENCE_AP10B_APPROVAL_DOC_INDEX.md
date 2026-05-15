# Audit Production Persistence AP-10B Approval Document Index

## 1. Purpose

This index lists all authoritative AP-10B approval-operation documents and explains when to use each one. It is a navigation aid, not a new planning document.

## 2. Authorization Docs

| Document | Purpose | Use when |
|----------|---------|----------|
| `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md` | Defines the 9 blocking conditions and authorization gate for Phase (b) → Phase (c) | Deciding whether AP-10C may open; checking which blockers remain active |
| `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md` | Per-owner criteria for schema design review (7 roles × pass/fail criteria) | Evaluating whether a schema design document satisfies each owner's review requirements |

## 3. Evidence Pack Docs

| Document | Purpose | Use when |
|----------|---------|----------|
| `AUDIT_PRODUCTION_PERSISTENCE_EVIDENCE_PACK_AP10B.md` | Master index of all evidence items required before approval collection begins | Assembling the evidence packet; confirming evidence completeness |
| `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_SIGNOFF_TEMPLATE_AP10B.md` | Standard written approval form for each owner to sign | Collecting a written approval from a named owner |
| `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_EVIDENCE_TRACKER_AP10B.md` | Tracks which evidence items have been assembled and distributed | Checking whether the evidence packet is complete before distributing to owners |

## 4. Approval Collection Docs

| Document | Purpose | Use when |
|----------|---------|----------|
| `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_COLLECTION_AP10B.md` | End-to-end approval collection workflow | Guiding the full approval collection sequence from evidence distribution through final confirmation |
| `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_OWNER_MATRIX_AP10B.md` | Maps each approval to the owner role, evidence requirement, and deadline | Confirming which owner must approve which items; tracking approval matrix status |
| `AUDIT_PRODUCTION_PERSISTENCE_SIGNOFF_PACKET_CHECKLIST_AP10B.md` | Pre-distribution checklist for the sign-off packet | Verifying the packet is complete before sending to owners |

## 5. Owner Intake and Naming Docs

| Document | Purpose | Use when |
|----------|---------|----------|
| `AUDIT_PRODUCTION_PERSISTENCE_OWNER_INTAKE_AP10B.md` | Owner intake workflow: how to identify, screen, and onboard a candidate owner | Starting the candidate identification process for any of the 7 roles |
| `AUDIT_PRODUCTION_PERSISTENCE_OWNER_INTAKE_FORM_AP10B.md` | Structured intake form to collect candidate details | Recording a candidate's name, authority basis, availability, and conflict check status |
| `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_STATUS_BOARD_AP10B.md` | Real-time status board for all 7 owner roles across intake, naming, and approval stages | Tracking overall gate status at a glance |
| `AUDIT_PRODUCTION_PERSISTENCE_OWNER_NAMING_AP10B.md` | Owner naming master doc: defines the 9-step naming workflow and 4 status levels | Progressing a candidate from identified → authority verified → Named owner |
| `AUDIT_PRODUCTION_PERSISTENCE_CANDIDATE_OWNER_ROSTER_AP10B.md` | Roster of all 7 required owner roles with current candidate and naming status | Recording and checking candidate name, authority, availability, and conflict status for each role |
| `AUDIT_PRODUCTION_PERSISTENCE_OWNER_AUTHORITY_CHECKLIST_AP10B.md` | 13 universal + 5 per-role authority verification items for each of the 7 roles | Verifying that a candidate has sufficient authority before marking them as Named owner |

## 6. QA Docs

Pre-merge QA, post-merge QA, and QA summary docs exist for each of the following blocks:

- Evidence pack
- Approval collection
- Owner intake
- Owner naming

QA artifacts are in `docs/qa/` and `docs/architecture/` under the corresponding block name.

## 7. Which Document To Use Next

| Task | Use |
|------|-----|
| Identify a candidate owner for any role | `OWNER_INTAKE_AP10B.md` + `OWNER_INTAKE_FORM_AP10B.md` |
| Record a candidate in the roster | `CANDIDATE_OWNER_ROSTER_AP10B.md` |
| Verify a candidate's authority | `OWNER_AUTHORITY_CHECKLIST_AP10B.md` |
| Check overall owner/approval gate status | `APPROVAL_STATUS_BOARD_AP10B.md` |
| Assemble the evidence packet | `EVIDENCE_PACK_AP10B.md` + `APPROVAL_EVIDENCE_TRACKER_AP10B.md` |
| Distribute the packet and collect approval | `SIGNOFF_PACKET_CHECKLIST_AP10B.md` → `APPROVAL_SIGNOFF_TEMPLATE_AP10B.md` |
| Track per-owner approval collection | `APPROVAL_OWNER_MATRIX_AP10B.md` + `APPROVAL_EVIDENCE_TRACKER_AP10B.md` |
| Decide whether AP-10C may open | `SCHEMA_AUTHORIZATION_AP10B.md` (9 blocking conditions) + `SCHEMA_REVIEW_CRITERIA_AP10B.md` |

## 8. Current Recommendation

Use `OWNER_INTAKE_AP10B.md` and `OWNER_AUTHORITY_CHECKLIST_AP10B.md` only.

Do not create new planning documents unless real-world input appears (actual owner names, authority confirmation, written sign-offs, DPO/legal requirements, or stale QA results that must be refreshed).

AP-10C remains blocked.
AP-11 remains blocked.
