# S²IMS Import & Persistence Readiness Governance Checklist

**Classification**: Internal Governance Planning Document  
**Date**: 2026-05-21  
**Milestone**: MC73  
**Status**: DRAFT — No items are approved. No sign-offs have been collected.

---

## IMPORTANT NOTICE

**This document is NOT a sign-off sheet.**  
**No approvals have been collected.**  
**No checkboxes in this document are checked.**  
**All items below are PENDING — none are complete.**

This checklist defines what must be verified and approved before real data import and persistence can be enabled in S²IMS. It is a planning instrument only.

---

## Current Gate Status

| Gate | Status | Blocker |
|------|--------|---------|
| AP-10B (Confirm Import) | 🔒 BLOCKED | Not approved |
| AP-10C (Export Approval) | 🔒 BLOCKED | Not approved |
| AP-11 (Approval Workflows) | 🔒 BLOCKED | Not approved |

---

## Section 1: Legal & Regulatory Compliance

| # | Requirement | Owner | Status | Evidence Needed |
|---|-------------|-------|--------|----------------|
| 1.1 | PDPA (Thailand Personal Data Protection Act) review complete | Legal / DPO | ⬜ PENDING | Signed PDPA impact assessment |
| 1.2 | Data retention policy defined (how long records are kept, deletion schedule) | Legal / IT | ⬜ PENDING | Written retention policy document |
| 1.3 | Data subject rights procedures documented (access, correction, deletion requests) | Legal | ⬜ PENDING | Procedure document |
| 1.4 | Privacy notice updated for S²IMS data collection | Legal | ⬜ PENDING | Updated privacy notice |
| 1.5 | Government data classification review (sensitive vs. non-sensitive fields) | IT Security | ⬜ PENDING | Field classification matrix |

---

## Section 2: Data Contract & Quality

| # | Requirement | Owner | Status | Evidence Needed |
|---|-------------|-------|--------|----------------|
| 2.1 | Source data contract defined (format, encoding, required fields, allowed nulls) | Data Team | ⬜ PENDING | Data contract document |
| 2.2 | Data quality thresholds established (completeness %, format error tolerance) | Data Team | ⬜ PENDING | Quality threshold document |
| 2.3 | Mapping from source schema to S²IMS types confirmed | Developer + Data | ⬜ PENDING | Schema mapping document |
| 2.4 | Duplicate detection strategy defined | Developer | ⬜ PENDING | Deduplication logic spec |
| 2.5 | Rollback procedure for failed imports documented | Developer + IT | ⬜ PENDING | Rollback runbook |

---

## Section 3: Technical Infrastructure

| # | Requirement | Owner | Status | Evidence Needed |
|---|-------------|-------|--------|----------------|
| 3.1 | Production database provisioned and accessible | IT/DevOps | ⬜ PENDING | DB connection config (non-prod) |
| 3.2 | Backup strategy verified (pre-import backup required) | IT/DevOps | ⬜ PENDING | Backup confirmation |
| 3.3 | Audit log persistence activated and tested | Developer | ⬜ PENDING | Audit log test output |
| 3.4 | Import preview (AP-10B code path) reviewed by developer | Developer | ⬜ PENDING | Code review record |
| 3.5 | Performance tested with production-scale data volume | Developer | ⬜ PENDING | Load test results |
| 3.6 | Error handling for partial imports validated | Developer | ⬜ PENDING | Error scenario test results |

---

## Section 4: Access Control & Security

| # | Requirement | Owner | Status | Evidence Needed |
|---|-------------|-------|--------|----------------|
| 4.1 | RBAC roles confirmed for production (who can import, approve, export) | IT Security | ⬜ PENDING | Role assignment matrix |
| 4.2 | API authentication confirmed for production environment | Developer | ⬜ PENDING | Auth config review |
| 4.3 | PII masking verified for non-privileged roles | Developer | ⬜ PENDING | Masking test results |
| 4.4 | Session management and timeout configured for production | Developer | ⬜ PENDING | Session config review |

---

## Section 5: Operational Readiness

| # | Requirement | Owner | Status | Evidence Needed |
|---|-------------|-------|--------|----------------|
| 5.1 | Import operator trained on AP-10B workflow | Operations | ⬜ PENDING | Training record |
| 5.2 | Escalation path defined (who to call if import fails) | Operations | ⬜ PENDING | Escalation matrix |
| 5.3 | Incident response plan documented | IT/Operations | ⬜ PENDING | IR plan document |
| 5.4 | Monitoring and alerting configured | IT/DevOps | ⬜ PENDING | Monitoring dashboard |

---

## Section 6: Governance Approval

| # | Requirement | Owner | Status | Evidence Needed |
|---|-------------|-------|--------|----------------|
| 6.1 | AP-10B (Confirm Import) authority designated | Leadership | ⬜ PENDING | Designation record |
| 6.2 | AP-10C (Export Approval) authority designated | Leadership | ⬜ PENDING | Designation record |
| 6.3 | AP-11 (Approval Workflows) authority designated | Leadership | ⬜ PENDING | Designation record |
| 6.4 | Go/no-go review meeting scheduled | Project Lead | ⬜ PENDING | Meeting calendar invite |
| 6.5 | Go/no-go decision recorded (after all items above are checked) | Project Lead | ⬜ PENDING | Signed decision document |

---

## Go/No-Go Criteria

**ALL of the following must be true before AP-10B can be opened:**

- [ ] All Section 1 items (1.1–1.5) confirmed
- [ ] All Section 2 items (2.1–2.5) confirmed
- [ ] All Section 3 items (3.1–3.6) confirmed
- [ ] All Section 4 items (4.1–4.4) confirmed
- [ ] All Section 5 items (5.1–5.4) confirmed
- [ ] All Section 6 items (6.1–6.5) confirmed

**Current status: 0/25 items confirmed. AP-10B remains BLOCKED.**

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-21 | Initial draft created (MC73) | MC73 documentation |

---

**Document Classification**: Internal governance planning only.  
**This document is NOT a sign-off sheet.**  
**No approvals have been collected in this document.**  
**To open AP-10B, all 25 checklist items above must be confirmed by their designated owners.**
