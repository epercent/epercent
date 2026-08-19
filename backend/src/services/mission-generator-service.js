const LEGACY_READY_STATUS = 'READY_FOR_DISPATCH';
const LEGACY_APPROVAL_STATUS = 'Pending';
const BRIDGE_READY_STATUS = 'READY_FOR_ENGINEERING';
const BRIDGE_SOURCE_TYPE = 'EnhancementChangeRequest';

export const ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE = Object.freeze({
  objectiveId: '10.6.1',
  missionId: 'EOS-10.6.1',
  bridge: 'Enhancement/ECR Engineering Mission Bridge',
  mode: 'additive',
  moduleSystem: 'ESM'
});

export const BRIDGE_PROVENANCE = ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE;

function padMissionIndex(index) {
  return String(index + 1).padStart(4, '0');
}

function hasOwnDataProperty(source, key) {
  if (source === null || typeof source !== 'object') {
    return false;
  }

  const descriptor = Object.getOwnPropertyDescriptor(source, key);
  return Boolean(descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value'));
}

function readDataProperty(source, keys) {
  for (const key of keys) {
    if (hasOwnDataProperty(source, key)) {
      const value = Object.getOwnPropertyDescriptor(source, key).value;
      if (typeof value !== 'function') {
        return value;
      }
    }
  }

  return undefined;
}

function cloneRuntimeSafeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => typeof entry !== 'function');
}

function normalizeApprovalState(source) {
  const approved = readDataProperty(source, ['approved']);
  const approval = readDataProperty(source, ['approval', 'approvalStatus']);
  const status = readDataProperty(source, ['status']);

  if (approved === true || approval === 'Approved' || status === 'APPROVED' || status === 'Approved') {
    return 'Approved';
  }

  if (approved === false || approval === 'Rejected' || status === 'REJECTED' || status === 'Rejected') {
    return 'Rejected';
  }

  return 'Pending';
}

function isApprovedBridgeSource(normalizedSource) {
  return normalizedSource.approval === 'Approved';
}

function isCompleteBridgeSource(normalizedSource) {
  return Boolean(normalizedSource.id && normalizedSource.title && normalizedSource.description);
}

export function normalizeEcrForEngineeringMissionBridge(source = {}) {
  const normalized = {
    id: readDataProperty(source, ['id', 'ecrId', 'enhancementId']),
    title: readDataProperty(source, ['title', 'name']),
    description: readDataProperty(source, ['description', 'summary']),
    priority: readDataProperty(source, ['priority']),
    approval: normalizeApprovalState(source),
    sourceType: readDataProperty(source, ['sourceType', 'type']) ?? BRIDGE_SOURCE_TYPE,
    requestedBy: readDataProperty(source, ['requestedBy', 'createdBy', 'owner']),
    acceptanceCriteria: cloneRuntimeSafeArray(readDataProperty(source, ['acceptanceCriteria', 'criteria'])),
    provenance: {
      ...ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE,
      sourceId: readDataProperty(source, ['id', 'ecrId', 'enhancementId'])
    }
  };

  return normalized;
}

export const normalizeEnhancementEcr = normalizeEcrForEngineeringMissionBridge;

export function validateEnhancementEcrForEngineeringMissionBridge(source = {}) {
  const normalizedSource = normalizeEcrForEngineeringMissionBridge(source);

  if (!isCompleteBridgeSource(normalizedSource)) {
    throw new Error('Enhancement/ECR source is incomplete and cannot be bridged to an engineering mission.');
  }

  if (!isApprovedBridgeSource(normalizedSource)) {
    throw new Error('Enhancement/ECR source must be approved before engineering mission bridge generation.');
  }

  return normalizedSource;
}

export function buildEngineeringMissionFromEnhancementEcr(source = {}) {
  const normalizedSource = validateEnhancementEcrForEngineeringMissionBridge(source);

  return {
    missionId: `ENG-BRIDGE-${normalizedSource.id}`,
    sourceEcr: normalizedSource.id,
    sourceType: normalizedSource.sourceType,
    title: normalizedSource.title,
    description: normalizedSource.description,
    priority: normalizedSource.priority,
    status: BRIDGE_READY_STATUS,
    assignedProvider: null,
    assignedWorkforce: null,
    approval: 'Pending',
    generated: true,
    bridgeGenerated: true,
    providerDispatch: null,
    acceptanceCriteria: [...normalizedSource.acceptanceCriteria],
    provenance: {
      ...ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE,
      sourceId: normalizedSource.id
    }
  };
}

export const generateEngineeringMissionFromEnhancementEcr = buildEngineeringMissionFromEnhancementEcr;
export const generateEngineeringMissionFromEnhancement = buildEngineeringMissionFromEnhancementEcr;

export function generateEngineeringMissionsFromEnhancementEcrs(sources = []) {
  return sources.map((source) => buildEngineeringMissionFromEnhancementEcr(source));
}

export const generateEngineeringMissionsFromEnhancements = generateEngineeringMissionsFromEnhancementEcrs;

export function generateEngineeringMissions(ecrs = []) {
  return {
    generatedAt: new Date().toISOString(),
    totalEcrs: ecrs.length,
    totalMissions: ecrs.length,
    missions: ecrs.map((ecr, index) => ({
      missionId: `ADM-IMP-${padMissionIndex(index)}`,
      sourceEcr: ecr.id,
      title: ecr.title,
      priority: ecr.priority,
      status: LEGACY_READY_STATUS,
      assignedProvider: null,
      assignedWorkforce: null,
      approval: LEGACY_APPROVAL_STATUS,
      generated: true
    }))
  };
}

export default {
  BRIDGE_PROVENANCE,
  ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE,
  normalizeEcrForEngineeringMissionBridge,
  normalizeEnhancementEcr,
  validateEnhancementEcrForEngineeringMissionBridge,
  buildEngineeringMissionFromEnhancementEcr,
  generateEngineeringMissionFromEnhancementEcr,
  generateEngineeringMissionFromEnhancement,
  generateEngineeringMissionsFromEnhancementEcrs,
  generateEngineeringMissionsFromEnhancements,
  generateEngineeringMissions
};
