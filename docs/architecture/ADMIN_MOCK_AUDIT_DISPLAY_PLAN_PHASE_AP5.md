# Admin Mock Audit Display Plan — AP-5

## 1. Purpose

AP-5 plans Admin display of mock audit events.

It does not change runtime UI code. It protects admins and system owners from mistaking mock events for official audit records. It prepares the future Admin audit log UI before any Staff action wiring begins.

AP-4 provides the pure in-memory mock writer. AP-5 plans how that writer's events should be displayed in the Admin audit surface.

## 2. Current State

- AP-1 audit persistence contract exists.
- AP-2 audit event builder and metadata validation exist.
- AP-3 mock audit writer planning exists.
- AP-4 pure in-memory mock writer exists with write, list, filter, seed, clear, snapshot, and count methods.
- Admin audit log page currently uses `mockAuditLogs` from `src/data/mock/audit-logs.ts`.
- Current page shows "Immutable record — cannot be edited or deleted" and allows CSV export.
- No real audit persistence exists.
- No UI is wired to the AP-4 mock writer.
- Staff document actions are not writing audit events.
- `mockAuditLogs` uses the old `AuditLog` type, not the new `AuditEvent` type from AP-2.

## 3. Problem To Solve

If the Admin audit log shows mock writer events without clear labels, admins may believe:

- audit records are official persisted records
- compliance evidence exists
- actions are stored permanently
- a backend audit service is live

This is dangerous for governance and system-owner trust. The current page already claims "Immutable record" and allows CSV export of mock data.

## 4. Admin Display Principles

- Mock events must be visibly labeled with a badge.
- Real and mock events must never be visually identical.
- Default copy must avoid official/compliance claims until real persistence.
- Metadata must be privacy-filtered before display.
- Export must be disabled or clearly watermarked for mock events.
- Mixed mock/real states must be separated or clearly warned.
- Event detail view must show persistence mode prominently.
- The page cannot claim permanence while using mock data.

## 5. Persistence Mode Display Rules

| Mode | Badge Label | Badge Tone | Helper Copy | Export Behavior | Detail Drawer Copy | Compliance Evidence |
|------|-------------|------------|-------------|-----------------|-------------------|---------------------|
| `prototype_only` | Prototype notice | Amber/warning | "Prototype audit awareness only — no record created" | Disabled/Watermarked | "This is a prototype interaction. No persistent record exists." | No |
| `mock_only` | Mock event | Purple/secondary | "Demo audit event — not official persistence" | Disabled/Watermarked | "This is a mock audit event for prototype review. It is not an official persisted audit record." | No |
| `real_persisted` | Official audit record | Green/success | "Official audit record — permanently stored" | Allowed | "This record is stored in the official audit log and cannot be edited or deleted." | Yes |

`real_persisted` should not be used until real persistence is implemented. It is planned only.

## 6. Admin Audit Log Table Changes — Future Plan

Future columns:

- Event (eventType)
- Actor (actorDisplayName)
- Role (actorRole)
- Target (targetType)
- Target display token (targetDisplayToken)
- Target privacy level (targetPrivacyLevel)
- Persistence mode
- Severity
- Source route
- Created at
- Reason present (yes/no)
- Metadata safety state

Future filters:

- persistence mode (mock_only, real_persisted)
- actor role
- target type
- severity
- event type
- date range
- privacy level
- mock vs official

Do not implement. This is planning only.

## 7. Event Detail Drawer Plan

Future event detail drawer sections:

1. **Summary** — eventType, severity, createdAt
2. **Persistence status** — large badge with warning copy
3. **Actor** — actorDisplayName, actorRole
4. **Target** — targetDisplayToken, targetType
5. **Reason** — reason text if present
6. **Metadata** — safe allowlisted metadata only, collapsed by default
7. **Source route** — link or path
8. **Policy version** — policyVersion
9. **Evidence status** — "Not official evidence" for mock events

Mock-only warning text:
"This is a mock audit event for prototype review. It is not an official persisted audit record and cannot be used as compliance evidence."

