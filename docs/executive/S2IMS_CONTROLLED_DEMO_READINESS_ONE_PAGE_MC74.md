# S²IMS Controlled Demo Readiness — One-Page Scheduling Note

**Date**: 2026-05-21  
**Milestone**: MC74  
**Purpose**: One-page summary for scheduling the first controlled stakeholder demo  
**Status**: Ready to schedule — no demo has occurred yet

---

## What Is Ready for Demo

| Item | Ready? |
|------|--------|
| All 6 role dashboards operational | ✅ Yes |
| Admin audit log | ✅ Yes |
| Staff application management | ✅ Yes |
| Import preview screen (AP-10B boundary visible) | ✅ Yes |
| Candidate review demo (AP-11 boundary visible) | ✅ Yes |
| Synthetic data loaded | ✅ Yes |
| Dry-run script prepared | ✅ Yes (MC74) |
| Route walkthrough checklist | ✅ Yes (MC74) |
| Feedback collection form | ✅ Yes (MC73) |
| Demo execution report template | ✅ Yes (MC73) |

---

## What Will Be Shown

1. **Login and role switching** — demonstrate multi-role support
2. **Admin dashboard** — system-wide metrics and navigation
3. **Admin audit log** — event trail (in-memory/synthetic)
4. **Admin candidate review demo** — preview of approval workflow UI (AP-11 boundary clearly stated)
5. **Admin import preview** — preview of import workflow (AP-10B boundary clearly stated)
6. **Staff dashboard and applications** — application management workflow
7. **Staff application detail** — individual application view (app_001 + app_002)

---

## What Will NOT Be Shown or Activated

| Item | Reason |
|------|--------|
| Confirm Import (AP-10B) | Gate blocked — not yet approved |
| Export Approval (AP-10C) | Gate blocked — not yet approved |
| Approval Workflows (AP-11) | Gate blocked — not yet approved |
| Real data | Not loaded — synthetic data only |
| Persisted data writes | Not enabled — session-only state |
| Official documents or receipts | Not applicable in current state |
| Production database | Not provisioned for demo |

---

## Who Should Attend

| Role | Why |
|------|-----|
| **Scholarship Operations Lead** | Primary decision-maker for AP-10B/11 activation |
| **IT / Systems Manager** | Technical owner candidate; needs to see import preview |
| **Legal / DPO representative** | PDPA reviewer candidate |
| **End-user representative (Staff)** | UX feedback on application management |
| **Project Lead / Programme Manager** | Decision chair candidate; scheduling authority |
| *(Optional)* Provider or Student rep | Wider stakeholder perspective |

**Maximum recommended attendees**: 8–10 for a focused session

---

## What Feedback Will Be Collected

| Feedback Type | Collection Method |
|---------------|------------------|
| Overall system impression (1–5 scale) | Feedback form (MC73 template) |
| Role-specific observations | Per-role feedback section |
| UX / navigation comments | Feedback form |
| Questions about governance activation | Verbal + noted in demo report |
| Governance owner nominations | Verbal / follow-up email (not collected in demo form) |

---

## What Feedback Will NOT Be Collected

| Item | Reason |
|------|--------|
| Approval or sign-off | Not the purpose of the demo |
| Real names / PII from attendees | Privacy — Participant ID used only |
| Commitment to enable AP-10B | Governance process required separately |
| Binding decisions | This is a review session, not a decision meeting |

---

## Demo Stop Conditions

Pause or stop the demo immediately if:
- An unexpected confirmation dialog appears
- Any data that may be real PII is visible
- A governance-blocked button appears clickable
- Technical failure prevents route loading
- An attendee requests a data action that is not permitted

**Stop phrase**: *"I need to pause briefly — let me resolve a technical point before we continue."*

---

## AP Governance Boundaries to State Explicitly

At the start of the demo and when showing import/approval screens:

> *"The Confirm Import button on this screen is intentionally inactive. AP-10B has not yet been approved."*

> *"The Approve and Reject buttons on the candidate review screen are intentionally inactive. AP-11 has not yet been approved."*

---

## Decision Expected After Demo

| Decision Type | When | Owner |
|---------------|------|-------|
| Continue UX work (Path A) | Immediately | Project Lead |
| Schedule governance owner designations | Within 1 week | Leadership |
| Schedule follow-up demo session | Within 2 weeks if needed | Project Lead |
| Begin PDPA review | Upon DPO availability | DPO |
| Proceed to pilot planning | After governance checklist progress | AP-10B Authority |

---

## Pre-Demo Checklist

- [ ] Dev server running and verified at localhost:3000
- [ ] Synthetic data confirmed loaded
- [ ] All mandatory routes (1–9) passed in route walkthrough checklist (MC74)
- [ ] Dry-run script rehearsed at least once (MC74)
- [ ] Feedback forms prepared for each attendee
- [ ] Demo execution report template open and ready to fill
- [ ] Screen sharing / projector tested
- [ ] Governance boundaries script rehearsed

---

**Document**: MC74 planning — not a sign-off sheet, not a demo record.  
**Status**: Demo has NOT occurred. This document is for scheduling preparation only.
