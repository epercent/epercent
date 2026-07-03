export const EVENT_TYPES = Object.freeze([
  'WORKFLOW_STARTED',
  'WORKFLOW_COMPLETED',
  'AGENT_STARTED',
  'AGENT_COMPLETED',
  'KNOWLEDGE_UPDATED',
  'OBJECT_CREATED'
]);

export const events = [
  {
    id: 'EOS-EVENT-RESEARCH-PUBLICATION-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-RESEARCH-PUBLICATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:10:00.000Z',
    payload: {
      workflowName: 'Research Publication',
      trigger: 'New research brief requested'
    }
  },
  {
    id: 'EOS-EVENT-RESEARCH-PUBLICATION-AGENT-STARTED',
    type: 'AGENT_STARTED',
    sourceWorkflowId: 'EOS-WF-RESEARCH-PUBLICATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:10:30.000Z',
    payload: {
      agentId: 'EOS-AGENT-ATHENA',
      currentStep: 'Synthesize findings'
    }
  },
  {
    id: 'EOS-EVENT-KNOWLEDGE-UPDATE-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-KNOWLEDGE-UPDATE',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:12:00.000Z',
    payload: {
      workflowName: 'Knowledge Update',
      trigger: 'Knowledge object changed'
    }
  },
  {
    id: 'EOS-EVENT-KNOWLEDGE-UPDATED',
    type: 'KNOWLEDGE_UPDATED',
    sourceWorkflowId: 'EOS-WF-KNOWLEDGE-UPDATE',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:12:30.000Z',
    payload: {
      knowledgeObjectId: 'EOS-KNOWLEDGE-CORE-API',
      currentStep: 'Review links'
    }
  },
  {
    id: 'EOS-EVENT-AGENT-COORDINATION-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-AGENT-COORDINATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:14:00.000Z',
    payload: {
      workflowName: 'Agent Coordination',
      trigger: 'Multi-agent task created'
    }
  },
  {
    id: 'EOS-EVENT-AGENT-COORDINATION-COMPLETED',
    type: 'AGENT_COMPLETED',
    sourceWorkflowId: 'EOS-WF-AGENT-COORDINATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:14:30.000Z',
    payload: {
      agentId: 'EOS-AGENT-HERMES',
      handoffCount: 3
    }
  },
  {
    id: 'EOS-EVENT-OPPORTUNITY-DISCOVERY-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-OPPORTUNITY-DISCOVERY',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:16:00.000Z',
    payload: {
      workflowName: 'Opportunity Discovery',
      trigger: 'Market signal threshold reached'
    }
  },
  {
    id: 'EOS-EVENT-OPPORTUNITY-DISCOVERY-COMPLETED',
    type: 'WORKFLOW_COMPLETED',
    sourceWorkflowId: 'EOS-WF-OPPORTUNITY-DISCOVERY',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:16:30.000Z',
    payload: {
      recommendationCount: 2,
      progress: 100
    }
  },
  {
    id: 'EOS-EVENT-DIGITAL-TWIN-FORMATION-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-DIGITAL-TWIN-FORMATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:18:00.000Z',
    payload: {
      workflowName: 'Digital Twin Formation',
      trigger: 'Enterprise Object relationship update'
    }
  },
  {
    id: 'EOS-EVENT-DIGITAL-TWIN-OBJECT-CREATED',
    type: 'OBJECT_CREATED',
    sourceWorkflowId: 'EOS-WF-DIGITAL-TWIN-FORMATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:18:30.000Z',
    payload: {
      objectType: 'Digital Twin',
      sourceObjectId: 'EOS-API-001'
    }
  },
  {
    id: 'EOS-EVENT-DEVELOPMENT-FOUNDATION-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-DEVELOPMENT-FOUNDATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:30:00.000Z',
    payload: {
      workflowName: 'Development Foundation',
      trigger: 'Developer environment setup requested'
    }
  },
  {
    id: 'EOS-EVENT-DEVELOPMENT-FOUNDATION-COMPLETED',
    type: 'WORKFLOW_COMPLETED',
    sourceWorkflowId: 'EOS-WF-DEVELOPMENT-FOUNDATION',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:30:30.000Z',
    payload: {
      scriptsAdded: ['eos:start', 'eos:stop', 'eos:status', 'eos:test', 'eos:build', 'eos:lint'],
      bootstrapEntrypoint: './bootstrap.sh',
      progress: 100
    }
  },
  {
    id: 'EOS-EVENT-BACKUP-RECOVERY-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-BACKUP-RECOVERY',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:45:00.000Z',
    payload: {
      workflowName: 'Backup & Recovery',
      trigger: 'Engineering backup requested'
    }
  },
  {
    id: 'EOS-EVENT-BACKUP-ARCHIVE-CREATED',
    type: 'OBJECT_CREATED',
    sourceWorkflowId: 'EOS-WF-BACKUP-RECOVERY',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:45:30.000Z',
    payload: {
      objectType: 'Backup Archive',
      metadataFile: 'backups/backup-log.json'
    }
  },
  {
    id: 'EOS-EVENT-BACKUP-RECOVERY-COMPLETED',
    type: 'WORKFLOW_COMPLETED',
    sourceWorkflowId: 'EOS-WF-BACKUP-RECOVERY',
    status: 'Emitted',
    emittedAt: '2026-07-03T12:46:00.000Z',
    payload: {
      commandsAdded: ['eos:backup', 'eos:restore'],
      checksumAlgorithm: 'SHA-256',
      progress: 100
    }
  },
  {
    id: 'EOS-EVENT-SOURCE-CONTROL-RELEASE-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-SOURCE-CONTROL-RELEASE',
    status: 'Emitted',
    emittedAt: '2026-07-03T14:50:00.000Z',
    payload: {
      workflowName: 'Source Control & Release Management',
      trigger: 'Release preparation requested'
    }
  },
  {
    id: 'EOS-EVENT-RELEASE-MANIFEST-CREATED',
    type: 'OBJECT_CREATED',
    sourceWorkflowId: 'EOS-WF-SOURCE-CONTROL-RELEASE',
    status: 'Emitted',
    emittedAt: '2026-07-03T14:50:30.000Z',
    payload: {
      objectType: 'Release Manifest',
      manifestFile: 'docs/releases/RELEASE-MANIFEST.json'
    }
  },
  {
    id: 'EOS-EVENT-SOURCE-CONTROL-RELEASE-COMPLETED',
    type: 'WORKFLOW_COMPLETED',
    sourceWorkflowId: 'EOS-WF-SOURCE-CONTROL-RELEASE',
    status: 'Emitted',
    emittedAt: '2026-07-03T14:51:00.000Z',
    payload: {
      commandsAdded: ['eos:git:status', 'eos:release', 'eos:tag'],
      progress: 100
    }
  },
  {
    id: 'EOS-EVENT-INITIAL-BASELINE-STARTED',
    type: 'WORKFLOW_STARTED',
    sourceWorkflowId: 'EOS-WF-INITIAL-REPOSITORY-BASELINE',
    status: 'Emitted',
    emittedAt: '2026-07-03T15:05:00.000Z',
    payload: {
      workflowName: 'Initial Repository Baseline',
      trigger: 'Initial source control baseline requested'
    }
  },
  {
    id: 'EOS-EVENT-GENESIS-COMMIT-CREATED',
    type: 'OBJECT_CREATED',
    sourceWorkflowId: 'EOS-WF-INITIAL-REPOSITORY-BASELINE',
    status: 'Emitted',
    emittedAt: '2026-07-03T15:05:30.000Z',
    payload: {
      objectType: 'Git Commit',
      commitMessage: 'EOS Alpha Genesis'
    }
  },
  {
    id: 'EOS-EVENT-LOCAL-RELEASE-TAG-CREATED',
    type: 'OBJECT_CREATED',
    sourceWorkflowId: 'EOS-WF-INITIAL-REPOSITORY-BASELINE',
    status: 'Emitted',
    emittedAt: '2026-07-03T15:06:00.000Z',
    payload: {
      objectType: 'Git Tag',
      tag: 'v0.7.0'
    }
  },
  {
    id: 'EOS-EVENT-INITIAL-BASELINE-COMPLETED',
    type: 'WORKFLOW_COMPLETED',
    sourceWorkflowId: 'EOS-WF-INITIAL-REPOSITORY-BASELINE',
    status: 'Emitted',
    emittedAt: '2026-07-03T15:06:30.000Z',
    payload: {
      workflowName: 'Initial Repository Baseline',
      progress: 100
    }
  }
];
