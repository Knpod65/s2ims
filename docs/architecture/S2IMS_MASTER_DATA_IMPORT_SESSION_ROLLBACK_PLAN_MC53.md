# S²IMS Master Data Import Session and Rollback Plan MC53

## Purpose

This document defines the future import session and rollback plan for the S²IMS master data import preview workflow. MC53 is documentation-only and does not create database schema, migrations, SQL, API endpoints, persistence, audit writes, runtime import, upload UI, or real data import.

## Future Import Session Record

A future import session should record:
- `import_session_id`
- Source file name
- Source type
- Row counts
- Validation summary
- `imported_by`
- `imported_at`
- Import status
- `rollback_available`
- `rollback_reason`
- No official evidence flag

Planning notes:
- Source file name should be metadata only and must not imply raw file retention.
- Retention policy must be approved before storing source files or parsed raw rows.
- Validation summary should use the MC53 validation summary model.
- The no official evidence flag must remain explicit for this flow.

## Session States

Future session states:
- `preview_created`
- `validation_failed`
- `ready_to_confirm`
- `import_confirmed`
- `import_completed`
- `import_rolled_back`
- `import_cancelled`

State rules:
- `preview_created` exists before persistence is allowed and should remain preview-only.
- `validation_failed` blocks confirmation.
- `ready_to_confirm` requires no blocking errors and resolved or explicitly deferred mapping.
- `import_confirmed` requires admin acknowledgements that the import does not open AP-10B, does not create official evidence, and is master-data seed only.
- `import_completed` applies only to a future approved runtime.
- `import_rolled_back` applies only to changes made by the same import session.
- `import_cancelled` must not persist imported rows.

## Rollback Scope

Future rollback scope:
- Records created by the import session.
- Records updated by the import session, if previous values are retained under an approved retention policy.
- Account_Profile draft changes created by the session.
- Responsible_Person_Assignment draft or active changes created by the session.

Rollback must not affect:
- Records created outside the import session.
- Manual admin edits made after import completion unless a future conflict policy allows it.
- Official evidence records.
- AP-10B gate state.
- AP-10C or AP-11 state.

## Rollback Restrictions

Rollback restrictions:
- Rollback requires an import session ID.
- Rollback requires authorization.
- Rollback requires a reason.
- Rollback must show affected row counts before execution.
- Rollback must not delete unrelated master data.
- Rollback must not claim to erase official evidence because this flow must not create official evidence.
- Rollback cannot be implemented until persistence and audit policy are approved.

## Import Session Audit Requirements

Future audit requirements:
- Import confirmation should be auditable only after audit write policy is approved.
- Rollback should be auditable only after audit write policy is approved.
- Audit metadata must avoid raw student PII, source file contents, private remarks, and personal contact details.
- Audit events must distinguish preview, confirm, import completion, rollback, and cancellation.
- MC53 does not activate audit writes.

## No Official Evidence Rule

The master data import preview flow must include an explicit no official evidence rule:
- Preview does not create official evidence.
- Confirmation does not open AP-10B.
- Import session metadata does not satisfy AP-10B approval requirements.
- QA output from this flow is operational QA only unless a separate governance milestone classifies it otherwise.

## Retention Questions

Questions for a future approved runtime:
- Should raw source files be retained, and for how long?
- Should parsed raw row values be retained after import?
- What fields must be redacted before retention?
- Who can view previous import sessions?
- Who can perform rollback?
- How long should rollback remain available?
- How should conflicting post-import manual edits affect rollback?
- What retention rule applies to excluded rows and unresolved mappings?

These questions must be resolved before persistence, audit writes, or production import activation.

## AP-10B Blocked-Gate Reminder

AP-10B remains blocked after MC53:
- MC53 does not name or approve AP-10B owners.
- MC53 does not collect AP-10B approvals.
- MC53 does not resolve AP-10B blockers.
- MC53 does not create official evidence.
- MC53 does not start AP-10C.
- MC53 does not start AP-11.

Future implementation must keep this blocked-gate reminder visible anywhere import confirmation, import session history, rollback, or responsible-person assignment could be confused with governance approval.
