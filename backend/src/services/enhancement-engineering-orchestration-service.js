import { assessEnhancementEngineeringEligibility } from './enhancement-engineering-eligibility-service.js';
import { generateEngineeringMissionFromEnhancementEcr } from './mission-generator-service.js';

export const ASSESSMENT_EXECUTION_COMPLETED = 'COMPLETED';
export const ENGINEERING_ELIGIBILITY_DECISION_ELIGIBLE = 'ELIGIBLE';

export const ENHANCEMENT_ENGINEERING_ORCHESTRATION_STATUS = Object.freeze({
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
});

export const AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE = deepFreeze({
  id: 'ECR-10-6-3-CANONICAL-001',
  sourceId: 'ECR-10-6-3-CANONICAL-001',
  type: 'ENHANCEMENT_ECR',
  title: 'Governed Enhancement-to-Engineering orchestration',
  description: 'Create a governed orchestration path from an eligible Enhancement/ECR into exactly one canonical Engineering Mission.',
  objective: 'Prove governed Enhancement/ECR to Engineering Mission orchestration.',
  priority: 'Critical',
  status: 'Approved',
  affectedAreas: [
    'backend/src/services/enhancement-engineering-orchestration-service.js',
    'tests/enhancement-engineering-orchestration.test.js'
  ],
  acceptanceCriteria: [
    'Canonical Objective 10.6.2 assessment returns ELIGIBLE.',
    'Canonical Objective 10.6.1 bridge accepts the same source.',
    'Exactly one deterministic Engineering Mission is generated.'
  ],
  governanceApproval: {
    status: 'APPROVED',
    recognized: true,
    authority: 'Governance Office',
    reference: 'GOV-10.6.3-CANONICAL-001'
  }
});

export const CANONICAL_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE = AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE;

function cloneValue(value) {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      return JSON.parse(JSON.stringify(value));
    }
  }

  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const key of Reflect.ownKeys(value)) {
      deepFreeze(value[key]);
    }

    Object.freeze(value);
  }

  return value;
}

function isThenable(value) {
  return value && typeof value.then === 'function';
}

function cloneCanonicalSource(source) {
  return deepFreeze(cloneValue(source));
}

function normalizeFailedRequirements(assessment) {
  return Array.isArray(assessment?.failedRequirements)
    ? cloneValue(assessment.failedRequirements)
    : [];
}

function normalizeEngineeringMissions(bridgeResult) {
  if (bridgeResult === undefined || bridgeResult === null) {
    return [];
  }

  if (Array.isArray(bridgeResult)) {
    return bridgeResult;
  }

  if (Array.isArray(bridgeResult.engineeringMissions)) {
    return bridgeResult.engineeringMissions;
  }

  if (Array.isArray(bridgeResult.missions)) {
    return bridgeResult.missions;
  }

  if (bridgeResult.engineeringMission) {
    return [bridgeResult.engineeringMission];
  }

  if (bridgeResult.mission) {
    return [bridgeResult.mission];
  }

  if (bridgeResult.generatedMission) {
    return [bridgeResult.generatedMission];
  }

  return [bridgeResult];
}

function buildProvenance(source) {
  return {
    objective: '10.6.3',
    orchestrationContract: 'EOS-10.6.3',
    sourceId: source.sourceId,
    sourceType: source.type,
    lineage: [
      {
        objective: '10.6.2',
        service: 'assessEnhancementEngineeringEligibility',
        role: 'canonical engineering eligibility assessment',
        resultContract: {
          assessmentExecutionField: 'assessmentStatus',
          assessmentSuccessfulValue: ASSESSMENT_EXECUTION_COMPLETED,
          eligibilityDecisionField: 'decision',
          eligibleDecisionValue: ENGINEERING_ELIGIBILITY_DECISION_ELIGIBLE
        }
      },
      {
        objective: '10.6.1',
        service: 'generateEngineeringMissionFromEnhancementEcr',
        role: 'canonical enhancement/ECR to Engineering Mission bridge'
      }
    ]
  };
}

function freezeResult(result) {
  return deepFreeze(cloneValue(result));
}

function buildFailureResult({ source, assessment, error, failureReason }) {
  const normalizedError = error instanceof Error
    ? { name: error.name, message: error.message }
    : error
      ? { name: 'OrchestrationError', message: String(error) }
      : null;

  const assessmentStatus = assessment?.assessmentStatus ?? null;
  const eligibilityDecision = assessment?.decision ?? null;

  return freezeResult({
    status: ENHANCEMENT_ENGINEERING_ORCHESTRATION_STATUS.FAILED,
    assessmentStatus,
    eligibilityDecision,
    decision: eligibilityDecision,
    failedRequirements: normalizeFailedRequirements(assessment),
    missionGenerated: false,
    generatedMissionCount: 0,
    engineeringMissions: [],
    engineeringMission: null,
    mission: null,
    source,
    assessment: assessment ? cloneValue(assessment) : null,
    bridgeResult: null,
    provenance: buildProvenance(source),
    failureReason,
    error: normalizedError
  });
}

