# Mission Control Automated Frontend Review

## Component Inventory
frontend/src/components/AiDevelopmentOfficeView.css
frontend/src/components/AiDevelopmentOfficeView.jsx
frontend/src/components/AiWorkforceAdministrationView.jsx
frontend/src/components/AiWorkforceOperationsView.jsx
frontend/src/components/AttentionIndicator.jsx
frontend/src/components/AuditReadinessView.jsx
frontend/src/components/Breadcrumbs.jsx
frontend/src/components/CeoCockpitView.jsx
frontend/src/components/CommandPalette.jsx
frontend/src/components/ContextNavigation.jsx
frontend/src/components/DashboardHeader.jsx
frontend/src/components/EosStartupScreen.jsx
frontend/src/components/ExecutiveActionsPanel.jsx
frontend/src/components/ExecutiveCommandBar.jsx
frontend/src/components/ExecutiveCouncilView.jsx
frontend/src/components/ExecutiveOfficeView.jsx
frontend/src/components/ExecutiveTooltip.jsx
frontend/src/components/FoundationView.jsx
frontend/src/components/IdentityIntakeView.jsx
frontend/src/components/KnowledgeAssetViewer.jsx
frontend/src/components/KnowledgeObjectDetail.jsx
frontend/src/components/KnowledgeRepositoryPanel.jsx
frontend/src/components/LiveStatusPanel.jsx
frontend/src/components/MasterMonitoringView.jsx
frontend/src/components/MetricPill.jsx
frontend/src/components/MissionControlModeToggle.jsx
frontend/src/components/ObjectList.jsx
frontend/src/components/OnboardedEnterprisesView.jsx
frontend/src/components/OnboardingAssimilationView.jsx
frontend/src/components/PersistentNavigation.jsx
frontend/src/components/PlatformAdministrationCenter.jsx
frontend/src/components/PmoView.jsx
frontend/src/components/PresentationModeToggle.jsx
frontend/src/components/StatusCard.jsx
frontend/src/components/StorageHealthPanel.jsx
frontend/src/components/StrategicAlignmentView.jsx
frontend/src/components/StrategicLayerView.jsx
frontend/src/components/WorkspaceHome.jsx
frontend/src/components/WorkspaceRail.jsx
frontend/src/components/WorkspaceTile.jsx

