# TODO — S²IMS Production Roadmap

## Currently MOCK (needs real implementation)

### Authentication
- [ ] Replace `localStorage` role with real JWT + CMU SSO integration
- [ ] Add session expiry and token refresh
- [ ] Real PDPA consent recording on first login
- [ ] Role assignment from real user database

### Data / Backend
- [ ] Replace all `src/data/mock/*.ts` files with real API calls
- [ ] Build PostgreSQL database (schema in PRD)
- [ ] Build API routes (see PRD API endpoint plan)
- [ ] Implement RBAC middleware on every API route
- [ ] Add immutable audit_log writes on every state change

### OCR System
- [ ] Connect Google Cloud Vision API (Thai + English)
- [ ] Build confidence scoring and field mapping logic
- [ ] Store original files in object storage (S3/Supabase Storage)
- [ ] Log OCR confirmations to audit_log

### Matching Engine
- [ ] Implement Layer 1 (hard constraint filter) from DIM_SCHOLARSHIP
- [ ] Implement Layer 2 (weighted scoring formula S_match)
- [ ] Layer 3 (LTR / LambdaMART) — Year 2 after data accumulation
- [ ] SHAP explainability panel (needs real model)

### Announcements
- [ ] PDF generation from structured fields (Puppeteer or pdfmake)
- [ ] Email sending (SendGrid / Resend) with TH/EN templates
- [ ] Real ESQ approval workflow with email notifications

### Notifications
- [ ] Real in-app notification WebSocket or polling
- [ ] Email notification system with TH/EN templates
- [ ] Future: LINE Notify integration

### Analytics
- [ ] Connect charts to real database queries
- [ ] Build data warehouse fact tables
- [ ] Implement funnel tracking as database events
- [ ] Staff workload metrics from audit_log aggregation

### Provider Portal
- [ ] Enforce PDPA: block raw student data before staff approval
- [ ] Real aggregated query with differential privacy
- [ ] Scholarship profile review/approval workflow

### Admin
- [ ] Real user CRUD with role assignment
- [ ] Export as actual file download (CSV/Excel/PDF)
- [ ] System health from real monitoring (uptime, API latency, SLA)

---

## Phase 1 (Months 1–2) — Foundation
- [ ] Set up PostgreSQL with Prisma schema
- [ ] Implement JWT auth + CMU SSO
- [ ] RBAC middleware on all API routes
- [ ] Immutable audit log table + triggers
- [ ] PDPA consent management

## Phase 2 (Months 3–5) — Core Features
- [ ] Scholarship CRUD API
- [ ] Announcement editor → ESQ approval flow → Publish
- [ ] Student application submission + document upload
- [ ] Staff review interface with status updates
- [ ] Email notifications (TH/EN templates)

## Phase 3 (Months 6–8) — Intelligence
- [ ] OCR pipeline (Google Cloud Vision)
- [ ] Layer 1 + Layer 2 matching engine
- [ ] Funnel analytics dashboard (real data)
- [ ] Provider portal (PDPA-enforced aggregated view)

## Phase 4 (Months 9–11) — Research
- [ ] Layer 3 LTR model (needs 1+ year of data)
- [ ] PSM + DiD causal analysis module
- [ ] SHAP explainability per recommendation
- [ ] Data warehouse (fact tables, dim tables)

---

## Design Debt
- [ ] Add loading skeletons (currently shows blank)
- [ ] Add error boundary pages
- [ ] Add 404 and 500 error pages
- [ ] Improve mobile responsiveness on complex tables
- [ ] Accessibility (ARIA labels, keyboard nav, contrast check)
- [ ] Add proper TypeScript strict error fixes
- [ ] Add unit tests for matching logic
- [ ] Add E2E tests (Playwright) for core user journeys
