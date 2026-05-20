# S2IMS Synthetic Workbook Fixture Policy MC60

## Purpose
Define policy for where generated synthetic workbooks may be stored, how they are treated in source control, and the approval process for committing fixtures.

## Why generated files are not committed in MC60
- To avoid accidental commits of sensitive or real data.
- To keep MC60 documentation-only and maintain governance constraints.

## Future fixture storage options
- Artifacts storage (preferred): `artifacts/synthetic-master-data-workbooks/` — gitignored by default; used for ephemeral test artifacts.
- Approved fixtures (rare): `docs/test-fixtures/approved/` — only allowed after explicit governance approval; small, reviewed fixture files only.

## Gitignore recommendation
- Add `artifacts/` to .gitignore to prevent accidental commits of generated workbooks.
- Approved fixtures path if used should contain a README listing approvals, but actual fixture files require separate approval and a signed-off commit.

## When fixtures may be committed
- Only after: security review, governance (AP-10B) owner approval, explicit QA acceptance, and a documented attestation of synthetic-only content.

## Review requirements
- Security lead must confirm no realistic identifiers present.
- QA lead must confirm deterministic generation and manifest integrity.
- Governance owner must approve fixture presence in repo.

## Cleanup rules
- Artifacts older than 30 days should be removed automatically by CI or local cleanup scripts, unless explicitly marked as retained fixtures with approvals.

## No Excel files are created or committed in MC60
- Reiterate: MC60 is planning-only; no generated files or scripts are created in this phase.
