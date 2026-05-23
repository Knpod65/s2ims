# S²IMS Login Visual Integration Component Mapping MC88

## Mapping Summary

| Component | Login Usage | Notes |
|---|---|---|
| `PageHeader` | Login page intro | Replaces the custom S²IMS hero block and provides semantic page-level structure. |
| `SafetyBanner` | Prototype / mock-auth notice | Communicates the login page boundary, mock auth status, and no-persistence safety note. |
| `SectionHeader` | Role selection section | Labels the role picker area and clarifies the purpose of the cards below. |
| `RoleBadge` | Selected role state | Adds a non-color selected-role marker next to the active role card. |
| `Button` | Language toggle and login action | Existing button behavior remains unchanged; MC88 only reuses the shared primitive. |
| `StatusBadge` | Prototype / selected state | Existing status badge behavior remains unchanged; MC88 still uses it for selected state signaling. |

## What Changed
- The login page now uses the new Soft Civic visual primitives for clearer hierarchy and safety messaging.
- The selected-role card includes a `RoleBadge` alongside the existing `StatusBadge`.
- The page header now carries the prototype label and the role-selection section is explicitly named.

## What Did Not Change
- Mock auth flow.
- Language toggle behavior.
- Role selection behavior.
- Role routing after login.
- Any governed import/review route.
- Any persistence, API, or audit behavior.

## Behavior Boundaries
- The new primitives are presentational only.
- They do not change data flow or business logic.
- They do not enable Confirm Import, persistence, audit writes, or official evidence.
