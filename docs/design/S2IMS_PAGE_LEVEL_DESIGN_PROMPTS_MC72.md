# S²IMS Page-Level Design Prompts — MC72

**Status**: MC72 Design Documentation  
**Date**: 2026-05-21  
**Purpose**: Ready-to-paste Figma AI / Stitch prompts for each S²IMS screen group

---

## MC72 Scope Statement

Docs-only. These prompts are for Figma/Stitch AI design generation only. No runtime code changes. AP-10B/AP-10C/AP-11 remain locked.

---

## How to Use

1. Open Figma → Create a new frame (1440×900px)
2. Open Figma AI or Stitch design tool
3. Paste the relevant prompt below
4. Reference the current screenshot (path noted in each prompt) for visual comparison
5. Apply governance constraints from the "Do NOT include" section of each prompt

---

## Prompt 1: Auth / Login Page

```
Design a login page for S²IMS, a Thai government scholarship management system.

Layout: Centered card (480px wide) on a gray-50 background. Card has 32px padding, white background, 8px border radius, and soft shadow.

Top of card: S²IMS logo placeholder (64×64px circle, blue-500) centered, then "เข้าสู่ระบบ" (Sign In) as an H1 heading (28px, gray-900, font-weight 600), then smaller subtitle "ระบบบริหารจัดการทุนการศึกษา" (14px, gray-500).

Form fields: Email field with label "อีเมล" (Thai, 14px gray-700 font-medium) and sub-label "Email" (12px gray-400). Password field with same bilingual label pattern. Both fields are 40px tall, full width, 1px gray-300 border, 6px border-radius.

Button: Full-width primary button "เข้าสู่ระบบ" (40px tall, blue-500 background, white text, 6px border-radius). Below it, a ghost-style text link "ลืมรหัสผ่าน? / Forgot password?" (14px, blue-600).

Footer: "S²IMS v1.0" in 12px gray-400, centered.

Do NOT include: Social login buttons, guest access option, language toggle, or any registration link.
```

---

## Prompt 2: Admin Dashboard

```
Design an admin dashboard for S²IMS, a Thai scholarship management system. The viewer is an Admin user with system-wide oversight access.

Layout: Left sidebar (240px, white, right-border gray-200) + top header (64px, white, bottom-border gray-200) + main content area (gray-50 background, 24px padding).

Sidebar: S²IMS logo at top (64px height section). Navigation items with icons: Dashboard, ใบสมัคร (Applications), บันทึกตรวจสอบ (Audit Log), นำเข้าข้อมูล (Import), รายงาน (Reports). Active item has red-50 background and red-700 text. Bottom: user avatar + name + role badge "ผู้ดูแลระบบ / Admin" (red-100 background, red-800 text, pill shape).

Header: Breadcrumb "หน้าหลัก" on left. Notification bell icon + user avatar on right.

Main content:
Row 1: Four metric cards side-by-side. Each card: white, 1px gray-200 border, 8px radius, 20px padding. Labels in Thai (gray-500, 12px) above values (36px, gray-900, bold): "ใบสมัครทั้งหมด / Total Applications" (247), "รอตรวจสอบ / Pending Review" (53), "ทุนที่เปิดรับ / Active Scholarships" (18), "ผู้ใช้ที่ลงทะเบียน / Users" (412).

Row 2: Two-column grid. Left (2/3 width): Recent audit events table with 5 rows (timestamp, actor, event type colored badge, description). Right (1/3): System health panel with green/amber status badges.

Row 3: Recent applications table (5 rows, full width) with ID, applicant (partially masked), scholarship, status badge, date, and a ghost "ดูรายละเอียด / View" button per row.

Do NOT include: Real student names, real data, any "import" or "approve" buttons, any dark mode elements.
```

---

## Prompt 3: Admin Audit Log

