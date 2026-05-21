# S²IMS Post-Demo Next Step Roadmap

**Date**: 2026-05-21  
**Milestone**: MC73  
**Status**: Planning template — to be used after actual demo session occurs

---

## Purpose

This document defines the decision tree and roadmap for next steps after a controlled demo session is completed. It is organized around the feedback and governance decisions that emerge from that session.

**Note**: No demo has occurred as of 2026-05-21. This roadmap is pre-positioned for use after the first actual demo session.

---

## Post-Demo Decision Tree

```
[Demo session completed and feedback collected]
         |
         ▼
[Step 1: Review feedback summary]
         |
         ├── Significant UX issues → MC74: UX Fixes (Path A)
         |
         ├── Positive reception → proceed to governance decision
         |
         └── Mixed / unclear → schedule follow-up session
                   |
                   ▼
         [Step 2: Governance decision meeting]
                   |
                   ├── Assign AP-10B/C/11 owners → MC75: Governance Activation
                   |
                   ├── Not ready for governance → MC74: UX Polish + second demo
                   |
                   └── Scope pilot → MC76: Limited Pilot Planning
```

---

## Roadmap Options (MC74–MC79)

### MC74 — UX Renovation Wave 1 Page Migration

**Trigger**: After demo, leadership approves Path A (UX Polish)  
**Scope**: Migrate 3–5 high-traffic pages to use shared primitives (Button, StatusBadge)  
**Files to migrate (suggested)**:
- `/staff/applications` → replace inline buttons with `<Button>`
- `/admin` dashboard → replace status indicators with `<StatusBadge>`
- `/student/applications` → replace action buttons with `<Button variant="primary">`
- `/provider/scholarships` → replace status labels with `<StatusBadge>`
- `/admin/audit-log` → replace status cells with `<StatusBadge>`

**Safety**: No route changes, no AP gate changes, no persistence changes  
**Prerequisite**: Explicit approval for page migration  
**Estimated effort**: 2–3 days  
**Reference**: `docs/design/S2IMS_UX_RENOVATION_WAVE1_FOUNDATION_PRIMITIVES_MC71.md`

---

### MC75 — Governance Activation Planning

**Trigger**: After demo, leadership designates AP-10B/C/11 authorities  
**Scope**: Create governance activation plan — NOT actual activation  
**Deliverables**:
- Authority designation records
- PDPA review initiation checklist
- Data contract drafting kickoff
- Infrastructure provisioning plan

**Safety**: Docs/planning only  
**Prerequisite**: AP-10B authority designated (checklist item 6.1)  
**Estimated effort**: 1–2 days planning

---

### MC76 — Limited Pilot Planning

**Trigger**: After governance owners designated, PDPA review started  
**Scope**: Define scope, data set, timeline, and rollback plan for a limited real-data pilot  
**Deliverables**:
- Pilot scope document (which scholarship cycle, which data subset)
- Anonymization/pseudonymization plan
- Rollback runbook
- Success criteria

**Safety**: Docs/planning only  
**Prerequisite**: Checklist items 1.1, 2.1–2.3, 2.5, 6.1, 6.4 confirmed  
**Estimated effort**: 2–3 days planning

---

### MC77 — Persistence Activation

**Trigger**: After all governance checklist Sections 1–4 are confirmed  
**Scope**: Enable real database persistence (AP-10B infrastructure, not yet import confirmation)  
**Deliverables**:
- Database connection configuration
- Migration scripts tested
- Audit log persistence verified
- Rollback tested

**Safety**: High — real data layer; full governance required  
**Prerequisite**: All governance checklist Sections 1–4 confirmed  
**Estimated effort**: 3–5 days

---

### MC78 — Confirm Import (AP-10B) Activation

**Trigger**: After all 25 governance checklist items are confirmed  
**Scope**: Enable AP-10B (Confirm Import) so staff can process real data imports  
**Safety**: Highest — production data writes; full governance + PDPA sign-off required  
**Prerequisite**: All 25 governance checklist items confirmed + go/no-go meeting held  
**Estimated effort**: 2–4 days

---

### MC79 — Export Approval (AP-10C) & Approval Workflows (AP-11)

**Trigger**: After AP-10B successfully activated and stable  
**Scope**: Enable AP-10C (Export Approval) and AP-11 (Approval Workflows)  
**Safety**: Highest — all governance gates must be open; requires separate authority designations for AP-10C and AP-11  
**Prerequisite**: AP-10B stable + AP-10C authority (6.2) + AP-11 authority (6.3) designated

---

## Recommended Immediate Next Steps (Post-MC73, Pre-Demo)

| Priority | Action | Owner | Reference |
|----------|--------|-------|-----------|
| 1 | Schedule controlled demo session | Project Lead | `S2IMS_CONTROLLED_DEMO_EXECUTION_REPORT_TEMPLATE_MC73.md` |
| 2 | Distribute demo readiness materials to participants | Project Lead | docs/qa/MC64–MC67 |
| 3 | Confirm demo environment (localhost or staging) | Developer | — |
| 4 | Prepare feedback collection forms | Demo Coordinator | `S2IMS_CONTROLLED_DEMO_FEEDBACK_COLLECTION_TEMPLATE_MC73.md` |
| 5 | Designate governance owners (can be done independently) | Leadership | `S2IMS_IMPORT_PERSISTENCE_READINESS_GOVERNANCE_CHECKLIST_MC73.md` items 6.1–6.3 |
| 6 | Proceed with MC74 UX renovation (can be done in parallel) | Developer | Explicit approval required first |

---

## Timeline (Illustrative — Fill In Actual Dates)

| Milestone | Earliest Possible | Dependency |
|-----------|------------------|------------|
| First demo session | [FILL IN] | Scheduling only |
| Feedback summarized | [FILL IN] + 3 days | After demo |
| Governance owners designated | [FILL IN] | Leadership action |
| PDPA review initiated | [FILL IN] | After owner designation |
| AP-10B activated (MC78) | [FILL IN] | All 25 checklist items |
| Full production (MC79) | [FILL IN] | AP-10B stable + MC79 prerequisites |

---

**Document**: MC73 planning — not a sign-off sheet, not official evidence.  
**Updated**: 2026-05-21
