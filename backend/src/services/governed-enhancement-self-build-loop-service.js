import * as eligibilityService from './enhancement-engineering-eligibility-service.js';
import * as orchestrationService from './enhancement-engineering-orchestration-service.js';
import * as workforceAssignmentService from './ai-workforce-assignment-service.js';
import * as autonomousEngineeringRuntimeService from './autonomous-engineering-runtime-service.js';
import * as engineeringLedgerLifecycleService from './engineering-ledger-service.js';
import * as missionControlSynchronizationService from './mission-control-self-improvement-synchronization-service.js';
import * as completionEvidenceService from './mission-completion-service.js';
import * as enhancementCompletionClosureService from './enhancement-completion-closure-service.js';

'use strict';

const ELIGIBILITY_FUNCTIONS = Object.freeze([
  'assessEnhancementEngineeringEligibility',
  'evaluateEnhancementEngineeringEligibility',
  'determineEnhancementEngineeringEligibility',
  'assessEngineeringEligibility',
  'evaluateEngineeringEligibility',
  'assessEligibility',
  'evaluateEligibility'
]);

const ORCHESTRATION_FUNCTIONS = Object.freeze([
  'orchestrateEnhancementEngineeringMission',
  'orchestrateEnhancementToEngineeringMission',
  'orchestrateEnhancementEngineering',
  'runEnhancementEngineeringOrchestration',
  'createEngineeringMissionFromEnhancement',
  'generateEngineeringMissionFromEnhancement',
  'generateEngineeringMission',
  'createEngineeringMission'
]);

const WORKFORCE_ASSIGNMENT_FUNCTIONS = Object.freeze([
  'assignCanonicalAIWorkforce',
  'assignEosAIWorkforce',
  'assignAIWorkforce',
  'assignWorkforceForEngineeringMission',
  'assignEngineeringMissionWorkforce',
  'assignWorkforce'
]);

const RUNTIME_FUNCTIONS = Object.freeze([
  'runAutonomousEngineeringRuntime'
]);

const LEDGER_FUNCTIONS = Object.freeze([
  'synchronizeEngineeringLedgerLifecycle',
  'syncEngineeringLedgerLifecycle',
  'recordEngineeringLedgerLifecycleSynchronization',
  'recordEngineeringLedgerLifecycle',
  'synchronizeLifecycle',
  'syncLifecycle'
]);

const MISSION_CONTROL_FUNCTIONS = Object.freeze([
  'synchronizeMissionControlSelfImprovement',
  'syncMissionControlSelfImprovement',
  'recordMissionControlSelfImprovementSynchronization',
  'recordMissionControlSelfImprovement',
  'synchronizeMissionControl',
  'syncMissionControl'
]);

const COMPLETION_EVIDENCE_FUNCTIONS = Object.freeze([
  'requireAuthoritativeMissionCompletionEvidence',
  'validateAuthoritativeMissionCompletionEvidence',
  'extractAuthoritativeMissionCompletionEvidence',
  'validateMissionCompletionEvidence',
  'getMissionCompletionEvidence',
  'extractMissionCompletionEvidence'
]);

const CLOSURE_FUNCTIONS = Object.freeze([
  'closeEnhancementFromCompletion',
  'closeEnhancementFromMissionCompletion',
  'closeEnhancementCompletion',
  'closeCompletedEnhancement',
  'closeEnhancementEcrCompletion',
  'closeEnhancementECRCompletion',
  'closeEnhancement',
  'closeCompletion'
]);

