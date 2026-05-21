# S²IMS Claude Code Command System Recommendation — MC69

Proposed command system for S²IMS to implement a "command-first workflow" as the primary operating layer for Claude-assisted development and operations.

---

## Purpose

This document proposes a command-first operating model for S²IMS using Claude Code's command system (`.claude/commands/` directory). Commands enable:
- **Reusable workflows**: Define once, invoke from any conversation
- **Clear intent**: Commands are discoverable and self-documenting
- **Consistent execution**: Same prompt runs identically across sessions
- **Team alignment**: Shared commands enforce patterns and best practices
- **Audit trail**: Command usage logged and traceable

---

## Current State

**What exists**:
- ✅ Skill file: `.claude/skills/s2ims-full-stack-ux-renovation-reviewer/SKILL.md` (697 lines, fully functional)
- ❌ Commands directory: `.claude/commands/` does not exist
- ❌ CLAUDE.md: Root project brief missing (optional for MC69)
- ⚠️ Memory files: Only `NEXT_RENOVATION_STEPS.md` partial

**What's missing**:
- Formal command definitions (could be created in MC70)
- Root project brief (CLAUDE.md)
- Operating layer documentation

**Why it matters**:
- Commands provide a "CLI-like" interface to complex Claude workflows
- Instead of "run the UX renovation skill", use `/ux-audit` command
- Team members discover available commands via tab completion in Claude Code
- Skill exists but isn't invoked consistently without commands

---

## Proposed Command System

### Command Categories

#### Category 1: UX Audit & Design Commands

**Command: `/ux-audit`**
- **Purpose**: Run comprehensive UX audit on a specific role or all roles
- **Triggers**: s2ims-full-stack-ux-renovation-reviewer skill
- **Parameters**:
  - `scope`: "admin" | "staff" | "provider" | "student" | "esq" | "public" | "all" (default: "all")
  - `focus`: "accessibility" | "components" | "journey" | "design-system" (optional)
  - `output`: "audit" | "matrix" | "recommendations" (default: "audit")
- **Example Usage**:
  ```
  /ux-audit scope:staff focus:accessibility
  /ux-audit scope:all output:matrix
  /ux-audit scope:admin
  ```
- **What it does**:
  - Invokes skill with scoped audit parameters
  - Returns role-specific findings + recommendations
  - Cross-references with MC68 manual, routes, screenshots
- **Effort to Create**: 0.5 hour (add to .claude/commands/ux-audit.md)

**Command: `/design-brief`**
- **Purpose**: Generate design brief for a specific component or page
- **Triggers**: Figma/Stitch prompt pack (from MC69)
- **Parameters**:
  - `component`: "dashboard-shell" | "datatable" | "form-shell" | "badge" | "button"
  - `role`: "admin" | "staff" | "provider" | "student" | "esq" (optional)
- **Example Usage**:
  ```
  /design-brief component:dashboard-shell role:staff
  /design-brief component:datatable
  ```
- **What it does**:
  - Retrieves design brief from MC69 Figma prompt pack
  - Customizes for specified role (colors, labels, actions)
  - Ready to paste into Figma AI or Stitch tool
- **Effort to Create**: 1 hour (add to .claude/commands/design-brief.md)

**Command: `/accessibility-check`**
- **Purpose**: Audit a page or component for WCAG 2.1 AA compliance
- **Triggers**: Custom accessibility audit routine
- **Parameters**:
  - `page`: route path (e.g., "/staff/applications")
  - `component`: component name (optional)
- **Example Usage**:
  ```
  /accessibility-check page:/staff/applications
  /accessibility-check component:DataTable
  ```
- **What it does**:
  - Runs checklist: color contrast, keyboard nav, ARIA labels, focus indicators
  - Reports findings + remediation steps
- **Effort to Create**: 1.5 hours (requires accessibility checklist)

---

#### Category 2: Implementation & Code Generation Commands

**Command: `/gen-wave`**
- **Purpose**: Generate implementation task list for a specific wave
- **Triggers**: MC69 implementation waves document
- **Parameters**:
  - `wave`: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  - `format`: "checklist" | "task-list" | "subtasks" (default: "checklist")
