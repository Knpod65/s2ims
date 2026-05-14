# Audit Shadow Write Callback Mapping AP-9C

**Planned on 2026-05-14.**

Branch: `architecture/audit-shadow-write-runtime-plan-ap9c`

## 1. Purpose

Map every Staff audit-producing callback to its current write path and define where shadow write integration would be inserted in a future runtime phase. This document is **planning only** — no code changes are made.

## 2. Current Staff Document Callback State

AP-6D wired two Staff callbacks to the shared mock audit writer:

| Callback | Function | Current Write Path | Status |
|----------|----------|-------------------|--------|
| `onReject` | Staff document reject | `sharedMockAuditWriter.write()` | Wired (AP-6D) |
| `onRequestReplacement` | Staff replacement request | `sharedMockAuditWriter.write()` | Wired (AP-6D) |
| `onVerify` | Staff document verify | **Not wired** | Deferred (AP-6E) |

## 3. Current AP-6D Audit Write Path

```
Staff clicks action (reject / replacement request)
  │
  ▼
onReject / onRequestReplacement callback fires
  │
  ▼
buildStaffDocumentRejectEvent() / buildStaffDocumentReplacementRequestEvent()
  [auditEventBuilder.ts — existing builder helpers]
  │
  ▼
sharedMockAuditWriter.write(event)
  [sharedMockWriter.ts — singleton mock writer]
  │
  ▼
try/catch wrapper — toast fires regardless of writer result
  │
  ▼
Staff UI continues (toast displayed, panel may update)
```

## 4. Candidate Actions for AP-9C Runtime

| # | Action | Event Type | Builder | Reason | Status |
|---|--------|-----------|---------|--------|--------|
| 1 | Staff document reject | `staff.document.reject` | `buildStaffDocumentRejectEvent()` | Has reason, has metadata | **Candidate** |
| 2 | Staff document replacement request | `staff.document.request_replacement` | `buildStaffDocumentReplacementRequestEvent()` | Has reason, has metadata | **Candidate** |

## 5. Explicitly Excluded Actions

| Action | Event Type | Reason for Exclusion |
|--------|-----------|---------------------|
| Staff document verify | `staff.document.verify` | Not yet wired (deferred to AP-6E) |
| Admin role assign | `admin.role.assign` | Admin-only, separate governance |
| Admin role remove | `admin.role.remove` | Admin-only, separate governance |
| Admin export generate | `admin.export.generate` | Backend/API out of scope |
| Admin permission change | `admin.permission.change` | Admin-only |
| Provider shortlist request | `provider.shortlist.request` | Provider workflow, separate review |
| Provider shortlist submit reason | `provider.shortlist.submit_reason` | Provider workflow, separate review |
| Disclosure approve identity reveal | `staff.disclosure.approve_identity_reveal` | Requires separate privacy review |
| Disclosure reject identity reveal | `staff.disclosure.reject_identity_reveal` | Requires separate privacy review |
| Match override decision | `staff.match.override_decision` | Not currently wired to audit |
| OCR process document | `system.ocr.process_document` | System-level, requires backend |
| Data quality flag | `system.data_quality.flag` | System-level, requires backend |
| Integration sync failed | `system.integration.sync_failed` | System-level, requires backend |

## 6. Required Event Builders

Both candidate actions already have builder helpers in `auditEventBuilder.ts`:

```typescript
// Existing builders (AP-6D)
buildStaffDocumentRejectEvent(input: StaffDocumentAuditInput): AuditEvent
buildStaffDocumentReplacementRequestEvent(input: StaffDocumentAuditInput): AuditEvent
```

These builders:
- Set `persistenceMode` to `'mock_only'` (current behavior)
- Validate required fields
- Run metadata through `FORBIDDEN_AUDIT_METADATA_KEYS` guard
- Are already tested and stable

**No builder changes are needed for AP-9C.** Future runtime implementation will change the `persistenceMode` value to `'prototype_only'` for shadow write events at the point of write, not at the builder level.

## 7. Future Insertion Points

### 7.1 Rejection Shadow Write Insertion

**Current file:** `src/app/staff/applications/[id]/page.tsx`  
**Current function:** `onReject` callback  
**Insertion point:** After existing `sharedMockAuditWriter.write()` call