```
Design an audit log page for a Thai scholarship system admin. The page shows system-wide event history for compliance review.

Layout: Standard sidebar + header (same as dashboard), main content area.

PageHeader below the top nav: Title "บันทึกตรวจสอบ / Audit Log" (H1, 28px gray-900). Right side: a secondary button "ส่งออก / Export" that is visually disabled (opacity 50%, gray border, gray text, cursor-not-allowed). Add a small tooltip label below it reading "AP-10C — ยังไม่เปิดใช้งาน" (12px, gray-500).

FilterBar below page header: Search input (240px), event type dropdown (160px), role dropdown (160px), date range picker (220px). All at 40px height with 1px gray-300 border.

Full-width data table with alternating row backgrounds:
Headers: "เวลา / Time" | "ผู้กระทำ / Actor" | "บทบาท / Role" | "เหตุการณ์ / Event" | "รายละเอียด / Details"
5 data rows with: timestamps, masked actor names (admin_001 etc.), role badge pills (blue for Staff, red for Admin), event type colored badges (info=sky, warning=amber, error=red), truncated detail text.

Pagination bar at bottom: "แสดง 1-20 จาก 1,247 รายการ / Showing 1-20 of 1,247" left, prev/next ghost buttons right.

Do NOT include: Real user names, real event data, active export button, any delete or undo affordances.
```

---

## Prompt 4: Admin Candidate Review Demo

```
Design a candidate review demo screen for a Thai scholarship system. IMPORTANT: This is a preview/demo screen — the approval workflow is NOT active.

Full-width amber safety banner at the very top (above the header): amber-50 background, amber-200 border-bottom, AlertTriangle icon (amber-600), Thai text "หน้าจอตัวอย่างเท่านั้น — ระบบอนุมัติยังไม่เปิดใช้งาน" and English sub-text "Preview only — Approval Workflows (AP-11) not yet enabled". No close button.

Layout: Sidebar + header + main content (same sidebar structure as other admin pages).

PageHeader: "ทบทวนผู้สมัคร — ตัวอย่าง / Candidate Review — Demo" with a purple preview badge.

3-column grid of candidate cards. Each card: white, 1px gray-200 border, 8px radius, 20px padding.
Card content: circular photo placeholder (48px), masked name "นักเรียน #ST-0042" (gray-900, 14px), scholarship name below in blue-600, match score ring (visual circle showing 87%), criteria checklist (3 items, each with checkbox icon).
Card footer: "อนุมัติ / Approve" primary button and "ปฏิเสธ / Reject" danger button — BOTH visually disabled (opacity 50%) with a tooltip icon (?) explaining "AP-11 ยังไม่เปิดใช้งาน".

StatusBadge on card: purple-100 background, "ตัวอย่าง / Preview" label.

Do NOT include: Any active approve or reject interaction, real student photos, real names, any "submit" or "confirm" affordance.
```

---

## Prompt 5: Admin Import Preview

```
Design a master data import preview screen for a Thai scholarship system admin. IMPORTANT: The import action is locked — this is preview-only.

Full-width amber safety banner at top: "หน้าจอตัวอย่างเท่านั้น — การนำเข้าข้อมูลจริงยังไม่เปิดใช้งาน (AP-10B)" with AlertTriangle icon. No close button.

Layout: Sidebar + header. PageHeader: "ตัวอย่างข้อมูลนำเข้า / Import Preview".

Statistics row (4 cards): "แถวทั้งหมด / Total Rows" (1,250), "รายการใหม่ / New Records" (847), "อัปเดต / Updated" (403), "ข้อผิดพลาด / Errors" (0 — green badge).

Full-width preview table (5 columns): ลำดับ/ID, ชื่อ-นามสกุล/Name (masked), รหัสนักเรียน/Student ID, สถานะ/Status (StatusBadge: success/warning/error per row), หมายเหตุ/Note.

Bottom action bar (fixed): Left: "ยกเลิก / Cancel" secondary button (active). Right: "นำเข้าข้อมูล / Import Data" primary button — visually disabled, opacity 50%, with tooltip "การนำเข้าข้อมูลจริงยังไม่เปิดใช้งาน (AP-10B)".

Do NOT include: File upload dropzone, active import button, real student data, progress bar implying import is running.
```

---

## Prompt 6: Staff Dashboard

