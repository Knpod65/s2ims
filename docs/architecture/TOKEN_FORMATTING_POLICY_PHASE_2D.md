# Token Formatting Policy (Phase 2D)

## Purpose

This policy defines where token formatting is allowed, required, or prohibited before broader formatter adoption. The objective is safer incremental migration with no behavior regressions.

## Core Rule: Display Token vs Raw ID

- Display token: user-facing masked identifier used in UI text, cards, and non-sensitive summaries.
- Raw ID: original identifier used for keys, lookups, selection state, export payloads, and evidence/audit integrity.

Never replace raw IDs in system logic paths with display tokens.

## When To Use `formatCandidateToken()`

Use for provider-facing and candidate-pool UI where identity must remain candidate-tokenized.

Examples:
- Provider candidate list labels.
- Candidate chips/badges in provider-side read-only views.
- Non-sensitive summary rows where candidate token is a display-only field.

Expected display pattern:
- `Candidate #C-XXXX`

## When To Use `formatStudentToken()`

Use for student identity display in staff-facing UI where student token view is the default and raw student IDs are not required in the rendered text.

Examples:
- Staff application details display labels.
- Staff review panels that present student identity in a masked format.

Expected display pattern:
- `Student #S-XXXX`

## When NOT To Format

Do not apply token formatting to:

- Preformatted mock tokens.
- Database IDs used as true identifiers.
- React keys.
- Selection IDs and value bindings.
- Export fields and export payload contracts.
- Admin audit raw evidence fields.

## Role-Specific Rules

### Provider rule

- Provider sees `Candidate #C-XXXX` only for candidate identity surfaces.
- Do not reveal student raw IDs or student token forms on provider screens.

### Staff rule

- Staff sees `Student #S-XXXX` by default on routine identity displays.
- Raw IDs remain allowed internally for logic keys and controlled evidence paths.

### Admin audit rule

- Admin audit views should use tokenized displays by default where feasible.
- Raw evidence fields may be preserved in future controlled/admin-only evidence views.

### Executive/ESQ rule

- Aggregate-only by default.
- No individual token display unless explicitly justified by approved requirements.

## Safe vs Unsafe Migration Examples

### Safe

- Rendering a staff-facing label:
  - `displayStudentId = formatStudentToken(application.student_id)`
  - Keep `application.student_id` unchanged for underlying lookup/actions.

- Rendering a provider candidate badge:
  - `displayCandidate = formatCandidateToken(candidate.id)`
  - Keep `candidate.id` unchanged for selection state.

### Unsafe

- Replacing `key={row.id}` with `key={formatStudentToken(row.id)}`.
- Writing tokenized values into export payload schema fields.
- Tokenizing values in admin audit evidence records where raw traceability is required.
- Re-tokenizing mock values already in `Candidate #C-XXXX` form.

## Current Phase 2C Baseline

- Adopted in one safe location: `src/app/staff/applications/[id]/page.tsx` using `formatStudentToken(app.student_id)`.
- Intentionally skipped for now:
  - preformatted mock tokens,
  - keys/selection IDs,
  - provider candidate token displays already aligned,
  - admin export fields,
  - raw staff/admin evidence surfaces.

## Migration Guardrail

Before each new adoption:

1. Confirm field is display-only.
2. Confirm no usage as key, selection state, or payload ID.
3. Confirm role policy alignment (Provider/Staff/Admin/ESQ).
4. Run token formatting checks and build.
