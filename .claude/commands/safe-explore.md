# /safe-explore — Read-Only Codebase Exploration

**Purpose**: Explore any part of the S²IMS repo safely. Never edits, commits, or runs mutations.

**When to use**: When you need to understand existing code, designs, or architecture before planning a change.

**Arguments**: Pass the area to explore, e.g. `/safe-explore src/components/shared` or `/safe-explore docs/design/MC71`

**Files to read**: Whatever the user specifies in the argument.

**Files NOT to touch**: Nothing — this command is read-only.

**Behavior**:
1. Read the specified files/directories
2. Summarize findings with file paths and line references
3. Note: relevant patterns, existing utilities to reuse, safety boundaries seen
4. Flag anything that looks like a governance gate or blocked feature

**Output format**:
```
## Safe Explore: [area]

### Files Found
- [path] — [description] ([line count] lines)

### Key Findings
- [finding with file:line reference]

### Reusable Patterns Found
- [pattern]: [file:line]

### Safety Flags
- [any governance gates, blocked features, or preview-only routes]
```

**Token-saving rules**:
- Read only the files explicitly requested
- Use grep/find for symbol search before reading whole files
- Report line ranges, not full file contents

**Safety boundaries**:
- No file writes, no commits, no npm commands, no git mutations
- Read-only: Read, Bash(find/grep/git log/git diff), no Edit/Write
