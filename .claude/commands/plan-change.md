# /plan-change — Plan a Change Safely

**Purpose**: Create a structured plan for any S²IMS change before executing. Always run this before implementing non-trivial changes.

**When to use**: Before any implementation work — especially source code changes, new components, or doc lifecycle phases.

**Arguments**: Describe what you want to change, e.g. `/plan-change migrate StaffApplications to use shared Button`

**Files to read first**:
1. `docs/architecture/NEXT_RENOVATION_STEPS.md` — last 60 lines
2. Files directly relevant to the proposed change
3. `src/config/theme.ts` if UI-related
4. `src/components/shared/index.ts` if component-related

**Files NOT to touch during planning**: Anything — planning is read-only.

**Behavior**:
1. Read relevant files
2. Identify: what changes, what stays the same, what could break
3. Check: are any governance gates (AP-10B/C/11) involved? If yes, block.
4. List: files to create/modify, files not to touch, validation commands
5. Estimate: effort, risk level (low/medium/high)
6. Write plan (not execute)

**Output format**:
```
## Plan: [change description]

### Scope
- Files to CREATE: [list]
- Files to MODIFY: [list]
- Files NOT to touch: [list]

### Safety Check
- [ ] No src/app/* changes (if docs-only)
- [ ] AP-10B remains locked
- [ ] AP-10C remains blocked
- [ ] AP-11 remains blocked
- [ ] No package.json changes

### Validation Commands
- `npm run build`
- `npm run check:tokens`
- `npm run check:audit-events`

### Estimated Effort: [X hours]
### Risk Level: [Low / Medium / High]

### Recommended Commit Message
`[type(scope): description]`
```

**Token-saving rules**:
- Do not read all docs — read only what's relevant to the proposed change
- Produce a plan, not a full implementation

**Safety boundaries**:
- No file writes during planning
- Block if AP-10B/C/11 are mentioned as targets
- Block if src/app/* changes are proposed in a docs-only context
