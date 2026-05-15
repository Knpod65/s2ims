Audit Production Persistence Schema Design Review Criteria AP-10B

This document specifies the review criteria each of the 7 approval owners must apply when reviewing the Phase (b) schema design document. Each owner signs off only when all criteria in their section are satisfied. These criteria are pass/fail — a schema design that fails any criterion in any owner's section is not approved for Phase (c).

All criteria reference field definitions and constraints from:
- AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md (sections 2–8)
- AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md (sections 2–10)
- AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md (sections 5–7)

---

1. Engineering review criteria

The engineering reviewer confirms the schema design is technically sound, complete, and implementation-ready.

Field completeness:
- All 11 required fields are present in the schema design: `eventId`, `actorId`, `actorRole`, `targetId`, `targetType`, `action`, `reason`, `createdAt`, `environment`, `sessionId`, `checksumHash`
- No required field is missing or merged with another field
- No additional fields are added without a documented necessity justification and DPO approval

Field types:
- `eventId`: UUID type, generated at write time, never reused
- `actorId`: string type (hash/token value — not raw identity)
- `actorRole`: enum type with defined values (admin, staff — and any other roles present in the system)
- `targetId`: string type (hash/token value — not raw identity)
- `targetType`: enum type with defined values
- `action`: enum type with controlled vocabulary — free-text action labels are not permitted
- `reason`: text/string type; not nullable at the schema level (empty string is the correct value when no reason is required)
- `createdAt`: UTC timestamp type; server-assigned; not nullable; immutable after write
- `environment`: enum type with values staging and production; set at write time
- `sessionId`: UUID type; session-scoped; not the same as user identity
- `checksumHash`: string type; SHA-256 hex digest; computed at write time; recomputed at erasure

Immutability:
- `eventId`, `actorId`, `actorRole`, `targetId`, `targetType`, `action`, `createdAt`, `environment` are marked as immutable after insert — no UPDATE path is permitted on these columns
- The only permitted post-write operation on PII columns is in-place suppression (erasure) per the PDPA erasure procedure

Forbidden patterns:
- No column typed for raw national ID, raw email, raw phone, raw bank account, raw IP address, raw file path, or raw OCR text
- No UPDATE or REPLACE operation on the core event table for non-erasure purposes
- No bulk DELETE without an erasure log entry
- No full-text index on `reason`

Index design:
- Actor-time index: (`actorId`, `createdAt`) — for Admin actor-scoped review
- Target-time index: (`targetId`, `createdAt`) — for target-scoped review
- Action-time index: (`action`, `createdAt`) — for action-type review
- Environment-time index: (`environment`, `createdAt`) — for staging/production partitioning
- No full-text index on `reason` in any environment without a DPO-approved justification

Migration phase compatibility:
- The schema supports shadow writes from `AuditPersistenceService` without requiring changes to `adminAuditDisplayAdapter` or `sharedMockWriter`
- The schema supports dual-read comparison (Phase (c) step 2) without schema changes
- Promotion from shadow write to authoritative source does not require schema migration — only a config flag change

`checksumHash` specification:
- Hash input is the concatenation of all 11 fields in a defined, documented order
- Concatenation uses a defined separator or encoding (e.g., JSON serialization of an ordered object) to prevent collision between fields
- Hash algorithm is SHA-256
- Hash is stored as a lowercase hex string
- At read time, the hash is recomputed and compared to the stored value; mismatch is a tamper detection signal
- At erasure time, the hash is recomputed over the suppressed record (PII fields replaced with erasure token); the original hash is preserved in the erasure log

Backup/recovery:
- The schema is hosted in a recoverable store with point-in-time recovery capability
- Schema design does not include any field or table structure that is excluded from the backup scope

---

2. DPO review criteria

The DPO confirms the schema design satisfies data minimization, lawful basis, DSAR feasibility, and erasure compatibility. DPO sign-off is a dated written document.

Data minimization:
- Each of the 11 required fields has a documented necessity justification in the schema design document
- No field is included on the basis of "might be useful later" — every field has a stated audit purpose
- No field is included that could serve the audit purpose in a less privacy-intrusive form

Lawful basis per event type:
- The schema design document explicitly states the lawful basis for each event type stored (legal obligation per PDPA Section 24(3), or legitimate interest per Section 24(5))
- A legitimate interest assessment (LIA) reference is included for any event type covered by legitimate interest

