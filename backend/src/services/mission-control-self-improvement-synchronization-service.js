import { createHash } from 'node:crypto';

const recordsBySynchronizationIdentity = new Map();

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function normalizeIdentityValue(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function hasOwnDefined(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key) && object[key] !== undefined;
}

function firstDefinedIdentity(record, keys) {
  for (const key of keys) {
    if (hasOwnDefined(record, key)) {
      const normalized = normalizeIdentityValue(record[key]);
      if (normalized) {
        return normalized;
      }
    }
  }

  return null;
}

function deepClone(value) {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const propertyName of Object.getOwnPropertyNames(value)) {
    deepFreeze(value[propertyName], seen);
  }

  return Object.freeze(value);
}

function stableSerialize(value) {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry === undefined ? null : entry)).join(',')}]`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value)
      .filter((key) => value[key] !== undefined && typeof value[key] !== 'function' && typeof value[key] !== 'symbol')
      .sort();

    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(',')}}`;
  }

  if (typeof value === 'function' || typeof value === 'symbol' || value === undefined) {
    return 'null';
  }

  return JSON.stringify(value);
}

function validationError(code, message) {
  const error = new TypeError(message);
  error.code = code;
  return error;
}

function assertValidLifecycleRecord(lifecycleRecord) {
  if (!isPlainObject(lifecycleRecord)) {
    throw validationError(
      'MISSION_CONTROL_SELF_IMPROVEMENT_MALFORMED_INPUT',
      'Mission Control self-improvement synchronization requires a lifecycle record object.'
    );
  }

  const lifecycleRecordIdentity = firstDefinedIdentity(lifecycleRecord, [
    'lifecycleRecordId',
    'ledgerEntryId',
    'deterministicIdentity'
  ]);

  if (!lifecycleRecordIdentity) {
    throw validationError(
      'MISSION_CONTROL_SELF_IMPROVEMENT_MISSING_LIFECYCLE_IDENTITY',
      'Mission Control self-improvement synchronization requires an Engineering Ledger lifecycle identity.'
    );
  }

  const engineeringMissionIdentity = firstDefinedIdentity(lifecycleRecord, [
    'engineeringMissionId',
    'missionId'
  ]);

  if (!engineeringMissionIdentity) {
    throw validationError(
      'MISSION_CONTROL_SELF_IMPROVEMENT_MISSING_ENGINEERING_MISSION_IDENTITY',
      'Mission Control self-improvement synchronization requires an Engineering Mission identity.'
    );
  }

  if (hasOwnDefined(lifecycleRecord, 'canonicalWorkforceIdentity')) {
    const canonicalWorkforceIdentity = normalizeIdentityValue(lifecycleRecord.canonicalWorkforceIdentity);

    if (!canonicalWorkforceIdentity || !canonicalWorkforceIdentity.startsWith('EOS-AGENT-')) {
      throw validationError(
        'MISSION_CONTROL_SELF_IMPROVEMENT_INVALID_CANONICAL_WORKFORCE_LINEAGE',
        'Mission Control self-improvement synchronization requires canonical workforce identity lineage to use EOS-AGENT-* identity when supplied.'
      );
    }
  }

  if (hasOwnDefined(lifecycleRecord, 'source') && lifecycleRecord.source !== null && typeof lifecycleRecord.source !== 'object') {
    throw validationError(
      'MISSION_CONTROL_SELF_IMPROVEMENT_INVALID_SOURCE_LINEAGE',
      'Mission Control self-improvement synchronization source lineage must be an object when supplied.'
    );
  }
}

