# S²IMS MC84 — Laravel/PHP Route Verification Standard

**Date**: 2026-05-22
**Milestone**: MC84
**Status**: Active standard

---

## Purpose

Define a complete, safe standard for performing dry route verification in Laravel/PHP repositories. This standard is used when Claude is operating in a Laravel/PHP codebase. It is **not executed in S²IMS** because S²IMS is a Next.js/React repository with no Laravel indicators.

For S²IMS and all Next.js repositories: use `docs/architecture/S2IMS_ROUTE_VERIFICATION_STANDARD_MC75.md` (Part A) instead.

---

## When to Use This Standard

Use this standard when ALL of the following are true:

1. An `artisan` file exists in the project root
2. `composer.json` contains `"laravel/framework"` in the `require` block
3. `routes/web.php` or `routes/api.php` exists

If any indicator is missing, do not assume Laravel. Stop and verify before running PHP commands.

---

## When NOT to Use This Standard

| Condition | Action |
|-----------|--------|
| No `artisan` file | Do not run `php artisan *` |
| No `composer.json` | Do not run `composer *` |
| Repo is Next.js/React (has `package.json` with `"next"`) | Use Next.js verification (MC75 Part A) instead |
| Repo type is unknown | Stop and identify framework before running any commands |
| In S²IMS specifically | **Never run Laravel commands** — S²IMS is Next.js only |

---

## Framework Detection Checklist

Run these checks before choosing any verification method:

```bash
# Step 1: Check for artisan
test -f artisan && echo "ARTISAN: FOUND" || echo "ARTISAN: NOT FOUND"

# Step 2: Check for laravel/framework in composer.json
test -f composer.json && grep -q '"laravel/framework"' composer.json \
  && echo "LARAVEL FRAMEWORK: FOUND" \
  || echo "LARAVEL FRAMEWORK: NOT FOUND"

# Step 3: Check for routes
test -f routes/web.php && echo "ROUTES/WEB: FOUND" || echo "ROUTES/WEB: NOT FOUND"
test -f routes/api.php && echo "ROUTES/API: FOUND" || echo "ROUTES/API: NOT FOUND"

# Step 4: Check for Next.js (if found, do NOT run PHP commands)
test -f package.json && grep -q '"next"' package.json \
  && echo "NEXT.JS: FOUND — use npm verification, not PHP" \
  || echo "NEXT.JS: NOT FOUND"
```

**Decision**: Proceed with Laravel verification only if artisan + laravel/framework both confirmed AND no competing Next.js indicator.

---

## Safe Commands (Always Allowed — Read-Only)

These commands are safe to run without special approval. They do not write data, modify config, or affect production.

### Route Inventory

```bash
# Full route list
php artisan route:list

# API routes only
php artisan route:list --path=api

# Structured columns (if supported — Laravel 9+)
php artisan route:list --columns=Method,URI,Name,Action,Middleware

# Route count
php artisan route:list | wc -l

# Filter by middleware
php artisan route:list | grep "auth"
php artisan route:list | grep "api"
php artisan route:list | grep "web"
```

### Project Information

```bash
# Laravel version and environment info (read-only)
php artisan about

# Validate composer.json
composer validate

# Show config (read-only — check for sensitive values before sharing output)
php artisan config:show app
```

---

## Conditional Commands (Only if Test Environment Confirmed)

Run these only if a safe, isolated test environment is explicitly confirmed (not production, not staging without approval):

```bash
# Run test suite (only if test environment is set up and confirmed safe)
php artisan test

# Run specific test file
php artisan test --filter=RouteTest
```

Before running `php artisan test`:
- Confirm `APP_ENV=testing` in `.env.testing` or environment
- Confirm test database is separate from production
- Confirm no data-writing side effects in the test suite

---

## Forbidden Commands (Never Without Explicit Approval)

Do NOT run any of the following unless explicitly authorized in the current task:

| Command | Reason |
|---------|--------|
| `php artisan migrate` | Modifies database schema |
| `php artisan migrate:fresh` | Drops and recreates all tables |
| `php artisan db:seed` | Writes data to database |
| `php artisan cache:clear` | Modifies cache in production |
| `php artisan config:cache` | Modifies cached config |
| `php artisan route:cache` | Modifies cached routes |
| `php artisan view:cache` | Modifies cached views |
| `php artisan optimize` | Multiple side effects |
| `php artisan storage:link` | Creates filesystem symlinks |
| `php artisan queue:work` | Processes queued jobs |
| `php artisan schedule:run` | Runs scheduled tasks |
| Any custom Artisan commands | May have unknown side effects |
| `composer install` | Modifies vendor directory |
| `composer update` | Upgrades dependencies |
| `composer require` | Adds new dependencies |
| Direct `php -r` / eval | Arbitrary code execution |
| Any command that writes to DB | Prohibited without approval |

