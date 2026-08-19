import { createHash } from "node:crypto";

export const ELIGIBILITY_DECISIONS = Object.freeze({
  ELIGIBLE: "ELIGIBLE",
  INELIGIBLE: "INELIGIBLE",
  BLOCKED: "BLOCKED",
  GOVERNANCE_REVIEW_REQUIRED: "GOVERNANCE_REVIEW_REQUIRED"
});

export const CANONICAL_NEXT_STEP_BY_DECISION = Object.freeze({
  [ELIGIBILITY_DECISIONS.ELIGIBLE]: "Objective 10.6.1 Engineering Mission Bridge",
  [ELIGIBILITY_DECISIONS.INELIGIBLE]: "Enhancement Refinement or Rejection",
  [ELIGIBILITY_DECISIONS.BLOCKED]: "Blocker Resolution",
  [ELIGIBILITY_DECISIONS.GOVERNANCE_REVIEW_REQUIRED]: "Human Governance Review"
});

const INTERNAL_ROUTE_BY_DECISION = Object.freeze({
  [ELIGIBILITY_DECISIONS.ELIGIBLE]: "objective-10-6-1-engineering-mission-bridge",
  [ELIGIBILITY_DECISIONS.INELIGIBLE]: "enhancement-refinement-or-rejection",
  [ELIGIBILITY_DECISIONS.BLOCKED]: "blocker-resolution",
  [ELIGIBILITY_DECISIONS.GOVERNANCE_REVIEW_REQUIRED]: "human-governance-review"
});

const TERMINAL_REJECTION_STATES = new Set([
  "CANCELED",
  "CANCELLED",
  "DUPLICATE",
  "SUPERSEDED",
  "REJECTED",
  "CLOSED_DUPLICATE",
  "CLOSED_SUPERSEDED"
]);

const UNREADY_PRIORITY_VALUES = new Set([
  "",
  "NONE",
  "N/A",
  "NA",
  "TBD",
  "TO_BE_DETERMINED",
  "UNPRIORITIZED",
  "UNKNOWN"
]);

