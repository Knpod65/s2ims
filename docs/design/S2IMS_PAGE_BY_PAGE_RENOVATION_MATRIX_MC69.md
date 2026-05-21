# S²IMS Page-by-Page Renovation Matrix — MC69

Complete page inventory with UX/accessibility findings, recommendations, and implementation complexity.

**Legend**: 
- Priority: P0 (safety), P1 (high-impact), P2 (polish), P3 (future)
- Complexity: ⚡ (simple), 🔧 (medium), 🏗️ (complex)
- Safety: ✅ (safe), 👁️ (preview-only), 🔒 (blocked)

| # | Route | Role | Purpose | Current Issue | Recommendation | Complexity | Priority | Safety | Screenshot |
|---|-------|------|---------|----------------|-----------------|------------|----------|--------|-----------|
| 1 | `/` | Public | Home/redirect | Basic redirect logic | Keep as-is (no UX changes) | ⚡ | P3 | ✅ | — |
| 2 | `/login` | All | Role selection | UI minimal but functional | Add role icons/descriptions | 🔧 | P2 | ✅ | mc68-001 |
| 3 | `/scholarships` | Public/Student | Scholarship listing | List layout differs from /staff/applications | Consolidate with DataTable | 🏗️ | P1 | ✅ | mc68-026 |
| 4 | `/scholarships/[id]` | Public/Student | Scholarship detail | Layout basic | Align with design system | 🔧 | P2 | ✅ | mc68-027 |
| 5 | `/admin/dashboard` | Admin | System overview | Layout inconsistent with /staff/dashboard | Extract DashboardShell | 🏗️ | P1 | ✅ | mc68-002 |
| 6 | `/admin/audit-log` | Admin | Audit trail table | Table missing keyboard nav; ARIA incomplete | Add DataTable + keyboard nav | 🏗️ | P1 | ✅ | mc68-003 |
| 7 | `/admin/candidate-review-demo` | Admin | Read-only demo | Content is safe; add approval language note | Add banner "Review-only" | ⚡ | P2 | 👁️ | mc68-004 |
| 8 | `/admin/master-data/import-preview` | Admin | Import preview | Confirm Import button disabled ✅ | Keep locked; UI polish only | ⚡ | P0 | 🔒 | mc68-005 |
| 9 | `/admin/export` | Admin | Export UI | Read-only enforced; UI unfinished | Polish export layout | 🔧 | P2 | ✅ | — |
| 10 | `/admin/permissions` | Admin | Permissions review | Minimal UI | Expand to matrix view | 🔧 | P3 | ✅ | — |
| 11 | `/admin/settings` | Admin | Settings review | Basic form | Align with form design system | 🔧 | P2 | ✅ | — |
| 12 | `/admin/users` | Admin | User list | Functional table | Migrate to DataTable | 🔧 | P1 | ✅ | — |
| 13 | `/staff/dashboard` | Staff | Operations overview | Layout inconsistent with admin | Extract DashboardShell | 🏗️ | P1 | ✅ | mc68-006 |
| 14 | `/staff/applications` | Staff | Applications queue | Table UI basic; duplicates /scholarships | Consolidate DataTable | 🏗️ | P1 | ✅ | mc68-007 |
| 15 | `/staff/applications/[id]` | Staff | Application detail | Layout needs accessibility review | Add keyboard nav + ARIA | 🔧 | P1 | ✅ | mc68-008 |
| 16 | `/staff/announcements/new` | Staff | Announcement authoring | Form layout inconsistent | Extract FormShell | 🔧 | P2 | ✅ | — |
| 17 | `/staff/announcements/[id]/preview` | Staff | Announcement preview | Preview-only; functional | Polish styling | ⚡ | P2 | ✅ | — |
| 18 | `/staff/students/[id]` | Staff | Student review | Privacy masking working | Review masking comprehensiveness | ⚡ | P2 | ✅ | — |
| 19 | `/staff/ocr` | Staff | OCR review surface | Functional but minimal | Add examples + guidance | 🔧 | P2 | ✅ | mc68-017 |
| 20 | `/staff/analytics` | Staff | Analytics dashboard | Functional, minimal design | Polish metrics display | 🔧 | P2 | ✅ | mc68-015 |
| 21 | `/staff/follow-up` | Staff | Follow-up queue | Functional; review-only | Improve queue visibility | 🔧 | P2 | ✅ | mc68-018 |
| 22 | `/staff/matching-review` | Staff | Matching queue | Missing keyboard nav | Add DataTable + keyboard nav | 🏗️ | P1 | ✅ | mc68-020 |
| 23 | `/staff/matching-review/[matchId]` | Staff | Match detail | Layout needs polish | Align with detail design system | 🔧 | P2 | ✅ | — |
| 24 | `/staff/disclosure-requests` | Staff | Disclosure review | Functional | Improve visual hierarchy | 🔧 | P2 | ✅ | mc68-019 |
| 25 | `/staff/data-quality` | Staff | Data quality view | Minimal dashboard | Expand metric display | 🔧 | P2 | ✅ | mc68-016 |
| 26 | `/provider/dashboard` | Provider | Portfolio overview | Layout differs from admin/staff | Extract DashboardShell | 🏗️ | P1 | ✅ | mc68-009 |
| 27 | `/provider/scholarships` | Provider | Scholarship portfolio | List inconsistent with staff /applications | Consolidate DataTable | 🏗️ | P1 | ✅ | mc68-010 |
| 28 | `/provider/scholarships/new` | Provider | New scholarship draft | Form layout inconsistent | Extract FormShell | 🔧 | P2 | ✅ | — |
| 29 | `/provider/scholarships/[id]/edit` | Provider | Scholarship edit | Edit form needs consistency | Align with form design system | 🔧 | P2 | ✅ | — |
| 30 | `/provider/scholarships/[id]/criteria` | Provider | Criteria review | Functional | Polish layout | ⚡ | P3 | ✅ | — |
| 31 | `/provider/scholarships/[id]/candidates` | Provider | Candidate view | Privacy boundary working | Review masking completeness | ⚡ | P2 | ✅ | — |
| 32 | `/provider/candidates` | Provider | Candidate list | Privacy protection active | Review list design | 🔧 | P2 | ✅ | mc68-021 |
| 33 | `/provider/impact` | Provider | Impact summary | Informational only | Polish metrics visualization | 🔧 | P3 | ✅ | mc68-022 |
| 34 | `/provider/insights` | Provider | Insights view | Informational only | Improve chart readability | 🔧 | P3 | ✅ | mc68-023 |
| 35 | `/provider/outcomes` | Provider | Outcomes view | Informational only | Polish layout | ⚡ | P3 | ✅ | mc68-024 |
| 36 | `/student/dashboard` | Student | Personal overview | Layout differs from other dashboards | Extract DashboardShell | 🏗️ | P1 | ✅ | mc68-025 |
| 37 | `/student/applications` | Student | Application list | Table duplicates staff /applications | Consolidate DataTable | 🏗️ | P1 | ✅ | mc68-011 |
| 38 | `/student/applications/new` | Student | New application entry | Form inconsistent; accessibility gaps | Extract FormShell + keyboard nav | 🏗️ | P1 | ✅ | — |
| 39 | `/student/applications/[id]` | Student | Application detail | Layout needs design alignment | Align with detail design system | 🔧 | P1 | ✅ | mc68-012 |
| 40 | `/student/applications/[id]/edit` | Student | Application edit | Form needs consolidation | Migrate to FormShell | 🔧 | P1 | ✅ | — |
| 41 | `/student/applications/[id]/documents` | Student | Documents view | Functional | Polish file list styling | ⚡ | P2 | ✅ | mc68-029 |
| 42 | `/student/profile` | Student | Profile view | Functional | Improve visual hierarchy | 🔧 | P2 | ✅ | — |
| 43 | `/student/profile/completion` | Student | Profile completion | Functional | Add progress indicator | 🔧 | P2 | ✅ | — |
| 44 | `/student/profile/improve` | Student | Profile improvement | Advice-only | Polish layout | ⚡ | P2 | ✅ | — |
| 45 | `/student/recommendations` | Student | Recommendations list | Functional | Improve recommendation cards | 🔧 | P2 | ✅ | mc68-028 |
| 46 | `/student/recommendations/explanation` | Student | Recommendation explanation | Functional | Polish typography | ⚡ | P2 | ✅ | — |
| 47 | `/student/recommendations/[scholarshipId]/explanation` | Student | Scholarship explanation | Functional | Polish typography | ⚡ | P2 | ✅ | — |
| 48 | `/student/scholarships/[scholarshipId]` | Student | Scholarship detail for student | Functional | Align with design system | 🔧 | P2 | ✅ | — |
| 49 | `/student/scholarships/[scholarshipId]/apply` | Student | Apply flow | Layout needs polish | Improve flow UX | 🔧 | P2 | ✅ | — |
| 50 | `/student/notifications` | Student | Notification list | Functional | Add notification type badges | 🔧 | P2 | ✅ | — |
| 51 | `/student/follow-up` | Student | Follow-up view | Functional | Polish layout | ⚡ | P2 | ✅ | — |
| 52 | `/esq/dashboard` | ESQ | Review overview | Layout inconsistent | Extract DashboardShell | 🏗️ | P1 | ✅ | mc68-013 |
| 53 | `/esq/history` | ESQ | Review history | Functional table | Migrate to DataTable | 🔧 | P1 | ✅ | mc68-014 |
| 54 | `/esq/announcements/[id]/review` | ESQ | Announcement review | Read-only; functional | Polish review UI | 🔧 | P2 | ✅ | mc68-030 |

---

## Summary

- **Total Pages**: 54
- **P0 (Safety)**: 1 (import preview — keep locked)
- **P1 (High-Impact)**: 15 (dashboards, tables, forms)
- **P2 (Polish)**: 28 (styling, spacing, accessibility)
- **P3 (Future)**: 10 (informational pages, low interaction)

**Consolidation Targets**: 5 (DashboardShell, DataTable, StatusBadge, FormShell, Config)

**Estimated Effort**: 
- DashboardShell: 4-6 hours
- DataTable: 6-8 hours
- StatusBadge + FormShell: 4-6 hours
- Config: 2-3 hours
- **Total Quick Wins**: ~3 days

