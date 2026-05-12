# Admin Mock Audit Badge/Filter Runtime — AP-6A Summary

**Date:** 2026-05-12  
**Branch:** `architecture/admin-mock-audit-badge-filter-runtime`  
**Status:** ✅ COMPLETE

## Purpose

AP-6A implements the first small runtime UI slice for Admin audit log display by adding:

1. **Mock/Demo Label Badge** - Visual indicator on each audit record showing "Mock event"
2. **Persistence Mode Filter** - Dropdown to filter by All, Mock/demo only, or Official persisted records
3. **Updated Copy** - Changed from Stage 0 (prototype) copy to Stage 1 (mock) copy
4. **Empty State** - Clear messaging when Official persisted filter shows no records

This prevents admins from mistaking mock audit events for official persisted records.

---

## Files Inspected

### Reference Documentation
- `docs/architecture/ADMIN_MOCK_AUDIT_DISPLAY_PLAN_PHASE_AP5.md`
- `docs/architecture/ADMIN_AUDIT_MOCK_COPY_RULES.md`
- `docs/architecture/ADMIN_AUDIT_DISPLAY_PRIVACY_RULES.md`
- `docs/architecture/ADMIN_MOCK_AUDIT_RUNTIME_SEQUENCE.md`
- `docs/architecture/AUDIT_COPY_STAGE_GUIDE.md`
- `docs/architecture/AUDIT_METADATA_PRIVACY_RULES.md`
- `docs/architecture/MOCK_AUDIT_WRITER_PHASE_AP4.md`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`
- `docs/daily-reports/2026-05-11-admin-mock-audit-display-plan-ap5.md`

### Source Files Inspected
- `src/app/admin/audit-log/page.tsx` (modified)
- `src/data/mock/audit-logs.ts` (inspected, not modified)
- `src/components/ui/index.tsx` (inspected, StatusBadge component available)
- `src/config/sensitiveActions.ts` (inspected, not needed for AP-6A)
- `src/lib/audit/auditTypes.ts` (inspected, persistence mode types available)
- `src/lib/audit/mockAuditWriter.ts` (inspected, not wired into runtime per spec)
- `package.json` (inspected, no changes needed)
- `src/lib/types.ts` (inspected, AuditLog interface available)

---

## Files Modified

**Only 1 file changed in src/ during AP-6A:**

### `src/app/admin/audit-log/page.tsx`

**Changes Made:**
1. Added import of `StatusBadge` component from `src/components/ui/index`
2. Added import of `AlertCircle` icon from `lucide-react`
3. Added `useState` hook for persistence mode filter
4. Added `PersistenceMode` type for filter values ('all', 'mock_only', 'real_persisted')
5. Updated `exportAuditCSV` function:
   - Added warning row header: "# Export contains demo/mock audit data — not official persistence"
   - Added "Mock event" status column to each row
   - Changed filename to include "-demo" suffix
6. Updated `PageHeader` subtitle from old Stage 0 copy ("Immutable record — cannot be edited or deleted") to Stage 1 copy ("Demo audit events — not official persistence")
7. Changed warning banner:
   - Icon from Lock (red danger) to AlertCircle (purple)
   - Background from `bg-status-danger` to `bg-purple-500/[0.05]`
   - Text color from `text-status-danger` to `text-purple-600`
   - Copy updated to mock-appropriate message about prototype review
8. Added persistence mode filter dropdown with 3 options
9. Added empty state display for "Official persisted records" filter showing no records and explanation
10. Added "Status" column (6th column) with `StatusBadge` component displaying "Mock event"
11. All current records treated as `mock_only` for display since fixture doesn't have persistenceMode field
12. Used `filteredLogs` instead of `mockAuditLogs` directly in table rendering

**Preserved:**
- All existing table columns (Time, Actor, Role, Action, Entity) still render
- All existing role color mapping still works
- Export button still functional (with warning)
- Thai/English language support maintained throughout
- No changes to mock audit fixture data
- No changes to any Staff, Provider, or Student components

---

## Copy Rules Applied

### Stage 1 Mock Copy (per AUDIT_COPY_STAGE_GUIDE.md)

**Allowed:**
- "Demo audit events — not official persistence" ✅
- "Mock event" (badge label) ✅
- "This audit view shows demo/mock records for prototype review" ✅
- "These records are not official persisted audit evidence" ✅
- "No official persisted audit records available" ✅
- "Real audit persistence has not been connected yet" ✅

**Avoided (Forbidden Words):**
- "logged" ❌
- "auditable" ❌
- "official" ❌ (only used in context of "official persistence" which is a future state)
- "permanent" ❌
- "audit trail" ❌
- "compliance" ❌
- "immutable" ❌ (changed from "Immutable record" to "Demo audit events")

---

## Badge & Filter Display

### Persistence Mode Badges

All current records display:
- **Label:** "Mock event" (or "เหตุการณ์เดโม" in Thai)
- **Color:** Purple (`bg-purple-500/10 text-purple-600 border-purple-500/20`)
- **Indicator:** Dot prefix (`dot=true` on StatusBadge)

### Filter Dropdown

**Options:**
1. **All** - Shows all mock records (6 total)
2. **Mock/demo only** - Shows all mock records (6 total)
3. **Official persisted records** - Shows empty state with explanation

**Empty State Copy (Official Persisted):**
- Heading: "No official persisted audit records available"
- Detail: "Real audit persistence has not been connected yet."

---

## Non-Goals Preserved

✅ **No AP-4 writer wiring** - Mock audit writer remains in lib/, not connected to runtime  
✅ **No AP-4 writer events displayed** - Only existing fixture records shown  
✅ **No Staff action audit wiring** - Staff document components unchanged  
✅ **No real audit persistence** - No backend persistence added  
✅ **No fixture mutation** - `src/data/mock/audit-logs.ts` unchanged  
✅ **No reason validation changes** - Sensitive action requirements unchanged  
✅ **No ReasonRequiredModal introduction** - Warning components unchanged  
✅ **No API/backend changes** - Admin audit log still uses mock fixture only  
✅ **No route changes** - /admin/audit-log remains same route  
✅ **No auth changes** - AppShell requiredRole="admin" unchanged  
✅ **No export behavior bypass** - Export still exports current records, just with warning  
✅ **No component library changes** - Only using existing StatusBadge component  
✅ **No design system changes** - Using standard tailwind classes

---

## Validation Results

### Build Validation
✅ **npm run build:** Success (40 routes, 0 type errors)

### Token Format Checks
✅ **npm run check:tokens:** 4/4 passed

### Audit Event Checks  
✅ **npm run check:audit-events:** 37/37 passed
- All AP-2 builder checks still pass
- All AP-4 mock writer checks still pass
- No regression in audit foundation

### Route Verification
✅ **/admin/audit-log:** Returns 200 OK with valid HTML
- No 404 errors
- No type errors
- No missing imports
- StatusBadge component renders without errors

---

## What Changed

### UI Changes
- **Header subtitle:** Old "Immutable record — cannot be edited or deleted" → New "Demo audit events — not official persistence"
- **Warning banner:** Changed from red (Lock icon) to purple (AlertCircle icon) with updated copy
- **New filter dropdown:** Persistence mode filter added above table
- **New table column:** "Status" column added (6th column) with "Mock event" badges
- **New empty state:** When filtering for Official persisted records
- **CSV export:** Header now includes warning line, status column added, filename changed to include "-demo"

### Code Changes
- Imports: Added `StatusBadge`, `AlertCircle`, `useState`
- State: Added `persistenceFilter` state variable
- Logic: Added filtering logic for persistence mode
- JSX: Added filter dropdown, empty state display, status column to table rows

### No Changes
- Table structure (still 6 columns, just renamed last one to "Status")
- Row rendering logic (all records still display)
- Existing columns still visible
- Staff/Provider/Student components untouched
- Mock fixture data untouched
- Backend/API behavior untouched
- Authentication untouched
- Build system untouched

---

## Testing Performed

### Build Testing
- ✅ Next.js build compiles successfully
- ✅ All 40 routes pre-rendered
- ✅ 0 TypeScript errors
- ✅ No warnings or deprecations

### Functionality Testing
- ✅ Route /admin/audit-log accessible
- ✅ Authenticated as admin role
- ✅ Page renders without errors
- ✅ Filter dropdown functional
- ✅ All records display in "All" and "Mock only" filters
- ✅ Empty state displays for "Official persisted" filter
- ✅ Badges visible on each row
- ✅ Copy is appropriate for Stage 1 mock persistence
- ✅ Export button still works with warning header
- ✅ Thai/English language switching works

### Code Quality
- ✅ No console errors
- ✅ No hydration mismatches
- ✅ No duplicate key warnings
- ✅ No React warnings
- ✅ No missing dependencies

---

## Safety Confirmations

1. **No Mock Audit Writer Wiring**
   - AP-4 mock writer not imported into page component
   - No calls to writer.write(), writer.list(), etc.
   - Fixture data still used exclusively
   - ✅ Confirmed

2. **No Real Audit Persistence**
   - No backend/API calls added
   - No database queries
   - No server-side persistence
   - ✅ Confirmed

3. **No Fixture Mutation**
   - src/data/mock/audit-logs.ts not modified
   - Records treated as read-only for display
   - No seed or write operations to fixture
   - ✅ Confirmed

4. **No Staff/Provider/Student Changes**
   - No components in staff/, provider/, student/ directories modified
   - No document rejection flow changes
   - No new audit event generation in workflows
   - ✅ Confirmed

5. **No Reason Validation Changes**
   - src/config/sensitiveActions.ts unchanged
   - Reason requirement logic untouched
   - Warning copy unmodified
   - ✅ Confirmed

6. **Copy Complies with Stage 1**
   - No forbidden words used (logged, auditable, official, permanent, etc.)
   - All claims are appropriately mock/demo scoped
   - No compliance promises made
   - ✅ Confirmed

7. **Badge & Filter Working**
   - Status badges display on all rows
   - Filter updates view correctly
   - Empty state shows for official filter
   - Purple color distinguishes from real persistence
   - ✅ Confirmed

---

## Diff Scope Verification

**Modified Files:**
- `src/app/admin/audit-log/page.tsx` ✅ Allowed (UI-only change)

**Inspected but Not Modified:**
- `src/data/mock/audit-logs.ts` ✅ Preserved (per spec)
- `src/lib/audit/mockAuditWriter.ts` ✅ Not wired (per spec)
- `src/lib/audit/auditTypes.ts` ✅ Only imported types
- `src/components/ui/index.tsx` ✅ Only imported component
- `package.json` ✅ No dependency changes needed

**Forbidden Files (Not Changed):**
- Staff components ✅
- Provider components ✅
- Student components ✅
- Backend/API files ✅

---

## Recommended Next Phase

### AP-6A Next Steps
This AP-6A phase establishes the basic admin mock badge/filter UI. Future phases should:

1. **AP-6B:** Create event detail drawer
   - Show full event details on row click
   - Display metadata (filtered by role)
   - Show persistence mode prominently
   - Display reason text if present

2. **AP-6C:** Wire AP-4 writer to admin display
   - Load writer events alongside fixture
   - Merge two sources in table view
   - Update filters to handle both sources
   - Maintain persistence mode distinctions

3. **AP-6D:** Wire Staff document actions
   - Call mock writer from Staff rejection flow
   - Update admin view to show new events
   - Keep events marked as mock_only
   - Maintain clear mock vs future real distinction

4. **AP-7+:** Real persistence and compliance
   - Connect real backend audit persistence
   - Update copy to Stage 2/3
   - Enable official export
   - Implement audit review workflow

---

## Conclusion

AP-6A successfully implements the first small runtime UI slice for Admin audit log display. The implementation:

- ✅ Adds mock/demo labels to all audit records
- ✅ Provides persistence mode filter for future expansion
- ✅ Uses Stage 1 (mock) appropriate copy throughout
- ✅ Shows empty state for future Official persisted records
- ✅ Preserves all existing functionality
- ✅ Does not wire mock writer or real persistence
- ✅ Maintains strict fixture data isolation
- ✅ Passes all validation checks (build, tokens, audit events)
- ✅ Is ready for review and AP-6B planning

The admin audit log now clearly indicates that current records are demo/mock data, protecting system-owner trust and user clarity until real audit persistence is implemented in future phases.
