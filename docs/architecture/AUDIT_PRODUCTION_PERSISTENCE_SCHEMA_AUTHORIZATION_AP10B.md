Audit Production Persistence Schema Design Authorization AP-10B

1. Overview

AP-10 Phase (b) establishes the formal authorization framework that governs schema design. Phase (b) does not produce a working schema — it produces a reviewed and approved schema design, with all 7 sign-offs attached, that Phase (c) implementation can use as its authoritative specification.

This document defines what must be approved before schema design begins (section 5), what each of the 7 owners must specifically review (section 6), what evidence must be produced by Phase (b) before Phase (c) can begin (section 7), what the schema design document must contain (section 8), the blocking conditions that prevent Phase (c) from starting (section 9), and the QA gates that confirm Phase (b) is complete (section 10).

No SQL is written in this phase. No migration files are created. No implementation begins.

2. Why Phase (b) exists

The 7-owner approval gate in AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md section 11 established who must approve production persistence and the broad scope of each approval. That gate was written for the full production activation. Phase (b) translates that broad gate into phase-specific, schema-specific review criteria so that:

- Each owner reviews against defined criteria, not ad-hoc judgment
- The threshold for "schema approved" is defined and auditable
- Phase (c) implementation cannot begin prematurely — the Phase (b) → Phase (c) gate (section 9) is a defined blocking condition, not a verbal agreement
- Any disagreement during schema review is resolved before code is written, not after

Without this authorization framework, a schema design could be produced, sent for review, and receive informal approval that does not satisfy the formal requirements of the production evidence standard. This document makes the requirements explicit.

3. Phase (b) scope

Permitted outputs from Phase (b):
- Reviewed schema design document: conceptual field list with types, constraints, and privacy classification — no SQL, no DDL
- Completed authorization checklists with owner sign-offs
- Evidence pack index (a document listing all evidence with owner, date, and reference)
- QA gate confirmation (build/tokens/audit/routes results at time of Phase (b) completion)

Not permitted in Phase (b):
- SQL DDL (CREATE TABLE, ALTER TABLE, or equivalent)
- ORM model files (TypeORM entity classes, Prisma schema, Drizzle schema, or equivalent)
- Migration files of any kind
- Any `src/*` changes
- Any persistence activation or feature flag changes
- Any Admin UI changes
- Any export behavior changes

4. Explicit non-goals

- No SQL DDL in this phase
- No ORM schema files
- No migration files
- No `src/*`, `scripts/*`, or `package.json` changes
- No DB engine selection finalized — that is a Phase (b) design decision to be documented in the schema design document, not mandated here
- No persistence activation
- No AP-9G or AP-10 flag changes
- No Admin UI changes
- No new routes or navigation changes
- No mock fixture mutations
- No Staff callback, reason validation, or notification changes
- No PII exposure
- AP-10 runtime not started

5. Authorization conditions to enter Phase (b)

All of the following must be true before any schema design work begins:

- Phase (a) post-merge QA passed and committed on main (`d24742a` or later)
- All 7 written approvals from AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md section 11 have been obtained — each approval must be dated, signed by name, and reference this document (`AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md`) by name
- DPO written sign-off per AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 10 — specifically confirming: data minimization confirmed for all proposed fields, lawful basis per event type documented, retention schedule defined, erasure procedure confirmed (in-place suppression), breach notification procedure in place, privacy notice update scope confirmed
- Legal written confirmation: retention periods comply with Thai regulatory requirements (3 years for access events, 7 years for data modification events); cross-border transfer restriction confirmed; export policy reviewed and approved
- A named DPO reviewer and a named legal reviewer have been identified and their sign-off format (email, signed document, or equivalent) has been agreed in writing before schema design begins
- No Phase (b) schema design document is created until all conditions above are met

6. 7-owner authorization scope for Phase (b)

This section defines each owner's specific review scope for the schema design phase. These are schema-specific criteria, distinct from the phase (a) planning approvals. Each owner reviews the schema design document against these criteria before signing off.

Engineering approval scope:

