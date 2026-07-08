import { useCallback, useEffect, useState } from 'react'
import './App.css'
import EnterpriseControlShell from './enterprise-control/EnterpriseControlShell.jsx'

import AiWorkforceOperationsView from './components/AiWorkforceOperationsView.jsx'
import AiWorkforceAdministrationView from './components/AiWorkforceAdministrationView.jsx'
import AiDevelopmentOfficeView from './components/AiDevelopmentOfficeView.jsx'
import AuditReadinessView from './components/AuditReadinessView.jsx'
import Breadcrumbs from './components/Breadcrumbs.jsx'
import CeoCockpitView from './components/CeoCockpitView.jsx'
import ContextNavigation from './components/ContextNavigation.jsx'
import ExecutiveCommandBar from './components/ExecutiveCommandBar.jsx'
import ExecutiveCouncilView from './components/ExecutiveCouncilView.jsx'
import ExecutiveOfficeView from './components/ExecutiveOfficeView.jsx'
import EosStartupScreen from './components/EosStartupScreen.jsx'
import EnterpriseIntelligenceRuntimePanel from './components/EnterpriseIntelligenceRuntimePanel.jsx'
import EnterpriseIntelligenceLanding from './components/EnterpriseIntelligenceLanding.jsx'
import FoundationView from './components/FoundationView.jsx'
import IdentityIntakeView from './components/IdentityIntakeView.jsx'
import KnowledgeRepositoryPanel from './components/KnowledgeRepositoryPanel.jsx'
import MasterMonitoringView from './components/MasterMonitoringView.jsx'
import ObjectList from './components/ObjectList.jsx'
import OnboardingAssimilationView from './components/OnboardingAssimilationView.jsx'
import OnboardedEnterprisesView from './components/OnboardedEnterprisesView.jsx'
import PmoView from './components/PmoView.jsx'
import PlatformAdministrationCenter from './components/PlatformAdministrationCenter.jsx'
import StrategicLayerView from './components/StrategicLayerView.jsx'
import StrategicAlignmentView from './components/StrategicAlignmentView.jsx'
import WorkspaceHome from './components/WorkspaceHome.jsx'
import WorkspaceRail from './components/WorkspaceRail.jsx'
import {
  fetchAiDevelopmentOffice,
  fetchCoreStatus,
  fetchDecisionIntelligence,
  fetchAgents,
  fetchEnterpriseObjects,
  fetchAudit,
  createRepositoryLink,
  fetchAdminActions,
  fetchAgentActivity,
  fetchAgentAttention,
  fetchAgentCalendar,
  fetchAgentMessages,
  fetchExecutiveActions,
  fetchExecutiveCouncil,
  fetchExecutiveOffices,
  fetchIdentityMedia,
  fetchKernel,
  fetchKnowledgeRepositories,
  fetchMasterMonitoring,
  fetchMissionControlRuntime,
  fetchOnboardingAssimilation,
  fetchOrganizationIntake,
  fetchPlatform,
  fetchPlatformAdmin,
  fetchPlatformNavigation,
  fetchPmo,
  fetchStartupExperience,
  fetchStrategicAlignment,
  fetchStrategicLayer,
  fetchStorageCollections,
  fetchStorageStatus,
  importOrganizationSource,
  uploadIdentityMedia,
} from './services/api.js'
import {
  itemForRoute,
  workspaceDefinitions,
  workspaceForRoute
} from './navigation/missionControlWorkspaces.js'

