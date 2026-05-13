# Admin Mock Audit Writer Display — AP-6C Runtime Summary

Date: 2026-05-13
Branch: `architecture/admin-mock-audit-writer-display-runtime`
Phase: AP-6C runtime implementation

---

## Purpose

Connect the AP-4 mock audit writer to the Admin audit log display in mock-only mode.

The Admin audit log can now show both existing fixture records and static mock writer demo events side by side, clearly labeled and distinguished, without implying real audit persistence.

No Staff actions are wired. No runtime writes occur from user interaction. No real persistence is added.

---

## Files Inspected

| File | Purpose |
|------|---------|
| `docs/architecture/MOCK_AUDIT_WRITER_PHASE_AP4.md` | Writer API, behavior contract |
| `docs/architecture/ADMIN_MOCK_AUDIT_BADGE_FILTER_AP6A_SUMMARY.md` | AP-6A display state |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_AP6B_RUNTIME_SUMMARY.md` | AP-6B drawer state |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_COPY_RULES.md` | Approved and prohibited copy |
| `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_PRIVACY_MODEL.md` | Field visibility and privacy rules |
| `docs/architecture/AUDIT_PERSISTENCE_CONTRACT_PLAN.md` | Persistence mode contract |
| `docs/architecture/AUDIT_COPY_STAGE_GUIDE.md` | Stage 0/1/2 copy rules |
| `docs/architecture/AUDIT_METADATA_PRIVACY_RULES.md` | Forbidden and safe metadata keys |
| `src/app/admin/audit-log/page.tsx` | Existing audit log page |
| `src/components/admin/AdminAuditEventDetailDrawer.tsx` | AP-6B drawer |
| `src/data/mock/audit-logs.ts` | Mock fixture (read only) |
| `src/lib/audit/mockAuditWriter.ts` | Writer API |
| `src/lib/audit/auditEventBuilder.ts` | Builder API |
| `src/lib/audit/auditTypes.ts` | AuditEvent types |
| `src/lib/audit/auditMetadataRules.ts` | FORBIDDEN_AUDIT_METADATA_KEYS |
| `src/lib/audit/index.ts` | Audit library exports |

---

## Files Created