async function runGovernedEnhancementSelfBuildLoop(request = {}, dependencyOverrides = {}) {
  const normalizedRequest = normalizeRequest(request, dependencyOverrides);
  const dependencies = loadDependencies(normalizedRequest.dependencies);
  const source = cloneValue(normalizedRequest.source);
  const continuationSource = normalizedRequest.hasContinuationSource
    ? cloneValue(normalizedRequest.continuationSource)
    : undefined;
  const context = cloneValue(normalizedRequest.context || {});

  if (!isPlainObject(source)) {
    return immutableResult({
      status: 'rejected',
      terminal: true,
      reason: 'INVALID_SOURCE',
      provenance: {
        source: cloneValue(source)
      },
      continuationDecision: {
        authorized: false,
        status: 'not_evaluated',
        reason: 'SOURCE_REJECTED'
      },
      nextEngineeringMission: null
    });
  }

  const eligibilityAssessment = await assessEligibility({
    dependencies,
    source,
    role: 'originating',
    context
  });

  if (!isEligibilityApproved(eligibilityAssessment)) {
    return immutableResult({
      status: 'rejected',
      terminal: true,
      reason: 'SOURCE_NOT_ENGINEERING_ELIGIBLE',
      provenance: {
        source,
        eligibilityAssessment
      },
      continuationDecision: {
        authorized: false,
        status: 'not_evaluated',
        reason: 'SOURCE_REJECTED'
      },
      nextEngineeringMission: null
    });
  }

  const initialOrchestration = await orchestrateEngineeringMission({
    dependencies,
    source,
    eligibilityAssessment,
    role: 'originating',
    context
  });
  const engineeringMission = extractEngineeringMission(initialOrchestration);

  const workforceAssignment = await assignWorkforce({
    dependencies,
    source,
    eligibilityAssessment,
    orchestration: initialOrchestration,
    engineeringMission,
    context
  });

  const runtimeResult = await runExistingRuntime({
    dependencies,
    source,
    eligibilityAssessment,
    orchestration: initialOrchestration,
    engineeringMission,
    workforceAssignment,
    context,
    runtimeOptions: normalizedRequest.runtimeOptions || {}
  });

  assertRuntimeCompleted(runtimeResult);

  const engineeringLedgerLifecycleRecord = await synchronizeEngineeringLedgerLifecycle({
    dependencies,
    source,
    eligibilityAssessment,
    orchestration: initialOrchestration,
    engineeringMission,
    workforceAssignment,
    runtimeResult,
    context
  });

  const missionControlSynchronization = await synchronizeMissionControl({
    dependencies,
    source,
    eligibilityAssessment,
    orchestration: initialOrchestration,
    engineeringMission,
    workforceAssignment,
    runtimeResult,
    engineeringLedgerLifecycleRecord,
    context
  });

  const missionCompletionEvidence = await requireAuthoritativeCompletionEvidence({
    dependencies,
    source,
    eligibilityAssessment,
    orchestration: initialOrchestration,
    engineeringMission,
    workforceAssignment,
    runtimeResult,
    engineeringLedgerLifecycleRecord,
    missionControlSynchronization,
    context
  });

  const enhancementClosure = await closeEnhancementCompletion({
    dependencies,
    source,
    eligibilityAssessment,
    orchestration: initialOrchestration,
    engineeringMission,
    workforceAssignment,
    runtimeResult,
    engineeringLedgerLifecycleRecord,
    missionControlSynchronization,
    missionCompletionEvidence,
    context
  });

  assertClosureAccepted(enhancementClosure);

  const continuationDecision = await decideContinuation({
    dependencies,
    hasContinuationSource: normalizedRequest.hasContinuationSource,
    continuationSource,
    context
  });

  return immutableResult({
    status: 'completed',
    terminal: !continuationDecision.authorized,
    source,
    eligibilityAssessment,
    initialEngineeringOrchestration: initialOrchestration,
    engineeringMission,
    workforceAssignment,
    runtimeResult,
    engineeringLedgerLifecycleRecord,
    missionControlSynchronization,
    missionCompletionEvidence,
    enhancementClosure,
    continuationDecision,
    nextEngineeringMission: continuationDecision.nextEngineeringMission || null,
    provenance: {
      source,
      eligibilityAssessment,
      initialEngineeringOrchestration: initialOrchestration,
      engineeringMission,
      workforceAssignment,
      runtimeResult,
      engineeringLedgerLifecycleRecord,
      missionControlSynchronization,
      missionCompletionEvidence,
      enhancementClosure,
      continuationDecision,
      continuationSource: normalizedRequest.hasContinuationSource ? continuationSource : null,
      nextEngineeringMission: continuationDecision.nextEngineeringMission || null
    }
  });
}

