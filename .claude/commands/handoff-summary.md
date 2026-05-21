# /handoff-summary — Session Handoff Summary

**Purpose**: Create a structured handoff document at the end of a session so the next session can resume cleanly.

**When to use**: At the end of any working session before closing Claude Code.

**Files to create**:
- `docs/daily-reports/[YYYY-MM-DD]-[task-slug]-handoff.md`

**Files NOT to touch**: src/*, tools/*, scripts/*, package.json

**Behavior**:
1. Run `git log --oneline -5` to get recent commits
2. Run `git status --short` to check working tree
3. Read last session's daily report if one exists
4. Summarize: what was completed, current branch + HEAD, uncommitted changes, next step

**Output format** (create the file, then report the path):
```markdown
# Session Handoff: [date] — [task description]

**Date**: [YYYY-MM-DD]
**Branch**: [branch]
**HEAD**: [commit hash]

## Completed This Session
- [commit]: [what was done]

## Current State
- Working tree: [clean / [N] uncommitted files]
- Validation: build ✅/❌ · tokens ✅/❌ · audit ✅/❌

## Uncommitted Work
- [file]: [status and description]

## Next Action
[1-2 sentences: what to do first in the next session]

## Safety State
- AP-10B: 🔒 Locked
- AP-10C: 🔒 Blocked
- AP-11: 🔒 Blocked
```

**Token-saving rules**: Summary only — do not reproduce full file contents.

**Safety boundaries**: Creates one doc file. Does not touch src/*, tools/*, scripts/*, package.json.
