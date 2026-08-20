import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicePath = path.join(
  __dirname,
  '..',
  'backend',
  'src',
  'services',
  'mission-control-self-improvement-synchronization-service.js'
);
const runtimeServicePath = path.join(
  __dirname,
  '..',
  'backend',
  'src',
  'services',
  'mission-control-runtime-service.js'
);

import * as service from '../backend/src/services/mission-control-self-improvement-synchronization-service.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validLifecycleRecord(overrides = {}) {
  return {
    lifecycleRecordId: 'EL-LC-10.6.5-001',
    ledgerEntryId: 'EL-ENTRY-10.6.5-001',
    missionId: 'EOS-10.6.6-IMPLEMENT-001',
    engineeringMissionId: 'EM-EOS-10.6.6-IMPLEMENT-001',
    enhancementId: 'ENH-10.6.6-001',
    ecrId: 'ECR-10.6.6-001',
    assignmentId: 'AI-WORKFORCE-ASSIGNMENT-10.6.6-001',
    assignedAgentId: 'EOS-AGENT-HERMES',
    canonicalWorkforceIdentity: 'EOS-AGENT-HERMES',
    assignmentStatus: 'assigned',
    lifecycleState: 'engineering_ledger_lifecycle_synchronized',
    engineeringPhase: 'IMPLEMENT',
    governanceState: {
      approvalRequired: true,
      governanceState: 'human_approved_governed_generation',
      approvedForAutonomousExecution: false
    },
    blockingConditions: [
      {
        code: 'PROMOTION_REQUIRES_SEPARATE_GOVERNED_AUTHORIZATION',
        status: 'blocking'
      }
    ],
    provenance: {
      sourceObjective: '10.6.5',
      upstreamFlow: [
        'Enhancement / ECR',
        'Assessment and Governance Eligibility',
        'Engineering Mission',
        'AI Workforce Assignment',
        'Engineering Ledger Lifecycle Synchronization'
      ]
    },
    source: {
      service: 'engineering-ledger-lifecycle-synchronization-service',
      objective: '10.6.5'
    },
    deterministicIdentity: 'EL-LC-DETERMINISTIC-10.6.5-001',
    ...overrides
  };
}

function removeKeys(record, keys) {
  const next = clone(record);
  for (const key of keys) {
    delete next[key];
  }
  return next;
}

test.beforeEach(() => {
  service.resetMissionControlSelfImprovementSynchronizationForTests();
});

test('valid Objective 10.6.5 lifecycle record synchronizes and preserves required Mission Control state', () => {
  const lifecycleRecord = validLifecycleRecord();
  const originalLifecycleRecord = clone(lifecycleRecord);

  const result = service.synchronizeMissionControlSelfImprovement(lifecycleRecord);

  assert.equal(result.synchronized, true);
  assert.equal(result.duplicateSuppressed, false);
  assert.match(result.synchronizationIdentity, /^MC-SI-SYNC-[A-F0-9]{32}$/);
  assert.equal(result.record.synchronizationIdentity, result.synchronizationIdentity);

  assert.equal(result.record.engineeringMissionId, lifecycleRecord.engineeringMissionId);
  assert.equal(result.record.missionId, lifecycleRecord.missionId);
  assert.equal(result.record.enhancementId, lifecycleRecord.enhancementId);
  assert.equal(result.record.ecrId, lifecycleRecord.ecrId);
  assert.equal(result.record.assignmentId, lifecycleRecord.assignmentId);
  assert.equal(result.record.assignedAgentId, lifecycleRecord.assignedAgentId);
  assert.equal(result.record.canonicalWorkforceIdentity, lifecycleRecord.canonicalWorkforceIdentity);
  assert.equal(result.record.lifecycleRecordId, lifecycleRecord.lifecycleRecordId);
  assert.equal(result.record.ledgerEntryId, lifecycleRecord.ledgerEntryId);
  assert.equal(result.record.lifecycleState, lifecycleRecord.lifecycleState);
  assert.equal(result.record.engineeringPhase, lifecycleRecord.engineeringPhase);
  assert.deepEqual(result.record.governanceState, lifecycleRecord.governanceState);
  assert.deepEqual(result.record.blockingConditions, lifecycleRecord.blockingConditions);
  assert.deepEqual(result.record.provenance, lifecycleRecord.provenance);
  assert.deepEqual(result.record.source, lifecycleRecord.source);

  assert.deepEqual(lifecycleRecord, originalLifecycleRecord);
});

