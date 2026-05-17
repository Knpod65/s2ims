# S²IMS Candidate Review Demo — Feedback Runtime Branch Rules (MC26)

## Purpose

This document provides structured runtime branch creation rules for S²IMS candidate review demo feedback backlog items. It defines permitted branch types, explicit scope gates, validation requirements, and escalation rules.

Use alongside the master backlog runtime plan (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_BACKLOG_RUNTIME_PLAN_MC26.md`) and the branch proposal template (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_RUNTIME_BRANCH_TEMPLATE_MC26.md`).

---

## Permitted Branch Types Table

| Branch Type | Source Priority | Allowed Paths | Forbidden Paths | Scope Gate |
|------------|----------------|---------------|-----------------|-----------|
| Copy Polish Runtime | P1 | `src/app/admin/candidate-review-demo/page.tsx`, `src/components/assignment/CandidateSelectionReviewShell.tsx` | All nav files, all layout components, all scripts, all other src/* | String literals only; no logic changes |
| Accessibility Polish Runtime | P2 | Same as above + accessibility-specific in `src/components/assignment/` | All nav files, layout components outside assignment/, all scripts | ARIA/role/tabIndex/focus only; no logic changes |
| Demo Layout Polish Runtime | P3 | `src/app/admin/candidate-review-demo/page.tsx`, `src/components/assignment/CandidateSelectionReviewShell.tsx` | All nav files, layout components, candidateReviewDemoData.ts, all scripts | CSS/layout only; no data or logic changes |
| Privacy Wording Fix Runtime | P0 | `src/lib/assignment/candidateReviewDemoData.ts` (copy only), `src/app/admin/candidate-review-demo/page.tsx` (privacy copy only) | All nav files, layout components, all scripts, any structural change | String literals only; isMock/privacyLevel preserved |

---

## Forbidden Branch Types Table

| Branch Type | Status | Reason |
|------------|--------|--------|
| Audit write runtime | Forbidden | Requires AP-10B gate progress + separate approved branch |
| Persistence runtime | Forbidden | Requires separate approved branch |
| Backend / API runtime | Forbidden | Requires separate approved branch |
| Schema / migration | Forbidden | Requires separate approved branch |
| Approval workflow activation | Forbidden | Requires separate approved branch |
| Assignment workflow activation | Forbidden | Requires separate approved branch |
| Navigation exposure of demo route | Forbidden | Requires separate approved branch |
| scripts/* modification | Forbidden | Scripts are protected; changes require separate process |
| package.json modification | Forbidden | Dependency changes require separate process |
| AP-10C activation | Forbidden | Requires AP-10B gate to clear 7/7 |
| AP-11 activation | Forbidden | Requires AP-10C completion |

---

## Scope Gate Details

### Copy Polish Runtime — Full Scope Gate

**Permitted change types:**
- String literal changes to user-facing copy (button labels, banner text, instructional text, status labels displayed to users)
- Changes to JSX text content within the demo page and review shell components

**Explicitly forbidden changes (stop immediately if needed):**
- Adding or removing imports
- Adding or modifying state variables
- Adding or modifying event handlers (other than copy-only rename)
- Adding or modifying API calls
- Adding or modifying audit event calls
- Adding or modifying navigation links
- Any change to `src/lib/navigation.ts`
- Any change to `scripts/check-audit-events.mjs`

**Validation gate:**
- `npm run build` → 41/41 pages, 0 type errors
- `npm run check:tokens` → 4/4
- `npm run check:audit-events` → 353/353 (must not drop)
- Route smoke → 6×200 OK
- Dev log → clean

---

### Accessibility Polish Runtime — Full Scope Gate

**Permitted change types:**
- ARIA `role`, `aria-label`, `aria-describedby`, `aria-live` attributes
- `tabIndex` attributes for keyboard navigation
- Focus management (`autoFocus`, `ref`-based focus, `onKeyDown` for navigation-only keyboard events)
- Color or contrast CSS changes (Tailwind classes only)
- `sr-only` hidden text for screen readers

**Explicitly forbidden changes:**
- New state variables
- New data fetching
- New API calls
- New audit event calls
- Changes to data display logic (which candidates are shown, how scores are calculated)
- Changes to assignment or approval logic
- Any navigation file changes

**Validation gate:**
- Same as Copy Polish Runtime — build 41/41, audit 353/353, routes 6×200 OK

---

### Demo Layout Polish Runtime — Full Scope Gate

**Permitted change types:**
- Tailwind CSS class changes (layout, spacing, visual hierarchy)
- Reordering of JSX elements within the demo page and review shell (no new elements from outside scope)
- Changes to how existing data is presented (not what data is shown)

**Explicitly forbidden changes:**
- New data fields or mock data changes
- Changes to `candidateReviewDemoData.ts`
- New components outside the allowed paths
- Changes to routing or navigation
- Any change to the `isMock` or `privacyLevel` markers in mock data

**Validation gate:**
- Same as Copy Polish Runtime — build 41/41, audit 353/353, routes 6×200 OK

---

### Privacy Wording Fix Runtime — Full Scope Gate

**Permitted change types in `candidateReviewDemoData.ts`:**
- String literals used as display labels (e.g., candidate name display strings, section headers)
- Changes that make mock data markers more clearly identifiable as mock

**Preserved unchanged (must not be touched):**
- `isMock: true` — must remain on all mock candidates
- `privacyLevel: "safe_display"` — must remain on all mock candidates
- `autoAssigned: false` — must remain on all mock candidates
- Mock candidate ID prefix `demo-` — must be preserved
- The number of mock candidates (must remain 4)
- The overall structure of `CombinedCandidatePoolItem` objects

**Permitted change types in `page.tsx`:**
- Privacy warning copy text
- Demo boundary language in the banner

**Explicitly forbidden changes:**
- Any change to data field structure
- Adding or removing mock candidates
- Changing the mock ID format
- Changing `isMock`, `privacyLevel`, or `autoAssigned` values
- Any logic change

**Validation gate:**
- `npm run check:audit-events` → 353/353 (all 12 MC22 navigation safety checks must still pass)
- Build 41/41, routes 6×200 OK

---

## Validation Requirements Summary

All permitted runtime branches must pass the following before merging to main:

| Validation | Required Result |
|-----------|----------------|
| `npm run build` | 41/41 pages, 0 type errors |
| `npm run check:tokens` | 4/4 |
| `npm run check:audit-events` | 353/353 — must not drop |
| Route smoke: `/login` | 200 OK |
| Route smoke: `/admin/audit-log` | 200 OK |
| Route smoke: `/admin/dashboard` | 200 OK |
| Route smoke: `/staff/applications/app_001` | 200 OK |
| Route smoke: `/staff/applications/app_002` | 200 OK |
| Route smoke: `/admin/candidate-review-demo` | 200 OK |
| Dev log | Clean |
| Diff scope | No non-permitted files in diff |

---

## Escalation Rules

Stop branch creation and escalate to the review board (MC25) if:

1. The proposed change cannot be implemented within any of the four permitted scope gates.
2. The proposed change requires touching a forbidden file path.
3. The proposed change would cause audit checks to drop below 353.
4. The proposed change adds a new import to a navigation or layout file.
5. The proposed change requires adding persistence, API calls, or audit event writes to pass.
6. A reviewer requests that the branch be used to collect governance evidence.
7. The branch proposal is missing a non-approval confirmation.

---

## AP-10B Separation Notes

Runtime branch creation is explicitly separated from AP-10B governance:

- Completing a copy polish, accessibility, layout, or privacy wording runtime branch does not satisfy any AP-10B requirement
- No runtime branch constitutes AP-10B approval or owner nomination
- No runtime branch changes the AP-10B gate status
- The AP-10B gate remains: 0/7 owners, 9/9 blockers — regardless of how many permitted runtime branches are created and merged
- AP-10C: Blocked — unchanged
- AP-11: Blocked — unchanged

---

*Rules version: MC26. Last updated: 2026-05-17.*
