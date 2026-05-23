# S²IMS Full-Stack Architecture Layer Review — MC91

**Date**: 2026-05-23  
**Scope**: All architectural layers — frontend, mock data, service layer, governance

---

## Architecture Overview

S²IMS is a Next.js 14 App Router prototype with zero backend. All data is in-memory mock. Auth is synchronous localStorage mock. No database, no server, no persistence beyond the browser session.

---

## Layer 1: Frontend (Next.js App Router)

**Pattern**: All pages are `'use client'` components inside the `/app` directory. Static rendering works because all pages are auth-gated (unauthenticated renders show `<LoadingScreen />`).

**Routing**: 52 routes, 42 static pages in build. Dynamic routes (`/student/scholarships/[id]`, `/staff/applications/[id]`, etc.) are prerendered with mock data.

**Layout**: `AppShell` wraps all authenticated content. Provider stack (innermost to outermost): `NotificationProvider` → `ToastProvider` → auth guard.

**State management**: No global state store (no Redux, Zustand, etc.). Context used sparingly:
- `AuthContext` — auth + role
- `LangContext` — language toggle
- `ToastContext` — toast notifications
- `NotificationContext` (NEW MC91) — notification read state

**Assessment**: Clean. Providers are lightweight. Context is not overused. No prop drilling issues.

---

## Layer 2: Mock Data

**Location**: `src/data/mock/`

**Coverage**:
- `notifications.ts` — 5 notifications (3 unread, 2 read)
- `users.ts` — mock user accounts per role
- `applications.ts` — mock scholarship applications
- `scholarships.ts` — mock scholarship programs
- `announcements.ts` — mock announcements

**Quality**: Data is realistic, bilingual (th/en), and follows the `Notification` / `Application` / `Scholarship` interfaces from `src/lib/types.ts`.

**Gap**: No mock for provider outcomes or ESQ history entries — pages use empty state fallbacks. Acceptable for prototype stage.

---

## Layer 3: Service / Presenter Layer

**Location**: `src/lib/notifications/`

**Architecture**: Clean separation —
- `services/` — business logic (resolve navigation, check policy)
- `presenters/` — transform service output into UI-ready view models
- `policy/` — authorization rules (role-based access)
- `dtos/` — typed transfer objects
- `index.ts` — barrel exports

**Assessment**: Excellent. The notification service layer is production-ready in terms of separation of concerns. Adding a real API would require only replacing the mock data source, not restructuring the layer.

---

## Layer 4: Auth & PDPA Governance

**Auth**: `src/lib/auth.tsx` — synchronous localStorage mock. Sets `s2ims_role` on login. Reads it on mount. No JWT, no session, no API.

**Role routing**: `ROLE_HOME` in `src/lib/navigation.ts` — deterministic redirect per role.

**AP gates**: Three gates remain permanently blocked in this prototype:
- **AP-10B** — Confirm Import: disabled on import-preview page
- **AP-10C** — Export disclosure requests: disabled
- **AP-11** — Approve/Reject candidates: disabled

**Audit log**: `AuditService` exists but writes only to in-memory `PrototypeAuditRepository`. No persistence. Passes 502/502 checks.

**PDPA**: No real personal data is stored. All data is mock. No API calls to external services. No localStorage except `s2ims_role` (role selection, not PII).

**Assessment**: Governance-safe for prototype stage. AP gates correctly block production-sensitive actions.

---

## Layer 5: Design System

**Tokens**: `src/config/theme.ts` — `softCivicColors`, `softCivicRoles`, semantic tokens.

**CSS variables**: `src/app/globals.css` — `[data-role="..."]` selectors cascade role colors via CSS custom properties.

**Primitives** (from MC87):
- `Button`, `StatusBadge`, `PageHeader`, `SectionHeader`
- `SafetyBanner`, `PrototypeNotice`, `GovTag`, `DisabledActionCard`
- `RoleBadge`, `BlockedFeatureCard`

**Adoption**: PageHeader 100%. SafetyBanner login-only. Others partial. Full adoption roadmap in `S2IMS_100_PERCENT_MOCK_READY_ROADMAP_MC91.md`.

---

## Summary Assessment

| Layer | Quality | Action Required |
|-------|---------|----------------|
| Frontend (routing/layout) | Excellent | None |
| Mock data | Good | Expand provider/ESQ mock in future MC |
| Service/presenter layer | Excellent | None |
| Auth/PDPA governance | Good | None (prototype-appropriate) |
| Design system | Good | SafetyBanner/SectionHeader adoption (MC92+) |
