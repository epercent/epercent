import { getOnboardingOverview } from './onboarding-service.js'
import { listEnterpriseKnowledgeObjects } from './enterprise-knowledge-object-service.js'
import { listWorkflows } from './workflow-service.js'
import { getMissionQueue } from './mission-queue-service.js'
import { buildMissionControlRuntime } from './mission-control-runtime-service.js'
import { buildOpportunityAssessment } from './opportunity-assessment-service.js'
import { buildAiWorkforceRecommendation } from './ai-workforce-recommendation-service.js'
import { buildDigitalTwinPlaceholder } from './digital-twin-placeholder-service.js'
import { buildSecondBalanceSheetSignal } from './second-balance-sheet-signal-service.js'
import { discoverWebsite } from './website-discovery-service.js'

function classifySource(source) {
  if (!source) return 'Unknown'
  if (String(source).startsWith('http')) return 'Website'
  if (String(source).includes('linkedin.com')) return 'LinkedIn'
  if (String(source).endsWith('.pdf')) return 'Document'
  return 'Manual'
}

export async function runEnterpriseDiscovery({ source, entityType = 'Enterprise', name = 'Unknown Entity' } = {}) {
  const sourceType = classifySource(source)
  const websiteDiscovery = sourceType === 'Website' ? await discoverWebsite(source) : null
  const onboarding = getOnboardingOverview()
  const knowledge = listEnterpriseKnowledgeObjects()
  const workflows = listWorkflows()
  const missionQueue = getMissionQueue()

  const profile = {
    id: `DIP-${Date.now()}`,
    type: 'Digital Intelligence Profile',
    entityType,
    name,
    source,
    sourceType,
    status: 'Generated',
    confidenceScore: websiteDiscovery?.confidenceScore ?? (source ? 62 : 25),
    websiteDiscovery,
    intelligenceSummary: websiteDiscovery?.title
      ? `${name} has an initial Digital Intelligence Profile generated from live website discovery: ${websiteDiscovery.title}.`
      : `${name} has an initial Digital Intelligence Profile generated from ${sourceType} discovery.`,
    discoveredSignals: [
      'Identity signal',
      'Knowledge signal',
      'Onboarding signal',
      'Workflow signal',
      'Mission readiness signal'
    ],
    reusablePlatformCapabilities: {
      onboardingRecords: onboarding.summary?.onboardingRecords ?? 0,
      knowledgeObjects: knowledge.count ?? 0,
      workflows: workflows.length ?? 0,
      queuedMissions: missionQueue.totalMissions ?? 0
    },
    missingInformation: [
      'Verified financial statements',
      'Leadership profile',
      'Products and services',
      'Operating locations',
      'Connected enterprise systems'
    ],
    recommendedNextActions: [
      'Validate identity',
      'Upload supporting documents',
      'Connect approved data sources',
      'Generate initial Mission Control view',
      'Recommend AI Workforce actions'
    ]
  }

  const opportunityAssessment = buildOpportunityAssessment(profile)
  const aiWorkforceRecommendation = buildAiWorkforceRecommendation(profile, opportunityAssessment)
  const digitalTwinPlaceholder = buildDigitalTwinPlaceholder(profile, opportunityAssessment, aiWorkforceRecommendation)
  const secondBalanceSheetSignal = buildSecondBalanceSheetSignal(profile, opportunityAssessment, digitalTwinPlaceholder)

  const missionControlRuntime = buildMissionControlRuntime({
    profile,
    websiteDiscovery,
    opportunityAssessment,
    aiWorkforceRecommendation,
    digitalTwinPlaceholder,
    secondBalanceSheetSignal
  })

  return {
    orchestrator: {
      id: 'EOS-ENTERPRISE-DISCOVERY-ORCHESTRATOR',
      version: '0.2.0',
      status: 'MISSION_CONTROL_READY'
    },
    input: { source, entityType, name },
    profile,
    websiteDiscovery,
    opportunityAssessment,
    aiWorkforceRecommendation,
    digitalTwinPlaceholder,
    secondBalanceSheetSignal,
    missionControlRuntime,
    nextStage: 'Mission Control'
  }
}
