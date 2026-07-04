const visualTimestamp = '2026-07-03T21:50:00.000Z';
const valuationDisclaimer = 'Internal EOS estimate only. Not financial advice. Not an audited valuation.';

function makeLiveStatus({
  status = 'Blue',
  lifecycleStatus = 'Defined',
  healthScore = 80,
  progress = 40,
  summary,
  requiresAttention = false,
  attentionLevel = 'No Action Required',
  recommendedAction = 'Review visual intelligence model.',
  availableActions = ['Open Master Monitoring']
}) {
  return {
    status,
    operationalStatus: status,
    lifecycleStatus,
    healthScore,
    progress,
    summary,
    lastActivity: visualTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

export const enterpriseArchitectureLayers = [
  {
    id: 'EOS-VL-OPERATIONAL-SYSTEMS',
    name: 'Operational Systems',
    order: 1,
    summary: 'Enterprise source systems, production systems, safety systems, commercial systems, and human operating processes.',
    status: 'Monitoring',
    color: '#20c997'
  },
  {
    id: 'EOS-VL-DATA-PLATFORM',
    name: 'Data Platform',
    order: 2,
    summary: 'Structured data feeds, logs, documents, system telemetry, and integration-ready enterprise data.',
    status: 'Foundation',
    color: '#38bdf8'
  },
  {
    id: 'EOS-VL-MODEL-INTEGRATION',
    name: 'Model Integration',
    order: 3,
    summary: 'Enterprise models, analytical models, process models, and future AI model interfaces.',
    status: 'Defined',
    color: '#818cf8'
  },
  {
    id: 'EOS-VL-ENTERPRISE-ONTOLOGY',
    name: 'Enterprise Ontology / Enterprise Objects',
    order: 4,
    summary: 'Live Enterprise Objects that represent assets, systems, risks, workflows, agents, approvals, and value.',
    status: 'Operational',
    color: '#22d3ee'
  },
  {
    id: 'EOS-VL-WORKFLOWS',
    name: 'Workflows',
    order: 5,
    summary: 'Governed processes for monitoring, review, approval, recovery, publication, and DTA formation.',
    status: 'Operational',
    color: '#f59e0b'
  },
  {
    id: 'EOS-VL-DECISION-ORCHESTRATION',
    name: 'Decision Orchestration',
    order: 6,
    summary: 'Human and agent decision points, review paths, escalation logic, and approval queues.',
    status: 'Foundation',
    color: '#fb7185'
  },
  {
    id: 'EOS-VL-AGENTS',
    name: 'Agents',
    order: 7,
    summary: 'Executive agents assigned to research, engineering, knowledge, architecture, operations, quality, and opportunity intelligence.',
    status: 'Operational',
    color: '#a78bfa'
  },
  {
    id: 'EOS-VL-GOVERNANCE',
    name: 'Governance',
    order: 8,
    summary: 'Policies, approval status, audit readiness, risk review, and executive authorization posture.',
    status: 'Active Review',
    color: '#f97316'
  },
  {
    id: 'EOS-VL-VALUATION',
    name: 'Valuation',
    order: 9,
    summary: 'Internal value drivers, DTA value signals, risk reduction value, and enterprise value assumptions.',
    status: 'Internal Estimate',
    color: '#eab308'
  },
  {
    id: 'EOS-VL-SECOND-BALANCE-SHEET',
    name: 'Second Balance Sheet',
    order: 10,
    summary: 'Digital operational assets and knowledge assets that may support future enterprise value evidence.',
    status: 'Draft Methodology',
    color: '#14b8a6'
  }
];

export const digitalTwinGenerationWorkflows = [
  {
    id: 'EOS-DTGW-001',
    name: 'Enterprise Digital Twin Generation Workflow',
    owner: 'Atlas',
    status: 'Future Workflow Foundation',
    timezone: 'UTC',
    lastUpdated: visualTimestamp,
    steps: [
      'Upload enterprise documents',
      'Analyze organization',
      'Extract enterprise objects',
      'Map systems and assets',
      'Generate digital twin structure',
      'Identify data feeds',
      'Assign agents',
      'Define human workflows',
      'Connect real-time feeds',
      'Go live'
    ],
    humanApprovalPoints: [
      'Approve document intake scope',
      'Approve extracted enterprise object model',
      'Approve critical system mapping',
      'Approve governance and safety workflows',
      'Approve go-live readiness'
    ],
    liveStatus: makeLiveStatus({
      status: 'Grey',
      lifecycleStatus: 'Defined',
      healthScore: 72,
      progress: 24,
      summary: 'Digital Twin generation workflow is defined as a future onboarding process.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Review onboarding workflow before enabling document ingestion or automated structure generation.',
      availableActions: ['Review Workflow', 'Review Approval Points', 'Review Data Feed Plan']
    })
  }
];

export const enterpriseVisuals = [
  {
    id: 'EVIS-EPERCENT-001',
    enterpriseId: 'DTA-EPERCENT-001',
    name: 'ePercent Enterprise Digital Twin',
    industry: 'AI-Native Enterprise',
    enterpriseType: 'Reference Enterprise',
    visualTheme: 'dark-teal-command',
    logoUrl: '',
    brandColor: '#20c997',
    timezone: 'Africa/Lagos',
    lastUpdated: visualTimestamp,
    primaryAssets: [
      'EOS Platform',
      'Mission Control',
      'Executive AI Workforce',
      'KIPR',
      'Second Balance Sheet',
      'Digital Twin Asset Portfolio'
    ],
    systems: [
      { id: 'EP-SYS-MC', name: 'Mission Control', status: 'Operational', healthScore: 92 },
      { id: 'EP-SYS-CORE', name: 'EOS Core API', status: 'Operational', healthScore: 94 },
      { id: 'EP-SYS-KIPR', name: 'KIPR', status: 'Foundation', healthScore: 78 },
      { id: 'EP-SYS-PMO', name: 'PMO / Master Roadmap', status: 'Operational', healthScore: 86 },
      { id: 'EP-SYS-BACKUP', name: 'Backup & Recovery', status: 'Amber', healthScore: 82 }
    ],
    dataFeeds: [
      { id: 'EP-FEED-STATUS', name: 'EOS API Status', status: 'Simulated Live', cadence: 'On demand' },
      { id: 'EP-FEED-STORAGE', name: 'Persistent Storage Health', status: 'Simulated Live', cadence: 'On demand' },
      { id: 'EP-FEED-BACKUP', name: 'Backup Metadata', status: 'Simulated Live', cadence: 'On backup' },
      { id: 'EP-FEED-ROADMAP', name: 'PMO Roadmap State', status: 'Simulated Live', cadence: 'On change' }
    ],
    agents: ['EOS-AGENT-CODEX', 'EOS-AGENT-ATHENA', 'EOS-AGENT-HERMES', 'EOS-AGENT-ATLAS'],
    humanInteractionPoints: [
      'Approve strategic narrative before investor use',
      'Validate restore before operational confidence is Green',
      'Review DTA lifecycle readiness',
      'Approve valuation assumptions'
    ],
    riskAreas: [
      { id: 'EP-RISK-RESTORE', name: 'Restore validation pending', riskScore: 42, status: 'Action Recommended' },
      { id: 'EP-RISK-VALUATION', name: 'Internal valuation assumptions unapproved', riskScore: 58, status: 'Requires Review' }
    ],
    valuationSummary: {
      currency: 'USD',
      totalEstimatedValue: 2500000,
      confidence: 'Low',
      basis: valuationDisclaimer
    },
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'In Progress',
      healthScore: 88,
      progress: 52,
      summary: 'ePercent is represented as the first live AI-native enterprise running on EOS.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Review strategic alignment, backup validation, and DTA lifecycle readiness.',
      availableActions: ['Open Enterprise Home', 'Review Digital Twin Structure', 'Review Human Approval Points']
    })
  },
  {
    id: 'EVIS-OIL-001',
    enterpriseId: 'DTA-OIL-001',
    name: 'Example Oil & Gas Enterprise',
    industry: 'Oil & Gas',
    enterpriseType: 'Industry Demonstration Enterprise',
    visualTheme: 'dark-industrial-amber',
    logoUrl: '',
    brandColor: '#f59e0b',
    timezone: 'Africa/Lagos',
    lastUpdated: visualTimestamp,
    primaryAssets: [
      'Headquarters',
      'Offshore Rigs',
      'FPSO / Ships',
      'Pipelines',
      'Storage Facilities',
      'Wells',
      'Data Feeds',
      'Safety Systems',
      'Production Systems',
      'Commercial Systems'
    ],
    systems: [
      { id: 'OIL-SYS-SAFETY', name: 'Safety Systems', status: 'Monitoring', healthScore: 84 },
      { id: 'OIL-SYS-PRODUCTION', name: 'Production Systems', status: 'Monitoring', healthScore: 81 },
      { id: 'OIL-SYS-COMMERCIAL', name: 'Commercial Systems', status: 'Pending Integration', healthScore: 68 },
      { id: 'OIL-SYS-FEEDS', name: 'Data Feeds', status: 'Simulated', healthScore: 72 },
      { id: 'OIL-SYS-GOVERNANCE', name: 'Governance Control Points', status: 'Review Required', healthScore: 76 }
    ],
    dataFeeds: [
      { id: 'OIL-FEED-PRODUCTION', name: 'Production Output', status: 'Simulated', cadence: '15 minutes' },
      { id: 'OIL-FEED-SAFETY', name: 'Safety Events', status: 'Simulated', cadence: '5 minutes' },
      { id: 'OIL-FEED-PIPELINE', name: 'Pipeline Pressure', status: 'Simulated', cadence: '1 minute' },
      { id: 'OIL-FEED-COMMERCIAL', name: 'Commercial Output', status: 'Simulated', cadence: 'Daily' }
    ],
    agents: ['EOS-AGENT-ATLAS', 'EOS-AGENT-ARGUS', 'EOS-AGENT-VULCAN', 'EOS-AGENT-MERCURY'],
    humanInteractionPoints: [
      'Approve safety escalation workflow',
      'Review production anomaly alerts',
      'Approve asset valuation assumptions',
      'Review commercial readiness score'
    ],
    riskAreas: [
      { id: 'OIL-RISK-SAFETY', name: 'Safety workflow requires enterprise validation', riskScore: 64, status: 'Requires Review' },
      { id: 'OIL-RISK-FEEDS', name: 'Data feeds are simulated only', riskScore: 52, status: 'Pending Integration' }
    ],
    valuationSummary: {
      currency: 'USD',
      totalEstimatedValue: 1250000,
      confidence: 'Conceptual',
      basis: valuationDisclaimer
    },
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 76,
      progress: 28,
      summary: 'Oil & Gas enterprise visual model is seeded as an industry demonstration twin.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Use as a demonstration model until real enterprise onboarding data is approved.',
      availableActions: ['Open Enterprise Home', 'Review Asset Map', 'Review Data Feed Plan']
    })
  }
];

