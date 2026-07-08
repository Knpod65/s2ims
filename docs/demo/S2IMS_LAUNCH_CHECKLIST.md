# S²IMS Prototype Launch Checklist

## 1. Launch Type

- [ ] Prototype / Staging Preview
- [ ] Not production
- [ ] Mock data only
- [ ] No real approval
- [ ] No real payment
- [ ] No real personal data

## 2. Build Checks

- [ ] npm install completed if needed
- [ ] npm run build passed
- [ ] no TypeScript errors
- [ ] no route build errors

## 3. Route Checks

- [ ] `/`
- [ ] `/student/scholarships`
- [ ] `/student/work-study`
- [ ] `/staff/scholarships`
- [ ] `/staff/work-study/approvals`
- [ ] `/admin/scholarships`
- [ ] `/esq/scholarships`
- [ ] `/provider/scholarships`

For each protected route:

- [ ] demo access card appears without mock role
- [ ] role UI renders after demo access
- [ ] no infinite “กำลังโหลด...”

## 4. Business Rule Checks

- [ ] “แมตช์แล้ว” appears only when `matchStatus === MATCHED`
- [ ] matchScore does not control matched status
- [ ] recommendation does not equal approval
- [ ] missing/pending/unclear criteria do not render matched
- [ ] confirmed work hours count only CONFIRMED logs
- [ ] submitted/returned/rejected/draft logs do not count as confirmed hours
- [ ] provider/ESQ views show aggregate data only

## 5. Privacy / PDPA Checks

- [ ] no real student names
- [ ] no real student IDs
- [ ] no real work evidence
- [ ] no personal data on ESQ dashboard
- [ ] no personal data on provider dashboard
- [ ] demo data clearly marked as mock/preview
- [ ] role visibility notices appear where needed

## 6. Forbidden Scope Checks

- [ ] no payroll implementation
- [ ] no HR attendance implementation
- [ ] no GPS check-in
- [ ] no facial recognition
- [ ] no chat system
- [ ] no performance evaluation
- [ ] no AI auto-approval
- [ ] no real payment/donation workflow

## 7. Design Checks

- [ ] Pastel Cyberpunk Minimal direction maintained
- [ ] bright pastel
- [ ] minimal
- [ ] readable Thai
- [ ] not dark cyberpunk
- [ ] not gamer UI
- [ ] not cluttered
- [ ] mobile student flow usable
- [ ] desktop role dashboards usable

## 8. Git Checks

- [ ] current branch is `feature/s2ims-student-matching-ui`
- [ ] no direct push to main
- [ ] no merge to main before review
- [ ] no screenshots committed
- [ ] no .docx committed
- [ ] no zip/PDF/design artifacts committed
- [ ] PR opened as Draft or Ready for Review as appropriate

## 9. Deployment Checks

- [ ] deployment target selected
- [ ] branch selected: `feature/s2ims-student-matching-ui`
- [ ] build command: `npm run build`
- [ ] deployment URL recorded
- [ ] demo routes tested on deployed URL
- [ ] demo access tested on deployed URL

Deployment platform:

Deployment URL:

PR URL:

Reviewer:

Demo date:

Known blockers:

Decision after demo:

## 10. Post-Demo Decision

- [ ] collect feedback
- [ ] classify feedback:
  - bug
  - UI polish
  - requirement change
  - backend requirement
  - policy decision
  - data governance issue
- [ ] decide:
  - merge prototype
  - keep as branch preview
  - refactor before merge
  - continue backend planning
  - pause pending policy decision
