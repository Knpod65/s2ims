# S²IMS Mock Assignment Candidates Plan — 2026-05-16

## Date

2026-05-16

## Branch

architecture/s2ims-mock-assignment-candidates-plan

## Purpose

Documentation-only design plan for S²IMS mock workflow candidate sourcing using two CMU CSV sources. Covers employee-to-operational-workflow mapping, faculty-to-advisor-workflow mapping, candidate generation rules, privacy rules, and advisor review flow options.

This task is entirely separate from AP-10B governance approval operations. AP-10B gate status is unaffected. AP-10C and AP-11 remain blocked.

## Input Sources

### Employee190226.csv

- 37 operational staff records from CMU
- Fields: employee_id, title, name, surname, role, department, division, unit, ext, mobile, cmu_mail
- Divisions: General_Administration, Strategic_Planning, Political_Innovation_Center, Research_Academic_Services, Education_Student_Quality
- Units: Human_Resources, General_Administration, Finance_Supplies, Audio_Visual_Environment, Strategy_Quality_Assurance, IT_Communication, Research, Academic_Services, International_Relations, Education_Services, Student_Development
- Roles: Secretary, Head_of_Unit, Staff

### Personnel120226.csv

- 45 faculty/teacher records from CMU
- Fields: teacher_id, title, name, surname, department, ext, mobile, cmu_mail, email, remark
- Department codes: GOV, PA, IA, STB (plus one guest/external entry)

## Files Created

- docs/architecture/S2IMS_MOCK_ASSIGNMENT_CANDIDATES_PLAN.md
- docs/architecture/S2IMS_EMPLOYEE_PERSONNEL_ROLE_MAPPING.md
- docs/architecture/S2IMS_ADVISOR_REVIEW_WORKFLOW_PLAN.md
- docs/daily-reports/2026-05-16-s2ims-mock-assignment-candidates-plan.md

## Files Modified

- docs/architecture/NEXT_RENOVATION_STEPS.md (S²IMS mock candidates section appended)

## Validation Results

- npm run build: Passed (40/40 routes, 0 type errors)
- npm run check:tokens: Passed (4/4)
- npm run check:audit-events: Passed (139/139)

## Route Smoke

- /login: 200 OK
- /admin/audit-log: 200 OK
- /admin/dashboard: 200 OK
- /staff/applications/app_001: 200 OK
- /staff/applications/app_002: 200 OK
- Dev log: Clean

## Docs-Only Confirmation

- git diff --name-only origin/main...HEAD | grep -v "^docs/" — empty
- All changes are docs/* only
- No runtime code changed

## Safety Confirmations

- src/* changed: No
- scripts/* changed: No
- package.json changed: No
- Backend/API files created: No
- Migration files created: No
- SQL files created: No
- Schema implementation files created: No
- Runtime files changed: No
- Prototype persistence activated: No
- Real persistence activated: No
- Admin UI behavior changed: No
- Staff callbacks changed: No
- Notification behavior changed: No
- Mock fixtures mutated: No
- PII exposed: No
- Mobile numbers in doc content: No
- Raw student IDs in doc content: No
- Approvals collected: No
- Any owner named as final owner: No

## AP-10B Unaffected

- Candidate owners identified: 0/7
- Authority verified: 0/7
- Named owners: 0/7
- Approvals collected: 0/7
- Blocking conditions active: 9/9
- Blocking conditions cleared: 0/9

## AP-10C Status

Blocked.

## AP-11 Status

Blocked.

## Recommended Next Step

- Review role mapping for completeness against actual S²IMS workflow steps
- Confirm advisor flow option (A or B) with product stakeholder
- Future src implementation is a separate task
- AP-10B owner candidate identification remains the only unblocked governance action
