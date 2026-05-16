# S²IMS Mock Assignment Candidate Field Contract MC1

## Purpose

This document defines the field-level contract for normalizing Employee and Personnel source records into `MockAssignmentCandidatePoolItem` objects. It specifies which source fields map to which adapter fields, display rules for each field, and which fields are forbidden from appearing in any workflow-facing UI.

This is a design contract only. No runtime implementation exists at this time.

---

## Employee Field Contract

| Source Field | Adapter Field | Display Rule | Notes |
|---|---|---|---|
| `employee_id` | `sourceId` | Internal only — never displayed | Used to generate `candidateId`; raw ID not exposed |
| `title` | (part of `displayName`) | Included in display name assembly | Combined with name + surname |
| `name` | (part of `displayName`) | Included in display name assembly | Combined with title + surname |
| `surname` | (part of `displayName`) | Included in display name assembly | Combined with title + name |
| `role` | (used for pool ordering) | Not displayed directly | Head_of_Unit > Staff > Secretary priority |
| `department` | (secondary tag) | Not displayed | Used as secondary affiliation if needed |
| `division` | (used for roleCategory mapping) | Not displayed | Drives division → roleCategory lookup |
| `unit` | `unitOrDepartment` | May display as context label | Drives unit → roleCategory lookup |
| `ext` | (omitted from pool) | Not displayed | Not included in normalized object |
| `mobile` | **FORBIDDEN** | Never displayed — stripped at normalization | Must never appear in pool output |
| `cmu_mail` | `officialEmail` | Show only where role-authorised | Stored but gated at display layer |

---

## Personnel Field Contract

| Source Field | Adapter Field | Display Rule | Notes |
|---|---|---|---|
| `teacher_id` | `sourceId` | Internal only — never displayed | Used to generate `candidateId`; raw ID not exposed |
| `title` | (part of `displayName`) | Included in display name assembly | Combined with name + surname |
| `name` | (part of `displayName`) | Included in display name assembly | Combined with title + surname |
| `surname` | (part of `displayName`) | Included in display name assembly | Combined with title + name |
| `department` | `unitOrDepartment` | May display as context label | Drives department → roleCategory lookup |
| `ext` | (omitted from pool) | Not displayed | Not included in normalized object |
| `mobile` | **FORBIDDEN** | Never displayed — stripped at normalization | Must never appear in pool output |
| `cmu_mail` | `officialEmail` | Show only where role-authorised | Stored but gated at display layer |
| `email` | **FORBIDDEN** | Never displayed — stripped at normalization | Personal email; not included in pool output |
| `remark` | `notes` (internal) | Never displayed | Stored with `privacyLevel: "internal_only"` |

---

## Normalized Candidate Pool Item Field Contract

| Field | Type | Description | Display Rule |
|---|---|---|---|
| `candidateId` | `string` | Generated ID for the pool item | Internal reference; not displayed |
| `sourceType` | `"employee" \| "personnel"` | Which CSV the record came from | Internal only |
| `sourceId` | `string` | Raw source ID (employee_id or teacher_id) | Internal only — never displayed |
| `displayName` | `string` | Assembled from title + name + surname | Safe to display in workflow UI |
| `roleCategory` | `string` | Normalized role category key | Internal; used for pool filtering |
| `roleLabel` | `string` | Human-readable role label | Display in workflow UI where context is shown |
| `unitOrDepartment` | `string` | Unit (Employee) or Department code (Personnel) | May display as context label |
| `officialEmail` | `string \| undefined` | CMU official email | Show only where role-authorised |
| `selectableContexts` | `string[]` | Workflow step types this candidate may appear in | Internal; used for pool scoping |
| `selectionStatus` | union of 5 values | Current selection state | Display state label where relevant |
| `confidence` | `"mock" \| "rule_based" \| "manual"` | How the pool item was generated | Internal |
| `isMock` | `true` | Always true; runtime safety guard | Internal — used for validation |
| `privacyLevel` | `"safe_display" \| "internal_only"` | Whether the item is safe to surface | Drives display gating |
| `notes` | `string \| undefined` | Internal notes (e.g., remark field content) | Internal only — never displayed |

---

## Forbidden Display Fields

These fields must never appear in any workflow-facing UI, API response, or audit log entry:

| Field | Source | Reason |
|-------|--------|--------|
| `mobile` | Employee + Personnel | Personal contact; privacy requirement |
| `email` | Personnel | Personal email; privacy requirement |
| `remark` | Personnel | Internal note; may contain sensitive content |
| `employee_id` / `teacher_id` | Both | Raw source ID; use `candidateId` instead |
| Raw student ID | (cross-reference) | Always mask; use masked token |

---

## Safe Display Fields

These fields may be shown in workflow UI when the user's role is authorised:

| Field | Condition |
|-------|-----------|
| `displayName` | Always safe — assembled display name |
| `roleLabel` | Always safe — human-readable role label |
| `unitOrDepartment` | Safe as context label |
| `selectionStatus` | Safe to show state label |
| `officialEmail` | Only where role-authorised (e.g., staff, coordinator) |

---

## Internal-Only Fields

These fields exist in the pool object for adapter logic but must not appear in UI or API responses:

| Field | Reason |
|-------|--------|
| `sourceId` | Raw source identifier; use `candidateId` in UI |
| `sourceType` | Adapter routing; not user-facing |
| `roleCategory` | Internal filter key; `roleLabel` is the display counterpart |
| `selectableContexts` | Adapter scoping logic |
| `confidence` | Adapter provenance; not user-facing |
| `isMock` | Runtime guard; not user-facing |
| `privacyLevel` | Display gating flag; not user-facing |
| `notes` | May contain remark or internal context |

---

## Future Validation Rules

These are placeholder validation rules for the runtime implementation phase (S2IMS-MC1 runtime adapter):

| Rule | Check |
|------|-------|
| `isMock` guard | Must always be `true`; reject objects where this is absent or false |
| `sourceType` enum | Must be `"employee"` or `"personnel"`; no other values accepted |
| `selectionStatus` enum | Must be one of the 5 defined values; reject unknown statuses |
| `displayName` non-empty | Must be a non-empty string after assembly; exclude records with blank names |
| `mobile` absent | `mobile` must never appear anywhere in the normalized output; fail if detected |
| `email` absent | `email` (personal) must never appear in pool output; fail if detected |
| `remark` routing | If `remark` is present, it must only appear in `notes` with `privacyLevel: "internal_only"` |
| `candidateId` format | Must be a generated ID, not the raw `employee_id` or `teacher_id` |
| STB flag | Personnel records with `department = STB` must carry a manual-confirmation warning in `notes` |