---

## Route Inventory Review

After running `php artisan route:list`, review:

| Check | What to Look For |
|-------|-----------------|
| Route count | Record total; note if higher/lower than expected |
| Method coverage | GET, POST, PUT, PATCH, DELETE, OPTIONS — any unexpected methods? |
| URI patterns | Resource routes (`/resource/{id}`), API routes (`/api/`), admin routes |
| Route names | Named routes present? Names follow convention? |
| Action binding | Controller@method or invokable — controller classes exist? |
| Middleware | Every sensitive route has appropriate middleware |
| Unauthenticated routes | Are any routes missing auth middleware unexpectedly? |
| Debug/dev routes | Any routes that expose debug info in non-dev environments? |

---

## Middleware Review

Inspect `app/Http/Kernel.php` (or `bootstrap/app.php` for Laravel 11+):

| Check | What to Look For |
|-------|-----------------|
| `auth` middleware | Applied to all protected routes |
| `verified` middleware | Applied where email verification required |
| `throttle` | Rate limiting on API and auth routes |
| `csrf` | Applied to state-changing web routes |
| Custom role middleware | Present and correctly applied |
| CORS middleware | Configured for API routes |
| Missing middleware | Any route group missing expected protection |

---

## Controller Binding Review

```bash
# List all controller files
find app/Http/Controllers -name "*.php" | sort

# Check for unresolved controller references in routes
php artisan route:list | grep "Closure"
```

| Check | What to Look For |
|-------|-----------------|
| Controller exists | Every route action resolves to an existing class/method |
| No orphaned routes | Routes pointing to deleted controllers |
| Closures in routes | Flag any closures in `routes/web.php` or `routes/api.php` — prefer controllers |
| Resource controllers | `Route::resource()` and `Route::apiResource()` used correctly |

---

## Policy / Gate Review

```bash
# List all policy files
find app/Policies -name "*.php" | sort

# Check for Gate definitions
grep -r "Gate::define\|Gate::policy\|Gate::before\|Gate::after" app/Providers/ | head -20
```

| Check | What to Look For |
|-------|-----------------|
| Policy registration | Policies registered in `AuthServiceProvider` |
| Missing policies | Resources without policies |
| Gate definitions | Gates defined for non-model authorization |
| `before` hooks | Global gates that bypass all policies |
| Super-admin bypass | Documented and intentional |

---

## Request Validation Review

```bash
# List all Form Request classes
find app/Http/Requests -name "*.php" | sort
```

| Check | What to Look For |
|-------|-----------------|
| Validation present | Every data-writing route has validation |
| Form Request vs inline | Prefer Form Request classes for complex validation |
| Authorization in Form Requests | `authorize()` method returns correct value |
| Missing validation | Any store/update routes without validation |
| Mass assignment protection | `$fillable` or `$guarded` defined on models |

---

## Auth / Role Boundary Review

| Check | What to Look For |
|-------|-----------------|
| Role separation | Admin routes separated from user routes |
| Middleware groups | `api`, `web`, `auth`, `guest` applied correctly |
| Role middleware | Custom role checking present and applied |
| Unauthenticated fallback | `unauthenticated()` in `Handler.php` returns appropriate response |
| Token authentication | API routes use token auth (`auth:sanctum`, `auth:api`) |
| Session vs token | Web routes use session; API routes use token |

---

## API Route Review

```bash
php artisan route:list --path=api
```

| Check | What to Look For |
|-------|-----------------|
| Versioning | `/api/v1/`, `/api/v2/` — is versioning consistent? |
| Authentication | Every API route except login/register has auth middleware |
| Response format | Consistent JSON response structure |
| Rate limiting | Throttle middleware on all public-facing API routes |
| CORS | Configured correctly for allowed origins |
| No session usage | API routes should not rely on session state |

---

## Web Route Review

```bash
php artisan route:list --path="" | grep -v "^api"
```

| Check | What to Look For |
|-------|-----------------|
| CSRF | All POST/PUT/PATCH/DELETE web routes have CSRF protection |
| Auth gates | Admin/staff areas protected |
| Named routes | All web routes have meaningful names |
| Redirect routes | Redirects are intentional and documented |
| Download routes | File download routes have auth + rate limiting |

---

## Error Handling Review

