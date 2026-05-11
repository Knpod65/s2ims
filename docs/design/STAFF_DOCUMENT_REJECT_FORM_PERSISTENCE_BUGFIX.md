# Staff Document Reject Form Persistence Bugfix

Date: 2026-05-11
Branch: `bugfix/staff-document-reject-form-persistence`
Phase: Bugfix only. SW-3A runtime was not started.

---

## Root Cause

In `src/components/staff/DocumentVerificationPanel.tsx`, the reject action section was
gated by the condition:

```tsx
{expandedDoc === doc.id && !rejectReason[doc.id] && (
  {/* reject label, textarea, send button */}
)}
```

The `!rejectReason[doc.id]` guard was intended to hide the form after a successful
submission (after `setRejectReason({ ..., [doc.id]: '' })` clears the draft). However,
`rejectReason[doc.id]` is also updated on every keystroke via `onChange`. As soon as the
user typed any character, `rejectReason[doc.id]` became a non-empty string (truthy), making
`!rejectReason[doc.id]` false, which hid the entire section — including the textarea and
submit button — while the user was still composing their reason.

The submission handler's `setExpandedDoc(null)` already collapsed the accordion on
successful submit, making the `!rejectReason[doc.id]` guard redundant even for its
intended purpose.

The replacement flow (`replacementMsg`) did not have this guard and was not affected.

---

## Exact Fix

### Before

```tsx
// state
const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
const [replacementMsg, setReplacementMsg] = useState<Record<string, string>>({})

// render
{onReject && doc.status !== 'rejected' && (
  <>
    {expandedDoc === doc.id && !rejectReason[doc.id] && (
      <>
        <p>Reject Document</p>
        <textarea value={rejectReason[doc.id] || ''} onChange={...} />
        <button disabled={!rejectReason[doc.id]?.trim()} onClick={...}>
          Send Rejection
        </button>
      </>
    )}
  </>
)}
```

### After

```tsx
// state
const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
const [replacementMsg, setReplacementMsg] = useState<Record<string, string>>({})
const [rejectingDocId, setRejectingDocId] = useState<string | null>(null)  // new

// render
{onReject && doc.status !== 'rejected' && (
  <>
    {rejectingDocId === doc.id ? (
      <>
        <p>Reject Document</p>
        <textarea value={rejectReason[doc.id] || ''} onChange={...} />
        <div className="flex gap-2">
          <button onClick={() => { setRejectingDocId(null); setRejectReason({...}) }}>
            Cancel
          </button>
          <button disabled={!rejectReason[doc.id]?.trim()} onClick={...}>
            Send Rejection
          </button>
        </div>
      </>
    ) : (
      <button onClick={() => setRejectingDocId(doc.id)}>
        Reject Document
      </button>
    )}
  </>
)}
```

The `!rejectReason[doc.id]` guard is removed. Visibility of the reject form is now
controlled by `rejectingDocId`, which is only changed by explicit user actions (clicking
the "Reject Document" button or Cancel), not by typing.

---

## Behavior Changes

| Behavior | Before | After |
|----------|--------|-------|
| Reject form visibility while typing | Disappeared on first keystroke | Stays open until Cancel or successful send |
| Opening the reject form | Auto-shown when accordion expanded (for eligible docs) | Requires clicking "Reject Document" button |
| Closing the reject form without submitting | Collapse accordion or submit | Cancel button or collapse accordion |
| Cancel clears draft reason | N/A | Yes — draft reason cleared on Cancel |
| Send Rejection disabled condition | `!rejectReason[doc.id]?.trim()` | Same (unchanged) |
| `onReject(docId, reason)` callback | Called on submit | Same (unchanged) |
| Accordion collapses after successful rejection | Yes | Yes (unchanged) |
| Rejected documents showing stored rejection reason | Yes | Yes (unchanged) |
| Replacement flow | Unaffected | Unaffected (unchanged) |
| Verify flow | Unaffected | Unaffected (unchanged) |

---

## Behavior Preserved

- `onVerify`, `onReject`, `onRequestReplacement` callbacks: unchanged.
- Reason submit disabled if empty/whitespace: unchanged.
- No minimum character length added.
- Document status labels and icons: unchanged.
- Accordion expand/collapse for all documents: unchanged.
- Replacement message flow: unchanged.
- Verify flow: unchanged.
- `AuditWarningCard` remains imported but not rendered (unchanged — deferred to SW-3A).
- Mock data, routes, auth, role guards, backend/API, export, disclosure: unchanged.
- Staff wording, student wording: unchanged.

---

## QA Result

Routes verified:
- `/staff/applications/app_001` — 200 OK
- `/staff/applications/app_002` — 200 OK

Dev server log: no errors, no warnings, no hydration errors, no duplicate key warnings.

Mock data note: `app_001` has all documents in `verified` status — no reject action is
available on that route. The reject flow is testable on `app_002` via document `d7`
(Guardian Income Proof, `status: needs_replacement`), which shows the reject button
because `doc.status !== 'rejected'`.

Logic QA (code trace):
1. Expand `d7` accordion → reject section shows "Reject Document" button (rejectingDocId is null)
2. Click "Reject Document" → `setRejectingDocId('d7')` → form opens (textarea + Cancel + Send)
3. Type text → `rejectReason['d7']` updates → `rejectingDocId` unchanged → form stays open ✓
4. Click Cancel → `setRejectingDocId(null)`, draft cleared → returns to button ✓
5. Type text → click Send → `onReject('d7', reason)` fires → form closed, accordion collapsed ✓

---

## Validation Result

- `npm run build`: PASS — 40 routes, 0 type errors
- `npm run check:tokens`: PASS — 4/4

---

## Explicit Note

SW-3A runtime was **not started** in this branch.

`AuditWarningCard` was **not rendered** in `DocumentVerificationPanel`.

Reason validation minimum length was **not changed**.

`ReasonRequiredModal` was **not introduced**.

This fix is a prerequisite for SW-3A. When SW-3A adds `AuditWarningCard` above the
rejection textarea, the card will remain visible while the user types (because the form now
stays open). Without this fix, the `AuditWarningCard` would have disappeared along with the
reject form as soon as the user started typing.
