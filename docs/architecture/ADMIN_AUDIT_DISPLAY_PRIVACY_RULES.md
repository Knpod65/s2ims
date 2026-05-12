# Admin Audit Display Privacy Rules

This document defines metadata display rules for Admin audit views. It is planning-only and references AP-2 metadata privacy rules.

## Metadata Display Allowlist

Display only these metadata keys in Admin audit views:

| Key | Purpose | Example Value |
|-----|---------|---------------|
| documentId | Document identifier | "doc_001" |
| applicationId | Application identifier | "app_002" |
| scholarshipId | Scholarship identifier | "sch_001" |
| studentToken | Privacy-safe student display | "Student #S-2345" |
| candidateToken | Privacy-safe candidate display | "Candidate #C-2048" |
| statusBefore | Previous status | "submitted" |
| statusAfter | New status | "shortlisted" |
| decision | Decision outcome | "approved" |
| roleBefore | Previous role | "staff" |
| roleAfter | New role | "admin" |
| permissionKey | Permission key | "export_audit" |
| jobId | OCR/sync job identifier | "ocr_001" |
| integrationName | Integration name | "sis-sync" |
| outcome | Job outcome | "success" |
| format | Export format | "CSV" |
| rowCount | Export row count | 128 |
| fieldAllowlistVersion | Export policy version | "export-policy-2026-05" |

## Metadata Blocked Examples

Never display these keys in Admin audit views:

| Category | Blocked Keys |
|----------|--------------|
| Raw student identity | rawStudentId, studentName, studentEmail, phone, address, nationalId |
| Financial data | bankAccount, gpaRaw, incomeRaw |
| Medical/private | medicalInfo, disabilityInfo |
| Arbitrary dumps | freeTextSensitiveData, customJson |
| Raw payloads | beforeRaw, afterRaw, rawPayload |
| Internal tokens | password, sessionToken, apiToken |

## Role-Specific Display Notes

### Admin Role

- Can view more metadata fields than staff/provider.
- Still restricted to allowlisted keys only.
- Can see student tokens but not raw student identity.
- Should not see full PII unless operationally necessary.

### Provider Role (Admin View Context)

- In Admin audit, provider actions are visible but:
  - Raw student identity must be masked
  - Only candidate tokens shown
  - Reason text visible but sanitized

### Executive/ESQ View

- Should only see aggregate counts/trends by default.
- Individual audit rows should be restricted.
- Policy-level metadata preferred over individual records.

## Target Token Display

| Target Type | Display Format | Example |
|-------------|----------------|---------|
| Student | "Student #S-XXXX" | "Student #S-2345" |
| Candidate | "Candidate #C-XXXX" | "Candidate #C-2048" |
| Document | Document ID only | "doc_007" |
| Application | Application ID only | "app_002" |
| OCR Job | "OCR Job: jobId" | "OCR Job: ocr_001" |

## Target Privacy Level Display

| Privacy Level | Display Behavior |
|---------------|----------------|
| public | Show normally |
| masked | Show token only, no raw values |
| internal | Admin/staff visible only |
| restricted | Admin only, with reason |
| aggregate_only | ESQ/executive: count only, no rows |

## Reason Display Rules

- Reason text is stored in `reason` field, not metadata.
- Display full reason in detail view.
- In table list, show "Reason provided" or "No reason" indicator.
- Reason should not be duplicated into metadata display.
- Long reason text should be truncated with tooltip.

## Export Privacy Rules

- Export must respect role boundaries.
- Provider exports must not include raw student identity.
- Executive exports should be aggregate only.
- Export file must include row-level persistence badges.
- Export header must warn if mock data is included.

## Provider/Executive Restrictions

### Provider

- Provider audit records must never include raw student name, email, or student ID.
- Provider views should use candidate tokens only.
- Provider reasons can be stored but must use token-only targets.

### Executive/ESQ

- Default to aggregate views, not individual rows.
- Individual row access requires authorization.
- Must not receive raw student/candidate identifiers in exports.
- Policy-level context only in summary views.

## Admin Still Uses Allowlist (Not Raw Dump)

Even admins must use allowlisted metadata display:

- No "View raw JSON" button that dumps entire event.
- Metadata table should show key-value pairs, not objects.
- Nested objects should be flattened and allowlisted.
- Free-text metadata should be limited to 200 characters displayed.

## Example Safe Display

```json
{
  "documentId": "d7",
  "applicationId": "app_002",
  "studentToken": "Student #S-2345",
  "statusBefore": "needs_replacement",
  "statusAfter": "rejected"
}
```

## Example Unsafe Display (Forbidden)

```json
{
  "rawStudentId": "650912345",
  "studentEmail": "student@example.edu",
  "incomeRaw": "150000-200000 THB",
  "freeTextSensitiveData": "Entire raw form payload..."
}
```