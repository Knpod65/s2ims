# /sync-design-system — Design System Consistency Check

**Purpose**: Verify that new or existing components match the S²IMS design system tokens and principles.

**When to use**: Before committing new UI components, or when reviewing a PR that adds UI patterns.

**Files to read**:
1. `src/config/theme.ts` — token reference
2. `src/components/shared/Button.tsx` — Button reference implementation
3. `src/components/shared/StatusBadge.tsx` — StatusBadge reference
4. `docs/design/S2IMS_DESIGN_SYSTEM_DIRECTION_MC69.md` — design principles
5. The component(s) being reviewed

**Files NOT to touch**: Anything — read-only check.

**Behavior**:
1. Read theme.ts to understand token definitions
2. Read the component under review
3. Check: does it use Tailwind classes consistent with statusColors/typography/radius in theme.ts?
4. Check: does it follow the Button/StatusBadge class composition pattern?
5. Check: does it respect WCAG 2.1 AA contrast and focus-visible patterns?

**Output format**:
```
## Design System Check: [component name]

### Token Alignment
- Colors: ✅/⚠️ [note]
- Spacing: ✅/⚠️ [note]
- Typography: ✅/⚠️ [note]
- Border radius: ✅/⚠️ [note]

### Accessibility
- Focus ring: ✅/⚠️
- Contrast: ✅/⚠️
- ARIA roles: ✅/⚠️

### Pattern Consistency
- Class composition: ✅/⚠️ (uses array.filter(Boolean).join(' ') pattern)
- 'use client' directive: ✅/⚠️

### Issues Found
- [issue]: [recommendation]
```

**Token-saving rules**:
- Read only theme.ts + the component under review — not all 52 design docs

**Safety boundaries**: Read-only.
