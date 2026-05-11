# Staff Document Audit Copy Guide

Date: 2026-05-11
Branch: `design/staff-document-audit-awareness-plan`
Status: Planning only. No runtime changes authorized.

---

## Purpose

This guide defines which audit-awareness copy is safe for the prototype, which copy must
not be used until real audit writes exist, and how to phrase governance context without
implying persistence.

All copy in this guide is for staff-facing document action surfaces only. It does not apply
to student-facing surfaces, admin surfaces, or non-document actions.

---

## Prototype vs Production Audit — Key Distinction

| Concept | Prototype (current) | Production (future) |
|---------|---------------------|---------------------|
| What happens when staff reject a document | `onReject(docId, reason)` callback fires; toast shown; no real write | API call persists event to audit store |
| What happens when staff request replacement | Same — callback only, no real write | API call persists event to audit store |
| Audit trail display | Mock `mockAuditEvents` in `staffData.ts` | Real events from backend |
| Safe audit copy | "reviewed", "tracked", "should be auditable" | "logged", "recorded", "cannot be undone" |

The distinction governs every audit-awareness string shown to staff. Until real audit writes
exist, copy must not imply that the action was recorded in a permanent, auditable system.

---

## 1. Approved Prototype-Safe Copy

### Rejection zone (`AuditWarningCard` above reject textarea)

```
EN title:   Reject Document
EN message: Rejection decisions are reviewed. Provide a clear reason for record purposes.

TH title:   ปฏิเสธเอกสาร
TH message: การตัดสินใจปฏิเสธจะถูกตรวจสอบ กรุณาระบุเหตุผลที่ชัดเจนเพื่อการบันทึก
```

Source: `STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md` approved prototype copy.

Why safe:
- "reviewed" — implies human oversight without claiming a technical audit write
- "for record purposes" — implies future-orientation without claiming current persistence
- Does not use "logged", "saved", "recorded", "cannot be undone"

### Replacement zone (`AuditWarningCard` above replacement textarea)

```
EN title:   Request Replacement
EN message: Replacement requests are tracked. Explain what is needed without blame language.

TH title:   ขอส่งแทนเอกสาร
TH message: คำขอส่งแทนจะถูกติดตาม กรุณาอธิบายสิ่งที่ต้องการโดยไม่ใช้ถ้อยคำกล่าวโทษ
```

Why safe:
- "tracked" — contextually implies workflow tracking, not a specific audit write
- Includes the wording guidance from `sensitiveActions.ts` warningCopy directly
- Does not claim irreversibility or persistence

### Workbench-level strip (existing — SW-1, do not change)

```
EN: Document decisions should include clear review notes.
    Audit logging is currently represented in the prototype UI only.

TH: การตัดสินใจเกี่ยวกับเอกสารควรมีหมายเหตุการตรวจสอบที่ชัดเจน
    ขณะนี้ audit logging แสดงเป็นบริบทใน UI ต้นแบบเท่านั้น
```

Why safe:
- Explicitly says audit logging is "prototype UI only"
- Does not claim actual events are written

### Rail-level strip (SW-2A — to be removed in SW-3A runtime)

```
EN: Prototype audit awareness — real audit persistence is not yet connected.
    Document actions should be auditable in production.

TH: บริบท audit ต้นแบบ — การบันทึก audit จริงยังไม่ได้เชื่อมต่อ
    การดำเนินการเอกสารควรสามารถตรวจสอบได้ในระบบจริง
```

Status: Safe copy, but the strip will be removed in SW-3A runtime to avoid triple amber
fatigue. See `STAFF_DOCUMENT_AMBER_STRIP_CONSOLIDATION_PLAN.md`.

---

## 2. Banned Prototype Copy

Never use the following in document rejection or replacement contexts until real audit
writes are implemented:

| Banned phrase | Why banned |
|---------------|-----------|
| "This action is logged in the audit trail" | Claims real audit write |
| "This rejection cannot be undone" | Claims irreversibility without real persistence |
| "Permanently recorded" | Claims real persistence |
| "Saved to audit log" | Claims real persistence |
| "This action is logged and auditable" | `AuditWarningCard.requiresReason` prop copy — implies persistence |
| "This will be recorded" | Claims real write |
| "Compliance complete" | Claims compliance outcome |
| "Audit logged" | Claims real write |

