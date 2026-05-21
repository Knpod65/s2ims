# /pdpa-review — PDPA Compliance Review

**Purpose**: Review a page or feature for Thai Personal Data Protection Act (PDPA) compliance — specifically data display, masking, and privacy boundaries.

**When to use**: Before shipping any page that shows personal data (student info, application data, provider contacts).

**Files to read**:
1. `src/config/privacy.ts` — privacy configuration and masking rules
2. The page/component specified
3. `docs/architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md` — privacy notes per route

**Files NOT to touch**: Read-only.

**Behavior**:
1. Read privacy.ts to understand the masking rules in effect
2. For the specified page, check: is personal data masked appropriately?
3. Check: does the page respect the role's data visibility level?
4. Check: are PII fields (name, ID card, phone, email) masked for roles that should not see them?
5. Flag: unmasked PII, missing blur/truncation, roles seeing data they should not

**Output format**:
```
## PDPA Review: [scope]

### Data Fields Assessed
- [field]: [visible/masked] — [role] — [compliant ✅ / issue ⚠️]

### Issues
- [file:line]: [field] shown unmasked to [role] — should be masked
- [file:line]: Missing privacy warning for sensitive data section

### Verdict: ✅ Compliant / ⚠️ Issues / 🚨 Critical Issue
```

**Safety boundaries**: Read-only. Do NOT modify privacy.ts or any page.tsx.