Pseudonymization:
- `actorId` column holds hash/token values only — a raw identity join column is not part of the schema design
- `targetId` column holds hash/token values only — a raw identity join column is not part of the schema design
- The mapping table (token → real identity) is described as a separate, access-controlled structure — not part of the audit event store

`reason` column:
- Type and constraint confirm that raw national IDs, emails, phones, bank accounts are not stored in this column
- No full-text index on `reason` in any production index design
- Any export that includes `reason` values requires DPO review before export

Retention period encoding:
- The retention encoding in the schema design is compatible with automated batch deletion (the `createdAt` field supports a scheduled deletion query by record type and date range)
- No manual-only deletion model is implied by the schema design

DSAR query feasibility:
- A query path exists to find all events where the requestor is the actor: query by `actorId` token
- A query path exists to find all events where the requestor is the subject of actions: query by `targetId` token
- Neither query requires joining to a raw identity table

Erasure compatibility:
- PII columns (`actorId`, `targetId`, `reason`, `sessionId`) are nullable or have an erasure token column in the schema design
- The skeletal record (`eventId`, `action`, `createdAt`, `environment`) is non-nullable and is preserved after in-place suppression
- The erasure procedure does not break audit trail continuity — the event sequence remains visible after suppression

Privacy notice scope:
- The DPO has confirmed in writing that the privacy notice will be updated before Phase (c) begins to describe the production audit persistence system
- The scope of the privacy notice update is documented in the DPO sign-off

Sign-off format:
- DPO sign-off is a dated written document (email or signed form)
- It references this document (`AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md`) and the schema design document by name
- It references `AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md` section 10 as the sign-off requirement it is satisfying

---

3. Legal review criteria

The legal reviewer confirms the schema design is compatible with Thai regulatory requirements for audit record retention and cross-border data transfer restrictions.

Retention period compliance:
- Access/view event records: retention ≥ 3 years from `createdAt` — Thai regulatory minimum for access logging
- Data modification event records: retention ≥ 7 years from `createdAt` — Thai regulatory requirement for record integrity
- The schema design does not imply a retention period shorter than these minimums

Erasure procedure legality:
- In-place suppression (PII fields suppressed, skeletal record preserved) is confirmed as legally compliant for audit record purposes
- Physical row deletion is confirmed as incompatible with the evidentiary requirement for audit trail continuity
- Erasure log entries are themselves retained for 7 years

Export policy:
- The schema design supports an export path that reads only from the official production store
- No prototype/comparison data is included in any export path implied by the schema design
- Bulk export (> 1000 records) requires Admin role verification and a session log entry — the schema supports this access control model

Cross-border restriction:
- The schema design does not require foreign storage, foreign replication, or any data transfer outside Thailand
- Cloud storage for the production event store is confirmed as Thailand-region only
- No schema-level element (e.g., a replication slot, a CDC feed, a foreign key to a foreign table) implies cross-border data transfer

Lawful basis:
- The lawful basis for each event type stored is recorded in the schema design documentation and reviewed by legal for compliance with Thai regulatory requirements
- Legal confirms that the audit record is not being used for a purpose beyond the stated lawful basis

Sign-off format:
- Legal sign-off is a dated written document (email or signed form)
- It explicitly confirms retention period compliance per Thai regulatory requirements
- It references this document and the schema design document by name

---

4. Privacy/PDPA review criteria

The privacy reviewer confirms the schema design does not expose PII through its structure, indexing, or implied query patterns.

No raw PII columns:
- No column is designed to hold raw national ID numbers, passport numbers, foreign national IDs, email addresses, phone numbers, bank account numbers, IP addresses, file paths, or OCR-extracted text
- Every column in the schema design is reviewed against this list
- Any column whose type or name implies a PII value is flagged as a blocking issue

Pseudonymization at schema level:
- `actorId` and `targetId` columns hold hash/token values only — application code cannot store raw values without bypassing the schema type
- No join between the core event table and a raw identity table is present in the schema design

`reason` column:
- Text type; no constraints encourage storing PII
- No full-text index in any environment without DPO approval
- Privacy review notes confirm awareness that `reason` may contain indirect PII

