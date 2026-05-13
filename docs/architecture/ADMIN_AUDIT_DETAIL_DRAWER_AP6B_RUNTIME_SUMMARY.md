# Admin Audit Event Detail Drawer — AP-6B Runtime Summary

Date: 2026-05-13
Branch: `architecture/admin-audit-detail-drawer-runtime`
Phase: AP-6B runtime implementation

---

## Purpose

Add a read-only Admin audit event detail drawer to the existing Admin audit log page.

The drawer shows event context for each mock/demo audit row without implying real audit persistence.

---

## Files Inspected

| File | Purpose |
|------|---------|
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_PLAN_PHASE_AP6B.md` | Drawer sections, goals, non-goals |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_COPY_RULES.md` | Approved and prohibited copy |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_PRIVACY_MODEL.md` | Field visibility and metadata privacy rules |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_RUNTIME_SEQUENCE.md` | Recommended component structure and state |
| `docs/architecture/ADMIN_MOCK_AUDIT_BADGE_FILTER_AP6A_SUMMARY.md` | AP-6A state (mock badge, persistence filter) |
| `docs/architecture/ADMIN_AUDIT_MOCK_COPY_RULES.md` | Mock-safe copy rules for the Admin audit page |
| `docs/architecture/ADMIN_AUDIT_DISPLAY_PRIVACY_RULES.md` | Display-level privacy constraints |
| `docs/architecture/AUDIT_METADATA_PRIVACY_RULES.md` | Forbidden and safe metadata keys |
| `docs/architecture/AUDIT_COPY_STAGE_GUIDE.md` | Copy stage model (Stage 0 = prototype-safe) |
| `src/app/admin/audit-log/page.tsx` | Existing audit log page (AP-6A state) |
| `src/data/mock/audit-logs.ts` | Mock AuditLog fixture (read only, not mutated) |
| `src/lib/audit/auditTypes.ts` | AuditEvent, AuditPersistenceMode, AuditPrivacyLevel types |
| `src/lib/audit/auditMetadataRules.ts` | FORBIDDEN_AUDIT_METADATA_KEYS, SAFE_AUDIT_METADATA_KEYS |
| `src/components/ui/index.tsx` | Available UI primitives (StatusBadge, PageHeader, etc.) |

---

## Files Created

| File | Purpose |
|------|---------|
| `src/components/admin/AdminAuditEventDetailDrawer.tsx` | Drawer component — read-only, mock-safe |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_AP6B_RUNTIME_SUMMARY.md` | This file |

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/admin/audit-log/page.tsx` | Added `selectedLog` state, "View details" button per row, drawer column header, conditional drawer render |

---

## What Changed

### `AdminAuditEventDetailDrawer.tsx` (new)

A fixed right-side drawer panel that renders over the audit log page.

**Props:**
- `log: AuditLog` — the selected mock audit log row
- `onClose: () => void` — clears selection and closes drawer

**Drawer sections:**

| Section | Content |
|---------|---------|
| Header | Drawer title (Mock/Demo), event ID in monospace |
| Mock/demo notice banner | "Mock/demo event — Not official audit evidence" + "Real audit persistence is not connected yet." |
| Event Identity | Event ID, timestamp, action string (used as event type), policy version fallback |
| Actor | Role badge, actor name, actor ID from fixture |
| Target / Entity | Entity type, entity ID, privacy note about mock IDs |
| Action / Reason | Action string, "Reason not provided" placeholder |
| Persistence / Evidence | `mock_only` badge + "This is a mock/demo event. Not official audit evidence." |
| Metadata | `before`/`after` objects if present (filtered through FORBIDDEN_AUDIT_METADATA_KEYS), "No additional metadata" otherwise |
| Session Context | IP from fixture (labeled as mock) |
| Bottom evidence note | Restatement that records are from the demo dataset |
| Footer | Close button |

**Privacy handling:**
- `FORBIDDEN_AUDIT_METADATA_KEYS` from `auditMetadataRules.ts` applied to all before/after metadata keys
- Forbidden keys display `[Hidden by privacy rule]`
- Missing values display `[Value not available]`
- Mock fixture IDs are labeled as mock, not presented as privacy-masked tokens

### `src/app/admin/audit-log/page.tsx` (modified)

