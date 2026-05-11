# Staff Document Action Rail SW-2A QA

Date: 2026-05-11
Branch: `design/staff-document-action-rail-runtime`
Commit under review: `a37d7bf` — `feat(design): add staff document action rail shell`

## Routes Reviewed

- `/staff/applications/app_001` — mostly verified document state
- `/staff/applications/app_002` — includes rejected and needs_replacement documents

## Screenshots Captured

Desktop (1440×900):
- `desktop/app-001-action-rail.png` — full page, app_001, mostly verified
- `desktop/app-002-action-rail.png` — full page, app_002, rejected + needs_replacement
- `desktop/action-rail-context.png` — cropped rail from app_002
- `desktop/document-evidence-with-action-rail.png` — viewport crop showing rail in workbench context
- `desktop/audit-awareness-copy.png` — amber audit strip from rail

Mobile 375×812:
- `mobile-375/app-001-mobile-action-rail.png` — full page, mobile
- `mobile-375/app-002-mobile-action-rail.png` — full page, mobile
- `mobile-375/action-rail-mobile.png` — element screenshot of rail card

Thai locale (1440×900):
- `th-locale/app-001-action-rail-th.png` — full page, Thai
- `th-locale/app-002-action-rail-th.png` — full page, Thai

State clips:
- `states/verified-state-action-rail.png` — "All documents verified" state
- `states/rejected-state-action-rail.png` — rail showing rejected + needs_replacement
- `states/needs-replacement-state-action-rail.png` — same rail (app_002 has both in one view)
- `states/prototype-audit-awareness.png` — workbench-level amber awareness strip (SW-1)

Total: 14 screenshots captured.

## Console Review Result

- No runtime crash observed.
- No duplicate React key warnings.
- No unsupported `use(params)` errors.
- No hydration errors.
- No missing chunk errors.
- Dev server output clean: two successful 200 responses logged, no errors.

## Visual QA Result

### Action rail renders correctly

The `DocumentActionRail` component appears inside the evidence section card, above the
`DocumentVerificationPanel` accordion. It shows:

- A header: "Document action status" / "สถานะการดำเนินการเอกสาร"
- Sub-line: "Expand each item in the panel below to take action"
- Quick count chips: verified count (green), awaiting review (role-primary), needs attention (danger)
- Per-document guidance rows: icon + label + action guidance text
- Prototype audit awareness strip at the bottom

### State correctness confirmed

| State | Visual |
|-------|--------|
| app_001 (verified) | "All documents verified" with green checkmark — correct |
| app_002 (rejected + needs_replacement) | Two rows shown: "Rejected — awaiting student re-upload" and "Replacement requested — awaiting student" — correct |
| `invalid_file_type` | Guidance reads "System validation state — not a staff-initiated action" — correct per behavior contract |
| `missing` | Guidance reads "Not yet submitted — no staff action available" — correct |

### Prototype audit awareness

The rail's amber strip reads:
> "Prototype audit awareness — real audit persistence is not yet connected. Document actions should be auditable in production."

This is prototype-safe wording per `STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`. It does not claim persistence, audit logging, or compliance.

### Existing DocumentVerificationPanel controls

Existing accordion expand/collapse, verify/reject/replacement buttons, and reason textareas are
confirmed still present and unmodified. The rail is additive — it does not replace or duplicate
action controls.

### Mobile

Layout remains usable at 375px. The rail card is compact and readable. The full-page
screenshots confirm no overflow or wrapping issues.

### Thai locale

Thai text renders without visible overflow. Rail heading and guidance strings appear in Thai.
No crash or hydration mismatch detected.

### Staff wording

All rail guidance text uses staff-operational language, consistent with
`STAFF_STUDENT_DOCUMENT_WORDING_BOUNDARY.md`:
- `rejected` → "Rejected — awaiting student re-upload" (not student recovery wording)
- `needs_replacement` → "Replacement requested — awaiting student" (not "Replace file")
- `missing` → "Not yet submitted — no staff action available"
- `invalid_file_type` → "System validation state — not a staff-initiated action"

No student-facing recovery wording was imported or used.

### PII

No additional raw student identifiers are exposed by the rail. The rail receives
`DocumentVerificationState[]` which contains only document labels, status keys, and
file metadata — no raw student name, email, phone, or ID.

## Known Issues / Observations

### Dual amber awareness strips

After SW-2A, the staff application detail page has two amber strips:

1. SW-1 workbench-level strip (existing):
   > "Document decisions should include clear review notes. Audit logging is currently represented in the prototype UI only."

2. SW-2A rail strip (new):
   > "Prototype audit awareness — real audit persistence is not yet connected. Document actions should be auditable in production."

**Assessment:** Not a blocking defect. Both strips are informational and prototype-safe.
The two strips have different scopes — the workbench strip is a general page-level notice;
the rail strip is a per-action context notice directly before the document panel.

**Recommendation for SW-3A:** Consider removing or absorbing the rail strip into the
workbench-level strip before adding the per-action `AuditWarningCard`. Having three amber
areas (workbench strip + rail strip + action-level card) would create amber fatigue.
One option: remove the rail strip in SW-3A when the per-action `AuditWarningCard` is added
to rejection and replacement flows inside the panel.

### `rejected` and `needs_replacement` state clips are identical

Because app_002 has both statuses simultaneously, the two state screenshot clips show the
same rail content. This is correct behavior — both documents appear in a single rail view.
No defect.

## Behavior Preserved

- `DocumentVerificationPanel` internals: unchanged.
- `onVerify`, `onReject`, `onRequestReplacement` callbacks: unchanged.
- Reason textarea behavior: unchanged.
- Minimum-length enforcement: unchanged (still absent — per SD-3 planning).
- `AuditWarningCard` inside the panel: still not rendered (deferred to SW-3A).
- Staff document status labels: unchanged.
- Student document wording: unchanged.
- Mock data, routes, auth, role guards, backend/API: unchanged.
- Identity reveal modal: unchanged.
- Staff notes, status update controls: unchanged.

## QA Verdict

**Pass — no blocking defects found.**

The action rail is visible, contextually useful, and does not change any existing behavior.
It correctly surfaces document action status without duplicating or competing with
`DocumentVerificationPanel` controls.

The dual amber strip observation is minor and addressable in SW-3A.

## Recommended Next Step

Branch is ready to push and open PR.

After PR is reviewed and merged, begin:

**SW-3A — Add `AuditWarningCard` to rejection and replacement flows inside `DocumentVerificationPanel`**

Constraints for SW-3A:
- Use prototype-safe copy from `STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`.
- Separate commit from any min-length enforcement change.
- Consider removing the action rail's amber strip in the same SW-3A commit to avoid three
  overlapping amber zones.
- Requires approval before starting.
