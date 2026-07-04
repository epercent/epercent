import {
  apiCoverage,
  auditLiveStatus,
  auditQualityGates,
  auditStatusTaxonomy,
  capabilityReadinessMatrix,
  frontendRouteCoverage,
  placeholderRegister,
  readinessScores,
  recommendedBuildSequence,
  technicalDebtRegister
} from '../data/audit.js';
import { listAgentKnowledgeObjects } from './agent-knowledge-repository-service.js';
import { listAgents } from './agent-service.js';
import { listEnterpriseObjects } from './enterprise-object-registry.js';
import { listEvents } from './event-service.js';
import { listWorkflows } from './workflow-service.js';
import { getStorageHealthReport } from './storage-service.js';
import { expectedStorageCollections } from './storage-bootstrap.js';

const auditVersion = '0.25.0';

function countBy(items, fieldName) {
  return items.reduce((counts, item) => {
    const key = item[fieldName] ?? 'Pending Assessment';
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function readinessByStage(stage) {
  return readinessScores.find((score) => score.stage === stage) ?? null;
}

export function getAuditReport() {
  const enterpriseObjects = listEnterpriseObjects();
  const agents = listAgents();
  const knowledgeObjects = listAgentKnowledgeObjects();
  const workflows = listWorkflows();
  const events = listEvents();
  const storageHealth = getStorageHealthReport(expectedStorageCollections);
  const capabilityCounts = countBy(capabilityReadinessMatrix, 'functionalStatus');
  const apiCounts = countBy(apiCoverage, 'status');
  const routeCounts = countBy(frontendRouteCoverage, 'status');
  const technicalDebtCounts = countBy(technicalDebtRegister, 'severity');
  const placeholderCounts = countBy(placeholderRegister, 'status');

  return {
    capability: 'EOS-CAP-0033',
    auditId: 'EOS-AUDIT-READINESS-001',
    auditName: 'EOS Platform Audit & Capability Readiness Report',
    auditVersion,
    generatedAt: new Date().toISOString(),
    owner: 'Codex',
    status: 'Operational',
    summary: {
      overallStatus: 'Operational Foundation',
      capabilitiesAudited: capabilityReadinessMatrix.length,
      fullyFunctional: capabilityCounts['Fully Functional'] ?? 0,
      operationalFoundations: capabilityCounts['Operational Foundation'] ?? 0,
      displayOnly: capabilityCounts['Display Only'] ?? 0,
      partial: capabilityCounts.Partial ?? 0,
      placeholders: capabilityCounts.Placeholder ?? 0,
      broken: capabilityCounts.Broken ?? 0,
      notStarted: capabilityCounts['Not Started'] ?? 0,
      apiGroupsAudited: apiCoverage.length,
      frontendWorkspacesAudited: frontendRouteCoverage.length,
      enterpriseObjects: enterpriseObjects.length,
      agents: agents.length,
      knowledgeObjects: knowledgeObjects.length,
      workflows: workflows.length,
      events: events.length,
      storageCollections: storageHealth.collectionsFound.length,
      storageWarnings: storageHealth.warnings.length,
      alphaReadiness: readinessByStage('Alpha')?.score ?? 0,
      betaReadiness: readinessByStage('Beta')?.score ?? 0,
      versionOneReadiness: readinessByStage('Version 1.0')?.score ?? 0,
      topRisk: 'EOS has broad local read and display capability, but production readiness depends on governed writes, restore validation, security, connectors, and executable workflows.',
      recommendedNextProgram: 'Enterprise Data Ingestion & Governed Execution Foundation',
      recommendedNextAction: 'Build Data Source Connector Framework, then AI Extraction & Enterprise Object Generation, then Persistent Write API & Governance Audit Ledger.'
    },
    statusTaxonomy: auditStatusTaxonomy,
    capabilityReadinessMatrix,
    capabilityStatusCounts: capabilityCounts,
    apiCoverage,
    apiStatusCounts: apiCounts,
    frontendRouteCoverage,
    frontendRouteStatusCounts: routeCounts,
    dataPersistenceHealth: {
      storageStatus: storageHealth.storageStatus,
      collectionsFound: storageHealth.collectionsFound,
      collectionsMissing: storageHealth.collectionsMissing,
      recordCounts: storageHealth.recordCounts,
      lastUpdated: storageHealth.lastUpdated,
      snapshotCount: storageHealth.snapshotCount,
      warnings: storageHealth.warnings
    },
    placeholderRegister,
    placeholderCounts,
    technicalDebtRegister,
    technicalDebtCounts,
    readinessScores,
    qualityGates: auditQualityGates,
    recommendedBuildSequence,
    auditNotes: [
      'The audit classifies local functionality, not production fitness.',
      'Display-only and placeholder items are intentional safety controls where execution would require permissions, persistence, security, or external integration.',
      'No Broken items are currently registered by the audit model; browser-based probing should be added to validate UI flows such as upload preview and presentation mode.'
    ],
    liveStatus: auditLiveStatus
  };
}
