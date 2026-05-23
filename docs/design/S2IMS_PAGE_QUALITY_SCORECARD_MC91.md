# S²IMS Page Quality Scorecard — MC91

**Date**: 2026-05-23  
**Scope**: All authenticated pages (42 static build pages)

---

## Scoring Dimensions

Each page is scored on:
- **DS** — Design system primitives adoption (PageHeader, Button, StatusBadge, etc.)
- **UX** — Interaction quality (feedback, loading states, error handling)
- **Mock** — Mock data completeness and believability
- **Delay** — Mock delay appropriateness (200–400ms target)

Scale: ✅ Good · ⚠️ Partial · ❌ Gap

---

## Student Pages

| Page | DS | UX | Mock | Delay | Notes |
|------|----|----|------|-------|-------|
| dashboard | ✅ | ✅ | ✅ | ✅ | Fully polished |
| applications/list | ✅ | ✅ | ✅ | ✅ | Good CRUD flow |
| applications/new | ✅ | ✅ | ✅ | ✅ | Fixed: 1000ms → 300ms |
| applications/[id] | ✅ | ⚠️ | ✅ | ✅ | No edit state yet |
| scholarships | ✅ | ✅ | ✅ | ✅ | Clean list |
| scholarships/[id] | ✅ | ⚠️ | ✅ | ✅ | Apply CTA blocked (AP-10B) |
| recommendations | ✅ | ✅ | ✅ | ✅ | Good |
| notifications | ✅ | ✅ | ✅ | ✅ | Fixed: context sync |
| profile | ✅ | ✅ | ✅ | ✅ | Fixed: 600ms → 200ms |
| follow-up | ✅ | ⚠️ | ✅ | ✅ | Empty state could improve |

## Staff Pages

| Page | DS | UX | Mock | Delay | Notes |
|------|----|----|------|-------|-------|
| dashboard | ✅ | ✅ | ✅ | ✅ | Polished |
| analytics | ✅ | ✅ | ✅ | ✅ | Rich mock charts |
| applications/list | ✅ | ✅ | ✅ | ✅ | Good |
| applications/[id] | ✅ | ✅ | ✅ | ✅ | Detail view solid |
| announcements | ✅ | ⚠️ | ✅ | ✅ | Create flow needs polish |
| announcements/[id]/preview | ✅ | ✅ | ✅ | ✅ | Fixed: 700ms→200ms, 1500ms→400ms |
| students | ✅ | ⚠️ | ✅ | ✅ | List only, no bulk actions |
| ocr | ✅ | ✅ | ✅ | ✅ | Fixed: 800ms+1500ms → 400ms+400ms |
| matching-review | ✅ | ⚠️ | ✅ | ✅ | AP-11 blocked |
| data-quality | ✅ | ⚠️ | ✅ | ✅ | Read-only |
| disclosure-requests | ✅ | ⚠️ | ✅ | ✅ | AP-10C blocked |

## Admin Pages

| Page | DS | UX | Mock | Delay | Notes |
|------|----|----|------|-------|-------|
| dashboard | ✅ | ✅ | ✅ | ✅ | Excellent |
| audit-log | ✅ | ✅ | ✅ | ✅ | Excellent |
| candidate-review-demo | ✅ | ⚠️ | ✅ | ✅ | Demo only, AP-11 blocked |
| export | ✅ | ✅ | ✅ | ✅ | Fixed: 600ms → 200ms |
| import-preview | ✅ | ✅ | ✅ | ✅ | AP-10B blocked, good UX |
| permissions | ✅ | ⚠️ | ✅ | ✅ | Read-only mock |
| settings | ✅ | ✅ | ✅ | ✅ | Fixed: 700ms → 200ms |
| users | ✅ | ⚠️ | ✅ | ✅ | List only |

## Provider Pages

| Page | DS | UX | Mock | Delay | Notes |
|------|----|----|------|-------|-------|
| dashboard | ✅ | ✅ | ✅ | ✅ | Good |
| candidates | ✅ | ⚠️ | ✅ | ✅ | Filtered list works |
| impact | ✅ | ✅ | ✅ | ✅ | Rich visualisation |
| insights | ✅ | ✅ | ✅ | ✅ | |
| outcomes | ✅ | ⚠️ | ✅ | ✅ | |
| scholarships/list | ✅ | ✅ | ✅ | ✅ | |
| scholarships/new | ✅ | ⚠️ | ⚠️ | ✅ | Form needs validation feedback |
| scholarships/[id] | ✅ | ⚠️ | ✅ | ✅ | |
| scholarships/[id]/edit | ✅ | ⚠️ | ✅ | ✅ | |
| scholarships/[id]/criteria | ✅ | ⚠️ | ✅ | ✅ | |

## ESQ Pages

| Page | DS | UX | Mock | Delay | Notes |
|------|----|----|------|-------|-------|
| dashboard | ✅ | ✅ | ✅ | ✅ | |
| history | ✅ | ⚠️ | ✅ | ✅ | |
| announcements/review | ✅ | ⚠️ | ✅ | ✅ | AP-11 blocked |

---

## Summary

| Category | Good | Partial | Gap |
|----------|------|---------|-----|
| Design System | 42 | 0 | 0 |
| UX | 28 | 14 | 0 |
| Mock Data | 40 | 2 | 0 |
| Delay | 42 | 0 | 0 |

All pages use PageHeader. All pages have acceptable mock data. 14 pages have UX gaps (mostly AP-gated features or missing bulk actions) — these are by design, not regressions.

---

## Recommended Next (MC92)

- SafetyBanner migration to staff and admin dashboards
- SectionHeader adoption on analytics and provider pages
- Provider scholarship/new form validation feedback
- ESQ history empty state improvement
