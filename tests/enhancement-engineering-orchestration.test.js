import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ASSESSMENT_EXECUTION_COMPLETED,
  ENGINEERING_ELIGIBILITY_DECISION_ELIGIBLE,
  AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE,
  getAuthoritativeEnhancementEngineeringIntersectionSource,
  runEnhancementEngineeringOrchestration
} from '../backend/src/services/enhancement-engineering-orchestration-service.js';
import { assessEnhancementEngineeringEligibility } from '../backend/src/services/enhancement-engineering-eligibility-service.js';
import { generateEngineeringMissionFromEnhancementEcr } from '../backend/src/services/mission-generator-service.js';

const expectedAuthoritativeSource = Object.freeze({
  id: 'ECR-10-6-3-CANONICAL-001',
  sourceId: 'ECR-10-6-3-CANONICAL-001',
  type: 'ENHANCEMENT_ECR',
  title: 'Governed Enhancement-to-Engineering orchestration',
  description: 'Create a governed orchestration path from an eligible Enhancement/ECR into exactly one canonical Engineering Mission.',
  objective: 'Prove governed Enhancement/ECR to Engineering Mission orchestration.',
  priority: 'Critical',
  status: 'Approved',
  affectedAreas: [
    'backend/src/services/enhancement-engineering-orchestration-service.js',
    'tests/enhancement-engineering-orchestration.test.js'
  ],
  acceptanceCriteria: [
    'Canonical Objective 10.6.2 assessment returns ELIGIBLE.',
    'Canonical Objective 10.6.1 bridge accepts the same source.',
    'Exactly one deterministic Engineering Mission is generated.'
  ],
  governanceApproval: {
    status: 'APPROVED',
    recognized: true,
    authority: 'Governance Office',
    reference: 'GOV-10.6.3-CANONICAL-001'
  }
});

function normalizeBridgeMissions(bridgeResult) {
  if (bridgeResult === undefined || bridgeResult === null) {
    return [];
  }

  if (Array.isArray(bridgeResult)) {
    return bridgeResult;
  }

  if (Array.isArray(bridgeResult.engineeringMissions)) {
    return bridgeResult.engineeringMissions;
  }

  if (Array.isArray(bridgeResult.missions)) {
    return bridgeResult.missions;
  }

  if (bridgeResult.engineeringMission) {
    return [bridgeResult.engineeringMission];
  }

  if (bridgeResult.mission) {
    return [bridgeResult.mission];
  }

  if (bridgeResult.generatedMission) {
    return [bridgeResult.generatedMission];
  }

  return [bridgeResult];
}

function missionIdentity(mission) {
  return mission?.missionId
    ?? mission?.id
    ?? mission?.sourceId
    ?? mission?.title
    ?? JSON.stringify(mission);
}

test('Objective 10.6.3 preserves the exact authoritative intersection source', () => {
  assert.deepStrictEqual(
    AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE,
    expectedAuthoritativeSource
  );

  assert.deepStrictEqual(
    getAuthoritativeEnhancementEngineeringIntersectionSource(),
    expectedAuthoritativeSource
  );

  assert.equal(Object.isFrozen(AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE), true);
  assert.equal(Object.isFrozen(AUTHORITATIVE_ENHANCEMENT_ENGINEERING_INTERSECTION_SOURCE.governanceApproval), true);
});

test('Objective 10.6.2 canonical contract returns completed execution and eligible decision for the authoritative source', async () => {
  const assessment = await assessEnhancementEngineeringEligibility(
    getAuthoritativeEnhancementEngineeringIntersectionSource()
  );

  assert.equal(assessment.assessmentStatus, ASSESSMENT_EXECUTION_COMPLETED);
  assert.equal(assessment.decision, ENGINEERING_ELIGIBILITY_DECISION_ELIGIBLE);
  assert.deepStrictEqual(assessment.failedRequirements, []);
});

test('default orchestration completes, reports ELIGIBLE decision, and generates exactly one Engineering Mission', async () => {
  const orchestration = await runEnhancementEngineeringOrchestration();

  assert.equal(orchestration.status, 'COMPLETED');
  assert.equal(orchestration.assessmentStatus, 'COMPLETED');
  assert.equal(orchestration.eligibilityDecision, 'ELIGIBLE');
  assert.equal(orchestration.decision, 'ELIGIBLE');
  assert.deepStrictEqual(orchestration.failedRequirements, []);
  assert.equal(orchestration.missionGenerated, true);
  assert.equal(orchestration.generatedMissionCount, 1);
  assert.equal(orchestration.engineeringMissions.length, 1);
  assert.deepStrictEqual(orchestration.engineeringMission, orchestration.engineeringMissions[0]);
  assert.deepStrictEqual(orchestration.mission, orchestration.engineeringMissions[0]);
});

test('orchestrated mission identity equals the direct canonical Objective 10.6.1 bridge identity', async () => {
  const source = getAuthoritativeEnhancementEngineeringIntersectionSource();
  const directBridgeResult = await generateEngineeringMissionFromEnhancementEcr(source);
  const directMissions = normalizeBridgeMissions(directBridgeResult);

  assert.equal(directMissions.length, 1);

  const orchestration = await runEnhancementEngineeringOrchestration(source);

  assert.equal(orchestration.engineeringMissions.length, 1);
  assert.equal(
    missionIdentity(orchestration.engineeringMissions[0]),
    missionIdentity(directMissions[0])
  );
});

test('orchestration preserves explicit provenance lineage and immutable result boundaries', async () => {
  const orchestration = await runEnhancementEngineeringOrchestration();

  assert.equal(Object.isFrozen(orchestration), true);
  assert.equal(Object.isFrozen(orchestration.source), true);
  assert.equal(Object.isFrozen(orchestration.provenance), true);
  assert.equal(Object.isFrozen(orchestration.provenance.lineage), true);

  assert.equal(orchestration.provenance.objective, '10.6.3');
  assert.equal(orchestration.provenance.sourceId, 'ECR-10-6-3-CANONICAL-001');
  assert.deepStrictEqual(
    orchestration.provenance.lineage.map((entry) => entry.objective),
    ['10.6.2', '10.6.1']
  );
  assert.equal(
    orchestration.provenance.lineage[0].resultContract.assessmentExecutionField,
    'assessmentStatus'
  );
  assert.equal(
    orchestration.provenance.lineage[0].resultContract.eligibilityDecisionField,
    'decision'
  );
});

test('orchestration implementation consumes canonical fields and avoids legacy eligibility aliases', async () => {
  const serviceContent = await readFile(
    new URL('../backend/src/services/enhancement-engineering-orchestration-service.js', import.meta.url),
    'utf8'
  );

  assert.match(serviceContent, /assessEnhancementEngineeringEligibility/);
  assert.match(serviceContent, /generateEngineeringMissionFromEnhancementEcr/);
  assert.match(serviceContent, /assessment\.assessmentStatus/);
  assert.match(serviceContent, /assessment\.decision/);

  const forbiddenLegacyExecutionAlias = ['assessment', 'status'].join('.');
  const forbiddenLegacyEligibilityAlias = ['assessment', 'eligible'].join('.');
  const forbiddenLegacyBooleanAlias = ['assessment', 'isEligible'].join('.');

  assert.equal(serviceContent.includes(forbiddenLegacyExecutionAlias), false);
  assert.equal(serviceContent.includes(forbiddenLegacyEligibilityAlias), false);
  assert.equal(serviceContent.includes(forbiddenLegacyBooleanAlias), false);
  assert.equal(serviceContent.includes('generateEngineeringMissions'), false);
});
