const workspaceDefinitionsBase = [
  {
    id: 'headquarters',
    label: 'Headquarters',
    marker: 'HQ',
    description: 'CEO cockpit, Executive Council, and Executive Offices.',
    defaultRoute: 'cockpit',
    routes: ['cockpit', 'council', 'offices'],
    items: [
      {
        id: 'cockpit',
        label: 'CEO Cockpit',
        route: 'cockpit',
        description: 'Executive operating summary for EOS health, value, priorities, and attention.'
      },
      {
        id: 'council',
        label: 'Executive Council',
        route: 'council',
        description: 'Leadership structure, executive focus, health, and recommended actions.'
      },
      {
        id: 'offices',
        label: 'Executive Offices',
        route: 'offices',
        description: 'Department offices for portfolio, KPIs, knowledge, approvals, and briefings.'
      }
    ]
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    marker: 'EN',
    description: 'Strategy, investment thesis, governance, PMO, roadmap, and programs.',
    defaultRoute: 'investment-thesis',
    routes: ['strategy', 'investment-thesis', 'governance', 'pmo', 'three-horizon-roadmap', 'roadmap', 'programs'],
    items: [
      {
        id: 'strategy',
        label: 'Strategy',
        route: 'strategy',
        description: 'Approved business strategy, strategic objectives, and alignment status.'
      },
      {
        id: 'investment-thesis',
        label: 'Investment Thesis',
        route: 'investment-thesis',
        description: 'Strategic alignment between EOS implementation, investor thesis, and commercialization roadmap.'
      },
      {
        id: 'governance',
        label: 'Governance',
        route: 'governance',
        description: 'Governance approvals, open items, and executive decision posture.'
      },
      {
        id: 'pmo',
        label: 'PMO',
        route: 'pmo',
        description: 'Program Management Office operating view and delivery governance.'
      },
      {
        id: 'three-horizon-roadmap',
        label: 'Three-Horizon Roadmap',
        route: 'three-horizon-roadmap',
        description: 'Foundation, commercial scale, and digital economy roadmap.'
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        route: 'roadmap',
        description: 'Master Roadmap phases, milestones, risks, and current capability.'
      },
      {
        id: 'programs',
        label: 'Programs',
        route: 'programs',
        description: 'Strategic programs, ownership, progress, and business impact.'
      }
    ]
  },
  {
    id: 'enterprise-value',
    label: 'Enterprise Value',
    marker: 'EV',
    description: 'Flywheel, valuation, revenue, DTAs, Second Balance Sheet, and readiness.',
    defaultRoute: 'master-monitoring',
    routes: [
      'master-monitoring',
      'onboarded-enterprises',
      'technology-flywheel',
      'valuation',
      'revenue-engine',
      'second-balance-sheet',
      'digital-twin-assets',
      'enterprise-onboarding',
      'assimilation-pipeline',
      'digital-mirrors',
      'dta-candidates',
      'data-feed-requirements',
      'human-validation',
      'enterprise-home',
      'digital-twin-structure',
      'data-feeds',
      'systems',
      'enterprise-assets',
      'human-workflows',
      'dta-lifecycle',
      'enterprise-profile',
      'investor-readiness',
      'commercial-readiness',
      'investor-centre'
    ],
    items: [
      {
        id: 'master-monitoring',
        label: 'Master Monitoring',
        route: 'master-monitoring',
        description: 'Visual enterprise monitoring across DTAs, systems, data feeds, alerts, governance, and approvals.'
      },
      {
        id: 'onboarded-enterprises',
        label: 'Onboarded Enterprises',
        route: 'onboarded-enterprises',
        description: 'Portfolio of onboarded enterprises and organizations, with health, DTA readiness, feed readiness, agents, and validation status.'
      },
      {
        id: 'technology-flywheel',
        label: 'Technology Flywheel',
        route: 'technology-flywheel',
        description: 'How knowledge, agents, Enterprise Objects, DTAs, decisions, and value reinforce each other.'
      },
      {
        id: 'valuation',
        label: 'Valuation',
        route: 'valuation',
        description: 'Internal digital enterprise valuation estimates and value drivers.'
      },
      {
        id: 'revenue-engine',
        label: 'Revenue Engine',
        route: 'revenue-engine',
        description: 'Revenue opportunities, maturity, market potential, and dependencies.'
      },
      {
        id: 'second-balance-sheet',
        label: 'Second Balance Sheet',
        route: 'second-balance-sheet',
        description: 'Digital asset metrics and operational value framework.'
      },
      {
        id: 'dta-lifecycle',
        label: 'DTA Lifecycle',
        route: 'dta-lifecycle',
        description: 'Discovery through exchange listing lifecycle for Digital Twin Assets.'
      },
      {
        id: 'enterprise-profile',
        label: 'Enterprise Profile',
        route: 'enterprise-profile',
        description: 'ePercent as the first live enterprise running on EOS.'
      },
      {
        id: 'investor-readiness',
        label: 'Investor Readiness',
        route: 'investor-readiness',
        description: 'Investor readiness score, strengths, gaps, and next action.'
      },
      {
        id: 'commercial-readiness',
        label: 'Commercial Readiness',
        route: 'commercial-readiness',
        description: 'Commercial readiness score, strengths, gaps, and next action.'
      },
      {
        id: 'digital-twin-assets',
        label: 'Digital Twin Assets',
        route: 'digital-twin-assets',
        description: 'DTA formation, monitoring, and commercialization readiness.'
      },
      {
        id: 'enterprise-onboarding',
        label: 'Enterprise Onboarding',
        route: 'enterprise-onboarding',
        description: 'Enterprise intake, known structure, assigned agents, and onboarding progress.'
      },
      {
        id: 'assimilation-pipeline',
        label: 'Assimilation Pipeline',
        route: 'assimilation-pipeline',
        description: 'Enterprise intake through Digital Mirror, DTA candidates, data feeds, validation, and formation.'
      },
      {
        id: 'digital-mirrors',
        label: 'Digital Mirrors',
        route: 'digital-mirrors',
        description: 'Pre-DTA enterprise mirrors with object, relationship, system, asset, process, knowledge, and risk maps.'
      },
      {
        id: 'dta-candidates',
        label: 'DTA Candidates',
        route: 'dta-candidates',
        description: 'Candidate Digital Twin Assets, missing data, valuation potential, risk, and validation needs.'
      },
      {
        id: 'data-feed-requirements',
        label: 'Feed Requirements',
        route: 'data-feed-requirements',
        description: 'Required fields, cadence, real-time needs, connection status, quality status, and fallback requirements.'
      },
      {
        id: 'human-validation',
        label: 'Human Validation',
        route: 'human-validation',
        description: 'Validation checklist for identity, ownership, hierarchy, systems, feeds, candidates, valuation, and governance.'
      },
      {
        id: 'enterprise-home',
        label: 'Enterprise Home',
        route: 'enterprise-home',
        description: 'Visual homes for onboarded enterprise Digital Twin Assets.'
      },
      {
        id: 'digital-twin-structure',
        label: 'Digital Twin Structure',
        route: 'digital-twin-structure',
        description: 'Layered enterprise architecture and future digital twin generation process.'
      },
      {
        id: 'data-feeds',
        label: 'Data Feeds',
        route: 'data-feeds',
        description: 'Simulated telemetry feeds with UTC storage and local enterprise display time.'
      },
      {
        id: 'systems',
        label: 'Systems',
        route: 'systems',
        description: 'Operational, safety, production, commercial, and governance system status.'
      },
      {
        id: 'enterprise-assets',
        label: 'Assets',
        route: 'enterprise-assets',
        description: 'Primary assets represented inside each enterprise Digital Twin.'
      },
      {
        id: 'human-workflows',
        label: 'Human Workflows',
        route: 'human-workflows',
        description: 'Human approval points, governance decisions, and review pathways.'
      },
      {
        id: 'investor-centre',
        label: 'Investor Centre',
        route: 'investor-centre',
        description: 'Investor notes, commercial readiness, and board-level evidence.'
      }
    ]
  },
  {
    id: 'ai-workforce',
    label: 'AI Workforce',
    marker: 'AI',
    description: 'Agents, communications, activity, calendar, and performance.',
    defaultRoute: 'agents',
    routes: ['agents', 'communications', 'activity', 'calendar', 'performance'],
    items: [
      {
        id: 'agents',
        label: 'Agents',
        route: 'agents',
        description: 'Executive agent roster, health, capability ownership, and current work.'
      },
      {
        id: 'communications',
        label: 'Communications',
        route: 'communications',
        description: 'Internal agent message threads and response requirements.'
      },
      {
        id: 'activity',
        label: 'Activity',
        route: 'activity',
        description: 'Live agent activity, progress, and attention requests.'
      },
      {
        id: 'calendar',
        label: 'Calendar',
        route: 'calendar',
        description: 'Local agent operating calendar and review sessions.'
      },
      {
        id: 'performance',
        label: 'Performance',
        route: 'performance',
        description: 'Agent performance indicators and workforce operating posture.'
      }
    ]
  },
  {
    id: 'knowledge',
    label: 'KIPR',
    marker: 'KN',
    description: 'Knowledge, intellectual property, patents, publications, and research assets.',
    defaultRoute: 'kipr',
    routes: ['kipr', 'knowledge', 'white-papers', 'academic-papers', 'patents', 'publications'],
    items: [
      {
        id: 'kipr',
        label: 'KIPR',
        route: 'kipr',
        description: 'Knowledge, Intellectual Property, Patents, and Research operating view.'
      },
      {
        id: 'knowledge',
        label: 'Knowledge Vault',
        route: 'knowledge',
        description: 'Agent Knowledge Repositories and managed knowledge assets.'
      },
      {
        id: 'white-papers',
        label: 'White Papers',
        route: 'white-papers',
        description: 'White paper assets, draft state, and publication readiness.'
      },
      {
        id: 'academic-papers',
        label: 'Academic Papers',
        route: 'academic-papers',
        description: 'Academic research assets, research questions, and target venues.'
      },
      {
        id: 'patents',
        label: 'Patents',
        route: 'patents',
        description: 'Patent draft opportunities and intellectual property pipeline.'
      },
      {
        id: 'publications',
        label: 'Publications',
        route: 'publications',
        description: 'Publication portfolio, readiness, and executive review needs.'
      }
    ]
  },
  {
    id: 'platform',
    label: 'Platform',
    marker: 'PL',
    description: 'Administration, audit, identity, intake, storage, backups, health, and releases.',
    defaultRoute: 'administration',
    routes: ['administration', 'audit', 'startup-experience', 'identity-media', 'organization-intake', 'repository-links', 'storage', 'backups', 'health', 'releases'],
    items: [
      {
        id: 'administration',
        label: 'Administration',
        route: 'administration',
        description: 'Platform administration center, safety posture, and governed actions.'
      },
      {
        id: 'audit',
        label: 'Audit',
        route: 'audit',
        description: 'Capability readiness, functional coverage, placeholder register, technical debt, and maturity scoring.'
      },
      {
        id: 'startup-experience',
        label: 'Startup Experience',
        route: 'startup-experience',
        description: 'Modern EOS operating-system startup screen and boot sequence.'
      },
      {
        id: 'identity-media',
        label: 'Identity Media',
        route: 'identity-media',
        description: 'Human profile pictures, functional agent avatars, company logos, and organization identity media.'
      },
      {
        id: 'organization-intake',
        label: 'Organization Intake',
        route: 'organization-intake',
        description: 'Import organization files and extract useful repository signals.'
      },
      {
        id: 'repository-links',
        label: 'Repository Links',
        route: 'repository-links',
        description: 'External cloud-drive links for large organization repositories.'
      },
      {
        id: 'storage',
        label: 'Storage',
        route: 'storage',
        description: 'Persistent data store health, collections, and warnings.'
      },
      {
        id: 'backups',
        label: 'Backups',
        route: 'backups',
        description: 'Backup status, latest archive, checksum, and restore validation.'
      },
      {
        id: 'health',
        label: 'Health',
        route: 'health',
        description: 'Platform health, running services, APIs, and warnings.'
      },
      {
        id: 'releases',
        label: 'Releases',
        route: 'releases',
        description: 'Release version, release notes, Git status, and readiness posture.'
      }
    ]
  },
  {
    id: 'development',
    label: 'Development',
    marker: 'DV',
    description: 'Capabilities, architecture, and engineering controls.',
    defaultRoute: 'assets',
    routes: ['assets', 'industry-framework', 'architecture', 'engineering'],
    items: [
      {
        id: 'assets',
        label: 'Capabilities',
        route: 'assets',
        description: 'Registered capabilities and Enterprise Objects.'
      },
      {
        id: 'industry-framework',
        label: 'Industry Framework',
        route: 'industry-framework',
        description: 'Cross-industry templates, DTA candidates, and example opportunities.'
      },
      {
        id: 'architecture',
        label: 'Architecture',
        route: 'architecture',
        description: 'Architecture standards, dependencies, and technical debt.'
      },
      {
        id: 'engineering',
        label: 'Engineering',
        route: 'engineering',
        description: 'Build controls, engineering rules, and quality gates.'
      }
    ]
  },
  {
    id: 'my-workspace',
    label: 'My Workspace',
    marker: 'ME',
    description: 'Personal briefing, tasks, decisions, and notes.',
    defaultRoute: 'briefing',
    routes: ['workspace', 'briefing', 'tasks', 'decisions', 'notes'],
    items: [
      {
        id: 'briefing',
        label: 'Briefing',
        route: 'briefing',
        description: 'Personal executive briefing and current priority.'
      },
      {
        id: 'tasks',
        label: 'Tasks',
        route: 'tasks',
        description: 'Future task queue and executive assignments.'
      },
      {
        id: 'decisions',
        label: 'Decisions',
        route: 'decisions',
        description: 'Future decision queue and governance approvals.'
      },
      {
        id: 'notes',
        label: 'Notes',
        route: 'notes',
        description: 'Future executive notes and saved context.'
      }
    ]
  }
]

const enterpriseValueWorkspace = workspaceDefinitionsBase.find((workspace) => workspace.id === 'enterprise-value')

export const workspaceDefinitions = enterpriseValueWorkspace
  ? [
      enterpriseValueWorkspace,
      ...workspaceDefinitionsBase.filter((workspace) => workspace.id !== 'enterprise-value')
    ]
  : workspaceDefinitionsBase

export function workspaceForRoute(route) {
  return (
    workspaceDefinitions.find((workspace) => workspace.routes.includes(route)) ??
    workspaceDefinitions[0]
  )
}

export function itemForRoute(route) {
  const workspace = workspaceForRoute(route)

  return workspace.items.find((item) => item.route === route) ?? null
}
