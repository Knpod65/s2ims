# Audit Production Persistence Approval Sign-Off Template AP-10B

## 1. Purpose

This template standardizes the written sign-off required from each of the 7 approval owners before Phase (c) implementation may begin.

One copy must be completed per owner. Each sign-off is an independent document — a single owner's approval does not imply or substitute for any other owner's approval.

## 2. How to Use This Template

- Create one instance of this template per owner.
- Fill in all fields completely. Leave nothing blank.
- Each owner must **individually** review the materials listed and record their decision.
- **No approval by silence.** An owner who does not respond within the agreed timeline is recorded as "Pending" and blocks Phase (c).
- All open concerns must be resolved and documented before a sign-off can be recorded as "Approved."
- The sign-off must explicitly reference AP-10B and the schema design document by its exact file name.

## 3. Shared Sign-Off Fields

Every sign-off instance must include:

```
Owner name:
Owner role:
Approval category: [Engineering | Privacy/PDPA | DPO | Legal | Product/Admin | QA | Rollback]
Date:
Reviewed documents:
Reviewed validation results:
Open concerns:
Decision: [ ] Approved  [ ] Approved with conditions  [ ] Rejected
Conditions (if applicable):
Signature / written confirmation reference:
```

### 3.1 Document Checklist (to be attached or referenced)

Each owner must confirm they have reviewed:

- [ ] `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md`
- [ ] `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md`
- [ ] The proposed schema design document (name: _______________)
- [ ] Relevant domain documents listed in their section below

## 4. Engineering Sign-Off Checklist

The engineering reviewer confirms the schema design is technically sound, complete, and implementation-ready.

Checklist:

- [ ] All 11 required fields are present (`eventId`, `actorId`, `actorRole`, `targetId`, `targetType`, `action`, `reason`, `createdAt`, `environment`, `sessionId`, `checksumHash`)
- [ ] Field types are correct (UUID, string, enum, UTC timestamp as applicable)
- [ ] Core fields are marked immutable after insert
- [ ] No raw PII columns in the schema
- [ ] Index design reviewed (actor-time, target-time, action-time, environment-time)
- [ ] `checksumHash` specification reviewed (SHA-256, concatenation order, hex encoding)
- [ ] Migration compatibility confirmed (shadow write, dual-read, promotion — no mid-migration schema changes)
- [ ] Rollback compatibility confirmed (flag-based disable, no DDL revert required)
- [ ] Backup/recovery requirements reviewed
- [ ] No forbidden storage patterns present

Engineering review notes:

```
[Engineering reviewer's detailed notes here]
```

## 5. Privacy/PDPA Sign-Off Checklist

The privacy reviewer confirms the schema design does not expose PII through its structure, indexing, or implied query patterns.

Checklist:

- [ ] Data minimization: only fields from database model section 2 are included
- [ ] No raw national ID, email, phone, bank account, IP, file path, or OCR text columns
- [ ] `actorId` and `targetId` hold hash/token values only
- [ ] No join between core event table and a raw identity table
- [ ] `reason` column is reviewed for indirect PII risk
- [ ] No full-text index on `reason` in any production index
- [ ] Retention encoding supports automated batch deletion
- [ ] No retention encoding implies indefinite retention
- [ ] PII columns are nullable or have erasure token support
- [ ] Erasure procedure does not require physical row deletion
- [ ] Privacy notice scope update documented

Privacy/PDPA review notes:

```
[Privacy reviewer's detailed notes here]
```

## 6. DPO Sign-Off Checklist

The DPO confirms the schema design satisfies data minimization, lawful basis, DSAR feasibility, and erasure compatibility.

Checklist:

- [ ] Each field has a documented necessity justification
- [ ] Lawful basis stated for each event type (legal obligation or legitimate interest)
- [ ] Legitimate interest assessment (LIA) referenced where applicable
- [ ] Pseudonymization confirmed: `actorId` and `targetId` are tokenized
- [ ] Token-to-identity mapping is a separate, access-controlled structure
- [ ] `reason` column type and constraints prevent raw PII storage
- [ ] Retention encoding compatible with automated batch deletion
- [ ] DSAR query path exists: query by `actorId` token and `targetId` token
- [ ] Neither DSAR query requires joining to a raw identity table
- [ ] Erasure compatibility: skeletal record preserved, audit trail continuity maintained
- [ ] Privacy notice will be updated before Phase (c) begins
- [ ] `AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md` section 10 requirements confirmed

DPO review notes:

