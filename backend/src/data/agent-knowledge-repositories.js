const now = '2026-07-03T15:45:00.000Z';

function makeLiveStatus({
  status,
  lifecycleStatus,
  healthScore,
  progress,
  summary,
  requiresAttention,
  attentionLevel,
  recommendedAction,
  availableActions
}) {
  return {
    status,
    operationalStatus: status,
    lifecycleStatus,
    healthScore,
    progress,
    summary,
    lastActivity: now,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

const executiveAgents = [
  { id: 'EOS-AGENT-CODEX', name: 'Codex', role: 'Chief Engineering Officer' },
  { id: 'EOS-AGENT-ATHENA', name: 'Athena', role: 'Chief Research Officer' },
  { id: 'EOS-AGENT-HERMES', name: 'Hermes', role: 'Chief Knowledge Officer' },
  { id: 'EOS-AGENT-ATLAS', name: 'Atlas', role: 'Chief Enterprise Architect' },
  { id: 'EOS-AGENT-MERCURY', name: 'Mercury', role: 'Chief Opportunity Officer' },
  { id: 'EOS-AGENT-ARGUS', name: 'Argus', role: 'Chief Operations Officer' },
  { id: 'EOS-AGENT-VULCAN', name: 'Vulcan', role: 'Chief Quality Officer' }
];

export const agentKnowledgeObjects = [
  {
    id: 'RP-001',
    title: 'The Live Enterprise Object Model',
    ownerAgent: 'Athena',
    type: 'White Paper',
    summary: 'How enterprise software moves from passive records to self-reporting operational entities.',
    status: 'Draft',
    lifecycleStatus: 'Draft',
    progress: 72,
    created: '2026-07-03T15:40:00.000Z',
    lastUpdated: now,
    relatedCapabilities: ['EOS-CAP-0014'],
    relatedEnterpriseObjects: ['EOS-CAP-0014', 'EOS-WF-LIVE-OBJECT-STATUS-LAYER'],
    relatedWorkflows: ['EOS-WF-KNOWLEDGE-MANAGEMENT', 'EOS-WF-LIVE-OBJECT-STATUS-LAYER'],
    relatedEvents: ['EOS-EVENT-AKR-KNOWLEDGE-OBJECT-CREATED', 'EOS-EVENT-AKR-PUBLICATION-READY'],
    tags: ['Live Objects', 'Enterprise Software', 'Operations'],
    publicationTarget: 'EOS White Paper Series',
    patentPotential: false,
    investorReady: true,
    publicationReady: true,
    linkedDocuments: ['docs/capabilities/EOS-CAP-0014.md'],
    previewContent: {
      executiveSummary:
        'The Live Enterprise Object Model defines enterprise records as active operational entities that report health, progress, attention needs, and recommended actions.',
      coreArgument:
        'Enterprise software becomes more valuable when core records can expose live operational state instead of remaining passive data rows.',
      researchQuestions: [
        'How should enterprise systems model self-reporting objects?',
        'Which live status fields create executive decision value?',
        'How can operational state become a reusable platform contract?'
      ],
      commercialRelevance:
        'Creates a differentiated operating layer for enterprises that need real-time object health, governance, and executive action routing.',
      relatedEOSCapability: 'EOS-CAP-0014',
      nextDraftingStep: 'Add examples comparing passive records with Live Enterprise Objects.'
    },
    liveStatus: makeLiveStatus({
      status: 'Green',
      lifecycleStatus: 'Draft',
      healthScore: 92,
      progress: 72,
      summary: 'White paper draft is ready for publication workflow review.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Move into editorial review when publication workflow is active.',
      availableActions: [
        'Open',
        'Continue Writing',
        'Generate Executive Summary',
        'Generate Investor Brief',
        'Generate LinkedIn Article',
        'Generate Presentation',
        'Submit for Review',
        'Assign References',
        'Schedule Review'
      ]
    })
  },
  {
    id: 'RP-002',
    title: 'The Operational Digital Twin',
    ownerAgent: 'Athena',
    type: 'Academic Paper',
    summary: 'Digital Twin Assets as continuously reporting enterprise objects.',
    status: 'Draft',
    lifecycleStatus: 'Research',
    progress: 44,
    created: '2026-07-03T15:41:00.000Z',
    lastUpdated: now,
    relatedCapabilities: ['EOS-CAP-0014'],
    relatedEnterpriseObjects: ['EOS-CAP-0014', 'EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY'],
    relatedWorkflows: ['EOS-WF-KNOWLEDGE-MANAGEMENT', 'EOS-WF-DIGITAL-TWIN-FORMATION'],
    relatedEvents: ['EOS-EVENT-AKR-KNOWLEDGE-UPDATED', 'EOS-EVENT-AKR-PATENT-IDENTIFIED'],
    tags: ['Digital Twin Assets', 'Operations', 'Enterprise Objects'],
    publicationTarget: 'Academic Conference Paper',
    patentPotential: true,
    investorReady: false,
    publicationReady: false,
    linkedDocuments: ['docs/architecture/EOS-Engineering-Standard.md'],
    previewContent: {
      executiveSummary:
        'The Operational Digital Twin frames Digital Twin Assets as enterprise objects that continuously report status, progress, and risk.',
      coreArgument:
        'Digital twins become commercially useful when they are connected to operational workflows, not when they exist only as static models.',
      researchQuestions: [
        'What operational signals should a Digital Twin Asset expose?',
        'How do Live Enterprise Objects support Digital Twin Asset governance?',
        'How can twin status improve executive planning and risk review?'
      ],
      commercialRelevance:
        'Supports enterprise products around operational digital twins, asset health, governance, and portfolio intelligence.',
      relatedEOSCapability: 'EOS-CAP-0014',
      nextDraftingStep: 'Expand the Digital Twin Asset lifecycle and define reference examples.'
    },
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Research',
      healthScore: 76,
      progress: 44,
      summary: 'Academic paper is drafted but needs research expansion and references.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Assign research review and collect source references.',
      availableActions: [
        'Open',
        'Continue Writing',
        'Request More Information',
        'Assign References',
        'Generate Presentation',
        'Submit for Review',
        'Schedule Review'
      ]
    })
  },
  {
    id: 'RP-003',
    title: 'The Second Balance Sheet',
    ownerAgent: 'Athena',
    type: 'Investor Brief',
    summary: 'Operational state as a measurable component of enterprise value.',
    status: 'Draft',
    lifecycleStatus: 'Review',
    progress: 58,
    created: '2026-07-03T15:42:00.000Z',
    lastUpdated: now,
    relatedCapabilities: ['EOS-CAP-0014'],
    relatedEnterpriseObjects: ['EOS-CAP-0014', 'EOS-KNOWLEDGE-GENESIS'],
    relatedWorkflows: ['EOS-WF-KNOWLEDGE-MANAGEMENT', 'EOS-WF-RESEARCH-PUBLICATION'],
    relatedEvents: ['EOS-EVENT-AKR-INVESTOR-BRIEF-READY', 'EOS-EVENT-AKR-PATENT-IDENTIFIED'],
    tags: ['Second Balance Sheet', 'Enterprise Value', 'Digital Twin Assets'],
    publicationTarget: 'Investor Brief',
    patentPotential: true,
    investorReady: true,
    publicationReady: false,
    linkedDocuments: ['docs/genesis/README.md'],
    previewContent: {
      executiveSummary:
        'The Second Balance Sheet proposes that operational state, knowledge assets, and digital twin maturity can become measurable components of enterprise value.',
      coreArgument:
        'Enterprises need a second valuation layer that captures operational intelligence, Digital Twin Assets, and live platform readiness.',
      researchQuestions: [
        'Which operational indicators can support enterprise value assessment?',
        'How should Digital Twin Assets be governed and valued?',
        'How can EOS make intangible operating state visible to investors?'
      ],
      commercialRelevance:
        'Creates a board-level and investor-facing thesis for EOS as a system of record for digital operational value.',
      relatedEOSCapability: 'EOS-CAP-0014',
      nextDraftingStep: 'Add concrete valuation scenarios and investor-ready diagrams.'
    },
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Review',
      healthScore: 82,
      progress: 58,
      summary: 'Investor brief is ready for executive review but needs valuation examples.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Add valuation examples before external distribution.',
      availableActions: [
        'Open',
        'Continue Writing',
        'Generate Investor Brief',
        'Generate Presentation',
        'Submit for Review',
        'Assign References',
        'Schedule Review'
      ]
    })
  },
  {
    id: 'RP-004',
    title: 'The AI-Native Enterprise',
    ownerAgent: 'Athena',
    type: 'Research Note',
    summary: 'Executive AI Workforces and Enterprise Operating Systems.',
    status: 'Idea',
    lifecycleStatus: 'Idea',
    progress: 18,
    created: '2026-07-03T15:43:00.000Z',
    lastUpdated: now,
    relatedCapabilities: ['EOS-CAP-0005', 'EOS-ORG-DIR-002'],
    relatedEnterpriseObjects: ['EOS-EXEC-LEADERSHIP-TEAM', 'EOS-AGENT-ATHENA'],
    relatedWorkflows: ['EOS-WF-KNOWLEDGE-MANAGEMENT', 'EOS-WF-AGENT-COORDINATION'],
    relatedEvents: ['EOS-EVENT-AKR-KNOWLEDGE-OBJECT-CREATED'],
    tags: ['AI-Native Enterprise', 'Executive Agents', 'Operating Systems'],
    publicationTarget: 'Research Note',
    patentPotential: false,
    investorReady: false,
    publicationReady: false,
    linkedDocuments: ['backend/docs/capabilities/EOS-ORG-DIR-002.md'],
    previewContent: {
      executiveSummary:
        'The AI-Native Enterprise research note explores how executive AI workforces can operate inside enterprise operating systems.',
      coreArgument:
        'AI agents become strategically useful when they occupy accountable executive roles with governance, workflows, and measurable outputs.',
      researchQuestions: [
        'What organizational model best supports executive AI workforces?',
        'How should AI executives report status, knowledge, and accountability?',
        'What differentiates an AI-native enterprise operating system from task automation?'
      ],
      commercialRelevance:
        'Positions EOS as an executive operating platform rather than a generic automation tool.',
      relatedEOSCapability: 'EOS-CAP-0005',
      nextDraftingStep: 'Create the first research outline and connect it to the Executive Leadership Team model.'
    },
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Idea',
      healthScore: 68,
      progress: 18,
      summary: 'Research idea is captured and awaiting outline development.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Create an outline when research priority is approved.',
      availableActions: [
        'Open',
        'Continue Writing',
        'Request More Information',
        'Assign References',
        'Generate LinkedIn Article',
        'Schedule Review'
      ]
    })
  }
];

