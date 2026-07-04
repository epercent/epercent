import {
  getDigitalEnterpriseValuation,
  getDigitalTwinAssetById,
  getDtaMonitoring,
  getEnterpriseStrategy,
  getGovernanceCouncil,
  getRoadmapAlignment,
  getSecondBalanceSheet,
  getStrategicAlignment,
  getStrategyLayerSummary,
  listDigitalTwinAssets
} from '../services/strategy-service.js';

export function getStrategy(_request, response) {
  response.status(200).json({
    capability: 'EOS-CAP-0026',
    strategy: getEnterpriseStrategy(),
    roadmapAlignment: getRoadmapAlignment()
  });
}

export function getGovernance(_request, response) {
  response.status(200).json({
    capability: 'EOS-CAP-0026',
    governance: getGovernanceCouncil()
  });
}

export function getValuation(_request, response) {
  response.status(200).json({
    capability: 'EOS-CAP-0026',
    valuation: getDigitalEnterpriseValuation()
  });
}

export function getSecondBalanceSheetOverview(_request, response) {
  response.status(200).json({
    capability: 'EOS-CAP-0026',
    secondBalanceSheet: getSecondBalanceSheet()
  });
}

export function listDtas(_request, response) {
  const assets = listDigitalTwinAssets();

  response.status(200).json({
    capability: 'EOS-CAP-0026',
    monitoring: getDtaMonitoring(),
    count: assets.length,
    assets
  });
}

export function getDta(request, response) {
  const asset = getDigitalTwinAssetById(request.params.id);

  if (!asset) {
    return response.status(404).json({
      error: 'Digital Twin Asset not found',
      id: request.params.id
    });
  }

  return response.status(200).json(asset);
}

export function getStrategicLayer(_request, response) {
  response.status(200).json(getStrategyLayerSummary());
}

export function getStrategicAlignmentOverview(_request, response) {
  const alignment = getStrategicAlignment();

  response.status(200).json({
    capability: 'EOS-CAP-0029',
    strategicAlignment: alignment,
    investmentThesis: alignment.thesis,
    technologyFlywheel: alignment.technologyFlywheel,
    threeHorizonRoadmap: alignment.threeHorizonRoadmap,
    revenueEngine: alignment.revenueEngine,
    dtaLifecycle: alignment.dtaLifecycle,
    kipr: alignment.kipr,
    enterpriseProfile: alignment.enterpriseProfile,
    industryFramework: alignment.industryFramework,
    readinessAssessments: alignment.readinessAssessments
  });
}
