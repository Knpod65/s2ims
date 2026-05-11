# S²IMS Renovation Merge Checklist — Phase 2L

**Phase:** 2L — Prepare PR / Merge Review Package
**Branch:** `audit/architecture-renovation-plan`
**Date:** 2026-05-11

---

## Pre-Merge Checklist

- [ ] Pull latest `main`.
- [ ] Rebase or merge latest `main` into `audit/architecture-renovation-plan`.
- [ ] Resolve conflicts without dropping renovation docs/config.
- [ ] Run `npm install` if `package.json` or lockfile state requires it.
- [ ] Run `npm run build`.
- [ ] Run `npm run check:tokens`.
- [ ] Confirm no unintended package or lockfile changes.
- [ ] Confirm no runtime files changed during merge conflict resolution except intentional conflict fixes.

---

## Smoke Test Routes

Open these routes after the merge/rebase:

- [ ] `/student/dashboard`
- [ ] `/student/recommendations`
- [ ] `/student/applications`
- [ ] `/provider/dashboard`
- [ ] `/provider/scholarships`
- [ ] `/provider/scholarships/sch_001/candidates`
- [ ] `/staff/matching-review`
- [ ] `/admin/export`

---

## Provider Privacy Boundary Check

- [ ] Provider candidate pool shows candidate tokens, not raw student names.
- [ ] Provider candidate pool does not show raw student emails.
- [ ] Provider candidate pool does not show raw student IDs.
- [ ] Provider candidate pool remains aggregate/banded where sensitive context is shown.
- [ ] No new provider route exposes student PII.

---

## Status Display Checks

- [ ] Data freshness badges render correctly.
- [ ] Staff matching review still displays fresh data as `Current` / `ปัจจุบัน`.
- [ ] Shortlist status badges render `declined` as `Not approved` / `ไม่อนุมัติ`.
- [ ] Provider scholarship `ACTIVE` keeps role-aware styling.
- [ ] Provider scholarship `PENDING_REVIEW` keeps amber styling.
- [ ] Provider scholarship `DRAFT` and `CLOSED` remain neutral/muted.
- [ ] Candidate pool `ready` still enables candidate access.
- [ ] Candidate pool `not_available` and `pending_staff_approval` still keep access locked.

---

## Documentation Checks

- [ ] `ARCHITECTURE_RENOVATION_AUDIT.md` reads as current branch context.
- [ ] `RENOVATION_PLAN.md` still matches the project direction.
- [ ] `docs/architecture/NEXT_RENOVATION_STEPS.md` recommends Phase 2L PR/merge review.
- [ ] Phase 2G-2K docs are readable and linked by filename from review docs.
- [ ] `RENOVATION_BRANCH_REVIEW_PHASE_2L.md` summarizes branch scope clearly.
- [ ] `RENOVATION_MERGE_CHECKLIST_PHASE_2L.md` is usable as a PR checklist.

---

## Explicit Non-Regression Checks

- [ ] No auth behavior changed.
- [ ] No route structure changed.
- [ ] No role guard behavior changed.
- [ ] No navigation behavior changed.
- [ ] No disclosure workflow changed.
- [ ] No export behavior changed.
- [ ] No staff approval workflow changed.
- [ ] No backend/API/database code was introduced.

---

## Merge Decision

- [ ] Reviewer accepts documentation additions.
- [ ] Reviewer accepts read-only config foundations.
- [ ] Reviewer accepts token formatting utility/check script.
- [ ] Reviewer accepts low-risk runtime status display migrations.
- [ ] Reviewer agrees to pause higher-risk runtime status migrations until after merge review.

Recommended merge path:

- [ ] Open PR from `audit/architecture-renovation-plan` to `main`.
- [ ] Complete this checklist in the PR description or review comment.
- [ ] Merge only after build, token check, and smoke tests pass.
