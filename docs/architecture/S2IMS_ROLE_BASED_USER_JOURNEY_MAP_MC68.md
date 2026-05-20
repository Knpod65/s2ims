# S2IMS Role-Based User Journey Map MC68

## Purpose
This journey map shows the page-by-page paths that each role follows in the current app. It is designed to support the manual and screenshot journey pack without changing runtime behavior.

## Admin journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/login` | Enter admin mode | Select Admin and sign in | Admin session loads | `mc68-001-login.png` | Prototype login only |
| 2 | `/admin/dashboard` | Review system state | Open dashboard | Overview cards and audit summary render | `mc68-002-admin-dashboard.png` | Synthetic/demo data only |
| 3 | `/admin/audit-log` | Inspect activity | Open audit log | Audit table loads | `mc68-003-admin-audit-log.png` | No official evidence |
| 4 | `/admin/candidate-review-demo` | Review diagnostic preview | Open demo route | Read-only combined preview renders | `mc68-004-admin-candidate-review-demo.png` | Not approval or assignment |
| 5 | `/admin/master-data/import-preview` | Inspect import safety boundary | Open preview route | Validation, sheet detection, and disabled import boundary appear | `mc68-005-admin-master-data-import-preview.png` | Confirm Import disabled |

## Scholarship Staff journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/login` | Enter staff mode | Select Staff and sign in | Staff session loads | `mc68-001-login.png` | Prototype login only |
| 2 | `/staff/dashboard` | Review operational queue | Open dashboard | Staff overview loads | `mc68-006-staff-dashboard.png` | Preview-safe data only |
| 3 | `/staff/applications` | Scan applications | Open queue | Application table loads | `mc68-007-staff-applications.png` | Demo-safe records only |
| 4 | `/staff/applications/app_001` | Review a record | Open safe mock detail | Detail page loads | `mc68-008-staff-application-detail.png` | Safe mock id only |
| 5 | `/staff/analytics` | Inspect analytics | Open analytics | Metrics view loads | `mc68-015-staff-analytics.png` | Aggregated preview only |
| 6 | `/staff/data-quality` | Check data quality | Open data quality | Quality dashboard loads | `mc68-016-staff-data-quality.png` | Informational only |
| 7 | `/staff/ocr` | Review OCR surface | Open OCR page | OCR review view renders | `mc68-017-staff-ocr.png` | Demo-only examples |
| 8 | `/staff/follow-up` | Review follow-up queue | Open follow-up page | Follow-up view renders | `mc68-018-staff-follow-up.png` | Not a production outreach tool |
| 9 | `/staff/disclosure-requests` | Review disclosure items | Open disclosure requests | Request queue renders | `mc68-019-staff-disclosure-requests.png` | Sensitive boundary applies |
| 10 | `/staff/matching-review` | Review matches | Open matching review | Matching queue renders | `mc68-020-staff-matching-review.png` | Review only |

## Provider journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/login` | Enter provider mode | Select Provider and sign in | Provider session loads | `mc68-001-login.png` | Prototype login only |
| 2 | `/provider/dashboard` | Review portfolio overview | Open dashboard | Overview renders | `mc68-009-provider-dashboard.png` | Synthetic/demo data only |
| 3 | `/provider/scholarships` | Review scholarship portfolio | Open scholarship list | Portfolio list renders | `mc68-010-provider-scholarships.png` | Preview-safe data only |
| 4 | `/provider/candidates` | Inspect candidates | Open candidate list | Candidate list renders | `mc68-021-provider-candidates.png` | Privacy boundary applies |
| 5 | `/provider/impact` | Review impact | Open impact page | Impact summary renders | `mc68-022-provider-impact.png` | Aggregated preview only |
| 6 | `/provider/insights` | Review insights | Open insights page | Insights render | `mc68-023-provider-insights.png` | Informational only |
| 7 | `/provider/outcomes` | Review outcomes | Open outcomes page | Outcomes render | `mc68-024-provider-outcomes.png` | Informational only |

