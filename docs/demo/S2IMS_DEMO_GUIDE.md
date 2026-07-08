# S²IMS Prototype Demo Guide

## 1. ภาพรวมระบบ

S²IMS — Scholarship–Student Intelligent Matching System เป็น prototype สำหรับสาธิตแนวทางระบบจับคู่ทุน ติดตามทุนช่วยงาน และ dashboard ตามบทบาทผู้ใช้งาน

นี่คือ prototype/staging preview ไม่ใช่ production system

Prototype นี้ช่วยสาธิต:

- student scholarship matching
- eligibility explanation
- strict match status logic
- application-intent flow
- TA/work scholarship work-hour logging
- supervisor confirmation
- staff scholarship operations
- admin governance
- ESQ/executive aggregate dashboard
- provider/donor impact dashboard
- privacy and role-based visibility

ข้อความสำคัญสำหรับผู้ชม: ระบบนี้ใช้ข้อมูล mock/demo เท่านั้น ไม่บันทึกใบสมัครจริง ไม่อนุมัติทุนจริง ไม่จ่ายเงิน ไม่เชื่อมต่อฐานข้อมูล production และไม่ใช้ข้อมูลส่วนบุคคลจริงของนักศึกษา

## 2. สิ่งที่ Prototype นี้ทำได้

- นักศึกษาดูทุนที่เหมาะกับตนเองในหน้า `/student/scholarships`
- ระบบแสดงสถานะการจับคู่:
  - แมตช์แล้ว
  - ใกล้แมตช์
  - รอตรวจสอบ
  - ยังไม่เข้าเงื่อนไข
- ระบบแสดงเหตุผลการแมตช์และ checklist เงื่อนไขทุน
- นักศึกษาสามารถกดบันทึกไว้ / เริ่มสมัคร / ไม่เหมาะกับฉัน ในสถานะ mock/local
- นักศึกษาทุนช่วยงานสามารถบันทึกชั่วโมงงานแบบ mock ในหน้า `/student/work-study`
- อาจารย์/เจ้าหน้าที่ผู้ดูแลสามารถเห็นหน้า review ชั่วโมงงานแบบ mock ใน `/staff/work-study/approvals`
- เจ้าหน้าที่ทุนเห็น operations dashboard ใน `/staff/scholarships`
- admin เห็น governance dashboard, policy registry, PDPA visibility, audit log และ data dictionary preview ใน `/admin/scholarships`
- ESQ/executive เห็นข้อมูลภาพรวม aggregate เท่านั้นใน `/esq/scholarships`
- provider/donor เห็น impact dashboard แบบไม่เปิดเผยรายบุคคลใน `/provider/scholarships`

## 3. สิ่งที่ Prototype นี้ยังไม่ใช่

- ยังไม่ใช่ระบบ production
- ยังไม่มีฐานข้อมูลจริง
- ยังไม่มี backend persistence
- ยังไม่ใช่ระบบอนุมัติทุนจริง
- ยังไม่ใช่ระบบจ่ายเงิน
- ยังไม่ใช่ HR attendance
- ยังไม่มี GPS check-in
- ยังไม่มี facial recognition
- ยังไม่มี chat
- ยังไม่มี performance evaluation
- ยังไม่มี AI auto-approval
- ยังไม่มี real import/export production workflow
- ยังไม่ใช้ข้อมูลส่วนบุคคลจริง
- ยังไม่มี real provider donation/payment workflow

## 4. วิธีเข้าใช้งาน Demo Access

เมื่อเปิด route ที่ต้องมี role โดยตรง ระบบจะแสดงการ์ด “เข้าสู่โหมดตัวอย่าง”

ให้กดปุ่ม demo access เพื่อเปิด mock role ของหน้านั้น เช่น นักศึกษา เจ้าหน้าที่ ผู้ดูแลระบบ ผู้บริหาร หรือผู้ให้ทุน

This is not real login. It uses mock/demo data only.

ข้อความที่ควรอธิบายกับผู้ชม:

“โหมดนี้ใช้ข้อมูล mock เท่านั้น และไม่ใช่การเข้าสู่ระบบจริง”

Expected behavior:

- route เปิดโดยตรงได้
- ไม่มี silent auto-login
- demo card แสดงก่อน role UI
- กด demo access แล้ว role UI แสดง
- auth production ไม่ได้ถูกปิดทั้งระบบ

## 5. Demo Routes

| Role | Route | What to show |
|---|---|---|
| Student | `/student/scholarships` | ทุนที่เหมาะกับฉัน, soft deck, match status |
| Student | `/student/work-study` | บันทึกชั่วโมงช่วยงาน, confirmed hours |
| Staff | `/staff/scholarships` | operations dashboard, data quality, match review |
| Supervisor | `/staff/work-study/approvals` | รับรองชั่วโมงช่วยงาน |
| Admin | `/admin/scholarships` | governance, PDPA, policy registry |
| ESQ/Executive | `/esq/scholarships` | aggregate dashboard |
| Provider/Donor | `/provider/scholarships` | impact dashboard |

## 6. Suggested Demo Script

### 6.1 Student Matching Demo

