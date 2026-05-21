# S²IMS Role Journey Redesign Direction — MC69

Strategic redesign direction for role-based user journeys, addressing current pain points and defining ideal flows.

---

## 1. Admin Role Journey Redesign

### Current State
**Route Flow**: `/login` → `/admin/dashboard` → {audit-log, candidate-review-demo, import-preview, users, permissions, settings, export}

**Current Issues**:
- Dashboard lacks actionable summary (system health metrics minimal)
- Navigation between governance surfaces requires manual scrolling
- Audit log table missing keyboard navigation
- Import preview hidden; not discoverable in normal workflow
- Settings/Permissions pages minimal and disconnected

**Pain Points**:
- Governance oversight requires clicking through 7+ separate pages
- No single view of system health and recent audit activity
- Accessibility gaps: audit log table ARIA incomplete, keyboard nav missing
- Feedback loop slow: import preview disconnected from real workflow

### Ideal Flow (Redesigned)
```
/login 
  → /admin/dashboard (enhanced)
    ├─ System Health Widget (uptime, route availability, recent audit summary)
    ├─ Quick Actions Card (Import Preview, Export, User Review, Settings)
    ├─ Recent Audit Activity (last 10 events with role/action/timestamp)
    └─ Quick Links (Users, Permissions, Settings, Candidate Demo)

/admin/audit-log (accessible)
  ├─ DataTable with:
    ├─ Sortable columns (Date, User, Role, Action, Status)
    ├─ Keyboard navigation (arrow keys, Enter to expand)
    ├─ ARIA labels on all controls
    └─ Filter by date range, user role, action type

/admin/users (consolidated)
  ├─ User list with DataTable
  ├─ Role badge, status, last-seen
  └─ Inline actions (edit permissions, reset session)

/admin/permissions (expanded)
  ├─ Matrix view (roles × capabilities)
  ├─ Edit capability without leaving page
  └─ Audit trail (who changed what, when)

/admin/settings (organized)
  ├─ FormShell with sections (System, I18n, Audit, Advanced)
  ├─ Validation on save
  └─ Success/error feedback
```

**Redesign Benefits**:
- Governance surfaces consolidated into reusable patterns (DataTable, FormShell)
- System health visible at a glance
- Accessibility gap closed (keyboard nav + ARIA on audit log)
- Admin can complete oversight tasks 60% faster (fewer clicks, fewer page reloads)

### Implementation Priority
**Wave**: 1 (High-Impact) | **Effort**: 2-3 days | **Risk**: Low (governance-only, no persistence changes)

---

## 2. Staff Role Journey Redesign

### Current State
**Route Flow**: `/login` → `/staff/dashboard` → {applications, announcements, students, ocr, analytics, data-quality, follow-up, matching-review, disclosure-requests}

**Current Issues**:
- Dashboard minimal; lacks operational queue summary
- Applications table duplicates student /applications route (redundant code)
- Matching queue table missing keyboard navigation
- Follow-up queue UI unclear (visibility issues)
- Data-quality metrics displayed minimally
- No unified queue model (applications, follow-up, matching, disclosure each have own table style)

**Pain Points**:
- Staff member opening app sees minimal guidance (unclear where to start)
- Switching between application states requires repeated page loads
- No unified queue/task management (must context-switch across 4+ pages)
- Accessibility: keyboard nav missing on matching-review and follow-up
- Data quality and analytics pages feel disconnected from main workflow