export const agentKnowledgeRepositories = executiveAgents.map((agent) => {
  const knowledgeObjects = agentKnowledgeObjects.filter((knowledgeObject) => knowledgeObject.ownerAgent === agent.name);
  const publicationReadyCount = knowledgeObjects.filter((knowledgeObject) => knowledgeObject.publicationReady).length;
  const investorReadyCount = knowledgeObjects.filter((knowledgeObject) => knowledgeObject.investorReady).length;
  const patentOpportunityCount = knowledgeObjects.filter((knowledgeObject) => knowledgeObject.patentPotential).length;
  const attentionObjects = knowledgeObjects.filter((knowledgeObject) => knowledgeObject.liveStatus.requiresAttention);

  return {
    id: `AKR-${agent.name.toUpperCase()}`,
    agentId: agent.id,
    agentName: agent.name,
    role: agent.role,
    status: knowledgeObjects.length > 0 ? 'Active' : 'Ready',
    knowledgeObjectCount: knowledgeObjects.length,
    researchProjectCount: knowledgeObjects.filter((knowledgeObject) => knowledgeObject.id.startsWith('RP-')).length,
    publicationReadyCount,
    investorReadyCount,
    patentOpportunityCount,
    recentActivity: knowledgeObjects[0]?.lastUpdated ?? now,
    attentionLevel: attentionObjects.length > 0 ? 'Medium' : 'No Action Required',
    knowledgeObjects,
    liveStatus: makeLiveStatus({
      status: attentionObjects.length > 0 ? 'Amber' : knowledgeObjects.length > 0 ? 'Green' : 'Grey',
      lifecycleStatus: knowledgeObjects.length > 0 ? 'In Progress' : 'Not Started',
      healthScore: knowledgeObjects.length > 0 ? 86 : 60,
      progress: knowledgeObjects.length > 0 ? 64 : 0,
      summary:
        knowledgeObjects.length > 0
          ? `${agent.name} owns ${knowledgeObjects.length} knowledge objects.`
          : `${agent.name} repository is initialized and awaiting knowledge objects.`,
      requiresAttention: attentionObjects.length > 0,
      attentionLevel: attentionObjects.length > 0 ? 'Medium' : 'No Action Required',
      recommendedAction:
        attentionObjects.length > 0
          ? 'Review knowledge objects that require research or executive attention.'
          : 'Capture new agent-generated knowledge when available.',
      availableActions: ['Open', 'Review knowledge objects', 'Prepare publication pipeline', 'Schedule Review']
    })
  };
});
