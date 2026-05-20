# S2IMS Import Preview Controlled Demo Safety & Stop Checklist — MC67

## Purpose
Define safety checks and stop-condition protocols for controlled internal demo walkthroughs of the import preview route.

## Before-session safety checks
- Confirm latest main validated locally: npm run build; npm run check:tokens; npm run check:audit-events
- Confirm artifacts/ contains only synthetic workbooks and is gitignored
- Confirm facilitator and observer roles assigned
- Confirm safety copy prepared and visible to attendees
- Confirm external evidence store available for screenshots

## During-session stop triggers
- Real data appears in UI
- Generated file contains real-looking PII
- Participant requests enabling Confirm Import or enabling persistence
- Participant treats feedback as sign-off or approval
- Route exposes unexpected persistence or audit behavior
- Screenshot contains real PII
- AP-10B/AP-10C/AP-11 authorization implied

## After-session containment checks
- Ensure no generated workbook was accidentally committed
- Ensure screenshots with sensitive content are deleted and security notified
- Ensure captured notes are sanitized (no PII) before storage

## Privacy stop conditions
- Any raw student or staff identifiers observed
- Any email not using example.test domain
- Any screenshot containing PII

## Governance stop conditions
- Participant requests to enable Confirm Import
- Participant treats demo as approval or sign-off
- Participant requests to begin AP-10B process from demo output

## Technical stop conditions
- Unexpected writes to backend/API observed
- Audit logs show write events related to preview route
- UI exposes file downloads with real data

## AP-10B confusion stop conditions
- Participant requests evidence pack or sign-off based on demo
- Participant asks to commit generated fixtures

## Required response protocol
1. Immediately stop demo and announce pause
2. Document the trigger and affected artifacts locally
3. Clear any local artifacts that contain real data (if any)
4. Notify security and product owners via agreed channel
5. Do not commit any files; escalate to governance_review_group for next steps