## 8. Export Rules

- Mock events cannot be exported as official audit evidence.
- Any mock export must be labeled "Demo/mock data only — not official audit evidence".
- Official audit export requires real persistence.
- Mixed exports must separate mock and real clearly.
- Providers/executives must not receive raw metadata in exports.
- Export action itself should be future auditable once real persistence exists.
- Current CSV export on the Admin audit log page must add a watermark/header warning.

## 9. Metadata Display Rules

Use AP-2 metadata privacy rules.

- Show only allowlisted metadata keys.
- Block `rawStudentName`, `studentEmail`, `studentId`, `nationalId`, `bankAccount`, `gpaRaw`, `incomeRaw`, `medicalInfo`, `freeTextSensitiveData`.
- Free-text caution: limit display length, avoid raw dumps.
- Role-specific display:
  - Admin can view more metadata, but still through allowlist.
  - Provider views must never receive raw student identity metadata.
  - Executive/ESQ views should only see aggregate/policy-level metadata.
- Reason text should be deliberate and not duplicated into metadata table.
- Raw metadata dumps are forbidden in any audit table cell.

## 10. Empty / Mock / Mixed State Copy

| State | Copy |
|-------|------|
| No audit events | "No audit events found" |
| Mock-only events | "Showing demo audit events — no official records exist yet" |
| Real persistence not connected | "Mock mode active — no real audit persistence configured" |
| Mixed mock/real future state | "Showing mixed demo and official records — see badges for distinction" |
| Filtering hides results | "No events match the selected filters" |
| Unsafe metadata blocked | "Some metadata fields are hidden due to privacy rules" |
| Export disabled because mock-only | "Export is disabled for demo data. Connect real persistence to enable official audit export." |

## 11. First Runtime Display Candidate

**Option A:** Add mock/real display badges to existing Admin audit mock fixture only.

- Minimal change to existing page.
- Uses current `mockAuditLogs` shape.
- Adds badge column, changes copy.
- No wiring to AP-4 writer.

**Option B:** Add Admin display for AP-4 mock writer events.

- Requires mapping AP-4 `AuditEvent` to display format.
- Connects mock writer to Admin view.
- More comprehensive but more change.

**Option C:** Wire Staff document actions to mock writer and show them in Admin audit.

- Highest risk — involves Staff runtime behavior.
- Should wait until Admin display boundaries are ready.

**Option D:** Create mock event detail drawer first.

- Standalone UI component.
- Can be designed with mock data.
- Delivers copy discipline early.

**Recommendation:** Option A first, then Option B later. Option A allows badge discipline to be proven before wiring the writer. Option C must wait until Admin display is reviewed.

## 12. QA Requirements For Future Runtime

Required QA before any runtime change:

- Desktop screenshot showing mock badge visible
- Mobile screenshot (375px width)
- Export disabled or watermarked for mock events
- Detail drawer shows correct copy
- Metadata blocked state verified
- No official persistence claims in copy
- Build passes
- `npm run check:audit-events` passes
- Console review for errors

## 13. Risks

- Admin overtrusts mock data as official records.
- Owner assumes compliance is done.
- Mock events exported as evidence.
- Metadata leakage through display.
- Mixed real/mock confusion when both exist.
- Warning fatigue reducing effectiveness.
- UI looks too official/polished.
- Future copy migration forgotten during transition.

## 14. Recommended Next Phase

**Option A:** AP-6 Admin mock display runtime badge/filter only

- Add mock-only badge to existing Admin audit page.
- Change copy from "Immutable record" to "Demo audit events".
- Disable or watermark CSV export.
- Do not wire AP-4 writer yet.

Why Option A:
- Minimal runtime change.
- Proves mock labeling discipline.
- Does not require mapping AP-4 writer to old fixture shape yet.
- Sets up safe foundation before Staff action wiring.

AP-6 should still avoid Staff document action wiring. That comes after Admin display is reviewed.