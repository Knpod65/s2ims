# S2IMS Import Preview Controlled Demo Session Logistics Package — MC67

## 1. Purpose
Define the logistics package for a future controlled internal demo feedback session for the preview-only master data import route. This document prepares materials and logistics only; no session is executed or claimed in MC67.

## 2. Scope
In scope:
- session logistics
- attendee categories
- preparation timeline
- facilitator preparation
- synthetic data preparation
- note-taking setup
- safety reminders
- post-session handoff

Out of scope:
- actual demo execution
- feedback collection
- approval collection
- sign-off collection
- official evidence creation
- real data import
- persistence
- backend/API
- audit writes
- AP-10B/AP-10C/AP-11 activation

## 3. Session Status
- MC67 prepares logistics only.
- The controlled demo session has not occurred in MC67.
- Feedback has not been collected in MC67.
- No approval/sign-off is collected in MC67.

## 4. Demo Route
- Route: /admin/master-data/import-preview

Route status:
- hidden route
- preview-only
- Confirm Import disabled/no-op
- no persistence
- no audit write

## 5. Recommended Attendee Categories
- admin_review_group
- scholarship_staff_group
- technical_owner_group
- privacy_review_group
- governance_review_group
- accessibility_review_group
- observer_note_taker_group

Do not list real attendees in this document; attendance is not approval.

## 6. Session Format
- Duration: 45–60 minutes
- Facilitator-led walkthrough
- Synthetic data only (MC61-generated)
- Feedback captured as planning input only
- No approval or sign-off collected

## 7. Preparation Timeline
- T-3 days: confirm facilitator and observer roles; reserve host environment
- T-2 days: regenerate synthetic workbooks locally if needed; pre-screen workbooks
- T-1 day: run validations: npm run build; npm run check:tokens; npm run check:audit-events
- T-1 day: verify route present and Confirm Import disabled
- T-day morning: run pre-session checklist and safety brief
- Post-session: prepare MC68 execution report only if session actually occurs and user approves report creation

## 8. Required Pre-Session Validation
- npm run build (expect 42/42)
- npm run check:tokens (expect 4/4)
- npm run check:audit-events (expect 502/502)
- Route smoke: confirm /admin/master-data/import-preview reachable and preview-only
- Generated workbooks present locally in artifacts/ and not staged for commit
- Confirm Import remains disabled

## 9. Final Logistics Decision
- Status: ready to schedule controlled internal demo session (docs-only)
- Not ready for production import or persistence
- Not ready for AP-10B/AP-10C/AP-11 without governance approval

## Safety copy (exact)
"This walkthrough uses synthetic data only. It is for feedback, not approval. It does not authorize real data import, persistence, audit writes, official evidence, AP-10B, AP-10C, or AP-11."
