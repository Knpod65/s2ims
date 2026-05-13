# Admin Audit Event Detail Drawer Runtime Sequence (AP-6B)

## Purpose
This document outlines the proposed runtime implementation sequence for the Admin Audit Event Detail Drawer (AP-6B). It is intended to guide the first runtime slice after the planning docs are reviewed and approved.

## AP-6B Runtime Sequence Proposal
The goal of the first runtime slice is to implement a read-only drawer that displays audit event details from the existing mock audit log, without introducing any persistence logic (mock or real) or Staff action wiring.

### Recommended First Runtime Slice
1. **Create the drawer component** (`src/components/admin/AuditEventDetailDrawer.tsx`).
2. **Modify the Admin audit log page** (`src/app/admin/audit-log/page.tsx`) to open the drawer on row click.
3. **Implement data retrieval** from the mock audit log (read-only).
4. **Apply privacy-safe display rules** using existing utilities.
5. **Use the defined copy rules** for mock-only events.
6. **Test with the existing mock audit log fixture**.

### Files Likely to Modify
- **Create**:
  - `src/components/admin/AuditEventDetailDrawer.tsx`
- **Modify**:
  - `src/app/admin/audit-log/page.tsx` (to add drawer trigger and state)
- **Possibly create or modify** (if not already present):
  - `src/lib/audit/auditSelector.ts` (or similar) to get an audit event by ID from the mock log (read-only)
  - `src/lib/audit/auditPrivacyUtils.ts` (or use existing `auditMetadataRules.ts`) for privacy-safe formatting

### Expected Component Shape
The `AuditEventDetailDrawer` component should:
- Accept an `eventId` prop (or `event` prop) and an `onClose` callback.
- Use React state to manage loading/error states (though data is from mock log, so synchronous).
- Render the drawer UI with the sections defined in the plan.
- Apply privacy rules to each field before display.
- Use the copy rules for mock-only events (since we are only displaying mock data in this slice).
- Have a close button and close on backdrop click (if using a Dialog/Drawer from a UI library).

### State Handling Plan
- In `src/app/admin/audit-log/page.tsx`:
  - Add state: `selectedEventId: string | null` and `drawerOpen: boolean`.
  - When a row is clicked, set `selectedEventId` to the event's ID and open the drawer.
  - When the drawer closes, set `selectedEventId` to null.
- The drawer component is conditionally rendered when `selectedEventId` is not null.
- The drawer component fetches the event by `selectedEventId` from the mock audit log (read-only).

### QA Routes
- Visit `/admin/audit-log`.
- Click on any audit log row.
- Verify the drawer opens with the correct event details.
- Verify that the drawer shows mock-safe copy (e.g., "Not official audit evidence").
- Verify that IDs are tokenized (e.g., S-123, ST-456) and not raw.
- Verify that blocked metadata keys are hidden.
- Verify that the drawer closes when clicking the close button or backdrop.
- Click on another row to verify the drawer updates.

### Validation Checklist
- [ ] Drawer opens and closes correctly.
- [ ] All sections (Event Identity, Actor, Target, Action/Reason, Persistence/Evidence, Metadata) are present.
- [ ] Event identity shows the event ID and timestamp.
- [ ] Actor and target show tokens (not raw IDs) and respect the target's privacy level.
- [ ] Action/reason section shows the action and reason (or placeholder).
- [ ] Persistence/evidence section shows mock-only copy (e.g., "This is a mock/demo event. Not official audit evidence.").
- [ ] Metadata section shows key-values with privacy rules applied (blocked keys hidden, tokenized IDs).
- [ ] No raw student/provider IDs are visible in the drawer.
- [ ] No blocked metadata keys are visible.
- [ ] Copy uses mock-safe language (e.g., "not official evidence").
- [ ] The mock audit log is not mutated (no writes).
- [ ] No real persistence pathways are introduced.
- [ ] Reason validation unchanged.
- [ ] No ReasonRequiredModal introduced.

### What Must Not Be Combined with This Runtime Drawer
Do not combine this initial runtime implementation with:
- Wiring the AP-4 mock audit writer (AP-6C or later).
- Wiring Staff document actions into the audit writer.
- Adding real audit persistence (backend/API changes).
- Changing reason validation logic.
- Introducing ReasonRequiredModal.
These should be separate phases to ensure clear boundaries and reviewability.

### Why Mock Writer Wiring Should Still Wait (Unless Explicitly Approved)
- The drawer's purpose is to display event context, not to persist new events.
- Wiring the mock writer would introduce persistence logic (even if mock) into a view-only component, conflating concerns.
- Admin display boundaries (what is shown, what copy is used) should be reviewed and approved before adding write capabilities.
- Staff action wiring into the mock writer is a separate concern that requires its own review of copy, validation, and modal usage.
- If there is a desire to test the mock writer in the Admin UI, it should be done in a separate branch/PR after the display layer (including the drawer) is reviewed and approved.
