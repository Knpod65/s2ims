# S2IMS Audit Log Evidence Boundary Copy Guide MC94

**Date**: 2026-05-21  
**Purpose**: Keep `/admin/audit-log` copy governance-safe while the app remains mock/prototype only.

## Approved Copy

Use these phrases:

- Mock audit log
- Read-only prototype surface
- Not official evidence
- No audit events are written from this screen
- Export is blocked until AP-10C governance approval
- Real persistence not connected
- Mock/demo records
- Diagnostic records

Thai-ready equivalents should communicate the same boundary:

- Audit log แบบเดโมเท่านั้น
- พื้นผิวต้นแบบแบบอ่านอย่างเดียว
- ไม่ใช่หลักฐานอย่างเป็นทางการ
- ไม่มีการเขียน audit event จากหน้านี้
- การส่งออกถูกบล็อกจนกว่า AP-10C จะได้รับอนุมัติ
- ยังไม่ได้เชื่อมต่อ real persistence

## Forbidden Copy

Avoid these phrases until a future approved production milestone:

- Official audit record
- Verified evidence
- Official evidence created
- Production export
- Compliance evidence created
- Approved audit trail
- Export completed
- Saved to audit log
- Persisted audit evidence

## Governance Wording Rules

- Always describe the page as mock/prototype while real persistence is disconnected.
- Always keep export tied to AP-10C when an export control is visible.
- Never imply the table creates, verifies, signs, approves, or preserves official evidence.
- Use "read-only inspection" for the detail drawer.
- Keep "approval" and "sign-off" language out of audit-log copy unless discussing a blocked AP gate.

## Future Production Caveat

A future production audit-log milestone would need a separate governance approval package, backend persistence design, export allowlist, audit-write verification, PDPA review, and AP-10C approval. MC94 does not start that work.
