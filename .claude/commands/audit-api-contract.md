# /audit-api-contract — API Contract Audit

**Purpose**: Verify type consistency between API layer, lib types, and component usage.

**When to use**: After adding new data models, before implementing a new page, or when debugging type errors.

**Files to read**:
1. `src/lib/types.ts` — domain models (Application, Scholarship, Announcement, etc.)
2. `src/lib/` — all utility files
3. The specific component/page under review

**Files NOT to touch**: Read-only.

**Behavior**:
1. Read types.ts to understand the data model
2. For the component/page specified, check: are all props typed correctly against src/lib/types.ts?
3. Check: are role enums used consistently (ADMIN, SCHOLARSHIP_STAFF, PROVIDER, STUDENT, ESQ)?
4. Flag: any `any` types, implicit any, or missing types

**Output format**:
```
## API Contract Audit: [scope]

### Type Coverage
- Typed props: [N]/[N]
- Untyped / implicit any: [list]

### Role Enum Usage
- Consistent: ✅/⚠️
- Issues: [list]

### Recommendations
- [file:line]: [issue and fix]
```

**Safety boundaries**: Read-only.
