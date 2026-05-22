# S²IMS Screen Implementation Map — Soft Civic Intelligence Handoff

**Purpose**: Maps every major route to its source design round, required components, abstract motif, governance constraints, risk level, and implementation priority.

**Location**: docs/figma-handoff/s2ims-soft-civic-intelligence/handoff/screen-implementation-map.md

**Rule**: Any screen marked "governance-critical" must receive SafetyBanner + DisabledActionHint treatment before any other visual polish.

---

## Route Inventory

### 1. /login
- **Role**: Public / all roles (entry point)
- **Source Round**: Round 2 (Core Screens) + Round 3 (Public Discovery journey)
- **Components Needed**: Role selector, SafetyBanner (first-time preview notice), Button (primary), FormField
- **Abstract Motif**: Soft civic grid + warm paper background
- **Governance Notes**: Entry must not imply any data will be persisted or approved
- **Risk**: Low (public surface)
- **Implementation Priority**: High (first visible new visual language)
- **Dependencies**: Token alignment, Button, RoleBadge
- **What Must Remain Unchanged**: Current authentication logic and role storage

### 2. /admin/dashboard
- **Role**: Admin
- **Source Round**: Round 2 + Round 3 (Admin Governance journey)
- **Components Needed**: PageHeader, MetricCard (governance status), SafetyBanner (governance command center), RoleBadge, DataTable shell (recent activity)
- **Abstract Motif**: Central civic emblem + role accent
- **Governance Notes**: Must surface AP-10B / AP-10C / AP-11 blocker status at top
- **Risk**: High (governance visibility)
- **Implementation Priority**: High
- **Dependencies**: SafetyBanner, MetricCard, governance token colors
- **What Must Remain Unchanged**: Current data sources and no new audit writes

### 3. /admin/audit-log
- **Role**: Admin
- **Source Round**: Round 2
- **Components Needed**: PageHeader, SafetyBanner (evidence boundary), DataTable, FilterBar, RouteVerificationPanel (dev only)
- **Abstract Motif**: Evidence ledger motif (subtle grid)
- **Governance Notes**: Permanent "Evidence Boundary — Preview Only" banner required
- **Risk**: Critical (highest governance surface)
- **Implementation Priority**: Highest (after tokens)
- **Dependencies**: SafetyBanner, DataTable, status-preview color
- **What Must Remain Unchanged**: Existing audit event list, no new event types, PII masking rules

### 4. /admin/master-data/import-preview
- **Role**: Admin
- **Source Round**: Round 2 + MC54 existing implementation
- **Components Needed**: PageHeader, SafetyBanner (AP-10B locked), DisabledActionHint on Confirm Import, PreviewOnlyNotice, FormShell (file upload), DataTable (preview rows), RouteVerificationPanel
- **Abstract Motif**: Locked ledger + preview violet accents
- **Governance Notes**: Confirm Import must remain permanently disabled with lock + hint
- **Risk**: Critical (AP-10B gate)
- **Implementation Priority**: Highest
- **Dependencies**: SafetyBanner, DisabledActionHint, preview color distinction
- **What Must Remain Unchanged**: Confirm Import disabled, no persistence, no audit write on upload, ExcelJS browser-only parsing

### 5. /staff/applications
- **Role**: Staff
- **Source Round**: Round 2 + MC8 / MC17 lineage
- **Components Needed**: PageHeader, SafetyBanner (review queue), DataTable, StatusBadge, FilterBar, RoleBadge
- **Abstract Motif**: Review ledger with soft civic pattern
- **Governance Notes**: All actions are diagnostic or local-state only until future governance
- **Risk**: Medium-High
- **Implementation Priority**: High
- **Dependencies**: Existing candidate review shell (MC8), new safety components
- **What Must Remain Unchanged**: Local review state only, no persistence, no AP-10B events

### 6. /staff/applications/[id]
- **Role**: Staff
- **Source Round**: Round 3 (Staff Review journey) + MC8 detail
- **Components Needed**: PageHeader, SafetyBanner, SectionHeader, FeedbackCaptureCard, DisabledActionHint (any official actions), DocCompletenessRing (if present)
- **Abstract Motif**: Document review with civic watermark
- **Governance Notes**: "Recommendation only — not an approval"
- **Risk**: Medium
- **Implementation Priority**: Medium (after list view)
- **Dependencies**: FeedbackCaptureCard, safety primitives
- **What Must Remain Unchanged**: No official evidence creation, no AP-11 actions

### 7. /provider/dashboard
- **Role**: Provider
- **Source Round**: Round 3 (Provider journey)
- **Components Needed**: PageHeader, MetricCard (portfolio), SafetyBanner (if any preview data), RoleBadge
- **Abstract Motif**: Provider portfolio with warm paper
- **Governance Notes**: All data shown is read-only or preview until future upload flow
- **Risk**: Low-Medium
- **Implementation Priority**: Medium
- **Dependencies**: MetricCard, RoleBadge
- **What Must Remain Unchanged**: Current provider data sources

