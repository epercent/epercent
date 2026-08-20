import { createHash } from 'node:crypto';
import * as canonicalAgentRegistry from '../data/agents.js';

export const AI_WORKFORCE_ASSIGNMENT_STATUSES = Object.freeze({
  ASSIGNED: 'ASSIGNED',
  UNASSIGNABLE: 'UNASSIGNABLE',
  BLOCKED: 'BLOCKED',
  GOVERNANCE_REVIEW_REQUIRED: 'GOVERNANCE_REVIEW_REQUIRED'
});

const CANONICAL_AGENT_PREFIX = 'EOS-AGENT-';
const DECISION_PRECEDENCE = Object.freeze([
  AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED,
  AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED,
  AI_WORKFORCE_ASSIGNMENT_STATUSES.UNASSIGNABLE,
  AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED
]);

export function assignAIWorkforce(engineeringMission, options = {}) {
  const missionInput = engineeringMission;
  const optionInput = options && typeof options === 'object' ? options : {};
  const missionId = resolveMissionId(missionInput);
  const missionIdentityBlockers = [];

  if (!missionInput || typeof missionInput !== 'object' || Array.isArray(missionInput)) {
    missionIdentityBlockers.push('Exactly one canonical Engineering Mission object is required.');
  }

  if (!missionId) {
    missionIdentityBlockers.push('Engineering Mission identity is required.');
  }

  const requiredCapabilityInfo = extractRequiredCapabilities(missionInput);
  const requiredCapabilities = requiredCapabilityInfo.values;
  const requiredCapabilityBlockers = [];

  if (!requiredCapabilityInfo.present) {
    requiredCapabilityBlockers.push('Engineering Mission required capability information is required.');
  } else if (requiredCapabilities.length === 0) {
    requiredCapabilityBlockers.push('Engineering Mission must require at least one capability.');
  }

  const missionBlockers = collectBlockingConditions(missionInput);
  const blockingConditions = uniqueStable([
    ...missionIdentityBlockers,
    ...requiredCapabilityBlockers,
    ...missionBlockers
  ]);

  const workforceCandidates = resolveCanonicalWorkforce(optionInput.workforceRegistry);
  const diagnostics = workforceCandidates.map((candidate) => matchCandidate(candidate, requiredCapabilities));
  const satisfyingDiagnostics = diagnostics.filter((diagnostic) => diagnostic.unmatchedCapabilities.length === 0);
  const satisfyingBlockedDiagnostics = satisfyingDiagnostics.filter((diagnostic) => diagnostic.blockingConditions.length > 0);
  const satisfyingGovernanceDiagnostics = satisfyingDiagnostics.filter((diagnostic) => diagnostic.governanceReviewConditions.length > 0 && diagnostic.blockingConditions.length === 0);
  const assignableDiagnostics = satisfyingDiagnostics.filter((diagnostic) => diagnostic.blockingConditions.length === 0 && diagnostic.governanceReviewConditions.length === 0);

  if (blockingConditions.length > 0) {
    return buildResult({
      status: AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED,
      mission: missionInput,
      missionId,
      requiredCapabilities,
      matchedCapabilities: [],
      unmatchedCapabilities: requiredCapabilities,
      selectedDiagnostic: null,
      blockingConditions,
      governanceReviewConditions: [],
      workforceDiagnostics: diagnostics,
      options: optionInput
    });
  }

  if (satisfyingBlockedDiagnostics.length > 0 && assignableDiagnostics.length === 0) {
    const selectedBlocked = selectDeterministicDiagnostic(satisfyingBlockedDiagnostics);
    return buildResult({
      status: AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED,
      mission: missionInput,
      missionId,
      requiredCapabilities,
      matchedCapabilities: selectedBlocked.matchedCapabilities,
      unmatchedCapabilities: selectedBlocked.unmatchedCapabilities,
      selectedDiagnostic: selectedBlocked,
      blockingConditions: selectedBlocked.blockingConditions,
      governanceReviewConditions: [],
      workforceDiagnostics: diagnostics,
      options: optionInput
    });
  }

  const missionGovernanceReviewConditions = collectGovernanceReviewConditions(missionInput);
  if (missionGovernanceReviewConditions.length > 0) {
    const selectedForReview = selectDeterministicDiagnostic(assignableDiagnostics.length > 0 ? assignableDiagnostics : satisfyingGovernanceDiagnostics);
    return buildResult({
      status: AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED,
      mission: missionInput,
      missionId,
      requiredCapabilities,
      matchedCapabilities: selectedForReview ? selectedForReview.matchedCapabilities : [],
      unmatchedCapabilities: selectedForReview ? selectedForReview.unmatchedCapabilities : requiredCapabilities,
      selectedDiagnostic: selectedForReview,
      blockingConditions: [],
      governanceReviewConditions: missionGovernanceReviewConditions,
      workforceDiagnostics: diagnostics,
      options: optionInput
    });
  }

  if (assignableDiagnostics.length > 0) {
    const selected = selectDeterministicDiagnostic(assignableDiagnostics);
    return buildResult({
      status: AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED,
      mission: missionInput,
      missionId,
      requiredCapabilities,
      matchedCapabilities: selected.matchedCapabilities,
      unmatchedCapabilities: selected.unmatchedCapabilities,
      selectedDiagnostic: selected,
      blockingConditions: [],
      governanceReviewConditions: [],
      workforceDiagnostics: diagnostics,
      options: optionInput
    });
  }

  if (satisfyingGovernanceDiagnostics.length > 0) {
    const selectedReview = selectDeterministicDiagnostic(satisfyingGovernanceDiagnostics);
    return buildResult({
      status: AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED,
      mission: missionInput,
      missionId,
      requiredCapabilities,
      matchedCapabilities: selectedReview.matchedCapabilities,
      unmatchedCapabilities: selectedReview.unmatchedCapabilities,
      selectedDiagnostic: selectedReview,
      blockingConditions: [],
      governanceReviewConditions: selectedReview.governanceReviewConditions,
      workforceDiagnostics: diagnostics,
      options: optionInput
    });
  }

  return buildResult({
    status: AI_WORKFORCE_ASSIGNMENT_STATUSES.UNASSIGNABLE,
    mission: missionInput,
    missionId,
    requiredCapabilities,
    matchedCapabilities: bestMatchedCapabilities(diagnostics),
    unmatchedCapabilities: requiredCapabilities,
    selectedDiagnostic: null,
    blockingConditions: [],
    governanceReviewConditions: [],
    workforceDiagnostics: diagnostics,
    options: optionInput
  });
}

