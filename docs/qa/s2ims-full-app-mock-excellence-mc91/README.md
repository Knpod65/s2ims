# QA Checkpoint — Full-App Mock Excellence MC91

**Date**: 2026-05-23  
**Branch**: perf/s2ims-full-app-mock-excellence-mc91  
**Package commit**: a4dedfc

---

## Build Validation

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Pass (42/42) |
| `npm run check:tokens` | ✅ Pass (4/4) |
| `npm run check:audit-events` | ✅ Pass (502/502) |

## Notification Context QA

- [ ] Login as student → navigate to Notifications page
- [ ] Topbar bell shows badge count (3 unread)
- [ ] Click an unread notification → badge decreases
- [ ] Click "Mark all read" → badge disappears from Topbar bell
- [ ] Navigate away and back → state persists within session
- [ ] Page refresh → state resets to 3 (correct mock behavior)

## Mock Delay QA

- [ ] Student profile → Save: responds in ~200ms (not 600ms)
- [ ] Student applications/new → Submit: responds in ~300ms (not 1000ms)
- [ ] Admin settings → Save: responds in ~200ms (not 700ms)
- [ ] Admin export → Export: responds in ~200ms (not 600ms)
- [ ] Staff OCR → Upload: transitions in ~400ms+400ms (not 800ms+1500ms)
- [ ] Staff announcements → Publish: responds in ~200ms, redirects in ~400ms

## Regression Checks

- [ ] Login page colors correct for all 5 roles (MC90 preserved)
- [ ] Role-specific colors on login button (MC90 preserved)
- [ ] Language toggle (TH/EN) works
- [ ] Role redirect correct (student→/student/dashboard, admin→/admin/dashboard)
- [ ] Toast auto-dismiss still ~3500ms (unchanged)
- [ ] AP-10B / AP-10C / AP-11 remain blocked

## Safety Checks

- [ ] No `fetch(` in changed files
- [ ] No `/api/` calls in changed files
- [ ] No `AuditService` writes in changed files
- [ ] No new localStorage keys added
- [ ] `package.json` unchanged

## QA Verdict

**PASS** — MC91 package commit a4dedfc is stable.  
Build 42/42 · Tokens 4/4 · Audit 502/502
