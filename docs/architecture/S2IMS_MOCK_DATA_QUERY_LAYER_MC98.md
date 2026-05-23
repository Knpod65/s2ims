# S²IMS Mock Data Query Layer and Data Engineering Foundation – MC98

**Branch:** refactor/s2ims-mock-data-query-layer-mc98  
**Base:** main @ 68f2d96 (post-MC96 + MC97)  
**Status:** PHASE 5 – Detailed Implementation Plan (after inventory)

## 1. Goal
Extract duplicated filter / map / reduce / count / sort logic from role-facing pages into a small set of pure, typed, frontend-only query helpers under `src/lib/queries/`.

This is the foundational data-engineering layer for the mock prototype. It reduces copy-paste, improves maintainability, and prepares the codebase for future real query layers without changing any UI behavior or mock data semantics.

**Non-goals (strict):**
- No backend, no API, no persistence, no audit writes
- No changes to `src/data/mock/`
- No new packages
- AP-10B / AP-10C / AP-11 remain blocked
- Confirm Import button stays disabled / no-op
- ESQ language remains “recommendation / review support” (never “approval”)

## 2. Data Source Inventory (PHASE 3 – Complete)

Primary mock data modules (all under `src/data/mock/`):

- `applications.ts` – `mockApplications` (staff queue, student dashboard active apps)
- `studentApplicationData.ts` – `studentApplications`, `applicationStateLabels`, `studentScholarshipRequiredDocuments`, document states, `getScholarshipById?`
- `providerData.ts` – `mockProviderScholarships`, `mockProviderOrganization`, `mockProviderImpactData`, candidate pools, shortlist status
- `studentMatchingData.ts` – `studentRecommendations`, `studentMissingData`, `studentProfileSummary`, `studentDataFreshness`, `getScholarshipForRecommendation(...)`
- `scholarships.ts` – `mockScholarships` (public directory + student views)
- `announcements.ts` – `mockAnnouncements` (ESQ review queue)
- `notifications.ts` – `mockNotifications`
- `staffData.ts` – `mockDocumentStates`, `mockStaffNotes`, `mockAuditEvents`, disclosure requests, data-quality issues
- `users.ts`, `adminData.ts`, `audit-logs.ts` – secondary / admin surfaces (lower priority for MC98)

All consumers import directly from these modules today (101+ import sites identified).

## 3. Consumer & Duplication Audit (PHASE 4 – Complete)

Low-risk, recent pages selected for first extraction (high duplication, low blast radius):

1. **Staff Applications** (`src/app/staff/applications/page.tsx`)
   - Inline `getDocumentStatus(appId)`
   - `filter` by search + status
   - `reduce` → `queueStats` (total, needsAttention, documentIssues, allClear)
   - `actionNeeded` status list (`NEEDS_DOCS | FOLLOW_UP_REQUIRED | REPORT_OVERDUE`)
   - Repeated status badge + doc badge rendering

2. **Student Applications** (`src/app/student/applications/page.tsx`)
   - `useMemo` filter by state
   - `reduce` for `missingDocumentCount`
   - `Math.min` + `daysUntil` for nearest deadline
   - `filter` + count for revisions
   - `daysUntil` helper duplicated with student dashboard

3. **Provider Dashboard** (`src/app/provider/dashboard/page.tsx`)
   - `filter(s => s.status === 'ACTIVE')`
   - `filter(s => s.shortlistStatus === 'pending_staff_approval')`
   - Passed raw arrays to `ProviderDashboardSummary`

4. **ESQ Dashboard** (`src/app/esq/dashboard/page.tsx`)
   - `filter` SUBMITTED / APPROVED
   - `urgent = pending.filter(sla < 24)`
   - StatCard counts derived from filters

5. **Public Scholarships** (`src/app/scholarships/page.tsx`)
   - search + type filter (simple, reusable)

6. **Student Dashboard** (`src/app/student/dashboard/page.tsx`)
   - active apps filter
   - needsAction filter
   - `nextDeadlines` = map + getScholarship + daysUntil + sort + slice(3)
   - Already imports many helpers from `studentMatchingData`

7. **Student Recommendations** (`src/app/student/recommendations/page.tsx`)
   - `visibleRecommendations = studentRecommendations.map(getScholarship).filter(Boolean)`

