import assert from 'node:assert/strict';
import test from 'node:test';

import * as ledgerService from '../backend/src/services/engineering-ledger-service.js';

function lifecycleRecordsFromLedger(ledger) {
  if (Array.isArray(ledger)) {
    return ledger.filter((entry) => entry && entry.type === 'engineering-ledger-lifecycle-synchronization-record');
  }

  if (ledger && Array.isArray(ledger.lifecycleSynchronizationRecords)) {
    return ledger.lifecycleSynchronizationRecords;
  }

  if (ledger && ledger.lifecycleSynchronization && Array.isArray(ledger.lifecycleSynchronization.records)) {
    return ledger.lifecycleSynchronization.records;
  }

  return [];
}

function canonicalInput() {
  return {
    engineeringMission: {
      missionId: 'EM-10-6-5-CANONICAL-001',
      enhancementId: 'ECR-10-6-5-CANONICAL-001',
      objectiveId: '10.6.5',
      title: 'Synchronize Engineering Ledger lifecycle state',
      provenance: {
        missionGenerator: 'mission-generator-service',
        objective: 'Objective 10.6.5'
      }
    },
    aiWorkforceAssignment: {
      assignmentId: 'ASSIGN-10-6-4-CANONICAL-001',
      assignedAgentId: 'EOS-AGENT-HERMES-BUILD',
      assignmentStatus: 'assigned',
      provenance: {
        assignmentService: 'ai-workforce-assignment-service',
        objective: 'Objective 10.6.4'
      }
    },
    lifecycleState: {
      state: 'assigned',
      phase: 'engineering-lifecycle-state-recorded',
      terminal: false
    },
    governanceState: {
      approvalRequired: true,
      approvedForAutonomousExecution: false,
      reviewer: 'Governance Office'
    },
    blockingConditions: [
      {
        code: 'HUMAN_APPROVAL_REQUIRED',
        message: 'Lifecycle synchronization records state only and does not execute.'
      }
    ],
    upstreamProvenance: {
      enhancementId: 'ECR-10-6-5-CANONICAL-001',
      orchestrationId: 'ORCH-10-6-3-CANONICAL-001',
      sourceService: 'enhancement-engineering-orchestration-service'
    },
    sourceContract: 'Objective 10.6.5 Lifecycle Synchronization Contract',
    sourceType: 'engineering-lifecycle-state'
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('existing Engineering Ledger remains readable and historical entries remain available', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const ledgerBefore = ledgerService.getEngineeringLedger();
  assert.ok(ledgerBefore !== undefined);
  assert.ok(ledgerBefore !== null);

  const serializedBefore = JSON.stringify(ledgerBefore);
  assert.ok(serializedBefore.length > 0);

  ledgerService.synchronizeEngineeringLedgerLifecycle(canonicalInput());
  const ledgerAfter = ledgerService.getEngineeringLedger();
  const serializedAfter = JSON.stringify(ledgerAfter);

  assert.ok(serializedAfter.length >= serializedBefore.length);
  assert.strictEqual(lifecycleRecordsFromLedger(ledgerAfter).length, 1);
});

test('valid canonical Engineering Mission and Objective 10.6.4 assignment lifecycle state can be synchronized', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const input = canonicalInput();
  const missionBefore = clone(input.engineeringMission);
  const assignmentBefore = clone(input.aiWorkforceAssignment);

  const result = ledgerService.synchronizeEngineeringLedgerLifecycle(input);

  assert.strictEqual(result.synchronizationStatus, 'synchronized');
  assert.strictEqual(result.accepted, true);
  assert.strictEqual(result.created, true);
  assert.ok(result.lifecycleRecordId.startsWith('ELS-1065-'));
  assert.strictEqual(result.ledgerEntryId, result.lifecycleRecordId);

  assert.strictEqual(result.record.missionId, input.engineeringMission.missionId);
  assert.strictEqual(result.record.engineeringMissionId, input.engineeringMission.missionId);
  assert.strictEqual(result.record.assignmentId, input.aiWorkforceAssignment.assignmentId);
  assert.strictEqual(result.record.assignedAgentId, input.aiWorkforceAssignment.assignedAgentId);
  assert.strictEqual(result.record.canonicalWorkforceIdentity, 'EOS-AGENT-HERMES-BUILD');
  assert.strictEqual(result.record.assignmentStatus, 'assigned');
  assert.deepStrictEqual(result.record.lifecycleState, input.lifecycleState);
  assert.deepStrictEqual(result.record.governanceState, input.governanceState);
  assert.deepStrictEqual(result.record.blockingConditions, input.blockingConditions);
  assert.deepStrictEqual(result.record.provenance.upstream, input.upstreamProvenance);
  assert.deepStrictEqual(result.record.provenance.engineeringMission.source, input.engineeringMission);
  assert.deepStrictEqual(result.record.provenance.aiWorkforceAssignment.source, input.aiWorkforceAssignment);

  assert.deepStrictEqual(input.engineeringMission, missionBefore);
  assert.deepStrictEqual(input.aiWorkforceAssignment, assignmentBefore);
});

