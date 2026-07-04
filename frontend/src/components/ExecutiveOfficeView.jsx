import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import {
  eosTooltips,
  executiveActionLabel,
  executiveValue
} from '../design-system/eosDesignSystem.js'

const sectionDescriptions = {
  'CEO Attention': eosTooltips.attentionLevel,
  'Current Capabilities': eosTooltips.capability,
  'Current Programs': eosTooltips.program,
  'Department Portfolio': 'The portfolio shows the business assets and operating responsibilities managed by this executive.',
  'Knowledge Assets': eosTooltips.knowledgeObject,
  'Live Enterprise Objects': eosTooltips.enterpriseObject,
  'Recommended Actions': eosTooltips.recommendedAction,
  'Recent Events': eosTooltips.event,
  Workflows: eosTooltips.workflow,
}

function FieldList({ title, items }) {
  const values = Array.isArray(items) && items.length > 0 ? items : ['No Action Required']

  return (
    <section className="office-panel">
      <span>
        <ExecutiveTooltip description={sectionDescriptions[title]}>{title}</ExecutiveTooltip>
      </span>
      <div className="office-chip-list">
        {values.map((item) => (
          <small key={typeof item === 'string' ? item : item.id}>
            {executiveValue(typeof item === 'string' ? item : item.label, 'No Action Required')}
          </small>
        ))}
      </div>
    </section>
  )
}

function OfficeMetric({ metric }) {
  return (
    <article>
      <span>
        <ExecutiveTooltip description={metric.label === 'Build Health' ? eosTooltips.healthScore : undefined}>
          {metric.label}
        </ExecutiveTooltip>
      </span>
      <strong>{executiveValue(metric.value)}</strong>
      <small>{executiveValue(metric.trend, 'Monitoring')}</small>
    </article>
  )
}

function PlaceholderPanel({ title, placeholder }) {
  return (
    <article className="office-placeholder">
      <span>{title}</span>
      <strong>{executiveValue(placeholder.status, 'Future Capability')}</strong>
      <p>{executiveValue(placeholder.summary, 'This capability is planned for a future release.')}</p>
    </article>
  )
}

function ExecutiveOfficeView({ officesData, selectedOfficeId, onSelectOffice }) {
  const offices = officesData?.offices ?? []
  const selectedOffice = offices.find(
    (office) => office.id === selectedOfficeId || office.executiveId === selectedOfficeId
  ) ?? offices[0]

  if (!selectedOffice) {
    return (
      <section className="executive-section">
        <p className="section-label">Executive Offices</p>
        <h2>Executive Offices Awaiting Live Signal</h2>
      </section>
    )
  }

  return (
    <section className="office-layout">
      <aside className="office-directory" aria-label="Executive Office directory">
        <p className="section-label">Executive Offices</p>
        {offices.map((office) => (
          <button
            className={office.id === selectedOffice.id ? 'is-active' : ''}
            key={office.id}
            onClick={() => onSelectOffice(office.id)}
            type="button"
          >
            <strong>{office.executiveName}</strong>
            <span>{office.department}</span>
          </button>
        ))}
      </aside>

      <article className="office-detail">
        <header className="office-hero">
          <div>
            <p className="section-label">Executive Office</p>
            <h2>{selectedOffice.executiveName}</h2>
            <p>{selectedOffice.executiveRole}</p>
          </div>
          <dl>
            <div>
              <dt>Department</dt>
              <dd>{executiveValue(selectedOffice.department)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{executiveValue(selectedOffice.status, 'Monitoring')}</dd>
            </div>
            <div>
              <dt>Health</dt>
              <dd>{executiveValue(selectedOffice.healthScore)}</dd>
            </div>
            <div>
              <dt>CEO Review</dt>
              <dd>{executiveValue(selectedOffice.estimatedCeoReviewTime, 'Pending Assessment')}</dd>
            </div>
          </dl>
        </header>

        <section className="office-briefing">
          <div className="office-executive-brief">
            <span>
              <ExecutiveTooltip description="The executive briefing summarizes what is happening, what needs attention, and how much CEO review time is expected.">
                Executive Briefing
              </ExecutiveTooltip>
            </span>
            <h3>Good morning Eric.</h3>
            <p>{executiveValue(selectedOffice.executiveBriefing)}</p>
            <strong>Estimated review time: {executiveValue(selectedOffice.estimatedCeoReviewTime)}</strong>
          </div>
          <div>
            <span>Today's Summary</span>
            <p>{executiveValue(selectedOffice.todaysSummary)}</p>
          </div>
          <div>
            <span>Current Focus</span>
            <p>{executiveValue(selectedOffice.currentFocus)}</p>
          </div>
        </section>

        <section className="office-metric-grid">
          {selectedOffice.kpis.map((metric) => (
            <OfficeMetric key={metric.label} metric={metric} />
          ))}
          <article>
            <span>Department Health</span>
            <strong>{executiveValue(selectedOffice.departmentHealth)}</strong>
            <small>Score</small>
          </article>
        </section>

        <section className="office-grid">
          <FieldList title="Current Priorities" items={selectedOffice.currentPriorities} />
          <FieldList title="CEO Attention" items={selectedOffice.itemsRequiringCeoAttention} />
          <FieldList title="Recommended Actions" items={selectedOffice.recommendedActions} />
          <FieldList title="Current Projects" items={selectedOffice.currentProjects} />
          <FieldList title="Current Capabilities" items={selectedOffice.currentCapabilities} />
          <FieldList title="Current Programs" items={selectedOffice.currentPrograms} />
          <FieldList title="Live Enterprise Objects" items={selectedOffice.liveEnterpriseObjects} />
          <FieldList title="Knowledge Assets" items={selectedOffice.knowledgeAssets} />
          <FieldList title="Workflows" items={selectedOffice.workflows} />
          <FieldList title="Recent Events" items={selectedOffice.recentEvents} />
          <FieldList title="Department Portfolio" items={selectedOffice.departmentPortfolio} />
          <FieldList title="Permanent Agents" items={selectedOffice.permanentAgents} />
        </section>

        <section className="office-widget-grid">
          {selectedOffice.specificWidgets.map((widget) => (
            <article key={widget.title}>
              <span>{widget.title}</span>
              <div className="office-chip-list">
                {widget.metrics.map((metric) => (
                  <small key={metric}>{metric}</small>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="office-grid">
          <FieldList
            title="Approvals Waiting"
            items={selectedOffice.approvalsWaiting.map((approval) => ({
              id: approval.id,
              label: `${approval.label}: ${approval.approvalStatus}`
            }))}
          />
          <FieldList
            title="Recent Activity Timeline"
            items={selectedOffice.recentActivityTimeline.map((activity) => ({
              id: `${activity.timestamp}-${activity.activity}`,
              label: activity.activity
            }))}
          />
        </section>

        <section className="office-placeholder-grid">
          <PlaceholderPanel title="Messages" placeholder={selectedOffice.messages} />
          <PlaceholderPanel title="Meetings" placeholder={selectedOffice.meetings} />
          <PlaceholderPanel title="Calendar" placeholder={selectedOffice.calendar} />
          <PlaceholderPanel title="Temporary Agents" placeholder={selectedOffice.temporaryAgents} />
        </section>

        <section className="office-action-bar">
          {selectedOffice.availableActions.map((action) => (
            <button key={action} type="button">
              {executiveActionLabel(action, selectedOffice.department)}
            </button>
          ))}
        </section>
      </article>
    </section>
  )
}

export default ExecutiveOfficeView