Retention encoding:
- `createdAt` timestamp + scheduled batch deletion policy is sufficient; no additional TTL columns unless DPO-approved
- No retention encoding implies indefinite retention

Erasure-compatible design:
- PII columns are nullable or have an erasure token column
- The erasure procedure can be executed without physical row deletion

No raw identity join:
- No foreign key from the core event table to a table that stores raw user identities (name, email, national ID)
- The token/hash mapping is a separate, access-controlled structure not referenced in the core schema

---

5. Product/Admin owner review criteria

The product/Admin owner confirms the schema design supports Admin-only access and the correct evidence boundary.

Admin-only read access:
- The schema design does not expose a query path that non-Admin roles could use directly (e.g., no public-facing view or endpoint in the schema design)
- Role-based access control is described in the schema design: only Admin role may query the official store

Export path:
- The schema is designed so that `exportAuditCSV` reads from the official store table and not from any comparison or prototype store
- No prototype/comparison data can appear in any query result from the schema

Admin access logging:
- The schema supports recording Admin reads as audit events (the same event store records both Admin actions and is used for Admin review — there is no circular dependency concern as long as the Admin read event type is defined in the enum)

No non-Admin exposure:
- No view, index, or query path in the schema design exposes audit records to non-Admin roles
- The comparison debug panel remains diagnostic only — no comparison data is stored in the official event store

Evidence review boundary:
- The schema design supports the `adminAuditDisplayAdapter` as the only component that reads from the official store for display purposes
- The `AdminAuditComparisonDebugPanel` continues to read from the in-memory comparison metrics — no comparison data is written to the official store

---

6. QA review criteria

The QA reviewer confirms the schema design is complete, internally consistent, and supports the QA gates defined in the plan.

Field completeness:
- All 11 required fields from database model section 2 are present
- Each field has a documented type, constraint, and privacy classification (non-PII, pseudonymized, potentially sensitive free text)
- No required field is missing or typed incorrectly

Forbidden patterns:
- All forbidden patterns from database model section 3 are explicitly marked as excluded in the schema design

Index design:
- All 4 indexes from database model section 4 are present with rationale
- No full-text index on `reason`

Retention periods:
- All retention periods from database model section 5 are represented in the schema design (access events: 3 years; data modification: 7 years; staging: 90 days; erasure log: 7 years)

Erasure procedure compatibility:
- The deletion/erasure procedure from database model section 6 is compatible with the schema design: PII columns are nullable, skeletal record is non-nullable

Migration strategy compatibility:
- Shadow write phase (Phase (c)) does not require schema changes mid-migration
- Dual-read phase (Phase (d)) does not require schema changes mid-migration
- Promotion to authoritative source (Phase (d) step 3) does not require schema changes

Backup/recovery:
- Backup requirements from database model section 8 are reflected in the schema design

QA gate results:
- Build: 40/40 routes, 0 type errors — confirmed at time of Phase (b) completion
- Token check: 4/4 — confirmed
- Audit checks: 139/139 minimum — confirmed
- Routes: 5×200 OK, dev log clean — confirmed
- Diff scope: docs-only — confirmed

---

7. Rollback owner review criteria

The rollback owner confirms the schema design does not create rollback dependencies that violate the emergency rollback time target.

Flag-based rollback:
- Rollback at the shadow-write phase (Phase (c)) can be accomplished by setting `shadowWrites: false` in the staging config — no DDL revert (DROP TABLE, ALTER TABLE, or equivalent) is required
- The core event table's presence in the database does not block rollback — it can be left empty without affecting the Admin display path

No irreversible schema elements:
- The schema does not include a uniqueness constraint that conflicts with data in the existing mock store (which would require schema rollback if shadow write is disabled after writes have been made)
- If any such constraint is proposed, it is flagged as a blocking issue before Phase (c) begins

Emergency rollback compatibility:
- The emergency rollback procedure in AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md section 7 (< 5-minute target) is achievable with the proposed schema
- Setting `shadowWrites: false` and restarting the service is sufficient to restore the Admin display to the mock/shared writer path — no schema migration is needed

Rollback testing:
- The rollback owner confirms they will test rollback in staging before Phase (e) production rollout — and that the schema design does not prevent this test from being representative of a production rollback
