import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import {
  eosTooltips,
  executiveActionLabel,
  executiveValue
} from '../design-system/eosDesignSystem.js'

function ActionMetric({ description, label, value }) {
  return (
    <article>
      <span>
        <ExecutiveTooltip description={description}>{label}</ExecutiveTooltip>
      </span>
      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
    </article>
  )
}

function ActionStatusRow({ action }) {
  return (
    <article className={`action-row risk-${action.riskLevel.toLowerCase()}`}>
      <div>
        <strong>{executiveActionLabel(action.label, action.targetObject)}</strong>
        <span>{action.owner}</span>
      </div>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{executiveValue(action.status, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>Approval</dt>
          <dd>{executiveValue(action.approvalStatus, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>Risk</dt>
          <dd>{executiveValue(action.riskLevel, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{action.targetObject}</dd>
        </div>
      </dl>
      <p>{executiveValue(action.recommendedNextStep, 'Review governance record before execution.')}</p>
    </article>
  )
}

function ExecutiveActionsPanel({ actionsData }) {
  if (!actionsData) {
    return null
  }

  const { safetyNotice, summary } = actionsData
  const recentlyUpdated = summary?.recentlyUpdated ?? []

  return (
    <section className="executive-actions-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Executive Actions</p>
          <h2>Action Governance</h2>
        </div>
        <strong>Execution Disabled</strong>
      </div>

      <article className="action-safety-note">
        <span>Safety Boundary</span>
        <p>{safetyNotice}</p>
      </article>

      <div className="action-summary-grid">
        <ActionMetric description={eosTooltips.attentionLevel} label="Pending Approval" value={summary.pendingApproval} />
        <ActionMetric label="Approved" value={summary.approved} />
        <ActionMetric label="Rejected" value={summary.rejected} />
        <ActionMetric description={eosTooltips.risk} label="High Risk" value={summary.highRisk} />
        <ActionMetric label="Recently Updated" value={recentlyUpdated.length} />
      </div>

      <div className="action-row-list" aria-label="Recently updated executive actions">
        {recentlyUpdated.map((action) => (
          <ActionStatusRow key={action.id} action={action} />
        ))}
      </div>
    </section>
  )
}

export default ExecutiveActionsPanel