export const enterpriseTelemetry = [
  {
    id: 'TEL-EPERCENT-HEALTH',
    source: 'Mission Control',
    sourceType: 'EOS Internal',
    targetObject: 'DTA-EPERCENT-001',
    metric: 'Enterprise Health',
    value: 88,
    unit: 'score',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Monitoring',
    confidence: 'High',
    linkedEnterpriseObject: 'EOS-ENTERPRISE-PROFILE',
    linkedDta: 'DTA-EPERCENT-001'
  },
  {
    id: 'TEL-EPERCENT-VALUE',
    source: 'Digital Enterprise Valuation',
    sourceType: 'Internal Estimate',
    targetObject: 'DTA-EPERCENT-001',
    metric: 'Total Estimated Value',
    value: 2500000,
    unit: 'USD',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Internal Estimate',
    confidence: 'Low',
    linkedEnterpriseObject: 'EOS-DIGITAL-ENTERPRISE-VALUATION',
    linkedDta: 'DTA-EPERCENT-001'
  },
  {
    id: 'TEL-EPERCENT-APPROVALS',
    source: 'Governance Council',
    sourceType: 'Governance',
    targetObject: 'DTA-EPERCENT-001',
    metric: 'Human Approval Points',
    value: 4,
    unit: 'points',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Review Required',
    confidence: 'Medium',
    linkedEnterpriseObject: 'EOS-GOVERNANCE-COUNCIL',
    linkedDta: 'DTA-EPERCENT-001'
  },
  {
    id: 'TEL-EPERCENT-FEEDS',
    source: 'Platform Operations',
    sourceType: 'EOS Internal',
    targetObject: 'DTA-EPERCENT-001',
    metric: 'Data Feeds',
    value: 4,
    unit: 'feeds',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Simulated Live',
    confidence: 'Medium',
    linkedEnterpriseObject: 'EOS-PLATFORM-ADMINISTRATION-CENTER',
    linkedDta: 'DTA-EPERCENT-001'
  },
  {
    id: 'TEL-EPERCENT-RISK',
    source: 'Risk Monitor',
    sourceType: 'Simulated',
    targetObject: 'DTA-EPERCENT-001',
    metric: 'Risk Score',
    value: 42,
    unit: 'score',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Action Recommended',
    confidence: 'Medium',
    linkedEnterpriseObject: 'EOS-DTA-MONITORING',
    linkedDta: 'DTA-EPERCENT-001'
  },
  {
    id: 'TEL-OIL-HEALTH',
    source: 'Industry Demonstration Model',
    sourceType: 'Simulated',
    targetObject: 'DTA-OIL-001',
    metric: 'Enterprise Health',
    value: 76,
    unit: 'score',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Monitoring',
    confidence: 'Medium',
    linkedEnterpriseObject: 'DTA-OIL-001',
    linkedDta: 'DTA-OIL-001'
  },
  {
    id: 'TEL-OIL-PRODUCTION',
    source: 'Production Systems',
    sourceType: 'Simulated',
    targetObject: 'DTA-OIL-001',
    metric: 'Production Output',
    value: 124500,
    unit: 'barrels/day',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Simulated Live',
    confidence: 'Conceptual',
    linkedEnterpriseObject: 'DTA-OIL-001',
    linkedDta: 'DTA-OIL-001'
  },
  {
    id: 'TEL-OIL-SAFETY',
    source: 'Safety Systems',
    sourceType: 'Simulated',
    targetObject: 'DTA-OIL-001',
    metric: 'Safety Alerts',
    value: 2,
    unit: 'alerts',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Review Required',
    confidence: 'Conceptual',
    linkedEnterpriseObject: 'DTA-OIL-001',
    linkedDta: 'DTA-OIL-001'
  },
  {
    id: 'TEL-OIL-VALUE',
    source: 'Conceptual Valuation Model',
    sourceType: 'Internal Estimate',
    targetObject: 'DTA-OIL-001',
    metric: 'Total Estimated Value',
    value: 1250000,
    unit: 'USD',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Conceptual Estimate',
    confidence: 'Low',
    linkedEnterpriseObject: 'DTA-OIL-001',
    linkedDta: 'DTA-OIL-001'
  },
  {
    id: 'TEL-OIL-FEEDS',
    source: 'Data Feed Registry',
    sourceType: 'Simulated',
    targetObject: 'DTA-OIL-001',
    metric: 'Data Feeds',
    value: 4,
    unit: 'feeds',
    timestampUtc: visualTimestamp,
    displayTimezone: 'Africa/Lagos',
    status: 'Pending Integration',
    confidence: 'Conceptual',
    linkedEnterpriseObject: 'DTA-OIL-001',
    linkedDta: 'DTA-OIL-001'
  }
];

