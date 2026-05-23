# S²IMS 100% Mock-Ready Roadmap — MC91

**Date**: 2026-05-23  
**Current state**: ~85% mock-ready across 52 routes  
**Target**: 100% mock-ready prototype for all planned demo scenarios

---

## What "100% Mock-Ready" Means

A page is 100% mock-ready when:
1. All interactive actions provide feedback (no silent no-ops)
2. Mock delays are 200–400ms (feels fast but not instant)
3. Empty states are meaningful and bilingual
4. All design system primitives are adopted correctly
5. AP-gated features clearly show "blocked" state with reason

---

## Current Status by Group

### Auth Pages (2/2 — 100%)
- `/` redirect ✅
- `/login` ✅ (MC88–MC90 polished)

### Student Pages (17/17 — ~90%)

| Page | Status | Gap |
|------|--------|-----|
| dashboard | ✅ 100% | — |
| applications/list | ✅ 100% | — |
| applications/new | ✅ 100% | — |
| applications/[id] | 90% | No inline edit state |
| scholarships | ✅ 100% | — |
| scholarships/[id] | 90% | Apply CTA shows disabled — clear |
| recommendations | ✅ 100% | — |
| notifications | ✅ 100% | MC91: context sync fixed |
| profile | ✅ 100% | — |
| follow-up | 85% | Empty state text could be richer |

### Staff Pages (12/12 — ~88%)

| Page | Status | Gap |
|------|--------|-----|
| dashboard | ✅ 100% | — |
| analytics | ✅ 100% | — |
| applications/list | ✅ 100% | — |
| applications/[id] | ✅ 100% | — |
| announcements | 90% | Announcement create flow polish |
| announcements/preview | ✅ 100% | — |
| students | 85% | No bulk select/action |
| ocr | ✅ 100% | MC91: delays fixed |
| matching-review | 80% | AP-11 blocked — clear state |
| data-quality | 85% | Read-only — some actions silent |
| disclosure-requests | 80% | AP-10C blocked — clear state |

### Admin Pages (8/8 — ~92%)

| Page | Status | Gap |
|------|--------|-----|
| dashboard | ✅ 100% | — |
| audit-log | ✅ 100% | — |
| candidate-review-demo | 85% | AP-11 blocked |
| export | ✅ 100% | — |
| import-preview | ✅ 100% | — |
| permissions | 85% | Toggles work but no save feedback |
| settings | ✅ 100% | — |
| users | 85% | List only, no invite/deactivate |

### Provider Pages (10/10 — ~82%)

| Page | Status | Gap |
|------|--------|-----|
| dashboard | ✅ 100% | — |
| candidates | 88% | Filter UX could improve |
| impact | ✅ 100% | — |
| insights | ✅ 100% | — |
| outcomes | 85% | Needs richer mock data |
| scholarships/list | ✅ 100% | — |
| scholarships/new | 75% | Form validation feedback missing |
| scholarships/[id] | 85% | — |
| scholarships/[id]/edit | 80% | No save feedback |
| scholarships/[id]/criteria | 80% | — |

### ESQ Pages (3/3 — ~83%)

| Page | Status | Gap |
|------|--------|-----|
| dashboard | ✅ 100% | — |
| history | 80% | Empty state could improve |
| announcements/review | 80% | AP-11 blocked |

### Public Pages (2/2 — ~90%)

| Page | Status | Gap |
|------|--------|-----|
| scholarships/list | 90% | Filter by deadline missing |
| scholarships/[id] | 90% | — |

---

## Roadmap to 100%

### MC92 (Next recommended)
- SafetyBanner to staff and admin dashboards
- SectionHeader adoption on analytics and provider pages
- Provider scholarship/new form validation feedback
- Admin permissions save feedback
- ESQ history rich empty state

### MC93
- Provider scholarship edit save feedback
- Staff students bulk select skeleton
- Staff announcements create flow polish
- Admin users invite/deactivate mock

### MC94
- Public scholarships deadline filter
- Provider outcomes richer mock data
- Provider candidates filter UX
- Follow-up page richer empty state
- Full PDPA disclosure banner on all pages

---

## Non-Goals (Prototype Scope)

The following will NOT be implemented in mock:
- Real backend API integration
- Real database persistence
- Real auth (JWT/OAuth)
- AP-10B/AP-10C/AP-11 gate opening
- Email/SMS notification sending
- File upload beyond OCR demo
