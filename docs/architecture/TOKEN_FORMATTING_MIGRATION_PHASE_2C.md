# Token Formatting Migration Phase 2C

## Purpose

Renovation Phase 2C adopts token formatting utilities only where the rendered output is guaranteed identical. This is the first safe runtime use of the Phase 2A read-only config files.

No route, auth, navigation, status, disclosure, export, role guard, mock data, or privacy visibility behavior was changed.

## Migration Plan

| File | Current expression | Replacement | Output identical? | Risk |
|---|---|---|---|---|
| `src/app/staff/applications/[id]/page.tsx` | `` `Student #S-${app.student_id.slice(-4)}` `` | `formatStudentToken(app.student_id)` | Yes for numeric student IDs such as `650912345` -> `Student #S-2345` | Low |

## Files Migrated

### `src/app/staff/applications/[id]/page.tsx`

Before:

```tsx
token: `Student #S-${app.student_id.slice(-4)}`,
```

After:

```tsx
const studentToken = formatStudentToken(app.student_id)

token: studentToken,
```

The rendered masked token remains the same. The page still displays the raw `app.student_id` in its page title because changing that would alter staff-facing behavior and belongs in a later approved privacy/access-control phase.

## Skipped Locations

| Location | Reason skipped |
|---|---|
| `src/data/mock/providerData.ts` preformatted `Candidate #C-XXXX` values | Raw mock data values must not be altered in Phase 2C. |
| `src/data/mock/staffData.ts` preformatted `Student #S-XXXX` and `Candidate #C-XXXX` values | Mock data values are already tokenized; changing data shape or literals is outside scope. |
| `src/data/mock/adminData.ts` preformatted audit tokens | Admin audit mock data is a high-risk governance surface and should not be changed without audit/export tests. |
| Provider candidate cards/tables using `candidate.candidateToken` | Tokens are passed through from already-tokenized mock data and also used as keys/selection IDs. |
| Staff disclosure and matching components using `candidateToken` or `studentToken` props | These components render tokens provided by their data source; reformatting could mask data-quality issues or alter existing token strings. |
| `src/app/admin/export/page.tsx` raw export fields | Export behavior is explicitly out of scope and high risk. |
| Staff raw student ID displays | These are privacy-sensitive behavior decisions, not token-formatting duplication. |
| Documentation and config mentions of `Candidate #C-XXXX` / `Student #S-XXXX` | These are explanatory references, not runtime formatting. |

## Remaining Hard-Coded Token Occurrences

Remaining `Candidate #` and `Student #` strings are acceptable after Phase 2C when they are:

- token format documentation,
- config/documentation constants,
- pre-tokenized mock data,
- privacy notice copy,
- or component displays of already-tokenized props.

The only known generated token formatting expression migrated in this phase was the staff application masked profile token.

## Privacy Impact

- Student identity exposure did not increase.
- Candidate identity exposure did not increase.
- Provider candidate pool remains token-only.
- Staff masked profile token output remains unchanged.
- Admin export and audit behavior remain unchanged.

## Behavior Unchanged Statement

Phase 2C changed token formatting implementation only for one generated staff masked-profile token. The visible output remains identical. No app behavior, route access, role guard, export behavior, disclosure behavior, or status rendering changed.

## Future Phase 2D Recommendation

Recommended Phase 2D: create a small privacy/token smoke checklist or lightweight test harness for token output before expanding formatter adoption.

Suggested sequence:

1. Add explicit token output checks for `formatStudentToken`, `formatCandidateToken`, and `formatAuditEventToken`.
2. Confirm staff application detail still renders the same `Student #S-XXXX` token.
3. Keep provider candidate token values data-driven and do not reformat selection keys.
4. Do not start status, role, sensitive-action, or export config wiring until token output checks are stable.
