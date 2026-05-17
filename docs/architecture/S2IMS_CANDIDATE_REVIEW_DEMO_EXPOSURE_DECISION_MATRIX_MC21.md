# S²IMS Candidate Review Demo Page Exposure Decision Matrix MC21

## Purpose

This document defines the allowed and forbidden exposure options for the MC20 diagnostic preview demo page at `/admin/candidate-review-demo`. It provides a decision table for future navigation and access decisions. No option documented here is implemented by MC21 — implementation of any non-default option requires a separate explicitly approved branch.

**Current default:** Hidden route (URL-only, no navigation link). This is the recommended current state.

---

## Exposure Decision Table

| Exposure Option | Allowed? | Conditions | Risks | Recommendation |
|-----------------|----------|------------|-------|----------------|
| **Hidden — URL-only, no nav link** | **Yes — current default** | None. Route exists and returns 200 OK. No navigation link from any menu. | Low — only users who know the URL can access. | **Recommended current state.** No change needed. |
| **Admin-only with nav link in admin sidebar** | Conditionally | Requires separate explicitly approved branch. Must add role guard confirming admin session. Must not appear in non-admin UI. | Medium — increases discoverability; risk of demo being mistaken for production feature. | **Defer to future branch.** Do not implement without separate approval. |
| **Development-only guard (env=development)** | Yes | Implement only on development environment. Route must return 404 or redirect in production. Requires separate approved branch. | Low — not accessible in production. | **Safe alternative** to nav exposure. Preferred if demo must be inaccessible in production. |
| **Storybook/component preview** | Yes | Only if Storybook is configured in the project. Renders shell in isolation without a Next.js route. | Low — isolated from production routing. | **Safe alternative.** Does not require a Next.js route. |
| **Role-gated training page (staff/admin)** | Conditionally | Requires separate approved branch. Must be role-gated. Must include full demo banner copy. Must use safe mock data only. | Medium — widens access to demo surface; risk of role confusion. | **Defer to future branch.** Do not implement without separate approval. |
| **Public production exposure** | **No** | **Forbidden.** Must never be accessible to unauthenticated users or exposed in public-facing routes. | **High** — demo surface could be mistaken for real workflow; no real guard exists. | **Never implement.** |

---

## Navigation Exposure Rules

### Current Rule

No navigation link to `/admin/candidate-review-demo` exists in:
- Admin sidebar
- Admin topnav
- Admin dashboard
- Staff sidebar or topnav
- Any breadcrumb
- Any footer or utility nav

This is the correct and required current state.

### Rule for Future Nav Changes

Any addition of a navigation link to the demo route requires ALL of the following:

1. A separate explicitly approved branch
2. A planning document that defines:
   - Which role(s) can see the nav link
   - What label is used (must include "Demo" or "Diagnostic Preview")
   - What copy is displayed inline or adjacent to the link
3. QA validation confirming:
   - Nav link is not visible to non-admin users
   - Nav link is clearly labeled as demo/non-official
   - Demo page still passes all 341 audit checks
   - No regression in any baseline route

### Forbidden Navigation Additions (without separate approval)

| Forbidden Change | Why |
|-----------------|-----|
| Sidebar link without role guard | Exposes demo to all authenticated users |
| Topnav link | High visibility; risk of confusion with production features |
| Dashboard shortcut card | Implies the demo is a primary workflow |
| Staff-facing navigation link | Demo is admin-scoped only in MC20 |
| Breadcrumb from production pages | Implies navigation flow from real workflow |

---

## Access Control Rules

### Current Access State

The demo page has no explicit route guard. It is accessible to any authenticated user who knows the URL. This is acceptable in the current development state because:
- The page uses safe mock data only
- The page contains all required demo banner copy
- No real workflow action is possible
- No data is persisted or exported

### Future Access Control Options

| Control Option | Scope | Requires Approval |
|---------------|-------|-------------------|
| Admin session check (server component) | Redirects non-admin users | Yes — separate branch |
| Environment guard (`process.env.NODE_ENV === 'development'`) | Blocks production access | Yes — separate branch |
| Feature flag guard | Blocks if flag disabled | Yes — separate branch |
| No guard (current default) | Accessible by URL | Current state — no change |

---

## Public Exposure — Explicitly Forbidden

The demo route must never be:
- Linked from public-facing pages
- Indexed by search engines (no `robots.txt` change to allow it)
- Included in sitemaps
- Accessible to unauthenticated users via open redirect or public redirect

**Reason:** Even though the page contains only safe mock data, public exposure creates risk of the demo surface being mistaken for a real workflow interface, and could expose the application's internal workflow structure to unintended audiences.

---

## Route Path Rules

### Current Route Path

`/admin/candidate-review-demo`

### Route Path Change Rules

Any change to the route path requires:
1. A separate explicitly approved branch
2. Update to `scripts/check-audit-events.mjs` file existence checks
3. Update to audit check count (currently 341)
4. Full build + audit + route smoke re-validation

### Forbidden Route Path Changes

| Forbidden Change | Why |
|-----------------|-----|
| Moving to `/staff/candidate-review-demo` | MC20 scope is admin only |
| Moving to a public path (e.g., `/demo`) | Public exposure is forbidden |
| Removing the route entirely | Requires separate scoped decision |
| Duplicating the route (multiple paths) | Each new path requires separate approval |

---

## Summary

| Decision | Current Answer |
|----------|---------------|
| Is the demo route exposed in navigation? | No — URL-only, no nav link |
| Is the demo route accessible to public? | No — must remain non-public |
| Can a nav link be added without approval? | No — requires separate branch |
| Can the route be moved without approval? | No — requires separate branch |
| Is the current default state safe? | Yes — recommended current state |
| Is development-only guarding allowed? | Yes — on a separate approved branch |
| Is Storybook preview allowed? | Yes — if Storybook is available |
| Is public production exposure ever allowed? | No — explicitly forbidden |
