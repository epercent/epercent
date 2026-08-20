'use strict';

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  runGovernedEnhancementSelfBuildLoop
} from '../backend/src/services/governed-enhancement-self-build-loop-service.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createCanonicalAuthorities(overrides = {}) {
  const calls = {
    eligibility: [],
    orchestration: [],
    workforce: [],
    runtime: [],
    ledger: [],
    missionControl: [],
    completionEvidence: [],
    closure: []
  };

  const dependencies = {
    assessEnhancementEngineeringEligibility: async (input) => {
      calls.eligibility.push(clone(input));
      const source = input.source;
      if (!source || source.invalid === true) {
        return { eligible: false, status: 'ineligible', reason: 'invalid' };
      }
      if (source.blocked === true) {
        return { eligible: false, blocked: true, status: 'blocked' };
      }
      if (source.review === true) {
        return { eligible: false, governanceReviewRequired: true, status: 'governance_review_required' };
      }
      return {
        eligible: true,
        approved: true,
        status: 'eligible',
        assessmentId: `ELIGIBILITY-${source.id}`,
        sourceId: source.id,
        role: input.role
      };
    },
    orchestrateEnhancementEngineeringMission: async (input) => {
      calls.orchestration.push(clone(input));
      const source = input.source;
      return {
        orchestrationId: `ORCH-${source.id}`,
        sourceId: source.id,
        role: input.role,
        engineeringMission: {
          missionId: `ENG-${source.id}`,
          sourceId: source.id,
          objective: source.objective || source.title || 'governed enhancement'
        }
      };
    },
    assignCanonicalAIWorkforce: async (input) => {
      calls.workforce.push(clone(input));
      return {
        assignmentId: `ASSIGN-${input.engineeringMission.missionId}`,
        missionId: input.engineeringMission.missionId,
        office: 'AI Engineering Office',
        agent: 'Hermes'
      };
    },
    runAutonomousEngineeringRuntime: async (input) => {
      calls.runtime.push(clone(input));
      return {
        success: true,
        status: 'completed',
        runId: `RUNTIME-${input.engineeringMission.missionId}`,
        missionId: input.engineeringMission.missionId,
        generatedNextMission: input.generateNextMission ? { missionId: 'LEGACY-NEXT' } : null,
        completionEvidence: {
          evidenceId: `COMPLETE-${input.engineeringMission.missionId}`,
          missionId: input.engineeringMission.missionId,
          authoritative: overrides.nonAuthoritativeCompletion ? false : true,
          status: overrides.nonAuthoritativeCompletion ? 'draft' : 'mission_complete'
        }
      };
    },
    synchronizeEngineeringLedgerLifecycle: async (input) => {
      calls.ledger.push(clone(input));
      return {
        lifecycleId: `LEDGER-${input.engineeringMission.missionId}`,
        missionId: input.engineeringMission.missionId,
        status: 'synchronized'
      };
    },
    synchronizeMissionControlSelfImprovement: async (input) => {
      calls.missionControl.push(clone(input));
      return {
        synchronizationId: `MC-${input.engineeringMission.missionId}`,
        missionId: input.engineeringMission.missionId,
        ledgerLifecycleId: input.engineeringLedgerLifecycleRecord.lifecycleId,
        status: 'synchronized'
      };
    },
    requireAuthoritativeMissionCompletionEvidence: async (input) => {
      calls.completionEvidence.push(clone(input));
      return input.runtimeResult.completionEvidence;
    },
    closeEnhancementFromMissionCompletion: async (input) => {
      calls.closure.push(clone(input));
      return {
        closed: true,
        status: 'closed',
        closureId: `CLOSE-${input.source.id}-${input.engineeringMission.missionId}`,
        sourceId: input.source.id,
        missionId: input.engineeringMission.missionId,
        completionEvidenceId: input.missionCompletionEvidence.evidenceId
      };
    }
  };

  return { calls, dependencies: Object.assign(dependencies, overrides.dependencies || {}) };
}