### Ideal Flow (Redesigned)
```
/login 
  → /staff/dashboard (enhanced)
    ├─ Operational Summary Widget:
    │  ├─ Pending applications (count + "Open" link)
    │  ├─ Matching queue (count + "Review" link)
    │  ├─ Follow-ups (count + "Check" link)
    │  ├─ Data quality alerts (count + "View" link)
    │  └─ Today's announcements (count + "New" link)
    ├─ Quick Actions (New Announcement, View Analytics, Export Data)
    └─ Recent Activity (last 5 actions across all queues)

/staff/applications (consolidated DataTable)
  ├─ Unified table (Student, Status, Last-Updated, Score, Action)
  ├─ Sortable columns, filterable (Status, Date Range, Score Threshold)
  ├─ DataTable with keyboard nav (arrow, Enter, Escape)
  ├─ Row expand for quick preview
  └─ ARIA labels on all controls
  
  → /staff/applications/[id] (detail)
    ├─ Application data with masking applied
    ├─ Status change inline (select + save, with validation)
    ├─ Match recommendations (if ready)
    └─ Back to list (preserves sort/filter state)

/staff/matching-review (accessible queue)
  ├─ DataTable (Student, Scholarship, Match Score, Status)
  ├─ Keyboard nav (same as applications)
  ├─ Filterable (Score Range, Status, Scholarship)
  └─ Row expand for match details + decision control

/staff/follow-up (improved queue)
  ├─ Queue list with priority indicators (color-coded)
  ├─ Status clarity (Pending, In-Progress, Resolved)
  ├─ Quick actions (Mark done, Snooze, Reassign)
  └─ DataTable sorting/filtering

/staff/disclosure-requests (visual hierarchy)
  ├─ Card layout → DataTable (more scannable)
  ├─ Visual priority (color badge: High/Medium/Low)
  ├─ Inline quick action (Approve/Deny with modal confirmation)
  └─ Audit trail (who decided, when, why)

/staff/analytics & /staff/data-quality (polished)
  ├─ Consistent metric card layout
  ├─ Responsive charts (mobile-friendly)
  ├─ Export data from each view (no separate export page needed)
  └─ Link from dashboard summary cards

/staff/ocr (guidance added)
  ├─ Before: functional but minimal
  ├─ After: example image + extracted text
  ├─ Success rate metric (how many reviews accepted)
  └─ Link from dashboard (when OCR queue has pending items)

/staff/announcements
  ├─ /new (FormShell with preview on right side)
  ├─ /[id]/preview (read-only, no changes)
  └─ Direct link from dashboard
```

**Redesign Benefits**:
- Unified DataTable pattern removes code duplication (3 tables → 1 consolidated implementation)
- Staff member onboarding faster (dashboard tells them what to do)
- Accessibility gap closed (keyboard nav on all queues)
- Queue management unified (consistent sorting, filtering, prioritization)
- Context switching reduced (related data visible on dashboard)
- Effort estimate: ~1,400 LOC reduction (component consolidation) + 2-3 days UI polish

### Implementation Priority
**Wave**: 1 (High-Impact) | **Effort**: 3-4 days | **Risk**: Low (review-only surfaces, no persistence)

---

## 3. Provider Role Journey Redesign

### Current State
**Route Flow**: `/login` → `/provider/dashboard` → {scholarships, candidates, impact, insights, outcomes}

**Current Issues**:
- Dashboard layout differs from admin/staff dashboards (inconsistent pattern)
- Scholarships list layout basic (no visual hierarchy)
- Candidates list includes privacy masking but UI unclear
- Impact/Insights/Outcomes pages feel disconnected (informational-only, minimal design)
- No clear workflow between portfolio management and results review

