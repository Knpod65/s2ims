# S²IMS — Scholarship Intelligence & Management System
**Faculty of Political Science and Public Administration, Chiang Mai University**

> 🎓 Full-stack prototype — Next.js 14 · TypeScript · Tailwind CSS · Dark theme · Bilingual TH/EN

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Mock Login

Go to `/login` — select any role:

| Role | Thai | Access |
|---|---|---|
| **Student** | นักศึกษา | Dashboard, scholarships, applications, profile |
| **Staff** | เจ้าหน้าที่ | Announcements, OCR, application review, analytics |
| **ESQ Head** | หัวหน้า ESQ | Approve/reject announcements before publishing |
| **Provider** | ผู้ให้ทุน | Aggregated insights only — no raw student data |
| **Admin** | ผู้ดูแลระบบ | Users, permissions, audit log, settings |

> No real authentication. Role stored in `localStorage`.

---

## Page Map

| Route | Role | Description |
|---|---|---|
| `/` | Public | Landing page + scholarship preview |
| `/login` | Public | Role selector (mock auth) |
| `/scholarships` | Public | Full scholarship feed |
| `/scholarships/[id]` | Public | Scholarship detail |
| `/student/dashboard` | Student | Dashboard with stats, recommendations, notifications |
| `/student/profile` | Student | Non-invasive profile builder |
| `/student/applications` | Student | Application list |
| `/student/applications/[id]` | Student | Application detail + timeline |
| `/student/notifications` | Student | Notification center |
| `/student/follow-up` | Student | Follow-up report submission |
| `/staff/dashboard` | Staff | Operations overview |
| `/staff/announcements/new` | Staff | Structured announcement editor |
| `/staff/announcements/[id]/preview` | Staff | TH/EN preview before ESQ submission |
| `/staff/ocr` | Staff | OCR upload + field extraction review |
| `/staff/applications` | Staff | Application management table |
| `/staff/applications/[id]` | Staff | Application detail + status update |
| `/staff/students/[id]` | Staff | Student CRM view (PII masked) |
| `/staff/analytics` | Staff | Funnel metrics + charts |
| `/staff/follow-up` | Staff | Follow-up tracking |
| `/esq/dashboard` | ESQ | Pending approvals with SLA countdown |
| `/esq/announcements/[id]/review` | ESQ | Review + approve/reject/revision |
| `/esq/history` | ESQ | Approval history |
| `/provider/dashboard` | Provider | Aggregated scholarship stats |
| `/provider/scholarships/new` | Provider | Create scholarship profile |
| `/provider/insights` | Provider | Aggregate applicant data (PDPA protected) |
| `/provider/outcomes` | Provider | Longitudinal outcome report |
| `/admin/dashboard` | Admin | System overview |
| `/admin/users` | Admin | User management |
| `/admin/permissions` | Admin | Permission matrix |
| `/admin/audit-log` | Admin | Immutable audit log viewer |
| `/admin/export` | Admin | Data export center |
| `/admin/settings` | Admin | System configuration |

---

## Language Toggle

Click **TH / EN** in the top-right corner of any screen.

Switches: navigation labels · page titles · status names · scholarship content · form labels · notification text

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — strict mode
- **Tailwind CSS** — custom dark design tokens
- **Lucide React** — icons
- **Recharts** — analytics charts
- **Google Fonts** — Syne (display) · DM Sans (body) · DM Mono (mono) · Noto Sans Thai

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── student/            # Student pages
│   ├── staff/              # Staff pages
│   ├── esq/                # ESQ approval pages
│   ├── provider/           # Provider portal pages
│   └── admin/              # Admin system pages
├── components/
│   ├── layout/             # AppShell, Sidebar, Topbar, MobileBottomNav
│   ├── ui/                 # StatusBadge, StatCard, PageHeader, EmptyState
│   ├── ScholarshipCard.tsx # Scholarship feed card + MatchScoreRing
│   ├── ApplicationTimeline.tsx
│   └── ProfileCompletionRing.tsx
├── lib/
│   ├── types.ts            # All TypeScript types
│   ├── auth.tsx            # Auth context (mock)
│   ├── i18n.tsx            # Language context (TH/EN)
│   ├── navigation.ts       # Role-based nav config
│   └── utils.ts            # Status maps, formatters, helpers
└── data/mock/              # All mock data (replace with API calls)
    ├── scholarships.ts
    ├── applications.ts
    ├── users.ts
    ├── announcements.ts
    ├── notifications.ts
    └── audit-logs.ts

messages/
├── th.json                 # Thai translations
└── en.json                 # English translations
```

---

## Architecture & Renovation Docs

Current architecture audit and renovation planning:

- [Architecture Renovation Audit](ARCHITECTURE_RENOVATION_AUDIT.md)
- [Renovation Plan](RENOVATION_PLAN.md)
- [Route Map](docs/architecture/ROUTE_MAP.md)
- [Component Inventory](docs/architecture/COMPONENT_INVENTORY.md)
- [Role / Permission Map](docs/architecture/ROLE_PERMISSION_MAP.md)
- [PDPA Data Exposure Map](docs/architecture/PDPA_DATA_EXPOSURE_MAP.md)
- [Data Access Map](docs/architecture/DATA_ACCESS_MAP.md)
- [Next Renovation Steps](docs/architecture/NEXT_RENOVATION_STEPS.md)
- [Config Centralization Phase 2A](docs/architecture/CONFIG_CENTRALIZATION_PHASE_2A.md)
