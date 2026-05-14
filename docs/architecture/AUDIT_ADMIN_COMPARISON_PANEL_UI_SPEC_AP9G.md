# Audit Admin Comparison Panel UI Spec AP-9G

## 1. Purpose

This document specifies the UI state model, layout, component structure, copy, and accessibility requirements for the future AP-9G Admin debug comparison panel.

This is a planning document. No UI is implemented yet.

## 2. Placement Options

| Option | Description | Trade-off |
|--------|-------------|-----------|
| A. Collapsible section in `/admin/audit-log` | Panel below the audit table, collapsed by default | Close to the data context; risk of confusion with audit table |
| B. Separate tab in `/admin/audit-log` | Tab alongside audit log tab | Clear separation; requires tab component |
| C. Sub-section in `/admin/dashboard` | Panel on the Admin dashboard | Separated from audit log; less context |
| D. Standalone route `/admin/audit-comparison-debug` | Own page, Admin-only | Most isolated; requires nav entry (admin only) |

## 3. Recommended Placement

**Option A: Collapsible section in `/admin/audit-log`**, collapsed by default.

Rationale:
- Keeps comparison context near the audit log
- Collapsed by default prevents confusion with the authoritative audit table
- Does not require new routes or nav entries
- Easiest to hide/remove if comparison is rolled back

The section must be visually distinct from the Admin Audit Log table with a clear debug/developer label:

> ⚙ Debug: Audit Read Comparison (ข้อมูลนักพัฒนา — ไม่ใช่บันทึกอย่างเป็นทางการ)

English label: `Developer Debug: Audit Read Comparison — Not official audit data`

## 4. Panel States

| State | Trigger | UI behavior |
|-------|---------|-------------|
| `blocked` | Role ≠ admin OR all flags false | Nothing rendered — no DOM trace |
| `disabled` | `featureEnabled: false` OR `adminDebugPanelEnabled: false` | Section label only: "Comparison disabled" |
| `no-data` | Flags enabled but no comparison runs yet | Empty state with prompt to trigger a comparison |
| `matched` | Last result has `status: 'matched'` | Green health indicator, counts, last run time |
| `mismatched` | Last result has `status: 'mismatched'` | Amber indicator, counts, mismatch table |
| `failed` | Last result has `status: 'failed'` | Red indicator, `safeMessage`, no mismatch table |
| `skipped` | Last result has `status: 'skipped'` | Grey indicator, guard gate message |

## 5. Summary Cards

The panel summary section shows the following cards when in `matched`, `mismatched`, `skipped`, or `failed` states:

| Card | Field | Format |
|------|-------|--------|
| Status | `result.status` | Badge: matched / mismatched / failed / skipped / disabled |
| Source events | `result.sourceCount` | Number: "15 source events" |
| Prototype events | `result.prototypeCount` | Number: "14 prototype events" |
| Mismatches | `result.mismatchCount` | Number: "2 mismatches" |
| Last run | `result.createdAt` | Relative time: "3 minutes ago" |
| Guard status | Guard gate result | "Blocked at gate 3: source events missing" |
| Health | Derived from status | Icon: ✓ / ⚠ / ✗ |

All cards use safe aggregate fields only. No raw event data, no PII.

## 6. Mismatch Table Rules

The mismatch table appears only when `status === 'mismatched'` and `mismatchCount > 0`.

Allowed columns:

| Column | Field | Notes |
|--------|-------|-------|
| Category | `mismatch.category` | Translated enum label |
| Dimension | `mismatch.dimension` | Translated enum label |
| Message | `mismatch.safeMessage` | Pre-formatted safe string |
| Source token | `mismatch.sourceSafeToken` | Only if masked (e.g. `Student #S-2345`) |
| Prototype token | `mismatch.prototypeSafeToken` | Only if masked |

Forbidden columns:
- `sourceEventId`, `prototypeEventId` — internal IDs
- Any raw event field
- Any PII

