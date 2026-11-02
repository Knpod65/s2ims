# TA Hours Confirm — Apps Script web app

นักศึกษา login ด้วย OTP ทางอีเมล → กด **ยืนยัน** หรือ **รายงาน** ชั่วโมง TA · เจ้าหน้าที่ (ค่าเริ่มต้น `rungtiwa.p@cmu.ac.th`) เห็นสถานะรายคน + อีเมลแจ้งเตือน/แบนเนอร์เมื่อมีรายงาน
ดีไซน์ตาม `DESIGN.md` (Verdant Park Trust)

## โครงข้อมูล (Google Sheet — แต่ละแท็บแคบ ๆ ไม่ปนกัน)
| แท็บ | คอลัมน์ |
|---|---|
| Config | key, value (`staff_emails`, `term`, `otp_*`, `import_*_tab`) |
| Students | student_id, name, email |
| Hours | student_id, round1, round2 |
| Responses | student_id, status, message, at |
| Replies | student_id, reply, at |
| Log | at, actor, action, student_id, detail |

ไม่มีข้อมูลฝังในโค้ด: Sheet ID อยู่ใน Script Properties, อีเมลเจ้าหน้าที่/ภาคเรียนอยู่ในแท็บ Config
(`setup()` เขียนค่าเริ่มต้นลง Config แค่ครั้งแรก — หลังจากนั้นแก้ในชีต)

## ติดตั้ง
1. Project Settings → Script properties → เพิ่ม `SHEET_ID` = id ของชีต `TACheck` (ถ้าสคริปต์ผูกกับชีตอยู่แล้วไม่ต้องใส่)
2. คัดลอก `Code.gs`, `Index.html`, `appsscript.json` ไปที่โปรเจกต์ (หรือ `clasp push` โดยคัดลอก `.clasp.json.example` เป็น `.clasp.json`)
3. ในชีตเดียวกัน วางข้อมูลต้นฉบับไว้ 2 แท็บชั่วคราว: `Sheet1` (ไฟล์ชั่วโมง TA ที่มีหัวคอลัมน์รหัส/ชื่อ/รอบที่ 1/รอบที่ 2) และ `studentnow` (รหัสนักศึกษา + อีเมล) — ชื่อแท็บเปลี่ยนได้ใน Config
4. รัน `setup()` แล้ว `importRoster()` (ดู Logger: รหัสที่ยังไม่มีอีเมล) — รันซ้ำได้ ไม่ซ้ำแถว
5. Deploy → New deployment → Web app (Execute as: me, Access: Anyone) แล้วแจกลิงก์
6. เสร็จแล้วลบแท็บนำเข้าทิ้งได้ (มีข้อมูลส่วนบุคคล)

## ความปลอดภัย
OTP 6 หลักเก็บแบบ hash+salt ใน CacheService (หมดอายุ 10 นาที, ผิดได้ 5 ครั้ง, ขอใหม่ได้ทุก 60 วินาที), session 6 ชม., ตอบเหมือนกันไม่ว่าอีเมลจะอยู่ในระบบหรือไม่, นักศึกษาเห็นเฉพาะข้อมูลของตนเอง, quota MailApp ของบัญชี Google ปกติ ~100 ฉบับ/วัน
