import { events } from './events.js';

function eventsForWorkflow(workflowId) {
  return events.filter((event) => event.sourceWorkflowId === workflowId);
}

export const workflows = [
  {
    id: 'EOS-WF-RESEARCH-PUBLICATION',
    name: 'Research Publication',
    description: 'Coordinates source collection, synthesis, drafting, and publication of EOS research outputs.',
    status: 'Running',
    owner: 'Athena',
    steps: ['Collect sources', 'Synthesize findings', 'Draft publication', 'Publish output'],
    currentStep: 'Synthesize findings',
    progress: 58,
    trigger: 'New research brief requested',
    lastRun: '2026-07-03T12:10:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-CAP-0006', 'EOS-AGENT-ATHENA', 'EOS-KNOWLEDGE-GENESIS'],
    events: eventsForWorkflow('EOS-WF-RESEARCH-PUBLICATION')
  },
  {
    id: 'EOS-WF-KNOWLEDGE-UPDATE',
    name: 'Knowledge Update',
    description: 'Detects knowledge changes, updates registry records, reviews links, and publishes the new state.',
    status: 'Running',
    owner: 'Hermes',
    steps: ['Detect change', 'Update knowledge object', 'Review links', 'Publish registry change'],
    currentStep: 'Review links',
    progress: 72,
    trigger: 'Knowledge object changed',
    lastRun: '2026-07-03T12:12:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-CAP-0006', 'EOS-AGENT-HERMES', 'EOS-KNOWLEDGE-CORE-API'],
    events: eventsForWorkflow('EOS-WF-KNOWLEDGE-UPDATE')
  },
  {
    id: 'EOS-WF-AGENT-COORDINATION',
    name: 'Agent Coordination',
    description: 'Receives multi-agent tasks, assigns agents, coordinates handoffs, and reports execution state.',
    status: 'Running',
    owner: 'Hermes',
    steps: ['Receive task', 'Assign agents', 'Coordinate handoffs', 'Report completion'],
    currentStep: 'Coordinate handoffs',
    progress: 64,
    trigger: 'Multi-agent task created',
    lastRun: '2026-07-03T12:14:00.000Z',
    linkedObjects: [
      'EOS-CAP-0007',
      'EOS-CAP-0005',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATLAS'
    ],
    events: eventsForWorkflow('EOS-WF-AGENT-COORDINATION')
  },
  {
    id: 'EOS-WF-OPPORTUNITY-DISCOVERY',
    name: 'Opportunity Discovery',
    description: 'Scans signals, scores opportunities, routes recommendations, and tracks executive decisions.',
    status: 'Completed',
    owner: 'Athena',
    steps: ['Scan signals', 'Score opportunities', 'Route recommendations', 'Track decisions'],
    currentStep: 'Track decisions',
    progress: 100,
    trigger: 'Market signal threshold reached',
    lastRun: '2026-07-03T12:16:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-CAP-0005', 'EOS-AGENT-ATHENA', 'EOS-MC-001'],
    events: eventsForWorkflow('EOS-WF-OPPORTUNITY-DISCOVERY')
  },
  {
    id: 'EOS-WF-DIGITAL-TWIN-FORMATION',
    name: 'Digital Twin Formation',
    description: 'Maps Enterprise Objects, creates twin models, validates relationships, and activates the twin.',
    status: 'Running',
    owner: 'Atlas',
    steps: ['Map source objects', 'Create twin model', 'Validate relationships', 'Activate twin'],
    currentStep: 'Create twin model',
    progress: 36,
    trigger: 'Enterprise Object relationship update',
    lastRun: '2026-07-03T12:18:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-API-001', 'EOS-AGENT-ATLAS'],
    events: eventsForWorkflow('EOS-WF-DIGITAL-TWIN-FORMATION')
  },
  {
    id: 'EOS-WF-DEVELOPMENT-FOUNDATION',
    name: 'Development Foundation',
    description: 'Bootstraps, starts, stops, statuses, tests, lints, and builds EOS from root workspace scripts.',
    status: 'Completed',
    owner: 'EOS Platform',
    steps: ['Initialize Git', 'Configure workspace scripts', 'Create workspace folders', 'Verify services', 'Publish developer docs'],
    currentStep: 'Publish developer docs',
    progress: 100,
    trigger: 'Developer environment setup requested',
    lastRun: '2026-07-03T12:30:00.000Z',
    linkedObjects: ['EOS-CAP-0008', 'EOS-CAP-0007', 'EOS-API-001', 'EOS-MC-001'],
    events: eventsForWorkflow('EOS-WF-DEVELOPMENT-FOUNDATION')
  },
  {
    id: 'EOS-WF-BACKUP-RECOVERY',
    name: 'Backup & Recovery',
    description: 'Creates versioned EOS archives, validates checksums, records metadata, and prepares restore reports.',
    status: 'Running',
    owner: 'EOS Platform',
    steps: ['Create timestamp', 'Archive workspace', 'Calculate checksum', 'Record metadata', 'Prepare restore report'],
    currentStep: 'Record metadata',
    progress: 88,
    trigger: 'Engineering backup requested',
    lastRun: '2026-07-03T12:45:00.000Z',
    linkedObjects: ['EOS-CAP-0009', 'EOS-CAP-0008', 'EOS-CAP-0007', 'EOS-API-001', 'EOS-MC-001'],
    events: eventsForWorkflow('EOS-WF-BACKUP-RECOVERY')
  },
  {
    id: 'EOS-WF-SOURCE-CONTROL-RELEASE',
    name: 'Source Control & Release Management',
    description: 'Inspects Git status, runs release verification, creates backups, updates release manifests, writes release notes, and prepares semantic tags.',
    status: 'Running',
    owner: 'Codex',
    steps: ['Inspect Git state', 'Run release verification', 'Create backup', 'Update release manifest', 'Prepare semantic tag'],
    currentStep: 'Update release manifest',
    progress: 82,
    trigger: 'Release preparation requested',
    lastRun: '2026-07-03T14:50:00.000Z',
    linkedObjects: [
      'EOS-CAP-0010',
      'EOS-CAP-0007',
      'EOS-CAP-0008',
      'EOS-CAP-0009',
      'EOS-API-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-SOURCE-CONTROL-RELEASE')
  },
  {
    id: 'EOS-WF-INITIAL-REPOSITORY-BASELINE',
    name: 'Initial Repository Baseline',
    description: 'Stages the EOS source tree, creates the Alpha Genesis commit, creates the local release tag, and verifies repository cleanliness.',
    status: 'Completed',
    owner: 'Codex',
    steps: ['Review repository', 'Stage source files', 'Create Genesis commit', 'Create local tag', 'Verify clean tree'],
    currentStep: 'Verify clean tree',
    progress: 100,
    trigger: 'Initial source control baseline requested',
    lastRun: '2026-07-03T15:05:00.000Z',
    linkedObjects: [
      'EOS-CAP-0011',
      'EOS-CAP-0010',
      'EOS-CAP-0007',
      'EOS-CAP-0008',
      'EOS-API-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-INITIAL-REPOSITORY-BASELINE')
  }
];
