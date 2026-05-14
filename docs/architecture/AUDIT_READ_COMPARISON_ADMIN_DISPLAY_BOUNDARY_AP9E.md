# Audit Read Comparison Admin Display Boundary AP-9E

## Overview

AP-9E keeps Admin display on the existing mock-safe read path. Prototype reads are planned only for future comparison diagnostics and must not alter Admin UI output.

This phase is documentation-only.

## Active Admin Read Source

`adminAuditDisplayAdapter` remains the active source for Admin audit rows.

Current path:

```text
mockAuditLogs
  + DEMO_WRITER_EVENTS
  + sharedMockAuditWriter.list()
  -> adminAuditDisplayAdapter
  -> AuditDisplayPresenter
  -> Admin audit table / drawer / export
```

## Display Formatting Boundary

`AuditDisplayPresenter` remains the formatting boundary for:

- row labels
- actor role labels
- action labels
- target labels
- source labels
- persistence labels
- severity labels
- drawer-ready details
- CSV/export row formatting

## Prototype Comparison Boundary

Future prototype comparison must not:

- alter Admin table rows
- alter Admin drawer rows
- alter CSV/export output
- replace `adminAuditDisplayAdapter`
- bypass `AuditDisplayPresenter`
- switch Admin display to prototype reads
- activate `readFromPrototype`
- affect filters or sorting
- expose prototype mismatch information to ordinary users

## Debug Panel Boundary

Any future debug panel must be:

- separate from the Admin audit table
- admin-only
- disabled by default
- PII-safe
- aggregate-first
- explicitly approved in a later phase

The debug panel must not display actor IDs, target IDs, reason text, metadata values, raw route params, raw student IDs, emails, phone numbers, bank data, IPs, file names, or OCR text.

## Real Persisted Filter

The real persisted filter remains safe/empty until separately approved.

AP-9E planning does not add real persistence and does not make `real_persisted` reachable.

## Safety Rule

If comparison data and Admin display data disagree, Admin display must continue showing the current mock-safe path until a separate approved migration phase changes that rule.
