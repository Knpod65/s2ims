# S²IMS Page Pattern QA Checklist — MC92

**Date**: 2026-05-23

---

## Admin Dashboard (`/admin/dashboard`)

- [ ] SafetyBanner visible with preview tone (amber/warm border, correct icon)
- [ ] SafetyBanner text correct (TH: "ข้อมูลจำลอง — ไม่ใช่ข้อมูลจริง" / EN: "Mock data — not production")
- [ ] "System Metrics" SectionHeader visible above the 4 StatCards
- [ ] "Quick Reference" SectionHeader visible above the Users by Role / Recent Audit Events cards
- [ ] All 4 StatCards still display (Total Users, Active Sessions, Uptime, Audit Events)
- [ ] "Users by Role" and "Recent Audit Events" cards still display
- [ ] Links ("Manage →", "View all →") still work
- [ ] Language toggle: TH/EN renders correctly for new components
- [ ] Role accent color correct for admin role
- [ ] No layout regression (stats grid still 2-col mobile / 4-col desktop)

## Staff Dashboard (`/staff/dashboard`)

- [ ] SafetyBanner visible with preview tone
- [ ] SafetyBanner text correct (TH/EN)
- [ ] "Priority Actions" SectionHeader visible before the 3 Quick Action Cards
- [ ] "Other Operations" SectionHeader visible before the 3 legacy action cards
- [ ] All 4 StatCards still display (Active Scholarships, Pending Matches, Disclosure Requests, Critical Data Issues)
- [ ] Badge counts on cards still show (match flags, pending disclosures)
- [ ] All 6 link cards still navigate correctly
- [ ] "New Announcement" button in PageHeader still works
- [ ] Language toggle: TH/EN renders correctly for new components
- [ ] No layout regression

## Provider/Scholarships New (`/provider/scholarships/new`)

- [ ] SafetyBanner visible with info tone (blue, informational)
- [ ] SafetyBanner text correct (TH: "ต้องผ่านการตรวจสอบก่อนเผยแพร่" / EN: "Staff review required before publication")
- [ ] PageHeader still shows with roleIndicator dot and subtitle
- [ ] ProviderScholarshipForm renders correctly below SafetyBanner
- [ ] Form validation still works (required fields show error on empty submit)
- [ ] "Save draft" button still works (mock draft saved banner appears)
- [ ] "Submit for staff review" button still works when valid (shows success state)
- [ ] ProviderPrivacyNotice still present inside form
- [ ] Language toggle: TH/EN renders correctly for new components
- [ ] No layout regression

## Regression Checks

- [ ] Login page role colors still correct (MC90 preserved)
- [ ] Notification bell badge reactive (MC91 preserved)
- [ ] AP-10B / AP-10C / AP-11 remain blocked on their respective pages
- [ ] `npm run build` passes 42/42
- [ ] `npm run check:tokens` passes 4/4
- [ ] `npm run check:audit-events` passes 502/502
- [ ] No `fetch(` / `/api/` / `AuditService` / `localStorage` in changed files
- [ ] `package.json` unchanged