export const assignWorkforceForEngineeringMission = assignAIWorkforce;
export const createAIWorkforceAssignment = assignAIWorkforce;
export const assessAIWorkforceAssignment = assignAIWorkforce;
export default assignAIWorkforce;

function buildResult({ status, mission, missionId, requiredCapabilities, matchedCapabilities, unmatchedCapabilities, selectedDiagnostic, blockingConditions, governanceReviewConditions, workforceDiagnostics, options }) {
  const selectedCandidate = selectedDiagnostic ? selectedDiagnostic.candidate : null;
  const selectedIdentity = selectedCandidate ? selectedCandidate.identity : null;
  const assignmentCore = {
    engineeringMissionId: missionId || null,
    assignmentStatus: status,
    selectedWorkforceIdentity: selectedIdentity,
    requiredCapabilities: normalizeCapabilities(requiredCapabilities),
    matchedCapabilities: normalizeCapabilities(matchedCapabilities),
    unmatchedCapabilities: normalizeCapabilities(unmatchedCapabilities),
    workforceState: workforceDiagnostics.map((diagnostic) => ({
      identity: diagnostic.candidate.identity,
      requiredMatched: diagnostic.matchedCapabilities,
      requiredUnmatched: diagnostic.unmatchedCapabilities,
      blocked: diagnostic.blockingConditions.length > 0,
      governanceReviewRequired: diagnostic.governanceReviewConditions.length > 0
    })).sort(compareByIdentity)
  };

  const assignmentId = `AIWA-${deterministicHash(assignmentCore).slice(0, 24).toUpperCase()}`;
  const result = {
    assignmentId,
    assignmentStatus: status,
    engineeringMissionId: missionId || null,
    sourceIdentity: missionId || null,
    upstreamProvenanceReference: resolveUpstreamProvenanceReference(mission, options),
    assignedOffice: selectedCandidate ? selectedCandidate.office : null,
    assignedWorkforce: selectedCandidate ? {
      identity: selectedCandidate.identity,
      name: selectedCandidate.name,
      office: selectedCandidate.office
    } : null,
    assignedAgent: selectedIdentity,
    canonicalExecutableWorkforceIdentity: selectedIdentity,
    assignmentReasons: buildAssignmentReasons(status, selectedDiagnostic, requiredCapabilities, blockingConditions, governanceReviewConditions, workforceDiagnostics),
    requiredCapabilities: normalizeCapabilities(requiredCapabilities),
    matchedCapabilities: normalizeCapabilities(matchedCapabilities),
    unmatchedCapabilities: normalizeCapabilities(unmatchedCapabilities),
    governanceState: {
      assignmentStatus: status,
      reviewRequired: status === AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED,
      blocked: status === AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED,
      decisionPrecedence: [...DECISION_PRECEDENCE]
    },
    blockingConditions: [...blockingConditions],
    provenance: {
      engineeringMissionId: missionId || null,
      sourceEngineeringMissionIdentity: missionId || null,
      sourceProvenance: cloneJsonSafe(resolveValue(mission, ['provenance']) || null),
      upstreamProvenance: cloneJsonSafe(resolveUpstreamProvenanceReference(mission, options)),
      selectedWorkforceIdentity: selectedIdentity,
      workforceRegistry: 'backend/src/data/agents.js',
      canonicalIdentityPrefix: CANONICAL_AGENT_PREFIX,
      providerDispatch: false,
      missionExecution: false
    },
    nextStep: resolveNextStep(status)
  };

  return deepFreeze(result);
}

