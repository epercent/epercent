import test from "node:test";
import assert from "node:assert/strict";
import {
  assessEnhancementEngineeringEligibility,
  CANONICAL_NEXT_STEP_BY_DECISION,
  ELIGIBILITY_DECISIONS
} from "../backend/src/services/enhancement-engineering-eligibility-service.js";
import * as eligibilityService from "../backend/src/services/enhancement-engineering-eligibility-service.js";

function canonicalApprovedSource(overrides = {}) {
  return {
    id: "ECR-10-6-2",
    sourceType: "ENHANCEMENT_CHANGE_REQUEST",
    title: "Canonical Objective 10.6.2 eligibility contract repair",
    priority: "Critical",
    affectedAreas: ["backend/src/services/enhancement-engineering-eligibility-service.js"],
    acceptanceCriteria: ["Expose canonical result fields", "Preserve eligibility behavior"],
    governanceApproval: {
      status: "APPROVED",
      recognized: true,
      authority: "Governance Office",
      reference: "GOV-10.6.2"
    },
    ...overrides
  };
}

function deepFreeze(value) {
  if (!value || typeof value !== "object") {
    return value;
  }

  Object.freeze(value);

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("ECR-10-6-2 produces exact canonical source-derived assessmentId", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource());

  assert.equal(result.assessmentId, "EOS-ENG-ASSESS-ECR-10-6-2");
  assert.ok(!result.assessmentId.startsWith("eeea-"));
  assert.equal(result.metadata.assessmentIdStrategy, "source-derived-human-readable");
});

test("canonical assessmentStatus exists and is deterministic", () => {
  const source = canonicalApprovedSource();
  const first = assessEnhancementEngineeringEligibility(source);
  const second = assessEnhancementEngineeringEligibility(source);

  assert.equal(first.assessmentStatus, "COMPLETED");
  assert.equal(second.assessmentStatus, "COMPLETED");
  assert.equal(first.assessmentStatus, second.assessmentStatus);
});

test("canonical sourceIdentity and sourceType are exposed", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource());

  assert.deepEqual(result.sourceIdentity, {
    id: "ECR-10-6-2",
    canonicalKey: "ECR-10-6-2",
    assessmentSubject: "ENHANCEMENT_CHANGE_REQUEST:ECR-10-6-2"
  });
  assert.equal(result.sourceType, "ENHANCEMENT_CHANGE_REQUEST");
});

test("canonical result fields are exposed with additive compatibility aliases only", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource());

  for (const field of [
    "assessmentId",
    "assessmentStatus",
    "sourceIdentity",
    "sourceType",
    "decision",
    "eligibilityReasons",
    "failedRequirements",
    "passedRequirements",
    "governanceState",
    "blockingConditions",
    "provenance",
    "nextStep"
  ]) {
    assert.ok(Object.hasOwn(result, field), `${field} must be present`);
  }

  assert.equal(result.satisfiedRequirements, result.passedRequirements);
  assert.equal(result.approval, result.governanceState);
  assert.equal(result.blockers, result.blockingConditions);
  assert.equal(result.route, result.internalRoute);
});

test("passedRequirements and failedRequirements use canonical field names", () => {
  const eligible = assessEnhancementEngineeringEligibility(canonicalApprovedSource());
  const ineligible = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ acceptanceCriteria: [] }));

  assert.ok(Array.isArray(eligible.passedRequirements));
  assert.ok(Array.isArray(eligible.failedRequirements));
  assert.equal(eligible.failedRequirements.length, 0);
  assert.ok(eligible.passedRequirements.some((requirement) => requirement.id === "ACCEPTANCE_CRITERIA_READY"));

  assert.ok(ineligible.failedRequirements.some((requirement) => requirement.id === "ACCEPTANCE_CRITERIA_READY"));
  assert.ok(ineligible.passedRequirements.every((requirement) => requirement.id !== "ACCEPTANCE_CRITERIA_READY"));
});

test("governanceState explicitly reports recognized approval state", () => {
  const eligible = assessEnhancementEngineeringEligibility(canonicalApprovedSource());
  const review = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ governanceApproval: undefined }));

  assert.deepEqual(eligible.governanceState, {
    approvalRequired: true,
    recognizedApproval: true,
    status: "APPROVED",
    approvalPresent: true,
    approvalStatus: "APPROVED",
    authority: "Governance Office",
    reference: "GOV-10.6.2",
    reviewRequired: false
  });

  assert.equal(review.governanceState.approvalRequired, true);
  assert.equal(review.governanceState.recognizedApproval, false);
  assert.equal(review.governanceState.status, "REVIEW_REQUIRED");
  assert.equal(review.governanceState.reviewRequired, true);
});

test("blockingConditions and eligibilityReasons are canonical structured arrays", () => {
  const result = assessEnhancementEngineeringEligibility(
    canonicalApprovedSource({
      blockers: [{ id: "BLK-1", description: "Security review is blocking", severity: "critical" }]
    })
  );

  assert.equal(result.decision, ELIGIBILITY_DECISIONS.BLOCKED);
  assert.deepEqual(result.blockingConditions, [
    {
      code: "BLK-1",
      description: "Security review is blocking",
      severity: "CRITICAL"
    }
  ]);
  assert.deepEqual(result.eligibilityReasons, [
    {
      code: "BLOCKING_CONDITION_PRESENT",
      message: "Security review is blocking",
      blockerCode: "BLK-1"
    }
  ]);
});

test("ELIGIBLE maps to exact canonical nextStep", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource());

  assert.equal(result.decision, "ELIGIBLE");
  assert.equal(result.nextStep, "Objective 10.6.1 Engineering Mission Bridge");
  assert.equal(result.nextStep, CANONICAL_NEXT_STEP_BY_DECISION.ELIGIBLE);
});

