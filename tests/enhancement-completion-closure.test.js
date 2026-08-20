'use strict';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  closeEnhancementFromCompletion,
  getEnhancementCompletionClosureRecords,
  resetEnhancementCompletionClosureForTests,
  SUCCESSFUL_CLOSURE_STATUS,
  REJECTED_CLOSURE_STATUS
} from '../backend/src/services/enhancement-completion-closure-service.js';

function validCompletion(overrides = {}) {
  const engineeringSummary = {
    validation: true,
    workspace: true,
    testing: true,
    verification: true,
    governance: true,
    promotion: true,
    committed: true,
    pushed: false,
    ...(overrides.engineeringSummary || {})
  };

  return {
    success: true,
    status: 'Mission Complete',
    missionId: 'ENG-MISSION-10-6-7-001',
    packageId: 'PKG-10-6-7-001',
    commit: '0123456789abcdef',
    completedAt: '2026-08-20T12:00:00.000Z',
    engineeringSummary,
    ...(overrides.engineeringSummary ? { ...overrides, engineeringSummary } : overrides)
  };
}

function validLineage(overrides = {}) {
  return {
    synchronizationIdentity: 'mc-sync-10-6-7-001',
    synchronizationRecordId: 'mc-sync-record-10-6-7-001',
    lifecycleRecordId: 'ledger-life-10-6-7-001',
    engineeringMissionId: 'ENG-MISSION-10-6-7-001',
    missionId: 'ENG-MISSION-10-6-7-001',
    enhancementId: 'ENH-10-6-7-001',
    ecrId: 'ECR-10-6-7-001',
    assignmentId: 'ASSIGN-10-6-7-001',
    assignedAgentId: 'Hermes',
    canonicalWorkforceIdentity: 'AIWF-Hermes',
    lifecycleState: 'engineering synchronized',
    engineeringPhase: 'completion evidence available',
    governanceState: 'approved for completion review',
    blockingConditions: [],
    provenance: {
      objective: 'EOS-10.6.6',
      source: 'mission-control-self-improvement-synchronization'
    },
    source: {
      state: 'synchronized',
      enhancementId: 'ENH-10-6-7-001',
      ecrId: 'ECR-10-6-7-001'
    },
    ...overrides
  };
}

