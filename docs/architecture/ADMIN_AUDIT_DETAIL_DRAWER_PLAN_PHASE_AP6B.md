# Admin Audit Event Detail Drawer Plan (AP-6B)

## Purpose
This document outlines the planning for an Admin Audit Event Detail Drawer that will be triggered from the Admin audit log table (post AP-6A). The drawer provides a detailed view of a single audit event, designed to display event context without implying real audit persistence. This is a docs-only planning phase; no runtime implementation occurs here.

## Current AP-6A State
After AP-6A, the Admin audit log page displays:
- Each row labeled with a "mock" badge (via `mock_only` persistence mode).
- A persistence mode filter (All, Mock/demo only, Official persisted records).
- Existing mock audit log data treated as `mock_only` for display.
- An intentional empty state for the "Official persisted records" filter.
- Stage 1 mock-safe copy clarifying the view is not official persisted audit evidence.

## Drawer Goals
- Provide a detailed view of a single audit event when a row is clicked.
- Clearly distinguish between mock/demo data and (future) official persisted records.
- Display event identity, actor, target, action/reason, persistence/evidence, and metadata sections.
- Enforce privacy-safe display rules (tokenization, masking, etc.) based on target privacy level and metadata rules.
- Use copy that explicitly states the nature of the data (mock vs official) and avoids implying real compliance evidence.
- Prepare for future real persistence compatibility without wiring the mock writer or Staff actions in this phase.
- Remain a read-only view; no editing or mutation of audit events.

## Information Architecture
The drawer will be a temporary overlay (e.g., a Dialog or Drawer component) that appears over the Admin audit log page. It will be scrollable if content exceeds viewport. The layout will be divided into labeled sections.

## Drawer Sections
1. **Event Identity** – Core identifiers and timestamps.
2. **Actor** – Who performed the action.
3. **Target** – Who or what the action was performed on.
4. **Action/Reason** – What action was taken and any associated reason.
5. **Persistence/Evidence** – Indicates whether the event is mock/demo or official persisted.
6. **Metadata** – Additional structured data about the event, subject to privacy rules.

## Event Identity Section
- **Event ID** – The audit event's unique identifier (e.g., `evt_123abc`).
- **Timestamp** – When the event occurred (formatted date/time).
- **Event Type** – The type of audit event (e.g., `STAFF_DOCUMENT_VERIFY`).
- **Policy Version** – The audit policy version under which the event was logged.

## Actor Section
- **Actor ID** – The identifier of the user or system that performed the action (e.g., staff token like `ST-456`).
- **Actor Role** – The role of the actor (e.g., `staff`, `provider`, `system`).
- **Actor Name** – If available and permitted by privacy rules (e.g., from profile); otherwise, token only.

## Target Section
- **Target ID** – The identifier of the target (e.g., student token like `S-7890`).
- **Target Type** – The type of target (e.g., `student`, `document`, `scholarship`).
- **Target Name** – If available and permitted by privacy rules (e.g., from profile); otherwise, token only.
- **Target Privacy Level** – The privacy level of the target (e.g., `public`, `sensitive`, `restricted`), which affects what details can be shown.

## Action/Reason Section
- **Action** – A human-readable description of the action taken (e.g., "Verified document").
- **Reason** – The reason provided for the action (if required by the event type). If missing, display a placeholder like "Reason not provided".
- **Action Metadata** – Any additional structured data specific to the action type (e.g., document ID for document-related events).

## Persistence/Evidence Section
- **Persistence Mode** – One of: `mock_only`, `real_persisted`, `prototype_only`.
- **Evidence Status** – Copy indicating whether the event is:
  - For `mock_only`: "This is a mock/demo event. Not official audit evidence."
  - For `real_persisted`: "This is an official persisted audit event."
  - For `prototype_only`: "This is a prototype event. Not official audit evidence."
- **Note**: In AP-6B, all events from the current mock fixture will be displayed as `mock_only`.

## Metadata Section
- Displays key-value pairs from the audit event's `metadata` field.
- Each row: `Metadata Key`: `Metadata Value`.
- Values are subject to privacy-safe display rules (see Privacy Model).
- If metadata is empty, display a message like "No additional metadata".
- If certain keys are hidden due to privacy rules, display a placeholder like "[Hidden by privacy rule]".

## Privacy-Safe Display Rules
- Based on the target's privacy level and the metadata privacy rules (from `auditMetadataRules.ts`):
  - **Public Target**: Show all non-sensitive metadata keys as-is.
  - **Sensitive Target**: Tokenize or hash identifiers; show only safe metadata keys.
  - **Restricted Target**: Show only non-identifying metadata; block sensitive keys entirely.
- Specific rules:
  - Never display raw student/provider IDs; always show tokens (e.g., `S-123`, `ST-456`).
  - For metadata keys listed in `BLOCKED_METADATA_KEYS`, display "[Hidden by privacy rule]" instead of the value.
  - For metadata keys in `SAFE_METADATA_KEYS`, show the value as-is (if already non-sensitive).
  - For other metadata keys, apply a default safety rule (e.g., tokenize if it looks like an ID).