- **Example Usage**:
  ```
  /gen-wave wave:0
  /gen-wave wave:1 format:task-list
  ```
- **What it does**:
  - Retrieves wave definition from MC69 waves document
  - Generates task breakdown + effort estimates
  - Outputs as checklist or task list for Claude Code
- **Effort to Create**: 1 hour (add to .claude/commands/gen-wave.md)

**Command: `/extract-component`**
- **Purpose**: Extract a component from existing code or redesign
- **Triggers**: Component extraction template (to be created)
- **Parameters**:
  - `component`: "dashboard-shell" | "datatable" | "form-shell" | etc.
  - `source`: "sketch" | "existing-code" | "brief" (source location)
- **Example Usage**:
  ```
  /extract-component component:dashboard-shell source:sketch
  /extract-component component:datatable source:existing-code
  ```
- **What it does**:
  - For source="sketch": Code-gen from Figma design (AI-assisted)
  - For source="existing-code": Extract + refactor from current implementation
  - For source="brief": Generate from design brief template
  - Outputs React component + Storybook story + tests
- **Effort to Create**: 2 hours (requires code generation template)

---

#### Category 3: Documentation & Reference Commands

**Command: `/route-map`**
- **Purpose**: Display route inventory for a specific role or all routes
- **Triggers**: MC68 route inventory document
- **Parameters**:
  - `role`: "admin" | "staff" | "provider" | "student" | "esq" | "public" (optional)
  - `format`: "table" | "tree" | "list" (default: "table")
- **Example Usage**:
  ```
  /route-map role:admin
  /route-map
  ```
- **What it does**:
  - Retrieves route inventory from documentation
  - Filters by role (if specified)
  - Outputs as table, tree, or list format
- **Effort to Create**: 0.5 hour (add to .claude/commands/route-map.md)

**Command: `/journey-map`**
- **Purpose**: Display user journey for a specific role
- **Triggers**: MC68 user journey document + MC69 redesign direction
- **Parameters**:
  - `role`: "admin" | "staff" | "provider" | "student" | "esq" | "public"
  - `type`: "current" | "ideal" (default: "current")
- **Example Usage**:
  ```
  /journey-map role:staff
  /journey-map role:student type:ideal
  ```
- **What it does**:
  - Displays current journey (from MC68) or ideal journey (from MC69)
  - Includes steps, pain points, improvement areas
  - Cross-references with screenshots (if available)
- **Effort to Create**: 0.5 hour (add to .claude/commands/journey-map.md)

**Command: `/design-tokens`**
- **Purpose**: Display design system tokens (colors, spacing, typography)
- **Triggers**: MC69 design system document
- **Parameters**:
  - `category`: "colors" | "spacing" | "typography" | "all" (default: "all")
- **Example Usage**:
  ```
  /design-tokens category:colors
  /design-tokens
  ```
- **What it does**:
  - Retrieves design tokens from MC69 design system doc
  - Displays in reference format (hex codes, px values, etc.)
  - Copy-paste ready for theme.ts
- **Effort to Create**: 0.5 hour (add to .claude/commands/design-tokens.md)

---

#### Category 4: Operational Commands

**Command: `/status`**
- **Purpose**: Check project status (build, routes, tests, audit events)
- **Triggers**: `npm run build`, `npm run check:tokens`, `npm run check:audit-events`
- **Parameters**: None
- **Example Usage**:
  ```
  /status
  ```
- **What it does**:
  - Runs build validation
  - Checks token count (4/4 expected)
  - Checks audit events (502/502 expected)
  - Reports project health
- **Effort to Create**: 1 hour (create validation script)

**Command: `/review`**
- **Purpose**: Run pre-commit review (lint, build, tests)
- **Triggers**: ESLint, Build, Test suite
- **Parameters**:
  - `level`: "quick" | "full" (default: "quick")
- **Example Usage**:
  ```
  /review
  /review level:full
  ```
- **What it does**:
  - Quick: ESLint + TypeScript check
  - Full: ESLint + TypeScript + Build + Tests
  - Reports issues + remediations
- **Effort to Create**: 1.5 hours (integrate with CI/CD)

---

## Command File Structure