function normalizeRequest(request, dependencyOverrides) {
  const dependencies = Object.assign({}, dependencyOverrides || {});

  if (isPlainObject(request) && Object.prototype.hasOwnProperty.call(request, 'dependencies')) {
    Object.assign(dependencies, request.dependencies || {});
  }

  if (isPlainObject(request) && (Object.prototype.hasOwnProperty.call(request, 'source') || Object.prototype.hasOwnProperty.call(request, 'enhancement') || Object.prototype.hasOwnProperty.call(request, 'ecr'))) {
    return {
      source: request.source || request.enhancement || request.ecr,
      continuationSource: request.continuationSource || request.nextEnhancement || request.nextEcr || request.nextECR,
      hasContinuationSource: Object.prototype.hasOwnProperty.call(request, 'continuationSource') || Object.prototype.hasOwnProperty.call(request, 'nextEnhancement') || Object.prototype.hasOwnProperty.call(request, 'nextEcr') || Object.prototype.hasOwnProperty.call(request, 'nextECR'),
      context: request.context || {},
      runtimeOptions: request.runtimeOptions || {},
      dependencies
    };
  }

  return {
    source: request,
    continuationSource: undefined,
    hasContinuationSource: false,
    context: {},
    runtimeOptions: {},
    dependencies
  };
}

function loadDependencies(overrides = {}) {
  return Object.freeze(Object.assign({
    eligibilityService,
    orchestrationService,
    workforceAssignmentService,
    autonomousEngineeringRuntimeService,
    engineeringLedgerLifecycleService,
    missionControlSynchronizationService,
    completionEvidenceService,
    enhancementCompletionClosureService
  }, overrides || {}));
}

async function assessEligibility({ dependencies, source, role, context }) {
  const fn = resolveCanonicalFunction(dependencies, 'eligibilityService', ELIGIBILITY_FUNCTIONS, 'Enhancement/ECR engineering eligibility');
  return cloneValue(await fn({
    source: cloneValue(source),
    enhancement: cloneValue(source),
    ecr: cloneValue(source),
    role,
    context: cloneValue(context)
  }));
}

async function orchestrateEngineeringMission({ dependencies, source, eligibilityAssessment, role, context }) {
  const fn = resolveCanonicalFunction(dependencies, 'orchestrationService', ORCHESTRATION_FUNCTIONS, 'Enhancement-to-Engineering orchestration');
  const orchestration = cloneValue(await fn({
    source: cloneValue(source),
    enhancement: cloneValue(source),
    ecr: cloneValue(source),
    eligibilityAssessment: cloneValue(eligibilityAssessment),
    role,
    context: cloneValue(context)
  }));

  extractEngineeringMission(orchestration);
  return orchestration;
}

async function assignWorkforce({ dependencies, source, eligibilityAssessment, orchestration, engineeringMission, context }) {
  const fn = resolveCanonicalFunction(dependencies, 'workforceAssignmentService', WORKFORCE_ASSIGNMENT_FUNCTIONS, 'EOS AI Workforce assignment');
  const assignment = cloneValue(await fn({
    source: cloneValue(source),
    enhancement: cloneValue(source),
    ecr: cloneValue(source),
    eligibilityAssessment: cloneValue(eligibilityAssessment),
    orchestration: cloneValue(orchestration),
    engineeringMission: cloneValue(engineeringMission),
    mission: cloneValue(engineeringMission),
    context: cloneValue(context)
  }));

  if (!assignment || assignment.failed === true || assignment.success === false || assignment.status === 'failed' || assignment.status === 'rejected') {
    throw new Error('Canonical EOS AI Workforce assignment failed.');
  }

  return assignment;
}