function buildAssignmentReasons(status, selectedDiagnostic, requiredCapabilities, blockingConditions, governanceReviewConditions, workforceDiagnostics) {
  if (status === AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED) {
    return [
      'Assignment stopped by deterministic blocker precedence.',
      ...blockingConditions.map((condition) => `Blocking condition: ${condition}`)
    ];
  }

  if (status === AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED) {
    const selectedIdentity = selectedDiagnostic ? selectedDiagnostic.candidate.identity : 'no canonical candidate selected';
    return [
      'Assignment stopped by deterministic governance review precedence.',
      `Governance review candidate: ${selectedIdentity}.`,
      ...governanceReviewConditions.map((condition) => `Governance review condition: ${condition}`)
    ];
  }

  if (status === AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED && selectedDiagnostic) {
    return [
      `Canonical EOS workforce identity ${selectedDiagnostic.candidate.identity} satisfies all required capabilities.`,
      `Matched capabilities: ${selectedDiagnostic.matchedCapabilities.join(', ')}.`,
      'Tie breaking used stable canonical identity ordering after deterministic capability matching.',
      'No provider dispatch or Engineering Mission execution was performed.'
    ];
  }

  const candidateCount = workforceDiagnostics.length;
  return [
    `No canonical EOS workforce identity satisfied all required capabilities: ${normalizeCapabilities(requiredCapabilities).join(', ')}.`,
    `Canonical candidates assessed: ${candidateCount}.`,
    'Capability matching used exact normalized values only; no fuzzy AI or alias inference was used.'
  ];
}

