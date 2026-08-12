import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import auditRoutes from './routes/audit.routes.js';
import aiDevelopmentOfficeRoutes from './routes/ai-development-office.routes.js';
import assignmentEngineRoutes from './routes/assignment-engine.routes.js';
import aiProviderGatewayRoutes from './routes/ai-provider-gateway.routes.js';
import aiWorkforceMembersRoutes from './routes/ai-workforce-members.routes.js';
import capabilityResolverRoutes from './routes/capability-resolver.routes.js';
import engineeringMissionOrchestratorRoutes from './routes/engineering-mission-orchestrator.routes.js';
import providerDispatchRoutes from './routes/provider-dispatch.routes.js';
import sprintReportRoutes from './routes/sprint-report.routes.js';
import decisionIntelligenceRoutes from './routes/decision-intelligence.routes.js';
import agentsRoutes from './routes/agents.routes.js';
import {
  knowledgeObjectsRouter,
  repositoriesRouter
} from './routes/agent-knowledge-repositories.routes.js';
import eventsRoutes from './routes/events.routes.js';
import {
  digitalTwinHomeRouter,
  enterpriseTelemetryRouter,
  enterpriseVisualsRouter,
  masterMonitoringRouter
} from './routes/enterprise-visuals.routes.js';
import executiveActionsRoutes from './routes/executive-actions.routes.js';
import engineeringCoordinationRoutes from './routes/engineering-coordination.routes.js';
import enterpriseControlSummaryRoutes from './routes/enterprise-control-summary.routes.js';
import developmentIntelligenceRoutes from './routes/development-intelligence.routes.js';
import autonomousMissionLoopRoutes from './routes/autonomous-mission-loop.routes.js';
import engineeringLedgerRoutes from './routes/engineering-ledger.routes.js';
import missionPackageRoutes from './routes/mission-package.routes.js';
import missionGeneratorRoutes from './routes/mission-generator.routes.js';
import missionQueueRoutes from './routes/mission-queue.routes.js';
import executiveCouncilRoutes from './routes/executive-council.routes.js';
import executiveOfficesRoutes from './routes/executive-offices.routes.js';
import {
  identityMediaRouter,
  organizationIntakeRouter,
  repositoryLinksRouter,
  startupRouter
} from './routes/identity-intake.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import enterpriseKnowledgeObjectsRoutes from './routes/enterprise-knowledge-objects.routes.js';
import enterpriseDiscoveryOrchestratorRoutes from './routes/enterprise-discovery-orchestrator.routes.js';
import enterpriseDiscoveryRegistryRoutes from './routes/enterprise-discovery-registry.routes.js';
import enterpriseIntelligencePipelineRoutes from './routes/enterprise-intelligence-pipeline.routes.js';
import enterpriseIntelligencePipelineRuntimeRoutes from './routes/enterprise-intelligence-pipeline-runtime.routes.js';
import enterpriseIntelligencePipelineRunRegistryRoutes from './routes/enterprise-intelligence-pipeline-run-registry.routes.js';
import enterpriseMissionRegistryRoutes from './routes/enterprise-mission-registry.routes.js';
import kernelRoutes from './routes/kernel.routes.js';
import objectsRoutes from './routes/objects.routes.js';
import {
  dataFeedRequirementsRouter,
  digitalMirrorsRouter,
  dtaCandidatesRouter,
  humanValidationRouter,
  onboardingAssimilationRouter,
  onboardingRouter
} from './routes/onboarding.routes.js';
import pmoRoutes from './routes/pmo.routes.js';
import {
  adminActionsRouter,
  agentActivityRouter,
  agentAttentionRouter,
  agentCalendarRouter,
  agentMessagesRouter,
  platformRouter
} from './routes/platform-operations.routes.js';
import statusRoutes from './routes/status.routes.js';
import runtimeEnvironmentValidationRoutes from './routes/runtime-environment-validation.routes.js';
import storageRoutes from './routes/storage.routes.js';
import {
  digitalTwinAssetsRouter,
  governanceRouter,
  secondBalanceSheetRouter,
  strategicAlignmentRouter,
  strategicLayerRouter,
  strategyRouter,
  valuationRouter
} from './routes/strategy.routes.js';
import workflowsRoutes from './routes/workflows.routes.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { bootstrapStorage } from './services/storage-bootstrap.js';
import { ensureIdentityRepositoryDirectories, identityMediaDir } from './services/identity-intake-service.js';

