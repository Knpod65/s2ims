# Audit Production Persistence Owner Intake AP-10B

## 1. Purpose

This document prepares the owner-naming process for AP-10B production audit persistence approvals. It defines which approval owners must be named, what identity and authority information must be collected, and how missing or unverified owners keep AP-10C blocked.

This document does not collect approvals.
This document does not authorize AP-10C.
This document does not authorize schema, SQL, migration, backend/API, runtime, or persistence work.

AP-10C remains blocked until all 7 owners are named, all 7 written approvals are collected, and all 9 blocking conditions are false.

## 2. Current Gate Status

| Gate Item | Status |
|----------|--------|
| Owners named | 0/7 |
| Approvals collected | 0/7 |
| Blocking conditions cleared | 0/9 |
| Blocking conditions unresolved | 9/9 |
| Schema design document exists | No |
| AP-10C may open | No |
| AP-11 may open | No |

## 3. Required Owner Roles

### 3.1 Engineering Owner

- **Purpose:** Owns technical review of the future schema design and migration compatibility.
- **Authority needed:** Engineering decision authority for schema design, implementation feasibility, index design, checksum strategy, and rollback compatibility.
- **What they must review later:** Schema authorization, schema review criteria, database model, proposed schema design document, and fresh validation evidence.
- **What they are not approving yet:** No schema implementation, SQL, migration, backend/API work, runtime code, or persistence activation.
- **Missing information that blocks naming:** Missing full name, official engineering role, authority source, contact method, or ability to provide written approval.

### 3.2 DPO Owner

- **Purpose:** Owns data protection review for data minimization, lawful basis, DSAR feasibility, erasure compatibility, and privacy notice requirements.
- **Authority needed:** Named DPO authority or formally delegated DPO review authority.
- **What they must review later:** Schema authorization, DPO review criteria, privacy/PDPA plan, database model, and proposed schema design document.
- **What they are not approving yet:** No AP-10C implementation, real persistence, prototype persistence activation, or production launch.
- **Missing information that blocks naming:** Missing DPO role confirmation, delegated authority record, contact method, or written sign-off capability.

### 3.3 Legal Owner

- **Purpose:** Owns legal review for Thai retention requirements, cross-border restrictions, lawful basis, export policy, and evidence admissibility.
- **Authority needed:** Legal counsel or institutional legal reviewer with authority to approve audit retention and compliance requirements.
- **What they must review later:** Schema authorization, legal review criteria, database model retention sections, privacy/PDPA lawful basis sections, and proposed schema design document.
- **What they are not approving yet:** No SQL, migrations, backend/API work, production persistence, or AP-11.
- **Missing information that blocks naming:** Missing legal role/title, authority basis, contact method, or decision authority.

### 3.4 Privacy/PDPA Owner

- **Purpose:** Owns privacy review for forbidden PII classes, pseudonymization, reason-field risk, erasure compatibility, and raw identity separation.
- **Authority needed:** Privacy/PDPA reviewer with authority to approve privacy design requirements.
- **What they must review later:** Schema authorization, privacy/PDPA review criteria, database model forbidden patterns, and proposed schema design document.
- **What they are not approving yet:** No runtime behavior, Admin UI changes, export changes, real persistence, or prototype persistence activation.
- **Missing information that blocks naming:** Missing privacy authority source, role confirmation, contact method, or conflict-of-interest note.

### 3.5 Product/Admin Owner

- **Purpose:** Owns Admin audit evidence review, official read boundary, export policy, and user-facing impact assessment.
- **Authority needed:** Product/Admin decision authority for Admin audit workflows and official evidence boundaries.
- **What they must review later:** Schema authorization, Product/Admin review criteria, proposed schema design document, Admin-only access model, and export boundary.
- **What they are not approving yet:** No Admin UI behavior change, route/navigation change, export behavior change, or prototype read promotion.
- **Missing information that blocks naming:** Missing product ownership confirmation, Admin domain authority, contact method, or approval artifact location.

### 3.6 QA Owner

- **Purpose:** Owns validation freshness, QA completeness, docs-only scope confirmation, and final approval packet completeness.
- **Authority needed:** QA lead or designated QA owner with authority to accept or reject the validation evidence.
- **What they must review later:** QA checklist, evidence pack, schema review criteria, proposed schema design document, and current validation results.
- **What they are not approving yet:** No implementation branch, runtime change, schema migration, or production activation.
- **Missing information that blocks naming:** Missing QA authority, validation ownership, contact method, or ability to sign a dated written approval.

### 3.7 Rollback Owner

- **Purpose:** Owns emergency rollback readiness, rollback communication path, and compatibility of future schema design with flag-based rollback.
- **Authority needed:** Named owner with operational authority to trigger or coordinate rollback.
- **What they must review later:** Schema authorization, rollback review criteria, rollout/rollback plan, proposed schema design document, and rollback validation procedure.
- **What they are not approving yet:** No DDL revert plan, migration execution, production activation, or AP-10C implementation.
- **Missing information that blocks naming:** Missing rollback authority, contact method, escalation path, or written approval capability.

## 4. Owner Naming Requirements

For each owner, collect:

- full name
- official role/title
- unit/office
- email/contact
- approval authority source
- backup/delegate, if any
- conflict-of-interest note
- review responsibility
- expected approval artifact location
- approval expiry/freshness rule

## 5. Authority Verification Rule

Valid authority can come from:

- official role responsibility
- designated project owner
- delegated authority in writing
- named institutional responsibility

Invalid authority includes:

- informal reviewer only
- verbal assignment only
- unclear unit ownership
- person without decision authority
- owner who cannot sign written approval

## 6. Owner Intake Workflow

1. Identify candidate owners.
2. Confirm role authority.
3. Record owner contact.
4. Confirm evidence responsibilities.
5. Confirm no conflict of interest.
6. Add owner to matrix.
7. Mark status as Named.
8. Do not mark Approved until written approval is collected.
9. Re-run QA validation before approval round.
10. Keep AP-10C blocked.

## 7. Owner Status Rules

Allowed statuses:

- Not named
- Candidate identified
- Authority pending
- Named
- In review
- Changes requested
- Approved
- Rejected
- Expired

Current status remains:

- Not named for all 7 owners

## 8. Blocking Conditions Still Active

All 9 blocking conditions remain active:

1. Fewer than 7 approvals collected
2. Any owner not named
3. Schema design document missing
4. DPO sign-off missing
5. Legal sign-off missing
6. QA evidence stale or failing
7. Rollback owner not identified
8. Any open PII/privacy concern
9. Any request to implement migration/runtime before approval

Current status:

- all 9 blocking conditions remain active

## 9. What Owner Naming Does Not Authorize

Owner naming does not authorize:

- AP-10C branch creation
- schema design implementation
- SQL
- migration
- backend/API work
- real persistence
- prototype persistence activation
- Admin UI change
- export behavior change
- AP-11

## 10. Recommended Next Step

Name candidate owners only, then update the owner matrix.