```
Design a workflow dashboard for a Scholarship Staff user in a Thai scholarship management system. Staff users process applications daily.

Layout: Sidebar (240px, blue accent for active nav items — bg-blue-50, text-blue-700) + header (RoleBadge showing "เจ้าหน้าที่ / Staff" in blue) + main content.

Sidebar navigation: Dashboard, ใบสมัคร (Applications), ข้อมูลเชิงวิเคราะห์ (Analytics), แก้ไข OCR, ติดตามผล (Follow-up). Active = blue highlighted.

Main content:
Row 1: Three metric cards — "รอดำเนินการ / Pending" (warning amber, count 23), "แก้ไข OCR / OCR Fix" (info sky, count 7), "ใกล้หมดเวลา / Due Soon" (error red, count 4).

Row 2 (2-column): Left (2/3): "คิวงาน / Work Queue" — 5 application items with applicant ID (masked), scholarship name, submitted date, status badge (warning/error for urgency), and a primary sm "จัดการ / Process" button per item. Right (1/3): Compact analytics chart placeholder (bar chart outline, 200px height) with label "สมัครรายสัปดาห์ / Weekly Applications".

Row 3: "กิจกรรมล่าสุด / Recent Activity" feed — 5 timestamped items with actor icon, action description, and info badge.

Do NOT include: Notification push, real applicant names, any approval buttons, export buttons.
```

---

## Prompt 7: Staff Applications List

```
Design an applications list page for Scholarship Staff in a Thai system. Staff review and manage all incoming applications here.

Layout: Standard staff sidebar + header. PageHeader: "ใบสมัครทั้งหมด / All Applications" with disabled "ส่งออก / Export" button (gray, AP-10C notice tooltip).

FilterBar: Search box (240px), Status filter dropdown, Scholarship filter, Date range. "ผลลัพธ์: 247 รายการ / Results: 247 items" right-aligned.

Full-width data table:
- Checkbox column (40px)
- ID column (80px): "ใบสมัคร #0042"
- Applicant (160px): partially masked "น. #ST-0042"
- Scholarship (200px): scholarship name, blue-600 link style
- Status (120px): StatusBadge (8 possible statuses using semantic colors)
- Submitted (120px): date in Thai Buddhist Era format
- Actions (100px): "ดู / View" ghost sm button

Row hover: bg-gray-50. Pagination bar: 20 per page.

When rows selected: bulk action bar slides up from bottom with "เปลี่ยนสถานะ / Change Status" primary sm button and row count.

Do NOT include: Bulk delete, real student names, active export, any column for PII like ID card number.
```

---

## Prompt 8: Staff Application Detail

```
Design an application detail page for Scholarship Staff. This is a read+write page where staff update status and add notes.

Layout: Standard staff sidebar + header. PageHeader: "ใบสมัคร #A-2025-0042" with current StatusBadge (warning "อยู่ระหว่างตรวจสอบ / Under Review", md size) and action buttons: "บันทึกสถานะ / Update Status" (primary), "ส่งอีเมล / Email" (secondary), "พิมพ์ / Print" (ghost).

2-column layout (ratio 2:1):
Left column (main): Tab navigation — "ข้อมูลผู้สมัคร / Profile", "เอกสาร / Documents", "คะแนน / Score", "บันทึก / Notes".
Tab 1 (Profile): Form-style display of applicant data. Name: "น. [ชื่อ]" masked. ID: "X-XXXX-XXXXX-XX-X" masked. GPA, major, university shown clearly. 

Right column (1/3): "ประวัติสถานะ / Status History" timeline — vertical list, 5 entries. Each: dot connector, timestamp (12px gray-400), status badge, actor name (masked).

Do NOT include: Real applicant name/ID, social security, financial data, any binding approve/reject button (use "อัปเดตสถานะ / Update Status" instead).
```

---

## Prompt 9: Provider Dashboard

