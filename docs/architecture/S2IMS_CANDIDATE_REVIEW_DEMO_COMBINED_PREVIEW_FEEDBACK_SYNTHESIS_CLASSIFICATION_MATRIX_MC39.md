# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Classification Matrix MC39

## Purpose

This matrix defines safe theme classification for MC39 stakeholder feedback synthesis.

The matrix supports planning only. It does not authorize implementation, approval, AP-10B progress, official evidence, persistence, audit writes, assignment, or scholarship decisions.

## Theme Category Table

| Theme Category | Examples | Suggested Follow-up | Governance Sensitive? |
|----------------|----------|---------------------|-----------------------|
| `clarity_copy` | unclear wording, confusing badge labels, disclaimer placement | `docs_copy_update`, `demo_route_copy_polish` | No |
| `layout_navigation` | section separation, order of walkthrough sections, visual hierarchy | `ux_hardening_plan`, `ux_hardening_runtime` | No |
| `accessibility` | heading clarity, keyboard walkthrough clarity, screen-reader copy | `accessibility_plan`, `accessibility_runtime` | No |
| `privacy_pdpa` | mock data explanation, PII exclusion wording, PDPA reassurance | `docs_copy_update`, `demo_route_copy_polish` | No |
| `workflow_understanding` | confusion between candidate review and backlog preview | `walkthrough_update`, `docs_copy_update` | No |
| `training_support` | facilitator notes, stakeholder orientation, dry-run timing | `walkthrough_update`, `docs_copy_update` | No |
| `stakeholder_confusion_risk` | risk that users infer approval, persistence, or readiness | `docs_copy_update`, `ux_hardening_plan` | No, unless it mentions governance trigger terms |
| `governance_sensitive` | AP-10B, official evidence, production readiness, audit write, persistence | `governance_escalation_plan` | Yes |
| `out_of_scope` | unrelated feature requests or operational requests outside demo feedback | `no_action` | Maybe |

## Severity Model

| Severity | Meaning | Allowed Response |
|----------|---------|------------------|
| low | minor wording or training improvement | record as planning candidate |
| medium | repeated confusion or visible comprehension risk | recommend docs or demo copy follow-up |
| high | likely stakeholder misunderstanding about workflow boundaries | recommend explicit hardening plan |
| governance | touches AP-10B, production readiness, official evidence, audit write, persistence, approval, scholarship decision, or assignment | separate from product synthesis |

## Suggested Follow-up Table

| Suggested Follow-up Type | Allowed Use |
|--------------------------|-------------|
| `docs_copy_update` | documentation wording updates |
| `walkthrough_update` | facilitator script or Q&A guardrail updates |
| `ux_hardening_plan` | future planning for route or component UX changes |
| `ux_hardening_runtime` | future runtime branch after explicit approval |
| `accessibility_plan` | future accessibility planning |
| `accessibility_runtime` | future accessibility runtime branch after explicit approval |
| `demo_route_copy_polish` | future copy-only route hardening branch after explicit approval |
| `governance_escalation_plan` | separate governance planning only |
| `no_action` | no follow-up needed or out-of-scope |

## Governance-Sensitive Separation Table

| Trigger | Classification | Required Handling |
|---------|----------------|-------------------|
| AP-10B approval or blocker status | `governance_sensitive` | separate from product synthesis; no gate update |
| official evidence claim | `governance_sensitive` | mark as not evidence; do not archive as evidence |
| production readiness | `governance_sensitive` | no production authorization |
| audit write activation | `governance_sensitive` | no runtime recommendation except separate plan |
| persistence activation | `governance_sensitive` | no storage or schema recommendation except separate plan |
| legal/DPO sign-off | `governance_sensitive` | no sign-off record |
| authority verification | `governance_sensitive` | no authority record |
| scholarship decision | `governance_sensitive` | no decision automation |
| assignment workflow | `governance_sensitive` | no assignment activation |

## Unsafe Interpretation Examples

Do not interpret synthesis as:
- stakeholders approved the demo
- AP-10B was satisfied
- production readiness was granted
- legal/DPO sign-off was collected
- official evidence was created
- persistence may be activated
- audit writes may be activated
- scholarship decisions may be automated
- assignment decisions may be automated

## AP-10B Separation Notes

MC39 classification does not:
- collect AP-10B approval
- assign AP-10B owners
- clear AP-10B blockers
- start AP-10C
- start AP-11
- authorize backend/API, schema, SQL, migration, persistence, audit writes, or official workflow assignment

AP-10B remains unchanged: owners 0/7, approvals 0/7, blockers 9/9 active.