function buildSynchronizationProjection(lifecycleRecord) {
  const lifecycleRecordId = firstDefinedIdentity(lifecycleRecord, [
    'lifecycleRecordId',
    'ledgerEntryId',
    'deterministicIdentity'
  ]);
  const engineeringMissionId = firstDefinedIdentity(lifecycleRecord, [
    'engineeringMissionId',
    'missionId'
  ]);
  const missionId = firstDefinedIdentity(lifecycleRecord, [
    'missionId',
    'engineeringMissionId'
  ]);
  const assignedAgentId = firstDefinedIdentity(lifecycleRecord, ['assignedAgentId']);
  const canonicalWorkforceIdentity = firstDefinedIdentity(lifecycleRecord, ['canonicalWorkforceIdentity'])
    || (assignedAgentId && assignedAgentId.startsWith('EOS-AGENT-') ? assignedAgentId : null);

  return {
    lifecycleRecordId,
    ledgerEntryId: firstDefinedIdentity(lifecycleRecord, ['ledgerEntryId']),
    engineeringMissionId,
    missionId,
    enhancementId: firstDefinedIdentity(lifecycleRecord, ['enhancementId']),
    ecrId: firstDefinedIdentity(lifecycleRecord, ['ecrId']),
    assignmentId: firstDefinedIdentity(lifecycleRecord, ['assignmentId']),
    assignedAgentId,
    canonicalWorkforceIdentity,
    assignmentStatus: hasOwnDefined(lifecycleRecord, 'assignmentStatus') ? deepClone(lifecycleRecord.assignmentStatus) : undefined,
    lifecycleState: hasOwnDefined(lifecycleRecord, 'lifecycleState') ? deepClone(lifecycleRecord.lifecycleState) : undefined,
    engineeringPhase: hasOwnDefined(lifecycleRecord, 'engineeringPhase')
      ? deepClone(lifecycleRecord.engineeringPhase)
      : deepClone(lifecycleRecord.phase),
    governanceState: hasOwnDefined(lifecycleRecord, 'governanceState') ? deepClone(lifecycleRecord.governanceState) : undefined,
    blockingConditions: hasOwnDefined(lifecycleRecord, 'blockingConditions') ? deepClone(lifecycleRecord.blockingConditions) : undefined,
    provenance: hasOwnDefined(lifecycleRecord, 'provenance') ? deepClone(lifecycleRecord.provenance) : undefined,
    source: hasOwnDefined(lifecycleRecord, 'source') ? deepClone(lifecycleRecord.source) : undefined,
    deterministicIdentity: firstDefinedIdentity(lifecycleRecord, ['deterministicIdentity'])
  };
}

function pruneUndefinedProperties(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => pruneUndefinedProperties(entry));
  }

  if (value && typeof value === 'object') {
    const pruned = {};

    for (const key of Object.keys(value)) {
      if (value[key] !== undefined) {
        pruned[key] = pruneUndefinedProperties(value[key]);
      }
    }

    return pruned;
  }

  return value;
}

function buildDeterministicSynchronizationIdentity(projection) {
  const canonicalMaterial = stableSerialize(pruneUndefinedProperties(projection));
  const digest = createHash('sha256').update(canonicalMaterial).digest('hex').slice(0, 32).toUpperCase();

  return `MC-SI-SYNC-${digest}`;
}

function buildStoredSynchronizationRecord(lifecycleRecord) {
  const projection = pruneUndefinedProperties(buildSynchronizationProjection(lifecycleRecord));
  const synchronizationIdentity = buildDeterministicSynchronizationIdentity(projection);

  return pruneUndefinedProperties({
    synchronizationIdentity,
    synchronizationRecordId: synchronizationIdentity,
    ...projection
  });
}

function buildSynchronizationResult(record, duplicateSuppressed) {
  return deepFreeze({
    synchronized: !duplicateSuppressed,
    duplicateSuppressed,
    synchronizationIdentity: record.synchronizationIdentity,
    synchronizationRecordId: record.synchronizationRecordId,
    record: deepFreeze(deepClone(record))
  });
}

function synchronizeMissionControlSelfImprovement(lifecycleRecord) {
  assertValidLifecycleRecord(lifecycleRecord);

  const storedRecord = buildStoredSynchronizationRecord(lifecycleRecord);
  const existingRecord = recordsBySynchronizationIdentity.get(storedRecord.synchronizationIdentity);

  if (existingRecord) {
    return buildSynchronizationResult(existingRecord, true);
  }

  const immutableRecord = deepFreeze(deepClone(storedRecord));
  recordsBySynchronizationIdentity.set(immutableRecord.synchronizationIdentity, immutableRecord);

  return buildSynchronizationResult(immutableRecord, false);
}

function getMissionControlSelfImprovementRecords() {
  const records = Array.from(recordsBySynchronizationIdentity.values())
    .map((record) => deepClone(record))
    .sort((left, right) => left.synchronizationIdentity.localeCompare(right.synchronizationIdentity));

  return deepFreeze(records);
}

function resetMissionControlSelfImprovementSynchronizationForTests() {
  recordsBySynchronizationIdentity.clear();
}

export {
  synchronizeMissionControlSelfImprovement,
  getMissionControlSelfImprovementRecords,
  resetMissionControlSelfImprovementSynchronizationForTests
};
