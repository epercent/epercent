'use strict';

import crypto from 'node:crypto';

const SERVICE_NAME = 'enhancement-completion-closure-service';
const SERVICE_OBJECTIVE = 'EOS-10.6.7';
const COMPLETION_STATUS = 'Mission Complete';
const SUCCESSFUL_CLOSURE_STATUS = 'Engineering Completion Closed';
const REJECTED_CLOSURE_STATUS = 'Closure Rejected';

const REQUIRED_ENGINEERING_SUMMARY = Object.freeze({
  validation: true,
  workspace: true,
  testing: true,
  verification: true,
  governance: true,
  promotion: true,
  committed: true,
  pushed: false
});

const INCOMPATIBLE_TERMINAL_STATES = new Set([
  'duplicate',
  'superseded',
  'cancelled',
  'canceled',
  'rejected',
  'blocked',
  'governance review required'
]);

const closureRecords = new Map();

function closeEnhancementFromCompletion(request, maybeLineage) {
  const input = normalizeRequest(request, maybeLineage);

  if (!isRecord(input)) {
    return rejectedClosure('MALFORMED_INPUT', 'Closure input must be an object containing completion evidence and lineage.');
  }

  const completion = firstRecord(input.completion, input.completionEvidence, input.missionCompletion);
  if (!completion) {
    return rejectedClosure('MISSING_COMPLETION_EVIDENCE', 'Canonical mission-completion evidence is required.');
  }

  const lineage = firstRecord(
    input.lineage,
    input.missionControlLineage,
    input.missionControlSynchronization,
    input.synchronizationRecord,
    input.synchronization,
    input.record
  ) || {};

  const lineageResolution = resolveLineage(lineage);
  if (!lineageResolution.valid) {
    return rejectedClosure(lineageResolution.reason, lineageResolution.message);
  }

  const completionValidation = validateCompletionEvidence(completion, lineageResolution.engineeringMissionIds);
  if (!completionValidation.valid) {
    return rejectedClosure(completionValidation.reason, completionValidation.message);
  }

  const identityMaterial = buildClosureIdentityMaterial(completion, lineageResolution);
  const closureId = `enhancement-completion-closure-${sha256(stableStringify(identityMaterial)).slice(0, 32)}`;

  const existing = closureRecords.get(closureId);
  if (existing) {
    return immutable({
      ...deepClone(existing),
      duplicateSuppressed: true,
      effects: Object.freeze([
        immutable({
          type: 'duplicate_suppressed',
          target: closureId,
          description: 'Materially identical completion-driven closure evidence was already recorded.'
        })
      ])
    });
  }

  const record = immutable({
    success: true,
    closureId,
    closureStatus: SUCCESSFUL_CLOSURE_STATUS,
    closed: true,
    enhancementId: lineageResolution.enhancementId,
    ecrId: lineageResolution.ecrId,
    engineeringMissionId: lineageResolution.engineeringMissionId,
    missionControlSynchronizationIdentity: lineageResolution.missionControlSynchronizationIdentity,
    synchronizationRecordId: lineageResolution.synchronizationRecordId,
    lifecycleRecordId: lineageResolution.lifecycleRecordId,
    assignmentId: lineageResolution.assignmentId,
    assignedAgentId: lineageResolution.assignedAgentId,
    canonicalWorkforceIdentity: lineageResolution.canonicalWorkforceIdentity,
    completionStatus: completion.status,
    completionCommit: completion.commit,
    completionPackageId: completion.packageId,
    completionEvidence: deepClone(completion),
    closureReasons: Object.freeze([
      'CANONICAL_MISSION_COMPLETION_CONFIRMED',
      'MISSION_CONTROL_LINEAGE_VERIFIED',
      'ORIGINATING_ENHANCEMENT_OR_ECR_IDENTIFIED'
    ]),
    provenance: immutable({
      service: SERVICE_NAME,
      objective: SERVICE_OBJECTIVE,
      source: 'canonical mission-completion result and Mission Control lineage',
      lineageProvenance: lineage.provenance ? deepClone(lineage.provenance) : null,
      lineageSource: lineage.source ? deepClone(lineage.source) : null
    }),
    duplicateSuppressed: false,
    effects: Object.freeze([
      immutable({
        type: 'record_closure',
        target: closureId,
        description: 'Recorded immutable logical Enhancement/ECR closure from authoritative engineering completion evidence.'
      })
    ]),
    nextStep: 'No additional closure action required; retain immutable evidence.'
  });

  closureRecords.set(closureId, record);
  return record;
}

function getEnhancementCompletionClosureRecords() {
  return immutable(Array.from(closureRecords.values()).map((record) => deepClone(record)));
}

function resetEnhancementCompletionClosureForTests() {
  closureRecords.clear();
}

