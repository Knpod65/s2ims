# S²IMS Claude Resource Usage Standard

**Date**: 2026-05-21  
**Milestone**: MC75  
**Purpose**: Permanent standard for using slash commands, skills, subagents, connectors, and plugins efficiently in every S²IMS Claude session

---

## IMPORTANT: Check Resources Before Every Session

Do not improvise. Check what tools are available first.

```bash
find .claude -maxdepth 4 -type f 2>/dev/null | sort
```

---

## Step 1: Inspect Available Resources

### Slash Commands (`.claude/commands/`)

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/project-orient` | Orient session: recent commits, MC status, safety gates | **First command every session** |
| `/safe-explore` | Read-only codebase exploration | Before any implementation |
| `/plan-change` | Define scope, file list, risk, verification | Before any implementation |
| `/renovate-ui` | Invoke UX renovation skill | UI/UX/design work only |
| `/sync-design-system` | Check against theme.ts tokens | Token/design system changes |
| `/audit-rbac` | Audit route access and AP gates | Security/auth audit |
| `/audit-api-contract` | Check type contracts vs API layer | API/type changes |
| `/bilingual-check` | Thai/English copy audit | Copy/text changes |
| `/pdpa-review` | Privacy masking and PDPA audit | Data handling changes |
| `/verify-change` | Post-change validation | **After every meaningful change** |
| `/handoff-summary` | Session handoff report | **After every completed task** |

**Rule**: If a relevant command exists, use it. Never invent a custom workflow if a command covers it.

### Skills (`.claude/skills/`)

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `s2ims-full-stack-ux-renovation-reviewer` | Full-stack UX review: screens, components, roles, accessibility, performance, PDPA | Any task touching UI, design, full-stack review, component analysis |

**Rule**: If the task touches UI/UX/component/design/full-stack review, invoke this skill. Do not substitute with ad-hoc review.

### Subagents

Available when the platform provides specialized agent types:

| Agent Type | When to Use |
|-----------|-------------|
| `brand-voice:content-generation` | Long-form content with brand guidelines |
| `brand-voice:document-analysis` | Analyzing multiple brand documents |
| `Explore` | Read-only codebase search/exploration |
| `Plan` | Architecture design and implementation planning |
| `general-purpose` | Complex multi-step research or cross-file tasks |

**Rule**: If a specialized subagent is available for a task, use it. State which subagent was used and why. If none available, perform the review manually and state "No subagent available — manual review performed."

### Connectors and Plugins

| Connector/Plugin | Use When | Do NOT Use When |
|-----------------|----------|----------------|
| **GitHub connector** | Checking branch/PR history, comparing commits, reviewing PRs | Standard git operations (use Bash tool instead) |
| **Figma connector/plugin** | Design frames, redesign briefs, component library, screenshot-to-design work | Non-design documentation, standard code review |
| **Google Drive** | External spec documents, shared stakeholder docs need to be fetched | Internal repo documents |
| **Mermaid/Miro** | System flow diagrams, governance flow, user journey maps, architecture diagrams | Simple text documentation |
| **Calendar MCP** | Scheduling demo sessions, governance meetings | Code/documentation tasks |
| **Zapier MCP** | Workflow automation, external system integration | Internal repo tasks |

**Rule**: Only use a connector if the task genuinely requires it. Document every connector decision (used or not used and why) in the handoff summary.

---

## Step 2: Session Resource Report

At the start of every session, after `/project-orient`, produce this table:

```markdown
## Operating Resources — Session [date]

