# S²IMS Route Verification Standard

**Date**: 2026-05-21  
**Milestone**: MC75  
**Purpose**: Permanent standard for dry route verification in S²IMS and any future Claude-assisted project

---

## IMPORTANT: Framework Detection First

Before running any route verification commands, identify the repo type.

| Check | S²IMS Result | General Rule |
|-------|-------------|--------------|
| Does `artisan` file exist? | ❌ No | If YES → Laravel/PHP |
| Does `composer.json` contain `laravel/framework`? | ❌ No | If YES → Laravel/PHP |
| Does `package.json` contain `next`? | ✅ Yes | If YES → Next.js |
| Does `pages/` or `src/app/` exist? | ✅ Yes (src/app/) | If YES → Next.js App Router |

**S²IMS is a Next.js 14 App Router project. Do NOT run Laravel commands here.**

---

## Part A: S²IMS / Next.js Route Verification

### When to Run

| Trigger | Run Before? | Run After? |
|---------|-------------|------------|
| Any commit to feature branch | ✅ (baseline) | ✅ (confirm unchanged) |
| Before QA checkpoint commit | — | ✅ |
| Before merge to main | ✅ (pre-merge) | ✅ (post-merge) |
| Docs-only commits | Optional | Optional (build is fast) |
| src/* changes | ✅ Required | ✅ Required |

### Validation Commands

```bash
source ~/.nvm/nvm.sh

# 1. Build — compiles all Next.js routes
npm run build
# Expected: ✓ Compiled successfully — 42 routes

# 2. Token formatting check
npm run check:tokens
# Expected: All token formatting checks passed (4/4)

# 3. Audit events check
npm run check:audit-events
# Expected: All audit event checks passed: 502/502
```

### Expected Baseline (S²IMS post-MC74)

| Check | Expected |
|-------|----------|
| `npm run build` | ✓ Compiled successfully — 42/42 routes |
| `npm run check:tokens` | All token formatting checks passed (4/4) |
| `npm run check:audit-events` | All audit event checks passed: 502/502 |

### Route Smoke Set (7 key routes)

If a dev server is available (`npm run dev`), verify these routes return 200:

| Route | Role | Expected |
|-------|------|----------|
| `/login` | All | 200 OK |
| `/admin/dashboard` | Admin | 200 OK |
| `/admin/audit-log` | Admin | 200 OK |
| `/admin/candidate-review-demo` | Admin | 200 OK |
| `/admin/master-data/import-preview` | Admin | 200 OK |
| `/staff/applications/app_001` | Staff | 200 OK |
| `/staff/applications/app_002` | Staff | 200 OK |

If no dev server is available: use Next build route output and state:
> "Route smoke was not live-run. Build output confirms 42/42 routes compiled. No smoke failures."

### Route Count Change Handling

| Change | Action |
|--------|--------|
| Count increases (e.g., 42 → 43) | Verify new route is expected; list new page.tsx file |
| Count decreases | Flag as unexpected — investigate immediately |
| Count unchanged | State "Route count unchanged from baseline (42/42)" |

### Scope Check Command

After every commit, run to confirm no src/tools/scripts/package changes slipped in:

```bash
git diff --name-only origin/main...HEAD | grep -v "^docs/\|^\.claude/" || echo "SCOPE CLEAN"
```

For docs-only branches, this must return empty or "SCOPE CLEAN".

### Verification Report Format

```
## Route Verification Report

**Date**: [date]
**Branch**: [branch name]
**Commit**: [hash]
**Framework**: Next.js 14 (Laravel/PHP: NOT APPLICABLE)

### Validation Results
| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| npm run build | 42/42 | [actual] | ✅/❌ |
| npm run check:tokens | 4/4 | [actual] | ✅/❌ |
| npm run check:audit-events | 502/502 | [actual] | ✅/❌ |
| Scope check | SCOPE CLEAN | [actual] | ✅/❌ |

### Route Smoke
[✅ Smoke not run (no dev server) — build confirms 42/42 compiled]
OR
[✅ 7/7 routes returned 200 OK]

### AP Gate Status
- AP-10B: 🔒 BLOCKED
- AP-10C: 🔒 BLOCKED
- AP-11: 🔒 BLOCKED

### Verdict: ✅ VERIFIED / ❌ BLOCKED — [reason if blocked]
```

---

## Part B: Laravel/PHP Route Verification (When Applicable)

**This section applies ONLY when working on a Laravel/PHP project — NOT S²IMS.**

### Framework Detection

```bash
# Check for Laravel
ls artisan 2>/dev/null && echo "Laravel detected" || echo "Not Laravel"
grep -l "laravel/framework" composer.json 2>/dev/null && echo "Laravel composer" || echo "Not found"
```

### Laravel Validation Commands

```bash
# Clear caches first
php artisan config:clear
php artisan cache:clear

# List all routes
php artisan route:list

# Validate composer dependencies
composer validate

# Run tests (if test environment available)
php artisan test
```

### What to Check in Laravel Route List

| Item | How to Check |
|------|-------------|
| Route count | `php artisan route:list | wc -l` |
| Auth middleware | `php artisan route:list | grep -i auth` |
| Role/permission gates | `php artisan route:list | grep -i role\|permission\|gate` |
| Missing controller bindings | Look for errors in route:list output |
| API routes | `php artisan route:list --path=api` |
| Web routes | `php artisan route:list --path=web` |

### Laravel Report Format

```
## Laravel Route Verification Report

### Route List
- Total routes: [N]
- Auth-protected: [N]
- API routes: [N]
- Web routes: [N]

### Composition Check
- composer validate: ✅/❌
- Missing bindings: ✅ None / ⚠️ [list]
- Middleware issues: ✅ None / ⚠️ [list]

### Tests (if run)
- php artisan test: ✅ [N] passed / ❌ [failures]
```

---

## Part C: Token-Saving Rules for Route Verification

| Rule | Reason |
|------|--------|
| Read NEXT_RENOVATION_STEPS.md last 60 lines only | File is 3000+ lines; tail has current MC status |
| Read only 2 most recent daily reports | Historical reports are for reference only |
| Use `grep -n "pattern"` before opening large files | Find exact line numbers; only read relevant section |
| Use `git diff --name-only` not `git diff` | Shows scope without full diffs |
| Run validation before opening docs | Fail fast on build errors |
| State "Laravel not applicable" and skip php artisan | Prevents wasted commands on wrong framework |
| Use build route output instead of dev server smoke when no server | Build always runs; smoke requires startup |

---

## Part D: Verification in Daily Reports and QA Summaries

Every daily report and QA summary must include a validation results table:

```markdown
## Validation Results

| Check | Result |
|-------|--------|
| `npm run build` | ✅ 42/42 routes compiled |
| `npm run check:tokens` | ✅ All passed |
| `npm run check:audit-events` | ✅ 502/502 |
| Scope check | ✅ SCOPE CLEAN |
| Laravel/PHP check | ✅ Not applicable — Next.js repo |
| Route smoke | ✅ Smoke not run (no dev server) — build confirms 42/42 |
```

---

**Document**: MC75 planning — permanent operating standard.  
**Date**: 2026-05-21
