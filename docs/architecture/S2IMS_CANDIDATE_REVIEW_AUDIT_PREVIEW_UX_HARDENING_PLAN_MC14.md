# S²IMS Candidate Review Audit Preview UX Hardening Plan MC14

## 1. Purpose

MC14 defines UX hardening requirements for the MC13 diagnostic preview UI. These are planning-only rules to ensure users cannot confuse the diagnostic preview state with saved state, official evidence, assignment, approval, or scholarship decision.

**Core Rule:**
The preview must be visually and textually understood as diagnostic-only, local-only, not saved, not submitted, not official evidence, not assignment, not approval, and not scholarship decision.

## 2. Scope

### In Scope
- Preview copy rules
- Visual badge rules
- Warning panel rules
- Empty state rules
- False-flag display rules
- Action label restrictions
- Tooltip/help text rules
- Accessibility requirements
- QA checklist for future UI hardening

### Out of Scope
- Runtime implementation
- UI code changes
- Backend/API
- Persistence
- Audit write
- Route/navigation changes
- Export/notification
- Official evidence creation
- Assignment
- Approval
- Scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

### MC10 — Diagnostic Audit Event Builder
Builds diagnostic audit event objects with safe metadata only. No write, no persist.

### MC12 — No-Op Diagnostic Preview Wiring
Builds no-op preview result objects containing:
- Event metadata (eventName, poolType, roleCategory, workflowContext, previous/next states)
- Safe reason code (if present)
- Explicit false flags: `persisted: false`, `written: false`, `exported: false`, `notified: false`, `officialEvidence: false`
- Explicit true flags: `diagnosticOnly: true`, `discardedAfterPreview: true`
- Message: Human-readable summary

### MC13 — Diagnostic Preview UI Display
Displays the MC12 preview result in `CandidateSelectionReviewShell.tsx`:
- Panel shows all safe metadata
- Panel shows all false flags
- "Clear Preview" button clears preview from local React state
- Empty state when no preview exists
- No write, no persist, no export, no notify, no official evidence

## 4. Required Preview Labels

Future UI hardening must include labels that clearly communicate diagnostic-only nature:

- **"Diagnostic preview"** — Top-level badge
- **"Not saved"** — Clear persistence statement
- **"Not submitted"** — Clear workflow submission statement
- **"Not official evidence"** — Clear governance statement
- **"Not an approval"** — Clear decision statement
- **"Not an assignment"** — Clear action statement
- **"Not a scholarship decision"** — Clear outcome statement
- **"Local UI signal only"** — Clear scope statement

## 5. Forbidden Preview Labels

The following copy must never appear in the preview panel, even if changes are made to the underlying UI:

- "Saved"
- "Submitted"
- "Recorded"
- "Official"
- "Evidence collected"
- "Assigned"
- "Approved"
- "Decision completed"
- "AP-10B approval collected"
- "Authority verified"

## 6. Required False-Flag Visibility

The preview panel must make these safe indicators visible to users:

```
persisted: false          — This preview is not saved to database.
written: false            — No audit log entry was written.
exported: false           — No export was generated.
notified: false           — No notifications were sent.
officialEvidence: false   — This is not official evidence for governance.
diagnosticOnly: true      — This is for diagnostic/testing only.
discardedAfterPreview: true — This will be discarded when preview is cleared.
```

**Clarification:** These are safety indicators, not user action statuses. They confirm the preview is NOT persisted, NOT official, and NOT part of the workflow.

## 7. Empty State Requirements

When no preview exists, the UI should display:

**"No diagnostic preview has been generated. Review actions remain local UI signals only."**

Empty state must not imply:
- Waiting for save
- Incomplete submission
- Missing approval
- Failed audit write
- Pending official evidence

## 8. Action Copy Boundary

### Allowed Future Action Labels
- "Shortlist"
- "Skip"
- "Needs more context"
- "Reject for assignment"
- "Select for review"
- "Clear local review state"

### Forbidden Action Labels
- "Assign"
- "Approve"
- "Submit decision"
- "Save audit"
- "Record evidence"
- "Confirm scholarship"
- "Collect approval"
- "Verify authority"

## 9. Accessibility Requirements

Future UX hardening must ensure:

- **Screen reader visibility:** Warning text and diagnostic labels are announced by screen readers
- **Color not alone:** False flags and warnings are not communicated by color only
- **Text visibility:** All diagnostic indicators include text, not just icons/badges
- **ARIA labels:** Preview state changes have `aria-live="polite"` or `aria-label` where applicable
- **Readonly state:** Disabled/readonly states use `aria-disabled="true"` where applicable
- **User understanding:** Preview state changes are understandable without relying solely on visual color changes

## 10. QA Checklist

Future QA must verify:

- [ ] Docs-only scope: no `src/` changes
- [ ] No script changes: `scripts/check-audit-events.mjs` unchanged
- [ ] Required labels documented and present
- [ ] Forbidden labels absent
- [ ] False flags visible in preview panel
- [ ] Empty state copy correct
- [ ] Action copy boundary enforced
- [ ] Accessibility requirements tested (screen reader, ARIA)
- [ ] AP-10B unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] AP-10C blocked
- [ ] AP-11 blocked
- [ ] Build 40/40
- [ ] Tokens 4/4
- [ ] Audit checks 278/278
- [ ] Route smoke 5×200 OK
- [ ] Dev log clean
- [ ] No PII exposed in preview
- [ ] No persistence introduced
- [ ] No API/backend introduced
- [ ] No audit write introduced
- [ ] No official evidence introduced
- [ ] No assignment enabled
- [ ] No approval enabled
- [ ] No scholarship decision enabled

## 11. Implementation Notes

This plan is documentation-only and does not authorize runtime implementation. Future UX hardening must:

1. Use this plan as the authoritative specification
2. Preserve all MC1–MC13 boundaries
3. Keep the preview local-only (no persistence, no backend)
4. Maintain the false-flag display
5. Enforce copy boundaries
6. Ensure accessibility compliance
7. Use a separate explicitly approved branch for any UI changes
8. Re-run full QA after any implementation

## 12. Recommended Next Steps

1. Review this plan with stakeholders
2. Run MC14 QA checkpoint
3. Merge after review approval
4. Post-merge QA
5. Future UX hardening implementation must come on a separate branch with explicit authorization

---

**Branch:** `architecture/s2ims-candidate-review-audit-preview-ux-hardening-plan-mc14`
**Status:** Planning-only, no implementation
**Date:** 2026-05-17
