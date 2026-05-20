# S2IMS Import Preview Controlled Demo MC68 Readiness Checklist — MC67

## Purpose
Define the readiness checklist and required evidence for starting MC68: Controlled Internal Demo Feedback Execution Report. MC68 may only be started after an actual controlled demo session occurs and only when the session owner explicitly authorises creation of the MC68 execution report.

## Before MC68 can start
- An actual controlled internal demo session must have taken place (not in MC67)
- Session owner explicitly authorises creation of MC68 execution report
- Captured feedback worksheets and note-taker packets handed to MC68 compiler (sanitised)
- Evidence manifest produced (external store references to screenshots and artifacts)

## Required session evidence for MC68
- Facilitator script used (versioned reference)
- List of synthetic workbooks used (filenames only; not committed)
- Sanitised feedback worksheet entries (no PII)
- Issue register created from prioritized items
- Validation run logs (build/tokens/audit) indicating system state during session

## Required safety confirmations
- No generated workbook was committed to repo
- No screenshots with PII retained in repo
- No audit writes observed
- No persistence observed

## Required no-approval confirmations
- All attendees confirmed no_approval_confirmed on their feedback entries
- No approval or sign-off language present in captured notes

## Required feedback packet
- Collated feedback worksheet (sanitised)
- Prioritised issue list with owners and estimated timelines
- Governance-sensitive items flagged and routed

## Required validation evidence
- npm run build output (logs)
- npm run check:tokens output
- npm run check:audit-events output
- Route smoke status snapshots (7×200 OK)

## What cannot be included in MC68
- Any raw PII values
- Committed synthetic workbooks
- Any evidence implying approval or sign-off
- Any AP-10B/AP-10C/AP-11 approvals initiated by the demo

## Stop conditions for MC68
- If evidence shows any PII exposure, abort report creation and notify security
- If evidence shows commit of generated files, abort and revert commits

## Important
MC68 is explicitly an execution report for an actual session. MC67 only prepares materials and does not create MC68 artifacts or claim the session took place.
