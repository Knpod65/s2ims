# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Route Integration Plan MC46

## 1. Purpose

MC46 defines a future route integration plan for adding the read-only `FeedbackSynthesisPreview` component to the existing hidden `/admin/candidate-review-demo` route.

Core rule:
The integration must add a third read-only preview section only. It must not create a new route, expose navigation, collect feedback, save data, submit data, approve work, assign work, create official evidence, or change AP-10B governance status.

---

## 2. Scope

### In scope

- Target route definition
- Placement order
- Section separation rules
- Required route-level copy
- Component usage plan
- Safety boundaries
- No-navigation-exposure rules
- Future implementation checklist
- Route QA checklist

### Out of scope

- Runtime implementation in MC46
- Route modification in MC46
- Navigation exposure
- New route creation
- Feedback form implementation
- Storage/persistence
- Backend/API
- Database/schema/migration
- Audit write
- Official evidence creation
- Assignment
- Approval
- Scholarship decision
- AP-10B governance
- AP-10C
- AP-11

---

## 3. Source Baseline

### 3a. Previous milestones

- MC33 integrated feedback backlog preview into the existing hidden demo route
- MC35 hardened combined demo route UX
- MC45 implemented `FeedbackSynthesisPreview` React component

### 3b. Current validation baseline

| Check | Value |
|---|---|
| Build | 41/41 |
| Tokens | 4/4 |
| Audit/event checks | 479/479 |
| Routes | 6×200 OK |
| Dev log | clean |

### 3c. MC46 state

MC46 does not modify source/runtime files. This is documentation-only planning.

---

## 4. Target Route

### Route file

`src/app/admin/candidate-review-demo/page.tsx`

### Route URL

`/admin/candidate-review-demo`

### Rule

Use the existing hidden route only. Do not create a new route.

---

## 5. Placement Order

Future route should contain three sections in this order:

| Order | Section | Reason |
|---|---|---|
| 1 | Candidate review diagnostic preview | Shows local candidate review signals |
| 2 | Feedback backlog preview | Shows feedback/planning item grouping |
| 3 | Feedback synthesis preview | Shows safe synthesized planning themes |

The synthesis preview must appear after backlog preview to avoid suggesting it drives candidate review or approval.

---

## 6. Required Route-Level Copy

The route must include copy stating:

```
This demo page is hidden from navigation.
All sections use safe mock data only.
Nothing on this page is saved, submitted, approved, assigned, exported, notified, or treated as official evidence.
This page does not collect AP-10B approval and does not change AP-10B/AP-10C/AP-11 status.
```

---

## 7. Component Usage Plan

### Import statement

```ts
import { FeedbackSynthesisPreview } from "@/components/assignment";
```

### Props

- `title`: optional (defaults to "Feedback Synthesis Preview")
- `description`: optional (defaults to safe mock data description)
- `items`: optional (defaults to MC43 `createDemoFeedbackSynthesisSamples()` output)
- `readonly`: optional (defaults to true)

### Component usage pattern

```tsx
<FeedbackSynthesisPreview />
```

Use default props to render all 9 sample synthesis items.

---

## 8. No-Navigation-Exposure Rules

1. The `/admin/candidate-review-demo` route must remain hidden from:
   - Sidebar navigation
   - Top navigation bar
   - Mobile bottom navigation
   - Menu configurations

2. No route-level navigation exposure should be added.

3. The demo route URL must not be exposed to stakeholders except via direct link.

4. Current navigation status (hidden) must be preserved.

---

## 9. No-Form/Action Behavior Rules

The route and synthesis preview must not contain:

- Feedback form
- Save button
- Submit button
- Approval button
- Assignment button
- Export functionality
- Notification functionality
- Any state persistence
- Any data collection

---

## 10. Safety Checks for Future Integration

| Check | Status |
|---|---|
| Component exists at `src/components/assignment/FeedbackSynthesisPreview.tsx` | ✅ (from MC45) |
| Component exports `FeedbackSynthesisPreviewProps` | ✅ (from MC45) |
| Component uses MC43 safe sample runtime | ✅ (from MC45) |
| Route remains hidden from navigation | ✅ (existing) |
| No form/action controls introduced | ✅ (will verify at MC47) |
| No audit writes introduced | ✅ |
| No persistence introduced | ✅ |
| No backend/API calls introduced | ✅ |

---

## 11. QA Checklist for MC47 Implementation

| Check | Expected Result |
|---|---|
| Build passes | 41/41 routes |
| Tokens pass | 4/4 |
| Audit checks pass | new MC47 check count |
| Route returns 200 | `/admin/candidate-review-demo` |
| Dev log clean | no errors |
| Component renders | FeedbackSynthesisPreview visible |
| Placement order correct | 1. candidate review, 2. backlog, 3. synthesis |
| No navigation exposure | route still hidden |
| No action controls | read-only only |
| Required copy present | route and component copy |

---

## 12. AP-10B Status (Unchanged)

| Gate | Status |
|---|---|
| AP-10B owners | 0/7 |
| AP-10B approvals | 0/7 |
| AP-10B blockers | 9/9 active |
| AP-10C | Blocked |
| AP-11 | Blocked |

---

## 13. Hard Constraints

| Constraint | Rule |
|---|---|
| No `src/*` modifications in MC46 | Documentation only |
| No `scripts/*` modifications in MC46 | Documentation only |
| No route creation | Use existing hidden route only |
| No navigation exposure | Preserve current hidden status |
| No feedback form | Read-only preview only |
| No audit writes | Planning only |
| No persistence | Planning only |
| No backend/API | Planning only |