const missionControlRoutes = new Set([
  'assets',
  'administration',
  'agents',
  'ai-workforce-admin',
  'architecture',
  'audit',
  'backups',
  'calendar',
  'communications',
  'academic-papers',
  'briefing',
  'cockpit',
  'council',
  'decisions',
  'digital-twin-assets',
  'onboarded-enterprises',
  'enterprise-onboarding',
  'assimilation-pipeline',
  'digital-mirrors',
  'dta-candidates',
  'data-feed-requirements',
  'human-validation',
  'engineering',
  'governance',
  'health',
  'identity-media',
  'industry-framework',
  'investor-centre',
  'investor-readiness',
  'knowledge',
  'kipr',
  'lobby',
  'notes',
  'offices',
  'performance',
  'pmo',
  'patents',
  'programs',
  'publications',
  'roadmap',
  'releases',
  'second-balance-sheet',
  'strategy',
  'technology-flywheel',
  'three-horizon-roadmap',
  'revenue-engine',
  'dta-lifecycle',
  'enterprise-profile',
  'investment-thesis',
  'commercial-readiness',
  'data-feeds',
  'storage',
  'digital-twin-structure',
  'enterprise-assets',
  'enterprise-home',
  'human-workflows',
  'master-monitoring',
  'organization-intake',
  'systems',
  'repository-links',
  'startup-experience',
  'tasks',
  'valuation',
  'white-papers',
  'workspace',
  'activity',
])

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, '')

  if (!route) {
    window.location.hash = '#/lobby'
    return 'lobby'
  }

  return route
}

