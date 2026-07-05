import './AiDevelopmentOfficeView.css'

export default function AiDevelopmentOfficeView({ office }) {
  const metrics = office?.metrics ?? {}
  const agents = office?.agents ?? []
  const buildTasks = office?.buildTasks ?? []

  return (
    <section className="ado-view">
      <div className="ado-hero">
        <div>
          <p className="ado-kicker">Platform Office</p>
          <h1>{office?.office?.name ?? 'AI Development Office'}</h1>
          <p>{office?.office?.purpose ?? 'Manage AI-assisted EOS software engineering.'}</p>
        </div>

        <div className="ado-index-card">
          <span>Autonomous Development Index</span>
          <strong>{metrics.autonomousDevelopmentIndex ?? 0}%</strong>
          <small>{metrics.humanEngineeringLoad ?? 'Human engineering load tracking pending'}</small>
        </div>
      </div>

      <div className="ado-metrics-grid">
        <Metric label="Active Build Tasks" value={metrics.activeBuildTasks ?? 0} />
        <Metric label="Registered Code Agents" value={metrics.registeredCodeAgents ?? agents.length} />
        <Metric label="Pending Reviews" value={metrics.pendingReviews ?? 0} />
        <Metric label="Release Readiness" value={`${metrics.releaseReadiness ?? 0}%`} />
      </div>

      <div className="ado-columns">
        <div className="ado-panel">
          <h2>AI Engineering Agents</h2>
          <div className="ado-list">
            {agents.map((agent) => (
              <article className="ado-list-item" key={agent.id}>
                <div>
                  <strong>{agent.name}</strong>
                  <p>{agent.responsibility}</p>
                </div>
                <span>{agent.status}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="ado-panel">
          <h2>Build Tasks</h2>
          <div className="ado-list">
            {buildTasks.map((task) => (
              <article className="ado-list-item" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.outcome}</p>
                </div>
                <span>{task.status}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="ado-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