## Mock vs Official Copy Rules
- **Mock-Only Copy** (for `mock_only` events):
  - Use phrases like "mock/demo", "not official audit evidence", "for demonstration purposes".
  - Example: "This event is part of the mock/demo dataset and does not represent real audit persistence."
- **Official Persisted Copy** (for future `real_persisted` events):
  - Use phrases like "official audit event", "persisted audit record".
  - Example: "This is an official audit event persisted to the audit store."
- **Prohibited Phrases**:
  - Avoid words like "verified", "confirmed", "validated", "compliant" when describing the event's evidentiary weight.
  - Do not imply legal or compliance significance for mock events.

## Empty/Unknown States
- **Event ID missing**: Display "Event ID not available".
- **Timestamp missing**: Display "Timestamp not available".
- **Actor/Target missing**: Display "[Actor/Target] not available".
- **Reason missing**: Display "Reason not provided" (or event-type-specific guidance).
- **Metadata empty**: Display "No additional metadata".
- **Metadata key value missing**: Display "[Value not available]".

## Future Real Persistence Compatibility
- The drawer design should accommodate real persisted events without changes to the layout or sections.
- The persistence/evidence section will dynamically reflect the actual persistence mode.
- Privacy rules apply equally to mock and real persisted events.
- No assumption that real persisted events have more or different fields.

## Non-Goals
- Do not allow editing or mutating audit events from the drawer.
- Do not wire the AP-4 mock audit writer into the drawer (this is for AP-6C or later).
- Do not wire Staff document actions into the drawer or audit writer.
- Do not add real audit persistence (backend/API changes).
- Do not change reason validation logic.
- Do not introduce ReasonRequiredModal (this is for Staff flows, not Admin viewing).
- Do not change the Admin audit log table UI (beyond adding the click-to-open-drawer interaction).

## Recommended Runtime Sequence
1. Create a new component `AuditEventDetailDrawer` in `src/components/admin/`.
2. Use React state to control drawer open/close and the selected event ID.
3. Modify `src/app/admin/audit-log/page.tsx` to:
   - Add an `onClick` handler to each row that sets the selected event ID and opens the drawer.
   - Conditionally render the `AuditEventDetailDrawer` component when an event is selected.
4. The drawer will fetch the audit event by ID from the mock audit log (via a selector or service that reads from `src/data/mock/audit-logs.ts`).
5. Implement the drawer UI using the sections and copy rules above.
6. Apply privacy-safe display rules using utilities from `src/lib/audit/auditMetadataRules.ts`.
7. Test with the existing mock audit log fixture.
8. Validate that the drawer does not mutate the mock audit log or imply real persistence.

## QA Routes
- `/admin/audit-log` – Click any row to open the drawer and verify content.
- Verify that the drawer closes when clicking outside or on a close button.
- Verify that the persistence/evidence section correctly shows "mock/demo" copy.
- Verify that tokenized IDs are shown (e.g., `S-123`, not raw IDs).
- Verify that blocked metadata keys are hidden.
- Verify that copy does not imply real evidence for mock events.

## Validation Checklist
- [ ] Drawer opens/closes correctly.
- [ ] All sections are present and labeled.
- [ ] Event identity shows correct IDs and timestamps.
- [ ] Actor and target show tokens (not raw IDs) and respect privacy levels.
- [ ] Action/reason section shows action and reason (or placeholder).
- [ ] Persistence/evidence section shows mock-only copy.
- [ ] Metadata section shows key-values with privacy rules applied.
- [ ] No raw student/provider IDs are visible.
- [ ] No blocked metadata keys are visible.
- [ ] Copy uses mock-safe language (e.g., "not official evidence").
- [ ] Drawer does not mutate the mock audit log.
- [ ] No real persistence pathways are introduced.
- [ ] Reason validation unchanged.
- [ ] No ReasonRequiredModal introduced.

## What Must Not Be Combined with Runtime Drawer
- Do not combine the initial runtime drawer implementation with:
  - Wiring the AP-4 mock audit writer (AP-6C).
  - Wiring Staff document actions into the audit writer.
  - Adding real audit persistence.
  - Changing reason validation.
  - Introducing ReasonRequiredModal.
These should be separate phases to ensure clear boundaries and reviewability.

## Why Mock Writer Wiring Should Wait (Unless Explicitly Approved)
- The drawer's purpose is to display event context, not to persist new events.
- Wiring the mock writer would introduce persistence logic (even if mock) into a view-only component, conflating concerns.
- Admin display boundaries (what is shown, what copy is used) should be reviewed and approved before adding write capabilities.
- Staff action wiring into the mock writer is a separate concern that requires its own review of copy, validation, and modal usage.
