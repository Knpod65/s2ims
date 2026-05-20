# S²IMS Authentication & Account Strategy Plan MC51

## Purpose

Provide planning guidance for authentication and account strategies, focusing on using CMU email and alignment with existing Laravel/PHP authentication contexts mentioned in the MC51 form. This is documentation-only; no implementation occurs in MC51.

## CMU Email Login Context
- `cmu_mail` is the preferred principal identifier for internal staff and teacher accounts where available.
- Login options:
  - Primary: CMU email (SAML/OIDC or institutional SSO where supported)
  - Fallback: institutional username or staff ID where CMU SSO not available

## Laravel/PHP Context Notes (from MC51 form)
- Route and controllers:
  - `AuthMiddleware` for route protection
  - `AuthenController` callback() for SSO redirects
  - Session management via `session("uss")` style context
- Use secure session management and short-lived tokens

## Internal users
- Admins: full management access for configuration (not auto-granted)
- Governance reviewers: restricted UI access for audit and decision artifacts
- Staff/Teacher: accounts seeded from Staff_Master/Teacher_Master (pilot preview only)

## External fund provider users
- Limited view-only accounts, requiring explicit registration and vetting
- Access restricted to aggregated reports only (no PII)

## Account approval questions
- Admin approval required for account elevation (e.g., admin, governance reviewer)
- Pilot accounts can be provisioned in preview mode with isMock flag

## No implementation in MC51
- MC51 documents strategy only; no runtime changes or account provisioning are performed.

---

**Prepared for MC51 planning.**