- All 11 required fields from AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 2 are present in the schema design
- Field types are appropriate: UUID for `eventId` and `sessionId`, enum for `actorRole`, `targetType`, `action`, `environment`, string for `actorId`, `targetId`, `reason`, `checksumHash`, UTC timestamp for `createdAt`, SHA-256 hex string for `checksumHash`
- Immutability constraints are documented: `eventId`, `actorId`, `actorRole`, `targetId`, `targetType`, `action`, `createdAt`, `environment` are marked as immutable after write
- All forbidden patterns from database model section 3 are explicitly absent from the schema design
- Index design per database model section 4 is present: actor-time (`actorId`, `createdAt`), target-time (`targetId`, `createdAt`), action-time (`action`, `createdAt`), environment-time (`environment`, `createdAt`)
- Migration phase compatibility: the schema supports shadow write (new writes to production store) without requiring changes to `adminAuditDisplayAdapter` in Phase (c)
- `checksumHash` computation specification is deterministic: field concatenation order is documented, encoding is specified, verification procedure is documented
- Backup/recovery requirements per database model section 8 are reflected in the schema design (e.g., no data stored outside the recoverable store)
- No non-append operations (UPDATE, REPLACE, UPSERT) are implied by the schema design for the core event table

Privacy/PDPA approval scope:

- No raw PII columns: no columns designed to hold national ID, email, phone, bank account, IP address, file path, or OCR text values
- `actorId` and `targetId` are pseudonymized at the schema level: columns hold hash/token values only; the schema does not include a join to a raw identity table
- `reason` column: text type; constraints and notes confirm that raw PII must not be stored; no full-text index on `reason` in the schema design
- Retention period encoding: `createdAt` + batch deletion policy is present; no additional TTL columns unless DPO-approved
- Erasure-compatible column design: PII columns (`actorId`, `targetId`, `reason`, `sessionId`) are nullable or have an erasure token column; the skeletal record (`eventId`, `action`, `createdAt`, `environment`) is non-nullable and preserved on erasure
- No forbidden storage patterns from database model section 3 are present in the schema

DPO approval scope (written sign-off required):

- Data minimization: each field in the schema has a documented necessity justification; no field is included without a stated audit purpose
- Lawful basis per event type: the schema design document explicitly states the lawful basis (legal obligation or legitimate interest) for each event type stored
- `actorId` and `targetId` pseudonymization: raw identity columns are absent from the schema; the mapping table (token → real identity) is held separately and its access control is described
- `reason` column: type and constraint confirm that raw national IDs, emails, phones are not stored; no full-text index on `reason`
- Retention period encoding is compatible with automated deletion (no manual-only deletion model)
- DSAR query path is feasible: a query using `actorId` token finds all events where the requestor is the actor; a query using `targetId` token finds all events where the requestor is the subject
- Erasure procedure does not break audit trail continuity: the skeletal record is preserved after in-place suppression
- Privacy notice update scope is confirmed in writing before Phase (c) begins
- DPO sign-off is a dated written document (email or signed form) referencing this document and the schema design document by name

Legal approval scope:

- Retention periods match Thai regulatory requirements per record type: access/view events (3 years minimum), data modification events (7 years minimum)
- Erasure procedure is legally compliant: in-place suppression preserves the evidentiary skeletal record; physical row deletion is not used
- Export policy is schema-compatible: only official store records may be exported; no prototype/comparison data can appear in any export
- Cross-border restriction: the schema design does not require foreign storage or foreign replication; cloud storage is Thailand-region only
- Lawful basis for each event type is recorded in the schema design documentation
- Legal sign-off is a dated written document referencing this document and the schema design document by name

Product/Admin owner approval scope:

- Admin-only read access: the schema design does not expose a query path that non-Admin roles could use directly
- No public-facing tables or views in the schema design
- Export path: the schema is designed so that `exportAuditCSV` reads from the official store table only — no comparison or prototype store in the export path
- Admin access itself is logged: the schema supports recording Admin reads as audit events
- No non-Admin exposure in any view or index design

QA approval scope:

- All 11 required fields from database model section 2 are present in the schema design, each with documented type, constraint, and privacy classification
- All forbidden patterns from database model section 3 are explicitly marked as excluded
- All indexes from database model section 4 are defined with rationale
- All retention periods from database model section 5 are encoded in the schema design
- The deletion/erasure procedure from database model section 6 is schema-compatible (PII columns nullable)
- The migration strategy from database model section 7 is schema-compatible: shadow write and dual-read phases do not require schema changes mid-migration
- Backup/recovery requirements from database model section 8 are schema-compatible

Rollback owner approval scope:

- Schema design supports rollback at the shadow-write phase by disabling a feature flag — no schema rollback (DDL revert) is required to restore the pre-Phase (c) state
- No irreversible schema element (e.g., a uniqueness constraint that conflicts with mock data) that would require a DDL revert during rollback
- The Phase (d) rollback procedure in AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md is compatible with the schema design
- Emergency rollback (< 5 minutes) remains achievable with the proposed schema