- Added `import AdminAuditEventDetailDrawer`
- Added `selectedLog` state: `useState<(typeof mockAuditLogs)[number] | null>(null)`
- Added empty `<th>` column header for the actions column
- Added "View details" button to each row (`onClick={() => setSelectedLog(log)}`)
- Conditionally renders `AdminAuditEventDetailDrawer` when `selectedLog` is not null
- `onClose` clears `selectedLog`

---

## What Did Not Change

| Item | Status |
|------|--------|
| `src/data/mock/audit-logs.ts` | Unchanged — read only, not mutated |
| `src/lib/audit/mockAuditWriter.ts` | Unchanged — not wired into display |
| Staff components | Unchanged |
| Provider components | Unchanged |
| Student components | Unchanged |
| Persistence filter (AP-6A) | Retained and working |
| Mock/demo badge on rows (AP-6A) | Retained |
| Official persisted empty state (AP-6A) | Retained |
| Reason validation | Unchanged |
| ReasonRequiredModal | Not introduced |
| Routes, auth, role guards | Unchanged |
| Backend/API, export, disclosure | Unchanged |
| Real audit persistence | Not implemented |

---

## Drawer Sections

1. **Header** — Drawer title + event ID
2. **Mock/demo notice banner** — Prominent purple banner clarifying mock status
3. **Event Identity** — ID, timestamp, action, policy version fallback
4. **Actor** — Role badge, name, ID
5. **Target / Entity** — Entity type, entity ID, privacy note
6. **Action / Reason** — Action string, reason placeholder
7. **Persistence / Evidence** — `mock_only` mode badge + full mock-safe copy block
8. **Metadata** — before/after fields with forbidden key filtering
9. **Session Context** — IP (labeled as mock fixture data)
10. **Evidence note** — Closing statement on demo-only nature
11. **Footer** — Close button

---

## Copy Rules Applied

Approved copy used:
- "Audit Event Detail (Mock/Demo)"
- "Mock/demo event — Not official audit evidence"
- "This record is shown for mock/demo review. Real audit persistence is not connected yet."
- "This is a mock/demo event. Not official audit evidence."
- "For demonstration purposes only. Not real audit persistence."
- "Reason not provided"
- "No additional metadata"
- "[Hidden by privacy rule]"
- "[Value not available]"
- "Not available in mock fixture"

Prohibited copy not used:
- "Official audit record" — not used
- "Logged and auditable" — not used
- "Persisted" / "Stored" / "Saved" (implying real persistence) — not used
- "Verified" / "Confirmed" / "Validated" (evidential weight claims) — not used

---

## Privacy Handling

- `FORBIDDEN_AUDIT_METADATA_KEYS` from `auditMetadataRules.ts` imported and applied to all `before`/`after` metadata rendering
- Forbidden keys: `rawStudentName`, `studentName`, `email`, `studentEmail`, `phone`, `address`, `nationalId`, `rawStudentId`, `bankAccount`, `gpaRaw`, `incomeRaw`, `medicalInfo`, `disabilityInfo`, `freeTextSensitiveData`
- Mock fixture IDs (`actor_id`, `entity_id`) are shown as-is from the fixture but labeled as mock data, not presented as officially privacy-masked tokens

---

## Validation

- `npm run build`: PASS — 40 routes, 0 type errors
- `npm run check:tokens`: PASS — 4/4
- `npm run check:audit-events`: PASS — 37/37

---

## Safety Confirmations

| Item | Status |
|------|--------|
| Mock audit log mutated | No |
| Mock writer wired into display | No |
| Staff actions wired into audit writer | No |
| Real audit persistence added | No |
| Reason validation changed | No |
| ReasonRequiredModal introduced | No |
| Routes/auth/export/disclosure changed | No |
| AP-6C started | No |

---

## Recommended Next Phase

**AP-6C — Wire AP-4 mock audit writer into Staff document actions (reject / replacement request only).**

Prerequisites:
- AP-6B drawer reviewed and approved.
- Staff document action copy reviewed against mock-safe rules.
- Product sign-off on which actions should write mock audit events.

AP-6C should remain limited to:
- Calling `mockAuditWriter.write(...)` from `onReject` / `onRequestReplacement` callbacks
- Using `mock_only` persistence mode
- Not claiming real persistence in UI copy
- Not enforcing additional reason validation
- Not introducing `ReasonRequiredModal`

Do not start AP-6C automatically. Requires explicit approval.
