import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { agentKnowledgeObjects, agentKnowledgeRepositories } from '../data/agent-knowledge-repositories.js';
import { agents } from '../data/agents.js';
import { enterpriseObjects } from '../data/enterprise-objects.js';
import { EVENT_TYPES, events } from '../data/events.js';
import {
  digitalTwinGenerationWorkflows,
  digitalTwinHomes,
  enterpriseArchitectureLayers,
  enterpriseTelemetry,
  enterpriseVisuals,
  masterMonitoring
} from '../data/enterprise-visuals.js';
import { executiveActions } from '../data/executive-actions.js';
import {
  ceoCockpit,
  digitalEnterpriseHeadquarters,
  executiveCouncil,
  executiveProfiles
} from '../data/executive-council.js';
import {
  executiveOfficeFramework,
  executiveOffices
} from '../data/executive-offices.js';
import {
  mediaAssets,
  mediaExtractionRules,
  organizationIntakeRecords,
  organizationRepositoryLinks,
  profileIdentities,
  startupExperience
} from '../data/identity-intake.js';
import { knowledgeObjects } from '../data/knowledge.js';
import {
  assimilationPipelines,
  dataFeedRequirements,
  digitalMirrors,
  dtaCandidates,
  enterpriseOnboarding,
  humanValidationItems
} from '../data/onboarding.js';
import { eosPmo, masterRoadmap } from '../data/pmo.js';
import {
  actionGovernanceRecords,
  adminActions,
  agentActivity,
  agentAttentionQueue,
  agentCalendar,
  agentMessages,
  authorizationPolicies,
  platformNavigation,
  platformOperations
} from '../data/platform-operations.js';
import {
  digitalEnterpriseValuation,
  digitalTwinAssets,
  dtaMonitoring,
  enterpriseStrategy,
  governanceCouncil,
  secondBalanceSheet
} from '../data/strategy.js';
import { strategicAlignment } from '../data/strategic-alignment.js';
import { workflows } from '../data/workflows.js';
import { initializeCollection } from './storage-service.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const backupStatusFile = join(rootDir, 'backups', 'backup-status.json');
const releaseManifestFile = join(rootDir, 'docs', 'releases', 'RELEASE-MANIFEST.json');

export const expectedStorageCollections = [
  'enterprise-objects',
  'agents',
  'knowledge-objects',
  'agent-knowledge-repositories',
  'agent-knowledge-objects',
  'workflows',
  'events',
  'event-types',
  'pmo',
  'master-roadmap',
  'executive-council',
  'digital-enterprise-headquarters',
  'ceo-cockpit',
  'executive-profiles',
  'executive-actions',
  'executive-office-framework',
  'executive-offices',
  'enterprise-strategy',
  'governance-council',
  'valuation-models',
  'second-balance-sheet',
  'dta-monitoring',
  'digital-twin-assets',
  'strategic-alignment',
  'master-monitoring',
  'enterprise-visuals',
  'enterprise-telemetry',
  'digital-twin-homes',
  'digital-twin-generation-workflows',
  'enterprise-architecture-layers',
  'enterprise-onboarding',
  'assimilation-pipelines',
  'digital-mirrors',
  'dta-candidates',
  'data-feed-requirements',
  'human-validation-items',
  'startup-experience',
  'profile-identities',
  'media-assets',
  'organization-intake-records',
  'organization-repository-links',
  'media-extraction-rules',
  'platform-operations',
  'platform-navigation',
  'admin-actions',
  'authorization-policies',
  'action-governance',
  'agent-messages',
  'agent-activity',
  'agent-attention-queue',
  'agent-calendar',
  'backup-status',
  'release-metadata'
];

