export type DemoFeedbackSynthesisThemeCategory =
  | "clarity_copy"
  | "layout_navigation"
  | "accessibility"
  | "privacy_pdpa"
  | "workflow_understanding"
  | "training_support"
  | "stakeholder_confusion_risk"
  | "governance_sensitive"
  | "out_of_scope";

export type DemoFeedbackSynthesisSeverity =
  | "low"
  | "medium"
  | "high"
  | "blocked";

export type DemoFeedbackSynthesisFollowUpType =
  | "docs_copy_update"
  | "walkthrough_update"
  | "ux_hardening_plan"
  | "ux_hardening_runtime"
  | "accessibility_plan"
  | "accessibility_runtime"
  | "demo_route_copy_polish"
  | "governance_escalation_plan"
  | "no_action";

export type DemoFeedbackSynthesisInput = {
  sessionId: string;
  reviewerCategory: string;
  sectionReviewed:
    | "candidate_review_preview"
    | "feedback_backlog_preview"
    | "combined_route"
    | "general_demo";
  feedbackTheme: string;
  confusionRisk: string;
  suggestedFollowUp: DemoFeedbackSynthesisFollowUpType;
  governanceSensitive: boolean;
  nonApprovalConfirmed: true;
};

export type DemoFeedbackSynthesisItem = {
  synthesisId: string;
  sourceSessionId: string;
  themeCategory: DemoFeedbackSynthesisThemeCategory;
  affectedSection: DemoFeedbackSynthesisInput["sectionReviewed"];
  summary: string;
  severity: DemoFeedbackSynthesisSeverity;
  suggestedFollowUpType: DemoFeedbackSynthesisFollowUpType;
  governanceSensitive: boolean;
  piiExcluded: true;
  nonApprovalConfirmed: true;
  officialEvidence: false;
  approvalCollected: false;
  persisted: false;
  exported: false;
  notified: false;
  isMock: true;
};

export type DemoFeedbackSynthesisSummary = {
  total: number;
  themeCategoryCounts: Record<DemoFeedbackSynthesisThemeCategory, number>;
  severityCounts: Record<DemoFeedbackSynthesisSeverity, number>;
  followUpTypeCounts: Record<DemoFeedbackSynthesisFollowUpType, number>;
  governanceSensitiveCount: number;
  allPiiExcluded: true;
  allNonApprovalConfirmed: true;
  officialEvidenceCount: 0;
  approvalCollectedCount: 0;
  persistedCount: 0;
  exportedCount: 0;
  notifiedCount: 0;
};

const MAX_SAFE_TEXT_LENGTH = 240;

const themeCategories: DemoFeedbackSynthesisThemeCategory[] = [
  "clarity_copy",
  "layout_navigation",
  "accessibility",
  "privacy_pdpa",
  "workflow_understanding",
  "training_support",
  "stakeholder_confusion_risk",
  "governance_sensitive",
  "out_of_scope",
];

const severityLevels: DemoFeedbackSynthesisSeverity[] = [
  "low",
  "medium",
  "high",
  "blocked",
];

const followUpTypes: DemoFeedbackSynthesisFollowUpType[] = [
  "docs_copy_update",
  "walkthrough_update",
  "ux_hardening_plan",
  "ux_hardening_runtime",
  "accessibility_plan",
  "accessibility_runtime",
  "demo_route_copy_polish",
  "governance_escalation_plan",
  "no_action",
];

const sectionNames: DemoFeedbackSynthesisInput["sectionReviewed"][] = [
  "candidate_review_preview",
  "feedback_backlog_preview",
  "combined_route",
  "general_demo",
];

const forbiddenSynthesisKeys = [
  "name",
  "email",
  "phone",
  "mobile",
  "personalEmail",
  "rawEmail",
  "privateEmail",
  "studentId",
  "personnelId",
  "teacherId",
  "nationalId",
  "bankAccount",
  "signature",
  "privateRemark",
  "sensitiveStory",
  "approvedBy",
  "approvalStatus",
  "assignedBy",
  "assignedAt",
  "scholarshipDecision",
  "officialEvidenceCreatedBy",
];