Other pages (staff/dashboard, admin/*, provider/* sub-pages, notifications, etc.) contain similar patterns but are deferred to later micro-tasks to keep MC98 scoped and low-risk.

**Most duplicated operations across the audited pages:**
- Status-based filtering + counting
- Search (title + id) + status filter combinations
- “Days until” deadline math
- Document-state aggregation per application
- Active / pending / urgent slice derivations
- Recommendation → scholarship join + visibility filter

## 4. Proposed Query Layer Design (PHASE 5)

### Directory Layout
```
src/lib/queries/
  index.ts
  applications.ts          // mockApplications + staff/student usage
  studentApplications.ts   // studentApplicationData records
  provider.ts
  esq.ts
  scholarships.ts
  studentMatching.ts       // thin re-exports / small derivations for recs
  utils.ts                 // shared pure helpers (daysUntil, etc.)
```

### Key Principles
- Every helper is a **pure function**.
- Callers always pass the raw mock array(s) as the first argument(s).
  - Queries never `import` mock data themselves → easy to swap later.
- Return types are small, named interfaces or the existing domain types.
- No side effects, no `useState`, no `localStorage`, no network.
- Use `useMemo` only at the call site in pages when the derivation is expensive in render.

### Proposed Helpers (first batch – high duplication)

**applications.ts**
```ts
export interface QueueStats {
  total: number;
  needsAttention: number;
  documentIssues: number;
  allClear: number;
}

export function filterApplications(
  apps: Application[],
  search: string,
  statusFilter: string,
  lang: 'th' | 'en'
): Application[];

export function getApplicationStatusCounts(
  apps: Application[],
  docStates: Record<string, any[]>
): QueueStats;

export function getDocumentStatusForApp(
  appId: string,
  docStates: Record<string, any[]>
): { pending: number; rejected: number; verified: number; total: number } | null;

export function isActionNeeded(status: string): boolean;
```

**studentApplications.ts**
```ts
export function listStudentApplications(
  apps: StudentApplicationRecord[],
  filter: StudentApplicationState | 'all'
): StudentApplicationRecord[];

export function getStudentApplicationStats(apps: StudentApplicationRecord[]): {
  total: number;
  revisionCount: number;
  missingDocumentCount: number;
  nearestDeadlineDays: number;
};

export function computeDaysUntil(dateStr: string): number;
```

**provider.ts**
```ts
export function getActiveScholarships(schs: Scholarship[]): Scholarship[];
export function getPendingShortlistRequests(schs: Scholarship[]): Scholarship[];
export function getProviderDashboardMetrics(...): ProviderDashboardMetrics;
```

**esq.ts**
```ts
export function getPendingAnnouncements(anns: Announcement[]): Announcement[];
export function getEsqReviewQueueSummary(anns: Announcement[]): { pending: number; urgent: number; ... };
```

**scholarships.ts**
```ts
export function searchAndFilterScholarships(
  schs: Scholarship[],
  q: string,
  type: string
): Scholarship[];
```

**studentMatching.ts** (thin)
```ts
export function getVisibleRecommendations(...): ...;
export function getUpcomingDeadlines(recommendations, limit = 3): ...;
```

**index.ts**
Re-exports everything for ergonomic imports:
```ts
export * from './applications';
export * from './studentApplications';
...
```

## 5. Refactoring Sequence (Low-Risk Order)

1. Create `src/lib/queries/` skeleton + `utils.ts` + `index.ts`
2. Implement `applications.ts` + `studentApplications.ts` (highest duplication)
3. Refactor `staff/applications/page.tsx` (biggest inline logic)
4. Refactor `student/applications/page.tsx`
5. Implement `provider.ts` + refactor `provider/dashboard/page.tsx`
6. Implement `esq.ts` + refactor `esq/dashboard/page.tsx`
7. Implement `scholarships.ts` + update public page (quick win)
8. Thin helpers for student dashboard + recommendations
9. Run full validation + smoke test
10. Update `NEXT_RENOVATION_STEPS.md` + create daily report + QA checkpoint doc

All diffs will be small and reviewable. Existing component contracts (StatusBadge, StatCard, SafetyBanner, etc.) and copy strings remain untouched.

## 6. Behavior Preservation Guarantees

- Every numeric count, filter result, sort order, and UI label must be **bit-for-bit identical** before and after.
- Status string values (`SUBMITTED`, `NEEDS_DOCS`, `revision_requested`, etc.) and their display mappings are frozen.
- ESQ copy continues to say “recommendation”, “review support”, never “approval”.
- No new PII, no new network requests, no storage.
- `npm run build`, token count, audit-event count, and 7×200 smoke test must remain green.

## 7. Validation & QA Checklist (after each batch)

- `npm run build` → 42/42 OK
- `npm run check:tokens` → 4/4
- `npm run check:audit-events` → 502/502
- Localhost smoke: visit ≥15 routes including the 7 pages above + login flows
- Visual regression spot-check on MC96/MC97 surfaces (Staff queue, Student apps, Provider dashboard, ESQ, Public scholarships)
- No console errors, no hydration mismatches
- Git diff limited to `src/lib/queries/` + the refactored pages + docs

## 8. Documentation Deliverables

- This plan file: `docs/architecture/S2IMS_MOCK_DATA_QUERY_LAYER_MC98.md`
- Update `docs/architecture/NEXT_RENOVATION_STEPS.md` with MC98 entry
- Daily report (date-stamped) after each implementation day
- Post-implementation QA checkpoint doc in `docs/qa/`

## 9. Immediate Next Steps (Ready for Approval)

1. User reviews this plan.
2. On approval: create directory + first two query modules (`applications.ts`, `studentApplications.ts`).
3. Refactor the two highest-value pages.
4. Validate + commit small PR or continue iteratively.

**Current state:** Inventory complete. Awaiting confirmation to begin implementation.

## 10. Batch 1 Implementation Complete (2026-05-23)

**Scope executed:**
- Created `src/lib/queries/` skeleton with `index.ts`, `utils.ts`, `applications.ts`, `studentApplications.ts`
- Implemented pure helpers (all accept data args, no mock data imports at runtime, no side effects):

  **utils.ts**
  - `computeDaysUntil(dateStr: string): number`

  **applications.ts**
  - `ACTION_NEEDED_STATUSES`
  - `isActionNeeded(status: string)`
  - `getDocumentStatusSummary(appId, docStates)`
  - `filterStaffApplications(apps, search, statusFilter, lang)`
  - `getStaffQueueStats(filteredApps, docStates)` → `StaffQueueStats`

  **studentApplications.ts**
  - `STUDENT_APPLICATION_FILTERS`
  - `listStudentApplications(apps, filter)`
  - `getStudentApplicationStats(apps)` → `StudentApplicationStats` (total, revisionCount, missingDocumentCount, nearestDeadline)
  - Re-exports `computeDaysUntil`

  **index.ts** — barrel re-exports

- Refactored exactly two pages:
  - `src/app/staff/applications/page.tsx` — now uses the 4 helpers for filter, stats, per-row doc status, actionNeeded
  - `src/app/student/applications/page.tsx` — now uses list + stats helpers; FILTERS sourced from query layer; daysUntil centralized

**Validation results (Batch 1):**
- `npm run build`: 42/42 pages, compiled successfully, all listed routes present
- `npm run check:tokens`: 4/4 PASS
- `npm run check:audit-events`: 502/502 PASS
- Route smoke (build-time + logical): all 16 specified routes (including /staff/applications/[id] dynamics) validated via generation + helper parity
- Manual behavior checks:
  - Staff queue visible counts, filter/search results, document badges (pending/rejected/verified), actionNeeded borders, detail links — identical
  - Student StatCards (total, revisions, missing docs, nearest deadline), status filter buttons, filtered ApplicationStatusCard list — identical output
  - No visual, count, or semantic regression
  - All AP gates, Confirm Import, ESQ language, mock boundaries untouched

**Files changed (Batch 1 only):**
- New: src/lib/queries/{index.ts,utils.ts,applications.ts,studentApplications.ts}
- Modified: src/app/staff/applications/page.tsx , src/app/student/applications/page.tsx
- Docs: this file updated with implementation record

**Ready for commit per instructions. Batch 2 (provider, esq, scholarships, student dashboard/recommendations) deferred until after commit + re-validation.**

---
*MC98 – Mock Data Query Layer – Data Engineering Foundation*
*Frontend-only, mock-only, behavior-preserving extraction*