Each command is a `.md` file in `.claude/commands/` with the following structure:

```markdown
---
name: ux-audit
type: skill-invocation
trigger-phrase: /ux-audit
description: "Run comprehensive UX audit for S²IMS on specified role or all roles"
tags: [audit, ux, design, skill]
when-to-use: |
  - When starting a new UX review
  - When focusing on a specific role's experience
  - When gathering accessibility or component findings
  - When generating recommendations for implementation
---

# UX Audit Command

## Purpose
[Description of what the command does]

## Parameters
[Parameters + defaults]

## Example Usage
[2-3 examples]

## What It Does
[Detailed step-by-step]

## Output Format
[What the user receives]

## See Also
- [Related command]
- [Related doc]

## Implementation Note
This command invokes `./.claude/skills/s2ims-full-stack-ux-renovation-reviewer/SKILL.md` with scoped parameters.
```

---

## Implementation Roadmap

### Phase 1: Core Commands (MC70, 2-3 hours)
Create these commands first (highest ROI):
1. `/ux-audit` — Most-used workflow
2. `/route-map` — Reference, low effort
3. `/journey-map` — Reference, low effort
4. `/design-tokens` — Reference, low effort

### Phase 2: Design & Generation Commands (MC71, 3-4 hours)
Create design and code generation commands:
5. `/design-brief` — For designer handoff
6. `/gen-wave` — For implementation planning
7. `/accessibility-check` — For WCAG audits
8. `/extract-component` — For code generation

### Phase 3: Operational Commands (MC72, 2-3 hours)
Create project health and CI/CD commands:
9. `/status` — Health check
10. `/review` — Pre-commit review

---

## Benefits of the Command System