async function runExistingRuntime({ dependencies, source, eligibilityAssessment, orchestration, engineeringMission, workforceAssignment, context, runtimeOptions }) {
  const fn = resolveCanonicalFunction(dependencies, 'autonomousEngineeringRuntimeService', RUNTIME_FUNCTIONS, 'autonomous engineering runtime');
  return cloneValue(await fn(Object.assign({}, cloneValue(runtimeOptions || {}), {
    source: cloneValue(source),
    enhancement: cloneValue(source),
    ecr: cloneValue(source),
    eligibilityAssessment: cloneValue(eligibilityAssessment),
    orchestration: cloneValue(orchestration),
    engineeringMission: cloneValue(engineeringMission),
    mission: cloneValue(engineeringMission),
    workforceAssignment: cloneValue(workforceAssignment),
    context: cloneValue(context),
    generateNextMission: false
  })));
}

async function synchronizeEngineeringLedgerLifecycle({ dependencies, source, eligibilityAssessment, orchestration, engineeringMission, workforceAssignment, runtimeResult, context }) {
  const fn = resolveCanonicalFunction(dependencies, 'engineeringLedgerLifecycleService', LEDGER_FUNCTIONS, 'Engineering Ledger lifecycle synchronization');
  const record = cloneValue(await fn({
    source: cloneValue(source),
    enhancement: cloneValue(source),
    ecr: cloneValue(source),
    eligibilityAssessment: cloneValue(eligibilityAssessment),
    orchestration: cloneValue(orchestration),
    engineeringMission: cloneValue(engineeringMission),
    mission: cloneValue(engineeringMission),
    workforceAssignment: cloneValue(workforceAssignment),
    runtimeResult: cloneValue(runtimeResult),
    context: cloneValue(context)
  }));

  if (!record || record.failed === true || record.success === false || record.status === 'failed' || record.status === 'rejected') {
    throw new Error('Canonical Engineering Ledger lifecycle synchronization failed.');
  }

  return record;
}

async function synchronizeMissionControl({ dependencies, source, eligibilityAssessment, orchestration, engineeringMission, workforceAssignment, runtimeResult, engineeringLedgerLifecycleRecord, context }) {
  const fn = resolveCanonicalFunction(dependencies, 'missionControlSynchronizationService', MISSION_CONTROL_FUNCTIONS, 'Mission Control self-improvement synchronization');
  const record = cloneValue(await fn({
    source: cloneValue(source),
    enhancement: cloneValue(source),
    ecr: cloneValue(source),
    eligibilityAssessment: cloneValue(eligibilityAssessment),
    orchestration: cloneValue(orchestration),
    engineeringMission: cloneValue(engineeringMission),
    mission: cloneValue(engineeringMission),
    workforceAssignment: cloneValue(workforceAssignment),
    runtimeResult: cloneValue(runtimeResult),
    engineeringLedgerLifecycleRecord: cloneValue(engineeringLedgerLifecycleRecord),
    ledgerRecord: cloneValue(engineeringLedgerLifecycleRecord),
    context: cloneValue(context)
  }));

  if (!record || record.failed === true || record.success === false || record.status === 'failed' || record.status === 'rejected') {
    throw new Error('Canonical Mission Control self-improvement synchronization failed.');
  }

  return record;
}

async function requireAuthoritativeCompletionEvidence(payload) {
  const { dependencies } = payload;
  const fn = resolveOptionalCanonicalFunction(dependencies, 'completionEvidenceService', COMPLETION_EVIDENCE_FUNCTIONS);
  const evidence = fn
    ? cloneValue(await fn(cloneValue(payload)))
    : cloneValue(extractCompletionEvidence(payload.runtimeResult));

  if (!isAuthoritativeCompletionEvidence(evidence, payload.engineeringMission)) {
    throw new Error('Authoritative mission completion evidence is required before Enhancement/ECR closure.');
  }

  return evidence;
}

