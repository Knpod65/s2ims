# /renovate-ui — UX Renovation Workflow

**Purpose**: Execute a structured UX/UI renovation review using the s2ims-full-stack-ux-renovation-reviewer skill.

**When to use**: When starting any Wave 1+ UI renovation work, auditing a specific route, or checking renovation readiness.

**Arguments**: Scope, e.g. `/renovate-ui staff-applications` or `/renovate-ui full-app`

**Files to read first**:
1. `docs/design/S2IMS_UX_RENOVATION_WAVE1_SHARED_UI_PRIMITIVES_PLAN_MC70.md` — component strategy
2. `docs/design/S2IMS_UX_RENOVATION_WAVE1_FOUNDATION_PRIMITIVES_MC71.md` — available primitives
3. `docs/architecture/NEXT_RENOVATION_STEPS.md` — last 60 lines
4. `src/components/shared/index.ts` — available shared components
5. Relevant page.tsx for the scope specified

**Files NOT to touch**: src/app/* (unless explicitly approved), tools/*, scripts/*, package.json

**Behavior**:
1. Load scope-relevant docs and source files
2. Invoke the s2ims-full-stack-ux-renovation-reviewer skill for the specified scope
3. Produce: current state analysis, specific renovation recommendations, MC reference
4. Check which shared primitives can replace inline patterns
5. Estimate LOC reduction and effort

**Output format**:
```
## Renovation Review: [scope]

### Current State
- [route/component]: [issue] → [recommendation]

### Primitives to Apply
- `<Button variant="...">` replaces: [inline pattern in file:line]
- `<StatusBadge status="...">` replaces: [inline pattern in file:line]

### Effort Estimate
- Files to migrate: [N]
- LOC reduction: ~[N] lines
- Estimated hours: [N]

### Safety Check
- [ ] AP-10B/C/11 remain blocked after migration
- [ ] No new persistence added
- [ ] No route changes
```

**Token-saving rules**:
- Scope tightly — do not read all 54 page.tsx files for a single-page review
- Reference existing audit docs (MC69) rather than re-auditing from scratch

**Safety boundaries**:
- Do NOT enable Confirm Import, persistence, or audit writes
- Do NOT migrate pages without explicit user approval
