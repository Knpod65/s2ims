# Audit Metadata Privacy Rules

This document defines proposed metadata privacy rules for future S2IMS audit persistence. It is planning-only and does not change runtime behavior.

## Metadata Allowlist by Actor Role

| Actor role | Allowed metadata | Notes |
|---|---|---|
| provider | Provider ID, provider organization, scholarship ID, candidate token, shortlist request ID, reason text, timestamp, source route | Must not include raw student name, raw student ID, email, phone, household, or document data. |
| staff | Staff ID, staff display name, role, application ID, student token, document ID, status transition, reason, source route | Prefer student token over raw student identity unless approved by route policy. |
| admin | Admin ID, display name, affected user ID, role/scope before/after, export type, field allowlist version, reason | Admin can see stronger identifiers, but metadata must still be allowlisted. |
| esq | Aggregate policy context, report ID, export type, aggregate filters, no individual target IDs by default | ESQ audit views should remain aggregate/policy-level unless approved. |
| system | Job ID, integration name, outcome, error category, retry count, status code class | Avoid dumping raw error payloads that may contain tokens or PII. |

## Metadata Allowlist by Target Type

| Target type | Allowed metadata | Forbidden metadata |
|---|---|---|
| document | Document ID, document label, status before/after, file name if already visible to authorized staff, uploaded timestamp | File contents, extracted OCR raw text, storage URL, sensitive document fields |
| application | Application ID, application status before/after, scholarship ID/title, student token | Raw student name/email/phone unless admin-only and explicitly required |
| candidate | Candidate token, scholarship ID, provider ID, shortlist request ID | Raw student ID, student name, email, phone, identity documents |
| disclosure request | Request ID, provider ID/name, candidate token, fields requested, decision | Full student identity before approval, unnecessary field values |
| role assignment | User ID, role before/after, permission keys, reason | Passwords, session tokens, unrelated profile fields |
| export job | Export type, format, row count, field allowlist version, requester role | Full exported rows inside audit metadata |
| OCR job | Job ID, document ID, confidence band, outcome | Full OCR text or document image |
| sync job | Integration name, status, retry count, error category | Credentials, access tokens, raw API response with PII |

## Forbidden Fields

Never store these in generic audit metadata unless a future legal/admin-specific exception is explicitly approved:

- Passwords, secrets, session tokens, API keys.
- Raw uploaded document contents.
- Raw OCR text containing identity or financial details.
- Provider-visible raw student name, email, phone, or student ID.
- Executive/ESQ-visible individual student or candidate identifiers.
- Full export payloads.
- Browser localStorage contents.
- Unfiltered form payloads.
- Unredacted stack traces or integration responses.

## Provider Privacy Constraints

Provider audit records must remain token-only for student/candidate references. Use `Candidate #C-XXXX` or a provider-owned shortlist request ID. Do not include raw student IDs, student names, emails, or internal application IDs in provider-facing audit displays.

Provider reasons can be stored, but they must not be joined with raw student identity in provider views. Staff/admin audit viewers may map the request to internal records if policy allows.

## Staff Internal Constraints

Staff audit records may use `Student #S-XXXX`, application ID, document ID, and operational status transitions. Staff views should still avoid unnecessary raw PII. Identity reveal actions require stronger reason and audit treatment than ordinary document actions.

Student-facing recovery wording must not be reused in staff audit metadata. Staff records should preserve operational wording such as rejected, replacement requested, verified.

## Admin and Export Constraints

Admin audit surfaces can include stronger identifiers and before/after fields, but only through allowlisted metadata. Export actions should record export type, format, row count, allowlist version, and requester. The audit event should not embed the full exported dataset.

Admin audit CSV export should itself become an auditable event once persistence exists.

## Executive/ESQ Aggregate Constraints

Executive/ESQ audit surfaces should default to aggregate and policy-level metadata:

- Count of audit events by domain.
- Trend by week/month.
- Export volume by category.
- Policy exception count.
- No raw student, provider, or candidate identity rows by default.

Any individual-level executive audit view requires separate approval and privacy review.

## Safe Metadata Examples

Staff document rejection:

```json
{
  "documentId": "d7",
  "documentLabel": "Guardian Income Proof",
  "applicationId": "app_002",
  "studentToken": "Student #S-2345",
  "statusBefore": "needs_replacement",
  "statusAfter": "rejected",
  "sourceRoute": "/staff/applications/app_002"
}
```

Provider shortlist request:

```json
{
  "providerId": "provider_001",
  "scholarshipId": "sch_001",
  "selectedCandidateTokens": ["Candidate #C-2048"],
  "requestId": "shortlist_req_001"
}
```

Admin export:

```json
{
  "exportType": "audit",
  "format": "CSV",
  "rowCount": 128,
  "fieldAllowlistVersion": "export-policy-2026-05"
}
```

## Unsafe Metadata Examples

Unsafe provider shortlist metadata:

```json
{
  "studentName": "Raw Student Name",
  "studentEmail": "student@example.edu",
  "studentId": "650912345",
  "candidateToken": "Candidate #C-2048"
}
```

Unsafe audit export metadata:

```json
{
  "rows": [
    {
      "actor_name": "Full Name",
      "ip": "10.0.1.2",
      "reason": "Full sensitive reason text for every exported row"
    }
  ]
}
```

Unsafe OCR metadata:

```json
{
  "rawOcrText": "Full extracted document text with address, ID number, and household details"
}
```