test('lifecycle record identity is deterministic and materially identical synchronization is idempotent', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const first = ledgerService.synchronizeEngineeringLedgerLifecycle(canonicalInput());
  const second = ledgerService.synchronizeEngineeringLedgerLifecycle(canonicalInput());

  assert.strictEqual(first.lifecycleRecordId, second.lifecycleRecordId);
  assert.strictEqual(first.record.lifecycleRecordId, second.record.lifecycleRecordId);
  assert.strictEqual(second.created, false);
  assert.strictEqual(second.duplicateSuppressed, true);

  const ledger = ledgerService.getEngineeringLedger();
  assert.strictEqual(lifecycleRecordsFromLedger(ledger).length, 1);
});

test('returned synchronization result is immutable at contract boundaries', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const result = ledgerService.synchronizeEngineeringLedgerLifecycle(canonicalInput());

  assert.strictEqual(Object.isFrozen(result), true);
  assert.strictEqual(Object.isFrozen(result.record), true);
  assert.strictEqual(Object.isFrozen(result.effects), true);
});

test('missing Engineering Mission identity is handled deterministically', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const input = canonicalInput();
  delete input.engineeringMission.missionId;

  const first = ledgerService.synchronizeEngineeringLedgerLifecycle(input);
  const second = ledgerService.synchronizeEngineeringLedgerLifecycle(input);

  assert.strictEqual(first.synchronizationStatus, 'rejected');
  assert.strictEqual(first.accepted, false);
  assert.strictEqual(first.reason, 'MISSING_ENGINEERING_MISSION_IDENTITY');
  assert.strictEqual(first.lifecycleRecordId, second.lifecycleRecordId);
  assert.strictEqual(lifecycleRecordsFromLedger(ledgerService.getEngineeringLedger()).length, 0);
});

test('malformed lifecycle input is handled deterministically', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const first = ledgerService.synchronizeEngineeringLedgerLifecycle(null);
  const second = ledgerService.synchronizeEngineeringLedgerLifecycle(null);

  assert.strictEqual(first.synchronizationStatus, 'rejected');
  assert.strictEqual(first.accepted, false);
  assert.strictEqual(first.reason, 'MALFORMED_LIFECYCLE_INPUT');
  assert.strictEqual(first.lifecycleRecordId, second.lifecycleRecordId);
});

test('non-canonical legacy workforce identity is rejected deterministically', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const input = canonicalInput();
  input.aiWorkforceAssignment.assignedAgentId = 'ADO-AGENT-HERMES';

  const result = ledgerService.synchronizeEngineeringLedgerLifecycle(input);

  assert.strictEqual(result.synchronizationStatus, 'rejected');
  assert.strictEqual(result.reason, 'NON_CANONICAL_WORKFORCE_IDENTITY');
  assert.strictEqual(lifecycleRecordsFromLedger(ledgerService.getEngineeringLedger()).length, 0);
});

test('synchronization has no provider dispatch, mission execution, Git promotion, Git commit, or Enhancement/ECR closure effects', () => {
  ledgerService.resetEngineeringLedgerLifecycleSynchronizationForTests();

  const result = ledgerService.synchronizeEngineeringLedgerLifecycle(canonicalInput());

  assert.deepStrictEqual(result.effects, {
    providerDispatch: false,
    engineeringMissionExecution: false,
    gitPromotion: false,
    gitCommit: false,
    enhancementClosure: false,
    ecrClosure: false
  });

  assert.deepStrictEqual(result.record.effects, {
    providerDispatch: false,
    engineeringMissionExecution: false,
    gitPromotion: false,
    gitCommit: false,
    enhancementClosure: false,
    ecrClosure: false
  });
});
