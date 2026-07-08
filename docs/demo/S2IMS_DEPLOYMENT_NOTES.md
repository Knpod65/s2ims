# S²IMS Prototype Deployment Notes

## Recommended Launch Mode

Deploy as:

Prototype / Staging Preview

Do not deploy as:

Production system

## Recommended Branch

`feature/s2ims-student-matching-ui`

## Recommended Deployment Platform

If using Vercel:

Framework:

Next.js

Install command:

`npm install`

Build command:

`npm run build`

Output:

Next.js default

Branch:

`feature/s2ims-student-matching-ui`

Environment variables:

No production secrets are required for this mock prototype preview.

## After Deployment

Test deployed routes:

- `/`
- `/student/scholarships`
- `/student/work-study`
- `/staff/scholarships`
- `/staff/work-study/approvals`
- `/admin/scholarships`
- `/esq/scholarships`
- `/provider/scholarships`

Test:

- demo access card
- student matching
- work-study confirmed hours
- staff dashboard
- admin dashboard
- ESQ aggregate dashboard
- provider privacy-safe dashboard

## Warning for Stakeholders

This preview uses mock data.

It does not save real applications.

It does not approve scholarships.

It does not process payments.

It does not connect to a production database.

It does not use real personal student data.

## Suggested Demo Link Message

เรียนทีมงาน/ผู้เกี่ยวข้อง

ลิงก์นี้เป็น S²IMS Prototype Preview สำหรับสาธิตแนวทางระบบจับคู่ทุน การติดตามทุนช่วยงาน และ dashboard ตามบทบาทผู้ใช้งาน

Demo URL:

[ใส่ลิงก์]

หมายเหตุ:

- เป็น prototype ใช้ข้อมูล mock เท่านั้น
- ยังไม่ใช่ระบบ production
- ยังไม่มีการอนุมัติทุนหรือบันทึกข้อมูลจริง
- ไม่เชื่อมต่อฐานข้อมูล production
- ไม่ประมวลผลการจ่ายเงินหรือ donation/payment
- หากเปิดแต่ละหน้าแล้วพบ “เข้าสู่โหมดตัวอย่าง” ให้กดเพื่อดูหน้าจอตามบทบาทจำลอง

หน้าที่แนะนำให้ดู:

- นักศึกษา: `/student/scholarships`
- บันทึกชั่วโมงช่วยงาน: `/student/work-study`
- เจ้าหน้าที่ทุน: `/staff/scholarships`
- รับรองชั่วโมงช่วยงาน: `/staff/work-study/approvals`
- ผู้ดูแลระบบ: `/admin/scholarships`
- ผู้บริหาร: `/esq/scholarships`
- ผู้ให้ทุน: `/provider/scholarships`

ขอรับ feedback ในประเด็น:

1. flow การใช้งานเข้าใจง่ายหรือไม่
2. บทบาทผู้ใช้งานครบหรือไม่
3. ข้อมูลที่แสดงเพียงพอหรือไม่
4. มีข้อกังวลด้าน PDPA/สิทธิ์การเข้าถึงหรือไม่
5. สิ่งใดควรพัฒนาต่อก่อนขึ้นระบบจริง
