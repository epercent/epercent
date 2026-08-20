import * as crypto from 'node:crypto';
import * as engineeringLedgerData from '../data/engineering-ledger.js';

const OBJECTIVE_1065_CONTRACT = 'Objective 10.6.5 Lifecycle Synchronization Contract';
const LIFECYCLE_RECORD_TYPE = 'engineering-ledger-lifecycle-synchronization-record';
const SYNCHRONIZATION_STATUS = Object.freeze({
  SYNCHRONIZED: 'synchronized',
  REJECTED: 'rejected'
});

const lifecycleRecordStore = new Map();

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepClone(value) {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  Object.keys(value).forEach((key) => {
    deepFreeze(value[key]);
  });

  return value;
}

function stableSerialize(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
    .join(',')}}`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function deterministicId(prefix, material) {
  return `${prefix}-${sha256(stableSerialize(material)).slice(0, 32).toUpperCase()}`;
}

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0) || null;
}

function normalizeBaseLedgerModule() {
  if (Array.isArray(engineeringLedgerData)) {
    return engineeringLedgerData;
  }

  if (engineeringLedgerData && Array.isArray(engineeringLedgerData.engineeringLedger)) {
    return engineeringLedgerData.engineeringLedger;
  }

  if (engineeringLedgerData && Array.isArray(engineeringLedgerData.ledger)) {
    return engineeringLedgerData.ledger;
  }

  if (engineeringLedgerData && Array.isArray(engineeringLedgerData.entries)) {
    return engineeringLedgerData.entries;
  }

  if (engineeringLedgerData && typeof engineeringLedgerData === 'object') {
    return engineeringLedgerData;
  }

  return [];
}

function extractMission(input) {
  if (!isPlainObject(input)) {
    return null;
  }

  if (isPlainObject(input.engineeringMission)) {
    return input.engineeringMission;
  }

  if (isPlainObject(input.mission)) {
    return input.mission;
  }

  if (isPlainObject(input.engineeringMissionLifecycle) && isPlainObject(input.engineeringMissionLifecycle.mission)) {
    return input.engineeringMissionLifecycle.mission;
  }

  if (firstString(input.missionId, input.engineeringMissionId, input.id)) {
    return {
      missionId: firstString(input.missionId, input.engineeringMissionId, input.id),
      enhancementId: input.enhancementId,
      ecrId: input.ecrId,
      provenance: input.provenance
    };
  }

  return null;
}

function extractAssignment(input) {
  if (!isPlainObject(input)) {
    return null;
  }

  if (isPlainObject(input.aiWorkforceAssignment)) {
    return input.aiWorkforceAssignment;
  }

  if (isPlainObject(input.assignment)) {
    return input.assignment;
  }

  if (isPlainObject(input.workforceAssignment)) {
    return input.workforceAssignment;
  }

  return null;
}

function extractAssignedAgentId(assignment, input) {
  const assignedAgent = assignment && assignment.assignedAgent;
  const workforceAgent = assignment && assignment.workforceAgent;

  return firstString(
    assignment && assignment.assignedAgentId,
    assignment && assignment.agentId,
    assignment && assignment.workforceAgentId,
    assignedAgent && assignedAgent.agentId,
    assignedAgent && assignedAgent.id,
    workforceAgent && workforceAgent.agentId,
    workforceAgent && workforceAgent.id,
    input && input.assignedAgentId,
    input && input.agentId,
    input && input.workforceAgentId
  );
}

function extractLifecycleState(input) {
  if (!isPlainObject(input)) {
    return undefined;
  }

  if (input.lifecycleState !== undefined) {
    return input.lifecycleState;
  }

  if (input.engineeringLifecycleState !== undefined) {
    return input.engineeringLifecycleState;
  }

  if (input.state !== undefined) {
    return input.state;
  }

  return undefined;
}

function normalizeLifecycleState(lifecycleState) {
  if (typeof lifecycleState === 'string' && lifecycleState.trim().length > 0) {
    return { state: lifecycleState };
  }

  if (isPlainObject(lifecycleState)) {
    return deepClone(lifecycleState);
  }

  return null;
}

function normalizeBlockingConditions(input) {
  const supplied = input && (input.blockingConditions !== undefined ? input.blockingConditions : input.blocks);

  if (supplied === undefined || supplied === null) {
    return [];
  }

  if (Array.isArray(supplied)) {
    return deepClone(supplied);
  }

  return [deepClone(supplied)];
}

function extractEnhancementId(mission, input) {
  const upstream = input && input.upstreamProvenance;
  const orchestration = input && input.orchestrationProvenance;

  return firstString(
    mission && mission.enhancementId,
    mission && mission.ecrId,
    input && input.enhancementId,
    input && input.ecrId,
    upstream && upstream.enhancementId,
    upstream && upstream.ecrId,
    orchestration && orchestration.enhancementId,
    orchestration && orchestration.ecrId
  );
}

function buildRejectedResult(reason, input, details) {
  const clonedInput = isPlainObject(input) ? deepClone(input) : input;
  const mission = extractMission(input);
  const assignment = extractAssignment(input);
  const missionId = mission && firstString(mission.missionId, mission.engineeringMissionId, mission.id);
  const assignmentId = assignment && firstString(assignment.assignmentId, assignment.id);
  const rejectionMaterial = {
    contract: OBJECTIVE_1065_CONTRACT,
    reason,
    missionId,
    assignmentId,
    lifecycleState: extractLifecycleState(input) === undefined ? null : extractLifecycleState(input),
    details: details || null
  };
  const lifecycleRecordId = deterministicId('ELS-REJECTED', rejectionMaterial);

  return deepFreeze({
    synchronizationStatus: SYNCHRONIZATION_STATUS.REJECTED,
    accepted: false,
    idempotent: true,
    created: false,
    lifecycleRecordId,
    ledgerEntryId: lifecycleRecordId,
    reason,
    details: details || null,
    deterministicIdentity: {
      algorithm: 'sha256',
      material: rejectionMaterial
    },
    sourceInput: clonedInput,
    effects: {
      providerDispatch: false,
      engineeringMissionExecution: false,
      gitPromotion: false,
      gitCommit: false,
      enhancementClosure: false,
      ecrClosure: false
    }
  });
}

function normalizeSynchronizationInput(input) {
  if (!isPlainObject(input)) {
    return {
      error: 'MALFORMED_LIFECYCLE_INPUT',
      details: 'Lifecycle synchronization input must be an object.'
    };
  }

  const mission = extractMission(input);
  const assignment = extractAssignment(input);
  const missionId = mission && firstString(mission.missionId, mission.engineeringMissionId, mission.id);

  if (!missionId) {
    return {
      error: 'MISSING_ENGINEERING_MISSION_IDENTITY',
      details: 'Engineering Mission identity is required for deterministic ledger lifecycle synchronization.'
    };
  }

  const lifecycleState = normalizeLifecycleState(extractLifecycleState(input));

  if (!lifecycleState) {
    return {
      error: 'MALFORMED_LIFECYCLE_INPUT',
      details: 'Lifecycle state must be a non-empty string or object.'
    };
  }

  const assignedAgentId = extractAssignedAgentId(assignment, input);

  if (assignedAgentId && !assignedAgentId.startsWith('EOS-AGENT-')) {
    return {
      error: 'NON_CANONICAL_WORKFORCE_IDENTITY',
      details: 'Canonical Objective 10.6.4 workforce identity must use EOS-AGENT-* lineage.'
    };
  }

  const assignmentId = assignment && firstString(assignment.assignmentId, assignment.id);
  const assignmentStatus = assignment && firstString(assignment.assignmentStatus, assignment.status);
  const governanceState = input.governanceState !== undefined ? input.governanceState : input.governance;
  const blockingConditions = normalizeBlockingConditions(input);
  const upstreamProvenance = input.upstreamProvenance !== undefined
    ? input.upstreamProvenance
    : input.orchestrationProvenance;
  const sourceContract = firstString(input.sourceContract, input.contract, OBJECTIVE_1065_CONTRACT);
  const sourceType = firstString(input.sourceType, input.type, LIFECYCLE_RECORD_TYPE);
  const enhancementId = extractEnhancementId(mission, input);
  const ecrId = firstString(
    mission && mission.ecrId,
    input.ecrId,
    upstreamProvenance && upstreamProvenance.ecrId
  );

  return {
    mission: deepClone(mission),
    assignment: assignment ? deepClone(assignment) : null,
    missionId,
    engineeringMissionId: missionId,
    enhancementId,
    ecrId,
    assignmentId: assignmentId || null,
    assignedAgentId: assignedAgentId || null,
    assignmentStatus: assignmentStatus || null,
    lifecycleState,
    governanceState: governanceState === undefined ? null : deepClone(governanceState),
    blockingConditions,
    upstreamProvenance: upstreamProvenance === undefined ? null : deepClone(upstreamProvenance),
    orchestrationProvenance: input.orchestrationProvenance === undefined ? null : deepClone(input.orchestrationProvenance),
    sourceContract,
    sourceType,
    suppliedProvenance: input.provenance === undefined ? null : deepClone(input.provenance)
  };
}

function buildLifecycleMaterial(normalized) {
  return {
    contract: OBJECTIVE_1065_CONTRACT,
    sourceContract: normalized.sourceContract,
    sourceType: normalized.sourceType,
    missionId: normalized.missionId,
    engineeringMissionId: normalized.engineeringMissionId,
    enhancementId: normalized.enhancementId,
    ecrId: normalized.ecrId,
    assignmentId: normalized.assignmentId,
    assignedAgentId: normalized.assignedAgentId,
    assignmentStatus: normalized.assignmentStatus,
    lifecycleState: normalized.lifecycleState,
    governanceState: normalized.governanceState,
    blockingConditions: normalized.blockingConditions,
    upstreamProvenance: normalized.upstreamProvenance,
    orchestrationProvenance: normalized.orchestrationProvenance
  };
}

function buildLifecycleRecord(normalized, lifecycleRecordId, material) {
  return {
    type: LIFECYCLE_RECORD_TYPE,
    contract: OBJECTIVE_1065_CONTRACT,
    lifecycleRecordId,
    ledgerEntryId: lifecycleRecordId,
    id: lifecycleRecordId,
    synchronizationStatus: SYNCHRONIZATION_STATUS.SYNCHRONIZED,
    idempotencyKey: lifecycleRecordId,
    deterministicIdentity: {
      algorithm: 'sha256',
      serialization: 'stable-json-key-sort',
      material
    },
    missionId: normalized.missionId,
    engineeringMissionId: normalized.engineeringMissionId,
    enhancementId: normalized.enhancementId,
    ecrId: normalized.ecrId,
    assignmentId: normalized.assignmentId,
    assignedAgentId: normalized.assignedAgentId,
    canonicalWorkforceIdentity: normalized.assignedAgentId,
    assignmentStatus: normalized.assignmentStatus,
    lifecycleState: normalized.lifecycleState,
    governanceState: normalized.governanceState,
    blockingConditions: normalized.blockingConditions,
    provenance: {
      engineeringMission: {
        missionId: normalized.missionId,
        source: normalized.mission
      },
      aiWorkforceAssignment: normalized.assignment
        ? {
          assignmentId: normalized.assignmentId,
          assignedAgentId: normalized.assignedAgentId,
          assignmentStatus: normalized.assignmentStatus,
          source: normalized.assignment
        }
        : null,
      upstream: normalized.upstreamProvenance,
      orchestration: normalized.orchestrationProvenance,
      supplied: normalized.suppliedProvenance
    },
    source: {
      sourceContract: normalized.sourceContract,
      sourceType: normalized.sourceType
    },
    effects: {
      providerDispatch: false,
      engineeringMissionExecution: false,
      gitPromotion: false,
      gitCommit: false,
      enhancementClosure: false,
      ecrClosure: false
    }
  };
}

function lifecycleRecords() {
  return Array.from(lifecycleRecordStore.values()).map((record) => deepClone(record));
}

function getEngineeringLedger() {
  const baseLedger = deepClone(normalizeBaseLedgerModule());
  const synchronizedRecords = lifecycleRecords();

  if (synchronizedRecords.length === 0) {
    return deepFreeze(baseLedger);
  }

  if (Array.isArray(baseLedger)) {
    return deepFreeze(baseLedger.concat(synchronizedRecords));
  }

  if (isPlainObject(baseLedger)) {
    const extendedLedger = {
      ...baseLedger,
      lifecycleSynchronizationRecords: synchronizedRecords,
      lifecycleSynchronization: {
        contract: OBJECTIVE_1065_CONTRACT,
        count: synchronizedRecords.length,
        records: synchronizedRecords
      }
    };

    if (Array.isArray(baseLedger.entries)) {
      extendedLedger.entries = baseLedger.entries.concat(synchronizedRecords);
    }

    if (Array.isArray(baseLedger.records)) {
      extendedLedger.records = baseLedger.records.concat(synchronizedRecords);
    }

    return deepFreeze(extendedLedger);
  }

  return deepFreeze({
    historicalLedger: baseLedger,
    lifecycleSynchronizationRecords: synchronizedRecords,
    lifecycleSynchronization: {
      contract: OBJECTIVE_1065_CONTRACT,
      count: synchronizedRecords.length,
      records: synchronizedRecords
    }
  });
}

function synchronizeEngineeringLedgerLifecycle(input) {
  const normalized = normalizeSynchronizationInput(input);

  if (normalized.error) {
    return buildRejectedResult(normalized.error, input, normalized.details);
  }

  const material = buildLifecycleMaterial(normalized);
  const lifecycleRecordId = deterministicId('ELS-1065', material);
  const existingRecord = lifecycleRecordStore.get(lifecycleRecordId);

  if (existingRecord) {
    return deepFreeze({
      synchronizationStatus: SYNCHRONIZATION_STATUS.SYNCHRONIZED,
      accepted: true,
      idempotent: true,
      created: false,
      duplicateSuppressed: true,
      lifecycleRecordId,
      ledgerEntryId: lifecycleRecordId,
      record: deepClone(existingRecord),
      effects: {
        providerDispatch: false,
        engineeringMissionExecution: false,
        gitPromotion: false,
        gitCommit: false,
        enhancementClosure: false,
        ecrClosure: false
      }
    });
  }

  const record = deepFreeze(buildLifecycleRecord(normalized, lifecycleRecordId, material));
  lifecycleRecordStore.set(lifecycleRecordId, record);

  return deepFreeze({
    synchronizationStatus: SYNCHRONIZATION_STATUS.SYNCHRONIZED,
    accepted: true,
    idempotent: true,
    created: true,
    duplicateSuppressed: false,
    lifecycleRecordId,
    ledgerEntryId: lifecycleRecordId,
    record: deepClone(record),
    effects: {
      providerDispatch: false,
      engineeringMissionExecution: false,
      gitPromotion: false,
      gitCommit: false,
      enhancementClosure: false,
      ecrClosure: false
    }
  });
}

function getEngineeringLedgerLifecycleRecords() {
  return deepFreeze(lifecycleRecords());
}

function resetEngineeringLedgerLifecycleSynchronizationForTests() {
  lifecycleRecordStore.clear();
}

export {
  getEngineeringLedger,
  synchronizeEngineeringLedgerLifecycle,
  getEngineeringLedgerLifecycleRecords,
  resetEngineeringLedgerLifecycleSynchronizationForTests,
  deterministicId,
  normalizeSynchronizationInput,
  buildLifecycleMaterial
};
