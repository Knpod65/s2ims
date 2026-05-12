# Admin Mock Audit Runtime Sequence

This document plans the future phases for Admin mock audit display. It is planning-only and does not authorize implementation.

## Phase Overview

| Phase | Scope |
|-------|-------|
| AP-6A | Admin mock badge/filter on existing mock audit log |
| AP-6B | Admin detail drawer plan/runtime |
| AP-6C | Connect AP-4 writer to Admin display in mock-only mode |
| AP-6D | Staff document action mock wiring |
| AP-7 | Real persistence design |

---

## AP-6A: Admin Mock Badge/Filter on Existing Mock Audit Log

### Goal
Add mock/real display badges to the existing Admin audit log page.

### Files Likely Touched
- `src/app/admin/audit-log/page.tsx`
- `src/components/ui/Badge.tsx` (if exists)
- Documentation only for now

### Validation
- Build passes
- Mock badge visible in screenshots
- Copy updated from "Immutable record" to "Demo audit events"
- Export disabled or watermarked

### Risks
- Page still uses old `AuditLog` type
- No persistence mode on old fixture
- Need to add mock-only mode to fixture

### Non-Goals
- No AP-4 writer wiring
- No real persistence
- No Staff action changes
- No new types introduced

---

## AP-6B: Admin Detail Drawer Plan/Runtime

### Goal
Create event detail drawer for audit log rows.

### Files Likely Touched
- `src/components/admin/AuditEventDetailDrawer.tsx` (new)
- `src/app/admin/audit-log/page.tsx` (update)
- Documentation

### Validation
- Detail drawer opens on row click
- Shows correct copy for mock events
- Metadata correctly filtered
- Build passes

### Risks
- Detail view must not expose raw metadata
- Copy must be mock-appropriate

### Non-Goals
- No real persistence connection
- No export implementation
- No Staff changes

---

## AP-6C: AP-4 Writer to Admin Display

### Goal
Connect AP-4 mock writer to Admin display in mock-only mode.

### Files Likely Touched
- `src/app/admin/audit-log/page.tsx` (major refactor)
- `src/lib/audit/mockAuditWriter.ts` (no change)
- New hooks for writer instance
- Documentation

### Validation
- Writer events display in Admin log
- Persistence badge shows "Mock event"
- Filters work by persistence mode
- 37 audit checks still pass

### Risks
- Must map `AuditEvent` to display format
- Must maintain mock-only isolation
- Must not break existing page

### Non-Goals
- No Staff action wiring
- No real persistence
- No export bypass

---

## AP-6D: Staff Document Action Mock Wiring

### Goal
Wire Staff document actions to AP-4 mock writer.

### Files Likely Touched
- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/lib/audit/mockAuditWriter.ts` (no change)
- New session writer context
- Documentation

### Validation
- Staff document rejection shows in Admin mock log
- Mock badge preserved
- Build passes
- 37 audit checks pass

### Risks
- Higher risk: Staff workflow changes
- Must not overclaim audit behavior
- Must preserve prototype-safe copy

### Non-Goals
- No reason validation changes
- No ReasonRequiredModal
- No real persistence

---

## AP-7: Real Persistence Design

### Goal
Design backend/API for real audit persistence.

### Files Likely Touched
- Database schema design
- API route design
- New persistence service
- Documentation

### Validation
- Design documented
- No runtime changes yet
- Build passes
- Audit checks pass

### Risks
- Major architectural change
- Must preserve mock boundaries
- Must define migration path

### Non-Goals
- No implementation in AP-7
- No UI changes
- No Staff action changes

---

## Recommended Start Point

Start with AP-6A:

1. Add mock-only badge to existing Admin audit page
2. Change page copy from "Immutable record" to "Demo audit events"
3. Add watermark to CSV export or disable it
4. Document approach before proceeding to AP-6B

This sequence:
- Proves mock labeling discipline first
- Does not require AP-4 writer wiring yet
- Allows review before Staff action changes
- Maintains safest boundary between mock and real