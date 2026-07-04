import { executiveValue } from '../design-system/eosDesignSystem.js'

function StatusBadge({ status }) {
  const normalizedStatus = executiveValue(status, 'Pending Assessment')
  return <span className={`audit-status-badge status-${normalizedStatus.toLowerCase().replaceAll(' ', '-')}`}>{normalizedStatus}</span>
}

function ScoreCard({ score }) {
  return (
    <article className="audit-score-card">
      <span>{score.stage}</span>
      <strong>{score.score}%</strong>
      <small>{score.status}</small>
      <p>{score.interpretation}</p>
    </article>
  )
}

function CapabilityRow({ capability }) {
  return (
    <article className="audit-capability-row">
      <div>
        <span>{capability.id}</span>
        <h4>{capability.name}</h4>
        <p>{capability.implementationDepth}</p>
      </div>
      <div className="audit-row-meta">
        <StatusBadge status={capability.functionalStatus} />
        <small>{capability.domain}</small>
      </div>
    </article>
  )
}

function CoveragePanel({ title, items }) {
  return (
    <section className="monitoring-panel audit-coverage-panel">
      <div className="monitoring-panel-heading">
        <span>Coverage</span>
        <h3>{title}</h3>
      </div>
      <div className="audit-coverage-list">
        {items.map((item) => (
          <article key={item.group ?? item.workspace}>
            <div>
              <strong>{item.group ?? item.workspace}</strong>
              <p>{item.coverage}</p>
              <small>{(item.endpoints ?? item.routes ?? []).join(' / ')}</small>
            </div>
            <StatusBadge status={item.status} />
          </article>
        ))}
      </div>
    </section>
  )
}

function AuditReadinessView({ audit }) {
  if (!audit) {
    return (
      <section className="operations-section">
        <p className="section-label">Platform</p>
        <h2>Audit Center Awaiting Live Signal</h2>
      </section>
    )
  }

  const summary = audit.summary ?? {}
  const capabilities = audit.capabilityReadinessMatrix ?? []
  const highPriorityDebt = (audit.technicalDebtRegister ?? []).filter((item) => ['High', 'Critical'].includes(item.severity))
  const remainingDebt = (audit.technicalDebtRegister ?? []).filter((item) => !['High', 'Critical'].includes(item.severity))

  return (
    <section className="master-monitoring-view audit-readiness-view">
      <div className="monitoring-hero">
        <div>
          <span>Mission Control / Platform</span>
          <h2>Platform Audit & Capability Readiness</h2>
          <p>
            Executive audit of what is fully functional, operational foundation, display-only,
            partial, placeholder, broken, and still required for EOS maturity.
          </p>
        </div>
        <strong>{executiveValue(summary.overallStatus, 'Operational Foundation')}</strong>
      </div>

      <div className="monitoring-metric-grid">
        <article className="monitoring-metric-tile">
          <span>Capabilities Audited</span>
          <strong>{summary.capabilitiesAudited}</strong>
          <small>{summary.fullyFunctional} fully functional</small>
        </article>
        <article className="monitoring-metric-tile">
          <span>Operational Foundations</span>
          <strong>{summary.operationalFoundations}</strong>
          <small>{summary.partial} partial / {summary.displayOnly} display-only</small>
        </article>
        <article className="monitoring-metric-tile">
          <span>Broken Items</span>
          <strong>{summary.broken}</strong>
          <small>{summary.placeholders} placeholder capability classifications</small>
        </article>
        <article className="monitoring-metric-tile">
          <span>Storage Health</span>
          <strong>{audit.dataPersistenceHealth?.storageStatus}</strong>
          <small>{audit.dataPersistenceHealth?.collectionsFound?.length ?? 0} collections</small>
        </article>
      </div>

      <div className="audit-score-grid">
        {(audit.readinessScores ?? []).map((score) => (
          <ScoreCard key={score.stage} score={score} />
        ))}
      </div>

      <article className="admin-safety-note">
        <strong>Recommended Program</strong>
        <p>{summary.recommendedNextProgram}</p>
        <small>{summary.recommendedNextAction}</small>
      </article>

      <div className="monitoring-visual-grid">
        <section className="monitoring-panel">
          <div className="monitoring-panel-heading">
            <span>Readiness Matrix</span>
            <h3>Capability Functional Status</h3>
          </div>
          <div className="audit-capability-list">
            {capabilities.map((capability) => (
              <CapabilityRow key={capability.id} capability={capability} />
            ))}
          </div>
        </section>

        <section className="monitoring-panel">
          <div className="monitoring-panel-heading">
            <span>Gaps</span>
            <h3>Display-Only & Placeholder Register</h3>
          </div>
          <div className="operations-note-list audit-note-list">
            {(audit.placeholderRegister ?? []).map((item) => (
              <article key={item.id}>
                <StatusBadge status={item.status} />
                <strong>{item.area}</strong>
                <p>{item.reason}</p>
                <small>{item.recommendedCapability}</small>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="monitoring-visual-grid">
        <CoveragePanel items={audit.apiCoverage ?? []} title="API Coverage" />
        <CoveragePanel items={audit.frontendRouteCoverage ?? []} title="Frontend Route Coverage" />
      </div>

      <div className="operations-grid">
        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Technical Debt</h3>
            <strong>{audit.technicalDebtRegister?.length ?? 0}</strong>
          </div>
          <div className="operations-note-list audit-note-list">
            {[...highPriorityDebt, ...remainingDebt].map((item) => (
              <article key={item.id}>
                <StatusBadge status={item.severity} />
                <strong>{item.area}</strong>
                <p>{item.summary}</p>
                <small>{item.recommendedAction}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Recommended Build Sequence</h3>
            <strong>{audit.recommendedBuildSequence?.length ?? 0}</strong>
          </div>
          <div className="operations-note-list audit-note-list">
            {(audit.recommendedBuildSequence ?? []).map((item) => (
              <article key={item.priority}>
                <StatusBadge status={`Priority ${item.priority}`} />
                <strong>{item.capability}</strong>
                <p>{item.reason}</p>
                <small>{item.dependencies?.join(' / ')} / {item.estimatedEffort}</small>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="operations-panel">
        <div className="operations-panel-heading">
          <h3>Quality Gates</h3>
          <strong>{audit.qualityGates?.length ?? 0}</strong>
        </div>
        <div className="policy-list">
          {(audit.qualityGates ?? []).map((gate) => (
            <article key={gate.gate}>
              <h4>{gate.gate}</h4>
              <p>{gate.evidence}</p>
              <small>{gate.status}</small>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default AuditReadinessView