function readJsonFile(file, fallback) {
  try {
    if (!existsSync(file)) {
      return fallback;
    }

    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function withId(id, record) {
  return {
    id,
    ...record
  };
}

function storageDefinitions() {
  const backupStatus = readJsonFile(backupStatusFile, {
    latestBackupStatus: 'Pending Assessment',
    backupCount: 0,
    latestRestoreValidationStatus: 'Not validated'
  });
  const releaseMetadata = readJsonFile(releaseManifestFile, {
    release: 'Pending Assessment',
    version: '0.22.0'
  });

  return [
    {
      collectionName: 'enterprise-objects',
      records: enterpriseObjects,
      source: 'seed:enterprise-objects'
    },
    {
      collectionName: 'agents',
      records: agents,
      source: 'seed:agents'
    },
    {
      collectionName: 'knowledge-objects',
      records: knowledgeObjects,
      source: 'seed:knowledge'
    },
    {
      collectionName: 'agent-knowledge-repositories',
      records: agentKnowledgeRepositories,
      source: 'seed:agent-knowledge-repositories'
    },
    {
      collectionName: 'agent-knowledge-objects',
      records: agentKnowledgeObjects,
      source: 'seed:agent-knowledge-objects'
    },
    {
      collectionName: 'workflows',
      records: workflows,
      source: 'seed:workflows'
    },
    {
      collectionName: 'events',
      records: events,
      source: 'seed:events'
    },
    {
      collectionName: 'event-types',
      records: EVENT_TYPES.map((type) => ({ id: type, type })),
      source: 'seed:event-types'
    },
    {
      collectionName: 'pmo',
      records: [eosPmo],
      source: 'seed:pmo'
    },
    {
      collectionName: 'master-roadmap',
      records: [masterRoadmap],
      source: 'seed:master-roadmap'
    },
    {
      collectionName: 'executive-council',
      records: [executiveCouncil],
      source: 'seed:executive-council'
    },
    {
      collectionName: 'digital-enterprise-headquarters',
      records: [digitalEnterpriseHeadquarters],
      source: 'seed:digital-enterprise-headquarters'
    },
    {
      collectionName: 'ceo-cockpit',
      records: [withId('EOS-CEO-COCKPIT', ceoCockpit)],
      source: 'seed:ceo-cockpit'
    },
    {
      collectionName: 'executive-profiles',
      records: executiveProfiles,
      source: 'seed:executive-profiles'
    },
    {
      collectionName: 'executive-actions',
      records: executiveActions,
      source: 'seed:executive-actions'
    },
    {
      collectionName: 'executive-office-framework',
      records: [executiveOfficeFramework],
      source: 'seed:executive-office-framework'
    },
    {
      collectionName: 'executive-offices',
      records: executiveOffices,
      source: 'seed:executive-offices'
    },
    {
      collectionName: 'enterprise-strategy',
      records: [enterpriseStrategy],
      source: 'seed:enterprise-strategy'
    },
    {
      collectionName: 'governance-council',
      records: [governanceCouncil],
      source: 'seed:governance-council'
    },
    {
      collectionName: 'valuation-models',
      records: [digitalEnterpriseValuation],
      source: 'seed:valuation-models'
    },
    {
      collectionName: 'second-balance-sheet',
      records: [secondBalanceSheet],
      source: 'seed:second-balance-sheet'
    },
    {
      collectionName: 'dta-monitoring',
      records: [dtaMonitoring],
      source: 'seed:dta-monitoring'
    },
    {
      collectionName: 'digital-twin-assets',
      records: digitalTwinAssets,
      source: 'seed:digital-twin-assets'
    },
    {
      collectionName: 'strategic-alignment',
      records: [strategicAlignment],
      source: 'seed:strategic-alignment'
    },
    {
      collectionName: 'master-monitoring',
      records: [masterMonitoring],
      source: 'seed:master-monitoring'
    },
    {
      collectionName: 'enterprise-visuals',
      records: enterpriseVisuals,
      source: 'seed:enterprise-visuals'
    },
    {
      collectionName: 'enterprise-telemetry',
      records: enterpriseTelemetry,
      source: 'seed:enterprise-telemetry'
    },
    {
      collectionName: 'digital-twin-homes',
      records: digitalTwinHomes,
      source: 'seed:digital-twin-homes'
    },
    {
      collectionName: 'digital-twin-generation-workflows',
      records: digitalTwinGenerationWorkflows,
      source: 'seed:digital-twin-generation-workflows'
    },
    {
      collectionName: 'enterprise-architecture-layers',
      records: enterpriseArchitectureLayers,
      source: 'seed:enterprise-architecture-layers'
    },
    {
      collectionName: 'enterprise-onboarding',
      records: enterpriseOnboarding,
      source: 'seed:enterprise-onboarding'
    },
    {
      collectionName: 'assimilation-pipelines',
      records: assimilationPipelines,
      source: 'seed:assimilation-pipelines'
    },
    {
      collectionName: 'digital-mirrors',
      records: digitalMirrors,
      source: 'seed:digital-mirrors'
    },
    {
      collectionName: 'dta-candidates',
      records: dtaCandidates,
      source: 'seed:dta-candidates'
    },
    {
      collectionName: 'data-feed-requirements',
      records: dataFeedRequirements,
      source: 'seed:data-feed-requirements'
    },
    {
      collectionName: 'human-validation-items',
      records: humanValidationItems,
      source: 'seed:human-validation-items'
    },
    {
      collectionName: 'startup-experience',
      records: [startupExperience],
      source: 'seed:startup-experience'
    },
    {
      collectionName: 'profile-identities',
      records: profileIdentities,
      source: 'seed:profile-identities',
      refreshExisting: false
    },
    {
      collectionName: 'media-assets',
      records: mediaAssets,
      source: 'seed:media-assets'
    },
    {
      collectionName: 'organization-intake-records',
      records: organizationIntakeRecords,
      source: 'seed:organization-intake-records'
    },
    {
      collectionName: 'organization-repository-links',
      records: organizationRepositoryLinks,
      source: 'seed:organization-repository-links'
    },
    {
      collectionName: 'media-extraction-rules',
      records: mediaExtractionRules,
      source: 'seed:media-extraction-rules'
    },
    {
      collectionName: 'platform-operations',
      records: [platformOperations],
      source: 'seed:platform-operations'
    },
    {
      collectionName: 'platform-navigation',
      records: platformNavigation,
      source: 'seed:platform-navigation'
    },
    {
      collectionName: 'admin-actions',
      records: adminActions,
      source: 'seed:admin-actions'
    },
    {
      collectionName: 'authorization-policies',
      records: authorizationPolicies,
      source: 'seed:authorization-policies'
    },
    {
      collectionName: 'action-governance',
      records: actionGovernanceRecords,
      source: 'seed:action-governance'
    },
    {
      collectionName: 'agent-messages',
      records: agentMessages,
      source: 'seed:agent-messages'
    },
    {
      collectionName: 'agent-activity',
      records: agentActivity,
      source: 'seed:agent-activity'
    },
    {
      collectionName: 'agent-attention-queue',
      records: agentAttentionQueue,
      source: 'seed:agent-attention-queue'
    },
    {
      collectionName: 'agent-calendar',
      records: agentCalendar,
      source: 'seed:agent-calendar'
    },
    {
      collectionName: 'backup-status',
      records: [withId('EOS-BACKUP-STATUS', backupStatus)],
      source: 'file:backups/backup-status.json'
    },
    {
      collectionName: 'release-metadata',
      records: [withId('EOS-RELEASE-METADATA', releaseMetadata)],
      source: 'file:docs/releases/RELEASE-MANIFEST.json'
    }
  ];
}

export function bootstrapStorage() {
  return storageDefinitions().map((definition) =>
    initializeCollection({
      ...definition,
      mergeMissing: true
    })
  );
}
