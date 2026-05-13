# Admin Audit Visual Hierarchy Plan — Post AP-6C

Date: 2026-05-13
Branch: `design/admin-audit-ux-qa-polish-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

Define how badges, warning copy, and drawer sections should be visually ordered and weighted in the Admin audit log after AP-6C. This plan is the reference for any future UI polish pass.

---

## Badge Hierarchy

### Principle

There are two distinct concepts that badges currently convey:

1. **Persistence status** — whether the record is mock/demo or officially persisted. This is the primary trust signal. Every record should show this.
2. **Data source** — whether the record came from the static fixture file or from the mock writer adapter. This is a developer-level distinction, not an admin concept.

The current UI treats both concepts as equal (two same-size stacked badges per row). They should have a clear primary/secondary hierarchy.

### Recommended Badge Hierarchy

| Level | Badge | Purpose | Location |
|-------|-------|---------|---------|
| Primary | "Demo event" (purple, dot) | Persistence trust signal — all records are mock/demo | Table status column + drawer header |
| Secondary (optional) | Source label (smaller chip, de-emphasized) | Developer context — fixture vs generated | Table status column (smaller text, muted tone) or tooltip |
| Absent | No badge | Official persisted records (future) — no mock badge needed | — |

### What Changes

**Table status column (current):**
```
[● Demo event]       ← purple StatusBadge (primary)
[Fixture mock]       ← slate chip (same visual weight as primary)
```

**Table status column (recommended):**
```
[● Demo event]       ← purple StatusBadge (primary, unchanged)
  fixture            ← de-emphasized text-[9px] text-ink-3, no border box
```

Or, if source distinction is removed from the table:
```
[● Demo event]       ← single badge, no secondary label
```

The source distinction is still available in the drawer (drawer header source badge).

---

## Badge Color Usage

### Current color assignments

| Badge | Color | Conflict |
|-------|-------|---------|
| Mock event badge | `bg-purple-500/10 text-purple-600` | None |
| Fixture mock chip | `bg-slate-100 text-slate-600 border-slate-200` | None |
| Writer mock chip | `bg-violet-50 text-violet-700 border-violet-200` | **Conflict**: `ROLE_COLOR.esq = text-violet-700` in same table |
| ESQ role text | `text-violet-700` | Conflicts with Writer mock chip |

### Recommended badge color for Writer-source events

Change writer source badge to indigo to avoid collision with ESQ role color:

```tsx
// Current (conflicts with esq role)
'text-violet-700 bg-violet-50 border-violet-200'

// Recommended
'text-indigo-700 bg-indigo-50 border-indigo-200'
```

This change applies in both `page.tsx` (table row) and `AdminAuditEventDetailDrawer.tsx` (drawer header).

---

## Where Warning Copy Should Live

### Principle

Mock/demo warnings should appear **once per context level**, not at every level simultaneously. Currently, mock-nature is stated four times: page banner → drawer banner → persistence section → bottom note.

### Recommended placement

| Context | Location | What to say |
|---------|---------|-------------|
| Page level | Top warning banner | One sentence: "Showing demo audit records for prototype review. Not official persisted evidence." |
| Row level | "Demo event" badge | Visual-only — no extra text needed |
| Drawer entry | Drawer mock notice banner (just below header) | One sentence: source-context-aware copy |
| Drawer mid | Persistence/Evidence section | Mode badge + one-sentence evidence limitation |
| Drawer bottom | Bottom note | **Remove** — redundant with the above two |

### Warning copy reduction summary

Remove the bottom note from `AdminAuditEventDetailDrawer.tsx`:

```tsx
// Remove this block:
<div className="p-3 rounded-lg border border-line bg-surface-low/40">
  <div className="text-[10px] text-ink-3 leading-relaxed">
    {lang === 'th'
      ? 'บันทึกนี้มาจากชุดข้อมูลเดโม S²IMS...'
      : 'This record is from the S²IMS mock/demo dataset...'}
  </div>
