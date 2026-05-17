export type DemoFeedbackCategory =
  | "ux_clarity"
  | "copy_content"
  | "accessibility"
  | "privacy_pdpa"
  | "workflow_understanding"
  | "training_readiness"
  | "risk_concern"
  | "future_enhancement"
  | "out_of_scope_governance";

export type DemoFeedbackPriority =
  | "P0_safety_privacy"
  | "P1_misleading_copy_or_workflow"
  | "P2_accessibility_blocker"
  | "P3_ux_clarity"
  | "P4_training_documentation"
  | "out_of_scope_governance";

export type DemoFeedbackBacklogStatus =
  | "candidate"
  | "accepted_for_planning"
  | "needs_clarification"
  | "out_of_scope"
  | "governance_sensitive"
  | "closed_no_action";

export type DemoFeedbackProposedBranchType =
  | "copy_polish_docs"
  | "copy_polish_runtime"
  | "accessibility_polish_runtime"
  | "demo_layout_polish_runtime"
  | "training_doc_update"
  | "privacy_wording_clarification"
  | "future_planning_doc"
  | "official_audit_write_planning_only"
  | "no_branch";

export type DemoFeedbackBacklogInput = {
  sourceSessionId: string;
  stakeholderGroup: string;
  category: DemoFeedbackCategory;
  summary: string;
  safetyConcern: boolean;
  proposedBranchType: DemoFeedbackProposedBranchType;
  ap10bImpact: "none" | "governance_sensitive";
  nonApprovalConfirmed: true;
};

export type DemoFeedbackBacklogItem = {
  backlogId: string;
  sourceSessionId: string;
  stakeholderGroup: string;
  category: DemoFeedbackCategory;
  priority: DemoFeedbackPriority;
  summary: string;
  safetyConcern: boolean;
  proposedBranchType: DemoFeedbackProposedBranchType;
  ap10bImpact: "none" | "governance_sensitive";
  status: DemoFeedbackBacklogStatus;
  nonApprovalConfirmed: true;
  isMock: true;
  officialEvidence: false;
  approvalCollected: false;
  persisted: false;
  exported: false;
  notified: false;
};

export type DemoFeedbackBacklogSummary = {
  backlogId: string;
  category: DemoFeedbackCategory;
  priority: DemoFeedbackPriority;
  status: DemoFeedbackBacklogStatus;
  proposedBranchType: DemoFeedbackProposedBranchType;
  safetyConcern: boolean;
  ap10bImpact: "none" | "governance_sensitive";
  planningOnly: true;
  nonApprovalConfirmed: true;
  officialEvidence: false;
  approvalCollected: false;
};

const MAX_SAFE_SUMMARY_LENGTH = 240;

const allowedCategories: DemoFeedbackCategory[] = [
  "ux_clarity",
  "copy_content",
  "accessibility",
  "privacy_pdpa",
  "workflow_understanding",
  "training_readiness",
  "risk_concern",
  "future_enhancement",
  "out_of_scope_governance",
];

const allowedBranchTypes: DemoFeedbackProposedBranchType[] = [
  "copy_polish_docs",
  "copy_polish_runtime",
  "accessibility_polish_runtime",
  "demo_layout_polish_runtime",
  "training_doc_update",
  "privacy_wording_clarification",
  "future_planning_doc",
  "official_audit_write_planning_only",
  "no_branch",
];

const forbiddenBacklogKeys = [
  "mobile",
  "phone",
  "email",
  "personalEmail",
  "rawEmail",
  "privateEmail",
  "privateRemark",
  "rawStudentId",
  "studentId",
  "teacherId",
  "nationalId",
  "bankAccount",
  "signature",
  "approvedBy",
  "approvalStatus",
  "assignedBy",
  "assignedAt",
  "scholarshipDecision",
  "officialEvidenceCreatedBy",
];

const forbiddenSummaryPatterns = [
  /\bapproved\b/i,
  /\bassigned\b/i,
  /\bsubmitted\b/i,
  /\bofficial approval\b/i,
  /\bAP-10B approved\b/i,
  /\bauthority verified\b/i,
  /\bnational ID\b/i,
  /\bphone\b/i,
  /\bemail\b/i,
  /\bbank account\b/i,
  /\bstudent ID\b/i,
  /\bteacher ID\b/i,
];

function assertNoForbiddenKeys(value: Record<string, unknown>, context: string) {
  const keys = Object.keys(value);
  const unsafeKey = keys.find((key) =>
    forbiddenBacklogKeys.some((forbidden) => key.toLowerCase() === forbidden.toLowerCase())
  );

  if (unsafeKey) {
    throw new Error(`${context} includes forbidden field: ${unsafeKey}`);
  }
}