const forbiddenSynthesisPatterns = [
  /\bapproved\b/i,
  /\bapproval collected\b/i,
  /\bsign[- ]?off\b/i,
  /\bAP-10B approval\b/i,
  /\bAP-10B evidence\b/i,
  /\blegal approval\b/i,
  /\bDPO sign[- ]?off\b/i,
  /\bauthority verified\b/i,
  /\bproduction readiness approval\b/i,
  /\bproduction authorization\b/i,
  /\bofficial evidence\b/i,
  /\baudit write activation\b/i,
  /\bpersistence activation\b/i,
  /\bscholarship decision\b/i,
  /\bassignment instruction\b/i,
  /\bnational ID\b/i,
  /\bstudent ID\b/i,
  /\bpersonnel ID\b/i,
  /\bteacher ID\b/i,
  /\bbank account\b/i,
  /\bemail\b/i,
  /\bphone\b/i,
];

function includesAny(value: string, tokens: string[]): boolean {
  const normalized = value.toLowerCase();
  return tokens.some((token) => normalized.includes(token));
}

function safeSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "session";
}

function assertNoForbiddenKeys(value: Record<string, unknown>, context: string): void {
  const keys = Object.keys(value);
  const unsafeKey = keys.find((key) =>
    forbiddenSynthesisKeys.some((forbidden) => key.toLowerCase() === forbidden.toLowerCase())
  );

  if (unsafeKey) {
    throw new Error(`${context} includes forbidden field: ${unsafeKey}`);
  }
}

