# S2IMS Role-Based Route Inventory MC68

## Purpose
This inventory lists the current application routes that are relevant to the role-based manual. It is limited to routes that exist in the current repository state.

## Inventory
| Route | Route group | Primary role | Page purpose | Current status | Screenshot required | Safety note | Production readiness note |
|---|---|---|---|---|---|---|---|
| `/` | Public/Auth | Public | Landing redirect or home entry | Active | Yes | No sensitive action | Not a production workflow boundary |
| `/login` | Public/Auth | Public / all roles | Role selection entry | Active | Yes | Prototype authentication only | Not real auth |
| `/scholarships` | Public/Auth | Public / Student | Public scholarship listing | Active | Yes | Demo-safe listing | Informational only |
| `/scholarships/[id]` | Public/Auth | Public / Student | Scholarship detail view | Dynamic route | Yes | Use synthetic identifiers only | Not a submission flow |
| `/admin/dashboard` | Admin | Admin | System overview | Active | Yes | Synthetic/demo data only | Not a production control surface |
| `/admin/users` | Admin | Admin | User management view | Active | Optional | Admin-only review surface | Not a provisioning workflow |
| `/admin/permissions` | Admin | Admin | Permissions review | Active | Optional | Role-only configuration view | Not production authorization logic |
| `/admin/audit-log` | Admin | Admin | Audit event review | Active | Yes | No official evidence language | Read-only review surface |
| `/admin/export` | Admin | Admin | Export preview surface | Active | Optional | No real export handoff | Not a data-release approval |
| `/admin/settings` | Admin | Admin | Settings review | Active | Optional | Preview-safe settings only | Not a live system settings center |
| `/admin/master-data/import-preview` | Demo/Preview | Admin | Synthetic workbook preview | Preview-only | Yes | Confirm Import disabled/no-op | Not production import |
| `/admin/candidate-review-demo` | Demo/Preview | Admin / reviewer | Read-only diagnostic demo | Demo-only | Yes | Hidden route; no approval language | Not operational workflow |
| `/staff/dashboard` | Staff | Scholarship Staff | Operational overview | Active | Yes | Synthetic/demo data only | Not production processing |
| `/staff/applications` | Staff | Scholarship Staff | Application queue | Active | Yes | Safe preview records only | Not a final decision surface |
| `/staff/applications/[id]` | Staff | Scholarship Staff | Application detail view | Dynamic route | Yes | Use safe mock ids only | Read-only review unless page says otherwise |
| `/staff/announcements/new` | Staff | Scholarship Staff | Announcement authoring | Active | Optional | Mock content only | Not a publishing workflow |
| `/staff/announcements/[id]/preview` | Staff | Scholarship Staff | Announcement preview | Dynamic route | Optional | Preview only | Not publication approval |
| `/staff/students/[id]` | Staff | Scholarship Staff | Student review page | Dynamic route | Optional | Avoid real identities | Not a student admin workflow |
| `/staff/ocr` | Staff | Scholarship Staff | OCR review surface | Active | Optional | Demo-safe document examples only | Not a production OCR queue |
| `/staff/analytics` | Staff | Scholarship Staff | Analytics overview | Active | Optional | Aggregated preview data only | Informational only |
| `/staff/follow-up` | Staff | Scholarship Staff | Follow-up queue | Active | Optional | Preview-safe statuses only | Not a live outreach system |
| `/staff/matching-review` | Staff | Scholarship Staff | Matching review queue | Active | Optional | Review-only surface | Not a decision engine |
| `/staff/matching-review/[matchId]` | Staff | Scholarship Staff | Match detail | Dynamic route | Optional | Use synthetic identifiers only | Not a production match approval |
| `/staff/disclosure-requests` | Staff | Scholarship Staff | Disclosure request review | Active | Optional | Sensitive data boundary | Not a production disclosure tool |
| `/staff/data-quality` | Staff | Scholarship Staff | Data quality view | Active | Optional | Preview-safe records only | Informational only |
| `/provider/dashboard` | Provider | Provider | Provider overview | Active | Yes | Synthetic/demo data only | Not a production control surface |
| `/provider/candidates` | Provider | Provider | Candidate list | Active | Yes | Candidate privacy boundary applies | Not a real staffing export |
| `/provider/scholarships` | Provider | Provider | Scholarship portfolio | Active | Yes | Demo-safe portfolio data | Informational and review-only |
| `/provider/scholarships/new` | Provider | Provider | New scholarship draft | Active | Optional | Draft/demo content only | Not a live submission workflow |
| `/provider/scholarships/[scholarshipId]/edit` | Provider | Provider | Scholarship edit view | Dynamic route | Optional | Preview-safe edits only | Not production publishing |
| `/provider/scholarships/[scholarshipId]/criteria` | Provider | Provider | Criteria review view | Dynamic route | Optional | Review-only criteria | Not a production criteria engine |
| `/provider/scholarships/[scholarshipId]/candidates` | Provider | Provider | Candidate view for a scholarship | Dynamic route | Optional | Privacy boundary applies | Not a candidate export |
| `/provider/impact` | Provider | Provider | Impact summary | Active | Optional | Aggregated preview metrics only | Informational only |
| `/provider/insights` | Provider | Provider | Insights view | Active | Optional | Demo-safe analytics only | Informational only |
| `/provider/outcomes` | Provider | Provider | Outcomes view | Active | Optional | Preview-safe outcomes only | Informational only |
| `/student/dashboard` | Student | Student | Student overview | Active | Optional | Demo-safe student data only | Not a production account center |
| `/student/profile` | Student | Student | Profile view | Active | Optional | Synthetic profile only | Not a personal data system |
| `/student/profile/completion` | Student | Student | Profile completion view | Active | Optional | Preview-only steps | Not a live onboarding workflow |
| `/student/profile/improve` | Student | Student | Profile improvement view | Active | Optional | Advice-only surface | Not a scoring engine |
| `/student/recommendations` | Student | Student | Recommendation list | Active | Optional | Demo-safe recommendations only | Informational only |
| `/student/recommendations/explanation` | Student | Student | Recommendation explanation | Active | Optional | Preview-only reasoning | Informational only |
| `/student/recommendations/[scholarshipId]/explanation` | Student | Student | Scholarship-specific explanation | Dynamic route | Optional | Synthetic scholarship ids only | Informational only |
| `/student/scholarships/[scholarshipId]` | Student | Student | Scholarship detail for student | Dynamic route | Optional | Safe mock identifiers only | Not a submission endpoint |
| `/student/scholarships/[scholarshipId]/apply` | Student | Student | Apply flow view | Dynamic route | Optional | Demo-safe application flow | Not a production application gateway |
| `/student/applications` | Student | Student | Application list | Active | Yes | Safe mock records only | Informational only |
| `/student/applications/new` | Student | Student | New application entry | Active | Optional | Demo-safe drafts only | Not a live submission workflow |
| `/student/applications/[applicationId]` | Student | Student | Application detail | Dynamic route | Yes | Safe mock ids only | Read-only unless page says otherwise |
| `/student/applications/[applicationId]/edit` | Student | Student | Application edit view | Dynamic route | Optional | Demo-safe edit surface | Not a production update path |
| `/student/applications/[applicationId]/documents` | Student | Student | Application documents view | Dynamic route | Optional | Synthetic documents only | Not a live document vault |
| `/student/notifications` | Student | Student | Notification list | Active | Optional | Preview-safe notifications only | Informational only |
| `/student/follow-up` | Student | Student | Follow-up view | Active | Optional | Preview-safe workflow only | Not a production outreach tool |
| `/esq/dashboard` | ESQ/Reviewer | ESQ / Reviewer | Review overview | Active | Yes | Review-only context | Not an approval endpoint |
| `/esq/history` | ESQ/Reviewer | ESQ / Reviewer | Review history | Active | Yes | Oversight history only | Not an approval log |
| `/esq/announcements/[id]/review` | ESQ/Reviewer | ESQ / Reviewer | Announcement review view | Dynamic route | Optional | Review-only language | Not production approval |

## Notes
- Dynamic routes use safe synthetic identifiers for documentation and screenshots.
- Screenshot requirement is marked “Optional” only for routes that are not essential to the core role walkthrough.
- Hidden/demo-only and preview-only routes must keep their safety boundaries in any future handoff.
