# Audit Admin Comparison Panel Privacy Boundary AP-9G

## 1. Purpose

This document defines the privacy boundary for the future AP-9G Admin debug comparison panel. It specifies what data may and may not be displayed in the panel, what logging is permitted, and what copy/tooltip constraints apply.

This is a planning document. No panel exists yet.

## 2. Forbidden UI Data

The following data must never appear in the comparison panel UI, tooltips, copy text, exported data, log output, or developer console output:

| Field | Reason |
|-------|--------|
| `actorId` | PII — uniquely identifies internal user |
| `targetId` | PII — uniquely identifies student/applicant |
| Raw student ID | PII — links to real person |
| National ID (บัตรประชาชน) | Sensitive government ID |
| Email address | PII |
| Phone number | PII |
| Bank account number | Financial PII |
| Raw IP address | Network identity PII |
| File name | May contain PII (e.g. student name in filename) |
| File path | May contain PII |
| OCR text | May contain PII extracted from documents |
| Full reason text | Contains Staff-recorded narrative with potential PII |
| Metadata values | May contain any of the above |
| Raw route params | May contain student IDs or applicant IDs |
| Uploaded document identifiers | Links to PII documents |
| Unmasked names | Any name not already approved for Admin Audit Log |
| `sourceEventId` | Internal event UUID — not for user display |
| `prototypeEventId` | Internal event UUID — not for user display |

## 3. Allowed UI Data

The following data is safe to display in the comparison panel:

| Field | Source | Notes |
|-------|--------|-------|
| `status` | `AuditReadComparisonResult.status` | Aggregate status enum only |
| `sourceCount` | `AuditReadComparisonResult.sourceCount` | Integer count, no event details |
| `prototypeCount` | `AuditReadComparisonResult.prototypeCount` | Integer count |
| `mismatchCount` | `AuditReadComparisonResult.mismatchCount` | Integer count |
| `createdAt` | `AuditReadComparisonResult.createdAt` | ISO timestamp |
| `safeMessage` | `AuditReadComparisonResult.safeMessage` | Pre-formatted safe string |
| Mismatch `category` | `AuditReadComparisonMismatch.category` | Enum value only |
| Mismatch `dimension` | `AuditReadComparisonMismatch.dimension` | Enum value only |
| Mismatch `safeMessage` | `AuditReadComparisonMismatch.safeMessage` | Pre-formatted safe string |
| `sourceSafeToken` | `AuditReadComparisonMismatch.sourceSafeToken` | Only if in masked format (e.g. `Student #S-2345`) |
| `prototypeSafeToken` | `AuditReadComparisonMismatch.prototypeSafeToken` | Only if in masked format |
| Feature flag state | Config | Developer reference: enabled/disabled labels |
| Guard gate result | Guard output | Which gate blocked the run |
| Aggregate health indicator | Derived | Green/amber/red from status |

## 4. Safe Aggregate Metrics

The following aggregate metrics are safe for the panel summary section:

- Total comparison runs (count)
- Count by status: disabled / skipped / matched / mismatched / failed
- Mismatch count by category (aggregate across runs)
- Mismatch count by dimension (aggregate across runs)
- Source event count range (min/max/last)
- Prototype event count range (min/max/last)
- Last run timestamp
- Run duration (if tracked)

These are aggregate-only. No per-event or per-user data is included.

## 5. Mismatch Display Rules

When displaying individual mismatch records:
- Show: `category`, `dimension`, `safeMessage`
- Show: `sourceSafeToken` and `prototypeSafeToken` only if both are in `Student #S-XXXX` or equivalent already-masked format
- Never show: `sourceEventId`, `prototypeEventId`
- Never show: any field not explicitly listed in Section 3 above
- Mismatch table must be collapsible — hidden when count is 0
- Mismatch table must not be included in any CSV/print export

## 6. Logging Restrictions

Log output from the comparison panel must follow AP-9E logging rules:

Safe log format:
```
[AUDIT COMPARISON] status=mismatched sourceCount=15 prototypeCount=14 mismatchCount=2
[AUDIT COMPARISON] category=missing_in_prototype dimension=event_ids count=1
```

Never log:
- actorId, targetId, reason text, metadata values
- Student ID, national ID, email, phone, bank account, IP
- File names, OCR text, raw route params
- Any field not in the allowed list above

## 7. Export Restrictions

The comparison panel data must not be included in:
- CSV export of the Admin Audit Log
- Any PDF or print export
- Any clipboard copy that includes row-level audit data
- Any API endpoint (current or future) that serves audit data

If a separate debug export is ever added, it must be guarded by the Admin role check and the `adminDebugPanelEnabled` flag, and must contain only aggregate-level data.

## 8. Tooltip and Copy Restrictions

Tooltips in the comparison panel must not reveal:
- Raw event identifiers
- User identifiers
- Reason text
- Metadata values

Copy text (both Thai and English) in the comparison panel must use only:
- Status labels: matched / mismatched / failed / disabled / skipped
- Category labels: translated from enum values
- Dimension labels: translated from enum values
- Count labels: numeric only
- Timestamp labels: formatted date/time without user-identifying context

Example safe Thai copy:
- สถานะ: ตรงกัน / ไม่ตรงกัน / ล้มเหลว
- ประเภทความไม่ตรงกัน: ไม่พบใน prototype
- จำนวน: 3 รายการ

## 9. Thai/English Copy Safety

All display labels for mismatch categories and dimensions must be pre-translated from enum values. The translation mapping must be reviewed for PII before use. Raw enum values (e.g. `missing_in_prototype`) may appear as fallback in developer mode only.

Forbidden in copy:
- Student name
- Staff name
- Reason text
- Case/application number that links to a real person

## 10. QA Checklist

- [ ] No actorId, targetId, or user identifier in panel UI
- [ ] No email, phone, bank account, national ID in panel UI
- [ ] No file name, file path, OCR text in panel UI
- [ ] No reason text in panel UI
- [ ] No metadata values in panel UI
- [ ] No raw route params in panel UI
- [ ] `sourceSafeToken` and `prototypeSafeToken` verified as masked before display
- [ ] `safeMessage` is the only free-text field shown
- [ ] Aggregate metrics only in summary section
- [ ] Mismatch table is collapsible and hidden at count 0
- [ ] Mismatch table excluded from CSV/print export
- [ ] Log output reviewed and contains only safe fields
- [ ] Thai copy reviewed for PII
- [ ] English copy reviewed for PII
- [ ] Tooltip text reviewed for PII