function normalizeRequest(request, maybeLineage) {
  if (typeof maybeLineage !== 'undefined') {
    return {
      completion: request,
      lineage: maybeLineage
    };
  }
  return request;
}

function validateCompletionEvidence(completion, lineageMissionIds) {
  if (!isRecord(completion)) {
    return invalid('MISSING_COMPLETION_EVIDENCE', 'Canonical mission-completion evidence is required.');
  }

  if (completion.success !== true) {
    return invalid('COMPLETION_NOT_SUCCESSFUL', 'Completion evidence must have success=true.');
  }

  if (completion.status !== COMPLETION_STATUS) {
    return invalid('COMPLETION_STATUS_NOT_MISSION_COMPLETE', 'Completion evidence must have status=Mission Complete.');
  }

  if (!nonEmptyString(completion.missionId)) {
    return invalid('MISSING_COMPLETION_MISSION_ID', 'Completion evidence must include missionId.');
  }

  if (!nonEmptyString(completion.packageId)) {
    return invalid('MISSING_COMPLETION_PACKAGE_ID', 'Completion evidence must include packageId.');
  }

  if (!nonEmptyString(completion.commit)) {
    return invalid('MISSING_COMPLETION_COMMIT', 'Completion evidence must include the committed revision.');
  }

  if (!lineageMissionIds.includes(completion.missionId)) {
    return invalid('COMPLETION_LINEAGE_MISSION_ID_MISMATCH', 'Completion missionId must match canonical lineage engineeringMissionId or missionId.');
  }

  const summary = completion.engineeringSummary;
  if (!isRecord(summary)) {
    return invalid('INCOMPLETE_ENGINEERING_SUMMARY', 'Completion evidence must include engineeringSummary.');
  }

  for (const [key, requiredValue] of Object.entries(REQUIRED_ENGINEERING_SUMMARY)) {
    if (summary[key] !== requiredValue) {
      if (key === 'pushed' && summary[key] === true) {
        return invalid('COMPLETION_INDICATES_PUSHED', 'Completion evidence must prove pushed=false.');
      }
      return invalid('INCOMPLETE_ENGINEERING_SUMMARY', `Completion engineeringSummary.${key} must be ${String(requiredValue)}.`);
    }
  }

  return valid();
}

function resolveLineage(lineage) {
  if (!isRecord(lineage)) {
    return invalid('MALFORMED_LINEAGE', 'Mission Control lineage must be an object when supplied.');
  }

  const enhancementIds = uniqueStrings([
    getPath(lineage, 'enhancementId'),
    getPath(lineage, 'originatingEnhancementId'),
    getPath(lineage, 'source.enhancementId'),
    getPath(lineage, 'source.originatingEnhancementId'),
    getPath(lineage, 'provenance.enhancementId'),
    getPath(lineage, 'provenance.originatingEnhancementId')
  ]);

  const ecrIds = uniqueStrings([
    getPath(lineage, 'ecrId'),
    getPath(lineage, 'originatingEcrId'),
    getPath(lineage, 'source.ecrId'),
    getPath(lineage, 'source.originatingEcrId'),
    getPath(lineage, 'provenance.ecrId'),
    getPath(lineage, 'provenance.originatingEcrId')
  ]);

  if (enhancementIds.length > 1 || ecrIds.length > 1) {
    return invalid('CONTRADICTORY_LINEAGE', 'Lineage contains contradictory originating Enhancement/ECR identity.');
  }

  if (enhancementIds.length === 0 && ecrIds.length === 0) {
    return invalid('MISSING_ORIGINATING_ENHANCEMENT_OR_ECR_ID', 'Lineage must identify the originating Enhancement or ECR.');
  }

  const engineeringMissionIds = uniqueStrings([
    getPath(lineage, 'engineeringMissionId'),
    getPath(lineage, 'missionId'),
    getPath(lineage, 'lifecycleRecord.engineeringMissionId'),
    getPath(lineage, 'lifecycleRecord.missionId'),
    getPath(lineage, 'provenance.engineeringMissionId'),
    getPath(lineage, 'provenance.missionId')
  ]);

  if (engineeringMissionIds.length === 0) {
    return invalid('MISSING_ENGINEERING_MISSION_ID', 'Lineage must include engineeringMissionId or missionId.');
  }

  if (engineeringMissionIds.length > 1) {
    return invalid('CONTRADICTORY_LINEAGE', 'Lineage contains contradictory Engineering Mission identity.');
  }

  const synchronizationIdentities = uniqueStrings([
    getPath(lineage, 'synchronizationIdentity'),
    getPath(lineage, 'missionControlSynchronizationIdentity'),
    getPath(lineage, 'synchronizationRecordId'),
    getPath(lineage, 'recordId')
  ]);

  if (synchronizationIdentities.length === 0) {
    return invalid('MISSING_MISSION_CONTROL_SYNCHRONIZATION_ID', 'Mission Control synchronization identity is required.');
  }

  const incompatibleState = findIncompatibleTerminalState(lineage);
  if (incompatibleState) {
    return invalid('INCOMPATIBLE_TERMINAL_SOURCE_STATE', `Lineage source state ${incompatibleState} cannot become successful engineering-completion closure.`);
  }

  return {
    valid: true,
    enhancementId: enhancementIds[0] || null,
    ecrId: ecrIds[0] || null,
    engineeringMissionId: engineeringMissionIds[0],
    engineeringMissionIds,
    missionControlSynchronizationIdentity: synchronizationIdentities[0],
    synchronizationRecordId: stringOrNull(getPath(lineage, 'synchronizationRecordId')),
    lifecycleRecordId: stringOrNull(getPath(lineage, 'lifecycleRecordId')),
    assignmentId: stringOrNull(getPath(lineage, 'assignmentId')),
    assignedAgentId: stringOrNull(getPath(lineage, 'assignedAgentId')),
    canonicalWorkforceIdentity: stringOrNull(getPath(lineage, 'canonicalWorkforceIdentity'))
  };
}

