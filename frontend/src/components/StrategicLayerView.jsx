import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

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

function StrategicMetric({ description, label, value, detail }) {
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

function StrategicLayerView({ strategicLayer }) {
  if (!strategicLayer?.strategy) {
    return (
      <section className="strategy-section">
        <p className="section-label">Strategic Layer</p>
        <h2>CEO Value View Awaiting Live Signal</h2>
      </section>
    )
  }

  const {
    strategy,
    governance,
    valuation,
    secondBalanceSheet,
    dtaMonitoring,
    digitalTwinAssets = [],
    investorReadinessNotes = [],
    roadmapAlignment = [],
  } = strategicLayer
  const currency = valuation?.currency ?? 'USD'
  const governanceAttention = governance?.openGovernanceItems ?? []

  return (
    <section className="strategy-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Strategic Layer</p>
          <h2>CEO Value View</h2>
        </div>
        <strong>{executiveValue(strategy.approvalStatus, 'Awaiting Review')}</strong>
      </div>

      <article className="strategy-brief">
        <div>
          <span>Enterprise Strategy</span>
          <h3>{strategy.name}</h3>
          <p>{strategy.vision}</p>
        </div>
        <div>
          <span>Mission</span>
          <p>{strategy.mission}</p>
        </div>
        <div>
          <span>Investor Readiness Notes</span>
          <ul className="strategy-note-list">
            {investorReadinessNotes.map((note) => (
              <li key={note}>{executiveValue(note, 'Pending Assessment')}</li>
            ))}
          </ul>
        </div>
      </article>

      <div className="strategy-metric-grid">
        <StrategicMetric
          description="Governance approval status shows whether the strategy, roadmap, valuation, and Second Balance Sheet are approved for executive use."
          label="Governance Approval"
          value={governance?.strategyApprovalStatus}
          detail={governance?.nextGovernanceReview}
        />
        <StrategicMetric
          description={eosTooltips.secondBalanceSheet}
          label="Second Balance Sheet"
          value={formatCurrency(secondBalanceSheet?.estimatedDigitalAssetValue, secondBalanceSheet?.currency)}
          detail={secondBalanceSheet?.methodologyStatus}
        />
        <StrategicMetric
          description="Digital enterprise valuation is an internal directional estimate, not audited financial advice."
          label="Digital Enterprise Value"
          value={formatCurrency(valuation?.digitalEnterpriseValue, currency)}
          detail={valuation?.valuationConfidence}
        />
        <StrategicMetric
          description={eosTooltips.digitalTwinAsset}
          label="DTA Count"
          value={dtaMonitoring?.totalDigitalTwinAssets}
          detail={`${dtaMonitoring?.requiresAttention ?? 0} requiring attention`}
        />
      </div>

      <div className="strategy-grid">
        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Top Value Drivers</h3>
            <strong>{valuation?.valueDrivers?.length ?? 0}</strong>
          </div>
          <div className="strategy-chip-list">
            {(valuation?.valueDrivers ?? []).map((driver) => (
              <small key={driver}>{driver}</small>
            ))}
          </div>
        </section>

        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Governance Attention</h3>
            <strong>{governanceAttention.length}</strong>
          </div>
          <div className="strategy-list">
            {governanceAttention.map((item) => (
              <article key={item}>
                <span>Review Required</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>DTA Monitoring</h3>
            <strong>{executiveValue(dtaMonitoring?.status, 'Monitoring')}</strong>
          </div>
          <dl className="strategy-micro-grid">
            <div>
              <dt>Formation</dt>
              <dd>{dtaMonitoring?.inFormation ?? 0}</dd>
            </div>
            <div>
              <dt>Active</dt>
              <dd>{dtaMonitoring?.activeMonitoring ?? 0}</dd>
            </div>
            <div>
              <dt>Valuation</dt>
              <dd>{dtaMonitoring?.underValuation ?? 0}</dd>
            </div>
            <div>
              <dt>Commercial</dt>
              <dd>{dtaMonitoring?.commercialized ?? 0}</dd>
            </div>
          </dl>
        </section>

        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Second Balance Sheet Metrics</h3>
            <strong>{secondBalanceSheet?.confidenceLevel}</strong>
          </div>
          <dl className="strategy-micro-grid">
            <div>
              <dt>Knowledge</dt>
              <dd>{secondBalanceSheet?.knowledgeAssets ?? 0}</dd>
            </div>
            <div>
              <dt>Agents</dt>
              <dd>{secondBalanceSheet?.agentAssets ?? 0}</dd>
            </div>
            <div>
              <dt>Objects</dt>
              <dd>{secondBalanceSheet?.liveEnterpriseObjects ?? 0}</dd>
            </div>
            <div>
              <dt>Workflows</dt>
              <dd>{secondBalanceSheet?.workflowAssets ?? 0}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="strategy-panel">
        <div className="strategy-panel-heading">
          <h3>Digital Twin Assets</h3>
          <strong>{digitalTwinAssets.length}</strong>
        </div>
        <div className="dta-list">
          {digitalTwinAssets.map((asset) => (
            <article key={asset.id}>
              <div>
                <span>{asset.id}</span>
                <h4>{asset.name}</h4>
                <p>{asset.description}</p>
              </div>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{asset.status}</dd>
                </div>
                <div>
                  <dt>Valuation</dt>
                  <dd>{asset.valuationStatus}</dd>
                </div>
                <div>
                  <dt>Governance</dt>
                  <dd>{asset.governanceStatus}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="strategy-panel">
        <div className="strategy-panel-heading">
          <h3>Roadmap Alignment</h3>
          <strong>{roadmapAlignment.length}</strong>
        </div>
        <div className="roadmap-alignment-list">
          {roadmapAlignment.map((program) => (
            <article key={program.id}>
              <div>
                <span>{program.strategicObjective}</span>
                <h4>{program.name}</h4>
              </div>
              <p>{program.businessPlanAlignment}</p>
              <small>{program.enterpriseValueContribution} enterprise value contribution</small>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default StrategicLayerView