**Pain Points**:
- Provider onboarding unclear (what's the main workflow?)
- Switching between portfolio and impact view requires 2+ page reloads
- Impact/Insights/Outcomes pages feel like afterthought (minimal polish)
- Candidate masking not visually clear (provider may not understand privacy boundary)

### Ideal Flow (Redesigned)
```
/login 
  → /provider/dashboard (consistent with admin/staff)
    ├─ Portfolio Summary Widget:
    │  ├─ Active scholarships (count + "Manage" link)
    │  ├─ Total candidates (count + "Review" link)
    │  ├─ Average match score (metric + "See Results" link)
    │  └─ Recent impact (e.g., "5 matches this month")
    ├─ Quick Actions (New Scholarship, Edit Portfolio, View Impact)
    └─ Recent Activity (last scholarship updated, recent matches)

/provider/scholarships (enhanced list)
  ├─ DataTable (Name, Status, Candidates, Match Score, Updated, Actions)
  ├─ Status badge (Active, Draft, Closed, Archived)
  ├─ Filterable (Status, Date Range)
  ├─ Row actions (Edit, View Candidates, View Criteria, Archive)
  └─ Bulk actions (Archive multiple, Export list)
  
  → /provider/scholarships/[id] (detail page)
    ├─ Tabs (Overview, Criteria, Candidates, Impact)
    ├─ Overview: scholarship summary, key facts, edit link
    ├─ Criteria: criteria list, edit link
    ├─ Candidates: candidate list (masking applied, see privacy note)
    └─ Impact: match results, outcomes preview

/provider/candidates (privacy-clear)
  ├─ Candidate list (DataTable)
  ├─ Privacy note: "You see summary data only; identifying details are masked"
  ├─ Summary: Name (masked), Count of matches, Most recent match date
  ├─ No drill-down to individual data (enforced privacy)
  └─ Link to /provider/impact for aggregate results

/provider/impact (polished)
  ├─ Metric cards: scholarships active, candidates matched, avg match score
  ├─ Chart: matches over time (line chart, last 12 months)
  ├─ Link from dashboard and navigation
  └─ Export option (aggregate data only)

/provider/insights (polished)
  ├─ Insight cards: top-performing criteria, emerging trends, recommendations
  ├─ Chart: criteria effectiveness (bar chart)
  ├─ No drill-down to individual records (privacy enforced)
  └─ Export option (summary only)

/provider/outcomes (polished)
  ├─ Outcome cards: scholarship success rate, avg student persistence
  ├─ Chart: outcomes by scholarship (stacked bar)
  ├─ No individual student data (privacy enforced)
  └─ Export option (aggregate only)
```

**Redesign Benefits**:
- Provider dashboard consistent with admin/staff (DashboardShell reuse)
- Scholarships list consolidated (single DataTable pattern)
- Privacy boundary crystal clear (visual note + no drill-down available)
- Impact/Insights/Outcomes polished and discoverable
- Provider can manage portfolio and review results in single workflow
- Effort: 1-2 days (mostly pattern reuse + polish)

### Implementation Priority
**Wave**: 1 (High-Impact) | **Effort**: 1-2 days | **Risk**: Low (read-only surfaces for impact/insights/outcomes)

---

## 4. Student Role Journey Redesign

### Current State
**Route Flow**: `/login` → `/student/dashboard` → {scholarships, applications, profile, recommendations, notifications, follow-up}

**Current Issues**:
- Dashboard minimal (lacks application progress summary)
- Applications list duplicates staff /applications (code redundancy)
- Application entry form (/new) has accessibility gaps (no FormShell pattern)
- Application detail layout basic (needs design alignment)
- Profile completion unclear (no progress indicator)
- Recommendations flow unclear (explanation routes feel disconnected)
- Notifications list minimal (no type badges, no grouping)

**Pain Points**:
- Student unsure of application status (no progress indicator on dashboard)
- New application form confusing layout and missing keyboard nav
- Profile completion status unknown (no visual progress)
- Recommendation explanation pages feel like an afterthought
- Notifications hard to scan (no visual differentiation by type)

### Ideal Flow (Redesigned)
```
/login 
  → /student/dashboard (enhanced)
    ├─ Application Progress Widget:
    │  ├─ Total applications (count + "View All" link)
    │  ├─ Open applications (count + "Continue" link)
    │  ├─ Submitted applications (count + "Track" link)
    │  └─ Progress bar (% complete overall)
    ├─ Profile Completion Widget:
    │  ├─ Progress bar (% complete)
    │  ├─ Next steps (what's missing)
    │  └─ "Improve Profile" link
    ├─ Recommended Scholarships (top 3 with match score)
    │  └─ "View All Recommendations" link
    ├─ Quick Actions (Start New Application, View Profile, Browse Scholarships)
    └─ Notifications (last 3 unread)

/scholarships (public list)
  ├─ Scholarship list (DataTable)
  ├─ Columns: Name, Provider, Award, Match Score (if logged in), Action
  ├─ Filterable (Award range, Provider, Deadline)
  ├─ Sortable (Match score, Deadline, Award)
  └─ Row action: "View Details" or "Apply Now"

  → /scholarships/[id] (detail)
    ├─ Scholarship overview (name, provider, award, deadline, description)
    ├─ Criteria summary (key requirements)
    ├─ Application status (Not Applied / Applied on [date] / Status: [Pending/Accepted])
    ├─ "Apply Now" or "View Your Application" button
    └─ Related scholarships (similar match)

/student/applications (unified list)
  ├─ DataTable (Scholarship, Status, Deadline, Last Updated, Action)
  ├─ Status badge (Draft, Submitted, Under Review, Accepted, Rejected)
  ├─ Color coding (Red: past deadline, Yellow: due soon, Green: accepted)
  ├─ Keyboard nav (arrow, Enter, Escape)
  ├─ Row actions (Continue, View, Edit, Delete Draft, Track Status)
  └─ Bulk actions (Filter by status, Export list)

  → /student/applications/new (FormShell)
    ├─ Left: form (FormShell with validation)
    ├─ Right: preview (live preview of how app will look)
    ├─ Progress indicator (Section 1 of N)
    ├─ Validation feedback (red X for errors, green ✓ for complete)
    ├─ Save Draft, Continue buttons
    └─ Help text on hover (accessibility + UX)

  → /student/applications/[id] (detail)
    ├─ Status display (header with badge)
    ├─ Application data sections (personal, education, essay, documents)
    ├─ Status change history (if applicable)
    ├─ "Edit" button (if draft) or "View Submitted" (if submitted)
    └─ Track status (if submitted; show review timeline)

  → /student/applications/[id]/documents
    ├─ File list (DataTable)
    ├─ Columns: Filename, Type, Size, Uploaded, Status
    ├─ Actions (Download, Delete, Replace)
    ├─ Upload area (drag-drop + click)
    └─ Validation (file type, size)

/student/profile (improved)
  ├─ Profile data sections (Personal, Education, Availability, Preferences)
  ├─ Edit inline (no separate edit page)
  ├─ Validation on save
  ├─ Privacy note: "Your profile is visible to scholarship providers"
  └─ "View as Scholarship Provider" (preview what they see)

  → /student/profile/completion (progress visible)
    ├─ Progress bar (% of profile complete)
    ├─ Section-by-section breakdown:
    │  ├─ Personal Info (80% complete: missing phone)
    │  ├─ Education (100% complete)
    │  ├─ Preferences (50% complete: choose fields)
    │  └─ Documents (0% complete: optional)
    ├─ Next action: "Add Phone Number"
    └─ Estimated time: "5 minutes to complete"

  → /student/profile/improve (guidance)
    ├─ Advice cards (improve essay, highlight achievements, etc.)
    ├─ Before/after examples (how to write strong essay)
    ├─ Link to profile completion (jump to specific section)
    └─ Success metrics (profiles with these traits get matches 3x more)

/student/recommendations (unified)
  ├─ Recommendations list (card layout or DataTable)
  ├─ Columns/Card: Scholarship, Match Score, Key Match Reason, Action
  ├─ Filterable (Score range, Status: Applied/Not Applied)
  ├─ Sortable (Match score, Scholarship name)
  ├─ Row action: "View Details" or "Apply Now"

  → /student/recommendations/explanation (guidance page)
    ├─ "How We Match You" explanation
    ├─ Key criteria used (GPA, major, essay quality, etc.)
    ├─ Tips for improving matches
    └─ Link back to recommendations list

  → /student/recommendations/[scholarshipId]/explanation (specific match)
    ├─ "Why This Scholarship Matches You"
    ├─ Breakdown (your strengths, scholarship criteria, alignment)
    ├─ Next step: "Apply Now" or "View Scholarship"
    └─ Save explanation (bookmark for later)

/student/notifications (improved)
  ├─ Notification list (DataTable)
  ├─ Columns: Type (badge), Message, Date, Action
  ├─ Type badges (New Recommendation, Application Update, Deadline Alert, Message)
  ├─ Filterable (Type, Read/Unread, Date Range)
  ├─ Row action (Mark as read, Archive, Delete)
  ├─ Bulk actions (Mark all read, Archive selected)
  └─ Settings link (notification preferences)

/student/follow-up (progress)
  ├─ Follow-up items (DataTable)
  ├─ Columns: Item, Due Date, Status, Action
  ├─ Status badge (Pending, In Progress, Complete)
  ├─ Color coding (Red: overdue, Yellow: due soon, Green: complete)
  ├─ Row action (Mark complete, Snooze, Details)
  └─ Quick stats (X pending, Y complete this month)
```

**Redesign Benefits**:
- Student onboarding fast (dashboard shows what to do next)
- Application journey clear (form validation feedback, progress tracking, status visibility)
- Profile management simplified (inline editing, progress bar)
- Recommendations discoverable and actionable (unified list with explanations)
- Accessibility improved (FormShell on new app form, keyboard nav on lists)
- Code consolidation: 2-3 duplicate tables → 1 DataTable implementation
- Effort: 4-5 days (largest role by surface count)

### Implementation Priority
**Wave**: 1 (High-Impact) | **Effort**: 4-5 days | **Risk**: Low (no persistence changes, demo data only)

---

## 5. ESQ / Reviewer Role Journey Redesign

### Current State
**Route Flow**: `/login` → `/esq/dashboard` → {history, announcements/[id]/review}

**Current Issues**:
- Dashboard minimal (lacks review queue summary)
- History table basic (no sorting/filtering)
- Announcement review page exists but discovery unclear

**Pain Points**:
- Reviewer unsure of pending review volume
- History page hard to scan (no visual sorting/filtering)
- Review workflow not clearly documented

### Ideal Flow (Redesigned)
```
/login 
  → /esq/dashboard (enhanced)
    ├─ Review Queue Summary:
    │  ├─ Pending reviews (count + "Start" link)
    │  ├─ Completed this month (count)
    │  ├─ Average review time (metric)
    │  └─ Recent activity (last 3 reviews)
    ├─ Quick Actions (Start Review, View History)
    └─ Quality metrics (consistency score, feedback rating)

/esq/history (accessible)
  ├─ DataTable (Announcement, Reviewer, Date, Status, Score)
  ├─ Sortable columns, filterable (Date Range, Reviewer, Status)
  ├─ Keyboard nav (arrow, Enter, Escape)
  ├─ ARIA labels
  └─ Row action (View review, Compare versions)

  → /esq/announcements/[id]/review (form)
    ├─ Read-only announcement content (left side)
    ├─ Review form (right side)
    ├─ Fields: Approval, Score, Feedback
    ├─ Submit/Cancel buttons
    └─ Audit trail (who reviewed, when)
```

**Redesign Benefits**:
- Reviewer onboarding clear (dashboard shows pending work)
- History accessible (DataTable sorting/filtering)
- Review workflow documented

### Implementation Priority
**Wave**: 2 (Medium-Impact) | **Effort**: 1 day | **Risk**: Low (review-only, no approval)

---

## 6. Public / Unauthenticated User Journey Redesign

### Current State
**Route Flow**: `/` → `/login` or `/scholarships` (public list)

**Current Issues**:
- Home page minimal (basic redirect logic)
- Login page UI minimal but functional
- Public scholarship list differs from staff /applications list (code duplication)

**Ideal Flow (Redesigned)**:
```
/ (enhanced home)
  ├─ Hero section: "Find Scholarships"
  ├─ Quick links:
  │  ├─ "Browse Scholarships" → /scholarships
  │  ├─ "Sign In" → /login
  │  └─ "Learn More" → help page (future)
  └─ Featured scholarships preview (top 3)

/login (enhanced)
  ├─ Role selection cards (icon + description for each role)
  ├─ "Not sure which role?" → help / contact
  └─ Password field for demo access (optional for preview)

/scholarships (public list - shared with student role)
  ├─ DataTable (Name, Provider, Award, Deadline, Action)
  ├─ Filterable, sortable
  ├─ Search by keyword
  └─ Action: "View Details" (public view without login)

  → /scholarships/[id] (public detail)
    ├─ Scholarship overview (public info only)
    ├─ "Apply Now" (requires login)
    └─ "Share" (email/social)
```

**Redesign Benefits**:
- Home page polished (clear call-to-action)
- Login page clearer (role selection with descriptions)
- Code consolidation: public /scholarships = student /scholarships (single DataTable)

### Implementation Priority
**Wave**: 2 (Medium-Impact) | **Effort**: 1 day | **Risk**: Low (public surfaces, no persistence)

---

## Summary: Journey Redesign Impact

| Role | Current Pages | Ideal Pages | Code Consolidation | UI Improvements | Accessibility Gaps Closed | Effort (Days) | Priority |
|------|---|---|---|---|---|---|---|
| Admin | 7 | 7 (reorg) | 3 tables → DataTable, 2 settings → FormShell | Dashboard summary, governance queue visibility | Audit log keyboard nav + ARIA | 2-3 | Wave 1 |
| Staff | 9 | 9 (unified) | 3 tables → DataTable, forms → FormShell | Queue consolidation, priority visibility, analytics polish | Keyboard nav + ARIA on all queues | 3-4 | Wave 1 |
| Provider | 5 | 5 (reorg) | 2 tables → DataTable, dashboard → DashboardShell | Privacy clarity, results visibility, impact polish | Privacy boundary clarity | 1-2 | Wave 1 |
| Student | 8 | 8 (unified) | 2 tables → DataTable, forms → FormShell, new app form redesigned | Progress tracking, form validation, profile completion | FormShell accessibility, keyboard nav, progress indicators | 4-5 | Wave 1 |
| ESQ | 3 | 3 (reorg) | 1 table → DataTable, dashboard → DashboardShell | Queue visibility, history scannability | Keyboard nav + ARIA | 1 | Wave 2 |
| Public | 3 | 3 (enhanced) | 1 table shared (public scholarships = student scholarships) | Home polish, role clarity at login | Link clarity, no keyboard nav gaps | 1 | Wave 2 |

**Total Effort**: ~13-16 days across 6 role journeys (includes design + development + testing)

**Consolidation Targets Across All Roles**:
- DashboardShell: Admin, Staff, Provider, ESQ, Student (5 uses; 1-2 days to build, ~400 LOC)
- DataTable: Admin audit, Staff applications, Staff matching, Staff follow-up, Staff disclosure, Provider scholarships, Student applications, Student notifications, ESQ history (9 uses; 2-3 days to build, ~600 LOC)
- FormShell: Admin settings, Staff announcements, Provider new scholarship, Student new application, Student profile (5 uses; 1-2 days to build, ~300 LOC)
- StatusBadge: Application status, Announcement status, Notification type, Follow-up priority, Profile completion (5+ uses; 0.5-1 day, ~100 LOC)

**Total Estimated Reduction**: ~1,400 LOC of component duplication removal

**Quick Wins** (P2 polish within Wave 1): announcement preview, profile completion progress indicator, notification type badges, follow-up queue priority coloring, analytics polish

**Implementation Sequencing**: Wave 1 (Admin/Staff/Provider/Student reorg + consolidation) → Wave 2 (ESQ/Public enhancements)