| Resource | Available? | Will Use? | Reason |
|----------|-----------|-----------|--------|
| `/project-orient` | ✅ Yes | ✅ Used | Session start orientation |
| `/safe-explore` | ✅ Yes | ✅ Used | Pre-implementation exploration |
| `/plan-change` | ✅ Yes | ✅ Used | Scope and risk defined in plan file |
| `/verify-change` | ✅ Yes | ✅ Used | Post-commit validation |
| `/handoff-summary` | ✅ Yes | ✅ Used | Session handoff |
| `s2ims-full-stack-ux-renovation-reviewer` skill | ✅ Yes | ❌ Not used | Docs-only task — no UI/UX review |
| GitHub connector | ✅ Available | ❌ Not used | Standard git operations sufficient |
| Figma connector | ✅ Available | ❌ Not used | No design frame output needed |
| Google Drive | ✅ Available | ❌ Not used | No external docs needed |
| Mermaid/Miro | ✅ Available | ❌ Not used | No diagrams needed |
```

---

## Step 3: Command-First Flow

Every task must follow this flow in order:

```
1. /project-orient
   → Get: branch, HEAD, last MC, safety gates, recommended next

2. /safe-explore  
   → Inspect only relevant files (no edits)
   → List evidence found and gaps

3. /plan-change
   → Define: scope, files, risk level, verification plan
   → Write to plan file before implementation

4. Implement (only if risk is low/medium)
   → Use most relevant command/skill/subagent
   → Never implement before plan is complete

5. /verify-change
   → Run build/tokens/audit-events
   → Confirm scope (docs-only or src-allowed)
   → Report AP gate status

6. /handoff-summary
   → Return: branch, files, commands used, validation, route verification, risk, next command
```

**Hard stops**:
- If risk is HIGH → stop and ask for explicit approval
- If task would enable persistence/import/AP gate → stop and ask
- If task scope is unclear → use `/safe-explore` again before proceeding

---

## Step 4: Token-Saving Rules

### DO:
- Read NEXT_RENOVATION_STEPS.md last 60 lines only (3000+ line file)
- Read only 2 most recent daily reports
- Use `grep -n "pattern" file` to find exact locations before opening large files
- Use `git diff --name-only` to see scope without full diffs
- Use `find . -name "pattern" -maxdepth 4` instead of `find .` (no depth limit)
- Summarize documents; do not paste full content unless editing
- Use `tail -n 60` for large docs you only need the end of
- Prefer MC summary docs over opening all historical MC files

### DO NOT:
- Read the entire repo
- Open every historical MC file (MC58–MC74) when only the current MC matters
- Use every connector/plugin just because it exists
- Paste huge code blocks unless you are editing them
- Run implementation before planning
- Start any session without `/project-orient`
- Open `src/app/**` files unless the task touches source code

---

## Step 5: After-Task Output Format

After every completed task, return this format:

```markdown
## Task Handoff

### Resources Used
| Resource | Used? | Reason |
|----------|-------|--------|
| [list all] | ✅/❌ | [reason] |

### Branch
[branch name]

### Files Changed
| File | Action | Reason |
|------|--------|--------|

### Validation
| Check | Result |
|-------|--------|
| npm run build | ✅ 42/42 |
| npm run check:tokens | ✅ 4/4 |
| npm run check:audit-events | ✅ 502/502 |
| Scope check | ✅ SCOPE CLEAN |
| Laravel/PHP check | ✅ Not applicable |

### Route Verification
[Result from route verification standard]

### Risk
[Low / Medium / High — reason]

### Safety Boundaries
- No src/* changes: ✅
- AP-10B: 🔒 BLOCKED
- AP-10C: 🔒 BLOCKED
- AP-11: 🔒 BLOCKED

### Next Recommended Command
`/[command]`

### Continuation Prompt (if work remains)
[exact prompt to continue]
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Running `php artisan route:list` in S²IMS | Detect framework first; state "Not applicable" |
| Using Figma for documentation review | Figma for design frames only |
| Using GitHub connector for a `git log` | Use Bash tool with git commands |
| Opening all src/app/* for docs-only task | Grep/find for specific files only |
| Skipping `/project-orient` | Always start sessions with orientation |
| Pasting 500-line files in full | Read targeted sections; summarize |
| Implementing before planning | Plan first, implement second |
| Claiming demo/approval/sign-off | Only claim if evidence exists |

---

**Document**: MC75 permanent operating standard.  
**Date**: 2026-05-21