Mismatch table behavior:
- Collapsible — hidden by default when count > 10
- Not sortable by raw identifiers
- Not exportable to CSV or clipboard (audit log export must not include comparison data)
- Max display: 50 rows; truncate with "X more mismatches not shown" message

## 7. Empty State

When flags are enabled but no comparison has been run:

```
No comparison results yet.
Comparison runs when audit events are written and readCompareEnabled is true.
```

Thai: ยังไม่มีผลการเปรียบเทียบ

## 8. Disabled State

When `adminDebugPanelEnabled` is `false` or `featureEnabled` is `false`:

```
[Debug panel disabled]
```

Short label only. No comparison data, no counts. Visible only to Admin role.

## 9. Failed State

When `status === 'failed'`:

```
Comparison failed: [safeMessage]
```

`safeMessage` is the only text shown. No stack trace, no raw error object, no event IDs.

## 10. Loading State

While comparison results are loading from the in-memory store:

```
Loading comparison results…
```

Thai: กำลังโหลดผลการเปรียบเทียบ…

Spinner or skeleton — no partial data shown during load.

## 11. Accessibility Requirements

- The debug panel section must have `aria-label="Developer Debug: Audit Comparison Panel"` (or Thai equivalent)
- Status badges must use `role="status"` and `aria-live="polite"` when status can change
- Health indicator icon must have `aria-label` text equivalent (e.g. "Status: matched")
- Mismatch table must use `<table>` with `<caption>`, `<thead>`, `<th scope="col">`
- Collapsible section must use `aria-expanded` on the toggle button
- Focus must not trap inside the panel when collapsed
- Color is not the only indicator of status — icon + text label required

## 12. Mobile Behavior

- The panel collapses to a single status badge + count on screens < 768px
- The mismatch table scrolls horizontally on mobile
- Summary cards stack vertically on mobile (2-column grid minimum)
- The debug label is always visible when expanded on mobile

## 13. Copy Examples

**English:**
- Panel header: `Developer Debug: Audit Read Comparison — Not official audit data`
- Status: `Matched` / `Mismatched (2)` / `Failed` / `Disabled`
- Source count: `15 source events`
- Mismatch category: `Missing in prototype`
- Mismatch dimension: `Event count`
- Disabled message: `Comparison debug panel is disabled.`

**Thai:**
- หัวข้อ: `ข้อมูลนักพัฒนา: การเปรียบเทียบบันทึกการตรวจสอบ — ไม่ใช่บันทึกอย่างเป็นทางการ`
- สถานะ: `ตรงกัน` / `ไม่ตรงกัน (2)` / `ล้มเหลว` / `ปิดใช้งาน`
- จำนวนแหล่งที่มา: `15 รายการแหล่งที่มา`
- ปิดใช้งาน: `แผงดีบักเปรียบเทียบถูกปิดใช้งาน`

## 14. QA Checklist

- [ ] Panel is blocked (no DOM trace) for non-Admin roles
- [ ] Panel shows `disabled` state when flags are off
- [ ] Panel shows `no-data` state when no comparison runs exist
- [ ] Panel shows correct status badge for each state
- [ ] Summary cards show only aggregate counts and timestamps
- [ ] Mismatch table shows only allowed columns
- [ ] Mismatch table is not exportable
- [ ] Empty state renders correctly
- [ ] Failed state shows only `safeMessage`
- [ ] Loading state shows no partial data
- [ ] `aria-label` present on panel section
- [ ] Status badge has `aria-live` and text equivalent
- [ ] Mismatch table has `<caption>` and `scope` attributes
- [ ] Collapsible toggle has `aria-expanded`
- [ ] Mobile: panel collapses to badge + count
- [ ] Mobile: mismatch table scrolls horizontally
- [ ] Thai copy reviewed for PII
- [ ] English copy reviewed for PII
- [ ] Debug label visible and distinct from audit table