## Student journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/login` | Enter student mode | Select Student and sign in | Student session loads | `mc68-001-login.png` | Prototype login only |
| 2 | `/student/dashboard` | Review personal dashboard | Open dashboard | Student overview loads | `mc68-025-student-dashboard.png` | Demo-safe student data only |
| 3 | `/scholarships` | Browse public scholarships | Open public listing | Scholarship list renders | `mc68-026-public-scholarships.png` | Informational only |
| 4 | `/scholarships/[id]` | Inspect scholarship detail | Open safe scholarship | Scholarship detail renders | `mc68-027-public-scholarship-detail.png` | Synthetic identifiers only |
| 5 | `/student/recommendations` | Review recommendations | Open recommendations | Recommendation list renders | `mc68-028-student-recommendations.png` | Advice only |
| 6 | `/student/applications` | Review applications | Open list | Application list renders | `mc68-011-student-applications.png` | Demo-safe records only |
| 7 | `/student/applications/[applicationId]` | Inspect one application | Open safe application detail | Detail page renders | `mc68-012-student-application-detail.png` | Safe mock ids only |
| 8 | `/student/applications/[applicationId]/documents` | Inspect documents | Open documents view | Documents view renders | `mc68-029-student-application-documents.png` | Synthetic docs only |

## ESQ / Reviewer journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/login` | Enter reviewer mode | Select ESQ and sign in | ESQ session loads | `mc68-001-login.png` | Prototype login only |
| 2 | `/esq/dashboard` | Review oversight summary | Open dashboard | Review overview loads | `mc68-013-esq-dashboard.png` | Not an approval step |
| 3 | `/esq/history` | Review historical activity | Open history | History list renders | `mc68-014-esq-history.png` | Oversight only |
| 4 | `/esq/announcements/[id]/review` | Review an announcement | Open review route | Review screen renders | `mc68-030-esq-announcement-review.png` | Review-only context |

## Demo / preview journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/admin/candidate-review-demo` | Inspect diagnostic preview | Open hidden route | Three read-only sections render | `mc68-004-admin-candidate-review-demo.png` | Not approval |
| 2 | `/admin/master-data/import-preview` | Inspect import preview | Open preview route | Validation UI renders | `mc68-005-admin-master-data-import-preview.png` | Preview only |

## Master data import preview journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/admin/master-data/import-preview` | Review safety boundary | Open route | Safety banner appears | `mc68-005-admin-master-data-import-preview.png` | Confirm Import disabled |
| 2 | `/admin/master-data/import-preview` | Upload a synthetic workbook | Select mock workbook | Browser-memory parse begins | `mc68-005-admin-master-data-import-preview.png` | Synthetic workbook only |
| 3 | `/admin/master-data/import-preview` | Review validation | Inspect cards and row table | Validation results are visible | `mc68-005-admin-master-data-import-preview.png` | No persistence |
| 4 | `/admin/master-data/import-preview` | Clear preview | Use clear/reset control | Preview state resets | `mc68-005-admin-master-data-import-preview.png` | No audit write |

## Candidate review demo journey
| Step | Page / route | User intent | Action | Expected outcome | Screenshot id | Safety note |
|---|---|---|---|---|---|---|
| 1 | `/admin/candidate-review-demo` | Inspect the demo | Open the route | Read-only demo shell appears | `mc68-004-admin-candidate-review-demo.png` | Hidden route |
| 2 | `/admin/candidate-review-demo` | Review the diagnostic preview | Scroll the first section | Candidate review shell is visible | `mc68-004-admin-candidate-review-demo.png` | No approval language |
| 3 | `/admin/candidate-review-demo` | Review backlog preview | Scroll the second section | Backlog preview is visible | `mc68-004-admin-candidate-review-demo.png` | Planning only |
| 4 | `/admin/candidate-review-demo` | Review synthesis preview | Scroll the third section | Synthesis preview is visible | `mc68-004-admin-candidate-review-demo.png` | Not official evidence |

## Cross-role safety boundaries
- Shared login is prototype-only and does not establish a security boundary.
- Preview pages must never be presented as final approval workflows.
- Screenshots must use safe synthetic or demo data only.
- Any disabled action is a deliberate boundary and should remain disabled until a future authorized change.

## Suggested screenshot order
1. `/login`
2. `/admin/dashboard`
3. `/admin/audit-log`
4. `/admin/candidate-review-demo`
5. `/admin/master-data/import-preview`
6. `/staff/dashboard`
7. `/staff/applications`
8. `/staff/applications/app_001`
9. `/provider/dashboard`
10. `/provider/scholarships`
11. `/student/applications`
12. `/student/applications/[applicationId]`
13. `/esq/dashboard`
14. `/esq/history`