1. Open `/student/scholarships`
2. Click demo access if shown
3. Explain match statuses
4. Show that “แมตช์แล้ว” means all mandatory conditions pass
5. Open detail panel
6. Show eligibility checklist
7. Show match reasons
8. Click “บันทึกไว้”
9. Click “สมัคร / ไปต่อ”
10. Show started/mock application state
11. Click “ไม่เหมาะกับฉัน”
12. Show dismissed/history behavior

Key message: ระบบแนะนำทุน แต่ยังไม่ใช่ผลอนุมัติ

### 6.2 Student Work-Study Demo

1. Open `/student/work-study`
2. Click demo access if shown
3. Show assignment summary
4. Show confirmed hours vs pending/submitted hours
5. Show work log timeline
6. Show add work log behavior if available
7. Explain submitted hours vs actual confirmed hours

Key message: ชั่วโมงสะสมจริงนับเฉพาะรายการที่อาจารย์/เจ้าหน้าที่รับรองแล้ว

### 6.3 Supervisor Approval Demo

1. Open `/staff/work-study/approvals`
2. Click demo access if shown
3. Show assigned students
4. Open submitted work log
5. Show evidence reference
6. Show submitted hours
7. Show actual confirmed hours input
8. Show confirm / return / reject actions

Key message: submitted hours are not confirmed hours until supervisor review.

### 6.4 Staff Operations Demo

1. Open `/staff/scholarships`
2. Click demo access if shown
3. Show scholarship operations overview
4. Explain data quality and match-review concepts
5. Explain that matching/recommendation is not approval
6. Explain staff review remains required conceptually

Key message: เจ้าหน้าที่ใช้ข้อมูลประกอบการตรวจสอบ ไม่ใช่ระบบอนุมัติอัตโนมัติ

### 6.5 Admin Governance Demo

1. Open `/admin/scholarships`
2. Click demo access if shown
3. Show policy registry
4. Show scholarship type normalization preview
5. Show PDPA visibility matrix
6. Show role permission cards
7. Show audit log and import history
8. Show data dictionary / field mapping preview

Key message: หน้านี้เป็น governance preview ยังไม่มี real policy editing หรือ real PDPA toggles

### 6.6 ESQ / Executive Demo

1. Open `/esq/scholarships`
2. Click demo access if shown
3. Show KPI overview
4. Show category distribution and funding source breakdown
5. Show fairness/access monitoring
6. Show data quality status
7. Show policy insight cards

Key message: ข้อมูลภาพรวมเท่านั้น ไม่แสดงรายบุคคล

### 6.7 Provider / Donor Demo

1. Open `/provider/scholarships`
2. Click demo access if shown
3. Show impact summary
4. Show fund usage
5. Show aggregate outcomes
6. Show anonymized impact story
7. Show candidate pool counts only
8. Show privacy notice
9. Show preserved provider portfolio actions

Key message: มุมมองนี้ไม่แสดงข้อมูลรายบุคคล และการพิจารณายังอยู่ภายใต้กระบวนการของคณะ

## 7. Business Rules to Explain

- “แมตช์แล้ว” แสดงเฉพาะเมื่อ `matchStatus === MATCHED`
- `matchScore` ใช้เพื่อแสดงคะแนนหรือเรียงลำดับ ไม่ใช้ตัดสิน matched status
- ถ้า mandatory criterion ขาด pending unclear not verified หรือ failed จะไม่แสดง “แมตช์แล้ว”
- recommendation is not approval
- AI/recommendation suggests only
- staff review remains required conceptually
- work-study confirmed hours count only `CONFIRMED` logs with `actualConfirmedHours`
- provider and ESQ dashboards are aggregate/privacy-safe only

## 8. Feedback Questions

For students:

- สถานะ match เข้าใจง่ายไหม?
- eligibility checklist ชัดไหม?
- ขั้นตอนบันทึกไว้ / สมัคร / ไม่เหมาะกับฉัน ชัดไหม?

For scholarship officers:

- operations dashboard สะท้อนงานที่ต้องตรวจไหม?
- data quality warning เพียงพอไหม?
- match review queue ควรมีข้อมูลอะไรเพิ่ม?
- export/report ต้องการรูปแบบใด?

For supervisors:

- การรับรองชั่วโมงงานชัดไหม?
- หลักฐานที่ต้องดูควรเป็นแบบไหน?
- ควรปรับชั่วโมงจริงอย่างไรให้ตรวจสอบย้อนหลังได้?

For admin:

- policy registry เพียงพอไหม?
- PDPA visibility matrix เข้าใจไหม?
- audit log ควรเก็บเหตุการณ์อะไรเพิ่ม?

For ESQ/executive:

- dashboard ช่วยตัดสินใจเชิงนโยบายไหม?
- KPI ไหนสำคัญที่สุด?
- fairness/access monitoring ควรดูมิติอะไร?

For provider:

- impact dashboard น่าใช้ไหม?
- ข้อมูลภาพรวมเพียงพอไหม?
- อยากเห็นผลลัพธ์ทุนแบบใดโดยไม่ละเมิดข้อมูลส่วนบุคคล?
