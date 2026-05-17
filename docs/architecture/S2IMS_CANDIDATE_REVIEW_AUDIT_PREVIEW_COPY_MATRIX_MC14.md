# S²IMS Candidate Review Audit Preview Copy Matrix MC14

## Purpose

This document specifies the required and forbidden copy strings for the MC13 diagnostic preview UI. Future UX hardening must use these rules as the authoritative specification.

## Copy Categories

### 1. Preview Panel Header Copy

| UI Area | Required Copy (EN) | Required Copy (TH) | Forbidden Copy | Rationale |
|---------|--------------------|--------------------|----------------|-----------|
| Panel title | "Diagnostic Preview" | "ตัวอย่างการวินิจฉัย" | "Results", "Decision", "Evidence" | Must signal diagnostic-only nature |
| Panel subtitle | "Local UI signal only" | "สัญญาณ UI ของเครื่องเท่านั้น" | "Saved", "Recorded", "Official" | Must clarify not persisted |

### 2. Persistence Indicator Copy

| UI Area | Required Copy (EN) | Required Copy (TH) | Forbidden Copy | Rationale |
|---------|--------------------|--------------------|----------------|-----------|
| Saved flag | "Not saved" | "ไม่ได้บันทึก" | "Saved", "Recorded", "Persisted" | Explicit false flag |
| Submitted flag | "Not submitted" | "ไม่ได้ส่ง" | "Submitted", "Sent", "Collected" | Explicit false flag |
| Exported flag | "Not exported" | "ไม่ได้ส่งออก" | "Exported", "Downloaded", "Shared" | Explicit false flag |
| Notified flag | "Not notified" | "ไม่ได้แจ้งเตือน" | "Notified", "Announced", "Broadcast" | Explicit false flag |

### 3. Official Evidence Copy

| UI Area | Required Copy (EN) | Required Copy (TH) | Forbidden Copy | Rationale |
|---------|--------------------|--------------------|----------------|-----------|
| Evidence status | "Not official evidence" | "ไม่ใช่หลักฐานอย่างเป็นทางการ" | "Evidence", "Recorded", "Official" | Explicit false flag |
| Governance claim | "Not an approval" | "ไม่ใช่การอนุมัติ" | "Approved", "Authorized", "Verified" | Explicit false flag |
| Assignment claim | "Not an assignment" | "ไม่ใช่การมอบหมาย" | "Assigned", "Designated", "Chosen" | Explicit false flag |

### 4. Diagnostic Intent Copy

| UI Area | Required Copy (EN) | Required Copy (TH) | Forbidden Copy | Rationale |
|---------|--------------------|--------------------|----------------|-----------|
| Diagnostic mode | "Diagnostic only" | "การวินิจฉัยเท่านั้น" | "Testing", "Prototype", "Real" | Clarify diagnostic scope |
| Discard behavior | "Discarded after preview" | "จะถูกทิ้งหลังจากตัวอย่าง" | "Kept", "Saved", "Retained" | Clarify ephemeral nature |

### 5. Empty State Copy

| Condition | Required Copy (EN) | Required Copy (TH) | Forbidden Copy |
|-----------|--------------------|--------------------|----------------|
| No preview | "No diagnostic preview has been generated. Review actions remain local UI signals only." | "ยังไม่ได้สร้างตัวอย่างการวินิจฉัย การกระทำการตรวจสอบยังคงเป็นสัญญาณ UI ของเครื่องเท่านั้น" | "Waiting for save", "Incomplete submission", "Missing approval" |

### 6. Warning Panel Copy

| Context | Required Copy (EN) | Required Copy (TH) | Forbidden Copy |
|---------|--------------------|--------------------|----------------|
| General warning | "This is a diagnostic preview. It does not save data, create official evidence, assign candidates, or collect approvals." | "นี่คือตัวอย่างการวินิจฉัย ไม่ได้บันทึกข้อมูล สร้างหลักฐานอย่างเป็นทางการ มอบหมายผู้สมัคร หรือเก็บรวบรวมการอนุมัติ" | "This will be saved", "This is official", "This is binding" |

### 7. Action Button Copy

#### Allowed Action Labels

