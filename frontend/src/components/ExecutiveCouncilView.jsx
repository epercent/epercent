import ExecutiveActionsPanel from './ExecutiveActionsPanel.jsx'
import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import {
  eosTooltips,
  executiveActionLabel,
  executiveValue
} from '../design-system/eosDesignSystem.js'

function statusClass(status) {
  return `status-${String(status ?? 'Grey').toLowerCase()}`
}

function profileStatus(profile) {
  if (profile.requiresAttention) {
    return profile.attentionLevel === 'Medium' || profile.attentionLevel === 'High' ? 'Amber' : 'Blue'
  }

  return 'Green'
}

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

function ExecutiveActionRow({ action }) {
  return (
    <article className={`executive-action-row risk-${action.riskLevel.toLowerCase()}`}>
      <div>
        <strong>{executiveActionLabel(action.label, action.targetObject)}</strong>
        <span>{action.status}</span>
      </div>
      <dl>
        <div>
          <dt>Approval</dt>
          <dd>{executiveValue(action.approvalStatus, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>Risk</dt>
          <dd>{executiveValue(action.riskLevel, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{action.owner}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{action.targetObject}</dd>
        </div>
      </dl>
      <p>{executiveValue(action.recommendedNextStep, 'Review action governance before execution.')}</p>
    </article>
  )
}

function ExecutiveCard({ profile, actions, onOpenOffice }) {
  const status = profileStatus(profile)

  return (
    <article className={`executive-card ${statusClass(status)}`}>
      <div className="executive-card-heading">
        <div>
          <span>{profile.type}</span>
          <h3>{profile.name}</h3>
        </div>
        <strong>{executiveValue(status, 'Monitoring')}</strong>
      </div>

      <p className="executive-role">{profile.role}</p>

      <dl className="executive-meta">
        <div>
          <dt>Department</dt>
          <dd>{executiveValue(profile.department)}</dd>
        </div>
        <div>
          <dt>Health</dt>
          <dd>{executiveValue(profile.healthScore)}</dd>
        </div>
        <div>
          <dt>Attention</dt>
          <dd>{executiveValue(profile.attentionLevel, 'No Action Required')}</dd>
        </div>
      </dl>

      <div className="executive-focus">
        <span>Current Focus</span>
        <p>{executiveValue(profile.currentFocus, 'Focus pending executive review.')}</p>
      </div>

      <div className="executive-focus">
        <span>Recommended Action</span>
        <p>{executiveValue(profile.recommendedAction, 'No Action Required')}</p>
      </div>

      <button className="office-open-button" onClick={() => onOpenOffice(profile.id)} type="button">
        Open Executive Office
      </button>

      <div className="executive-action-list" aria-label={`${profile.name} governed actions`}>
        {actions.map((action) => (
          <ExecutiveActionRow key={action.id} action={action} />
        ))}
      </div>
    </article>
  )
}

function ExecutiveCouncilView({ councilData, actionsData, onOpenOffice }) {
  if (!councilData) {
    return (
      <section className="executive-section">
        <p className="section-label">Digital Enterprise Headquarters</p>
        <h2>Executive Council Awaiting Live Signal</h2>
      </section>
    )
  }

  const { ceoCockpit, council, executives, headquarters } = councilData
  const actionsByExecutive = (actionsData?.actions ?? []).reduce((currentMap, action) => {
    currentMap.set(action.sourceExecutive, [...(currentMap.get(action.sourceExecutive) ?? []), action])
    return currentMap
  }, new Map())

  return (
    <section className="executive-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Digital Enterprise Headquarters</p>
          <h2>{council.name}</h2>
        </div>
        <strong>{executiveValue(headquarters.liveStatus.operationalStatus, 'Monitoring')}</strong>
      </div>

      <div className="ceo-cockpit">
        <CockpitMetric label="Platform Version" value={ceoCockpit.platformVersion} detail="EOS Core" />
        <CockpitMetric
          description={eosTooltips.healthScore}
          label="Platform Health"
          value={ceoCockpit.platformHealth}
          detail="Score"
        />
        <CockpitMetric label="Current Sprint" value={ceoCockpit.currentSprint} detail={ceoCockpit.currentRoadmapPhase} />
        <CockpitMetric
          description={eosTooltips.capability}
          label="Current Capability"
          value={ceoCockpit.currentCapability}
          detail="In Progress"
        />
        <CockpitMetric
          description={eosTooltips.attentionLevel}
          label="Attention Required"
          value={ceoCockpit.executiveAttentionRequired}
          detail="Executives"
        />
        <CockpitMetric
          description={eosTooltips.activeExecutives}
          label="Active Executives"
          value={ceoCockpit.activeExecutives}
          detail="Council Members"
        />
      </div>

      <article className="ceo-recommendation">
        <span>
          <ExecutiveTooltip description={eosTooltips.recommendedAction}>Top Recommended Action</ExecutiveTooltip>
        </span>
        <p>{executiveValue(ceoCockpit.topRecommendedAction, 'No Action Required')}</p>
      </article>

      <div className="executive-grid">
        {executives.map((profile) => (
          <ExecutiveCard
            key={profile.id}
            profile={profile}
            actions={actionsByExecutive.get(profile.id) ?? []}
            onOpenOffice={onOpenOffice}
          />
        ))}
      </div>

      <ExecutiveActionsPanel actionsData={actionsData} />
    </section>
  )
}

export default ExecutiveCouncilView