test('valid governed source enters the canonical pipeline and closes without unauthorized continuation', async () => {
  const { calls, dependencies } = createCanonicalAuthorities();
  const source = {
    id: 'ECR-10-6-8-A',
    type: 'ECR',
    title: 'Governed self-build closure',
    objective: 'compose canonical authorities'
  };
  const originalSource = clone(source);

  const result = await runGovernedEnhancementSelfBuildLoop({ source, dependencies });

  assert.equal(result.status, 'completed');
  assert.equal(result.engineeringMission.missionId, 'ENG-ECR-10-6-8-A');
  assert.equal(result.workforceAssignment.assignmentId, 'ASSIGN-ENG-ECR-10-6-8-A');
  assert.equal(result.runtimeResult.runId, 'RUNTIME-ENG-ECR-10-6-8-A');
  assert.equal(result.runtimeResult.generatedNextMission, null);
  assert.equal(result.engineeringLedgerLifecycleRecord.lifecycleId, 'LEDGER-ENG-ECR-10-6-8-A');
  assert.equal(result.missionControlSynchronization.synchronizationId, 'MC-ENG-ECR-10-6-8-A');
  assert.equal(result.missionCompletionEvidence.authoritative, true);
  assert.equal(result.enhancementClosure.closed, true);
  assert.equal(result.continuationDecision.authorized, false);
  assert.equal(result.continuationDecision.reason, 'NO_CONTINUATION_SOURCE');
  assert.equal(result.nextEngineeringMission, null);
  assert.equal(calls.eligibility.length, 1);
  assert.equal(calls.orchestration.length, 1);
  assert.equal(calls.workforce.length, 1);
  assert.equal(calls.runtime.length, 1);
  assert.equal(calls.runtime[0].generateNextMission, false);
  assert.equal(calls.ledger.length, 1);
  assert.equal(calls.missionControl.length, 1);
  assert.equal(calls.completionEvidence.length, 1);
  assert.equal(calls.closure.length, 1);
  assert.deepEqual(source, originalSource);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.provenance), true);
  assert.equal(Object.isFrozen(result.provenance.engineeringMission), true);
  assert.equal(result.provenance.source.id, source.id);
  assert.equal(result.provenance.eligibilityAssessment.assessmentId, 'ELIGIBILITY-ECR-10-6-8-A');
  assert.equal(result.provenance.initialEngineeringOrchestration.orchestrationId, 'ORCH-ECR-10-6-8-A');
  assert.equal(result.provenance.workforceAssignment.assignmentId, 'ASSIGN-ENG-ECR-10-6-8-A');
  assert.equal(result.provenance.runtimeResult.runId, 'RUNTIME-ENG-ECR-10-6-8-A');
  assert.equal(result.provenance.engineeringLedgerLifecycleRecord.lifecycleId, 'LEDGER-ENG-ECR-10-6-8-A');
  assert.equal(result.provenance.missionControlSynchronization.synchronizationId, 'MC-ENG-ECR-10-6-8-A');
  assert.equal(result.provenance.missionCompletionEvidence.evidenceId, 'COMPLETE-ENG-ECR-10-6-8-A');
  assert.equal(result.provenance.enhancementClosure.closureId, 'CLOSE-ECR-10-6-8-A-ENG-ECR-10-6-8-A');
});

test('authoritative mission completion evidence is required before closure', async () => {
  const { calls, dependencies } = createCanonicalAuthorities({ nonAuthoritativeCompletion: true });

  await assert.rejects(
    () => runGovernedEnhancementSelfBuildLoop({
      source: { id: 'ECR-NON-AUTH', type: 'ECR', title: 'non authoritative completion' },
      dependencies
    }),
    /Authoritative mission completion evidence is required/
  );

  assert.equal(calls.runtime.length, 1);
  assert.equal(calls.ledger.length, 1);
  assert.equal(calls.missionControl.length, 1);
  assert.equal(calls.completionEvidence.length, 1);
  assert.equal(calls.closure.length, 0);
});

test('closure alone does not authorize continuation and invalid continuation produces no next mission', async () => {
  const { calls, dependencies } = createCanonicalAuthorities();

  const result = await runGovernedEnhancementSelfBuildLoop({
    source: { id: 'ECR-ORIGIN', type: 'ECR', title: 'origin' },
    continuationSource: 'not-a-governed-source',
    dependencies
  });

  assert.equal(result.status, 'completed');
  assert.equal(result.enhancementClosure.closed, true);
  assert.equal(result.continuationDecision.authorized, false);
  assert.equal(result.continuationDecision.reason, 'INVALID_CONTINUATION_SOURCE');
  assert.equal(result.nextEngineeringMission, null);
  assert.equal(calls.orchestration.length, 1);
});

