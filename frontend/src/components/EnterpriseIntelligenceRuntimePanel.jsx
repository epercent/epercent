function Metric({ label, value, detail }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  )
}

function EnterpriseIntelligenceRuntimePanel({ runtimeEnvelope }) {
  const runtime = runtimeEnvelope?.missionControlRuntime
  const profile = runtimeEnvelope?.profile
  const opportunity = runtimeEnvelope?.opportunityAssessment
  const workforce = runtimeEnvelope?.aiWorkforceRecommendation
  const twin = runtimeEnvelope?.digitalTwinPlaceholder
  const secondBalanceSheet = runtimeEnvelope?.secondBalanceSheetSignal

  if (!runtime) {
    return null
  }

  return (
    <section className="executive-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise Intelligence Runtime</p>
          <h2>{runtime.enterprise?.name ?? 'Enterprise'} Mission Control</h2>
        </div>
        <strong>{runtime.runtime?.status ?? 'Active'}</strong>
      </div>

      <div className="ceo-headline-grid">
        <Metric
          label="Digital Intelligence Profile"
          value={profile?.status ?? 'Generated'}
          detail={`Confidence ${profile?.confidenceScore ?? 0}%`}
        />
        <Metric
          label="Enterprise Intelligence Score"
          value={opportunity?.enterpriseIntelligenceScore ?? 'Pending'}
          detail={`AI readiness: ${opportunity?.aiReadiness?.level ?? 'Pending'}`}
        />
        <Metric
          label="AI Workforce"
          value={workforce?.status ?? 'Recommended'}
          detail={`${workforce?.recommendedAgents?.length ?? 0} agents recommended`}
        />
        <Metric
          label="Digital Twin"
          value={twin?.status ?? 'Pending'}
          detail={twin?.twinType ?? 'Enterprise Digital Twin'}
        />
        <Metric
          label="Second Balance Sheet"
          value={secondBalanceSheet?.status ?? 'Pending'}
          detail={secondBalanceSheet?.estimatedReadiness?.level ?? 'Pending'}
        />
        <Metric
          label="Next Mission"
          value={opportunity?.nextRecommendedMission ?? runtime.nextStage}
          detail="Governed AI Workforce execution"
        />
      </div>

      <article className="ceo-recommendation">
        <span>Recommended Actions</span>
        <ul>
          {(runtime.recommendedActions ?? []).slice(0, 5).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

export default EnterpriseIntelligenceRuntimePanel