test('synchronization identity is deterministic and does not depend on runtime time or random state', () => {
  const lifecycleRecord = validLifecycleRecord();
  const reorderedLifecycleRecord = {
    deterministicIdentity: lifecycleRecord.deterministicIdentity,
    source: {
      objective: '10.6.5',
      service: 'engineering-ledger-lifecycle-synchronization-service'
    },
    provenance: {
      upstreamFlow: lifecycleRecord.provenance.upstreamFlow,
      sourceObjective: '10.6.5'
    },
    blockingConditions: clone(lifecycleRecord.blockingConditions),
    governanceState: {
      approvedForAutonomousExecution: false,
      governanceState: 'human_approved_governed_generation',
      approvalRequired: true
    },
    engineeringPhase: lifecycleRecord.engineeringPhase,
    lifecycleState: lifecycleRecord.lifecycleState,
    assignmentStatus: lifecycleRecord.assignmentStatus,
    canonicalWorkforceIdentity: lifecycleRecord.canonicalWorkforceIdentity,
    assignedAgentId: lifecycleRecord.assignedAgentId,
    assignmentId: lifecycleRecord.assignmentId,
    ecrId: lifecycleRecord.ecrId,
    enhancementId: lifecycleRecord.enhancementId,
    engineeringMissionId: lifecycleRecord.engineeringMissionId,
    missionId: lifecycleRecord.missionId,
    ledgerEntryId: lifecycleRecord.ledgerEntryId,
    lifecycleRecordId: lifecycleRecord.lifecycleRecordId
  };

  const originalDateNow = Date.now;
  const originalRandom = Math.random;

  Date.now = () => {
    throw new Error('Date.now must not determine synchronization identity');
  };
  Math.random = () => {
    throw new Error('Math.random must not determine synchronization identity');
  };

  try {
    const first = service.synchronizeMissionControlSelfImprovement(lifecycleRecord);
    service.resetMissionControlSelfImprovementSynchronizationForTests();
    const second = service.synchronizeMissionControlSelfImprovement(reorderedLifecycleRecord);

    assert.equal(first.synchronizationIdentity, second.synchronizationIdentity);
    assert.deepEqual(first.record, second.record);
  } finally {
    Date.now = originalDateNow;
    Math.random = originalRandom;
  }
});

test('materially identical synchronization is idempotent and duplicate Mission Control records are suppressed', () => {
  const lifecycleRecord = validLifecycleRecord();

  const first = service.synchronizeMissionControlSelfImprovement(lifecycleRecord);
  const second = service.synchronizeMissionControlSelfImprovement(clone(lifecycleRecord));
  const records = service.getMissionControlSelfImprovementRecords();

  assert.equal(second.synchronizationIdentity, first.synchronizationIdentity);
  assert.equal(second.synchronized, false);
  assert.equal(second.duplicateSuppressed, true);
  assert.equal(records.length, 1);
  assert.deepEqual(second.record, first.record);
  assert.deepEqual(records[0], first.record);
});

test('malformed input is rejected deterministically and remains side-effect free', () => {
  const malformedInputs = [null, undefined, 'not-a-record', 42, [], () => ({})];

  for (const malformedInput of malformedInputs) {
    assert.throws(
      () => service.synchronizeMissionControlSelfImprovement(malformedInput),
      (error) => error.code === 'MISSION_CONTROL_SELF_IMPROVEMENT_MALFORMED_INPUT'
    );
  }

  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(null),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_MALFORMED_INPUT',
      message: 'Mission Control self-improvement synchronization requires a lifecycle record object.'
    }
  );
  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(null),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_MALFORMED_INPUT',
      message: 'Mission Control self-improvement synchronization requires a lifecycle record object.'
    }
  );
  assert.deepEqual(service.getMissionControlSelfImprovementRecords(), []);
});

test('missing Engineering Ledger lifecycle identity is rejected deterministically and remains side-effect free', () => {
  const missingLifecycleIdentity = removeKeys(validLifecycleRecord(), [
    'lifecycleRecordId',
    'ledgerEntryId',
    'deterministicIdentity'
  ]);

  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(missingLifecycleIdentity),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_MISSING_LIFECYCLE_IDENTITY',
      message: 'Mission Control self-improvement synchronization requires an Engineering Ledger lifecycle identity.'
    }
  );
  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(missingLifecycleIdentity),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_MISSING_LIFECYCLE_IDENTITY',
      message: 'Mission Control self-improvement synchronization requires an Engineering Ledger lifecycle identity.'
    }
  );
  assert.deepEqual(service.getMissionControlSelfImprovementRecords(), []);
});

