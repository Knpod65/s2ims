# Audit Read Comparison Dimensions AP-9E

## Overview

This document defines the safe comparison dimensions for a future AP-9E/AP-9F audit read comparison runtime.

The current phase is documentation-only. No runtime comparison is implemented.

## Comparison Dimensions

### Event Count

Compare total event counts between the current Admin-safe mock read snapshot and prototype read snapshot.

Expected result: counts match for the comparison scope.

### Event IDs

Compare event ID sets only for equality and presence. Event IDs are for internal matching and must not be printed in user-facing UI or broad logs.

Expected result: every mock event in scope has a matching prototype event, and no unexpected prototype event appears.

### Event Types

Compare `eventType` distribution.

Expected result: `staff.document.reject` and `staff.document.request_replacement` distributions match for AP-9D shadow data.

### Actor Role

Compare `actorRole` distribution without logging actor IDs or actor display names.

Expected result: role distributions match.

### Target Display Token

Compare safe target display tokens only. Raw target IDs must not be logged.

Expected result: safe tokens match.

### Persistence Mode

Compare persistence mode distribution.

Expected result:
- mock source remains `mock_only`
- prototype source remains `prototype_only`
- `real_persisted` never appears

### Severity

Compare severity values and distribution.

Expected result: severity matches for the same logical event.

### Timestamp Order

Compare sorted order by `createdAt`.

Expected result: order is stable and deterministic.

### Source Route

Compare source route classification or approved route prefix only. Raw route params must not be logged.

Expected result: route category/prefix matches.

### Safe Metadata Key Set

Compare metadata key names only. Metadata values must not be logged.

Expected result: safe key sets match and forbidden keys never appear.

### Presenter Output Consistency

Compare selected `AuditDisplayPresenter` output fields:
- action label
- actor role label
- target label
- source label
- persistence label
- severity label
- copy stage

Expected result: presenter output remains consistent for Admin-safe comparable fields.

### Copy-Stage Consistency

Compare copy-stage labels for `mock_only` and `prototype_only`.

Expected result: both stages remain explicitly labeled and mock-safe; `real_persisted` remains unavailable.

## Mismatch Categories

| Category | Meaning | Severity |
|---|---|---|
| missing in prototype | event exists in mock source but not prototype source | high |
| extra in prototype | event exists in prototype source but not mock source | high |
| duplicate in prototype | prototype has repeated event IDs or duplicate logical events | high |
| order mismatch | same event set but unstable timestamp order | medium |
| metadata key mismatch | metadata key sets differ | medium |
| unsafe metadata mismatch | forbidden metadata key appears | critical |
| persistence mode mismatch | unexpected mode appears or mode distribution is wrong | critical |
| presenter output mismatch | display output differs for comparable fields | high |
| copy-stage mismatch | lifecycle/copy-stage label differs unexpectedly | medium |

## Non-Goals

- No user-facing mismatch display in AP-9E planning.
- No raw event dumps.
- No comparison of reason text.
- No comparison of metadata values.
- No Admin read switch.
- No real persistence.
