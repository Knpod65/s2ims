# Audit Production Persistence Approval Owner Matrix AP-10B

## 1. Purpose

This matrix tracks named owners and sign-off readiness for the AP-10B schema authorization process. It is the single source of truth for who must approve, what status each approval is in, and whether the gate for Phase (c) may open.

## 2. Owner Matrix

| # | Owner Type | Named Person | Unit/Role | Required Evidence | Approval Status | Date | Notes |
|---|------------|--------------|-----------|-------------------|-----------------|------|-------|
| 1 | Engineering | TBD | TBD | Schema constraints, index design, checksumHash, migration compatibility, rollback compatibility | Not collected | TBD | Required |
| 2 | DPO | TBD | TBD | Data minimization, lawful basis, pseudonymization, retention, erasure, breach notification | Not collected | TBD | Required |
| 3 | Legal | TBD | TBD | Retention period compliance, cross-border transfer, export policy, regulatory basis | Not collected | TBD | Required |
| 4 | Privacy/PDPA | TBD | TBD | No raw PII, pseudonymization at schema level, reason column privacy, erasure compatibility | Not collected | TBD | Required |
| 5 | Product/Admin | TBD | TBD | Admin read boundary, official evidence boundary, export policy, user-facing impact | Not collected | TBD | Required |
| 6 | QA | TBD | TBD | Build/token/audit results, route smoke, privacy checklist, diff scope, safety confirmation | Not collected | TBD | Required |
| 7 | Rollback | TBD | TBD | Rollback plan review, emergency rollback <5 min, flag disablement path, communication route | Not collected | TBD | Required |

## 3. Status Definitions

| Status | Meaning |
|--------|---------|
| Not named | Owner not yet identified |
| Named | Owner identified but has not begun review |
| In review | Owner is reviewing evidence and preparing sign-off |
| Changes requested | Owner has requested changes before approving |
| Approved | Owner has provided a valid written sign-off |
| Rejected | Owner has explicitly rejected the schema design |
| Expired | Owner's approval is no longer within the freshness window |

## 4. Completion Rule

The approval matrix is complete when all of the following are true:

- All 7 owners are named (no TBD entries in "Named Person")
- All 7 statuses are "Approved"
- Each approval has a dated written record
- Each approval references the schema design document by name
- No approval is expired (must be within 7-day freshness window)
- Evidence tracker confirms all artifacts are complete
- All 9 blocking conditions are false

## 5. Current Status

| Metric | Value |
|--------|-------|
| Owners named | 0/7 |
| Approvals collected | 0/7 |
| Approvals pending | 7/7 |
| Blocking conditions resolved | 0/9 |
| Readiness for AP-10C | NOT READY |

## 6. Action Required

Before any sign-off can be collected:
1. Fill in "Named Person" and "Unit/Role" for all 7 owners
2. Create the schema design document
3. Run fresh validation (build, tokens, audit, routes)
4. Distribute the evidence pack to all identified owners

**Do not collect sign-offs until the above actions are complete.**

## 7. Related Documents

- `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_SIGNOFF_TEMPLATE_AP10B.md` — Sign-off template (one per owner)
- `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_EVIDENCE_TRACKER_AP10B.md` — Artifact and evidence tracker
- `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_COLLECTION_AP10B.md` — Approval collection master doc
- `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md` — Per-owner review criteria