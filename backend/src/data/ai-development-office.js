export const aiDevelopmentOffice = {
  office: {
    id: 'EOS-OFFICE-AI-DEVELOPMENT',
    name: 'AI Development Office',
    shortName: 'ADO',
    status: 'Active',
    purpose:
      'Manage AI-assisted software engineering for EOS, including coding agents, build tasks, reviews, tests, and releases.',
    mandate:
      'Increase the Autonomous Development Index while maintaining human governance, repository integrity, and commercial delivery discipline.',
  },

  metrics: {
    autonomousDevelopmentIndex: 12,
    activeBuildTasks: 3,
    registeredCodeAgents: 4,
    pendingReviews: 2,
    releaseReadiness: 38,
    humanEngineeringLoad: 'High but decreasing',
  },

  agents: [
    {
      id: 'ADO-AGENT-CODEX-001',
      name: 'Codex Build Agent',
      type: 'coding-agent',
      status: 'Ready',
      responsibility: 'Implement approved EOS build tasks from clear technical specifications.',
    },
    {
      id: 'ADO-AGENT-REVIEW-001',
      name: 'Code Review Agent',
      type: 'review-agent',
      status: 'Planned',
      responsibility: 'Review code changes for quality, security, architecture, and test coverage.',
    },
    {
      id: 'ADO-AGENT-DOCS-001',
      name: 'Documentation Agent',
      type: 'documentation-agent',
      status: 'Planned',
      responsibility: 'Update technical documentation, build ledger, release notes, and enhancement records.',
    },
    {
      id: 'ADO-AGENT-TEST-001',
      name: 'Testing Agent',
      type: 'test-agent',
      status: 'Planned',
      responsibility: 'Generate and run automated tests for EOS modules.',
    },
  ],

  buildTasks: [
    {
      id: 'ADO-TASK-001',
      title: 'Harden Mission Control data loading',
      status: 'Completed',
      owner: 'Human + AI Assisted',
      priority: 'High',
      outcome: 'Mission Control now tolerates failed module requests using Promise.allSettled.',
    },
    {
      id: 'ADO-TASK-002',
      title: 'Create AI Development Office',
      status: 'In Progress',
      owner: 'Program Director',
      priority: 'Critical',
      outcome: 'Establish first EOS office responsible for building EOS itself.',
    },
    {
      id: 'ADO-TASK-003',
      title: 'Repository consolidation plan',
      status: 'Planned',
      owner: 'Repository Agent',
      priority: 'High',
      outcome: 'Resolve embedded eos-platform repository and consolidate development history.',
    },
  ],
}