```typescript
// Pseudo-code — future implementation
const onReject = async (documentId: string, reason: string) => {
  // Existing validation and reason check (unchanged)
  if (!reason.trim()) return

  // Existing event build and write to sharedMockWriter (unchanged)
  const event = buildStaffDocumentRejectEvent({
    documentId,
    applicationId,
    studentToken,
    sourceRoute: currentRoute,
    reason,
    reasonRequired: true,
    reasonMinLength: 1,
  })

  try {
    sharedMockAuditWriter.write(event)
  } catch (writeError) {
    toast.error('ไม่สามารถบันทึก audit ได้')
    return
  }

  // [AP-9C FUTURE INSERTION POINT]
  // Shadow write to prototype storage — non-blocking
  if (auditConfig.auditPrototypeEnabled && auditConfig.auditPrototypeShadowWriteEnabled) {
    // Change persistenceMode for prototype write
    const prototypeEvent = { ...event, persistenceMode: 'prototype_only' as const }
    try {
      await prototypePersistenceService.recordPrototypeEvent(prototypeEvent)
    } catch (shadowError) {
      // Non-blocking: log only, do not affect UI
      console.warn(`[AUDIT PROTOTYPE] Shadow write failed: ${shadowError.message}`)
    }
  }

  // Existing toast and UI update (unchanged)
  toast.success('เอกสารถูกปฏิเสธ')
  // ... existing state updates
}
```

### 7.2 Replacement Request Shadow Write Insertion

**Current file:** `src/app/staff/applications/[id]/page.tsx`  
**Current function:** `onRequestReplacement` callback  
**Insertion point:** After existing `sharedMockAuditWriter.write()` call

```typescript
// Pseudo-code — future implementation
const onRequestReplacement = async (documentId: string, reason: string) => {
  // Existing validation (unchanged)
  if (!reason.trim()) return

  // Existing event build and write (unchanged)
  const event = buildStaffDocumentReplacementRequestEvent({
    documentId,
    applicationId,
    studentToken,
    sourceRoute: currentRoute,
    reason,
    reasonRequired: true,
    reasonMinLength: 1,
  })

  try {
    sharedMockAuditWriter.write(event)
  } catch (writeError) {
    toast.error('ไม่สามารถบันทึก audit ได้')
    return
  }

  // [AP-9C FUTURE INSERTION POINT]
  // Shadow write to prototype storage — non-blocking
  if (auditConfig.auditPrototypeEnabled && auditConfig.auditPrototypeShadowWriteEnabled) {
    const prototypeEvent = { ...event, persistenceMode: 'prototype_only' as const }
    try {
      await prototypePersistenceService.recordPrototypeEvent(prototypeEvent)
    } catch (shadowError) {
      console.warn(`[AUDIT PROTOTYPE] Shadow write failed: ${shadowError.message}`)
    }
  }

  // Existing toast and UI update (unchanged)
  toast.success('ขอเอกสารแทนส่งเรียบร้อย')
}
```

## 8. Required Non-Blocking Behavior

The following invariants must hold when shadow writes are enabled in a future runtime phase:

| Invariant | Implementation |
|-----------|---------------|
| UI never waits for shadow write | Shadow write is `await`-ed but errors are caught; UI flow does not branch on result |
| Toast never depends on shadow write | Toast fires before or regardless of shadow write result |
| Shared writer write always precedes shadow write | Strict ordering: sharedMockWriter → shadow write |
| Shadow write failure is logged, not thrown | `catch` block logs warning, records metric |
| No retry on shadow write failure | Single attempt only |
| No notification side effects on failure | No email, push, or webhook |
| Admin display never switches to prototype | `adminAuditDisplayAdapter` continues reading from sharedMockWriter |
| SharedMockWriter is never modified | The shared writer instance must not be altered by shadow write logic |

## 9. QA Checklist

- [ ] Review all candidate actions against current callback implementations
- [ ] Confirm builder helpers require no changes
- [ ] Confirm insertion points are after (not before) sharedMockWriter writes
- [ ] Confirm non-blocking try/catch pattern for each insertion point
- [ ] Confirm feature flag checks at each insertion point
- [ ] Confirm no callback signature changes
- [ ] Confirm no toast behavior changes
- [ ] Confirm no reason validation changes
- [ ] Confirm ReasonRequiredModal not introduced
- [ ] Confirm verify callback not wired
- [ ] Confirm no PII in shadow write payloads
- [ ] Confirm forbidden metadata keys blocked before shadow write
- [ ] Confirm prototype_only mode used, never real_persisted
- [ ] Confirm Admin display unaffected
- [ ] Confirm all 92 existing checks still pass
- [ ] Confirm route smoke tests pass
- [ ] Confirm dev log clean