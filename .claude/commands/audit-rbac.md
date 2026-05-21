# /audit-rbac — Role-Based Access Control Audit

**Purpose**: Audit that all routes properly enforce role-based access control via AppShell.

**When to use**: Before adding new routes, after changing AppShell, or when reviewing security boundaries.

**Files to read**:
1. `src/components/layout/AppShell.tsx` — RBAC enforcement
2. `docs/architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md` — expected role assignments
3. `src/app/**/page.tsx` — verify requiredRole usage (grep, don't read all)

**Files NOT to touch**: All source files — read-only audit.

**Behavior**:
1. Read AppShell.tsx to understand how requiredRole is enforced
2. Grep src/app for `requiredRole` usage
3. Cross-reference against route inventory: does every protected route have the correct role?
4. Flag: routes missing requiredRole, routes with wrong role, public routes that should be protected
5. Verify: AP-10B/AP-10C/AP-11 gates remain locked (no new enablement)

**Output format**:
```
## RBAC Audit Report

### Coverage
- Routes audited: [N]/[N]
- Routes with requiredRole: [N]
- Routes without requiredRole (public/expected): [N]

### Issues
- [route]: Missing requiredRole — expected [role]
- [route]: Wrong role assignment — has [role], should be [role]

### Governance Gates
- AP-10B (Confirm Import): 🔒 Locked
- AP-10C (Export Approval): 🔒 Blocked
- AP-11 (Approval Workflows): 🔒 Blocked

### Verdict: ✅ Pass / ⚠️ Issues Found
```

**Safety boundaries**: Read-only audit. Do NOT modify AppShell.tsx or any page.tsx.