```
Design a dashboard for a scholarship Provider in a Thai system. Providers manage scholarships and view applicant pipelines.

Layout: Sidebar (240px, green accent — bg-green-50, text-green-700 for active) + header (RoleBadge "ผู้ให้ทุน / Provider", green) + main content.

Sidebar navigation: Dashboard, ทุนการศึกษา (Scholarships), ผู้สมัคร (Candidates), ผลลัพธ์ (Outcomes).

Main content:
Row 1: Three metric cards — "ทุนที่ดูแล / Managed Scholarships" (8), "ผู้สมัครทั้งหมด / Total Applicants" (134), "รอตรวจสอบ / Pending Review" (warning amber, 21).

Row 2: Scholarship cards grid (2 columns, 2 rows = 4 cards). Each card: scholarship name (16px, gray-900, font-medium), provider logo placeholder (32px circle), status badge (success/warning/neutral), deadline row ("หมดเขต / Deadline: DD/MM/YYYY"), applicant count, and "ดูผู้สมัคร / View Applicants" ghost sm button.

Below grid: "ดูทุนทั้งหมด / View All Scholarships" text link, center-aligned.

Row 3: Recent applications table (5 rows): applicant (masked), scholarship, match score (%), status badge, submitted date.

Do NOT include: Other providers' scholarship data, student financial information, any approval controls.
```

---

## Prompt 10: Student Applications

```
Design a personal application tracking page for a Student in a Thai scholarship system. Students only see their own applications.

Layout: Sidebar (240px, purple accent — bg-purple-50, text-purple-700 active) + header (RoleBadge "นักศึกษา / Student", purple) + main content.

Sidebar: Dashboard, สมัครทุน (Apply), ใบสมัครของฉัน (My Applications), การแจ้งเตือน (Notifications), โปรไฟล์ (Profile).

PageHeader: "ใบสมัครของฉัน / My Applications".

Application cards (1 column, full width, gap-4):
Card 1 (active application): White card, 8px radius, 1px gray-200 border. Header row: scholarship name (font-medium, blue-600) + StatusBadge (warning "อยู่ระหว่างตรวจสอบ / Under Review", md). Progress bar below header (40% filled, blue-500). Key dates row: "ยื่นเมื่อ / Submitted: 15 มี.ค. 2568", "อัปเดต / Updated: 2 พ.ค. 2568". Actions: "ดูรายละเอียด / View Details" primary sm + "ติดต่อเจ้าหน้าที่ / Contact Staff" secondary sm.

Card 2: Similar structure with StatusBadge success "อนุมัติแล้ว / Approved".

Below active cards: Collapsible "ประวัติใบสมัคร / Past Applications" section (2 items, collapsed by default).

Do NOT include: Other students' applications, any approval controls, financial disbursement information.
```

---

## Prompt 11: Public Scholarships Browse

```
Design a public scholarship discovery page for unauthenticated visitors to a Thai scholarship system. No login required.

Layout: Full-width with top navigation bar (no sidebar). Navbar: S²IMS logo left, nav links center (หน้าหลัก, ทุนการศึกษา, เกี่ยวกับ), "เข้าสู่ระบบ / Login" button top-right (secondary sm).

Hero section (full width, blue-50 background, 120px height): Large heading "ค้นหาทุนการศึกษา / Find Scholarships" (36px, gray-900, center), subtitle "ค้นหาทุนที่เหมาะกับคุณ / Discover scholarships suited to you" (16px gray-500), search bar (480px, 48px tall, with search icon, "ค้นหา..." placeholder).

Filter row below hero: 4 filter dropdowns — สาขาวิชา/Field, ระดับทุน/Level, สัญชาติ/Nationality, กำหนดส่ง/Deadline. "ล้างตัวกรอง / Clear" text link when active.

Results: "พบ 18 ทุน / Found 18 scholarships" label. 3-column card grid:
Each card: white, 8px radius, shadow-sm, 20px padding. Provider logo (32px circle placeholder), scholarship name (16px, gray-900, font-medium), provider name (14px, gray-500), deadline row (amber StatusBadge if <30 days), amount (14px, gray-700), "ดูรายละเอียด / View" primary sm button.

Do NOT include: Login-gated content, personal recommendations without login, financial aid eligibility scoring without auth.
```

---

## Prompt 12: ESQ Review Queue

