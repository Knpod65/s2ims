# S2IMS Import Preview Controlled Demo Invitation Brief — MC67

## Purpose
Provide a concise invitation brief for participants invited to the controlled internal demo walkthrough of the import preview route. This is a documentation-only artifact for planning and invitations; it does not record attendance or approvals.

## Audience
Internal stakeholders: product owners, QA engineers, technical owners, privacy and governance reviewers, accessibility reviewers.

## Session title
S2IMS — Import Preview Controlled Internal Demo (Synthetic Data Only)

## Suggested invitation wording

"You are invited to a controlled internal walkthrough of the S2IMS import preview route. This session is a controlled internal walkthrough using synthetic data only. It is intended to collect planning feedback, not approval or sign-off. The preview does not import real data, does not persist records, does not write audit events, and does not authorize AP-10B, AP-10C, or AP-11.

Session length: 45–60 minutes.
Please review the pre-session checklist and run the requested validations locally if you are facilitating. Bring questions focused on validation behavior, UX, accessibility, and governance concerns.
"

## What participants will see
- The import preview UI at /admin/master-data/import-preview
- Synthetic workbooks generated locally (artifacts/synthetic-master-data-workbooks/)
- Validation messages and preview-only behavior

## What participants will not see
- Any real production data
- Confirm Import enabled or any persistence
- Audit events or official evidence creation

## Feedback rules
- Provide feedback using the supplied capture worksheet
- Do not include any PII in feedback fields or screenshots
- Mark governance-sensitive items clearly
- Do not treat this session as approval

## Privacy/safety reminder
- All synthetic workbooks use example.test domain for emails
- If any real data appears, the session must stop and security notified

## No-approval/no-signoff reminder
- This walkthrough does not constitute approval or sign-off. Any follow-up requiring approval will follow the governance process.

## AP-10B boundary reminder
- AP-10B remains required for any persistence, production import, or official evidence

## Preparation requested from attendees
- Review the pre-session checklist
- Keep feedback topical and avoid PII
- Observers and note-takers: use the packet and capture template

## Questions attendees may consider before session
- Are validation messages clear for non-technical users?
- Is the mapping workflow understandable?
- Are there any potential privacy exposures in the preview display?