function findIncompatibleTerminalState(lineage) {
  const candidates = [
    getPath(lineage, 'lifecycleState'),
    getPath(lineage, 'engineeringPhase'),
    getPath(lineage, 'governanceState'),
    getPath(lineage, 'status'),
    getPath(lineage, 'state'),
    getPath(lineage, 'source.lifecycleState'),
    getPath(lineage, 'source.engineeringPhase'),
    getPath(lineage, 'source.governanceState'),
    getPath(lineage, 'source.status'),
    getPath(lineage, 'source.state')
  ];

  for (const candidate of candidates) {
    const normalized = normalizeState(candidate);
    if (INCOMPATIBLE_TERMINAL_STATES.has(normalized)) {
      return normalized;
    }
  }
  return null;
}

function buildClosureIdentityMaterial(completion, lineageResolution) {
  return {
    schema: 'eos.enhancementCompletionClosure.v1',
    closureStatus: SUCCESSFUL_CLOSURE_STATUS,
    enhancementId: lineageResolution.enhancementId,
    ecrId: lineageResolution.ecrId,
    engineeringMissionId: lineageResolution.engineeringMissionId,
    missionControlSynchronizationIdentity: lineageResolution.missionControlSynchronizationIdentity,
    completion: {
      success: completion.success,
      status: completion.status,
      missionId: completion.missionId,
      packageId: completion.packageId,
      commit: completion.commit,
      engineeringSummary: {
        validation: completion.engineeringSummary.validation,
        workspace: completion.engineeringSummary.workspace,
        testing: completion.engineeringSummary.testing,
        verification: completion.engineeringSummary.verification,
        governance: completion.engineeringSummary.governance,
        promotion: completion.engineeringSummary.promotion,
        committed: completion.engineeringSummary.committed,
        pushed: completion.engineeringSummary.pushed
      }
    }
  };
}

function rejectedClosure(reason, message) {
  return immutable({
    success: false,
    closureId: null,
    closureStatus: REJECTED_CLOSURE_STATUS,
    closed: false,
    rejected: true,
    rejectionReason: reason,
    rejectionMessage: message,
    duplicateSuppressed: false,
    closureReasons: Object.freeze([reason]),
    effects: Object.freeze([]),
    nextStep: 'Provide canonical Mission Complete evidence aligned to Mission Control lineage.',
    provenance: immutable({
      service: SERVICE_NAME,
      objective: SERVICE_OBJECTIVE,
      source: 'side-effect-free validation'
    })
  });
}

function valid() {
  return { valid: true };
}

function invalid(reason, message) {
  return { valid: false, reason, message };
}

function firstRecord(...values) {
  return values.find((value) => isRecord(value)) || null;
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function stringOrNull(value) {
  return nonEmptyString(value) ? value : null;
}

function uniqueStrings(values) {
  return Array.from(new Set(values.filter(nonEmptyString).map((value) => value.trim())));
}

function normalizeState(value) {
  if (!nonEmptyString(value)) {
    return '';
  }
  return value.trim().toLowerCase().replace(/[\-_]+/g, ' ').replace(/\s+/g, ' ');
}

function getPath(source, path) {
  return path.split('.').reduce((current, key) => {
    if (!isRecord(current)) {
      return undefined;
    }
    return current[key];
  }, source);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function deepClone(value) {
  if (value === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value));
}

function immutable(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const key of Object.keys(value)) {
    immutable(value[key]);
  }

  return Object.freeze(value);
}

export {
  closeEnhancementFromCompletion,
  getEnhancementCompletionClosureRecords,
  resetEnhancementCompletionClosureForTests,
  SUCCESSFUL_CLOSURE_STATUS,
  REJECTED_CLOSURE_STATUS
};