function cloneJson(value) {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value));
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function normalizeKey(value) {
  return normalizeText(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function canonicalSourceKey(value) {
  const key = normalizeText(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return key || "UNKNOWN-SOURCE";
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined || value === false) {
    return [];
  }

  return [value];
}

function hasContent(value) {
  if (Array.isArray(value)) {
    return value.some((item) => hasContent(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).some((item) => hasContent(item));
  }

  return normalizeText(value).length > 0;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

function fingerprintSource(source) {
  return createHash("sha256").update(stableStringify(source)).digest("hex");
}

function deriveSourceId(source) {
  const candidates = [
    source?.sourceId,
    source?.id,
    source?.enhancementId,
    source?.enhancementRequestId,
    source?.requestId,
    source?.code,
    source?.key,
    source?.identity?.id,
    source?.identity?.sourceId,
    source?.metadata?.sourceId
  ];

  const selected = candidates.find((candidate) => normalizeText(candidate).length > 0);
  return normalizeText(selected) || "UNKNOWN-SOURCE";
}

function deriveSourceType(source, sourceId) {
  const explicitType = normalizeText(
    source?.sourceType ??
      source?.type ??
      source?.kind ??
      source?.identity?.type ??
      source?.metadata?.sourceType
  );

  if (explicitType) {
    return normalizeKey(explicitType);
  }

  if (canonicalSourceKey(sourceId).startsWith("ECR-")) {
    return "ENHANCEMENT_CHANGE_REQUEST";
  }

  return "ENHANCEMENT_SOURCE";
}

function deriveAssessmentId(sourceId) {
  return `EOS-ENG-ASSESS-${canonicalSourceKey(sourceId)}`;
}

function currentStateOf(source) {
  return normalizeKey(
    source?.currentState ??
      source?.state ??
      source?.status ??
      source?.lifecycleState ??
      source?.workflowState
  );
}

function approvalCandidates(source, options) {
  return [
    source?.governanceApproval,
    source?.approval,
    source?.governance?.approval,
    source?.governance?.authorization,
    source?.authorization,
    source?.metadata?.governanceApproval,
    options?.governanceApproval,
    options?.approval
  ].filter((candidate) => candidate !== undefined && candidate !== null);
}

function approvalStatus(candidate) {
  if (candidate === true || candidate === false) {
    return candidate ? "BOOLEAN_TRUE" : "BOOLEAN_FALSE";
  }

  if (typeof candidate === "string") {
    return normalizeKey(candidate);
  }

  return normalizeKey(candidate?.status ?? candidate?.state ?? candidate?.decision ?? candidate?.authorizationStatus);
}

function approvalRecognized(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  return candidate.recognized === true || candidate.isRecognized === true || candidate.recognizedBy === "Governance Office";
}

function isApprovedStatus(status) {
  return ["APPROVED", "AUTHORIZED", "GRANTED", "APPROVAL_GRANTED", "GOVERNANCE_APPROVED"].includes(status);
}

function deriveApproval(source, options) {
  const candidates = approvalCandidates(source, options);
  const recognizedCandidate = candidates.find((candidate) => isApprovedStatus(approvalStatus(candidate)) && approvalRecognized(candidate));
  const approvedCandidate = candidates.find((candidate) => isApprovedStatus(approvalStatus(candidate)));
  const anyCandidate = recognizedCandidate ?? approvedCandidate ?? candidates[0];

  return {
    recognized: recognizedCandidate !== undefined,
    present: candidates.length > 0,
    status: approvalStatus(anyCandidate) || "MISSING",
    authority:
      normalizeText(anyCandidate?.authority ?? anyCandidate?.approvedBy ?? anyCandidate?.recognizedBy ?? anyCandidate?.source) ||
      undefined,
    reference:
      normalizeText(anyCandidate?.id ?? anyCandidate?.approvalId ?? anyCandidate?.reference ?? anyCandidate?.ticket) ||
      undefined
  };
}

function normalizeBlocker(blocker, index) {
  if (typeof blocker === "string") {
    return {
      code: `BLOCKER_${index + 1}`,
      description: blocker,
      severity: "BLOCKING"
    };
  }

  return {
    code: normalizeText(blocker?.code ?? blocker?.id ?? blocker?.key) || `BLOCKER_${index + 1}`,
    description: normalizeText(blocker?.description ?? blocker?.reason ?? blocker?.title ?? blocker?.message) || "Blocking condition present",
    severity: normalizeKey(blocker?.severity ?? blocker?.level ?? "BLOCKING") || "BLOCKING"
  };
}

function deriveBlockingConditions(source) {
  const rawBlockers = [
    ...asArray(source?.blockingConditions),
    ...asArray(source?.blockers),
    ...asArray(source?.blockingIssues),
    ...asArray(source?.dependenciesBlocked === true ? "Dependency is blocked" : undefined)
  ];

  return rawBlockers
    .filter((blocker) => {
      if (!blocker) {
        return false;
      }

      if (typeof blocker === "object" && (blocker.resolved === true || blocker.status === "RESOLVED" || blocker.state === "RESOLVED")) {
        return false;
      }

      return hasContent(blocker);
    })
    .map((blocker, index) => normalizeBlocker(blocker, index));
}

function requirement(id, description, passed, evidence) {
  return {
    id,
    description,
    passed,
    evidence
  };
}

function deriveRequirements(source, sourceIdentity, sourceType, blockingConditions, approval) {
  const state = currentStateOf(source);
  const titleOrObjective = normalizeText(source?.title ?? source?.objective ?? source?.name ?? source?.summary);
  const affectedAreas = asArray(source?.affectedAreas ?? source?.affectedArea ?? source?.impact?.affectedAreas).filter(hasContent);
  const acceptanceCriteria = asArray(source?.acceptanceCriteria ?? source?.acceptanceCriterion ?? source?.criteria).filter(hasContent);
  const priority = normalizeKey(source?.priority ?? source?.severity ?? source?.rank);

  return [
    requirement("SOURCE_IDENTITY_PRESENT", "Source identity is present and canonicalized.", hasContent(sourceIdentity.id), {
      sourceId: sourceIdentity.id
    }),
    requirement("SOURCE_TYPE_PRESENT", "Source type is present and canonicalized.", hasContent(sourceType), {
      sourceType
    }),
    requirement("TITLE_OR_OBJECTIVE_PRESENT", "A title or objective describes the requested enhancement.", hasContent(titleOrObjective), {
      titleOrObjective
    }),
    requirement("PRIORITY_READY", "Priority is present and ready for engineering assessment.", hasContent(priority) && !UNREADY_PRIORITY_VALUES.has(priority), {
      priority: priority || "MISSING"
    }),
    requirement("AFFECTED_AREAS_READY", "Affected areas are present and actionable.", affectedAreas.length > 0, {
      count: affectedAreas.length
    }),
    requirement("ACCEPTANCE_CRITERIA_READY", "Acceptance criteria are present and actionable.", acceptanceCriteria.length > 0, {
      count: acceptanceCriteria.length
    }),
    requirement("CURRENT_STATE_ACCEPTABLE", "Current state is not duplicate, superseded, cancelled, canceled, rejected, or otherwise terminal.", !TERMINAL_REJECTION_STATES.has(state), {
      currentState: state || "UNSPECIFIED"
    }),
    requirement("NO_BLOCKING_CONDITIONS", "No unresolved blocking conditions are present.", blockingConditions.length === 0, {
      count: blockingConditions.length
    }),
    requirement("RECOGNIZED_GOVERNANCE_APPROVAL", "Recognized human governance approval is present before eligibility is granted.", approval.recognized === true, {
      approvalPresent: approval.present,
      approvalStatus: approval.status,
      recognized: approval.recognized
    })
  ];
}

function deriveDecision(requirements) {
  const byId = new Map(requirements.map((item) => [item.id, item]));

  if (byId.get("CURRENT_STATE_ACCEPTABLE")?.passed === false) {
    return ELIGIBILITY_DECISIONS.INELIGIBLE;
  }

  if (byId.get("NO_BLOCKING_CONDITIONS")?.passed === false) {
    return ELIGIBILITY_DECISIONS.BLOCKED;
  }

  const structuralRequirementIds = [
    "SOURCE_IDENTITY_PRESENT",
    "SOURCE_TYPE_PRESENT",
    "TITLE_OR_OBJECTIVE_PRESENT",
    "PRIORITY_READY",
    "AFFECTED_AREAS_READY",
    "ACCEPTANCE_CRITERIA_READY"
  ];

  if (structuralRequirementIds.some((id) => byId.get(id)?.passed === false)) {
    return ELIGIBILITY_DECISIONS.INELIGIBLE;
  }

  if (byId.get("RECOGNIZED_GOVERNANCE_APPROVAL")?.passed === false) {
    return ELIGIBILITY_DECISIONS.GOVERNANCE_REVIEW_REQUIRED;
  }

  return ELIGIBILITY_DECISIONS.ELIGIBLE;
}

function deriveEligibilityReasons(decision, failedRequirements, blockingConditions) {
  if (decision === ELIGIBILITY_DECISIONS.ELIGIBLE) {
    return [
      {
        code: "ALL_MANDATORY_REQUIREMENTS_PASSED",
        message: "The source satisfies structural readiness, blocker, current-state, and recognized governance approval requirements."
      }
    ];
  }

  if (decision === ELIGIBILITY_DECISIONS.BLOCKED) {
    return blockingConditions.map((blocker) => ({
      code: "BLOCKING_CONDITION_PRESENT",
      message: blocker.description,
      blockerCode: blocker.code
    }));
  }

  if (decision === ELIGIBILITY_DECISIONS.GOVERNANCE_REVIEW_REQUIRED) {
    return [
      {
        code: "RECOGNIZED_GOVERNANCE_APPROVAL_REQUIRED",
        message: "Recognized human governance approval is required before the source can become eligible."
      }
    ];
  }

  return failedRequirements.map((item) => ({
    code: item.id,
    message: item.description
  }));
}

function deriveGovernanceState(approval, decision) {
  return {
    approvalRequired: true,
    recognizedApproval: approval.recognized,
    status: approval.recognized ? "APPROVED" : "REVIEW_REQUIRED",
    approvalPresent: approval.present,
    approvalStatus: approval.status,
    authority: approval.authority,
    reference: approval.reference,
    reviewRequired: decision === ELIGIBILITY_DECISIONS.GOVERNANCE_REVIEW_REQUIRED
  };
}

export function assessEnhancementEngineeringEligibility(source, options = {}) {
  const sourceSnapshot = cloneJson(source ?? {});
  const sourceId = deriveSourceId(sourceSnapshot);
  const sourceType = deriveSourceType(sourceSnapshot, sourceId);
  const sourceIdentity = {
    id: sourceId,
    canonicalKey: canonicalSourceKey(sourceId),
    assessmentSubject: `${sourceType}:${sourceId}`
  };
  const assessmentId = deriveAssessmentId(sourceId);
  const blockingConditions = deriveBlockingConditions(sourceSnapshot);
  const approval = deriveApproval(sourceSnapshot, options);
  const requirements = deriveRequirements(sourceSnapshot, sourceIdentity, sourceType, blockingConditions, approval);
  const passedRequirements = requirements.filter((item) => item.passed === true).map(({ passed, ...item }) => item);
  const failedRequirements = requirements.filter((item) => item.passed === false).map(({ passed, ...item }) => item);
  const decision = deriveDecision(requirements);
  const eligibilityReasons = deriveEligibilityReasons(decision, failedRequirements, blockingConditions);
  const governanceState = deriveGovernanceState(approval, decision);
  const nextStep = CANONICAL_NEXT_STEP_BY_DECISION[decision];
  const internalRoute = INTERNAL_ROUTE_BY_DECISION[decision];
  const sourceFingerprint = fingerprintSource(sourceSnapshot);
  const assessedAt = options.assessedAt ?? null;
  const provenance = {
    objective: "Objective 10.6.2 Enhancement Engineering Eligibility Assessment",
    missionId: "EOS-10.6.2",
    contractVersion: "10.6.2-canonical-result-v1",
    assessor: "enhancement-engineering-eligibility-service",
    deterministic: true,
    assessedAt,
    sourceFingerprint
  };

  return {
    assessmentId,
    assessmentStatus: "COMPLETED",
    sourceIdentity,
    sourceType,
    decision,
    eligibilityReasons,
    failedRequirements,
    passedRequirements,
    governanceState,
    blockingConditions,
    provenance,
    nextStep,

    satisfiedRequirements: passedRequirements,
    approval: governanceState,
    blockers: blockingConditions,
    route: internalRoute,
    internalRoute,
    metadata: {
      assessmentIdStrategy: "source-derived-human-readable",
      compatibilityAliases: ["satisfiedRequirements", "approval", "blockers", "route"],
      sourceFingerprint
    }
  };
}

export const assessEnhancementRequestEngineeringEligibility = assessEnhancementEngineeringEligibility;
export const assessEngineeringEligibility = assessEnhancementEngineeringEligibility;

export default Object.freeze({
  assessEnhancementEngineeringEligibility,
  assessEnhancementRequestEngineeringEligibility,
  assessEngineeringEligibility,
  ELIGIBILITY_DECISIONS,
  CANONICAL_NEXT_STEP_BY_DECISION
});