async function closeEnhancementCompletion(payload) {
  const { dependencies } = payload;
  const fn = resolveCanonicalFunction(dependencies, 'enhancementCompletionClosureService', CLOSURE_FUNCTIONS, 'Objective 10.6.7 Enhancement/ECR completion closure');
  return cloneValue(await fn({
    source: cloneValue(payload.source),
    enhancement: cloneValue(payload.source),
    ecr: cloneValue(payload.source),
    eligibilityAssessment: cloneValue(payload.eligibilityAssessment),
    orchestration: cloneValue(payload.orchestration),
    engineeringMission: cloneValue(payload.engineeringMission),
    mission: cloneValue(payload.engineeringMission),
    workforceAssignment: cloneValue(payload.workforceAssignment),
    runtimeResult: cloneValue(payload.runtimeResult),
    engineeringLedgerLifecycleRecord: cloneValue(payload.engineeringLedgerLifecycleRecord),
    ledgerRecord: cloneValue(payload.engineeringLedgerLifecycleRecord),
    missionControlSynchronization: cloneValue(payload.missionControlSynchronization),
    missionCompletionEvidence: cloneValue(payload.missionCompletionEvidence),
    completionEvidence: cloneValue(payload.missionCompletionEvidence),
    context: cloneValue(payload.context)
  }));
}

async function decideContinuation({ dependencies, hasContinuationSource, continuationSource, context }) {
  if (!hasContinuationSource) {
    return {
      authorized: false,
      status: 'not_authorized',
      reason: 'NO_CONTINUATION_SOURCE',
      continuationSource: null,
      eligibilityAssessment: null,
      orchestration: null,
      nextEngineeringMission: null
    };
  }

  if (!isPlainObject(continuationSource)) {
    return {
      authorized: false,
      status: 'rejected',
      reason: 'INVALID_CONTINUATION_SOURCE',
      continuationSource: cloneValue(continuationSource),
      eligibilityAssessment: null,
      orchestration: null,
      nextEngineeringMission: null
    };
  }

  const eligibilityAssessment = await assessEligibility({
    dependencies,
    source: continuationSource,
    role: 'continuation',
    context
  });

  if (!isEligibilityApproved(eligibilityAssessment)) {
    return {
      authorized: false,
      status: 'rejected',
      reason: continuationRejectionReason(eligibilityAssessment),
      continuationSource: cloneValue(continuationSource),
      eligibilityAssessment,
      orchestration: null,
      nextEngineeringMission: null
    };
  }

  const orchestration = await orchestrateEngineeringMission({
    dependencies,
    source: continuationSource,
    eligibilityAssessment,
    role: 'continuation',
    context
  });
  const nextEngineeringMission = extractEngineeringMission(orchestration);

  return {
    authorized: true,
    status: 'authorized',
    reason: 'INDEPENDENT_CONTINUATION_SOURCE_APPROVED',
    continuationSource: cloneValue(continuationSource),
    eligibilityAssessment,
    orchestration,
    nextEngineeringMission
  };
}

function resolveCanonicalFunction(dependencies, serviceKey, functionNames, authorityName) {
  const fn = resolveOptionalCanonicalFunction(dependencies, serviceKey, functionNames);
  if (!fn) {
    throw new Error(authorityName + ' authority is unavailable.');
  }
  return fn;
}

function resolveOptionalCanonicalFunction(dependencies, serviceKey, functionNames) {
  for (const functionName of functionNames) {
    if (typeof dependencies[functionName] === 'function') {
      return dependencies[functionName];
    }
  }

  const service = dependencies[serviceKey];
  if (typeof service === 'function') {
    return service;
  }

  if (service && typeof service === 'object') {
    for (const functionName of functionNames) {
      if (typeof service[functionName] === 'function') {
        return service[functionName].bind(service);
      }
    }
  }

  return null;
}

function extractEngineeringMission(orchestration) {
  const mission = orchestration && (
    orchestration.engineeringMission ||
    orchestration.mission ||
    orchestration.generatedEngineeringMission ||
    orchestration.generatedMission ||
    orchestration.engineeringMissionRecord ||
    (orchestration.engineering && orchestration.engineering.mission)
  );

  if (!mission || typeof mission !== 'object') {
    throw new Error('Canonical Enhancement-to-Engineering orchestration did not return an Engineering Mission.');
  }

  return cloneValue(mission);
}

function extractCompletionEvidence(runtimeResult) {
  if (!runtimeResult || typeof runtimeResult !== 'object') {
    return null;
  }

  return runtimeResult.missionCompletionEvidence ||
    runtimeResult.completionEvidence ||
    runtimeResult.authoritativeCompletionEvidence ||
    runtimeResult.completion ||
    runtimeResult.evidence ||
    null;
}

