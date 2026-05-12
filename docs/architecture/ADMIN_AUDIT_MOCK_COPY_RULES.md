# Admin Audit Mock Copy Rules

This document defines the wording allowed when displaying mock audit events in Admin surfaces. It is planning-only.

## Badge Labels

| Persistence Mode | Badge Label | Thai Label |
|------------------|-------------|------------|
| prototype_only | Prototype notice | แจ้งเตือนโปรโตไทป์ |
| mock_only | Mock event | เหตุการณ์ทดสอบ |
| real_persisted | Official audit record | บันทึกการตรวจสอบอย่างเป็นทางการ |

## Helper Text

| State | English | Thai |
|-------|---------|------|
| Prototype notice | "Prototype audit awareness only — no record created" | "การตรวจสอบโปรโตไทป์เท่านั้น — ไม่มีการสร้างบันทึก" |
| Mock event | "Demo audit event — not official persistence" | "เหตุการณ์การตรวจสอบเดโม — ไม่ใช่การบันท�กอย่างเป็นทางการ" |
| Official record | "Official audit record — permanently stored" | "บันทึกการตรวจสอบอย่างเป็นทางการ — บันทึกอย่างถาวร" |

## Empty State Copy

| State | English | Thai |
|-------|---------|------|
| No events | "No audit events found" | "ไม่พบเหตุการณ์การตรวจสอบ" |
| Mock-only | "Showing demo audit events — no official records exist yet" | "กำลังแสดงเหตุการณ์การตรวจสอบเดโม — ยังไม่มีบันทึกอย่างเป็นทางการ" |
| Persistence not connected | "Mock mode active — no real audit persistence configured" | "โหมดเดโมใช้งานอยู่ — ยังไม่ได้กำหนดการบันทึกอย่างเป็นทางการ" |
| Mixed state | "Showing mixed demo and official records — see badges for distinction" | "กำลังแสดงบันทึกเดโมและอย่างเป็นทางการผสมกัน — ดูป้ายสีเพื่อแยกแยะ" |
| Filter no results | "No events match the selected filters" | "ไม่มีเหตุการณ์ตรงกับตัวกรองที่เลือก" |
| Metadata blocked | "Some metadata fields are hidden due to privacy rules" | "ฟิลด์ข้อมูลเมตาบางส่วนถูกซ่อนเพราะกฎความเป็นส่วนตัว" |

## Filter Labels

| Filter | English | Thai |
|--------|---------|------|
| Persistence mode | "Persistence" | "การบันทึก" |
| Actor role | "Actor role" | "บทบาทผู้ดำเนินการ" |
| Target type | "Target type" | "ประเภทเป้าหมาย" |
| Severity | "Severity" | "ระดับความสำคัญ" |
| Event type | "Event type" | "ประเภทเหตุการณ์" |
| Mock events | "Mock events" | "เหตุการณ์เดโม" |
| Real persistence | "Real persistence" | "การบันทึกอย่างเป็นทางการ" |

## Detail Drawer Warnings

### Mock Event

"This is a mock audit event for prototype review. It is not an official persisted audit record and cannot be used as compliance evidence."

"นี่คือเหตุการณ์การตรวจสอบแบบเดโมสำหรับการตรวจทานโปรโตไทป์ ไม่ใช่บันทึกการตรวจสอบอย่างเป็นทางการที่บันทึกไว้และไม่สามารถใช้เป็นหลักฐานการปฏิบัติตามได้"

### Prototype Event

"This is a prototype interaction only. No persistent record has been created."

"นี่คือการโต้ตัวเพียงอย่างเดียวของโปรโตไทป์ ไม่มีการสร้างบันทึกถาวร"

### Real Event (for future)

"This record is stored in the official audit log and cannot be edited or deleted."

"บันทึกนี้ถูกเก็บไว้ในบันทึกการตรวจสอบอย่างเป็นทางการและไม่สามารถแก้ไขหรือลบได้"

## Export Copy

### Mock Export Warning

"Demo audit data only - not official persistence"

"ข้อมูลการตรวจสอบเดโมเท่านั้น - ไม่ใช่การบันทึกอย่างเป็นทางการ"

"This export cannot be used as compliance evidence"

"ไฟล์นี้ไม่สามารถใช้เป็นหลักฐานการปฏิบัติตามได้"

### Mixed Export

"This export contains both demo and official records. See the 'persistence' column for distinction."

"ไฟล์นี้มีทั้งบันทึกเดโมและอย่างเป็นทางการ ดูคอลัมน์ 'การบันทึก' เพื่อแยกแยะ"

## Forbidden Words Until Real Persistence Exists

Do not use these words in any Admin audit mock display until real persistence exists:

- logged
- auditable
- official
- permanent
- irreversible
- compliant
- audit record
- audit trail
- backend
- stored permanently
- immutable
- tamper-proof

## Page Header Copy

Current: "Immutable record — cannot be edited or deleted"

For mock mode: "Demo audit events — not official persistence"

"เหตุการณ์การตรวจสอบเดโม — ไม่ใช่การบันทึกอย่างเป็นทางการ"