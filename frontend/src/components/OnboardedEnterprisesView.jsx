function formatCurrency(value) {
  if (!Number.isFinite(Number(value))) {
    return 'Internal estimate pending'
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: Number(value) >= 1000000 ? 'compact' : 'standard',
    style: 'currency'
  }).format(Number(value))
}

function formatPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return 'Pending assessment'
  }

  return `${Number(value)}%`
}

function enterpriseInitials(name) {
  return String(name || 'Enterprise')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function normalize(value) {
  return String(value || '').toLowerCase()
}

function findEnterpriseVisual(record, masterMonitoring) {
  const visuals = masterMonitoring?.enterpriseVisuals ?? []
  const name = normalize(record.enterpriseName)

  return visuals.find((visual) => {
    const visualName = normalize(visual.name)
    return visualName.includes(name) || name.includes(visualName.replace(' digital twin', ''))
  })
}

function buildEnterpriseRecords(onboardingData, masterMonitoring) {
  const homes = masterMonitoring?.digitalTwinHomes ?? []
  const feeds = onboardingData?.dataFeedRequirements ?? []
  const candidates = onboardingData?.dtaCandidates ?? []
  const validations = onboardingData?.humanValidationItems ?? []
  const mirrors = onboardingData?.digitalMirrors ?? []
  const pipelines = onboardingData?.pipelines ?? []

  return (onboardingData?.onboarding ?? []).map((record) => {
    const visual = findEnterpriseVisual(record, masterMonitoring)
    const home = homes.find((item) => item.enterpriseId === visual?.enterpriseId)
    const mirror = mirrors.find((item) => item.id === record.linkedDigitalMirror)
    const recordCandidates = candidates.filter((candidate) => record.linkedDtaCandidates?.includes(candidate.id))
    const recordFeeds = feeds.filter((feed) => feed.enterpriseId === record.id)
    const recordValidations = validations.filter((item) => item.enterpriseId === record.id)
    const openValidations = recordValidations.filter((item) => !['Approved', 'Completed'].includes(item.status))
    const pipeline = pipelines.find((item) => item.enterpriseId === record.id)

    return {
      ...record,
      candidateCount: recordCandidates.length,
      feedCount: recordFeeds.length,
      home,
      mirror,
      openValidationCount: openValidations.length,
      pipeline,
      validationCount: recordValidations.length,
      visual
    }
  })
}

function PortfolioMetric({ label, value, note }) {
  return (
    <article className="onboarded-enterprise-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}

function EnterpriseRow({ enterprise }) {
  const brand = enterprise.visual?.brandColor ?? '#20c997'

  return (
    <article className="onboarded-enterprise-row" style={{ '--enterprise-brand': brand }}>
      <div className="onboarded-enterprise-identity">
        <div className="enterprise-avatar" aria-hidden="true" style={{ '--enterprise-brand': brand }}>
          {enterprise.visual?.logoUrl ? <img alt="" src={enterprise.visual.logoUrl} /> : <span>{enterpriseInitials(enterprise.enterpriseName)}</span>}
        </div>
        <div>
          <span>{enterprise.industry}</span>
          <h3>{enterprise.enterpriseName}</h3>
          <small>{enterprise.enterpriseType} / {enterprise.owner}</small>
        </div>
      </div>

      <dl className="onboarded-enterprise-stats">
        <div><dt>Health</dt><dd>{formatPercent(enterprise.liveStatus?.healthScore)}</dd></div>
        <div><dt>Progress</dt><dd>{formatPercent(enterprise.liveStatus?.progress ?? enterprise.pipeline?.progress)}</dd></div>
        <div><dt>DTA Candidates</dt><dd>{enterprise.candidateCount}</dd></div>
        <div><dt>Data Feeds</dt><dd>{enterprise.feedCount}</dd></div>
        <div><dt>Validation</dt><dd>{enterprise.openValidationCount} open</dd></div>
        <div><dt>Value</dt><dd>{formatCurrency(enterprise.home?.totalEstimatedValue ?? enterprise.visual?.valuationSummary?.totalEstimatedValue)}</dd></div>
      </dl>

      <div className="onboarded-enterprise-status">
        <strong>{enterprise.stage}</strong>
        <span>{enterprise.mirror?.validationStatus ?? 'Digital Mirror pending'}</span>
        <p>{enterprise.liveStatus?.recommendedAction}</p>
        <div className="monitoring-chip-row">
          {(enterprise.assignedAgents ?? []).slice(0, 4).map((agent) => (
            <span key={agent.agentId}>{agent.agentName}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

function OnboardedEnterprisesView({ masterMonitoring, onboardingData }) {
  const enterprises = buildEnterpriseRecords(onboardingData, masterMonitoring)
  const summary = onboardingData?.summary ?? {}
  const visualCount = masterMonitoring?.monitoring?.onboardedEnterprises ?? masterMonitoring?.enterpriseVisuals?.length ?? 0
  const requiresAttention = enterprises.filter((enterprise) => enterprise.liveStatus?.requiresAttention).length

  return (
    <section className="master-monitoring-view onboarded-enterprises-view">
      <div className="monitoring-hero compact">
        <div>
          <span>Enterprise Value / Onboarded Enterprises</span>
          <h2>Onboarded Enterprises</h2>
          <p>
            Portfolio view for enterprises and organizations being onboarded into EOS, including Digital Mirrors,
            DTA candidates, feed readiness, agent assignments, and human validation.
          </p>
        </div>
        <strong>{enterprises.length} records</strong>
      </div>

      <div className="onboarded-enterprise-metric-grid">
        <PortfolioMetric label="Onboarding Records" note="Enterprise and organization intake" value={summary.onboardingRecords ?? enterprises.length} />
        <PortfolioMetric label="Visual Enterprise Homes" note="Shown in Master Monitoring summary" value={visualCount} />
        <PortfolioMetric label="DTA Candidates" note="Formation pipeline" value={summary.dtaCandidates ?? 0} />
        <PortfolioMetric label="Feed Requirements" note="Connector readiness" value={summary.dataFeedRequirements ?? 0} />
        <PortfolioMetric label="Human Validation" note="Open review items" value={summary.humanValidationItems ?? 0} />
        <PortfolioMetric label="Attention Required" note="Executive review recommended" value={requiresAttention} />
      </div>

      <div className="onboarded-enterprise-list">
        {enterprises.map((enterprise) => (
          <EnterpriseRow enterprise={enterprise} key={enterprise.id} />
        ))}
      </div>
    </section>
  )
}

export default OnboardedEnterprisesView