function close(completion = validCompletion(), lineage = validLineage()) {
  return closeEnhancementFromCompletion({ completion, lineage });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test.beforeEach(() => {
  resetEnhancementCompletionClosureForTests();
});

test('valid Mission Complete evidence produces successful closure and preserves canonical identities', () => {
  const completion = validCompletion();
  const lineage = validLineage();

  const result = close(completion, lineage);

  assert.equal(result.success, true);
  assert.equal(result.closed, true);
  assert.equal(result.closureStatus, SUCCESSFUL_CLOSURE_STATUS);
  assert.match(result.closureId, /^enhancement-completion-closure-[a-f0-9]{32}$/);
  assert.equal(result.enhancementId, lineage.enhancementId);
  assert.equal(result.ecrId, lineage.ecrId);
  assert.equal(result.engineeringMissionId, lineage.engineeringMissionId);
  assert.equal(result.missionControlSynchronizationIdentity, lineage.synchronizationIdentity);
  assert.equal(result.synchronizationRecordId, lineage.synchronizationRecordId);
  assert.equal(result.completionCommit, completion.commit);
  assert.equal(result.completionPackageId, completion.packageId);
  assert.equal(result.completionStatus, 'Mission Complete');
  assert.deepEqual(result.completionEvidence, completion);
  assert.equal(getEnhancementCompletionClosureRecords().length, 1);
});

test('closure identity is deterministic for materially identical evidence and lineage', () => {
  const first = close(validCompletion(), validLineage());
  resetEnhancementCompletionClosureForTests();
  const second = close(validCompletion(), validLineage());

  assert.equal(first.closureId, second.closureId);
  assert.equal(first.closureStatus, second.closureStatus);
  assert.equal(first.closed, second.closed);
});

test('materially identical closure is idempotent and suppresses duplicate logical records', () => {
  const first = close();
  const second = close();

  assert.equal(second.closureId, first.closureId);
  assert.equal(second.closed, true);
  assert.equal(second.duplicateSuppressed, true);
  assert.equal(first.duplicateSuppressed, false);
  assert.equal(getEnhancementCompletionClosureRecords().length, 1);
  assert.equal(second.effects[0].type, 'duplicate_suppressed');
});

test('completion.completedAt is preserved as metadata but excluded from deterministic closure identity', () => {
  const first = close(validCompletion({ completedAt: '2026-08-20T12:00:00.000Z' }), validLineage());
  resetEnhancementCompletionClosureForTests();
  const second = close(validCompletion({ completedAt: '2099-01-01T00:00:00.000Z' }), validLineage());

  assert.equal(first.closureId, second.closureId);
  assert.equal(first.completionEvidence.completedAt, '2026-08-20T12:00:00.000Z');
  assert.equal(second.completionEvidence.completedAt, '2099-01-01T00:00:00.000Z');
});

test('rejected and malformed closure inputs are deterministic and side-effect free', () => {
  const cases = [
    {
      name: 'malformed input',
      execute: () => closeEnhancementFromCompletion(null),
      reason: 'MALFORMED_INPUT'
    },
    {
      name: 'missing Enhancement/ECR identity',
      execute: () => {
        const lineage = validLineage({ enhancementId: undefined, ecrId: undefined, source: {} });
        return close(validCompletion(), lineage);
      },
      reason: 'MISSING_ORIGINATING_ENHANCEMENT_OR_ECR_ID'
    },
    {
      name: 'missing Engineering Mission identity',
      execute: () => {
        const lineage = validLineage({ engineeringMissionId: undefined, missionId: undefined });
        return close(validCompletion(), lineage);
      },
      reason: 'MISSING_ENGINEERING_MISSION_ID'
    },
    {
      name: 'missing Mission Control synchronization identity',
      execute: () => {
        const lineage = validLineage({ synchronizationIdentity: undefined, synchronizationRecordId: undefined });
        return close(validCompletion(), lineage);
      },
      reason: 'MISSING_MISSION_CONTROL_SYNCHRONIZATION_ID'
    },
    {
      name: 'missing completion evidence',
      execute: () => closeEnhancementFromCompletion({ lineage: validLineage() }),
      reason: 'MISSING_COMPLETION_EVIDENCE'
    },
    {
      name: 'completion.success false',
      execute: () => close(validCompletion({ success: false }), validLineage()),
      reason: 'COMPLETION_NOT_SUCCESSFUL'
    },
    {
      name: 'non Mission Complete status',
      execute: () => close(validCompletion({ status: 'Mission Eligible' }), validLineage()),
      reason: 'COMPLETION_STATUS_NOT_MISSION_COMPLETE'
    },
    {
      name: 'missing completion commit',
      execute: () => close(validCompletion({ commit: undefined }), validLineage()),
      reason: 'MISSING_COMPLETION_COMMIT'
    },
    {
      name: 'incomplete engineeringSummary',
      execute: () => close(validCompletion({ engineeringSummary: { verification: false } }), validLineage()),
      reason: 'INCOMPLETE_ENGINEERING_SUMMARY'
    },
    {
      name: 'pushed=true',
      execute: () => close(validCompletion({ engineeringSummary: { pushed: true } }), validLineage()),
      reason: 'COMPLETION_INDICATES_PUSHED'
    },
    {
      name: 'mission identity mismatch',
      execute: () => close(validCompletion({ missionId: 'OTHER-MISSION' }), validLineage()),
      reason: 'COMPLETION_LINEAGE_MISSION_ID_MISMATCH'
    },
    {
      name: 'incompatible terminal source state',
      execute: () => close(validCompletion(), validLineage({ lifecycleState: 'rejected' })),
      reason: 'INCOMPATIBLE_TERMINAL_SOURCE_STATE'
    },
    {
      name: 'contradictory lineage',
      execute: () => close(validCompletion(), validLineage({ missionId: 'DIFFERENT-MISSION' })),
      reason: 'CONTRADICTORY_LINEAGE'
    }
  ];

  for (const testCase of cases) {
    resetEnhancementCompletionClosureForTests();
    const result = testCase.execute();
    assert.equal(result.success, false, testCase.name);
    assert.equal(result.closed, false, testCase.name);
    assert.equal(result.closureStatus, REJECTED_CLOSURE_STATUS, testCase.name);
    assert.equal(result.rejectionReason, testCase.reason, testCase.name);
    assert.equal(result.effects.length, 0, testCase.name);
    assert.equal(getEnhancementCompletionClosureRecords().length, 0, testCase.name);
  }
});

test('source lineage and completion evidence are not mutated', () => {
  const completion = validCompletion();
  const lineage = validLineage();
  const completionBefore = clone(completion);
  const lineageBefore = clone(lineage);

  const result = close(completion, lineage);

  assert.equal(result.closed, true);
  assert.deepEqual(completion, completionBefore);
  assert.deepEqual(lineage, lineageBefore);
});

test('returned closure result and closure record snapshots are immutable', () => {
  const result = close();
  const records = getEnhancementCompletionClosureRecords();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.completionEvidence), true);
  assert.equal(Object.isFrozen(result.completionEvidence.engineeringSummary), true);
  assert.equal(Object.isFrozen(result.provenance), true);
  assert.equal(Object.isFrozen(records), true);
  assert.equal(Object.isFrozen(records[0]), true);

  assert.throws(() => {
    result.closed = false;
  }, TypeError);

  assert.equal(result.closed, true);
});

test('service source preserves side-effect boundary and does not re-execute completion authority', () => {
  const servicePath = path.join(__dirname, '..', 'backend', 'src', 'services', 'enhancement-completion-closure-service.js');
  const source = fs.readFileSync(servicePath, 'utf8');

  assert.doesNotMatch(source, /require\s*\([^)]*mission-completion-service/);
  assert.doesNotMatch(source, /completeMission\s*\(/);
  assert.doesNotMatch(source, /child_process|execSync|spawnSync|simple-git/);
  assert.doesNotMatch(source, /openai|anthropic|provider|dispatch/i);
  assert.doesNotMatch(source, /executeEngineeringMission|runEngineeringMission|assignWorkforce|synchronizeLedger|synchronizeMissionControl/i);
  assert.doesNotMatch(source, /promoteFiles|git\s+push|pushExecuted\s*=|grantGovernanceAuthority|authorizeGovernance/i);
});