function buildCompletedWithoutMissionResult({ source, assessment }) {
  const assessmentStatus = assessment.assessmentStatus;
  const eligibilityDecision = assessment.decision;

  return freezeResult({
    status: ENHANCEMENT_ENGINEERING_ORCHESTRATION_STATUS.COMPLETED,
    assessmentStatus,
    eligibilityDecision,
    decision: eligibilityDecision,
    failedRequirements: normalizeFailedRequirements(assessment),
    missionGenerated: false,
    generatedMissionCount: 0,
    engineeringMissions: [],
    engineeringMission: null,
    mission: null,
    source,
    assessment: cloneValue(assessment),
    bridgeResult: null,
    provenance: buildProvenance(source)
  });
}

function buildCompletedWithMissionResult({ source, assessment, bridgeResult }) {
  const engineeringMissions = normalizeEngineeringMissions(bridgeResult);

  if (engineeringMissions.length !== 1) {
    return buildFailureResult({
      source,
      assessment,
      failureReason: `Canonical Objective 10.6.1 bridge returned ${engineeringMissions.length} Engineering Missions; exactly one is required.`
    });
  }

  const assessmentStatus = assessment.assessmentStatus;
  const eligibilityDecision = assessment.decision;
  const engineeringMission = engineeringMissions[0];

  return freezeResult({
    status: ENHANCEMENT_ENGINEERING_ORCHESTRATION_STATUS.COMPLETED,
    assessmentStatus,
    eligibilityDecision,
    decision: eligibilityDecision,
    failedRequirements: normalizeFailedRequirements(assessment),
    missionGenerated: true,
    generatedMissionCount: 1,
    engineeringMissions,
    engineeringMission,
    mission: engineeringMission,
    source,
    assessment: cloneValue(assessment),
    bridgeResult: cloneValue(bridgeResult),
    provenance: buildProvenance(source)
  });
}

function continueAfterAssessment(source, assessment) {
  const assessmentStatus = assessment?.assessmentStatus;
  const eligibilityDecision = assessment?.decision;

  if (assessmentStatus !== ASSESSMENT_EXECUTION_COMPLETED) {
    return buildFailureResult({
      source,
      assessment,
      failureReason: `Canonical Objective 10.6.2 assessment execution state must be ${ASSESSMENT_EXECUTION_COMPLETED}.`
    });
  }

  if (eligibilityDecision !== ENGINEERING_ELIGIBILITY_DECISION_ELIGIBLE) {
    return buildCompletedWithoutMissionResult({ source, assessment });
  }

  const bridgeResult = generateEngineeringMissionFromEnhancementEcr(source);

  if (isThenable(bridgeResult)) {
    return bridgeResult
      .then((resolvedBridgeResult) => buildCompletedWithMissionResult({
        source,
        assessment,
        bridgeResult: resolvedBridgeResult
      }))
      .catch((error) => buildFailureResult({
        source,
        assessment,
        error,
        failureReason: 'Canonical Objective 10.6.1 bridge execution failed.'
      }));
  }

  return buildCompletedWithMissionResult({ source, assessment, bridgeResult });
}

export function runEnhancementEngineeringOrchestration(source = AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE) {
  const canonicalSource = cloneCanonicalSource(source);

  try {
    const assessment = assessEnhancementEngineeringEligibility(canonicalSource);

    if (isThenable(assessment)) {
      return assessment
        .then((resolvedAssessment) => continueAfterAssessment(canonicalSource, resolvedAssessment))
        .catch((error) => buildFailureResult({
          source: canonicalSource,
          assessment: null,
          error,
          failureReason: 'Canonical Objective 10.6.2 assessment execution failed.'
        }));
    }

    return continueAfterAssessment(canonicalSource, assessment);
  } catch (error) {
    return buildFailureResult({
      source: canonicalSource,
      assessment: null,
      error,
      failureReason: 'Enhancement-to-Engineering orchestration execution failed.'
    });
  }
}

export const orchestrateEnhancementEngineering = runEnhancementEngineeringOrchestration;
export const orchestrateEnhancementToEngineering = runEnhancementEngineeringOrchestration;
export const orchestrateEnhancementEngineeringMission = runEnhancementEngineeringOrchestration;
export const executeEnhancementEngineeringOrchestration = runEnhancementEngineeringOrchestration;

export function getAuthoritativeEnhancementEngineeringIntersectionSource() {
  return cloneCanonicalSource(AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE);
}

export default Object.freeze({
  ASSESSMENT_EXECUTION_COMPLETED,
  ENGINEERING_ELIGIBILITY_DECISION_ELIGIBLE,
  ENHANCEMENT_ENGINEERING_ORCHESTRATION_STATUS,
  AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE,
  CANONICAL_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE,
  getAuthoritativeEnhancementEngineeringIntersectionSource,
  runEnhancementEngineeringOrchestration,
  orchestrateEnhancementEngineering,
  orchestrateEnhancementToEngineering,
  orchestrateEnhancementEngineeringMission,
  executeEnhancementEngineeringOrchestration
});
