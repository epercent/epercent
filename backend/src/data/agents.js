function initialsFor(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

const agentSeed = [
  {
    id: 'EOS-AGENT-ATHENA',
    name: 'Athena',
    role: 'Chief Research Officer',
    status: 'Active',
    currentTask: 'Maintaining the EOS research roadmap, publications, business impact analysis, and IP pipeline.',
    progress: 84,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: ['Research', 'White papers', 'Academic publications', 'Doctoral support', 'Patents'],
    department: 'Research',
    reportsTo: 'Chief Technology Officer',
    responsibilities: [
      'Research',
      'White Papers',
      'Academic Publications',
      'Doctoral Support',
      'Patents',
      'Business Impact Assessments',
      'Research Roadmap'
    ],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Research'
    }
  },
  {
    id: 'EOS-AGENT-HERMES',
    name: 'Hermes',
    role: 'Chief Knowledge Officer',
    status: 'Active',
    currentTask: 'Maintaining EOS knowledge governance, documentation, version history, and change management.',
    progress: 76,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: ['Knowledge Vault', 'Genesis', 'Enterprise Objects', 'Documentation', 'Governance'],
    department: 'Knowledge',
    reportsTo: 'Chief Technology Officer',
    responsibilities: [
      'Knowledge Vault',
      'Genesis',
      'Enterprise Objects',
      'Documentation',
      'Governance',
      'Version History',
      'Change Management'
    ],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Knowledge'
    }
  },
  {
    id: 'EOS-AGENT-ATLAS',
    name: 'Atlas',
    role: 'Chief Enterprise Architect',
    status: 'Active',
    currentTask: 'Maintaining EOS architecture, dependencies, scalability posture, and technical debt visibility.',
    progress: 68,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: ['Architecture', 'Capability dependencies', 'Technical debt', 'Scalability', 'Architecture reviews'],
    department: 'Architecture',
    reportsTo: 'Chief Technology Officer',
    responsibilities: [
      'Architecture',
      'Capability Dependencies',
      'Technical Debt',
      'Scalability',
      'Platform Health',
      'Architecture Reviews'
    ],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Architecture'
    }
  },
  {
    id: 'EOS-AGENT-CODEX',
    name: 'Codex',
    role: 'Chief Engineering Officer',
    status: 'Active',
    currentTask: 'Maintaining EOS engineering quality, builds, verification, and capability delivery.',
    progress: 96,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: [
      'Software engineering',
      'Platform development',
      'Build verification',
      'Release engineering',
      'Engineering estimates',
      'Capability completion reporting'
    ],
    department: 'Engineering',
    reportsTo: 'Chief Technology Officer',
    responsibilities: [
      'Software Engineering',
      'Platform Development',
      'Code Quality',
      'Testing',
      'Build Verification',
      'Refactoring',
      'Workspace Automation',
      'Release Engineering',
      'Engineering Estimates',
      'EOS Capability Completion Reports'
    ],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-001', 'EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Engineering'
    }
  },
  {
    id: 'EOS-AGENT-MERCURY',
    name: 'Mercury',
    role: 'Chief Opportunity Officer',
    status: 'Active',
    currentTask: 'Maintaining the EOS market intelligence and opportunity discovery organizational function.',
    progress: 64,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: [
      'Market intelligence',
      'Enterprise discovery',
      'Opportunity scanning',
      'News monitoring',
      'Competitive analysis'
    ],
    department: 'Opportunity',
    reportsTo: 'Chief Technology Officer',
    responsibilities: [
      'Market Intelligence',
      'Enterprise Discovery',
      'Opportunity Scanning',
      'News Monitoring',
      'Competitive Analysis'
    ],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Opportunity'
    }
  },
  {
    id: 'EOS-AGENT-ARGUS',
    name: 'Argus',
    role: 'Chief Operations Officer',
    status: 'Active',
    currentTask: 'Maintaining the EOS operations, monitoring, telemetry, platform health, and alerting model.',
    progress: 62,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: ['Monitoring', 'Telemetry', 'Platform health', 'Alerts', 'Operations'],
    department: 'Operations',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Monitoring', 'Telemetry', 'Platform Health', 'Alerts', 'Operations'],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Operations'
    }
  },
  {
    id: 'EOS-AGENT-VULCAN',
    name: 'Vulcan',
    role: 'Chief Quality Officer',
    status: 'Active',
    currentTask: 'Maintaining the EOS quality, testing, security, performance, and compliance organizational model.',
    progress: 66,
    health: 'Healthy',
    lastUpdate: '2026-07-03T14:35:00.000Z',
    capabilities: ['QA', 'Testing', 'Security', 'Performance', 'Compliance'],
    department: 'Quality',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['QA', 'Testing', 'Security', 'Performance', 'Compliance'],
    executiveMetadata: {
      leadershipTeam: 'EOS Executive Leadership Team',
      directiveIds: ['EOS-ORG-DIR-002'],
      reportingLine: 'Chief Technology Officer',
      operatingScope: 'Quality'
    }
  }
];

export const agents = agentSeed.map((agent) => ({
  avatarUrl: '',
  avatarType: 'initials',
  fallbackInitials: initialsFor(agent.name),
  statusBadge: agent.status,
  roleImage: '',
  ...agent
}));