test("INELIGIBLE maps to exact canonical nextStep", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ acceptanceCriteria: [] }));

  assert.equal(result.decision, "INELIGIBLE");
  assert.equal(result.nextStep, "Enhancement Refinement or Rejection");
  assert.equal(result.nextStep, CANONICAL_NEXT_STEP_BY_DECISION.INELIGIBLE);
});

test("BLOCKED maps to exact canonical nextStep", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ blockers: ["External dependency unavailable"] }));

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.nextStep, "Blocker Resolution");
  assert.equal(result.nextStep, CANONICAL_NEXT_STEP_BY_DECISION.BLOCKED);
});

test("GOVERNANCE_REVIEW_REQUIRED maps to exact canonical nextStep", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ governanceApproval: undefined }));

  assert.equal(result.decision, "GOVERNANCE_REVIEW_REQUIRED");
  assert.equal(result.nextStep, "Human Governance Review");
  assert.equal(result.nextStep, CANONICAL_NEXT_STEP_BY_DECISION.GOVERNANCE_REVIEW_REQUIRED);
});

test("explicit recognized governance approval is required before ELIGIBLE", () => {
  const missingApproval = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ governanceApproval: undefined }));
  const unrecognizedApproval = assessEnhancementEngineeringEligibility(
    canonicalApprovedSource({ governanceApproval: { status: "APPROVED", recognized: false } })
  );
  const recognizedApproval = assessEnhancementEngineeringEligibility(canonicalApprovedSource());

  assert.equal(missingApproval.decision, "GOVERNANCE_REVIEW_REQUIRED");
  assert.equal(unrecognizedApproval.decision, "GOVERNANCE_REVIEW_REQUIRED");
  assert.equal(recognizedApproval.decision, "ELIGIBLE");
});

test("affectedAreas readiness is enforced", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ affectedAreas: [] }));

  assert.equal(result.decision, "INELIGIBLE");
  assert.ok(result.failedRequirements.some((requirement) => requirement.id === "AFFECTED_AREAS_READY"));
});

test("acceptanceCriteria readiness is enforced", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ acceptanceCriteria: [] }));

  assert.equal(result.decision, "INELIGIBLE");
  assert.ok(result.failedRequirements.some((requirement) => requirement.id === "ACCEPTANCE_CRITERIA_READY"));
});

test("title-or-objective semantics are preserved", () => {
  const objectiveOnly = assessEnhancementEngineeringEligibility(
    canonicalApprovedSource({ title: undefined, objective: "Assess canonical contract repair" })
  );
  const missingBoth = assessEnhancementEngineeringEligibility(
    canonicalApprovedSource({ title: undefined, objective: undefined, name: undefined, summary: undefined })
  );

  assert.equal(objectiveOnly.decision, "ELIGIBLE");
  assert.equal(missingBoth.decision, "INELIGIBLE");
  assert.ok(missingBoth.failedRequirements.some((requirement) => requirement.id === "TITLE_OR_OBJECTIVE_PRESENT"));
});

test("priority readiness is enforced", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ priority: "TBD" }));

  assert.equal(result.decision, "INELIGIBLE");
  assert.ok(result.failedRequirements.some((requirement) => requirement.id === "PRIORITY_READY"));
});

test("duplicate, superseded, cancelled, and canceled states are rejected as INELIGIBLE", async (t) => {
  for (const state of ["duplicate", "superseded", "cancelled", "canceled"]) {
    await t.test(state, () => {
      const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource({ status: state }));

      assert.equal(result.decision, "INELIGIBLE");
      assert.equal(result.nextStep, "Enhancement Refinement or Rejection");
      assert.ok(result.failedRequirements.some((requirement) => requirement.id === "CURRENT_STATE_ACCEPTABLE"));
    });
  }
});

test("blocker precedence is preserved over governance review", () => {
  const result = assessEnhancementEngineeringEligibility(
    canonicalApprovedSource({ governanceApproval: undefined, blockers: ["Dependency blocked"] })
  );

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.nextStep, "Blocker Resolution");
});

test("current-state rejection takes precedence over blockers", () => {
  const result = assessEnhancementEngineeringEligibility(
    canonicalApprovedSource({ status: "duplicate", blockers: ["Dependency blocked"] })
  );

  assert.equal(result.decision, "INELIGIBLE");
  assert.equal(result.nextStep, "Enhancement Refinement or Rejection");
});

test("source immutability and side-effect isolation are preserved", () => {
  const source = canonicalApprovedSource();
  const before = clone(source);
  deepFreeze(source);

  const result = assessEnhancementEngineeringEligibility(source);

  assert.equal(result.decision, "ELIGIBLE");
  assert.deepEqual(source, before);
});

test("provenance is canonical and contains separate deterministic fingerprint metadata", () => {
  const result = assessEnhancementEngineeringEligibility(canonicalApprovedSource());

  assert.equal(result.provenance.objective, "Objective 10.6.2 Enhancement Engineering Eligibility Assessment");
  assert.equal(result.provenance.missionId, "EOS-10.6.2");
  assert.equal(result.provenance.contractVersion, "10.6.2-canonical-result-v1");
  assert.equal(result.provenance.deterministic, true);
  assert.equal(typeof result.provenance.sourceFingerprint, "string");
  assert.equal(result.provenance.sourceFingerprint.length, 64);
  assert.equal(result.metadata.sourceFingerprint, result.provenance.sourceFingerprint);
});

test("service remains ESM-compatible and does not export mission generation", () => {
  assert.equal(typeof assessEnhancementEngineeringEligibility, "function");
  assert.equal(Object.hasOwn(eligibilityService, "generateEngineeringMissions"), false);
});