| Action | English | Thai | Purpose |
|--------|---------|------|---------|
| Shortlist | "Shortlist" | "รายชื่อสั้น" | Local review state change |
| Skip | "Skip" | "ข้ามไป" | Local review state change |
| Request more info | "Needs more context" | "ต้องการข้อมูลเพิ่มเติม" | Local review state change |
| Reject from pool | "Reject for assignment" | "ปฏิเสธสำหรับการมอบหมาย" | Local review state change |
| Select for further review | "Select for review" | "เลือกสำหรับตรวจสอบเพิ่มเติม" | Local review state change |
| Clear state | "Clear local review state" | "ล้างสถานะการตรวจสอบของเครื่อง" | Reset local state |

#### Forbidden Action Labels

| Forbidden | English | Thai | Why forbidden |
|-----------|---------|------|---------------|
| Assign | "Assign" | "มอบหมาย" | Creates official assignment |
| Approve | "Approve" | "อนุมัติ" | Creates official approval |
| Submit | "Submit decision" | "ส่งการตัดสินใจ" | Implies workflow submission |
| Save | "Save audit" | "บันทึกการตรวจสอบ" | Implies persistence |
| Record | "Record evidence" | "บันทึกหลักฐาน" | Implies official evidence |
| Confirm | "Confirm scholarship" | "ยืนยันทุน" | Implies decision completion |
| Collect | "Collect approval" | "เก็บรวบรวมการอนุมัติ" | Implies governance action |
| Verify | "Verify authority" | "ตรวจสอบอำนาจ" | Implies authorization |

### 8. Tooltip / Help Text Copy

| Element | Required Copy (EN) | Required Copy (TH) |
|---------|--------------------|--------------------|
| Diagnostic badge | "This preview is generated locally in your browser for diagnostic purposes only and is not saved." | "ตัวอย่างนี้ถูกสร้างขึ้นเฉพาะที่ในเบราว์เซอร์ของคุณเพื่อการวินิจฉัยและไม่ได้บันทึก" |
| False flags section | "These flags confirm that no data was persisted, no audit was written, and no official evidence was created." | "แฟล็กเหล่านี้ยืนยันว่าไม่มีการบันทึกข้อมูล ไม่มีการเขียนการตรวจสอบ และไม่มีการสร้างหลักฐานอย่างเป็นทางการ" |
| Action buttons | "Clicking an action updates only your local review state in this browser tab. No data is sent to the server." | "การคลิกการกระทำจะปรับปรุงเฉพาะสถานะการตรวจสอบของคุณในแท็บเบราว์เซอร์นี้เท่านั้น ไม่มีข้อมูลที่ถูกส่งไปยังเซิร์ฟเวอร์" |
| Clear button | "Removes the preview from your local browser state. No data is deleted from the server." | "ลบตัวอย่างออกจากสถานะเบราว์เซอร์ของคุณเท่านั้น ไม่มีข้อมูลที่ถูกลบออกจากเซิร์ฟเวอร์" |

### 9. Error / Failure Copy

| Scenario | Required Copy (EN) | Required Copy (TH) |
|----------|--------------------|--------------------|
| Preview generation failed | "Could not generate diagnostic preview. This is a local diagnostic tool and does not affect official records." | "ไม่สามารถสร้างตัวอย่างการวินิจฉัยได้ นี่เป็นเครื่องมือวินิจฉัยเฉพาะที่และไม่ส่งผลต่อบันทึกอย่างเป็นทางการ" |
| Browser storage error | "Preview cannot be loaded. Refresh the page to try again. No data was lost from official records." | "ตัวอย่างไม่สามารถโหลดได้ รีเฟรชหน้าเพื่อลองใหม่ ไม่มีข้อมูลที่หายไปจากบันทึกอย่างเป็นทางการ" |

### 10. Thai/English Bilingual Considerations

- All copy must be provided in both Thai and English
- Thai copy should use formal register (ภาษาไทยราชการ) for "official" concepts
- English copy should use clear, non-technical language
- Both versions must convey the same diagnostic-only intent
- Translations must be reviewed by Thai language speakers for accuracy
- Terms like "diagnostic", "local", "not saved" must be consistently translated

---

## Implementation Rules

1. **String Identity:** Use exact strings from this matrix in UI components
2. **No Paraphrasing:** Do not rephrase or simplify copy — use prescribed text
3. **Bilingual Display:** Show both EN and TH versions simultaneously where space permits
4. **Audit Strings:** All copy must pass the audit check script `check-audit-events.mjs`
5. **Forbidden Search:** Grep `src/` for forbidden strings before merge — must return zero results
6. **Required Search:** Grep `src/` for required strings — must return at least one match per string after implementation

---

**Document Version:** MC14 Planning
**Date:** 2026-05-17
**Status:** Documentation-only
