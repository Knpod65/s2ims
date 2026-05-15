# Audit Production Persistence Evidence Pack AP-10B

## 1. Purpose

This document organizes the evidence required to request all 7 written owner approvals defined in the AP-10B schema authorization framework before Phase (c) implementation may begin.

**This is documentation-only.**

This document:
- Does NOT approve or authorize Phase (c) (implementation).
- Does NOT authorize runtime implementation of any kind.
- Does NOT authorize database migration or schema creation.
- Does NOT activate real persistence or prototype persistence.
- Does NOT modify any runtime code, configuration, or mock fixtures.
- Only prepares the review packet needed to request written sign-offs from the 7 required approval owners.

The evidence pack serves as the single coordination artifact for collecting, tracking, and verifying all approval prerequisites defined in:
- `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md`
- `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md`
- `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md` (section 11)

## 2. Current Phase Boundary

| Phase | Name | Status |
|-------|------|--------|
| AP-10A | Production persistence planning | Complete — merged to main |
| AP-10B | Schema authorization framework + evidence pack | Complete — merged to main |
| AP-10B Evidence Pack | Approval preparation | **In progress** |
| AP-10C | Implementation (blocked) | **Blocked — pending 7 approvals** |
| AP-10D | Staging migration dry-run | Blocked |
| AP-10E | Production rollout | Blocked |

AP-10C remains blocked until every item in this evidence pack is complete, signed, dated, and referenced in a final approval summary.

## 3. Required Approval Owners

| # | Owner | Required Evidence | Required Sign-Off Format | Blocking if Missing? | Reference Document |
|---|-------|-------------------|--------------------------|---------------------|--------------------|
| 1 | Engineering | Schema constraints review, index design, checksumHash design, migration compatibility, rollback compatibility, test strategy | Written sign-off (dated, referenced to schema design doc name) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md section 1 |
| 2 | Privacy/PDPA | Data minimization, pseudonymization, retention, erasure, metadata restrictions, no raw PII, no unsafe logs/exports | Written sign-off (dated, referenced to schema design doc name) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 10 |
| 3 | DPO | Lawful basis per event type, data subject rights, retention, breach procedure, privacy notice update, cross-border concerns | Written sign-off (dated, referenced to schema design doc name AND privacy doc) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md section 2 |
| 4 | Legal | Retention period compliance, evidentiary boundary, export policy, cross-border transfer, litigation/regulatory risk | Written sign-off (dated, referenced to schema design doc name) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md section 3 |
| 5 | Product/Admin owner | Admin read boundary, official evidence boundary, user-facing impact, export policy, operational acceptability | Written sign-off (dated, referenced to schema design doc name) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md section 5 |
| 6 | QA | All validation results passed, route smoke passed, check count recorded, docs reviewed, safety checklist complete, no runtime work started | Written sign-off (dated, referenced to schema design doc name) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md section 6 |
| 7 | Rollback owner | Owner identified, rollback procedure reviewed, flag disablement path understood, rollback test planned, communication route established | Written sign-off (dated, referenced to schema design doc name) | Yes — blocks AP-10C | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md section 7 |

**All 7 approvals are required. Missing any single approval blocks AP-10C.**

## 4. Evidence Index

Every artifact required for the 7-owner review packet:

| # | Artifact | Document / Location | Status |
|---|----------|---------------------|--------|
| 1 | AP-10A production persistence plan | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md` | ✅ Complete |
| 2 | AP-10A database model plan | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md` | ✅ Complete |
| 3 | AP-10A privacy/PDPA plan | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md` | ✅ Complete |
| 4 | AP-10A rollout/rollback plan | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md` | ✅ Complete |
| 5 | AP-10A QA checklist | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md` | ✅ Complete |
| 6 | AP-10B authorization framework | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md` | ✅ Complete |
| 7 | AP-10B review criteria (per owner) | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md` | ✅ Complete |
| 8 | AP-10B post-merge QA summary | `docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B_POST_MERGE_QA_SUMMARY.md` | ✅ Complete |
| 9 | AP-10B QA checkpoint | `docs/qa/audit-production-persistence-schema-authorization-ap10b/README.md` | ✅ Complete |
| 10 | Current build/token/audit check results | See section 7 below | Pending fresh run |
| 11 | Current route smoke results | See section 7 below | Pending fresh run |
| 12 | Proposed schema design document | **Not yet created — placeholder** | ⬜ Pending |
| 13 | DPO sign-off | Sign-off template per section 5 below | ⬜ Pending |
| 14 | Privacy/PDPA sign-off | Sign-off template per section 5 below | ⬜ Pending |
| 15 | Legal sign-off | Sign-off template per section 5 below | ⬜ Pending |
| 16 | Engineering sign-off | Sign-off template per section 5 below | ⬜ Pending |
| 17 | Product/Admin owner sign-off | Sign-off template per section 5 below | ⬜ Pending |
| 18 | QA sign-off | Sign-off template per section 5 below | ⬜ Pending |
| 19 | Rollback owner sign-off | Sign-off template per section 5 below | ⬜ Pending |

## 5. Approval Request Readiness Matrix

All status values default to `Pending`. Update as evidence is collected.

| Evidence Item | Prepared? | Reviewed? | Approved? | Owner | Notes |
|---------------|-----------|-----------|-----------|-------|-------|
| AP-10A plan | ✅ Yes | ✅ Yes | N/A — planning doc | — | Merged to main |
| AP-10A database model | ✅ Yes | ✅ Yes | N/A — planning doc | — | Merged to main |
| AP-10A privacy/PDPA plan | ✅ Yes | ✅ Yes | N/A — planning doc | — | Merged to main |
| AP-10A rollout/rollback plan | ✅ Yes | ✅ Yes | N/A — planning doc | — | Merged to main |
| AP-10A QA checklist | ✅ Yes | ✅ Yes | N/A — planning doc | — | Merged to main |
| AP-10B authorization framework | ✅ Yes | ✅ Yes | N/A — framework doc | — | Merged to main |
| AP-10B review criteria | ✅ Yes | ✅ Yes | N/A — criteria doc | — | Merged to main |
| AP-10B post-merge QA summary | ✅ Yes | ✅ Yes | N/A — QA doc | — | Merged to main |
| Schema design document | ❌ No | ❌ No | ❌ No | Engineering + DPO | Must be created and reviewed before sign-offs |
| Build validation (40/40) | Pending fresh run | Pending | Pending | Engineering | Must be < 7 days old at sign-off |
| Token validation (4/4) | Pending fresh run | Pending | Pending | Engineering | Must be < 7 days old at sign-off |
| Audit checks (139/139) | Pending fresh run | Pending | Pending | QA | Must be < 7 days old at sign-off |
| Route smoke (5×200) | Pending fresh run | Pending | Pending | QA | Must be < 7 days old at sign-off |
| Engineering sign-off | ❌ No | ❌ No | ❌ No | Engineering | Requires schema doc + validations |
| Privacy/PDPA sign-off | ❌ No | ❌ No | ❌ No | Privacy/PDPA | Requires schema doc + privacy review |
| DPO sign-off | ❌ No | ❌ No | ❌ No | DPO | Requires schema doc + privacy doc section 10 |
| Legal sign-off | ❌ No | ❌ No | ❌ No | Legal | Requires schema doc + retention review |
| Product/Admin owner sign-off | ❌ No | ❌ No | ❌ No | Product/Admin | Requires schema doc + access control review |
| QA sign-off | ❌ No | ❌ No | ❌ No | QA | Requires all validations + checklist |
| Rollback owner sign-off | ❌ No | ❌ No | ❌ No | Rollback owner | Requires rollback plan review |

## 6. Blocking Conditions

All of the following conditions must be **false** before AP-10C can begin. Per the AP-10B authorization framework, each is a hard gate.

| # | Blocking Condition | Current Status | Evidence Required to Clear |
|---|--------------------|----------------|---------------------------|
| 1 | Any missing, undated, or unsigned evidence item | Active — evidence collection has not started | All 19 items in evidence index must be dated, signed, and referenced |
| 2 | DPO sign-off does not reference the schema design document by name | Unknown until DPO review | DPO sign-off must explicitly name the schema design document |
| 3 | Legal sign-off missing Thai regulatory retention confirmation | Unknown until Legal review | Legal sign-off must confirm retention per Thai regulation (3yr access / 7yr modification) |
| 4 | Fewer than all 7 owners have signed off | Active — zero sign-offs collected | All 7 written approvals required |
| 5 | Any forbidden storage pattern present in schema design | Cannot evaluate until schema design exists | Schema must be reviewed against AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 3 |
| 6 | Schema missing any of the 11 required fields | Cannot evaluate until schema design exists | Schema must include: eventId, actorId, actorRole, targetId, targetType, action, reason, createdAt, environment, sessionId, checksumHash |
| 7 | QA gate results older than 7 days at time of Phase (c) branch opening | N/A — will apply when Phase (c) opens | Fresh validation run within 7 days of branch creation |
| 8 | Schema design not jointly reviewed by DPO and Engineering | Unknown until review process begins | Both DPO and Engineering must review and sign off on the schema design |
| 9 | Rollback owner has not confirmed rollback plan compatibility | Unknown until Rollback review | Rollback owner must confirm the schema supports < 5-minute emergency rollback |

**Current blocking status: ALL 9 conditions remain unresolved. AP-10C is blocked.**

## 7. Validation Evidence Requirements

When collecting sign-offs, the following validation evidence must be **fresh** (no older than 7 days from the date of the sign-off):

### 7.1 Automated Checks

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Build | `npm run build` | 40/40 routes, 0 type errors |
| Token check | `npm run check:tokens` | 4/4 passed |
| Audit/event checks | `npm run check:audit-events` | 139/139 minimum (current baseline) |

### 7.2 Route Smoke Tests

| Route | Expected Result |
|-------|-----------------|
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |

### 7.3 Log Verification

- Dev log: no errors, warnings, or hydration issues

### 7.4 Documentation Verification

- Diff scope confirmation: `git diff --name-only origin/main...HEAD | grep -v "^docs/"` must return empty
- Schema design document must not expose PII in examples, route labels, logs, exports, payloads, or metadata

## 8. Privacy/PDPA Evidence Requirements

The following items must be confirmed and documented for the Privacy/PDPA sign-off:

| # | Evidence Item | Reference |
|---|---------------|-----------|
| 1 | Data minimization statement — all required fields justified | AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 2 |
| 2 | Lawful basis statement per event type | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 4 |
| 3 | Retention schedule (3yr access / 7yr modification / 90d staging / 7yr erasure log) | AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 5 |
| 4 | Erasure workflow — in-place suppression procedure | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 7 |
| 5 | Breach notification workflow (72-hour PDPC, internal escalation) | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 9 |
| 6 | Cross-border transfer restriction — Thailand-region only | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 8 |
| 7 | PII forbidden-field review (no raw national ID, email, phone, bank, IP, file names, OCR) | AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 3 |
| 8 | Pseudonymization/hash strategy for actorId and targetId | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 3 |

## 9. Legal Evidence Requirements

The following items must be confirmed and documented for the Legal sign-off:

| # | Evidence Item | Reference |
|---|---------------|-----------|
| 1 | Audit retention period confirmation (3yr access, 7yr modification, 7yr erasure log) | AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 5 |
| 2 | Regulatory basis for each retention period | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 4 |
| 3 | Export policy confirmation — official store only, no prototype/comparison data | AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md section 9 |
| 4 | Evidence admissibility boundary — schema supports audit trail continuity | AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 6 |
| 5 | Cross-border transfer restriction confirmed | AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 8 |
| 6 | Legal owner sign-off (dated written confirmation) | — |

## 10. Rollback Evidence Requirements

The following items must be confirmed and documented for the Rollback owner sign-off:

| # | Evidence Item | Reference |
|---|---------------|-----------|
| 1 | Rollback owner name and role identified | — |
| 2 | Rollback procedure reference — flag-based disable, no DDL revert required | AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md section 5 |
| 3 | Target rollback time: under 5 minutes (emergency) | AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md section 7 |
| 4 | Flag disablement path: `shadowWrites: false` in config override | AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md section 5 |
| 5 | Post-rollback validation procedure (8-step checklist) | AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md section 6 |
| 6 | Incident communication owner and escalation path | — |

## 11. QA Evidence Requirements

The following items must be confirmed and documented for the QA sign-off:

| # | Evidence Item | Reference |
|---|---------------|-----------|
| 1 | QA checklist completion — all phases applicable items checked | AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md |
| 2 | Route smoke results — 5 routes × 200 OK | See section 7.2 |
| 3 | Audit check count — current baseline (139/139) | See section 7.1 |
| 4 | Build result (40/40) and token result (4/4) | See section 7.1 |
| 5 | Privacy checklist confirmation — all 11 privacy items pass | AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md section 4 |
| 6 | Diff scope confirmation — docs-only | See section 7.4 |
| 7 | No runtime implementation confirmation — src/*, scripts/*, package.json unchanged | AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md |

## 12. Evidence Pack Completion Rule

**AP-10C may not begin until every required item is complete, signed, dated, and referenced in a final approval summary.**

The final approval summary must be a single document that references:
- All 7 owner sign-offs with dates and signatory names
- All validation evidence with timestamps
- Confirmation that all 9 blocking conditions are false
- The schema design document name and version
- A declaration that the evidence pack is complete and ready for Phase (c) review

## 13. Recommended Next Step

1. **Create the schema design document** — this is the primary artifact needed for all 7 owner reviews.
2. **Name and assign the 7 approval owners** — identify who will sign off for each category.
3. **Run fresh validations** — update the approval readiness matrix with current results.
4. **Distribute the evidence pack** — share this document and all referenced artifacts with the 7 owners for their review.
5. **Collect written sign-offs** — use the sign-off template (`AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_SIGNOFF_TEMPLATE_AP10B.md`).
6. **Update this tracker** as each item progresses from Pending to Reviewed to Approved.

**Do not start AP-10C. Do not start AP-11. Do not activate persistence.**