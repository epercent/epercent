import test from 'node:test';
import assert from 'node:assert/strict';
import { assignAIWorkforce, AI_WORKFORCE_ASSIGNMENT_STATUSES } from '../backend/src/services/ai-workforce-assignment-service.js';

const baseMission = () => ({
  id: 'EOS-EM-10-6-4-001',
  requiredCapabilities: [' Software engineering ', 'Platform development'],
  assignedOffice: 'AI Engineering Office',
  provenance: {
    objective: 'Objective 10.6.4',
    upstream: 'backend/src/services/enhancement-engineering-orchestration-service.js'
  }
});

const baseWorkforce = () => [
  {
    id: 'EOS-AGENT-HERMES',
    name: 'Hermes',
    office: 'AI Engineering Office',
    capabilities: ['software engineering', 'platform development', 'deterministic matching'],
    status: 'ACTIVE'
  },
  {
    id: 'AIWF-CODEX-PROVIDER',
    name: 'Codex Provider Worker',
    capabilities: ['software engineering', 'platform development'],
    status: 'ACTIVE'
  }
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function assign(mission = baseMission(), workforceRegistry = baseWorkforce(), options = {}) {
  return assignAIWorkforce(mission, { workforceRegistry, ...options });
}

test('valid canonical Engineering Mission can be assessed and produces exactly one ASSIGNED result', () => {
  const result = assign();
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED);
  assert.equal(result.engineeringMissionId, 'EOS-EM-10-6-4-001');
  assert.equal(typeof result.assignmentId, 'string');
  assert.ok(result.assignmentId.startsWith('AIWA-'));
});

test('mission required capabilities are consumed and normalized deterministically', () => {
  const result = assign();
  assert.deepEqual(result.requiredCapabilities, ['software engineering', 'platform development']);
  assert.deepEqual(result.unmatchedCapabilities, []);
});

test('canonical workforce capabilities are consumed from EOS agent data', () => {
  const result = assign();
  assert.deepEqual(result.matchedCapabilities, ['software engineering', 'platform development']);
  assert.equal(result.assignedAgent, 'EOS-AGENT-HERMES');
});

test('assignment identifies canonical EOS workforce identity and ignores AIWF provider identities', () => {
  const result = assign();
  assert.match(result.assignedAgent, /^EOS-AGENT-/);
  assert.doesNotMatch(result.assignedAgent, /^AIWF-/);
  assert.equal(result.provenance.providerDispatch, false);
});

test('assignment identity is deterministic for materially identical input', () => {
  const mission = baseMission();
  const workforce = baseWorkforce();
  const first = assign(mission, workforce);
  const second = assign(clone(mission), clone(workforce));
  assert.equal(first.assignmentId, second.assignmentId);
});

test('repeated materially identical assignment produces same selected identity', () => {
  const first = assign();
  const second = assign();
  assert.equal(first.assignedAgent, second.assignedAgent);
  assert.equal(first.assignmentStatus, second.assignmentStatus);
});

test('source Engineering Mission is not mutated', () => {
  const mission = baseMission();
  const before = clone(mission);
  assign(mission);
  assert.deepEqual(mission, before);
});

test('workforce registry is not mutated', () => {
  const workforce = baseWorkforce();
  const before = clone(workforce);
  assign(baseMission(), workforce);
  assert.deepEqual(workforce, before);
});

test('missing mission identity is rejected deterministically as BLOCKED', () => {
  const mission = baseMission();
  delete mission.id;
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED);
  assert.ok(result.blockingConditions.some((condition) => condition.includes('identity')));
  assert.equal(result.engineeringMissionId, null);
});

test('missing required capability information is handled deterministically as BLOCKED', () => {
  const mission = { id: 'EOS-EM-NO-CAPS' };
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED);
  assert.ok(result.blockingConditions.some((condition) => condition.includes('required capability')));
});

test('unmatched required capability returns UNASSIGNABLE', () => {
  const mission = { ...baseMission(), requiredCapabilities: ['Quantum bridge operation'] };
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.UNASSIGNABLE);
  assert.deepEqual(result.unmatchedCapabilities, ['quantum bridge operation']);
  assert.equal(result.assignedAgent, null);
});