function assertSafeText(value: string, fieldName: string) {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required`);
  }

  if (normalized.length > MAX_SAFE_SUMMARY_LENGTH) {
    throw new Error(`${fieldName} must be ${MAX_SAFE_SUMMARY_LENGTH} characters or fewer`);
  }

  const unsafePattern = forbiddenSummaryPatterns.find((pattern) => pattern.test(normalized));
  if (unsafePattern) {
    throw new Error(`${fieldName} contains forbidden feedback backlog wording`);
  }
}

function safeSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "item";
}

function createBaseBacklogId(input: DemoFeedbackBacklogInput): string {
  return `demo-feedback-backlog-${safeSlug(input.sourceSessionId)}-${input.category}`;
}

export function classifyDemoFeedbackPriority(
  category: DemoFeedbackCategory,
  safetyConcern: boolean,
  ap10bImpact: "none" | "governance_sensitive"
): DemoFeedbackPriority {
  if (ap10bImpact === "governance_sensitive" || category === "out_of_scope_governance") {
    return "out_of_scope_governance";
  }

  if (safetyConcern || category === "privacy_pdpa" || category === "risk_concern") {
    return "P0_safety_privacy";
  }

  if (category === "copy_content" || category === "workflow_understanding") {
    return "P1_misleading_copy_or_workflow";
  }

  if (category === "accessibility") {
    return "P2_accessibility_blocker";
  }

  if (category === "training_readiness") {
    return "P4_training_documentation";
  }

  return "P3_ux_clarity";
}

export function deriveDemoFeedbackBacklogStatus(
  category: DemoFeedbackCategory,
  ap10bImpact: "none" | "governance_sensitive"
): DemoFeedbackBacklogStatus {
  if (ap10bImpact === "governance_sensitive") {
    return "governance_sensitive";
  }

  if (category === "out_of_scope_governance") {
    return "out_of_scope";
  }

  return "candidate";
}

export function assertSafeDemoFeedbackBacklogInput(input: DemoFeedbackBacklogInput): void {
  assertNoForbiddenKeys(input as Record<string, unknown>, "Demo feedback backlog input");

  if (!allowedCategories.includes(input.category)) {
    throw new Error(`Unsupported demo feedback category: ${String(input.category)}`);
  }

  if (!allowedBranchTypes.includes(input.proposedBranchType)) {
    throw new Error(`Unsupported proposed branch type: ${String(input.proposedBranchType)}`);
  }

  if (input.ap10bImpact !== "none" && input.ap10bImpact !== "governance_sensitive") {
    throw new Error("Unsupported AP-10B impact value");
  }

  if (input.nonApprovalConfirmed !== true) {
    throw new Error("nonApprovalConfirmed must be true");
  }

  assertSafeText(input.sourceSessionId, "sourceSessionId");
  assertSafeText(input.stakeholderGroup, "stakeholderGroup");
  assertSafeText(input.summary, "summary");
}

export function assertSafeDemoFeedbackBacklogItem(item: DemoFeedbackBacklogItem): void {
  assertNoForbiddenKeys(item as Record<string, unknown>, "Demo feedback backlog item");
  assertSafeDemoFeedbackBacklogInput({
    sourceSessionId: item.sourceSessionId,
    stakeholderGroup: item.stakeholderGroup,
    category: item.category,
    summary: item.summary,
    safetyConcern: item.safetyConcern,
    proposedBranchType: item.proposedBranchType,
    ap10bImpact: item.ap10bImpact,
    nonApprovalConfirmed: item.nonApprovalConfirmed,
  });

  if (!item.backlogId.startsWith("demo-feedback-backlog-")) {
    throw new Error("backlogId must use the demo-feedback-backlog prefix");
  }

  if (item.priority !== classifyDemoFeedbackPriority(item.category, item.safetyConcern, item.ap10bImpact)) {
    throw new Error("priority does not match the safe feedback classification");
  }

  if (item.status !== deriveDemoFeedbackBacklogStatus(item.category, item.ap10bImpact)) {
    throw new Error("status does not match the safe feedback backlog status");
  }

  if (
    item.nonApprovalConfirmed !== true ||
    item.isMock !== true ||
    item.officialEvidence !== false ||
    item.approvalCollected !== false ||
    item.persisted !== false ||
    item.exported !== false ||
    item.notified !== false
  ) {
    throw new Error("feedback backlog item must preserve mock non-approval safety flags");
  }
}

export function createDemoFeedbackBacklogItem(
  input: DemoFeedbackBacklogInput
): DemoFeedbackBacklogItem {
  assertSafeDemoFeedbackBacklogInput(input);

  const item: DemoFeedbackBacklogItem = {
    backlogId: createBaseBacklogId(input),
    sourceSessionId: input.sourceSessionId.trim(),
    stakeholderGroup: input.stakeholderGroup.trim(),
    category: input.category,
    priority: classifyDemoFeedbackPriority(input.category, input.safetyConcern, input.ap10bImpact),
    summary: input.summary.trim(),
    safetyConcern: input.safetyConcern,
    proposedBranchType: input.proposedBranchType,
    ap10bImpact: input.ap10bImpact,
    status: deriveDemoFeedbackBacklogStatus(input.category, input.ap10bImpact),
    nonApprovalConfirmed: true,
    isMock: true,
    officialEvidence: false,
    approvalCollected: false,
    persisted: false,
    exported: false,
    notified: false,
  };

  assertSafeDemoFeedbackBacklogItem(item);
  return item;
}

export function createDemoFeedbackBacklogItems(
  inputs: DemoFeedbackBacklogInput[]
): DemoFeedbackBacklogItem[] {
  return inputs.map((input, index) => {
    const item = createDemoFeedbackBacklogItem(input);
    const indexedItem: DemoFeedbackBacklogItem = {
      ...item,
      backlogId: `${item.backlogId}-${index + 1}`,
    };
    assertSafeDemoFeedbackBacklogItem(indexedItem);
    return indexedItem;
  });
}

export function summarizeDemoFeedbackBacklogItem(
  item: DemoFeedbackBacklogItem
): DemoFeedbackBacklogSummary {
  assertSafeDemoFeedbackBacklogItem(item);

  return {
    backlogId: item.backlogId,
    category: item.category,
    priority: item.priority,
    status: item.status,
    proposedBranchType: item.proposedBranchType,
    safetyConcern: item.safetyConcern,
    ap10bImpact: item.ap10bImpact,
    planningOnly: true,
    nonApprovalConfirmed: true,
    officialEvidence: false,
    approvalCollected: false,
  };
}