```
Design a review dashboard for an ESQ (External Scholarship Qualifier) user in a Thai scholarship system. ESQ users provide pre-qualification recommendations — not binding approvals.

Layout: Sidebar (240px, amber accent — bg-amber-50, text-amber-800 active) + header (RoleBadge "ผู้คัดกรอง / ESQ", amber) + main content.

Sidebar: Dashboard, คิวรีวิว (Review Queue), ประวัติ (History).

Main content:
PageHeader: "คิวรีวิว / Review Queue" + "7 รายการรอดำเนินการ / 7 pending" amber StatusBadge.

Review items list (full width): 
5 review items, each as a card row (white, 1px gray-200, 8px radius, 16px padding, gap-3):
- Masked candidate ID "ผู้สมัคร #ST-XXXX" + scholarship name
- Criteria checklist preview (3 bullet points with check/x icons)
- StatusBadge neutral "รอตรวจสอบ / Pending"
- "เริ่มรีวิว / Start Review" primary sm button

Note area at bottom of page: gray-50 card with italic gray-500 text: "การรีวิวของท่านเป็นคำแนะนำเท่านั้น ไม่ใช่การตัดสินใจขั้นสุดท้าย / Your review is advisory only — not a final decision."

Do NOT include: "อนุมัติ / Approve" or "ปฏิเสธ / Reject" language — use "แนะนำ / Recommend" and "ไม่แนะนำ / Not Recommend" only. No AP-11 workflow affordances.
```

---

## Prompt 13: ESQ Review Form

```
Design a qualification review form for ESQ users in a Thai scholarship system. This is a structured checklist form, not an approval workflow.

Layout: Standard ESQ sidebar + header. PageHeader: "รีวิวคุณสมบัติ / Qualification Review — ผู้สมัคร #ST-0087".

2-column layout:
Left (2/3): Review form with 5 qualification criteria, each as:
- Criterion label (text-sm gray-700 font-medium): e.g. "GPA ≥ 3.00 / Academic performance"
- Radio group: "ผ่าน / Pass" | "ไม่ผ่าน / Fail" | "ต้องการข้อมูลเพิ่ม / Need more info"
- Helper text (text-xs gray-400) with criterion details
Gap between criteria: 20px.
Bottom: "หมายเหตุ / Notes" textarea (4 rows). Then: "ส่งคำแนะนำ / Submit Recommendation" primary + "บันทึกร่าง / Save Draft" secondary.

Right (1/3): Candidate summary card — masked name "ผู้สมัคร #ST-0087", scholarship name, GPA, field of study, document status badge.

Advisory disclaimer at bottom: amber-50 note card, "คำแนะนำของท่านจะถูกส่งให้เจ้าหน้าที่พิจารณาต่อไป / Your recommendation will be reviewed by staff."

Do NOT include: "อนุมัติ" or "ปฏิเสธ" (approve/reject) labels, any AP-11 triggers, real student PII.
```

---

## Prompt 14: Mobile — Staff Application List (Responsive)

```
Design the mobile view (390px wide, iPhone 14 Pro) of the Staff Applications list page for a Thai scholarship system.

Top navigation: Full-width header (64px). Hamburger menu icon left, "ใบสมัคร / Applications" title center, search icon right.

Content:
Search bar: full width, 44px tall (tap-friendly), with "ค้นหา..." placeholder.

Filter chips row (horizontal scroll): "ทั้งหมด / All", "รอดำเนินการ / Pending", "อนุมัติ / Approved", "ปฏิเสธ / Rejected" — pill chips, active=blue-500 fill.

Application cards (full width, stacked, gap-12px):
Each card: white, 1px gray-200, 8px radius, 16px padding.
Row 1: Application ID (12px, gray-500) left + StatusBadge right.
Row 2: Scholarship name (14px, gray-900, font-medium, truncate).
Row 3: "ยื่นเมื่อ / Submitted" date (12px gray-400) left + "ดู / View" ghost sm button right.

Floating action button: bottom-right, blue-500 circle 56px, "+" icon (for new application initiation — Staff context).

Do NOT include: Full sidebar (use hamburger only), desktop table layout, hover states (touch device).
```

---

## Safety Note for All Prompts

When generating designs from these prompts:
- Use mock/placeholder data only — no real Thai ID numbers, real names, real student data
- Always apply governance constraints (disabled buttons where noted)
- SafetyBanner is mandatory on routes flagged as preview-only
- Follow bilingual conventions: Thai primary, English secondary

---

**Document Status**: MC72 Design Documentation  
**Last Updated**: 2026-05-21
