import {
  digitalEnterpriseValuation,
  digitalTwinAssets,
  dtaMonitoring,
  enterpriseStrategy,
  governanceCouncil,
  secondBalanceSheet
} from '../data/strategy.js';
import { strategicAlignment } from '../data/strategic-alignment.js';
import { getMasterRoadmap } from './pmo-service.js';
import { findRecordById, listRecords } from './storage-service.js';

export function getEnterpriseStrategy() {
  return listRecords('enterprise-strategy', [enterpriseStrategy])[0] ?? enterpriseStrategy;
}

export function getGovernanceCouncil() {
  return listRecords('governance-council', [governanceCouncil])[0] ?? governanceCouncil;
}

export function getDigitalEnterpriseValuation() {
  return listRecords('valuation-models', [digitalEnterpriseValuation])[0] ?? digitalEnterpriseValuation;
}

export function getSecondBalanceSheet() {
  return listRecords('second-balance-sheet', [secondBalanceSheet])[0] ?? secondBalanceSheet;
}

export function getDtaMonitoring() {
  return listRecords('dta-monitoring', [dtaMonitoring])[0] ?? dtaMonitoring;
}

export function listDigitalTwinAssets() {
  return listRecords('digital-twin-assets', digitalTwinAssets);
}

export function getDigitalTwinAssetById(id) {
  return findRecordById('digital-twin-assets', id, digitalTwinAssets);
}

export function getStrategicAlignment() {
  return listRecords('strategic-alignment', [strategicAlignment])[0] ?? strategicAlignment;
}

export function getRoadmapAlignment() {
  const roadmap = getMasterRoadmap();

  return roadmap.programs.map((program) => ({
    id: program.id,
    name: program.name,
    strategicObjective: program.strategicObjective,
    businessPlanAlignment: program.businessPlanAlignment,
    governanceApprovalStatus: program.governanceApprovalStatus,
    investorRelevance: program.investorRelevance,
    enterpriseValueContribution: program.enterpriseValueContribution,
    secondBalanceSheetImpact: program.secondBalanceSheetImpact,
    executiveOwner: program.executiveOwner,
    progress: program.progress
  }));
}

export function getStrategyLayerSummary() {
  const strategy = getEnterpriseStrategy();
  const governance = getGovernanceCouncil();
  const valuation = getDigitalEnterpriseValuation();
  const balanceSheet = getSecondBalanceSheet();
  const monitoring = getDtaMonitoring();
  const assets = listDigitalTwinAssets();

  return {
    capability: 'EOS-CAP-0026',
    strategy,
    governance,
    valuation,
    secondBalanceSheet: balanceSheet,
    dtaMonitoring: monitoring,
    digitalTwinAssets: assets,
    strategicAlignment: getStrategicAlignment(),
    roadmapAlignment: getRoadmapAlignment(),
    investorReadinessNotes: [
      'Strategy, governance, valuation, and DTA monitoring are aligned for executive review.',
      'Valuation values are internal estimates only and are not audited or financial advice.',
      'Second Balance Sheet metrics require governance approval before external use.'
    ]
  };
}
