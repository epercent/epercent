import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

function progressStyle(value) {
  return { width: `${Math.min(100, Math.max(0, value ?? 0))}%` }
}

function PmoMetric({ description, label, value, detail }) {
  return (
    <article>
      <span>
        <ExecutiveTooltip description={description}>{label}</ExecutiveTooltip>
      </span>
      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
      {detail && <small>{detail}</small>}
    </article>
  )
}

function PmoView({ roadmap }) {
  if (!roadmap) {
    return (
      <section className="pmo-section">
        <p className="section-label">PMO View</p>
        <h2>Roadmap Awaiting Live Signal</h2>
      </section>
    )
  }

  const upcomingMilestones = roadmap.milestones.filter((milestone) =>
    roadmap.upcomingMilestones.includes(milestone.name),
  )

  return (
    <section className="pmo-section">
      <div className="section-heading">
        <div>
          <p className="section-label">PMO View</p>
          <h2>{roadmap.name}</h2>
        </div>
        <strong>{executiveValue(roadmap.liveStatus.operationalStatus, 'Monitoring')}</strong>
      </div>

      <div className="pmo-summary">
        <PmoMetric
          description={eosTooltips.progress}
          label="Overall Progress"
          value={`${roadmap.progress}%`}
          detail={roadmap.status}
        />
        <PmoMetric
          description={eosTooltips.healthScore}
          label="Health"
          value={roadmap.health}
          detail={roadmap.liveStatus.attentionLevel}
        />
        <PmoMetric label="Current Sprint" value={roadmap.currentSprint.name} detail={roadmap.currentSprint.status} />
        <PmoMetric
          description={eosTooltips.capability}
          label="Current Capability"
          value={roadmap.currentCapability}
          detail={roadmap.executiveOwner}
        />
      </div>

      <article className="roadmap-brief">
        <div>
          <span>Vision</span>
          <p>{roadmap.vision}</p>
        </div>
        <div>
          <span>Mission</span>
          <p>{roadmap.mission}</p>
        </div>
        <div>
          <span>Recommended Action</span>
          <p>{executiveValue(roadmap.recommendedAction, 'Review roadmap priorities.')}</p>
        </div>
      </article>

      <div className="pmo-grid">
        <section className="pmo-panel">
          <div className="pmo-panel-heading">
            <h3>Programs</h3>
            <strong>{roadmap.programs.length}</strong>
          </div>
          <div className="program-list">
            {roadmap.programs.map((program) => (
              <article key={program.id}>
                <div className="program-heading">
                  <div>
                    <span>{executiveValue(program.executiveOwner)}</span>
                    <h4>{program.name}</h4>
                  </div>
                  <strong>{program.progress}%</strong>
                </div>
                <div className="progress-track" aria-label={`${program.name} progress ${program.progress}%`}>
                  <span style={progressStyle(program.progress)} />
                </div>
                <p>{executiveValue(program.businessImpact, 'Business impact pending assessment.')}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pmo-panel">
          <div className="pmo-panel-heading">
            <h3>Milestones</h3>
            <strong>{roadmap.milestones.length}</strong>
          </div>
          <div className="milestone-list">
            {roadmap.milestones.map((milestone) => (
              <article key={milestone.id}>
                <div>
                  <span>{executiveValue(milestone.status, 'Monitoring')}</span>
                  <h4>{milestone.name}</h4>
                </div>
                <small>{milestone.due}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="pmo-panel">
          <div className="pmo-panel-heading">
            <h3>Upcoming Milestones</h3>
            <strong>{upcomingMilestones.length}</strong>
          </div>
          <div className="milestone-list">
            {upcomingMilestones.map((milestone) => (
              <article key={milestone.id}>
                <div>
                  <span>{executiveValue(milestone.status, 'Monitoring')}</span>
                  <h4>{milestone.name}</h4>
                </div>
                <small>{milestone.due}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="pmo-panel">
          <div className="pmo-panel-heading">
            <h3>Risks</h3>
            <strong>{roadmap.risks.length}</strong>
          </div>
          <div className="risk-list">
            {roadmap.risks.map((risk) => (
              <article key={risk.id}>
                <strong>{risk.severity}</strong>
                <h4>{risk.title}</h4>
                <p>{executiveValue(risk.mitigation, 'Mitigation pending assessment.')}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="pmo-panel">
        <div className="pmo-panel-heading">
          <h3>Executive Ownership</h3>
          <strong>{roadmap.executiveOwner}</strong>
        </div>
        <div className="owner-grid">
          {roadmap.programs.map((program) => (
            <article key={program.id}>
              <span>{program.executiveOwner}</span>
              <strong>{program.name}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default PmoView
