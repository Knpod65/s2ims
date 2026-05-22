# S²IMS MC84 — Backend / API Route Audit Skill Proposal

**Date**: 2026-05-22
**Milestone**: MC84
**Status**: PROPOSAL ONLY — not implemented, not approved

---

## Why This Is Needed

The MC75 route verification standard and MC84 Laravel/PHP standard are written as reference documents. They describe what to do, but a Claude operator must read them, interpret them, and apply them manually each session.

A dedicated skill would codify the decision logic once, making every future session faster, more consistent, and less likely to apply the wrong verification method to the wrong repo type. The `s2ims-full-stack-ux-renovation-reviewer` skill provides a model for how project-specific skills reduce token usage and increase consistency.

---

## Proposed Skill

**Proposed path**: `.claude/skills/s2ims-backend-api-route-auditor/SKILL.md`

**Proposed name**: `s2ims-backend-api-route-auditor`

---

## When to Use (Trigger Conditions)

This skill would be invoked when:
- Starting a new session in any repo to select the correct route verification method
- Before merging any branch that touches route files (`routes/`, `src/app/`, `pages/`)
- After any PR that adds or removes routes
- When auditing auth/role/middleware coverage
- When PDPA or privacy concerns exist about data exposure via routes
- When a new framework (Laravel, Next.js, or mixed) is encountered

---

## Skill Behavior

### Mode Selection

```
1. Run framework detection (artisan, composer.json, package.json)
2. Determine mode: Next.js / Laravel / Mixed / Docs-only / Unknown
3. Execute appropriate verification commands for the detected mode
4. Report findings using the standard report template
```

### Next.js Mode

```
- npm run build
- npm run check:tokens
- npm run check:audit-events
- Route smoke (if dev server available)
- Scope check
- Report: route count delta, build result, safety boundaries
```

### Laravel / PHP Mode

```
- php artisan route:list
- composer validate
- php artisan about
- Middleware review
- Controller binding review
- Policy/gate spot-check
- PDPA/privacy route review
- Audit/logging route review
- Report: route count, key findings, issues, safety boundaries
```

### Mixed Mode

```
- Run both Next.js and Laravel verification sets
- Report both in a combined report
- Flag any API contract mismatches
```

### Docs-only Mode

```
- Run build baseline (confirm no accidental regression)
- Scope check only
- Skip route smoke
```

---

## Files to Inspect (Per Mode)

### Next.js

| File / Command | Purpose |
|----------------|---------|
| `git diff --name-only` | Confirm scope |
| `npm run build` output | Route count |
| `src/app/**/page.tsx` | Route inventory (if needed) |
| `.claude/commands/verify-change.md` | S²IMS verification standard |
| `docs/architecture/S2IMS_ROUTE_VERIFICATION_STANDARD_MC75.md` | Full standard |

### Laravel / PHP

| File / Command | Purpose |
|----------------|---------|
| `php artisan route:list` | Route inventory |
| `routes/web.php` | Web route definitions |
| `routes/api.php` | API route definitions |
| `app/Http/Kernel.php` or `bootstrap/app.php` | Middleware registration |
| `app/Http/Controllers/` | Controller binding check |
| `app/Policies/` | Policy file inventory |
| `app/Http/Requests/` | Request validation classes |
| `docs/architecture/S2IMS_LARAVEL_PHP_ROUTE_VERIFICATION_STANDARD_MC84.md` | Full standard |

---

## Output Format

Use `docs/architecture/S2IMS_ROUTE_VERIFICATION_REPORT_TEMPLATE_MC84.md` as the standard output format for all reports produced by this skill.

---

## Safety Boundaries

The skill must enforce:
- Never run forbidden commands (`migrate`, `db:seed`, `cache:clear` in prod, etc.)
- Never expose `.env` contents
- Never execute queue workers or scheduled tasks
- Never write to database
- Never commit dependency lockfile changes
- Stop and ask before any command not in the safe list
- Respect existing AP gate state (never open AP-10B/AP-10C/AP-11 as part of verification)

---

## Token-Saving Rules

- Run `php artisan route:list` before reading any route file
- Use `grep` before full file reads
- Read only the controllers/policies identified in findings
- Report findings concisely — do not paste full route list unless explicitly requested
- Use the decision tree (MC84) to select the shortest path to the needed verification

---

## Implementation Requirements (When Approved)

When this proposal is approved:

1. Create `.claude/skills/s2ims-backend-api-route-auditor/` directory
2. Create `SKILL.md` following the same structure as `.claude/skills/s2ims-full-stack-ux-renovation-reviewer/SKILL.md`
3. Reference MC75 (Part A) and MC84 standards
4. Reference the cross-repo decision tree (MC84)
5. Reference the report template (MC84)
6. Register the skill in the operating layer
7. Update `docs/architecture/S2IMS_CLAUDE_RESOURCE_USAGE_STANDARD_MC75.md` to include the new skill
8. Update `.claude/commands/project-orient.md` to include the skill in the resource discovery table
9. Update `.claude/commands/verify-change.md` to reference the skill for framework detection

---

## Status

**PROPOSAL ONLY** — This document is a recommendation. The skill is not created until explicitly approved. No `.claude/skills/` files have been modified by MC84.

---

## Related Documents

| Document | Role |
|----------|------|
| `docs/architecture/S2IMS_ROUTE_VERIFICATION_STANDARD_MC75.md` | Next.js verification standard (MC75 Part A) |
| `docs/architecture/S2IMS_LARAVEL_PHP_ROUTE_VERIFICATION_STANDARD_MC84.md` | Laravel/PHP verification standard (MC84) |
| `docs/architecture/S2IMS_CROSS_REPO_ROUTE_VERIFICATION_DECISION_TREE_MC84.md` | Decision tree for all project types |
| `docs/architecture/S2IMS_ROUTE_VERIFICATION_REPORT_TEMPLATE_MC84.md` | Reusable report template |
| `docs/architecture/S2IMS_CLAUDE_RESOURCE_USAGE_STANDARD_MC75.md` | Claude resource usage standard |
| `.claude/skills/s2ims-full-stack-ux-renovation-reviewer/SKILL.md` | Model for skill structure |

---

**Document**: MC84 Backend/API Route Audit Skill Proposal — not a sign-off, not a governance record.
**Date**: 2026-05-22
