import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  BRIDGE_PROVENANCE,
  ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE,
  buildEngineeringMissionFromEnhancementEcr,
  generateEngineeringMissionFromEnhancement,
  generateEngineeringMissionFromEnhancementEcr,
  generateEngineeringMissions,
  generateEngineeringMissionsFromEnhancementEcrs,
  generateEngineeringMissionsFromEnhancements,
  normalizeEcrForEngineeringMissionBridge,
  normalizeEnhancementEcr,
  validateEnhancementEcrForEngineeringMissionBridge
} from '../backend/src/services/mission-generator-service.js';

const servicePath = new URL('../backend/src/services/mission-generator-service.js', import.meta.url);
const testPath = new URL('./enhancement-engineering-mission-bridge.test.js', import.meta.url);

function approvedSource(overrides = {}) {
  return {
    id: 'ECR-10-6-1',
    title: 'Bridge approved enhancement into engineering mission',
    description: 'Create a governed bridge from approved Enhancement/ECR source material.',
    priority: 'Critical',
    approval: 'Approved',
    acceptanceCriteria: ['source is approved', 'mission is deterministic'],
    ...overrides
  };
}

function assertIsoDate(value) {
  assert.equal(typeof value, 'string');
  assert.match(value, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.ok(!Number.isNaN(Date.parse(value)));
}

test('affected files preserve ESM-only syntax and avoid CommonJS markers', () => {
  const blockedImportMarker = 'requ' + 'ire(';
  const blockedExportMarker = 'module' + '.exports';

  for (const path of [servicePath, testPath]) {
    const content = readFileSync(path, 'utf8');
    assert.equal(content.includes(blockedImportMarker), false);
    assert.equal(content.includes(blockedExportMarker), false);
  }
});

test('Objective 10.6.1 bridge exports remain additive and available', () => {
  assert.equal(typeof BRIDGE_PROVENANCE, 'object');
  assert.equal(typeof ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE, 'object');
  assert.equal(typeof normalizeEcrForEngineeringMissionBridge, 'function');
  assert.equal(typeof normalizeEnhancementEcr, 'function');
  assert.equal(typeof validateEnhancementEcrForEngineeringMissionBridge, 'function');
  assert.equal(typeof buildEngineeringMissionFromEnhancementEcr, 'function');
  assert.equal(typeof generateEngineeringMissionFromEnhancementEcr, 'function');
  assert.equal(typeof generateEngineeringMissionFromEnhancement, 'function');
  assert.equal(typeof generateEngineeringMissionsFromEnhancementEcrs, 'function');
  assert.equal(typeof generateEngineeringMissionsFromEnhancements, 'function');
  assert.equal(typeof generateEngineeringMissions, 'function');
});

test('bridge identity and output are deterministic and idempotent', () => {
  const source = approvedSource();

  const first = generateEngineeringMissionFromEnhancementEcr(source);
  const second = generateEngineeringMissionFromEnhancementEcr(source);

  assert.deepEqual(first, second);
  assert.equal(first.missionId, 'ENG-BRIDGE-ECR-10-6-1');
  assert.equal(first.sourceEcr, 'ECR-10-6-1');
  assert.equal(first.generated, true);
  assert.equal(first.bridgeGenerated, true);
});

test('bridge provenance is preserved on generated missions', () => {
  const mission = generateEngineeringMissionFromEnhancement(approvedSource());

  assert.deepEqual(BRIDGE_PROVENANCE, ENHANCEMENT_ENGINEERING_MISSION_BRIDGE_PROVENANCE);
  assert.equal(mission.provenance.objectiveId, '10.6.1');
  assert.equal(mission.provenance.missionId, 'EOS-10.6.1');
  assert.equal(mission.provenance.bridge, 'Enhancement/ECR Engineering Mission Bridge');
  assert.equal(mission.provenance.mode, 'additive');
  assert.equal(mission.provenance.moduleSystem, 'ESM');
  assert.equal(mission.provenance.sourceId, 'ECR-10-6-1');
});

test('bridge rejects unapproved sources', () => {
  assert.throws(
    () => generateEngineeringMissionFromEnhancementEcr(approvedSource({ approval: 'Pending', approved: undefined })),
    /approved before engineering mission bridge generation/
  );
});

test('bridge rejects incomplete sources', () => {
  assert.throws(
    () => generateEngineeringMissionFromEnhancementEcr({ id: 'ECR-INCOMPLETE', approval: 'Approved' }),
    /incomplete/
  );
});

test('runtime-only function values are isolated during bridge normalization', () => {
  const source = approvedSource({
    acceptanceCriteria: ['serializable criterion', () => 'runtime-only criterion'],
    providerResolver: () => {
      throw new Error('runtime-only function must not be invoked');
    }
  });

  const normalized = normalizeEcrForEngineeringMissionBridge(source);
  const mission = generateEngineeringMissionFromEnhancement(source);

  assert.deepEqual(normalized.acceptanceCriteria, ['serializable criterion']);
  assert.deepEqual(mission.acceptanceCriteria, ['serializable criterion']);
  assert.equal(Object.hasOwn(normalized, 'providerResolver'), false);
  assert.equal(Object.hasOwn(mission, 'providerResolver'), false);
});

test('bridge normalizes ECR aliases without changing legacy API behavior', () => {
  const normalized = normalizeEnhancementEcr({
    ecrId: 'ECR-ALIAS-001',
    name: 'Alias title',
    summary: 'Alias description',
    status: 'APPROVED',
    criteria: ['alias criterion']
  });

  assert.equal(normalized.id, 'ECR-ALIAS-001');
  assert.equal(normalized.title, 'Alias title');
  assert.equal(normalized.description, 'Alias description');
  assert.equal(normalized.approval, 'Approved');
  assert.equal(normalized.sourceType, 'EnhancementChangeRequest');
  assert.deepEqual(normalized.acceptanceCriteria, ['alias criterion']);
});

test('bridge remains isolated from provider dispatch and workforce assignment', () => {
  const mission = buildEngineeringMissionFromEnhancementEcr(approvedSource({
    assignedProvider: 'OpenAI Codex',
    assignedWorkforce: 'AI Engineering Office',
    provider: 'OpenAI Codex',
    workforce: 'AI Engineering Office'
  }));

  assert.equal(mission.assignedProvider, null);
  assert.equal(mission.assignedWorkforce, null);
  assert.equal(mission.providerDispatch, null);
});

test('bridge batch aliases produce the same deterministic missions', () => {
  const sources = [approvedSource({ id: 'ECR-A' }), approvedSource({ id: 'ECR-B' })];

  assert.deepEqual(
    generateEngineeringMissionsFromEnhancementEcrs(sources),
    generateEngineeringMissionsFromEnhancements(sources)
  );
  assert.deepEqual(
    generateEngineeringMissionsFromEnhancementEcrs(sources).map((mission) => mission.missionId),
    ['ENG-BRIDGE-ECR-A', 'ENG-BRIDGE-ECR-B']
  );
});

test('legacy generateEngineeringMissions canonical semantics: empty input', () => {
  const result = generateEngineeringMissions([]);

  assertIsoDate(result.generatedAt);
  assert.equal(result.totalEcrs, 0);
  assert.equal(result.totalMissions, 0);
  assert.deepEqual(result.missions, []);
});

test('legacy generateEngineeringMissions canonical semantics: default empty input', () => {
  const result = generateEngineeringMissions();

  assertIsoDate(result.generatedAt);
  assert.equal(result.totalEcrs, 0);
  assert.equal(result.totalMissions, 0);
  assert.deepEqual(result.missions, []);
});

test('legacy generateEngineeringMissions canonical semantics: minimal ECR input', () => {
  const result = generateEngineeringMissions([{ id: 'ECR-MIN-001', title: 'Minimal title' }]);

  assertIsoDate(result.generatedAt);
  assert.equal(result.totalEcrs, 1);
  assert.equal(result.totalMissions, 1);
  assert.deepEqual(result.missions, [
    {
      missionId: 'ADM-IMP-0001',
      sourceEcr: 'ECR-MIN-001',
      title: 'Minimal title',
      priority: undefined,
      status: 'READY_FOR_DISPATCH',
      assignedProvider: null,
      assignedWorkforce: null,
      approval: 'Pending',
      generated: true
    }
  ]);
});

test('legacy generateEngineeringMissions canonical semantics: explicit source values must not override canonical legacy fields', () => {
  const result = generateEngineeringMissions([
    {
      id: 'ECR-EXPLICIT-001',
      title: 'Exact source title',
      priority: 'Low',
      status: 'Draft',
      assignedProvider: 'OpenAI Codex',
      assignedWorkforce: 'AI Engineering Office',
      approval: 'Approved'
    },
    {
      id: 'ECR-EXPLICIT-002',
      title: 'Second exact source title',
      status: 'APPROVED',
      assignedProvider: 'Another Provider',
      assignedWorkforce: 'Another Workforce',
      approval: 'Rejected'
    }
  ]);

  assertIsoDate(result.generatedAt);
  assert.equal(result.totalEcrs, 2);
  assert.equal(result.totalMissions, 2);
  assert.deepEqual(result.missions, [
    {
      missionId: 'ADM-IMP-0001',
      sourceEcr: 'ECR-EXPLICIT-001',
      title: 'Exact source title',
      priority: 'Low',
      status: 'READY_FOR_DISPATCH',
      assignedProvider: null,
      assignedWorkforce: null,
      approval: 'Pending',
      generated: true
    },
    {
      missionId: 'ADM-IMP-0002',
      sourceEcr: 'ECR-EXPLICIT-002',
      title: 'Second exact source title',
      priority: undefined,
      status: 'READY_FOR_DISPATCH',
      assignedProvider: null,
      assignedWorkforce: null,
      approval: 'Pending',
      generated: true
    }
  ]);
});