```bash
# Check exception handler
cat app/Exceptions/Handler.php | head -80
```

| Check | What to Look For |
|-------|-----------------|
| 404 handling | Custom 404 response (not debug stack trace) |
| 403 handling | Correct unauthorized response |
| 500 handling | Production-safe error pages |
| Unauthenticated handling | Returns 401 JSON for API, redirect for web |
| Validation exceptions | Returns 422 with field errors |

---

## PDPA / Privacy Route Review

| Check | What to Look For |
|-------|-----------------|
| PII routes | Any route that returns name, ID, address, phone, email |
| Export routes | CSV/PDF export routes — are they gated? |
| Search routes | Full-text search over personal data — authenticated? |
| Log routes | Does any route expose logs containing PII? |
| Admin PII access | Admin data routes have appropriate role checks |
| Data deletion routes | Present if PDPA requires right-to-erasure |

---

## Audit / Logging Route Review

| Check | What to Look For |
|-------|-----------------|
| Audit write routes | Routes that write to audit log — are they guarded? |
| Log injection | Any route that writes user input directly to logs |
| Debug logging | Any route that logs sensitive data (passwords, tokens) |
| Audit reads | Routes that expose audit history — appropriately restricted? |

---

## Report Format

Use the template in `docs/architecture/S2IMS_ROUTE_VERIFICATION_REPORT_TEMPLATE_MC84.md`.

Minimum required fields for any Laravel/PHP route verification report:

```
## Laravel/PHP Route Verification Report

**Repository**: [name]
**Branch**: [branch]
**Framework**: Laravel [version]
**Date**: [date]
**Main HEAD**: [commit hash]

### Framework Detection
- artisan: [FOUND / NOT FOUND]
- laravel/framework in composer.json: [FOUND / NOT FOUND]
- routes/web.php: [FOUND / NOT FOUND]
- routes/api.php: [FOUND / NOT FOUND]

### Commands Run
- [ ] php artisan route:list
- [ ] composer validate
- [ ] php artisan about

### Route Inventory
- Total routes: [N]
- Web routes: [N]
- API routes: [N]
- Named routes: [N]
- Unnamed routes: [N]

### Findings
| Category | Status | Notes |
|----------|--------|-------|
| Middleware | ✅ / ⚠️ / ❌ | |
| Controller binding | ✅ / ⚠️ / ❌ | |
| Policy/gate | ✅ / ⚠️ / ❌ | |
| Request validation | ✅ / ⚠️ / ❌ | |
| Auth/role boundary | ✅ / ⚠️ / ❌ | |
| API routes | ✅ / ⚠️ / ❌ | |
| Web routes | ✅ / ⚠️ / ❌ | |
| PDPA/privacy | ✅ / ⚠️ / ❌ | |
| Audit/logging | ✅ / ⚠️ / ❌ | |

### Verdict: ✅ VERIFIED / ⚠️ ISSUES NOTED / ❌ BLOCKED
```

---

## Stop Conditions

Stop and ask before proceeding if:

- Any forbidden command is needed to complete the verification
- A route points to a non-existent controller (may require creation — get approval)
- Middleware is missing on a sensitive route (may require code change — get approval)
- A migration is needed to complete a route (never run without approval)
- The environment cannot be determined (dev vs staging vs production)
- PII exposure is found in a route that is not gated

---

## Rollback / No-Change Policy

This standard is read-only. No changes are made to:
- Route files
- Controller files
- Middleware files
- Policy files
- `composer.json` or `composer.lock`
- `.env` files
- Database

If a fix is needed, document it in the report and wait for explicit approval before implementing.

---

## Token-Saving Rules

| Rule | Detail |
|------|--------|
| Route list first | Run `php artisan route:list` before reading route files |
| Targeted file reads | Only read `routes/web.php` and `routes/api.php` — not entire app |
| Grep before full read | Use `grep` to find specific patterns before opening files |
| Controller spot-check | Only read controllers relevant to findings — not all controllers |
| Stop at boundaries | If scope expands beyond docs/verification, stop and ask |

---

## S²IMS Applicability Statement

**Laravel/PHP route verification is NOT applicable to S²IMS.**

S²IMS is a Next.js 14 App Router project. It has no `artisan` file, no `composer.json`, and no `routes/` directory. Never run `php artisan` or `composer` commands in S²IMS.

For S²IMS route verification, use `docs/architecture/S2IMS_ROUTE_VERIFICATION_STANDARD_MC75.md`.

---

**Document**: MC84 Laravel/PHP Route Verification Standard — not a sign-off, not a governance record.
**Date**: 2026-05-22