function App() {
  const [status, setStatus] = useState(null)
  const [aiDevelopmentOffice, setAiDevelopmentOffice] = useState(null)
  const [agentRegistry, setAgentRegistry] = useState(null)
  const [objectRegistry, setObjectRegistry] = useState(null)
  const [executiveActions, setExecutiveActions] = useState(null)
  const [executiveCouncil, setExecutiveCouncil] = useState(null)
  const [executiveOffices, setExecutiveOffices] = useState(null)
  const [adminActions, setAdminActions] = useState(null)
  const [agentActivity, setAgentActivity] = useState(null)
  const [agentAttention, setAgentAttention] = useState(null)
  const [agentCalendar, setAgentCalendar] = useState(null)
  const [agentMessages, setAgentMessages] = useState(null)
  const [audit, setAudit] = useState(null)
  const [identityMedia, setIdentityMedia] = useState(null)
  const [knowledgeRepositories, setKnowledgeRepositories] = useState(null)
  const [kernel, setKernel] = useState(null)
  const [decisionIntelligence, setDecisionIntelligence] = useState(null)
  const [masterMonitoring, setMasterMonitoring] = useState(null)
  const [missionControlRuntime, setMissionControlRuntime] = useState(null)
  const [onboardingAssimilation, setOnboardingAssimilation] = useState(null)
  const [organizationIntake, setOrganizationIntake] = useState(null)
  const [platform, setPlatform] = useState(null)
  const [platformAdmin, setPlatformAdmin] = useState(null)
  const [platformNavigation, setPlatformNavigation] = useState(null)
  const [pmo, setPmo] = useState(null)
  const [startupExperience, setStartupExperience] = useState(null)
  const [strategicAlignment, setStrategicAlignment] = useState(null)
  const [strategicLayer, setStrategicLayer] = useState(null)
  const [storageCollections, setStorageCollections] = useState(null)
  const [storageStatus, setStorageStatus] = useState(null)
  const [showStartup, setShowStartup] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDiscoveringEnterprise, setIsDiscoveringEnterprise] = useState(false)
  const [enterpriseDiscoveryError, setEnterpriseDiscoveryError] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const [missionControlMode, setMissionControlMode] = useState(
    'lobby'
  )
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [selectedOfficeId, setSelectedOfficeId] = useState('EOS-EXEC-ERIC-OLO')

  const reloadDashboard = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setStatus(null)
    setAiDevelopmentOffice(null)
    setAgentRegistry(null)
    setObjectRegistry(null)
    setExecutiveActions(null)
    setExecutiveCouncil(null)
    setExecutiveOffices(null)
    setAdminActions(null)
    setAgentActivity(null)
    setAgentAttention(null)
    setAgentCalendar(null)
    setAgentMessages(null)
    setAudit(null)
    setIdentityMedia(null)
    setKnowledgeRepositories(null)
        setKernel(null)
        setDecisionIntelligence(null)
    setMasterMonitoring(null)
    setMissionControlRuntime(null)
    setOnboardingAssimilation(null)
    setOrganizationIntake(null)
    setPlatform(null)
    setPlatformAdmin(null)
    setPlatformNavigation(null)
    setPmo(null)
    setStartupExperience(null)
    setStrategicAlignment(null)
    setStrategicLayer(null)
    setStorageCollections(null)
    setStorageStatus(null)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  useEffect(() => {
    let isCurrentRequest = true

    Promise.allSettled([
      fetchAiDevelopmentOffice(),
      fetchCoreStatus(),
      fetchAgents(),
      fetchEnterpriseObjects(),
      fetchExecutiveActions(),
      fetchAdminActions(),
      fetchAgentActivity(),
      fetchAgentAttention(),
      fetchAgentCalendar(),
      fetchAgentMessages(),
      fetchAudit(),
      fetchExecutiveCouncil(),
      fetchExecutiveOffices(),
      fetchIdentityMedia(),
      fetchKnowledgeRepositories(),
      fetchKernel(),
      fetchDecisionIntelligence(),
      fetchMasterMonitoring(),
      fetchMissionControlRuntime({
        source: 'https://epercent.ai',
        entityType: 'Enterprise',
        name: 'ePercent'
      }),
      fetchOnboardingAssimilation(),
      fetchOrganizationIntake(),
      fetchPlatform(),
      fetchPlatformAdmin(),
      fetchPlatformNavigation(),
      fetchPmo(),
      fetchStartupExperience(),
      fetchStrategicAlignment(),
      fetchStrategicLayer(),
      fetchStorageStatus(),
      fetchStorageCollections(),
    ])
      .then((results) => {
        const [
          aiDevelopmentOfficeResult,
        statusResult,
          agentsResult,
          objectsResult,
          executiveActionsResult,
          adminActionsResult,
          agentActivityResult,
          agentAttentionResult,
          agentCalendarResult,
          agentMessagesResult,
          auditResult,
          executiveCouncilResult,
          executiveOfficesResult,
          identityMediaResult,
          repositoriesResult,
          kernelResult,
          decisionIntelligenceResult,
          masterMonitoringResult,
          missionControlRuntimeResult,
          onboardingAssimilationResult,
          organizationIntakeResult,
          platformResult,
          platformAdminResult,
          platformNavigationResult,
          pmoResult,
          startupExperienceResult,
          strategicAlignmentResult,
          strategicLayerResult,
          storageStatusResult,
          storageCollectionsResult,
        ] = results.map((result) => result.status === 'fulfilled' ? result.value : null)

        const failedRequests = results.filter((result) => result.status === 'rejected')
        if (!isCurrentRequest) {
          return
        }

        setAiDevelopmentOffice(aiDevelopmentOfficeResult)
        setStatus(statusResult)
        setAgentRegistry(agentsResult)
        setObjectRegistry(objectsResult)
        setExecutiveActions(executiveActionsResult)
        setAdminActions(adminActionsResult)
        setAgentActivity(agentActivityResult)
        setAgentAttention(agentAttentionResult)
        setAgentCalendar(agentCalendarResult)
        setAgentMessages(agentMessagesResult)
        setAudit(auditResult)
        setExecutiveCouncil(executiveCouncilResult)
        setExecutiveOffices(executiveOfficesResult)
        setIdentityMedia(identityMediaResult)
        setKnowledgeRepositories(repositoriesResult)
        setKernel(kernelResult)
        setDecisionIntelligence(decisionIntelligenceResult)
        setMasterMonitoring(masterMonitoringResult)
        setMissionControlRuntime(missionControlRuntimeResult)
        console.log('Mission Control Runtime', missionControlRuntimeResult)
        setOnboardingAssimilation(onboardingAssimilationResult)
        setOrganizationIntake(organizationIntakeResult)
        setPlatform(platformResult)
        setPlatformAdmin(platformAdminResult)
        setPlatformNavigation(platformNavigationResult)
        setPmo(pmoResult)
        setStartupExperience(startupExperienceResult)
        setStrategicAlignment(strategicAlignmentResult)
        setStrategicLayer(strategicLayerResult)
        setStorageStatus(storageStatusResult)
        setStorageCollections(storageCollectionsResult)
        setError(
          failedRequests.length
            ? `${failedRequests.length} EOS module request(s) failed. Mission Control is running in degraded mode.`
            : null
        )
      })
      .catch((requestError) => {
        if (!isCurrentRequest) {
          return
        }

        setError(requestError.message)
        setStatus(null)
        setAiDevelopmentOffice(null)
        setAgentRegistry(null)
        setObjectRegistry(null)
        setExecutiveActions(null)
        setAdminActions(null)
        setAgentActivity(null)
        setAgentAttention(null)
        setAgentCalendar(null)
        setAgentMessages(null)
        setAudit(null)
        setExecutiveCouncil(null)
        setExecutiveOffices(null)
        setIdentityMedia(null)
        setKnowledgeRepositories(null)
        setKernel(null)
        setDecisionIntelligence(null)
        setMasterMonitoring(null)
    setMissionControlRuntime(null)
        setOnboardingAssimilation(null)
        setOrganizationIntake(null)
        setPlatform(null)
        setPlatformAdmin(null)
        setPlatformNavigation(null)
        setPmo(null)
        setStartupExperience(null)
        setStrategicAlignment(null)
        setStrategicLayer(null)
        setStorageCollections(null)
        setStorageStatus(null)
      })
      .finally(() => {
        if (!isCurrentRequest) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [requestVersion])

  useEffect(() => {
    const configuredDuration = startupExperience?.startupExperience?.displayDurationMs ?? 24500
    const minimumStartupDuration = 24500
    const startupDuration = Math.max(configuredDuration, minimumStartupDuration)

    const startupTimer = window.setTimeout(() => {
      setShowStartup(false)
    }, startupDuration)

    return () => {
      window.clearTimeout(startupTimer)
    }
  }, [startupExperience?.startupExperience?.displayDurationMs])

  const objects = objectRegistry?.objects ?? []
  const agents = agentRegistry?.agents ?? []
  const identityProfiles = identityMedia?.profiles ?? []
  const objectCount = objectRegistry?.count ?? objects.length
  const repositories = knowledgeRepositories?.repositories ?? []
  const storageCollectionCount = storageCollections?.count ?? storageStatus?.collectionsFound?.length ?? 0
  const navigationWorkspaceCount = platformNavigation?.navigation?.length ?? platformNavigation?.length ?? workspaceDefinitions.length
  const knowledgeObjectCount = repositories.reduce(
    (count, repository) => count + (repository.knowledgeObjects?.length ?? 0),
    0
  )
  const attentionItems = agentAttention?.attention ?? agentAttention?.items ?? []
  const pendingAttentionCount = agentAttention?.open ?? agentAttention?.summary?.openItems ?? attentionItems.filter(
    (item) => item.status !== 'Resolved'
  ).length ?? 0
  const activeWorkspace = missionControlMode === 'lobby' ? null : workspaceForRoute(missionControlMode)
  const activeWorkspaceId = activeWorkspace?.id ?? 'enterprise-value'
  const activeWorkspaceItem = missionControlMode === 'lobby' ? null : itemForRoute(missionControlMode)
  const enterpriseValue = masterMonitoring?.monitoring?.enterpriseValue ?? strategicLayer?.valuation?.digitalEnterpriseValue
  const enterpriseValueLabel = Number.isFinite(Number(enterpriseValue))
    ? new Intl.NumberFormat('en-US', {
        currency: 'USD',
        maximumFractionDigits: 0,
        notation: Number(enterpriseValue) >= 1000000 ? 'compact' : 'standard',
        style: 'currency'
      }).format(Number(enterpriseValue))
    : 'Awaiting data'
  const commandMetrics = {
    aiWorkforce: agents.length || status?.activeAgents,
    digitalTwinAssets:
      masterMonitoring?.monitoring?.digitalTwinAssets ??
      strategicLayer?.dtaMonitoring?.totalDigitalTwinAssets ??
      strategicLayer?.digitalTwinAssets?.length,
    enterpriseValue,
    enterpriseValueLabel,
    knowledgeAssets: knowledgeObjectCount,
    platformHealth: status?.status ?? platform?.status?.platformStatus
  }
  const attentionByWorkspace = {
    headquarters: executiveCouncil?.summary?.executiveAttentionRequired ?? 0,
    enterprise: pmo?.masterRoadmap?.risks?.length ?? 0,
    'enterprise-value': masterMonitoring?.monitoring?.alerts ?? strategicLayer?.governance?.openGovernanceItems?.length ?? 0,
    'ai-workforce': pendingAttentionCount,
    knowledge: repositories.filter((repository) => repository.attentionLevel && repository.attentionLevel !== 'No Action Required').length,
    platform:
      (platformAdmin?.systemWarnings?.length ?? platform?.operations?.systemWarnings?.length ?? 0) +
      identityProfiles.filter((profile) => profile.liveStatus?.requiresAttention).length,
    development: 0,
    'my-workspace': 0
  }
  const metricsByWorkspace = {
    headquarters: executiveCouncil?.profiles?.length ? `${executiveCouncil.profiles.length} executives` : 'Executive ready',
    enterprise: pmo?.masterRoadmap?.progress ? `${pmo.masterRoadmap.progress}% roadmap` : 'Roadmap ready',
    'enterprise-value': enterpriseValueLabel,
    'ai-workforce': agents.length ? `${agents.length} agents` : 'Workforce ready',
    knowledge: knowledgeObjectCount ? `${knowledgeObjectCount} assets` : 'Knowledge ready',
    platform: storageCollectionCount ? `${storageCollectionCount} collections` : platform?.status?.apiHealth ?? platformAdmin?.apiHealth ?? 'Operational',
    development: `${objectCount} objects`,
    'my-workspace': `${navigationWorkspaceCount} workspaces`
  }

  useEffect(() => {
    const applyRoute = () => {
      const route = routeFromHash()

      if (route.startsWith('executive-offices/')) {
        const executiveId = decodeURIComponent(route.replace('executive-offices/', ''))
        setSelectedOfficeId(executiveId)
        setMissionControlMode('offices')
        return
      }

      if (missionControlRoutes.has(route)) {
        setMissionControlMode(route)
      }
    }

    applyRoute()
    window.addEventListener('hashchange', applyRoute)

    return () => {
      window.removeEventListener('hashchange', applyRoute)
    }
  }, [])

  const changeMissionControlMode = useCallback((mode) => {
    setMissionControlMode(mode)
    window.location.hash = `#/${mode}`
  }, [])

  const openWorkspace = useCallback((workspace) => {
    changeMissionControlMode(workspace.defaultRoute)
  }, [changeMissionControlMode])

  const selectExecutiveOffice = useCallback((executiveId) => {
    setSelectedOfficeId(executiveId)
    setMissionControlMode('offices')
    window.location.hash = `#/executive-offices/${encodeURIComponent(executiveId)}`
  }, [])

  const openExecutiveOffice = useCallback((executiveId) => {
    selectExecutiveOffice(executiveId)
  }, [selectExecutiveOffice])

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((currentValue) => !currentValue)
  }, [])

  const handleUploadIdentityMedia = useCallback(async (payload) => {
    await uploadIdentityMedia(payload)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  const handleImportOrganizationSource = useCallback(async (payload) => {
    await importOrganizationSource(payload)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  const handleCreateRepositoryLink = useCallback(async (payload) => {
    await createRepositoryLink(payload)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  async function handleDiscoverEnterprise(source) {
    setIsDiscoveringEnterprise(true)
    setEnterpriseDiscoveryError(null)

    try {
      const normalizedSource = source.startsWith('http')
        ? source
        : `https://${source}`

      const discovered = await fetchMissionControlRuntime({
        source: normalizedSource,
        entityType: 'Enterprise',
        name: new URL(normalizedSource).hostname.replace(/^www\./, '')
      })

      setMissionControlRuntime(discovered)
    } catch (discoverError) {
      setEnterpriseDiscoveryError(discoverError.message)
    } finally {
      setIsDiscoveringEnterprise(false)
    }
  }

  function renderMissionControlView() {
    if (missionControlMode === 'lobby') {
      return (
        <EnterpriseControlShell
          runtimeEnvelope={missionControlRuntime}
          onOpenMissionControl={() => setMissionControlMode('master-monitoring')}
          onDiscoverEnterprise={handleDiscoverEnterprise}
          isDiscovering={isDiscoveringEnterprise}
          discoveryError={enterpriseDiscoveryError}
        />
      )
    }

    if (missionControlMode === 'cockpit') {
      return (
        <CeoCockpitView
          agentActivityData={agentActivity}
          actionsData={executiveActions}
          councilData={executiveCouncil}
          officesData={executiveOffices}
          knowledgeRepositories={repositories}
          roadmap={pmo?.masterRoadmap}
          strategicLayer={strategicLayer}
        />
      )
    }

    if (missionControlMode === 'council') {
      return (
        <ExecutiveCouncilView
          actionsData={executiveActions}
          councilData={executiveCouncil}
          onOpenOffice={openExecutiveOffice}
        />
      )
    }

    if (missionControlMode === 'offices') {
      return (
        <ExecutiveOfficeView
          officesData={executiveOffices}
          onSelectOffice={selectExecutiveOffice}
          selectedOfficeId={selectedOfficeId}
        />
      )
    }

    if (missionControlMode === 'kipr') {
      return <StrategicAlignmentView mode={missionControlMode} strategicAlignment={strategicAlignment} />
    }

    if (['knowledge', 'white-papers', 'academic-papers', 'patents', 'publications'].includes(missionControlMode)) {
      return <KnowledgeRepositoryPanel repositories={repositories} />
    }

    if (missionControlMode === 'strategy') {
      return <StrategicLayerView strategicLayer={strategicLayer} />
    }

    if (missionControlMode === 'onboarded-enterprises') {
      return <OnboardedEnterprisesView masterMonitoring={masterMonitoring} onboardingData={onboardingAssimilation} />
    }

    if ([
      'enterprise-onboarding',
      'assimilation-pipeline',
      'digital-mirrors',
      'dta-candidates',
      'data-feed-requirements',
      'human-validation'
    ].includes(missionControlMode)) {
      return <OnboardingAssimilationView data={onboardingAssimilation} mode={missionControlMode} />
    }

    if ([
      'master-monitoring',
      'enterprise-home',
      'digital-twin-structure',
      'data-feeds',
      'systems',
      'enterprise-assets',
      'human-workflows'
    ].includes(missionControlMode)) {
      return <MasterMonitoringView data={masterMonitoring} mode={missionControlMode} onboardingData={onboardingAssimilation} />
    }

    if ([
      'investment-thesis',
      'technology-flywheel',
      'three-horizon-roadmap',
      'revenue-engine',
      'dta-lifecycle',
      'enterprise-profile',
      'industry-framework',
      'investor-readiness',
      'commercial-readiness'
    ].includes(missionControlMode)) {
      return <StrategicAlignmentView mode={missionControlMode} strategicAlignment={strategicAlignment} />
    }

    if (missionControlMode === 'administration') {
      return (
        <PlatformAdministrationCenter
          adminActionsData={adminActions}
          adminData={platformAdmin}
          decisionIntelligence={decisionIntelligence}
          kernel={kernel}
          platformStatus={platform?.status}
          storageStatus={storageStatus}
        />
      )
    }

    if (missionControlMode === 'audit') {
      return <AuditReadinessView audit={audit} />
    }

    if (['identity-media', 'organization-intake', 'repository-links', 'startup-experience'].includes(missionControlMode)) {
      return (
        <IdentityIntakeView
          identityMedia={identityMedia}
          intakeData={organizationIntake}
          mode={missionControlMode}
          onImportOrganizationSource={handleImportOrganizationSource}
          onLinkRepository={handleCreateRepositoryLink}
          onUploadIdentityMedia={handleUploadIdentityMedia}
          startupData={startupExperience}
        />
      )
    }

    if (missionControlMode === 'ai-workforce-admin') {
      return <AiWorkforceAdministrationView />
    }

    if (['communications', 'activity', 'calendar', 'performance', 'agents'].includes(missionControlMode)) {
      return (
        <AiWorkforceOperationsView
          activityData={agentActivity}
          agents={agents}
          attentionData={agentAttention}
          calendarData={agentCalendar}
          messagesData={agentMessages}
          mode={missionControlMode}
        />
      )
    }

    if (missionControlMode === 'engineering') {
      return <AiDevelopmentOfficeView office={aiDevelopmentOffice} />
    }

    if (missionControlMode === 'assets') {
      return <ObjectList objects={objects} />
    }

    if (['pmo', 'programs', 'roadmap'].includes(missionControlMode)) {
      return <PmoView roadmap={pmo?.masterRoadmap} />
    }

    if ([
      'governance',
      'valuation',
      'second-balance-sheet',
      'digital-twin-assets',
      'investor-centre',
      'storage',
      'backups',
      'health',
      'releases',
      'architecture',
      'engineering',
      'workspace',
      'briefing',
      'tasks',
      'decisions',
      'notes',
    ].includes(missionControlMode)) {
      return (
        <FoundationView
          adminData={platformAdmin}
          decisionIntelligence={decisionIntelligence}
          kernel={kernel}
          mode={missionControlMode}
          pmo={pmo}
          strategicLayer={strategicLayer}
        />
      )
    }

    return (
      <CeoCockpitView
        agentActivityData={agentActivity}
        actionsData={executiveActions}
        councilData={executiveCouncil}
        officesData={executiveOffices}
        knowledgeRepositories={repositories}
        roadmap={pmo?.masterRoadmap}
        strategicLayer={strategicLayer}
      />
    )
  }

  if (showStartup) {
    return <EosStartupScreen startupData={startupExperience} />
  }

  if (!isLoading && !error && missionControlMode === 'lobby') {
    return renderMissionControlView()
  }

  return (
    <div className={`dashboard-shell ${isPresentationMode ? 'is-presentation-mode' : ''}`}>
      <ExecutiveCommandBar
        activeWorkspace={activeWorkspace}
        attentionCount={pendingAttentionCount}
        isLoading={isLoading}
        isPresentationMode={isPresentationMode}
        metrics={commandMetrics}
        onNavigate={changeMissionControlMode}
        onTogglePresentationMode={togglePresentationMode}
      />

      <div className="digital-headquarters-shell">
        <WorkspaceRail
          activeWorkspaceId={activeWorkspaceId}
          attentionByWorkspace={attentionByWorkspace}
          metricsByWorkspace={metricsByWorkspace}
          onOpenWorkspace={openWorkspace}
          workspaces={workspaceDefinitions}
        />

        <main className="dashboard-main workspace-stage">
        {isLoading && (
          <section className="state-panel" aria-live="polite">
            <p className="section-label">Loading</p>
            <h2>Connecting to EOS Core API</h2>
          </section>
        )}

        {!isLoading && error && (
          <section className="state-panel error-panel" role="alert">
            <p className="section-label">Connection Error</p>
            <h2>Mission Control could not reach EOS Core API.</h2>
            <p>{error}</p>
            <button type="button" onClick={reloadDashboard}>
              Retry
            </button>
          </section>
        )}

        {!isLoading && !error && (
          <>
            <Breadcrumbs item={activeWorkspaceItem} workspace={activeWorkspace} />

            {missionControlMode !== 'lobby' ? (
              <ContextNavigation
                activeMode={missionControlMode}
                onNavigate={changeMissionControlMode}
                workspace={activeWorkspace}
              />
            ) : null}

            <EnterpriseIntelligenceRuntimePanel runtimeEnvelope={missionControlRuntime} />
          {renderMissionControlView()}
          </>
        )}
        </main>
      </div>
    </div>
  )
}

export default App