export const digitalTwinHomes = [
  {
    id: 'DTH-EPERCENT-001',
    enterpriseId: 'DTA-EPERCENT-001',
    name: 'ePercent Enterprise Home',
    enterpriseLogo: '',
    enterpriseInitials: 'EP',
    enterpriseHealth: 88,
    assetHealth: 84,
    productionMetric: '23 active EOS capability records',
    totalEstimatedValue: 2500000,
    riskScore: 42,
    activeAlerts: 2,
    systemsStatus: 'Operational with review items',
    agentsAssigned: ['Codex', 'Athena', 'Hermes', 'Atlas'],
    humanApprovalPoints: 4,
    timezone: 'Africa/Lagos',
    generationWorkflowId: 'EOS-DTGW-001',
    architectureLayerIds: enterpriseArchitectureLayers.map((layer) => layer.id),
    telemetryIds: enterpriseTelemetry
      .filter((telemetry) => telemetry.linkedDta === 'DTA-EPERCENT-001')
      .map((telemetry) => telemetry.id),
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'In Progress',
      healthScore: 88,
      progress: 52,
      summary: 'ePercent Enterprise Home is ready for executive monitoring and strategic review.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Review approval points and restore validation before marking enterprise twin Green.',
      availableActions: ['Review Enterprise Home', 'Review Data Feeds', 'Review Approval Points']
    })
  },
  {
    id: 'DTH-OIL-001',
    enterpriseId: 'DTA-OIL-001',
    name: 'Example Oil & Gas Enterprise Home',
    enterpriseLogo: '',
    enterpriseInitials: 'OG',
    enterpriseHealth: 76,
    assetHealth: 73,
    productionMetric: '124,500 barrels/day simulated output',
    totalEstimatedValue: 1250000,
    riskScore: 64,
    activeAlerts: 2,
    systemsStatus: 'Simulated systems pending enterprise integration',
    agentsAssigned: ['Atlas', 'Argus', 'Vulcan', 'Mercury'],
    humanApprovalPoints: 4,
    timezone: 'Africa/Lagos',
    generationWorkflowId: 'EOS-DTGW-001',
    architectureLayerIds: enterpriseArchitectureLayers.map((layer) => layer.id),
    telemetryIds: enterpriseTelemetry
      .filter((telemetry) => telemetry.linkedDta === 'DTA-OIL-001')
      .map((telemetry) => telemetry.id),
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 76,
      progress: 28,
      summary: 'Oil & Gas Enterprise Home is a demonstration visual twin for industry-specific monitoring.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Use as a visual demonstration until real enterprise onboarding begins.',
      availableActions: ['Review Enterprise Home', 'Review Asset Map', 'Review Generation Workflow']
    })
  }
];