```
[DPO reviewer's detailed notes here]
```

## 7. Legal Sign-Off Checklist

The legal reviewer confirms the schema design is compatible with Thai regulatory requirements.

Checklist:

- [ ] Retention period compliance: access events ≥ 3 years, modification events ≥ 7 years
- [ ] Erasure procedure confirmed as legally compliant for audit record purposes
- [ ] Physical row deletion is incompatible with evidentiary requirements — rejected
- [ ] Erasure log entries retained for 7 years
- [ ] Export path reads only from official production store
- [ ] No prototype/comparison data in any export path
- [ ] Bulk export (> 1000 records) requires Admin role verification and session log
- [ ] Cross-border transfer restriction confirmed (Thailand-region only)
- [ ] Lawful basis for each event type recorded and legally reviewed
- [ ] No schema-level element implies foreign data transfer

Legal review notes:

```
[Legal reviewer's detailed notes here]
```

## 8. Product/Admin Owner Sign-Off Checklist

The product/Admin owner confirms the schema design supports Admin-only access and the correct evidence boundary.

Checklist:

- [ ] No query path exposes audit records to non-Admin roles
- [ ] Role-based access control described in schema design
- [ ] `exportAuditCSV` reads from official store only
- [ ] No prototype/comparison data in any Admin query result
- [ ] Admin access logging supported (Admin reads logged as audit events)
- [ ] `adminAuditDisplayAdapter` is the only component reading from official store for display
- [ ] `AdminAuditComparisonDebugPanel` remains diagnostic-only, no comparison data in official store
- [ ] User-facing impact assessed and documented

Product/Admin review notes:

```
[Product/Admin reviewer's detailed notes here]
```

## 9. QA Sign-Off Checklist

The QA reviewer confirms the schema design is complete, internally consistent, and supports all QA gates.

Checklist:

- [ ] All 11 required fields present with type, constraint, and privacy classification
- [ ] All forbidden patterns from database model section 3 explicitly excluded
- [ ] All 4 indexes present with rationale (actor-time, target-time, action-time, environment-time)
- [ ] No full-text index on `reason`
- [ ] Retention periods match database model section 5 (3yr/7yr/90d/7yr)
- [ ] Erasure procedure compatible (PII columns nullable, skeletal record non-nullable)
- [ ] Migration strategy compatible (shadow write, dual-read, promotion — no mid-migration schema changes)
- [ ] Backup/recovery requirements reflected
- [ ] Build validation: 40/40 routes, 0 type errors (within 7 days)
- [ ] Token check: 4/4 passed (within 7 days)
- [ ] Audit checks: 139/139 minimum passed (within 7 days)
- [ ] Route smoke: 5 routes × 200 OK (within 7 days)
- [ ] Dev log clean (within 7 days)
- [ ] Diff scope: docs-only confirmed

QA review notes:

```
[QA reviewer's detailed notes here]
```

## 10. Rollback Owner Sign-Off Checklist

The rollback owner confirms the schema design does not create rollback dependencies that violate the emergency rollback time target.

Checklist:

- [ ] Rollback owner name and role identified
- [ ] Shadow-write rollback achievable by setting `shadowWrites: false` — no DDL revert required
- [ ] Core event table presence does not block rollback (can remain empty without affecting Admin display)
- [ ] No uniqueness constraint conflicts with existing mock store data
- [ ] Emergency rollback (< 5 minutes) achievable with proposed schema
- [ ] Rollback tested in staging before Phase (e) production rollout
- [ ] Incident communication route established
- [ ] Post-rollback validation procedure reviewed

Rollback owner review notes:

```
[Rollback owner's detailed notes here]
```

## 11. Rejection / Conditional Approval Handling

- **Rejected approval** blocks AP-10C. The blocking concern must be documented, resolved, and re-reviewed before the owner can re-sign.
- **Conditional approval** blocks AP-10C until all conditions are resolved. Conditions must be documented, assigned an owner, and re-reviewed after resolution.
- A rejected or conditional sign-off does not invalidate other owners' approvals — it only blocks the gate until resolved.

## 12. Final Sign-Off Statement

Each owner must include the following statement (or equivalent) at the end of their sign-off:

> "I confirm that I have reviewed the AP-10B evidence pack and the referenced schema design materials (schema design document: _______________). Based on the materials reviewed, I approve proceeding to the next authorized planning step only as described. This sign-off does not authorize production persistence activation unless separately stated in an approved implementation gate."

Owner signature / written confirmation: _______________

Date: _______________