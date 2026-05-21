# /verify-change — Post-Change Verification

**Purpose**: After making any change, verify the repo is in a correct, safe state.

**When to use**: After every implementation commit, before every PR, and after every merge.

**Files to check**:
- `git status --short`
- `git diff --name-only HEAD~1..HEAD` (or against origin/main)
- Run: `npm run build`, `npm run check:tokens`, `npm run check:audit-events`

**Files NOT to touch**: Never modifies anything — verification only.

**Behavior**:
1. Run `git status --short` — verify working tree is clean
2. Run `git diff --name-only` — check scope of last commit
3. Verify scope: flag any src/app/*, tools/*, scripts/*, or package.json changes (unless intentional)
4. Run `npm run build` — must pass 42/42 routes
5. Run `npm run check:tokens` — must pass 4/4
6. Run `npm run check:audit-events` — must pass 502/502
7. Confirm governance gates: grep for any AP-10B/AP-10C/AP-11 enable changes

**Output format**:
```
## Verification Report

### Scope Check
- Files changed: [list]
- Unexpected changes: ✅ None / ⚠️ [list unexpected files]

### Build
- npm run build: ✅ 42/42 / ❌ [error]
- npm run check:tokens: ✅ 4/4 / ❌ [error]
- npm run check:audit-events: ✅ 502/502 / ❌ [error]

### Safety
- AP-10B: 🔒 Locked
- AP-10C: 🔒 Blocked
- AP-11: 🔒 Blocked

### Verdict: ✅ VERIFIED / ❌ BLOCKED
```

**Safety boundaries**: Runs npm check commands (read-only). Does not edit files.