function resolveNextStep(status) {
  if (status === AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED) {
    return 'Return deterministic assignment result to upstream orchestration; downstream mission execution remains separate.';
  }
  if (status === AI_WORKFORCE_ASSIGNMENT_STATUSES.UNASSIGNABLE) {
    return 'Return UNASSIGNABLE for governance or mission requirement remediation.';
  }
  if (status === AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED) {
    return 'Submit deterministic assignment evidence for governance review before any downstream execution.';
  }
  return 'Resolve blocking conditions before reassessing assignment.';
}

function resolveCanonicalWorkforce(providedRegistry) {
  const source = providedRegistry ?? canonicalAgentRegistry.default ?? canonicalAgentRegistry.agents ?? canonicalAgentRegistry.AGENTS ?? canonicalAgentRegistry.eosAgents ?? canonicalAgentRegistry.agentRegistry ?? canonicalAgentRegistry;
  const records = collectAgentRecords(source);
  const candidatesByIdentity = new Map();

  for (const record of records) {
    const candidate = toCanonicalCandidate(record);
    if (candidate && !candidatesByIdentity.has(candidate.identity)) {
      candidatesByIdentity.set(candidate.identity, candidate);
    }
  }

  return [...candidatesByIdentity.values()].sort(compareByIdentity);
}

function collectAgentRecords(source, seen = new Set()) {
  if (!source || typeof source !== 'object') {
    return [];
  }
  if (seen.has(source)) {
    return [];
  }
  seen.add(source);

  if (Array.isArray(source)) {
    return source.flatMap((item) => collectAgentRecords(item, seen));
  }

  const records = [];
  if (looksLikeAgentRecord(source)) {
    records.push(source);
  }

  for (const [key, value] of Object.entries(source)) {
    if (!value || typeof value !== 'object') {
      continue;
    }
    if (Array.isArray(value) || ['agents', 'AGENTS', 'eosAgents', 'agentRegistry', 'workforce', 'members', 'staff', 'iiAgents', 'children', 'offices'].includes(key)) {
      records.push(...collectAgentRecords(value, seen));
    }
  }

  return records;
}

function looksLikeAgentRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return false;
  }
  const identity = resolveAgentIdentity(record);
  return typeof identity === 'string' && identity.length > 0;
}

function toCanonicalCandidate(record) {
  const identity = resolveAgentIdentity(record);
  if (!identity || !identity.startsWith(CANONICAL_AGENT_PREFIX)) {
    return null;
  }

  const capabilities = extractCandidateCapabilities(record);
  const candidate = {
    identity,
    name: String(resolveValue(record, ['name']) || resolveValue(record, ['displayName']) || identity),
    office: String(resolveValue(record, ['office']) || resolveValue(record, ['assignedOffice']) || resolveValue(record, ['officeId']) || resolveValue(record, ['organizationUnit']) || 'Unspecified EOS Office'),
    capabilities,
    status: String(resolveValue(record, ['status']) || resolveValue(record, ['state']) || resolveValue(record, ['availability']) || 'ACTIVE'),
    blockingConditions: collectBlockingConditions(record),
    governanceReviewConditions: collectGovernanceReviewConditions(record)
  };

  return deepFreeze(candidate);
}

function matchCandidate(candidate, requiredCapabilities) {
  const candidateCapabilitySet = new Set(normalizeCapabilities(candidate.capabilities));
  const normalizedRequired = normalizeCapabilities(requiredCapabilities);
  const matchedCapabilities = normalizedRequired.filter((capability) => candidateCapabilitySet.has(capability));
  const unmatchedCapabilities = normalizedRequired.filter((capability) => !candidateCapabilitySet.has(capability));
  const blockingConditions = collectCandidateBlockingConditions(candidate);
  return {
    candidate,
    matchedCapabilities,
    unmatchedCapabilities,
    blockingConditions,
    governanceReviewConditions: [...candidate.governanceReviewConditions]
  };
}