test('blocked and governance-review continuation sources produce no next mission', async () => {
  for (const continuationSource of [
    { id: 'ECR-BLOCKED', type: 'ECR', blocked: true },
    { id: 'ECR-REVIEW', type: 'ECR', review: true }
  ]) {
    const { calls, dependencies } = createCanonicalAuthorities();
    const result = await runGovernedEnhancementSelfBuildLoop({
      source: { id: `ORIGIN-${continuationSource.id}`, type: 'ECR' },
      continuationSource,
      dependencies
    });

    assert.equal(result.status, 'completed');
    assert.equal(result.continuationDecision.authorized, false);
    assert.equal(result.nextEngineeringMission, null);
    assert.equal(calls.eligibility.length, 2);
    assert.equal(calls.orchestration.length, 1);
  }
});

test('eligible independently authorized continuation produces exactly one deterministic next Engineering Mission', async () => {
  const source = { id: 'ECR-INITIAL', type: 'ECR', title: 'initial' };
  const continuationSource = { id: 'ECR-CONTINUATION', type: 'ECR', title: 'next governed enhancement' };

  const first = createCanonicalAuthorities();
  const firstResult = await runGovernedEnhancementSelfBuildLoop({
    source,
    continuationSource,
    dependencies: first.dependencies
  });

  const second = createCanonicalAuthorities();
  const secondResult = await runGovernedEnhancementSelfBuildLoop({
    source: clone(source),
    continuationSource: clone(continuationSource),
    dependencies: second.dependencies
  });

  assert.equal(firstResult.continuationDecision.authorized, true);
  assert.equal(firstResult.nextEngineeringMission.missionId, 'ENG-ECR-CONTINUATION');
  assert.equal(first.calls.orchestration.length, 2);
  assert.equal(first.calls.runtime.length, 1);
  assert.equal(first.calls.runtime[0].generateNextMission, false);
  assert.deepEqual(firstResult.nextEngineeringMission, secondResult.nextEngineeringMission);
  assert.equal(secondResult.continuationDecision.nextEngineeringMission.missionId, 'ENG-ECR-CONTINUATION');
  assert.equal(firstResult.provenance.continuationSource.id, 'ECR-CONTINUATION');
  assert.equal(firstResult.provenance.nextEngineeringMission.missionId, 'ENG-ECR-CONTINUATION');
});

test('ineligible originating source stops downstream progression', async () => {
  const { calls, dependencies } = createCanonicalAuthorities();
  const result = await runGovernedEnhancementSelfBuildLoop({
    source: { id: 'ECR-INELIGIBLE', type: 'ECR', invalid: true },
    dependencies
  });

  assert.equal(result.status, 'rejected');
  assert.equal(result.reason, 'SOURCE_NOT_ENGINEERING_ELIGIBLE');
  assert.equal(result.nextEngineeringMission, null);
  assert.equal(calls.eligibility.length, 1);
  assert.equal(calls.orchestration.length, 0);
  assert.equal(calls.workforce.length, 0);
  assert.equal(calls.runtime.length, 0);
  assert.equal(calls.ledger.length, 0);
  assert.equal(calls.missionControl.length, 0);
  assert.equal(calls.closure.length, 0);
});

test('orchestrator remains a thin layer and introduces no second autonomous runtime boundary implementation', () => {
  const servicePath = new URL(
    '../backend/src/services/governed-enhancement-self-build-loop-service.js',
    import.meta.url
  );
  const content = fs.readFileSync(servicePath, 'utf8');

  assert.match(content, /runAutonomousEngineeringRuntime/);
  assert.match(content, /generateNextMission:\s*false/);
  assert.doesNotMatch(content, /require\(['"]node:child_process['"]\)/);
  assert.doesNotMatch(content, /require\(['"]child_process['"]\)/);
  assert.doesNotMatch(content, /simple-git/);
  assert.doesNotMatch(content, /createCommit\s*\(/);
  assert.doesNotMatch(content, /push\s*\(/);
  assert.doesNotMatch(content, /dispatchProvider\s*\(/);
  assert.doesNotMatch(content, /generateEngineeringPackage\s*\(/);
});