export const masterMonitoring = {
  id: 'EOS-MASTER-MONITORING',
  name: 'EOS Master Monitoring View',
  owner: 'Argus',
  status: 'Operational Foundation',
  visualTheme: 'dark-layered-enterprise',
  displayTimezone: 'Africa/Lagos',
  lastUpdated: visualTimestamp,
  onboardedEnterprises: enterpriseVisuals.length,
  enterpriseValue: enterpriseVisuals.reduce(
    (total, enterprise) => total + Number(enterprise.valuationSummary.totalEstimatedValue ?? 0),
    0
  ),
  digitalTwinAssets: 3,
  activeAgents: 7,
  dataFeeds: enterpriseVisuals.reduce((total, enterprise) => total + enterprise.dataFeeds.length, 0),
  operationalSystems: enterpriseVisuals.reduce((total, enterprise) => total + enterprise.systems.length, 0),
  alerts: enterpriseVisuals.reduce((total, enterprise) => total + enterprise.riskAreas.length, 0),
  governanceStatus: 'Active Review',
  humanApprovalPoints: enterpriseVisuals.reduce(
    (total, enterprise) => total + enterprise.humanInteractionPoints.length,
    0
  ),
  headlineMetrics: [
    { id: 'MM-ENTERPRISES', label: 'Onboarded Enterprises', value: enterpriseVisuals.length, unit: 'enterprises' },
    { id: 'MM-VALUE', label: 'Enterprise Value', value: 3750000, unit: 'USD' },
    { id: 'MM-DTAS', label: 'Digital Twin Assets', value: 3, unit: 'assets' },
    { id: 'MM-AGENTS', label: 'Active Agents', value: 7, unit: 'agents' },
    { id: 'MM-FEEDS', label: 'Data Feeds', value: 8, unit: 'feeds' },
    { id: 'MM-SYSTEMS', label: 'Operational Systems', value: 10, unit: 'systems' },
    { id: 'MM-ALERTS', label: 'Alerts', value: 4, unit: 'alerts' },
    { id: 'MM-APPROVALS', label: 'Human Approval Points', value: 8, unit: 'points' }
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 84,
    progress: 46,
    summary: 'Master Monitoring visual layer is operational as a simulated enterprise intelligence foundation.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review demonstration enterprise twins and approve the next DTA lifecycle management capability.',
    availableActions: ['Open Master Monitoring', 'Open Enterprise Home', 'Review Telemetry', 'Review Approval Points']
  })
};