7. Evidence requirements for Phase (b) completion

All of the following evidence must be assembled before Phase (c) can begin:

- Schema design document: reviewed conceptual field list with types, constraints, privacy classification, index design, retention encoding, erasure design, migration compatibility, and `checksumHash` specification — no SQL
- Completed authorization checklist from this document (section 9), dated and signed by the QA owner
- Written sign-off from all 7 owners: each sign-off is dated, signed by name, references this document and the schema design document by name
- DPO written sign-off confirming all 10 items in AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 10
- Legal written confirmation of: retention period compliance per Thai regulatory requirements; cross-border restriction confirmed; export policy approved
- Privacy/PDPA review notes: written in aggregate-only language; no PII values in any review document
- Engineering review notes: confirming field completeness, type correctness, index design soundness, migration compatibility
- QA gate results: build 40/40, tokens 4/4, audit 139/139, routes 5×200 OK, dev log clean — confirmed at time of Phase (b) completion (must be ≤ 7 days before Phase (c) branch opens)
- Evidence pack index: a single document listing each piece of evidence with its owner, date, and document reference

8. Schema design output requirements

The Phase (b) schema design document must contain all of the following. This is a completeness checklist for the schema design — not a schema specification. The actual design decisions are made during Phase (b) by the engineering and DPO reviewers.

Required content of the schema design document:

- All 11 required fields from database model section 2, each with: data type category, immutability constraint (yes/no), privacy classification (non-PII, pseudonymized, potentially sensitive free text)
- Each forbidden pattern from database model section 3 explicitly marked as excluded, with a note confirming the exclusion in the schema design
- Index design per database model section 4: actor-time, target-time, action-time, environment-time — with rationale for each; and the explicit exclusion of a full-text index on `reason`
- Retention period encoding: how retention periods from section 5 are represented (e.g., `createdAt` + scheduled batch deletion, or an additional retention policy field) — TTL columns require DPO approval before inclusion
- Erasure-compatible column design: which columns are nullable for in-place suppression; which hold erasure tokens after suppression; how the skeletal record (`eventId`, `action`, `createdAt`, `environment`) is preserved
- Migration phase compatibility: confirmation that the schema supports shadow write in Phase (c) without requiring changes to `adminAuditDisplayAdapter` or `sharedMockWriter`
- `checksumHash` computation specification: field concatenation order (all 11 fields in a defined order), encoding (UTF-8), hash algorithm (SHA-256), verification procedure at read time, and behavior on erasure (checksumHash recomputed over suppressed record)

9. Phase (b) → Phase (c) decision gate

Phase (c) cannot begin if any of the following blocking conditions is true:

- Any item in the evidence list (section 7) is missing, undated, or unsigned
- DPO sign-off does not reference the schema design document by name
- Legal sign-off does not explicitly confirm retention period compliance per Thai regulatory requirements
- Fewer than all 7 owners have signed off on the schema design
- Any forbidden storage pattern from database model section 3 is present in the schema design
- The schema design does not include all 11 required fields from database model section 2
- QA gate results are not current — results must be from within 7 days of the Phase (c) branch opening date
- The schema design document has not been reviewed jointly by DPO and engineering (joint review means both have reviewed the same version and signed off on the same version)
- Rollback owner has not confirmed that the rollback plan in AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md is compatible with the proposed schema design

All 9 conditions must be false before Phase (c) begins. No partial gate pass is accepted.

10. Phase (b) QA gates

The following checks must pass at the time of Phase (b) completion (before Phase (b) artifacts are merged to main):

- Build: `npm run build` passes 40/40 routes, 0 type errors
- Token check: `npm run check:tokens` passes 4/4
- Audit checks: `npm run check:audit-events` passes 139/139 — this is a documentation-only phase; the count must not decrease
- Routes: 5 smoke routes return 200 OK — `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`
- Dev log: no errors, warnings, or hydration issues
- Diff scope: `git diff --name-only origin/main...HEAD | grep -v "^docs/"` returns empty — no non-docs files changed

Appendix: Related documents

- Phase (a) plan: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md (section 11: 7-owner gate; section 13: roadmap)
- Database model: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md
- Privacy/PDPA model: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md (section 10: DPO sign-off requirement)
- Rollout/rollback: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md (section 2: phase entry criteria; section 7: emergency rollback)
- Schema review criteria: docs/architecture/AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md