function assertRuntimeCompleted(runtimeResult) {
  if (!runtimeResult || typeof runtimeResult !== 'object') {
    throw new Error('Autonomous engineering runtime did not return a governed result.');
  }

  const status = normalizeStatus(runtimeResult.status || runtimeResult.result || runtimeResult.outcome);
  if (runtimeResult.success === false || runtimeResult.ok === false || runtimeResult.failed === true || ['failed', 'error', 'rejected', 'blocked'].includes(status)) {
    throw new Error('Autonomous engineering runtime failed.');
  }
}

function assertClosureAccepted(closure) {
  if (!closure || typeof closure !== 'object') {
    throw new Error('Objective 10.6.7 Enhancement/ECR closure did not return a governed result.');
  }

  const status = normalizeStatus(closure.status || closure.result || closure.outcome);
  if (closure.closed === false || closure.accepted === false || closure.success === false || closure.failed === true || ['failed', 'error', 'rejected', 'blocked'].includes(status)) {
    throw new Error('Objective 10.6.7 Enhancement/ECR closure was rejected.');
  }
}

function isEligibilityApproved(assessment) {
  if (!assessment || typeof assessment !== 'object') {
    return false;
  }

  const status = normalizeStatus(assessment.status || assessment.decision || assessment.result || assessment.outcome);
  if (assessment.eligible === false || assessment.isEligible === false || assessment.approved === false || assessment.authorized === false) {
    return false;
  }
  if (assessment.blocked === true || assessment.isBlocked === true || assessment.requiresGovernanceReview === true || assessment.governanceReviewRequired === true || assessment.requiresReview === true) {
    return false;
  }
  if (['blocked', 'ineligible', 'not_eligible', 'rejected', 'requires_governance_review', 'governance_review_required', 'review_required'].includes(status)) {
    return false;
  }

  return assessment.eligible === true || assessment.isEligible === true || assessment.approved === true || assessment.authorized === true || ['eligible', 'approved', 'authorized', 'accepted'].includes(status);
}

function continuationRejectionReason(assessment) {
  const status = normalizeStatus(assessment && (assessment.status || assessment.decision || assessment.result || assessment.outcome));
  if (assessment && (assessment.blocked === true || assessment.isBlocked === true || status === 'blocked')) {
    return 'CONTINUATION_BLOCKED';
  }
  if (assessment && (assessment.requiresGovernanceReview === true || assessment.governanceReviewRequired === true || assessment.requiresReview === true || ['requires_governance_review', 'governance_review_required', 'review_required'].includes(status))) {
    return 'CONTINUATION_REQUIRES_GOVERNANCE_REVIEW';
  }
  return 'CONTINUATION_NOT_ENGINEERING_ELIGIBLE';
}

function isAuthoritativeCompletionEvidence(evidence, engineeringMission) {
  if (!evidence || typeof evidence !== 'object') {
    return false;
  }

  const status = normalizeStatus(evidence.status || evidence.type || evidence.kind || evidence.result || evidence.outcome);
  const authoritative = evidence.authoritative === true || evidence.isAuthoritative === true || evidence.authority === 'Mission Complete' || evidence.authority === 'MISSION_COMPLETE' || ['authoritative', 'mission_complete', 'completed', 'complete', 'accepted'].includes(status);

  if (!authoritative) {
    return false;
  }

  const expectedMissionId = engineeringMission && (engineeringMission.missionId || engineeringMission.id || engineeringMission.identity);
  const evidenceMissionId = evidence.missionId || evidence.engineeringMissionId || evidence.missionIdentity || evidence.identity;

  return !expectedMissionId || !evidenceMissionId || expectedMissionId === evidenceMissionId;
}

function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function immutableResult(value) {
  return deepFreeze(cloneValue(value));
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (value && typeof value === 'object') {
    const cloned = {};
    for (const key of Object.keys(value)) {
      cloned[key] = cloneValue(value[key]);
    }
    return cloned;
  }

  return value;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }

  return value;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export {
  runGovernedEnhancementSelfBuildLoop
};
