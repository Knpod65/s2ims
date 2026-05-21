# /project-orient — S²IMS Session Orientation

**Purpose**: Orient a new Claude session to the current project state. Run this at the start of every session.

**When to use**: First command in any new Claude Code session on S²IMS.

**Files to read (in order)**:
1. `docs/architecture/NEXT_RENOVATION_STEPS.md` — last 60 lines only (current MC status)
2. Most recent `docs/daily-reports/*.md` — last 2 files by name (what was done recently)
3. `git log --oneline -10` — recent commit history

**Files NOT to touch**: Any src/*, tools/*, scripts/*, package.json

**Behavior**:
1. Run `git log --oneline -10` to see recent commits
2. Read last 60 lines of NEXT_RENOVATION_STEPS.md
3. Find the 2 most recent daily reports (sort by filename date descending)
4. Summarize: current MC status, last completed work, active branch if any, recommended next action

**Output format**:
```
## S²IMS Session Orientation

**Current Branch**: [branch name]
**Main HEAD**: [commit hash]
**Last MC Completed**: MC[N] — [description]
**MC[N+1] Status**: [ready / in-progress / blocked]

### Recent Work
- [commit hash]: [message]

### Recommended Next Action
[1-2 sentences on what to do next]
```

**Resource discovery** — include this table in orientation output:
```
| Resource | Available? | Will Use? | Reason |
|----------|-----------|-----------|--------|
| /commands | List found | [Y/N] | ... |
| Skills    | List found | [Y/N] | ... |
| Subagents | List available | [Y/N] | ... |
| Connectors| List relevant | [Y/N] | ... |
```
Run: `find .claude -maxdepth 4 -type f 2>/dev/null | sort` to discover available commands and skills.

**Resource usage standard**: See `docs/architecture/S2IMS_CLAUDE_RESOURCE_USAGE_STANDARD_MC75.md` for full connector decision table and session report format.

**Token-saving rules**:
- Read ONLY the last 60 lines of NEXT_RENOVATION_STEPS.md (not the full 3000+ lines)
- Read ONLY 2 most recent daily reports
- Do NOT read all design docs
- Do NOT run npm build during orientation

**Safety boundaries**:
- Read-only — no file changes, no commits, no npm commands