export function createApp() {
  bootstrapStorage();
  ensureIdentityRepositoryDirectories();

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(morgan('combined'));
  app.use('/media', (_request, response, next) => {
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(identityMediaDir));

  app.use('/api/audit', auditRoutes);
  app.use('/api/ai-development-office', aiDevelopmentOfficeRoutes);
  app.use('/api/assignment-engine', assignmentEngineRoutes);
  app.use('/api/ai-provider-gateway', aiProviderGatewayRoutes);
  app.use('/api/ai-workforce-members', aiWorkforceMembersRoutes);
  app.use('/api/capability-resolver', capabilityResolverRoutes);
  app.use('/api/engineering-mission-orchestrator', engineeringMissionOrchestratorRoutes);
  app.use('/api/provider-dispatch', providerDispatchRoutes);
  app.use('/api/sprint-report', sprintReportRoutes);
  app.use('/api/decision-intelligence', decisionIntelligenceRoutes);
  app.use('/api/agents', agentsRoutes);
  app.use('/api/admin-actions', adminActionsRouter);
  app.use('/api/agent-activity', agentActivityRouter);
  app.use('/api/agent-attention', agentAttentionRouter);
  app.use('/api/agent-calendar', agentCalendarRouter);
  app.use('/api/agent-messages', agentMessagesRouter);
  app.use('/api/master-monitoring', masterMonitoringRouter);
  app.use('/api/enterprise-visuals', enterpriseVisualsRouter);
  app.use('/api/enterprise-telemetry', enterpriseTelemetryRouter);
  app.use('/api/digital-twin-home', digitalTwinHomeRouter);
  app.use('/api/events', eventsRoutes);
  app.use('/api/executive-actions', executiveActionsRoutes);
  app.use('/api/engineering-coordination', engineeringCoordinationRoutes);
  app.use('/api/enterprise-control-summary', enterpriseControlSummaryRoutes);
  app.use('/api/development-intelligence', developmentIntelligenceRoutes);
  app.use('/api/autonomous-mission-loop', autonomousMissionLoopRoutes);
  app.use('/api/engineering-ledger', engineeringLedgerRoutes);
  app.use('/api/mission-package', missionPackageRoutes);
  app.use('/api/mission-generator', missionGeneratorRoutes);
  app.use('/api/mission-queue', missionQueueRoutes);
  app.use('/api/executive-council', executiveCouncilRoutes);
  app.use('/api/executive-offices', executiveOfficesRoutes);
  app.use('/api/identity-media', identityMediaRouter);
  app.use('/api/kernel', kernelRoutes);
  app.use('/api/knowledge', knowledgeRoutes);
  app.use('/api/enterprise-knowledge-objects', enterpriseKnowledgeObjectsRoutes);
  app.use('/api/enterprise-discovery', enterpriseDiscoveryOrchestratorRoutes);
  app.use('/api/enterprise-discovery-registry', enterpriseDiscoveryRegistryRoutes);
  app.use('/api/enterprise-intelligence-pipeline', enterpriseIntelligencePipelineRoutes);
  app.use('/api/enterprise-intelligence-pipeline-runtime', enterpriseIntelligencePipelineRuntimeRoutes);
  app.use('/api/enterprise-intelligence-pipeline-run-registry', enterpriseIntelligencePipelineRunRegistryRoutes);
  app.use('/api/enterprise-mission-registry', enterpriseMissionRegistryRoutes);
  app.use('/api/knowledge-objects', knowledgeObjectsRouter);
  app.use('/api/knowledge-repositories', repositoriesRouter);
  app.use('/api/onboarding', onboardingRouter);
  app.use('/api/onboarding-assimilation', onboardingAssimilationRouter);
  app.use('/api/digital-mirrors', digitalMirrorsRouter);
  app.use('/api/dta-candidates', dtaCandidatesRouter);
  app.use('/api/data-feed-requirements', dataFeedRequirementsRouter);
  app.use('/api/human-validation', humanValidationRouter);
  app.use('/api/pmo', pmoRoutes);
  app.use('/api/platform', platformRouter);
  app.use('/api/organization-intake', organizationIntakeRouter);
  app.use('/api/repository-links', repositoryLinksRouter);
  app.use('/api/strategy', strategyRouter);
  app.use('/api/governance', governanceRouter);
  app.use('/api/valuation', valuationRouter);
  app.use('/api/second-balance-sheet', secondBalanceSheetRouter);
  app.use('/api/digital-twin-assets', digitalTwinAssetsRouter);
  app.use('/api/strategic-layer', strategicLayerRouter);
  app.use('/api/strategic-alignment', strategicAlignmentRouter);
  app.use('/api/startup', startupRouter);
  app.use('/api/status', statusRoutes);
  app.use('/api/runtime/environment-validation', runtimeEnvironmentValidationRoutes);
  app.use('/api/storage', storageRoutes);
  app.use('/api/objects', objectsRoutes);
  app.use('/api/workflows', workflowsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
