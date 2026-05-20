# S2IMS Import Preview Controlled Demo Observer & Note-taker Packet — MC67

## Purpose
Provide observer and note-taker instructions and allowed fields for capturing planning feedback during a controlled internal demo walkthrough. This is a planning-only document; do not store notes in the repository if they contain sensitive content.

## Observer role
- Observe demo flow and note any deviations from expected preview-only behavior
- Watch for privacy or governance concerns
- Do not provide approval or sign-off

## Note-taker role
- Capture succinct, non-PII feedback entries using allowed fields
- Mark governance-sensitive items with [GOV]
- Confirm no_approval_confirmed and no_real_data_confirmed for each entry

## What to record
- High-level summary of issue (no PII)
- Demo section where it occurred
- Severity and suggested follow-up
- Governance-sensitive flag

## What not to record
- Raw PII values
- Screenshots containing real PII (if captured, delete locally and notify security)
- Any approval or sign-off statements

## PII exclusion rule
- If any PII is observed, stop the session and follow stop-condition protocol

## No approval wording rule
- Note-takers must not record any text that implies approval; mark procedural suggestions only

## Feedback categories
- UX/copy clarity
- Workflow understanding
- Validation behavior
- Accessibility
- Data/privacy concern
- Governance-sensitive concern
- Training/support
- Out of scope

## Severity levels
- Low
- Medium
- High
- Blocked

## Governance-sensitive flag
- Set governance_sensitive: yes if item may require AP-10B review

## Stop condition escalation
- If Blocked or High severity observed, raise hand and ask facilitator to stop and escalate

## Post-session handoff to MC68
- Keep captured notes local/external and hand over to MC68 compiler only if session actually occurs

## Allowed note fields
- note_id
- reviewer_category
- demo_section
- feedback_theme
- summary_no_pii
- severity
- governance_sensitive
- suggested_follow_up
- no_approval_confirmed
- no_real_data_confirmed
- ap10b_boundary_confirmed