**Critical:** The `requiresReason` prop on `AuditWarningCard` renders the string
"This action is logged and auditable" (EN) and "การกระทำนี้จะถูกบันทึกไว้และตรวจสอบย้อนหลังได้" (TH).
Both of these are banned for document actions in prototype context.

Do not pass `requiresReason={true}` to `AuditWarningCard` in rejection or replacement
zones until real audit writes are implemented.

---

## 3. How to Phrase "Should Be Auditable" Without Saying "Logged"

The goal is to communicate governance expectation without claiming current technical
implementation.

### Approved patterns

| Intent | Safe phrase | Unsafe phrase |
|--------|-------------|---------------|
| Action has governance weight | "reviewed", "tracked", "on record" | "logged", "saved to audit trail" |
| Reason matters | "provide a clear reason for record purposes" | "reason will be saved" |
| Future production behavior | "should be auditable in production" | "is auditable" |
| Current prototype scope | "currently represented in the prototype UI only" | "currently being logged" |
| Encouraging documented reasoning | "include a clear reason" | "your reason is required for compliance" |

### Template structures

For action-level card (prototype):
```
[Action name] decisions are [reviewed / tracked].
[Wording guidance for the specific action].
```

For page-level strip (prototype):
```
[General topic] [should / decisions should].
[Explicit prototype scope statement].
```

### Example expansions

Rejection:
> "Rejection decisions are reviewed. Provide a clear reason for record purposes."

Replacement:
> "Replacement requests are tracked. Explain what is needed without blame language."

General workbench (existing):
> "Document decisions should include clear review notes. Audit logging is currently represented in the prototype UI only."

---

## 4. Distinguishing Prototype Awareness from Real Audit Persistence

### Signals that copy implies real persistence (avoid)

- Uses past tense for the event: "has been logged", "was recorded"
- Uses future certainty without caveat: "will be logged in the audit trail"
- Claims irreversibility: "cannot be undone"
- Claims compliance outcome: "audit trail is complete"
- Present state of recording: "is being logged"

### Signals that copy is prototype-safe (use)

- Uses conditional/expected framing: "should be auditable", "reviewed", "tracked"
- Scopes to prototype: "currently represented in the prototype UI only"
- Future production orientation: "in production", "when real audit is connected"
- Action guidance, not system claim: "provide a clear reason for record purposes"

### Visual signal guide

| Signal | Use case |
|--------|----------|
| `AuditWarningCard` without `requiresReason` | Prototype document actions (rejection, replacement) |
| `AuditWarningCard` with `requiresReason` | Real-audit surfaces (identity reveal, disclosure modals, match override) |
| Inline amber strip in workbench shell | Page-level awareness; always-visible; broad scope |
| Rail-level amber strip | Compact summary in action rail; will be removed in SW-3A |

---

## 5. Production Upgrade Path

When real audit writes are implemented for document rejection and replacement:

1. Change `AuditWarningCard` message to:
   - EN: "This rejection will be recorded in the audit trail. Provide a clear reason."
   - TH: "การปฏิเสธนี้จะถูกบันทึกในประวัติ audit กรุณาระบุเหตุผลที่ชัดเจน"

2. Add `requiresReason={true}` to `AuditWarningCard` once the prop copy is updated
   to production-safe phrasing (remove "logged and auditable" — replace with more precise copy).

3. Remove workbench-level prototype strip or update its copy to reflect real persistence.

4. Update `sensitiveActions.ts` warningCopy for `document_rejection` and
   `document_replacement_request` to match the new production copy.

Do not perform any of these steps until real audit writes are confirmed by backend implementation.

---

## 6. Wording Boundary Reminder

This guide covers **audit awareness copy** — the governance framing shown to staff.

It does not govern:
- Document status labels (e.g., "Rejected", "Needs Replacement") — see `STAFF_STUDENT_DOCUMENT_WORDING_BOUNDARY.md`
- Student-facing recovery copy — separate adapter, do not share
- Admin audit surface copy — different governance scope

Audit awareness copy is staff-operational. It describes what the action means from a
governance and process standpoint, not what the student should do next.