function collectCandidateBlockingConditions(candidate) {
  const status = normalizeScalar(candidate.status);
  const statusBlockers = ['blocked', 'inactive', 'disabled', 'decommissioned', 'suspended'].includes(status)
    ? [`Candidate ${candidate.identity} status is ${candidate.status}.`]
    : [];
  return uniqueStable([...candidate.blockingConditions, ...statusBlockers]);
}

function selectDeterministicDiagnostic(diagnostics) {
  if (!diagnostics || diagnostics.length === 0) {
    return null;
  }
  return [...diagnostics].sort((left, right) => left.candidate.identity.localeCompare(right.candidate.identity))[0];
}

function bestMatchedCapabilities(diagnostics) {
  if (!diagnostics || diagnostics.length === 0) {
    return [];
  }
  const sorted = [...diagnostics].sort((left, right) => {
    const score = right.matchedCapabilities.length - left.matchedCapabilities.length;
    if (score !== 0) {
      return score;
    }
    return left.candidate.identity.localeCompare(right.candidate.identity);
  });
  return sorted[0].matchedCapabilities;
}

function resolveMissionId(mission) {
  return firstString([
    resolveValue(mission, ['id']),
    resolveValue(mission, ['missionId']),
    resolveValue(mission, ['engineeringMissionId']),
    resolveValue(mission, ['identity', 'id']),
    resolveValue(mission, ['mission', 'id']),
    resolveValue(mission, ['mission', 'missionId'])
  ]);
}

function resolveAgentIdentity(agent) {
  return firstString([
    resolveValue(agent, ['id']),
    resolveValue(agent, ['agentId']),
    resolveValue(agent, ['canonicalId']),
    resolveValue(agent, ['canonicalIdentity']),
    resolveValue(agent, ['agentIdentity']),
    resolveValue(agent, ['workforceId']),
    resolveValue(agent, ['identity', 'id'])
  ]);
}

function extractRequiredCapabilities(mission) {
  const candidates = [
    resolveValue(mission, ['requiredCapabilities']),
    resolveValue(mission, ['mission', 'requiredCapabilities']),
    resolveValue(mission, ['engineeringMission', 'requiredCapabilities']),
    resolveValue(mission, ['capabilities', 'required']),
    resolveValue(mission, ['requirements', 'capabilities']),
    resolveValue(mission, ['required', 'capabilities'])
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      return { present: true, values: normalizeCapabilities(candidate) };
    }
  }

  return { present: false, values: [] };
}

function extractCandidateCapabilities(agent) {
  return normalizeCapabilities([
    ...arrayFrom(resolveValue(agent, ['capabilities'])),
    ...arrayFrom(resolveValue(agent, ['skills'])),
    ...arrayFrom(resolveValue(agent, ['capabilityTags'])),
    ...arrayFrom(resolveValue(agent, ['workforceCapabilities'])),
    ...arrayFrom(resolveValue(agent, ['engineeringCapabilities'])),
    ...arrayFrom(resolveValue(agent, ['profile', 'capabilities'])),
    ...arrayFrom(resolveValue(agent, ['metadata', 'capabilities']))
  ]);
}

function collectBlockingConditions(entity) {
  const values = [
    ...arrayFrom(resolveValue(entity, ['blockingConditions'])),
    ...arrayFrom(resolveValue(entity, ['blockers'])),
    ...arrayFrom(resolveValue(entity, ['governanceState', 'blockingConditions'])),
    ...arrayFrom(resolveValue(entity, ['governance', 'blockingConditions']))
  ];

  const blockedReason = firstString([
    resolveValue(entity, ['blockedReason']),
    resolveValue(entity, ['blockerReason']),
    resolveValue(entity, ['governanceState', 'blockedReason'])
  ]);
  if (blockedReason) {
    values.push(blockedReason);
  }

  if (resolveValue(entity, ['blocked']) === true || resolveValue(entity, ['assignmentBlocked']) === true || resolveValue(entity, ['governanceState', 'blocked']) === true) {
    values.push('Entity is marked blocked.');
  }

  const status = normalizeScalar(firstString([
    resolveValue(entity, ['assignmentStatus']),
    resolveValue(entity, ['status']),
    resolveValue(entity, ['state'])
  ]));
  if (status === 'blocked') {
    values.push('Entity status is BLOCKED.');
  }

  return uniqueStable(values.map(String).map((value) => value.trim()).filter(Boolean));
}

