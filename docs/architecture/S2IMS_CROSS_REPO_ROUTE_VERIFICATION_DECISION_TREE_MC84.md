# S²IMS MC84 — Cross-Repo Route Verification Decision Tree

**Date**: 2026-05-22
**Milestone**: MC84
**Status**: Active standard

---

## Purpose

This decision tree guides Claude in choosing the correct route verification method when starting work in any repository — regardless of framework. Use this at the start of every session before running any verification commands.

---

## Step 1 — Framework Detection

Run these detection checks first. Do not skip.

```bash
# Detect framework type
echo "=== Framework Detection ==="

# Check Next.js
if test -f package.json && grep -q '"next"' package.json; then
  echo "NEXT.JS: DETECTED"
else
  echo "NEXT.JS: NOT DETECTED"
fi

# Check Laravel/PHP
if test -f artisan; then
  echo "ARTISAN: FOUND"
else
  echo "ARTISAN: NOT FOUND"
fi

if test -f composer.json && grep -q '"laravel/framework"' composer.json; then
  echo "LARAVEL FRAMEWORK: FOUND"
else
  echo "LARAVEL FRAMEWORK: NOT FOUND"
fi

# Check for routes
test -f routes/web.php && echo "ROUTES/WEB: FOUND" || echo "ROUTES/WEB: NOT FOUND"
test -f routes/api.php && echo "ROUTES/API: FOUND" || echo "ROUTES/API: NOT FOUND"
```

---

## Step 2 — Decision Matrix

### Route Verification by Project Type

| Project Type | Detection Signals | Verification Commands | Do NOT Run | Route Evidence to Collect |
|---|---|---|---|---|
| **Next.js / React** | `package.json` with `"next"` · `src/app/` directory with `page.tsx` files | `npm run build` · `npm run check:tokens` · `npm run check:audit-events` · route smoke (if dev server available) | `php artisan *` · `composer *` | Build route count · smoke set results |
| **Laravel / PHP** | `artisan` file · `"laravel/framework"` in `composer.json` · `routes/web.php` or `routes/api.php` | `php artisan route:list` · `composer validate` · `php artisan about` | `php artisan migrate` · `php artisan db:seed` · `composer install` (without approval) | Route list output · total count · middleware coverage |
| **Mixed (Next.js frontend + Laravel API backend)** | Both `package.json` with `"next"` AND `artisan` + `composer.json` in separate directories | Both Next.js and Laravel verification sets (see each row) | None — verify both layers | Both build output and route list |
| **Static / Docs-only change** | No src/app changes in diff · only `docs/` or `.claude/` modified | Run build+checks anyway if project has a baseline (S²IMS: 42/42, 502/502) · skip route smoke if no app changes | Skip framework-specific route smoke | Build output confirms baseline unchanged |
| **Plain PHP (non-Laravel)** | `composer.json` present but no `laravel/framework` · custom `index.php` | `composer validate` · inspect `index.php` or router file manually | `php artisan *` (no artisan without Laravel) | Manual route inventory from source |
| **Unknown / Uncertain** | Unclear or conflicting indicators | **Stop — identify framework before running any commands** | All verification commands until type confirmed | N/A — ask before proceeding |

---

## Step 3 — Per-Type Verification Protocol

### A. Next.js / React

```bash
# Required
source ~/.nvm/nvm.sh
npm run build                  # Expect: Compiled successfully — [N] routes
npm run check:tokens           # Expect: All token checks passed
npm run check:audit-events     # Expect: [N]/[N]

# Optional route smoke (if dev server available)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin/dashboard
# ... (see S2IMS_ROUTE_VERIFICATION_STANDARD_MC75.md for full smoke set)
```

**Full standard**: `docs/architecture/S2IMS_ROUTE_VERIFICATION_STANDARD_MC75.md`

---

### B. Laravel / PHP

```bash
# Framework detection (required first)
test -f artisan && echo "Laravel confirmed" || echo "NOT Laravel — stop"

# Route inventory
php artisan route:list
php artisan route:list --path=api

# Validation
composer validate
php artisan about
```

**Full standard**: `docs/architecture/S2IMS_LARAVEL_PHP_ROUTE_VERIFICATION_STANDARD_MC84.md`

---

### C. Mixed (Next.js + Laravel)

Run both A and B verification sets. Document each separately in the report. Note any API contract mismatches between frontend route expectations and backend route definitions.

---

### D. Static / Docs-only

```bash
# Still run baseline if project has validation scripts
npm run build    # Confirm no accidental changes broke the build
npm run check:tokens
npm run check:audit-events

# Scope check (confirm no app files changed)
git diff --name-only HEAD~1..HEAD | grep -v "^docs/" | grep -v "^\.claude/" || echo "SCOPE CLEAN"
```

Route smoke is not required for docs-only changes, but build baseline must still pass.

---

### E. Unknown

Do not run any verification commands. Stop and determine:
1. What language/framework is the repo?
2. What is the expected baseline?
3. Are there existing CI scripts or README instructions?
4. Ask the user before proceeding.

---

## Step 4 — Scope Check (All Project Types)

Always confirm that changed files match the intended scope:

```bash
git diff --name-only HEAD~1..HEAD
```

| Finding | Action |
|---------|--------|
| Only `docs/`, `.claude/` files | Expected for docs-only milestones — confirm build baseline still passes |
| Only `src/app/` files (Next.js) | Expected for Next.js changes — run full Next.js verification |
| Only `app/`, `routes/` (Laravel) | Expected for Laravel changes — run full Laravel verification |
| `package.json` or `composer.json` changed | Flag immediately — get approval before proceeding |
| `src/` + `routes/` both changed | Mixed-layer change — verify both stacks |
| Unexpected file types (`.env`, `.sql`, Excel) | Stop and flag — these must not be committed without explicit approval |

---

## Step 5 — Safety Boundaries (All Project Types)

Regardless of project type, these rules always apply:

| Rule | Detail |
|------|--------|
| No production commands | Never run commands that write to production database or cache |
| No dependency changes | Never run `npm install`, `composer install`, `pip install` without approval |
| No `.env` exposure | Never print, log, or commit `.env` file contents |
| No data writes | Route verification is read-only |
| No destructive operations | No migrate:fresh, no db:wipe, no storage deletion |
| Stop on uncertainty | If scope expands beyond verification, stop and ask |

---

## Quick Reference Card

```
What repo type?
├── package.json with "next"?
│   └── YES → Use Next.js verification (MC75 Part A)
│       └── Also has artisan + laravel/framework?
│           └── YES → Use BOTH verification sets (Mixed)
│           └── NO → Next.js only
├── artisan + laravel/framework in composer.json?
│   └── YES → Use Laravel verification (MC84)
│   └── NO artisan but composer.json present?
│       └── YES → Plain PHP — composer validate + manual inspection
├── Only docs/ changes?
│   └── YES → Run build baseline only; skip route smoke
└── None of the above / unclear?
    └── STOP — identify framework before running any commands
```

---

## Report Template

Use `docs/architecture/S2IMS_ROUTE_VERIFICATION_REPORT_TEMPLATE_MC84.md` for all route verification reports regardless of project type.

---

## S²IMS Applicability

S²IMS is Next.js. Always follows row A (Next.js / React). Laravel commands are never executed in S²IMS.

---

**Document**: MC84 Cross-Repo Route Verification Decision Tree — not a sign-off, not a governance record.
**Date**: 2026-05-22