function assertSafeText(value: string, fieldName: string): void {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required`);
  }

  if (normalized.length > MAX_SAFE_TEXT_LENGTH) {
    throw new Error(`${fieldName} must be ${MAX_SAFE_TEXT_LENGTH} characters or fewer`);
  }

  const unsafePattern = forbiddenSynthesisPatterns.find((pattern) => pattern.test(normalized));
  if (unsafePattern) {
    throw new Error(`${fieldName} contains forbidden feedback synthesis wording`);
  }
}

function getCombinedFeedbackText(input: DemoFeedbackSynthesisInput): string {
  return [
    input.feedbackTheme,
    input.confusionRisk,
    input.suggestedFollowUp,
    input.sectionReviewed,
  ].join(" ");
}

function assertSafeDemoFeedbackSynthesisInput(input: DemoFeedbackSynthesisInput): void {
  assertNoForbiddenKeys(input as Record<string, unknown>, "Demo feedback synthesis input");

  if (!sectionNames.includes(input.sectionReviewed)) {
    throw new Error(`Unsupported synthesis section: ${String(input.sectionReviewed)}`);
  }

  if (!followUpTypes.includes(input.suggestedFollowUp)) {
    throw new Error(`Unsupported synthesis follow-up type: ${String(input.suggestedFollowUp)}`);
  }

  if (input.nonApprovalConfirmed !== true) {
    throw new Error("nonApprovalConfirmed must be true");
  }

  assertSafeText(input.sessionId, "sessionId");
  assertSafeText(input.reviewerCategory, "reviewerCategory");
  assertSafeText(input.feedbackTheme, "feedbackTheme");
  assertSafeText(input.confusionRisk, "confusionRisk");
}

export function classifyDemoFeedbackTheme(
  input: DemoFeedbackSynthesisInput
): DemoFeedbackSynthesisThemeCategory {
  assertSafeDemoFeedbackSynthesisInput(input);

  const combined = getCombinedFeedbackText(input);

  if (
    input.governanceSensitive ||
    input.suggestedFollowUp === "governance_escalation_plan" ||
    includesAny(combined, ["governance", "ap-10b", "gate", "blocker"])
  ) {
    return "governance_sensitive";
  }

  if (input.suggestedFollowUp === "accessibility_plan" || input.suggestedFollowUp === "accessibility_runtime") {
    return "accessibility";
  }

  if (includesAny(combined, ["keyboard", "screen reader", "accessibility", "focus", "heading"])) {
    return "accessibility";
  }

  if (includesAny(combined, ["privacy", "pdpa", "pii", "mock data", "real data"])) {
    return "privacy_pdpa";
  }

  if (input.suggestedFollowUp === "walkthrough_update" || includesAny(combined, ["training", "facilitator", "walkthrough", "orientation"])) {
    return "training_support";
  }

  if (
    input.suggestedFollowUp === "ux_hardening_plan" ||
    input.suggestedFollowUp === "ux_hardening_runtime" ||
    input.suggestedFollowUp === "demo_route_copy_polish" ||
    includesAny(combined, ["layout", "navigation", "route", "section", "grouping", "visual"])
  ) {
    return "layout_navigation";
  }

  if (includesAny(combined, ["workflow", "process", "flow", "comprehension"])) {
    return "workflow_understanding";
  }

  if (input.suggestedFollowUp === "no_action" || includesAny(combined, ["out of scope", "unrelated"])) {
    return "out_of_scope";
  }

  if (includesAny(combined, ["confusion", "risk", "misleading", "unclear boundary"])) {
    return "stakeholder_confusion_risk";
  }

  return "clarity_copy";
}

export function deriveDemoFeedbackSeverity(
  input: DemoFeedbackSynthesisInput
): DemoFeedbackSynthesisSeverity {
  assertSafeDemoFeedbackSynthesisInput(input);

  const category = classifyDemoFeedbackTheme(input);
  const combined = getCombinedFeedbackText(input);

  if (category === "governance_sensitive" || input.suggestedFollowUp === "governance_escalation_plan") {
    return "blocked";
  }

  if (
    category === "privacy_pdpa" ||
    category === "accessibility" ||
    category === "stakeholder_confusion_risk" ||
    input.suggestedFollowUp === "ux_hardening_runtime" ||
    input.suggestedFollowUp === "accessibility_runtime" ||
    includesAny(combined, ["high", "major", "likely"])
  ) {
    return "high";
  }

  if (
    category === "workflow_understanding" ||
    category === "training_support" ||
    category === "layout_navigation" ||
    input.suggestedFollowUp === "walkthrough_update" ||
    input.suggestedFollowUp === "ux_hardening_plan"
  ) {
    return "medium";
  }

  return "low";
}

function createSafeSummary(input: DemoFeedbackSynthesisInput): string {
  const theme = input.feedbackTheme.trim().replace(/\s+/g, " ");
  const section = input.sectionReviewed.replace(/_/g, " ");
  return `${theme} Affected section: ${section}.`;
}

function emptyThemeCategoryCounts(): Record<DemoFeedbackSynthesisThemeCategory, number> {
  return Object.fromEntries(themeCategories.map((category) => [category, 0])) as Record<
    DemoFeedbackSynthesisThemeCategory,
    number
  >;
}

function emptySeverityCounts(): Record<DemoFeedbackSynthesisSeverity, number> {
  return Object.fromEntries(severityLevels.map((severity) => [severity, 0])) as Record<
    DemoFeedbackSynthesisSeverity,
    number
  >;
}

function emptyFollowUpTypeCounts(): Record<DemoFeedbackSynthesisFollowUpType, number> {
  return Object.fromEntries(followUpTypes.map((followUpType) => [followUpType, 0])) as Record<
    DemoFeedbackSynthesisFollowUpType,
    number
  >;
}

export function createDemoFeedbackSynthesisItems(
  inputs: DemoFeedbackSynthesisInput[]
): DemoFeedbackSynthesisItem[] {
  return inputs.map((input, index) => {
    assertSafeDemoFeedbackSynthesisInput(input);

    const item: DemoFeedbackSynthesisItem = {
      synthesisId: `demo-feedback-synthesis-${safeSlug(input.sessionId)}-${index + 1}`,
      sourceSessionId: input.sessionId.trim(),
      themeCategory: classifyDemoFeedbackTheme(input),
      affectedSection: input.sectionReviewed,
      summary: createSafeSummary(input),
      severity: deriveDemoFeedbackSeverity(input),
      suggestedFollowUpType: input.suggestedFollowUp,
      governanceSensitive: input.governanceSensitive || classifyDemoFeedbackTheme(input) === "governance_sensitive",
      piiExcluded: true,
      nonApprovalConfirmed: true,
      officialEvidence: false,
      approvalCollected: false,
      persisted: false,
      exported: false,
      notified: false,
      isMock: true,
    };

    assertSafeDemoFeedbackSynthesisItem(item);
    return item;
  });
}

export function assertSafeDemoFeedbackSynthesisItem(item: DemoFeedbackSynthesisItem): void {
  assertNoForbiddenKeys(item as Record<string, unknown>, "Demo feedback synthesis item");

  if (!item.synthesisId.startsWith("demo-feedback-synthesis-")) {
    throw new Error("synthesisId must use the demo-feedback-synthesis prefix");
  }

  if (!themeCategories.includes(item.themeCategory)) {
    throw new Error(`Unsupported synthesis theme category: ${String(item.themeCategory)}`);
  }

  if (!sectionNames.includes(item.affectedSection)) {
    throw new Error(`Unsupported synthesis affected section: ${String(item.affectedSection)}`);
  }

  if (!severityLevels.includes(item.severity)) {
    throw new Error(`Unsupported synthesis severity: ${String(item.severity)}`);
  }

  if (!followUpTypes.includes(item.suggestedFollowUpType)) {
    throw new Error(`Unsupported synthesis follow-up type: ${String(item.suggestedFollowUpType)}`);
  }

  assertSafeText(item.synthesisId, "synthesisId");
  assertSafeText(item.sourceSessionId, "sourceSessionId");
  assertSafeText(item.summary, "summary");

  if (item.themeCategory === "governance_sensitive" && item.severity !== "blocked") {
    throw new Error("governance-sensitive synthesis items must use blocked severity");
  }

  if (item.suggestedFollowUpType === "governance_escalation_plan" && item.themeCategory !== "governance_sensitive") {
    throw new Error("governance escalation follow-up must remain governance-sensitive");
  }

  if (
    item.piiExcluded !== true ||
    item.nonApprovalConfirmed !== true ||
    item.officialEvidence !== false ||
    item.approvalCollected !== false ||
    item.persisted !== false ||
    item.exported !== false ||
    item.notified !== false ||
    item.isMock !== true
  ) {
    throw new Error("feedback synthesis item must preserve mock non-approval safety flags");
  }
}

export function summarizeDemoFeedbackSynthesisItems(
  items: DemoFeedbackSynthesisItem[]
): DemoFeedbackSynthesisSummary {
  const themeCategoryCounts = emptyThemeCategoryCounts();
  const severityCounts = emptySeverityCounts();
  const followUpTypeCounts = emptyFollowUpTypeCounts();

  let governanceSensitiveCount = 0;

  for (const item of items) {
    assertSafeDemoFeedbackSynthesisItem(item);

    themeCategoryCounts[item.themeCategory] += 1;
    severityCounts[item.severity] += 1;
    followUpTypeCounts[item.suggestedFollowUpType] += 1;

    if (item.governanceSensitive) {
      governanceSensitiveCount += 1;
    }
  }

  return {
    total: items.length,
    themeCategoryCounts,
    severityCounts,
    followUpTypeCounts,
    governanceSensitiveCount,
    allPiiExcluded: true,
    allNonApprovalConfirmed: true,
    officialEvidenceCount: 0,
    approvalCollectedCount: 0,
    persistedCount: 0,
    exportedCount: 0,
    notifiedCount: 0,
  };
}
