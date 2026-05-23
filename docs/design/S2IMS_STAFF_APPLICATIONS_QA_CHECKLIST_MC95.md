# S2IMS Staff Applications QA Checklist MC95

**Date**: 2026-05-21  
**Route**: `/staff/applications`

## Work Queue Scanability

- [x] Page header identifies the page as Staff Work Queue.
- [x] Mock decision-support banner is visible.
- [x] Summary cards show visible items, needs attention, document issues, and documents clear.
- [x] Filter group has a SectionHeader.
- [x] Application queue has a SectionHeader.
- [x] No-results state explains filters can be adjusted.

## Status And Document Completeness

- [x] Application status labels remain unchanged.
- [x] Document chips include icon and text.
- [x] Rejected document count is readable.
- [x] Pending document count is readable.
- [x] Verified/total count is readable.
- [x] Status and document meaning does not rely on color alone.

## PDPA / PII

- [x] No new student name shown.
- [x] No email/contact field shown.
- [x] Existing student identifier display preserved.
- [x] No new profile or document detail shown on list.

## Decision Boundary

- [x] No approve action added.
- [x] No reject action added.
- [x] No status mutation added to list page.
- [x] AP-11 boundary copy visible.
- [x] No official decision language added.

## Route Smoke

- [x] `/staff/applications`
- [x] `/staff/applications/app_001`
- [x] `/staff/applications/app_002`
- [x] `/login`
- [x] `/admin/audit-log`
- [x] `/admin/master-data/import-preview`
- [x] Related MC91-MC94 regression routes included.

## Validation

- [x] `npm run build`
- [x] `npm run check:tokens`
- [x] `npm run check:audit-events`