</div>
```

The mock notice banner and the Persistence/Evidence section already communicate the same constraint with higher visual prominence.

---

## How Source vs Persistence Should Be Displayed

### Source (where data comes from)

Source is a developer-level concept. It should be **secondary** and **de-emphasized**:

- In the table: small text or tooltip on the primary badge, not a separate chip.
- In the drawer: source badge in the header is acceptable (developers reviewing the prototype will find it useful), but should be smaller than the title text and clearly labeled as a data origin indicator, not a trust/compliance indicator.

### Persistence (whether data is mock or real)

Persistence is the primary trust signal. It should be **primary** and **prominent**:

- In the table: the purple "Demo event" badge is the primary indicator. Retain it unchanged.
- In the drawer: the mock notice banner (purple AlertCircle) is the primary indicator. Retain it.
- In the drawer: the Persistence/Evidence section with the `mock_only` mode badge is the authoritative evidence status. Retain it.

---

## Drawer Section Hierarchy

### Recommended section order and weight

| Priority | Section | Icon | Content | Weight |
|----------|---------|------|---------|--------|
| 1 | Mock/Demo Notice Banner | AlertCircle (purple) | "Demo record — not official evidence." | High — always visible, pinned below header |
| 2 | Event Identity | Activity | ID, timestamp, event type, severity | High — primary event facts |
| 3 | Actor | User | Role badge, name | High — who acted |
| 4 | Target / Entity | Target | Entity type, token or ID | High — what was affected |
| 5 | Action / Reason | MessageSquare (recommended) | Action string, reason text | High for rejected events; Medium for verify |
| 6 | Persistence / Evidence | Shield | Mode badge + evidence limitation copy | High — compliance context |
| 7 | Metadata | Database | Key-value pairs, forbidden key filtering | Medium — developer context |
| 8 | Session Context | Shield (secondary) | IP (fixture events only) | Low — developer context |
| — | Bottom Note | — | **Remove** — redundant | — |

### Icon conflict resolution

Current: Both "Event Identity" and "Action / Reason" use the `Activity` icon from lucide-react.

**Recommended:**
- Event Identity → keep `Activity` (represents event/log concept)
- Action / Reason → change to `MessageSquare` (represents text/reason concept)
- Session Context → change to `Globe` or `Wifi` (represents network context)

This gives each section a distinct visual anchor for faster scanning.

---

## What Should Be Reduced or De-emphasized

| Element | Current prominence | Recommended |
|---------|-------------------|------------|
| Source sub-badge in table | Same height as primary badge — high visual weight | Smaller text, no border box, de-emphasized tone |
| "Fixture mock: N, Writer mock: N" counts in banner | Inline in banner text | Remove or move to developer-visible tooltip |
| "Reason Required: Yes/No" in drawer | Full field row with label | Remove entirely from drawer, or collapse to a detail note in the Persistence section |
| "Actor ID (mock data)" label annotation | "(mock data)" in parentheses in label text | Remove annotation — just "Actor ID" |
| "IDs shown are from the mock fixture..." privacy note | Inline explanation box below Target/Entity fields | Reduce to one line: "Demo IDs — not privacy-masked." |
| "Policy Version: Not available in mock fixture" | Full field row | Hide field when value is unavailable |
| Bottom evidence note | Full section before footer | Remove |

---

## Mobile Layout Notes

### Drawer on 375px viewport

The drawer uses `max-w-sm` which is 384px — 9px wider than the 375px iPhone SE viewport. On this viewport, the drawer covers 100% of the screen. This is acceptable for a prototype but has two UX gaps:

1. **No visible backdrop** — the backdrop (`bg-black/30`) is behind the drawer but covers a screen that is already fully obscured by the drawer. The tap-to-close affordance only works on viewports wider than 384px.
2. **No swipe gesture** — there is no touch swipe-to-close. Users on mobile must use the close button (X) in the header.

Recommended for prototype stage (no code change required):
- Accept current behavior as-is — admins are unlikely to use mobile for audit review.
- Document that mobile is a known limitation and defer swipe-to-close to AP-7+.

Recommended for polish pass if mobile is a priority:
- Add `overflow-x-auto` wrapper to the table in `page.tsx` so the table scrolls horizontally on small viewports instead of clipping.
- On the drawer, consider adding a bottom drag handle or a swipe listener for touch close.

### Table on small viewports

The 7-column table will overflow horizontally on viewports narrower than ~900px. Currently, no horizontal scroll wrapper is applied to the table card. On small laptops or tablets, columns may be compressed or clipped.

Minimum viable mobile fix:
```tsx
// Wrap table in scrollable container
<div className="card overflow-x-auto">
  <table className="w-full min-w-[640px] text-sm">
    ...
  </table>
</div>
```

This is a one-line fix that prevents layout breakage without visual impact on desktop.

### Filter + Banner on mobile

The banner and filter are both full-width and stack vertically. On 375px, the banner text with counts may wrap to 3–4 lines. Simplifying the banner copy (remove technical counts) also reduces mobile text wrapping.
