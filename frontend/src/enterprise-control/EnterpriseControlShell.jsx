import './EnterpriseControl.css'

function MetricCard({ label, value, detail }) {
  return (
    <article className="ec-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  )
}

function EnterpriseControlShell({
  runtimeEnvelope,
  onOpenMissionControl,
  onDiscoverEnterprise,
  isDiscovering,
  discoveryError
}) {
  const runtime = runtimeEnvelope?.missionControlRuntime
  const profile = runtimeEnvelope?.profile
  const opportunity = runtimeEnvelope?.opportunityAssessment
  const workforce = runtimeEnvelope?.aiWorkforceRecommendation
  const twin = runtimeEnvelope?.digitalTwinPlaceholder
  const secondBalanceSheet = runtimeEnvelope?.secondBalanceSheetSignal

  return (
    <main className="enterprise-control">
      <section className="ec-hero">
        <div>
          <p className="ec-label">EOS Enterprise Operating System</p>
          <h1>Enterprise Control</h1>
          <p>
            Run the enterprise from one executive operating layer. Discover intelligence,
            assess opportunities, coordinate AI work, and track value creation.
          </p>
        </div>

        <button className="ec-primary-button" onClick={onOpenMissionControl}>
          Open Mission Control
        </button>
      </section>


      <section className="ec-panel ec-discovery-panel">
        <p className="ec-label">Discover Enterprise</p>
        <h2>Start the Enterprise Intelligence Journey</h2>
        <form
          className="ec-discovery-form"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const source = formData.get('enterpriseSource')
            if (source) {
              onDiscoverEnterprise?.(String(source))
            }
          }}
        >
          <input
            name="enterpriseSource"
            placeholder="Enter website or enterprise source, e.g. https://epercent.ai"
            defaultValue={runtime?.enterprise?.source ?? 'https://epercent.ai'}
          />
          <button className="ec-primary-button" disabled={isDiscovering} type="submit">
            {isDiscovering ? 'Discovering...' : 'Discover Enterprise'}
          </button>
        </form>

        {isDiscovering && (
          <div className="ec-discovery-progress">
            <span>Discovering</span>
            <span>Building DIP</span>
            <span>Assessing Opportunities</span>
            <span>AI Workforce</span>
            <span>Digital Twin</span>
            <span>Second Balance Sheet</span>
          </div>
        )}

        {discoveryError && <p className="ec-error">{discoveryError}</p>}
      </section>

      <section className="ec-grid">
        <MetricCard
          label="Enterprise"
          value={runtime?.enterprise?.name ?? 'Awaiting Discovery'}
          detail={runtime?.enterprise?.source ?? 'No source selected'}
        />
        <MetricCard
          label="Enterprise Health"
          value="Monitoring"
          detail="Executive signal active"
        />
        <MetricCard
          label="Digital Intelligence Profile"
          value={profile?.status ?? 'Pending'}
          detail={`Confidence ${profile?.confidenceScore ?? 0}%`}
        />
        <MetricCard
          label="Enterprise Intelligence Score"
          value={opportunity?.enterpriseIntelligenceScore ?? 'Pending'}
          detail={`AI readiness: ${opportunity?.aiReadiness?.level ?? 'Pending'}`}
        />
        <MetricCard
          label="AI Workforce"
          value={workforce?.status ?? 'Pending'}
          detail={`${workforce?.recommendedAgents?.length ?? 0} agents recommended`}
        />
        <MetricCard
          label="Digital Twin"
          value={twin?.status ?? 'Pending'}
          detail={twin?.twinType ?? 'Enterprise Digital Twin'}
        />
        <MetricCard
          label="Second Balance Sheet"
          value={secondBalanceSheet?.status ?? 'Pending'}
          detail={secondBalanceSheet?.estimatedReadiness?.level ?? 'Pending'}
        />
        <MetricCard
          label="Recommended Actions"
          value={runtime?.recommendedActions?.length ?? 0}
          detail="Awaiting executive review"
        />
      </section>

      <section className="ec-panel">
        <p className="ec-label">Executive Brief</p>
        <h2>Recommended next actions</h2>
        <ul>
          {(runtime?.recommendedActions ?? [
            'Discover an enterprise',
            'Generate Digital Intelligence Profile',
            'Review opportunity assessment',
          ]).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <section className="ec-panel">
        <p className="ec-label">Enterprise Journey</p>
        <div className="ec-journey">
          {[
            'Discover',
            'Understand',
            'Model',
            'Intelligence',
            'Create Value',
            'Commercialize',
          ].map((stage) => (
            <span key={stage}>{stage}</span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default EnterpriseControlShell
