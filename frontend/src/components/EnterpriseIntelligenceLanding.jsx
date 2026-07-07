function EnterpriseIntelligenceLanding({ runtimeEnvelope, onOpenMissionControl }) {
  const runtime = runtimeEnvelope?.missionControlRuntime
  const profile = runtimeEnvelope?.profile
  const opportunity = runtimeEnvelope?.opportunityAssessment
  const workforce = runtimeEnvelope?.aiWorkforceRecommendation
  const twin = runtimeEnvelope?.digitalTwinPlaceholder
  const secondBalanceSheet = runtimeEnvelope?.secondBalanceSheetSignal

  return (
    <section className="executive-section">
      <div className="section-heading">
        <div>
          <p className="section-label">EOS Enterprise Intelligence Platform</p>
          <h1>Discover. Understand. Create Value.</h1>
          <p>
            Enter an enterprise source and EOS will generate a Digital Intelligence Profile,
            opportunity assessment, AI Workforce recommendation, Digital Twin signal, and
            Second Balance Sheet signal.
          </p>
        </div>
        <strong>{runtime?.runtime?.status ?? 'Ready'}</strong>
      </div>

      <div className="ceo-headline-grid">
        <article>
          <span>Enterprise</span>
          <strong>{runtime?.enterprise?.name ?? 'Awaiting Discovery'}</strong>
          <small>{runtime?.enterprise?.source ?? 'No source selected'}</small>
        </article>

        <article>
          <span>Digital Intelligence Profile</span>
          <strong>{profile?.status ?? 'Pending'}</strong>
          <small>Confidence {profile?.confidenceScore ?? 0}%</small>
        </article>

        <article>
          <span>Enterprise Intelligence Score</span>
          <strong>{opportunity?.enterpriseIntelligenceScore ?? 'Pending'}</strong>
          <small>AI readiness: {opportunity?.aiReadiness?.level ?? 'Pending'}</small>
        </article>

        <article>
          <span>AI Workforce</span>
          <strong>{workforce?.status ?? 'Pending'}</strong>
          <small>{workforce?.recommendedAgents?.length ?? 0} agents recommended</small>
        </article>

        <article>
          <span>Digital Twin</span>
          <strong>{twin?.status ?? 'Pending'}</strong>
          <small>{twin?.twinType ?? 'Enterprise Digital Twin'}</small>
        </article>

        <article>
          <span>Second Balance Sheet</span>
          <strong>{secondBalanceSheet?.status ?? 'Pending'}</strong>
          <small>{secondBalanceSheet?.estimatedReadiness?.level ?? 'Pending'}</small>
        </article>
      </div>

      <article className="ceo-recommendation">
        <span>Current EOS Runtime Journey</span>
        <p>
          Discovery → Digital Intelligence Profile → Opportunity Assessment → AI Workforce
          Recommendation → Digital Twin Placeholder → Second Balance Sheet Signal → Mission Control
        </p>
      </article>

      <button className="primary-action" onClick={onOpenMissionControl}>
        Open Mission Control
      </button>
    </section>
  )
}

export default EnterpriseIntelligenceLanding