## Navigation Structure
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
    routes: ['agents', 'communications', 'activity', 'calendar', 'performance', 'ai-workforce-admin'],
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
      },
      {
        id: 'ai-workforce-admin',
        label: 'AI Workforce Admin',
        route: 'ai-workforce-admin',
        description: 'Configure AI providers, models, health checks, and dispatch readiness.'
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

## Main Route Rendering
175:  const [missionControlMode, setMissionControlMode] = useState(
397:  const activeWorkspace = missionControlMode === 'lobby' ? null : workspaceForRoute(missionControlMode)
399:  const activeWorkspaceItem = missionControlMode === 'lobby' ? null : itemForRoute(missionControlMode)
506:    if (missionControlMode === 'lobby') {
520:    if (missionControlMode === 'cockpit') {
534:    if (missionControlMode === 'council') {
544:    if (missionControlMode === 'offices') {
554:    if (missionControlMode === 'kipr') {
555:      return <StrategicAlignmentView mode={missionControlMode} strategicAlignment={strategicAlignment} />
558:    if (['knowledge', 'white-papers', 'academic-papers', 'patents', 'publications'].includes(missionControlMode)) {
562:    if (missionControlMode === 'strategy') {
566:    if (missionControlMode === 'onboarded-enterprises') {
577:    ].includes(missionControlMode)) {
578:      return <OnboardingAssimilationView data={onboardingAssimilation} mode={missionControlMode} />
589:    ].includes(missionControlMode)) {
590:      return <MasterMonitoringView data={masterMonitoring} mode={missionControlMode} onboardingData={onboardingAssimilation} />
603:    ].includes(missionControlMode)) {
604:      return <StrategicAlignmentView mode={missionControlMode} strategicAlignment={strategicAlignment} />
607:    if (missionControlMode === 'administration') {
620:    if (missionControlMode === 'audit') {
624:    if (['identity-media', 'organization-intake', 'repository-links', 'startup-experience'].includes(missionControlMode)) {
629:          mode={missionControlMode}
638:    if (missionControlMode === 'ai-workforce-admin') {
642:    if (['communications', 'activity', 'calendar', 'performance', 'agents'].includes(missionControlMode)) {
650:          mode={missionControlMode}
655:    if (missionControlMode === 'engineering') {
659:    if (missionControlMode === 'assets') {
663:    if (['pmo', 'programs', 'roadmap'].includes(missionControlMode)) {
684:    ].includes(missionControlMode)) {
690:          mode={missionControlMode}
758:            {missionControlMode !== 'lobby' ? (
760:                activeMode={missionControlMode}

## API Usage
frontend/src/components/AiWorkforceAdministrationView.jsx:3:  fetchAiWorkforceMembers,
frontend/src/components/AiWorkforceAdministrationView.jsx:4:  fetchAiWorkforceProviderHealth,
frontend/src/components/AiWorkforceAdministrationView.jsx:5:  fetchSprintReport
frontend/src/components/AiWorkforceAdministrationView.jsx:15:      fetchAiWorkforceMembers(),
frontend/src/components/AiWorkforceAdministrationView.jsx:16:      fetchAiWorkforceProviderHealth(),
frontend/src/components/AiWorkforceAdministrationView.jsx:17:      fetchSprintReport()
frontend/src/App.jsx:29:  fetchAiDevelopmentOffice,
frontend/src/App.jsx:30:  fetchCoreStatus,
frontend/src/App.jsx:31:  fetchDecisionIntelligence,
frontend/src/App.jsx:32:  fetchAgents,
frontend/src/App.jsx:33:  fetchEnterpriseObjects,
frontend/src/App.jsx:34:  fetchAudit,
frontend/src/App.jsx:36:  fetchAdminActions,
frontend/src/App.jsx:37:  fetchAgentActivity,
frontend/src/App.jsx:38:  fetchAgentAttention,
frontend/src/App.jsx:39:  fetchAgentCalendar,
frontend/src/App.jsx:40:  fetchAgentMessages,
frontend/src/App.jsx:41:  fetchExecutiveActions,
frontend/src/App.jsx:42:  fetchExecutiveCouncil,
frontend/src/App.jsx:43:  fetchExecutiveOffices,
frontend/src/App.jsx:44:  fetchIdentityMedia,
frontend/src/App.jsx:45:  fetchKernel,
frontend/src/App.jsx:46:  fetchKnowledgeRepositories,
frontend/src/App.jsx:47:  fetchMasterMonitoring,
frontend/src/App.jsx:48:  fetchOnboardingAssimilation,
frontend/src/App.jsx:49:  fetchOrganizationIntake,
frontend/src/App.jsx:50:  fetchPlatform,
frontend/src/App.jsx:51:  fetchPlatformAdmin,
frontend/src/App.jsx:52:  fetchPlatformNavigation,
frontend/src/App.jsx:53:  fetchPmo,
frontend/src/App.jsx:54:  fetchStartupExperience,
frontend/src/App.jsx:55:  fetchStrategicAlignment,
frontend/src/App.jsx:56:  fetchStrategicLayer,
frontend/src/App.jsx:57:  fetchStorageCollections,
frontend/src/App.jsx:58:  fetchStorageStatus,
frontend/src/App.jsx:220:      fetchAiDevelopmentOffice(),
frontend/src/App.jsx:221:      fetchCoreStatus(),
frontend/src/App.jsx:222:      fetchAgents(),
frontend/src/App.jsx:223:      fetchEnterpriseObjects(),
frontend/src/App.jsx:224:      fetchExecutiveActions(),
frontend/src/App.jsx:225:      fetchAdminActions(),
frontend/src/App.jsx:226:      fetchAgentActivity(),
frontend/src/App.jsx:227:      fetchAgentAttention(),
frontend/src/App.jsx:228:      fetchAgentCalendar(),
frontend/src/App.jsx:229:      fetchAgentMessages(),
frontend/src/App.jsx:230:      fetchAudit(),
frontend/src/App.jsx:231:      fetchExecutiveCouncil(),
frontend/src/App.jsx:232:      fetchExecutiveOffices(),
frontend/src/App.jsx:233:      fetchIdentityMedia(),
frontend/src/App.jsx:234:      fetchKnowledgeRepositories(),
frontend/src/App.jsx:235:      fetchKernel(),
frontend/src/App.jsx:236:      fetchDecisionIntelligence(),
frontend/src/App.jsx:237:      fetchMasterMonitoring(),
frontend/src/App.jsx:238:      fetchOnboardingAssimilation(),
frontend/src/App.jsx:239:      fetchOrganizationIntake(),
frontend/src/App.jsx:240:      fetchPlatform(),
frontend/src/App.jsx:241:      fetchPlatformAdmin(),
frontend/src/App.jsx:242:      fetchPlatformNavigation(),
frontend/src/App.jsx:243:      fetchPmo(),
frontend/src/App.jsx:244:      fetchStartupExperience(),
frontend/src/App.jsx:245:      fetchStrategicAlignment(),
frontend/src/App.jsx:246:      fetchStrategicLayer(),
frontend/src/App.jsx:247:      fetchStorageStatus(),
frontend/src/App.jsx:248:      fetchStorageCollections(),
frontend/src/services/api.js:42:export function fetchCoreStatus() {
frontend/src/services/api.js:46:export function fetchEnterpriseObjects() {
frontend/src/services/api.js:50:export function fetchAgents() {
frontend/src/services/api.js:54:export function fetchExecutiveCouncil() {
frontend/src/services/api.js:58:export function fetchExecutiveOffices() {
frontend/src/services/api.js:62:export function fetchExecutiveActions() {
frontend/src/services/api.js:66:export function fetchKnowledgeRepositories() {
frontend/src/services/api.js:70:export function fetchPmo() {
frontend/src/services/api.js:74:export function fetchPlatform() {
frontend/src/services/api.js:78:export function fetchPlatformAdmin() {
frontend/src/services/api.js:82:export function fetchAudit() {
frontend/src/services/api.js:86:export function fetchPlatformNavigation() {
frontend/src/services/api.js:90:export function fetchAdminActions() {
frontend/src/services/api.js:94:export function fetchAgentMessages() {
frontend/src/services/api.js:98:export function fetchAgentActivity() {
frontend/src/services/api.js:102:export function fetchAgentAttention() {
frontend/src/services/api.js:106:export function fetchAgentCalendar() {
frontend/src/services/api.js:110:export function fetchStorageStatus() {
frontend/src/services/api.js:114:export function fetchStorageCollections() {
frontend/src/services/api.js:118:export function fetchStrategicAlignment() {
frontend/src/services/api.js:122:export function fetchMasterMonitoring() {
frontend/src/services/api.js:126:export function fetchOnboardingAssimilation() {
frontend/src/services/api.js:130:export function fetchStartupExperience() {
frontend/src/services/api.js:134:export function fetchIdentityMedia() {
frontend/src/services/api.js:138:export function fetchOrganizationIntake() {
frontend/src/services/api.js:154:export async function fetchStrategicLayer() {
frontend/src/services/api.js:186:export function fetchKnowledgeRepository(agent) {
frontend/src/services/api.js:190:export function fetchKnowledgeObject(id) {
frontend/src/services/api.js:194:export function fetchKernel() {
frontend/src/services/api.js:198:export function fetchDecisionIntelligence() {
frontend/src/services/api.js:202:export function fetchAiDevelopmentOffice() {
frontend/src/services/api.js:206:export function fetchAiWorkforceMembers() {
frontend/src/services/api.js:210:export function fetchAiWorkforceProviderHealth() {
frontend/src/services/api.js:214:export function fetchSprintReport() {

## Placeholder / Future / Pending References
frontend/src/navigation/missionControlWorkspaces.js:227:        description: 'Layered enterprise architecture and future digital twin generation process.'
frontend/src/navigation/missionControlWorkspaces.js:371:        description: 'Capability readiness, functional coverage, placeholder register, technical debt, and maturity scoring.'
frontend/src/navigation/missionControlWorkspaces.js:475:        description: 'Future task queue and executive assignments.'
frontend/src/navigation/missionControlWorkspaces.js:481:        description: 'Future decision queue and governance approvals.'
frontend/src/navigation/missionControlWorkspaces.js:487:        description: 'Future executive notes and saved context.'
frontend/src/App.css:2532:.office-placeholder-grid {
frontend/src/App.css:2551:.office-placeholder > span,
frontend/src/App.css:2563:.office-placeholder strong {
frontend/src/App.css:2570:.office-placeholder p,
frontend/src/App.css:2602:.office-placeholder,
frontend/src/App.css:2726:.office-placeholder {
frontend/src/App.css:2773:.office-placeholder-grid {
frontend/src/App.css:4060:.identity-upload-row button:disabled {
frontend/src/App.css:4484:.dashboard-shell.is-presentation-mode .office-placeholder-grid,
frontend/src/App.css:4639:  .office-placeholder-grid,
frontend/src/components/IdentityIntakeView.jsx:139:            <button disabled={isUploading} onClick={() => profilePictureInputRef.current?.click()} type="button">
frontend/src/components/IdentityIntakeView.jsx:145:              disabled={isUploading}
frontend/src/components/IdentityIntakeView.jsx:154:            <button disabled={isUploading} onClick={() => logoInputRef.current?.click()} type="button">
frontend/src/components/IdentityIntakeView.jsx:160:              disabled={isUploading}
frontend/src/components/IdentityIntakeView.jsx:276:            placeholder="https://drive.example.com/folder"
frontend/src/components/IdentityIntakeView.jsx:324:            <small>{record.extractedSignals?.length ? record.extractedSignals.join(', ') : 'Signals pending'}</small>
frontend/src/components/ExecutiveCouncilView.jsx:43:          <dd>{executiveValue(action.approvalStatus, 'Pending Assessment')}</dd>
frontend/src/components/ExecutiveCouncilView.jsx:47:          <dd>{executiveValue(action.riskLevel, 'Pending Assessment')}</dd>
frontend/src/components/ExecutiveCouncilView.jsx:95:        <p>{executiveValue(profile.currentFocus, 'Focus pending executive review.')}</p>
frontend/src/components/AiWorkforceOperationsView.jsx:10:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
frontend/src/components/AuditReadinessView.jsx:4:  const normalizedStatus = executiveValue(status, 'Pending Assessment')
frontend/src/components/AuditReadinessView.jsx:81:            partial, placeholder, broken, and still required for EOS maturity.
frontend/src/components/AuditReadinessView.jsx:101:          <small>{summary.placeholders} placeholder capability classifications</small>
frontend/src/components/AuditReadinessView.jsx:138:            <h3>Display-Only & Placeholder Register</h3>
frontend/src/components/AuditReadinessView.jsx:141:            {(audit.placeholderRegister ?? []).map((item) => (
frontend/src/components/ExecutiveActionsPanel.jsx:14:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
frontend/src/components/ExecutiveActionsPanel.jsx:29:          <dd>{executiveValue(action.status, 'Pending Assessment')}</dd>
frontend/src/components/ExecutiveActionsPanel.jsx:33:          <dd>{executiveValue(action.approvalStatus, 'Pending Assessment')}</dd>
frontend/src/components/ExecutiveActionsPanel.jsx:37:          <dd>{executiveValue(action.riskLevel, 'Pending Assessment')}</dd>
frontend/src/components/ExecutiveActionsPanel.jsx:64:        <strong>Execution Disabled</strong>
frontend/src/components/ExecutiveActionsPanel.jsx:73:        <ActionMetric description={eosTooltips.attentionLevel} label="Pending Approval" value={summary.pendingApproval} />
frontend/src/components/StrategicAlignmentView.jsx:83:              <small>{item.recommendedFutureCapability}</small>
frontend/src/components/StrategicAlignmentView.jsx:162:              <dd>{executiveValue(activeStep?.enterpriseValueContribution, 'Pending Assessment')}</dd>
frontend/src/components/StrategicAlignmentView.jsx:331:            <strong>{executiveValue(value, 'Pending Assessment')}</strong>
frontend/src/components/AiWorkforceAdministrationView.jsx:93:            API credentials and live provider health checks are pending. Next step: connect OpenAI and run a live test mission.
frontend/src/components/AiWorkforceAdministrationView.jsx:101:          <Metric label="Sprint" value={report?.sprint?.id ?? 'Pending'} />
frontend/src/components/AiWorkforceAdministrationView.jsx:102:          <Metric label="Status" value={report?.sprint?.status ?? 'Pending'} />
frontend/src/components/AiWorkforceAdministrationView.jsx:103:          <Metric label="Maturity" value={report?.maturity?.status ?? 'Pending'} />
frontend/src/components/KnowledgeAssetViewer.jsx:92:              <em>{executiveValue(knowledgeObject.liveStatus.lifecycleStatus, 'Pending Assessment')}</em>
frontend/src/components/CeoCockpitView.jsx:18:    return 'Pending Assessment'
frontend/src/components/CeoCockpitView.jsx:155:          <strong>{actionSummary?.pendingApproval ?? 0}</strong>
frontend/src/components/CeoCockpitView.jsx:156:          <p>Executive actions are governed and execution remains disabled.</p>
frontend/src/components/WorkspaceHome.jsx:54:            <dd>{executiveValue(roadmap?.currentCapability, 'Pending assessment')}</dd>
frontend/src/components/StorageHealthPanel.jsx:19:          <ExecutiveTooltip description="Storage health reports whether EOS durable JSON collections are initialized, current, and ready for future database migration.">
frontend/src/components/StorageHealthPanel.jsx:23:        <h2>{executiveValue(storageStatus.storageStatus, 'Pending Assessment')}</h2>
frontend/src/components/StorageHealthPanel.jsx:37:          <dd>{executiveValue(storageStatus.lastUpdated, 'Pending Assessment')}</dd>
frontend/src/components/OnboardedEnterprisesView.jsx:3:    return 'Internal estimate pending'
frontend/src/components/OnboardedEnterprisesView.jsx:16:    return 'Pending assessment'
frontend/src/components/OnboardedEnterprisesView.jsx:114:        <span>{enterprise.mirror?.validationStatus ?? 'Digital Mirror pending'}</span>
frontend/src/components/MasterMonitoringView.jsx:11:    return 'Internal estimate pending'
frontend/src/components/MasterMonitoringView.jsx:213:                  <strong>{mirror?.name ?? 'Digital Mirror pending'}</strong>
frontend/src/components/MasterMonitoringView.jsx:234:            <span>Future Onboarding Workflow</span>
frontend/src/components/PlatformAdministrationCenter.jsx:10:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
frontend/src/components/PlatformAdministrationCenter.jsx:11:      {detail && <small>{executiveValue(detail, 'Pending Assessment')}</small>}
frontend/src/components/StrategicLayerView.jsx:6:    return 'Pending Assessment'
frontend/src/components/StrategicLayerView.jsx:22:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
frontend/src/components/StrategicLayerView.jsx:75:              <li key={note}>{executiveValue(note, 'Pending Assessment')}</li>
frontend/src/components/KnowledgeObjectDetail.jsx:9:  const values = Array.isArray(items) && items.length > 0 ? items : ['Pending Assessment']
frontend/src/components/KnowledgeObjectDetail.jsx:120:            <button disabled key={action} type="button">
frontend/src/components/FoundationView.jsx:79:    summary: 'The personal task queue is reserved for future governed assignments, delegated work, and executive follow-up items.',
frontend/src/components/FoundationView.jsx:85:    summary: 'The decision queue is reserved for future approvals, governance decisions, investment reviews, and release authorizations.',
frontend/src/components/FoundationView.jsx:97:    summary: 'The executive workspace foundation is ready for future personal tasks, briefings, approvals, and saved views.',
frontend/src/components/FoundationView.jsx:153:            <p>Backup health: {executiveValue(adminData?.backupHealth, 'Pending Assessment')}</p>
frontend/src/components/ExecutiveOfficeView.jsx:53:function PlaceholderPanel({ title, placeholder }) {
frontend/src/components/ExecutiveOfficeView.jsx:55:    <article className="office-placeholder">
frontend/src/components/ExecutiveOfficeView.jsx:57:      <strong>{executiveValue(placeholder.status, 'Future Capability')}</strong>
frontend/src/components/ExecutiveOfficeView.jsx:58:      <p>{executiveValue(placeholder.summary, 'This capability is planned for a future release.')}</p>
frontend/src/components/ExecutiveOfficeView.jsx:117:              <dd>{executiveValue(selectedOffice.estimatedCeoReviewTime, 'Pending Assessment')}</dd>
frontend/src/components/ExecutiveOfficeView.jsx:199:        <section className="office-placeholder-grid">
frontend/src/components/ExecutiveOfficeView.jsx:200:          <PlaceholderPanel title="Messages" placeholder={selectedOffice.messages} />
frontend/src/components/ExecutiveOfficeView.jsx:201:          <PlaceholderPanel title="Meetings" placeholder={selectedOffice.meetings} />
frontend/src/components/ExecutiveOfficeView.jsx:202:          <PlaceholderPanel title="Calendar" placeholder={selectedOffice.calendar} />
frontend/src/components/ExecutiveOfficeView.jsx:203:          <PlaceholderPanel title="Temporary Agents" placeholder={selectedOffice.temporaryAgents} />
frontend/src/components/CommandPalette.jsx:48:        placeholder="Search Athena, open backups, review Second Balance Sheet..."
frontend/src/components/CommandPalette.jsx:68:          <p>Command execution is pending governance approval. Navigation commands are available.</p>
frontend/src/components/ObjectList.jsx:24:              <p>{executiveValue(enterpriseObject.description, 'Description pending assessment.')}</p>
frontend/src/components/LiveStatusPanel.jsx:55:          <dd>{executiveValue(liveStatus?.lifecycleStatus, 'Pending Assessment')}</dd>
frontend/src/components/LiveStatusPanel.jsx:69:      <p className="live-summary">{executiveValue(liveStatus?.summary, 'Live status is pending assessment.')}</p>
frontend/src/components/AiDevelopmentOfficeView.jsx:20:          <small>{metrics.humanEngineeringLoad ?? 'Human engineering load tracking pending'}</small>
frontend/src/components/AiDevelopmentOfficeView.jsx:27:        <Metric label="Pending Reviews" value={metrics.pendingReviews ?? 0} />
frontend/src/components/PmoView.jsx:14:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
frontend/src/components/PmoView.jsx:100:                <p>{executiveValue(program.businessImpact, 'Business impact pending assessment.')}</p>
frontend/src/components/PmoView.jsx:152:                <p>{executiveValue(risk.mitigation, 'Mitigation pending assessment.')}</p>
frontend/src/App.jsx:394:  const pendingAttentionCount = agentAttention?.open ?? agentAttention?.summary?.openItems ?? attentionItems.filter(
frontend/src/App.jsx:424:    'ai-workforce': pendingAttentionCount,
frontend/src/App.jsx:718:        attentionCount={pendingAttentionCount}
frontend/src/design-system/eosDesignSystem.js:44:  unknown: 'Pending Assessment',
frontend/src/design-system/eosDesignSystem.js:55:    return value ? 'Yes' : 'Pending Assessment'