### 8. /provider/scholarships
- **Role**: Provider
- **Source Round**: Round 3
- **Components Needed**: PageHeader, DataTable, FilterBar, RoleBadge
- **Abstract Motif**: Scholarship grid
- **Governance Notes**: Read-only view
- **Risk**: Low
- **Implementation Priority**: Low
- **Dependencies**: DataTable shell

### 9. /provider/candidates
- **Role**: Provider
- **Source Round**: Round 3 + MC2/MC4 lineage
- **Components Needed**: PageHeader, DataTable (candidate pool), StatusBadge, SafetyBanner (if diagnostic)
- **Abstract Motif**: Candidate ledger
- **Governance Notes**: Token-only display, no raw PII
- **Risk**: Medium (PII masking)
- **Implementation Priority**: Medium
- **Dependencies**: Existing candidate pool components + new safety overlays

### 10. /student/applications
- **Role**: Student
- **Source Round**: Round 3 (Student journey)
- **Components Needed**: PageHeader, DataTable, StatusBadge, RoleBadge
- **Abstract Motif**: Student application cards with warm surface
- **Governance Notes**: Read-only personal view
- **Risk**: Low
- **Implementation Priority**: Low
- **Dependencies**: Existing student application list

### 11. /student/applications/[id]
- **Role**: Student
- **Source Round**: Round 3
- **Components Needed**: PageHeader, SectionHeader, MetricCard, FeedbackCaptureCard (if diagnostic), RoleBadge
- **Abstract Motif**: Personal document with civic watermark
- **Governance Notes**: No approval language
- **Risk**: Low
- **Implementation Priority**: Low
- **Dependencies**: Existing detail view

### 12. /scholarships (public)
- **Role**: Public
- **Source Round**: Round 3 (Public Discovery journey)
- **Components Needed**: PageHeader, DataTable or card grid, RoleBadge (public)
- **Abstract Motif**: Public discovery with soft civic pattern
- **Governance Notes**: Purely informational
- **Risk**: Low
- **Implementation Priority**: Low
- **Dependencies**: Public route safety

### 13. /scholarships/[id] (public)
- **Role**: Public
- **Source Round**: Round 3
- **Components Needed**: PageHeader, SectionHeader, MetricCard, SafetyBanner (if any preview data)
- **Abstract Motif**: Scholarship detail with warm paper
- **Governance Notes**: No application or approval flow in current scope
- **Risk**: Low
- **Implementation Priority**: Low

### 14. /esq/dashboard
- **Role**: ESQ / Reviewer
- **Source Round**: Round 3 (ESQ journey)
- **Components Needed**: PageHeader, SafetyBanner ("Recommendation Only"), DataTable, RoleBadge
- **Abstract Motif**: Reviewer ledger
- **Governance Notes**: Every output must be labeled "Recommendation — not an approval"
- **Risk**: High (language discipline)
- **Implementation Priority**: High
- **Dependencies**: SafetyBanner, explicit copy rules

### 15. /esq/history
- **Role**: ESQ
- **Source Round**: Round 3
- **Components Needed**: PageHeader, DataTable, StatusBadge
- **Abstract Motif**: Historical review list
- **Governance Notes**: No approval language in history either
- **Risk**: Medium
- **Implementation Priority**: Medium

### 16. /esq/announcements/[id]/review
- **Role**: ESQ
- **Source Round**: Round 3
- **Components Needed**: PageHeader, SafetyBanner, SectionHeader, FeedbackCaptureCard, DisabledActionHint (any official action)
- **Abstract Motif**: Announcement review with civic watermark
- **Governance Notes**: "Recommendation only"
- **Risk**: High (language + safety)
- **Implementation Priority**: High
- **Dependencies**: SafetyBanner, FeedbackCaptureCard

---

## Priority Summary

**Tier 1 (Implement First)**:
- /login
- /admin/audit-log
- /admin/master-data/import-preview
- /staff/applications (list + detail)
- /admin/dashboard
- /esq/* routes (language discipline critical)

**Tier 2 (After Tier 1 Stable)**:
- Provider and Student surfaces
- Public discovery surfaces

**Tier 3 (Later)**:
- Deep detail views, any new routes

**Never in Scope of Visual Polish**:
- Enabling Confirm Import
- Enabling Export
- Enabling Approve/Reject
- Creating new audit event types
- Persisting any data
- Opening AP-10B / AP-10C / AP-11

This map is the authoritative reference for screen-by-screen implementation sequencing in MC86 or later.

**End of Screen Implementation Map**