| File | Purpose |
|------|---------|
| `src/lib/audit/adminAuditDisplayAdapter.ts` | Normalizes fixture + writer demo events into unified display rows |
| `docs/architecture/ADMIN_MOCK_AUDIT_WRITER_DISPLAY_AP6C_SUMMARY.md` | This file |

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/admin/audit-log/page.tsx` | Uses `getAdminAuditDisplayRows` adapter; shows source badge per row; updated count banner |
| `src/components/admin/AdminAuditEventDetailDrawer.tsx` | Accepts `AdminAuditDisplayRow` instead of `AuditLog`; shows richer fields for writer events |

---

## What Changed

### `adminAuditDisplayAdapter.ts` (new)

**`AdminAuditDisplayRow` type** — unified display row for both sources:
- Common fields: `id`, `source`, `actorName`, `actorId`, `actorRole`, `action`, `entityType`, `entityId`, `createdAt`, `persistenceMode`
- Extended fields (writer events): `eventType`, `severity`, `reason`, `reasonRequired`, `targetDisplayToken`, `targetPrivacyLevel`, `metadata`, `sourceRoute`, `policyVersion`
- Legacy fields (fixture events): `before`, `after`, `ip`

**`DEMO_WRITER_EVENTS`** — three static demo AuditEvents built at module load:
1. `staff.document.verify` — staff verified a document (severity: low, no reason required)
2. `staff.document.reject` — staff rejected a document (severity: medium, reason: "Document is missing required pages.")
3. `admin.role.assign` — admin assigned a role (severity: critical, reason: "New staff onboarding — scholarship review team.")

All three use `persistenceMode: 'mock_only'`. They are static — no runtime writes occur.

**`getAdminAuditDisplayRows(fixtureLogs)`** — pure function:
- Converts `AuditLog[]` → `AdminAuditDisplayRow[]` with `source: 'fixture'`
- Converts `DEMO_WRITER_EVENTS` → `AdminAuditDisplayRow[]` with `source: 'writer'`
- Combines and sorts by `createdAt` descending
- Does not mutate any source

### `page.tsx` (modified)

- Imports `getAdminAuditDisplayRows` and `AdminAuditDisplayRow` from the adapter
- `ALL_DISPLAY_ROWS = getAdminAuditDisplayRows(mockAuditLogs)` computed once at module level
- `selectedLog` state type changed to `AdminAuditDisplayRow | null`
- Filter still works: `real_persisted` shows empty state, all others show `ALL_DISPLAY_ROWS`
- Banner now shows `(Fixture mock: N, Writer mock: N)` count
- Each row shows two badges: "Mock event" (purple) + "Fixture mock" / "Writer mock" source label
- CSV export updated to include Source column

### `AdminAuditEventDetailDrawer.tsx` (modified)

- Prop type changed from `AuditLog` to `AdminAuditDisplayRow`
- Source badge in drawer header ("Fixture mock" vs "Writer mock")
- Mock/demo notice banner shows context-aware copy:
  - Fixture: "This record is shown for mock/demo review. Real audit persistence is not connected yet."
  - Writer: "Generated from the mock audit writer for display review only."
- Event Identity section: shows `eventType` if available (writer), otherwise `action`; shows `policyVersion` if available; shows `severity` badge if available
- Target section: shows `targetDisplayToken` if available (writer), otherwise `entityId`; shows `targetPrivacyLevel` if available
- Action/Reason section: shows actual `reason` text if present (writer), otherwise "Reason not provided"
- Persistence/Evidence section: copy adapted per source (writer vs fixture)
- Metadata section: uses `metadata` object (writer events) or `before`/`after` (fixture events)

---

## Display Sources

| Source | Label | Color | Records |
|--------|-------|-------|---------|
| `src/data/mock/audit-logs.ts` | "Fixture mock" | Slate | 6 existing fixture rows |
| `adminAuditDisplayAdapter.ts` DEMO_WRITER_EVENTS | "Writer mock" | Violet | 3 static demo writer events |

Total rows: 9 (6 fixture + 3 writer), sorted by `createdAt` descending.

---

## Writer Connection Boundary

The adapter uses `buildAuditEvent` (from `src/lib/audit/auditEventBuilder.ts`) to create demo events at module load time. This is **not** the same as wiring Staff actions into the writer.

| Boundary | Status |
|----------|--------|
| `buildAuditEvent` used in adapter | Yes — for static demo events only |
| `createMockAuditWriter` used | No — adapter does not use the writer instance |
| Staff `onReject` → writer | Not wired |
| Staff `onRequestReplacement` → writer | Not wired |
| Any runtime user action → writer | Not wired |
| Real persistence | Not added |

The adapter builds events once at module load. No writer instance is created or called at display time.

---

## What Did Not Change

| Item | Status |
|------|--------|
| `src/data/mock/audit-logs.ts` | Unchanged — read only, not mutated |
| `src/lib/audit/mockAuditWriter.ts` | Unchanged |
| `src/lib/audit/auditEventBuilder.ts` | Unchanged |
| Staff components | Unchanged |
| Provider components | Unchanged |
| Student components | Unchanged |
| AP-6A persistence filter | Retained — all/mock-only/official persisted options work |
| AP-6A mock/demo badge per row | Retained |
| AP-6A official persisted empty state | Retained |
| Reason validation | Unchanged |
| ReasonRequiredModal | Not introduced |
| Routes, auth, role guards | Unchanged |
| Backend/API, export, disclosure | Unchanged |
| Real audit persistence | Not implemented |

---

## Mock-Only Safety Copy

Approved copy used:
- "Mock event" (row badge)
- "Fixture mock" / "Writer mock" (source badge)
- "Showing mock/demo audit records for prototype review. Not official persisted audit evidence."
- "Audit Event Detail (Mock/Demo)"
- "Mock/demo event — Not official audit evidence"
- "Generated from the mock audit writer for display review only."
- "This record is shown for mock/demo review. Real audit persistence is not connected yet."
- "This is a mock/demo event. Not official audit evidence."
- "Generated from the mock audit writer — for demonstration purposes only."
- "Reason not provided"
- "No additional metadata"
- "[Hidden by privacy rule]"

Prohibited copy not used:
- "Official audit record" — not used
- "Logged and auditable" — not used
- "Persisted / Stored / Saved" (implying real persistence) — not used
- "Verified / Confirmed / Validated" (evidential weight) — not used

---

## Validation

- `npm run build`: PASS — 40 routes, 0 type errors
- `npm run check:tokens`: PASS — 4/4
- `npm run check:audit-events`: PASS — 37/37
- `/admin/audit-log` built at 8.43 kB (was 6.02 kB in AP-6B — increase from adapter + writer demo)

---

## Local Dev Verification

Dev server started fresh from clean `.next`:

- `/login`: 200 OK (compiled 549 modules)
- `/admin/audit-log`: 200 OK (compiled 633 modules — 4 more than AP-6B due to audit adapter import)
- `/admin/dashboard`: 200 OK

Dev log: no errors, no warnings, no hydration issues, no duplicate key warnings, no chunk errors, no 404/500.

---

## Manual QA Notes

Verified via HTTP HEAD requests and clean dev server log:

- `/admin/audit-log` returns 200 OK ✓
- Build succeeds with 0 type errors ✓
- All 37 audit event checks pass ✓
- No forbidden files changed ✓

Expected UI behavior (not browser-tested — server is headless):
- 9 rows total: 6 fixture mock (slate badge) + 3 writer mock (violet badge)
- Source badge visible per row
- Count in banner: "Fixture mock: 6, Writer mock: 3"
- All filter and official persisted empty state preserved
- "View details" opens drawer for any row
- Drawer shows source-aware content and copy
- No real persistence implied anywhere

Screenshots: not captured (headless environment).

---

## Safety Confirmations

| Item | Status |
|------|--------|
| Mock audit log mutated | No |
| Mock writer wired to Staff actions | No |
| Staff document actions wired | No |
| Provider/Student/ESQ actions wired | No |
| Real audit persistence added | No |
| Reason validation changed | No |
| ReasonRequiredModal introduced | No |
| Routes/auth/export/disclosure changed | No |
| AP-6D started | No |

---

## Recommended Next Phase

**AP-6D — Wire Staff document reject and replacement request callbacks to the mock audit writer (mock_only only).**

Prerequisites:
- AP-6C display reviewed and approved.
- Product sign-off on which Staff actions should write mock audit events.
- Confirm mock-safe copy for Staff-triggered entries matches Admin display rules.

AP-6D should remain limited to:
- Calling `mockAuditWriter.write(...)` from `onReject` / `onRequestReplacement` in `DocumentVerificationPanel`
- Using `mock_only` persistence mode only
- Not claiming real persistence in UI copy
- Not enforcing additional reason validation
- Not introducing `ReasonRequiredModal`

Do not start AP-6D without explicit approval.
