import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

function CockpitMetric({ description, label, value, detail }) {
  return (
    <article>
      <span>
        <ExecutiveTooltip description={description}>{label}</ExecutiveTooltip>
      </span>
      <strong>{executiveValue(value, 'Awaiting Live Signal')}</strong>
      {detail && <small>{detail}</small>}
    </article>
  )
}

function formatCurrency(value, currency = 'USD') {
  if (!Number.isFinite(value)) {
    return 'Pending Assessment'
  }

  return new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function CeoCockpitView({
  councilData,
  actionsData,
  officesData,
  roadmap,
  strategicLayer,
  agentActivityData,
  knowledgeRepositories,
}) {
  const cockpit = councilData?.ceoCockpit
  const officeFramework = officesData?.framework
  const actionSummary = actionsData?.summary
  const valuation = strategicLayer?.valuation
  const dtaMonitoring = strategicLayer?.dtaMonitoring
  const repositories = knowledgeRepositories ?? []
  const knowledgeAssetCount = repositories.reduce(
    (total, repository) => total + (repository.knowledgeObjects?.length ?? 0),
    0
  )

  if (!cockpit) {
    return (
      <section className="executive-section">
        <p className="section-label">CEO Cockpit</p>
        <h2>CEO Cockpit Awaiting Live Signal</h2>
      </section>
    )
  }

  return (
    <section className="executive-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Mission Control</p>
          <h2>CEO Cockpit</h2>
        </div>
        <strong>{roadmap?.currentRoadmapPhase ?? cockpit.currentRoadmapPhase}</strong>
      </div>

      <div className="ceo-headline-grid">
        <CockpitMetric
          description="Enterprise Value is an internal estimate for executive planning only, not audited valuation."
          label="Enterprise Value"
          value={formatCurrency(valuation?.digitalEnterpriseValue, valuation?.currency)}
          detail="Internal estimate, not audited valuation"
        />
        <CockpitMetric
          description={eosTooltips.digitalTwinAsset}
          label="Digital Twin Assets"
          value={dtaMonitoring?.totalDigitalTwinAssets}
          detail={`${dtaMonitoring?.requiresAttention ?? 0} requiring attention`}
        />
        <CockpitMetric
          description={eosTooltips.activeExecutives}
          label="AI Workforce"
          value={cockpit.activeExecutives}
          detail={`${agentActivityData?.count ?? 0} active work items`}
        />
        <CockpitMetric
          description={eosTooltips.healthScore}
          label="Enterprise Health"
          value={cockpit.platformHealth}
          detail="Executive health score"
        />
        <CockpitMetric
          description={eosTooltips.knowledgeObject}
          label="Knowledge Assets"
          value={knowledgeAssetCount}
          detail={`${repositories.length} repositories`}
        />
        <CockpitMetric
          description={eosTooltips.recommendedAction}
          label="Current Priority"
          value={roadmap?.currentCapability ?? cockpit.currentCapability}
          detail={roadmap?.currentSprint?.name ?? cockpit.currentSprint}
        />
      </div>

      <div className="ceo-cockpit">
        <CockpitMetric label="Platform Version" value={cockpit.platformVersion} detail="EOS Core" />
        <CockpitMetric
          description={eosTooltips.healthScore}
          label="Platform Health"
          value={cockpit.platformHealth}
          detail="Score"
        />
        <CockpitMetric
          description="The active delivery sprint currently guiding EOS platform execution."
          label="Current Sprint"
          value={cockpit.currentSprint}
          detail={cockpit.currentRoadmapPhase}
        />
        <CockpitMetric
          description={eosTooltips.capability}
          label="Current Capability"
          value={cockpit.currentCapability}
          detail="In Progress"
        />
        <CockpitMetric
          description={eosTooltips.attentionLevel}
          label="Executive Attention"
          value={cockpit.executiveAttentionRequired}
          detail="Executives"
        />
        <CockpitMetric
          description="Executive Offices provide the detailed workspaces behind the Executive Council."
          label="Executive Offices"
          value={officesData?.count ?? 0}
          detail="Openable"
        />
      </div>

      <article className="ceo-recommendation">
        <span>
          <ExecutiveTooltip description={eosTooltips.recommendedAction}>Top Recommended Action</ExecutiveTooltip>
        </span>
        <p>{executiveValue(cockpit.topRecommendedAction, 'No Action Required')}</p>
      </article>

      <div className="headquarters-grid">
        <article>
          <span>Office Framework</span>
          <strong>{executiveValue(officeFramework?.liveStatus?.lifecycleStatus, 'Building')}</strong>
          <p>{executiveValue(officeFramework?.liveStatus?.summary, 'Framework status is being assessed.')}</p>
        </article>
        <article>
          <span>Approvals</span>
          <strong>{actionSummary?.pendingApproval ?? 0}</strong>
          <p>Executive actions are governed and execution remains disabled.</p>
        </article>
        <article>
          <span>Roadmap</span>
          <strong>{roadmap?.currentCapability ?? cockpit.currentCapability}</strong>
          <p>{executiveValue(roadmap?.recommendedAction, 'Review roadmap priorities.')}</p>
        </article>
      </div>
    </section>
  )
}

export default CeoCockpitView