function collectGovernanceReviewConditions(entity) {
  const values = [
    ...arrayFrom(resolveValue(entity, ['governanceReviewConditions'])),
    ...arrayFrom(resolveValue(entity, ['governanceState', 'reviewConditions'])),
    ...arrayFrom(resolveValue(entity, ['governance', 'reviewConditions']))
  ];

  if (resolveValue(entity, ['governanceReviewRequired']) === true || resolveValue(entity, ['assignmentGovernanceReviewRequired']) === true || resolveValue(entity, ['governanceState', 'reviewRequired']) === true || resolveValue(entity, ['governance', 'reviewRequired']) === true) {
    values.push('Entity requires governance review.');
  }

  const status = normalizeScalar(firstString([
    resolveValue(entity, ['assignmentStatus']),
    resolveValue(entity, ['governanceState', 'status']),
    resolveValue(entity, ['governance', 'status'])
  ]));
  if (status === normalizeScalar(AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED) || status === 'review_required' || status === 'governance_review_required') {
    values.push('Entity status requires governance review.');
  }

  return uniqueStable(values.map(String).map((value) => value.trim()).filter(Boolean));
}

function resolveUpstreamProvenanceReference(mission, options) {
  return cloneJsonSafe(
    options.upstreamProvenance ??
    resolveValue(mission, ['upstreamProvenance']) ??
    resolveValue(mission, ['sourceProvenance']) ??
    resolveValue(mission, ['provenance']) ??
    null
  );
}

function normalizeCapabilities(capabilities) {
  return uniqueStable(arrayFrom(capabilities).map(normalizeScalar).filter(Boolean));
}

function normalizeScalar(value) {
  if (value && typeof value === 'object') {
    const nested = firstString([
      resolveValue(value, ['capability']),
      resolveValue(value, ['name']),
      resolveValue(value, ['id']),
      resolveValue(value, ['value'])
    ]);
    return nested ? normalizeScalar(nested) : '';
  }
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim().toLowerCase();
}

function uniqueStable(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const normalized = typeof value === 'string' ? value.trim() : value;
    if (normalized === '' || normalized === undefined || normalized === null) {
      continue;
    }
    const key = typeof normalized === 'string' ? normalized.toLowerCase() : stableSerialize(normalized);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }
  return result;
}

function arrayFrom(value) {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (value instanceof Set) {
    return [...value];
  }
  return [value];
}

function firstString(values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
}

function resolveValue(source, path) {
  let current = source;
  for (const segment of path) {
    if (!current || typeof current !== 'object' || !(segment in current)) {
      return undefined;
    }
    current = current[segment];
  }
  return current;
}

function compareByIdentity(left, right) {
  return left.identity.localeCompare(right.identity);
}

function deterministicHash(value) {
  return createHash('sha256').update(stableSerialize(value)).digest('hex');
}

function stableSerialize(value) {
  const seen = new WeakSet();
  const normalize = (input) => {
    if (input === null || typeof input !== 'object') {
      return input;
    }
    if (seen.has(input)) {
      throw new TypeError('Cannot stable serialize circular assignment input.');
    }
    seen.add(input);
    if (Array.isArray(input)) {
      return input.map(normalize);
    }
    return Object.keys(input).sort().reduce((accumulator, key) => {
      const valueForKey = input[key];
      if (typeof valueForKey !== 'function' && valueForKey !== undefined) {
        accumulator[key] = normalize(valueForKey);
      }
      return accumulator;
    }, {});
  };
  return JSON.stringify(normalize(value));
}

function cloneJsonSafe(value) {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return JSON.parse(stableSerialize(value));
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  Object.freeze(value);
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }
  return value;
}
