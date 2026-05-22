# S²IMS Tailwind Token Mapping — Soft Civic Intelligence Handoff

**Purpose**: Bridge the new Claude Design tokens to the existing S²IMS Tailwind + theme configuration without breaking current implementation.

**Location**: docs/figma-handoff/s2ims-soft-civic-intelligence/handoff/tailwind-token-mapping.md

**Important Constraint**:
- This is a **mapping document only**.
- No changes to `package.json`, `tailwind.config.js`, or `src/config/theme.ts` are authorized by this handoff.
- IBM Plex Sans / Thai / Mono fonts are **not** added as npm dependencies in this phase. Use system-fallback CSS strategy first (see below).

---

## Current State (Pre-Handoff)

- Primary font stack is system UI with some IBM Plex usage in limited places
- Theme tokens live in `src/config/theme.ts` (role colors, status colors, radii)
- Button and StatusBadge primitives were last updated in MC71 / MC17 lineage
- Existing radius scale is inconsistent (some 4px, some 8px, some 12px)
- Preview/warning colors are not yet visually distinct in all contexts

---

## Recommended Tailwind Extension Strategy (Future MC86+)

When an implementation branch is approved, the following extension pattern is suggested (do **not** apply yet):

```js
// tailwind.config.js (future reference only)
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          paper: 'var(--surface-paper)',
          warm: 'var(--surface-warm)',
        },
        role: {
          admin: 'var(--role-admin)',
          staff: 'var(--role-staff)',
          // ... other roles
        },
        status: {
          preview: 'var(--status-preview)',
          blocked: 'var(--status-blocked)',
          // ... other statuses
        }
      },
      borderRadius: {
        's2ims-card': 'var(--radius-card)',      // 14px
        's2ims-control': 'var(--radius-control)', // 8px
        's2ims-small': 'var(--radius-small)',     // 4px
      },
      fontFamily: {
        's2ims-sans': 'var(--font-sans)',
        's2ims-thai': 'var(--font-thai)',
        's2ims-mono': 'var(--font-mono)',
      }
    }
  }
}
```

**Font Loading Note**:
IBM Plex Sans, IBM Plex Sans Thai, and IBM Plex Mono are **not** installed via npm in this handoff. 
Recommended first step: add `@font-face` declarations or use Google Fonts / self-hosted WOFF2 with `font-display: swap` in a future CSS-only layer. Do not add font packages to `package.json` without explicit governance approval.

---

## Migration Table

| Token (New)              | CSS Var                     | Tailwind Name (Suggested)     | Current Equivalent (src/config/theme.ts or hard-coded) | Implementation Status |
|--------------------------|-----------------------------|-------------------------------|----------------------------------------------------------|-----------------------|
| surface.paper            | --surface-paper             | surface-paper                 | #F8F7F4 (approx)                                         | Not yet mapped        |
| surface.warm             | --surface-warm              | surface-warm                  | #F0EDE5 (approx)                                         | Not yet mapped        |
| text.ink                 | --text-ink                  | text-ink                      | #1A1C1E                                                | Not yet mapped        |
| role.admin               | --role-admin                | role-admin                    | #2E2B5E (approx)                                         | Partial (MC71)        |
| role.staff               | --role-staff                | role-staff                    | #2E5B4A                                                | Partial               |
| role.provider            | --role-provider             | role-provider                 | #8B5E2B                                                | Partial               |
| role.student             | --role-student              | role-student                  | #2E5B8C                                                | Partial               |
| role.esq                 | --role-esq                  | role-esq                      | #6B3B6B                                                | Not present           |
| role.public              | --role-public               | role-public                   | #4A5B3A                                                | Not present           |
| status.success           | --status-success            | status-success                | green-700                                              | Exists (MC71)         |
| status.warning           | --status-warning            | status-warning                | amber-700                                              | Exists (MC71)         |
| status.preview           | --status-preview            | status-preview                | (currently collides with warning)                      | **Critical gap**      |
| status.blocked           | --status-blocked            | status-blocked                | gray-500                                               | Not distinct          |
| radius.card              | --radius-card (14px)        | rounded-s2ims-card            | rounded-xl (12px) or rounded-2xl (16px)                | Inconsistent          |
| radius.control           | --radius-control (8px)      | rounded-s2ims-control         | rounded-lg (8px)                                       | Inconsistent          |
| radius.small             | --radius-small (4px)        | rounded-s2ims-small           | rounded (4px)                                          | Inconsistent          |
| shadow.soft              | --shadow-soft               | shadow-s2ims-soft             | shadow-sm                                              | Inconsistent          |
| font.sans / thai / mono  | --font-sans / --font-thai   | font-s2ims-sans / thai        | system-ui + limited IBM Plex                           | Font strategy pending |

**Key Observation**:
The single most important visual safety fix is making `--status-preview` (magenta-violet) visually distinct from `--status-warning` (amber). This distinction currently does not exist reliably in the codebase.

---

## How to Use This Mapping (MC86 Guidance)

1. **Phase 0 (Token Alignment)**: Add the CSS custom properties from `design-tokens.css` into a global stylesheet (e.g., `src/app/globals.css` or a new `src/styles/tokens.css`). No Tailwind config change required yet.
2. **Phase 1**: Refactor existing Button and StatusBadge to accept a `variant` prop that maps to the new CSS vars while keeping the current API surface intact.
3. **Phase 2+**: Gradually replace hard-coded colors and radii with the CSS var equivalents.
4. **Font Strategy**: Add IBM Plex font loading in a later CSS-only layer (after token alignment is proven stable). Do not touch `package.json`.

---

## What Not To Do

- Do **not** add `ibm-plex-sans`, `ibm-plex-sans-thai`, or `ibm-plex-mono` to `dependencies` or `devDependencies` without a separate approved milestone.
- Do **not** delete or overwrite `src/config/theme.ts` until a full migration plan is reviewed.
- Do **not** change any component prop APIs that would require updates to every call site in the same PR.

This mapping is the authoritative reference for any future visual implementation work on the Soft Civic Intelligence redesign.

**End of Tailwind Token Mapping**
