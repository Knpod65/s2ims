# Audit Read Comparison Privacy And Logging AP-9E

## Overview

This document defines privacy and logging boundaries for future audit read comparison work.

AP-9E is documentation-only. No logging runtime is implemented here.

## Forbidden Log Fields

Future mismatch logs must not include:

- actorId
- targetId
- actor display name
- reason text
- metadata values
- raw route params
- raw student ID
- national ID
- email
- phone
- address
- bank account
- raw IP
- file names
- OCR text
- uploaded file metadata
- arbitrary URLs
- free-text sensitive data

## Safe Aggregate Metrics

Allowed aggregate metrics:

- compared event count
- mismatch count
- mismatch count by category
- event type distribution
- actor role distribution
- persistence mode distribution
- safe metadata key mismatch count
- presenter mismatch count
- copy-stage mismatch count
- comparison run status

## Developer-Safe Mismatch Logs

Developer-safe logs may include only:

- mismatch category
- event type
- actor role
- safe target display token
- persistence mode
- timestamp order bucket
- safe metadata key names
- aggregate counts

Example safe shape:

```text
[AUDIT COMPARISON] category=missing_in_prototype eventType=staff.document.reject actorRole=staff targetToken=Student #S-2345 count=1
```

## Unsafe Log Examples

Do not log:

```text
actorId=staff_demo_session targetId=doc_001 reason="income document includes..."
metadata.studentEmail=student@example.edu sourceRoute=/staff/applications/raw-student-id
```

## PII Handling Rules

- Do not log raw student IDs, national IDs, email, phone, bank data, IP, file names, or OCR text.
- Do not log reason text.
- Do not log metadata values.
- Do not log raw route params.
- Do not store mismatch artifacts in browser storage.
- Do not send mismatch data to backend/API.
- Do not expose mismatch details in user-facing UI during AP-9E planning.

## User-Facing Display

AP-9E planning does not include user-facing mismatch display.

Any future debug panel must be:
- separate from normal Admin audit display
- admin-only
- explicitly approved
- PII-safe
- disabled by default

## Rollback Triggers

Immediate rollback is required if:
- forbidden metadata appears in comparison output
- raw identifiers appear in logs
- reason text appears in logs
- route params expose sensitive IDs
- mismatch logs are visible to non-admin users
- comparison affects Admin display rows
