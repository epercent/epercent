function clampScore(value, fallback = 0) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, number));
}

function commercialScoreFromValue(value) {
  const amount = Number(value ?? 0);

  if (amount >= 10000000) return 95;
  if (amount >= 1000000) return 85;
  if (amount >= 250000) return 70;
  if (amount > 0) return 55;

  return 30;
}

function determineAuthority(request) {
  const approvalRequired =
    Boolean(request.humanApprovalRequired) ||
    ['Executive', 'Board', 'Investment Committee', 'Legal'].includes(request.authorityLevel) ||
    Number(request.estimatedCommercialValue ?? 0) >= 250000 ||
    Number(request.ethicalRisk ?? 0) >= 40;

  if (approvalRequired) {
    return 'Human Approval Required';
  }

  return 'Autonomous Execution Permitted';
}

function determineDecision({ approvalRequired, ethicalScore, riskScore, confidence }) {
  if (ethicalScore < 50 || riskScore > 75) {
    return 'Do Not Proceed';
  }

  if (approvalRequired) {
    return 'Proceed with Approval';
  }

  if (confidence >= 70) {
    return 'Proceed';
  }

  return 'Request More Information';
}

export function assessDecision(request = {}) {
  const strategicScore = clampScore(request.estimatedStrategicValue, 50);
  const commercialScore = commercialScoreFromValue(request.estimatedCommercialValue);
  const ethicalRisk = clampScore(request.ethicalRisk, 0);
  const ethicalScore = 100 - ethicalRisk;
  const riskScore = clampScore(request.riskScore ?? ethicalRisk, ethicalRisk);
  const authority = determineAuthority(request);
  const approvalRequired = authority === 'Human Approval Required';

  const confidence = Math.round(
    strategicScore * 0.3 +
    commercialScore * 0.3 +
    ethicalScore * 0.25 +
    (100 - riskScore) * 0.15
  );

  const decision = determineDecision({
    approvalRequired,
    ethicalScore,
    riskScore,
    confidence
  });

  const reasoning = [];

  reasoning.push(`Strategic value assessed at ${strategicScore}/100.`);
  reasoning.push(`Commercial value assessed at ${commercialScore}/100.`);
  reasoning.push(`Ethical score assessed at ${ethicalScore}/100.`);
  reasoning.push(`Risk score assessed at ${riskScore}/100.`);
  reasoning.push(authority);

  return {
    capability: 'EOS-DECISION-INTELLIGENCE-001',
    engine: 'Decision Intelligence Engine',
    version: '0.1',
    action: request.action ?? 'Unspecified Action',
    requester: request.requester ?? 'Unspecified Requester',
    enterprise: request.enterprise ?? 'Unspecified Enterprise',
    decision,
    confidence,
    scores: {
      strategic: strategicScore,
      commercial: commercialScore,
      ethical: ethicalScore,
      risk: riskScore
    },
    authority,
    humanApprovalRequired: approvalRequired,
    reasoning,
    assessedAt: new Date().toISOString()
  };
}

export function getDecisionIntelligenceStatus() {
  return {
    capability: 'EOS-DECISION-INTELLIGENCE-001',
    engine: 'Decision Intelligence Engine',
    version: '0.1',
    status: 'Operational Foundation',
    mode: 'Deterministic Rules',
    purpose: 'Evaluate proposed EOS actions for value, risk, ethics, authority, and human approval requirements.',
    supportedAssessments: [
      'strategicValue',
      'commercialValue',
      'ethicalRisk',
      'authority',
      'risk',
      'confidence',
      'recommendation'
    ]
  };
}