| Benefit | How It Works | ROI |
|---------|---|---|
| **Reusability** | Write prompt once, invoke from any conversation | High (saves 5-10 min per invocation) |
| **Discoverability** | Tab completion shows all available commands | High (team knows what's possible) |
| **Consistency** | Same prompt, same output every time | High (reduces variability) |
| **Documentation** | Commands are self-documenting (help built-in) | High (less wiki/slack hunting) |
| **Audit Trail** | Usage logged in Claude sessions (searchable) | Medium (governance + troubleshooting) |
| **Team Alignment** | Shared commands enforce patterns | Medium (onboarding new team members) |
| **Workflow Automation** | Complex multi-step tasks become one command | High (faster iteration) |

---

## Integration with Existing Skill

**Current State**:
- Skill file exists: `./.claude/skills/s2ims-full-stack-ux-renovation-reviewer/SKILL.md`
- Skill is fully functional but requires manual invocation

**With Commands**:
- `/ux-audit` command wraps the skill with parameter handling
- Skill itself doesn't change (no duplication)
- Commands add a "CLI-like" layer on top of skill

**Example Mapping**:
```
/ux-audit scope:staff 
  └─ Invokes skill with parameter: scope=staff
     └─ Skill returns: staff-role audit findings
```

---

## When to Use Each Command

| Command | When to Use | Example |
|---------|---|---|
| `/ux-audit` | Starting UX review, focusing on role, gathering audit findings | "I need to audit the staff role for accessibility issues" |
| `/design-brief` | Preparing design handoff to Figma, generating design spec | "Generate design brief for the DataTable component" |
| `/accessibility-check` | Verifying WCAG compliance, checking keyboard nav, auditing ARIA | "Check /staff/applications page for WCAG AA compliance" |
| `/gen-wave` | Planning implementation tasks, breaking down work, estimating effort | "What's in Wave 1? Give me the task list" |
| `/extract-component` | Creating new reusable component, refactoring existing code | "Extract DashboardShell from /admin/dashboard sketch" |
| `/route-map` | Learning route structure, understanding architecture, reference lookup | "Show me all staff routes" |
| `/journey-map` | Understanding user flow, identifying pain points, comparing before/after | "What's the ideal student journey?" |
| `/design-tokens` | Implementing design system, building theme.ts, reference checking | "What's the primary color hex code?" |
| `/status` | Health check, pre-commit verification, validating build | "Is the project healthy?" |
| `/review` | Pre-commit, final check before PR, linting + testing | "Run full review before I push" |

---

## Command Naming Conventions

All commands follow a pattern for consistency:
- **Audit commands**: `/ux-audit`, `/accessibility-check`, `/review` (verb-noun)
- **Generation commands**: `/gen-wave`, `/design-brief`, `/extract-component` (verb or noun-focused)
- **Reference commands**: `/route-map`, `/journey-map`, `/design-tokens` (noun-focused)
- **Operational commands**: `/status` (single-word, operational)

---

## Future Enhancements

### Phase 3+: Advanced Commands
- `/compare-versions` — Compare before/after UX, show improvements
- `/generate-test` — Generate test cases for a component
- `/i18n-extract` — Extract hard-coded text to i18n dictionaries
- `/dark-mode-check` — Audit component for dark mode compatibility
- `/performance-audit` — Check bundle size, component performance
- `/generate-docs` — Auto-generate component documentation
- `/semantic-check` — Verify HTML semantics (a11y)

### Integration with CLAUDE.md
- When CLAUDE.md is created, it will reference the command system
- Commands can be documented in CLAUDE.md as the primary "how to work with this project" guide
- Example CLAUDE.md section: "Use `/ux-audit` to analyze UX, `/route-map` to understand architecture"

---

## Effort to Implement

| Phase | Commands | Effort | Timeline |
|-------|----------|--------|----------|
| Phase 1 | `/ux-audit`, `/route-map`, `/journey-map`, `/design-tokens` | 2-3 hours | MC70 |
| Phase 2 | `/design-brief`, `/gen-wave`, `/accessibility-check`, `/extract-component` | 3-4 hours | MC71 |
| Phase 3 | `/status`, `/review` | 2-3 hours | MC72 |
| **Total** | **10 commands** | **7-10 hours** | **3 weeks** |

---

## Success Criteria

| Criteria | Target | How to Measure |
|----------|---|---|
| Command discovery | 100% of team knows all commands | Ask in standup |
| Command usage | At least 1 command per week per developer | Check Claude session logs |
| Workflow automation | 50% of routine tasks use commands | Survey team on time savings |
| Documentation quality | All commands have clear examples | Review command help text |
| Consistency | Same command, same output across sessions | Test in 3 different sessions |
| Adoption time | New team member productive with commands in 1 day | Onboarding feedback |

---

## Recommendation

**For MC69 Audit**: Document proposed command system (this file). Commands themselves are out of scope.

**For MC70**: Create Phase 1 commands (highest ROI):
1. `/ux-audit` — Most-used workflow
2. `/route-map` — Reference
3. `/journey-map` — Reference
4. `/design-tokens` — Reference

**For MC71+**: Create remaining commands as needed.

**Why Phase Commands Over Phase 1?**
- Commands are wrapper around skill, not replacement
- Skill (existing) is sufficient for MC69-70 work
- Commands are nice-to-have, not blocking
- Phase 1 commands add significant ROI (reusability, discoverability)
- Phase 2-3 commands are lower priority (nice-to-have)

---

## Integration Checklist (For MC70 Implementation)

- [ ] Create `.claude/commands/` directory
- [ ] Create Phase 1 command files (4 files)
- [ ] Test each command in a test conversation
- [ ] Document commands in README or CLAUDE.md (future)
- [ ] Add command help text (visible via `/help`)
- [ ] Train team on command usage
- [ ] Monitor usage and refine as needed

---

## Appendix: Command File Template

```markdown
---
name: [command-name]
type: [skill-invocation | custom | reference]
trigger-phrase: /[command-name]
description: "[One-line description]"
tags: [tag1, tag2]
when-to-use: |
  - Bullet 1
  - Bullet 2
  - Bullet 3
---

# [Command Name] Command

## Purpose
[What this command does and why]

## Parameters
- `param1`: [Type] [Description] (default: value)
- `param2`: [Type] [Description]

## Example Usage
```
/command-name param:value
/command-name param1:value param2:value
```

## What It Does
[Step-by-step breakdown]

## Output Format
[What the user receives]

## See Also
- [Related command]
- [Related documentation]

## Implementation Note
[Technical details, which skill it invokes, etc.]
```