test('mission blockers take precedence over otherwise valid assignment', () => {
  const mission = { ...baseMission(), blockingConditions: ['Upstream eligibility is blocked.'] };
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED);
  assert.equal(result.assignedAgent, null);
});

test('candidate blockers take precedence when the satisfying canonical candidate is blocked', () => {
  const workforce = [
    {
      id: 'EOS-AGENT-BLOCKED',
      capabilities: ['software engineering', 'platform development'],
      status: 'BLOCKED'
    }
  ];
  const result = assign(baseMission(), workforce);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.BLOCKED);
  assert.ok(result.blockingConditions.length > 0);
});

test('governance review takes precedence where applicable at mission level', () => {
  const mission = { ...baseMission(), governanceState: { reviewRequired: true } };
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED);
  assert.equal(result.governanceState.reviewRequired, true);
});

test('governance review takes precedence where applicable at candidate level', () => {
  const workforce = [
    {
      id: 'EOS-AGENT-REVIEW',
      capabilities: ['software engineering', 'platform development'],
      governanceState: { reviewRequired: true },
      status: 'ACTIVE'
    }
  ];
  const result = assign(baseMission(), workforce);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.GOVERNANCE_REVIEW_REQUIRED);
  assert.equal(result.assignedAgent, 'EOS-AGENT-REVIEW');
});

test('assignment reasons explain deterministic selection', () => {
  const result = assign();
  assert.ok(Array.isArray(result.assignmentReasons));
  assert.ok(result.assignmentReasons.some((reason) => reason.includes('satisfies all required capabilities')));
  assert.ok(result.assignmentReasons.some((reason) => reason.includes('Tie breaking')));
});

test('provenance identifies Engineering Mission', () => {
  const result = assign();
  assert.equal(result.provenance.engineeringMissionId, 'EOS-EM-10-6-4-001');
  assert.equal(result.sourceIdentity, 'EOS-EM-10-6-4-001');
});

test('provenance identifies selected workforce identity', () => {
  const result = assign();
  assert.equal(result.provenance.selectedWorkforceIdentity, result.assignedAgent);
  assert.equal(result.provenance.workforceRegistry, 'backend/src/data/agents.js');
});

test('deterministic tie resolution uses stable canonical identity ordering', () => {
  const workforce = [
    {
      id: 'EOS-AGENT-ZULU',
      capabilities: ['software engineering', 'platform development'],
      status: 'ACTIVE'
    },
    {
      id: 'EOS-AGENT-ALPHA',
      capabilities: ['platform development', 'software engineering'],
      status: 'ACTIVE'
    }
  ];
  const result = assign(baseMission(), workforce);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED);
  assert.equal(result.assignedAgent, 'EOS-AGENT-ALPHA');
});

test('no provider dispatch occurs during assignment', () => {
  let dispatched = false;
  const mission = {
    ...baseMission(),
    dispatchProvider: () => {
      dispatched = true;
      throw new Error('provider dispatch must not be called');
    }
  };
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED);
  assert.equal(dispatched, false);
  assert.equal(result.provenance.providerDispatch, false);
});

test('no Engineering Mission execution occurs during assignment', () => {
  let executed = false;
  const mission = {
    ...baseMission(),
    execute: () => {
      executed = true;
      throw new Error('mission execution must not be called');
    }
  };
  const result = assign(mission);
  assert.equal(result.assignmentStatus, AI_WORKFORCE_ASSIGNMENT_STATUSES.ASSIGNED);
  assert.equal(executed, false);
  assert.equal(result.provenance.missionExecution, false);
});

test('assignment result is immutable', () => {
  const result = assign();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.provenance), true);
  assert.throws(() => {
    result.assignmentStatus = 'MUTATED';
  }, TypeError);
});

test('upstream provenance is preserved without mutating source mission', () => {
  const mission = baseMission();
  const upstreamProvenance = { orchestrationId: 'EO-10-6-3', source: 'objective-10.6.3' };
  const result = assign(mission, baseWorkforce(), { upstreamProvenance });
  assert.deepEqual(result.upstreamProvenanceReference, upstreamProvenance);
  assert.deepEqual(result.provenance.upstreamProvenance, upstreamProvenance);
});