test('missing Engineering Mission identity is rejected deterministically and remains side-effect free', () => {
  const missingEngineeringMissionIdentity = removeKeys(validLifecycleRecord(), [
    'engineeringMissionId',
    'missionId'
  ]);

  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(missingEngineeringMissionIdentity),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_MISSING_ENGINEERING_MISSION_IDENTITY',
      message: 'Mission Control self-improvement synchronization requires an Engineering Mission identity.'
    }
  );
  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(missingEngineeringMissionIdentity),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_MISSING_ENGINEERING_MISSION_IDENTITY',
      message: 'Mission Control self-improvement synchronization requires an Engineering Mission identity.'
    }
  );
  assert.deepEqual(service.getMissionControlSelfImprovementRecords(), []);
});

test('invalid canonical lifecycle lineage is rejected deterministically', () => {
  assert.throws(
    () => service.synchronizeMissionControlSelfImprovement(
      validLifecycleRecord({ canonicalWorkforceIdentity: 'HERMES' })
    ),
    {
      code: 'MISSION_CONTROL_SELF_IMPROVEMENT_INVALID_CANONICAL_WORKFORCE_LINEAGE',
      message: 'Mission Control self-improvement synchronization requires canonical workforce identity lineage to use EOS-AGENT-* identity when supplied.'
    }
  );

  assert.deepEqual(service.getMissionControlSelfImprovementRecords(), []);
});

test('source input is not mutated and synchronization result is immutable', () => {
  const lifecycleRecord = validLifecycleRecord();
  const originalLifecycleRecord = clone(lifecycleRecord);

  const result = service.synchronizeMissionControlSelfImprovement(lifecycleRecord);
  const records = service.getMissionControlSelfImprovementRecords();

  assert.deepEqual(lifecycleRecord, originalLifecycleRecord);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.record), true);
  assert.equal(Object.isFrozen(result.record.governanceState), true);
  assert.equal(Object.isFrozen(result.record.blockingConditions), true);
  assert.equal(Object.isFrozen(result.record.blockingConditions[0]), true);
  assert.equal(Object.isFrozen(records), true);
  assert.equal(Object.isFrozen(records[0]), true);

  assert.throws(() => {
    result.record.lifecycleState = 'mutated';
  }, /Cannot assign to read only property|read only/);
  assert.throws(() => {
    result.record.blockingConditions.push({ code: 'MUTATION' });
  }, /Cannot add property|object is not extensible|read only/);
});

test('synchronization service imports no provider, engineering execution, Git, promotion, or closure modules', () => {
  const source = fs.readFileSync(servicePath, 'utf8');

  const imports = Array.from(
    source.matchAll(
      /(?:import\s+(?:[^'"]+?\s+from\s+)?|import\s*\()(['"])([^'"]+)\1/g
    ),
    (match) => match[2]
  );

  assert.deepEqual(
    imports,
    ['node:crypto']
  );

  for (const request of imports) {
    assert.doesNotMatch(
      request,
      /provider|git|promotion|engineering.*execution|enhancement.*closure|ecr.*closure/i
    );
  }
});

test('synchronization service source contains no provider dispatch, engineering execution, Git promotion, commit, push, or closure operation', () => {
  const source = fs.readFileSync(servicePath, 'utf8');

  assert.doesNotMatch(source, /Date\.now|Math\.random/);
  assert.doesNotMatch(source, /dispatch[A-Za-z]*Provider|providerDispatch|executeEngineeringMission|runEngineeringMission/);
  assert.doesNotMatch(source, /createGovernedEngineeringWorkspace|generateEngineeringPackage/);
  assert.doesNotMatch(source, /git\s+commit|git\s+push|commitGit|pushGit|repositoryPromotion|promoteRepository/);
  assert.doesNotMatch(source, /closeEnhancement|closeECR|closeEcr|closeEngineeringMission|grantGovernanceAuthority/);
});

test('buildMissionControlRuntime semantics remain unchanged by self-improvement synchronization', async () => {
  assert.equal(
    fs.existsSync(runtimeServicePath),
    true,
    'mission-control-runtime-service.js must exist'
  );

  const runtimeSourceBefore =
    fs.readFileSync(runtimeServicePath, 'utf8');

  const runtimeService =
    await import('../backend/src/services/mission-control-runtime-service.js');

  assert.equal(
    typeof runtimeService.buildMissionControlRuntime,
    'function'
  );

  const builderReferenceBefore =
    runtimeService.buildMissionControlRuntime;

  service.synchronizeMissionControlSelfImprovement(
    validLifecycleRecord()
  );

  const runtimeSourceAfter =
    fs.readFileSync(runtimeServicePath, 'utf8');

  const runtimeServiceAfter =
    await import('../backend/src/services/mission-control-runtime-service.js');

  assert.equal(
    runtimeSourceAfter,
    runtimeSourceBefore
  );

  assert.strictEqual(
    runtimeServiceAfter.buildMissionControlRuntime,
    builderReferenceBefore
  );
});
