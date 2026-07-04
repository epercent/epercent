function executiveValue(value, fallback = 'Awaiting data') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return value
}

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

function formatMetricValue(metric) {
  if (metric.unit === 'USD') {
    return formatCurrency(metric.value)
  }

  return `${metric.value} ${metric.unit}`
}

function formatDisplayTime(timestampUtc, displayTimezone) {
  if (!timestampUtc) {
    return 'Awaiting timestamp'
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: displayTimezone || 'UTC'
    }).format(new Date(timestampUtc))
  } catch {
    return timestampUtc
  }
}

function MetricTile({ label, unit, value }) {
  return (
    <article className="monitoring-metric-tile">
      <span>{label}</span>
      <strong>{unit === 'USD' ? formatCurrency(value) : value}</strong>
      <small>{unit === 'USD' ? 'Internal estimate' : unit}</small>
    </article>
  )
}

function EnterpriseIdentity({ enterprise }) {
  const initials = enterprise?.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="enterprise-avatar"
      style={{ '--enterprise-brand': enterprise?.brandColor ?? '#20c997' }}
      aria-hidden="true"
    >
      {enterprise?.logoUrl ? <img alt="" src={enterprise.logoUrl} /> : <span>{initials || 'DT'}</span>}
    </div>
  )
}

function LayeredArchitectureDiagram({ layers = [] }) {
  return (
    <section className="monitoring-panel layered-diagram-panel">
      <div className="monitoring-panel-heading">
        <span>Digital Twin Structure</span>
        <h3>Layered Enterprise Architecture</h3>
      </div>
      <div className="layered-architecture" aria-label="Layered enterprise architecture diagram">
        {layers.map((layer, index) => (
          <article
            key={layer.id}
            style={{
              '--layer-color': layer.color,
              '--layer-offset': `${index * 9}px`
            }}
          >
            <span>{String(layer.order).padStart(2, '0')}</span>
            <strong>{layer.name}</strong>
            <small>{layer.status}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function MonitoringOverview({ data }) {
  const monitoring = data?.monitoring
  const enterpriseCount = monitoring?.onboardedEnterprises ?? data?.enterpriseVisuals?.length ?? 0
  const enterpriseValue = monitoring?.enterpriseValue ?? data?.enterpriseVisuals?.reduce(
    (total, enterprise) => total + Number(enterprise.valuationSummary?.totalEstimatedValue ?? 0),
    0
  )

  return (
    <section className="master-monitoring-view">
      <div className="monitoring-hero">
        <div>
          <span>Mission Control / Enterprise Value</span>
          <h2>Master Monitoring</h2>
          <p>
            Visual command layer for onboarded enterprises, Digital Twin Assets, systems, data feeds,
            agents, approvals, risks, and value signals.
          </p>
        </div>
        <strong>{executiveValue(monitoring?.governanceStatus, 'Active Review')}</strong>
      </div>

      <div className="monitoring-metric-grid">
        {(monitoring?.headlineMetrics ?? []).map((metric) => (
          <MetricTile key={metric.id} {...metric} />
        ))}
      </div>

      <div className="monitoring-visual-grid">
        <LayeredArchitectureDiagram layers={data?.architectureLayers} />
        <section className="monitoring-panel">
          <div className="monitoring-panel-heading">
            <span>Enterprise Portfolio</span>
            <h3>Onboarded Enterprise Summary</h3>
          </div>
          <div className="monitoring-summary-stack">
            <article>
              <span>Onboarded Enterprises</span>
              <strong>{enterpriseCount}</strong>
              <small>Detailed portfolio moved to Enterprise Value / Onboarded Enterprises.</small>
            </article>
            <article>
              <span>Portfolio Value</span>
              <strong>{formatCurrency(enterpriseValue)}</strong>
              <small>Internal EOS estimate only. Not audited valuation.</small>
            </article>
            <article>
              <span>Governance</span>
              <strong>{executiveValue(monitoring?.governanceStatus, 'Active Review')}</strong>
              <small>{monitoring?.humanApprovalPoints ?? 0} human approval points tracked.</small>
            </article>
            <a className="monitoring-action-link" href="#/onboarded-enterprises">Review Onboarded Enterprises</a>
          </div>
        </section>
      </div>
    </section>
  )
}

function EnterpriseHomeView({ data, onboardingData }) {
  return (
    <section className="master-monitoring-view">
      <div className="monitoring-hero compact">
        <div>
          <span>Digital Twin Assets / Enterprise Home</span>
          <h2>Enterprise Digital Twin Homes</h2>
        </div>
        <strong>{data?.digitalTwinHomes?.length ?? 0} homes</strong>
      </div>
      <div className="enterprise-home-grid">
        {(data?.enterpriseVisuals ?? []).map((enterprise) => {
          const home = data?.digitalTwinHomes?.find((record) => record.enterpriseId === enterprise.enterpriseId)
          const onboarding = (onboardingData?.onboarding ?? []).find((record) => {
            if (enterprise.enterpriseId === 'DTA-OIL-001') {
              return record.id === 'EOS-ONB-OIL-001'
            }

            if (enterprise.enterpriseId === 'DTA-EPERCENT-001') {
              return record.id === 'EOS-ONB-EPERCENT-001'
            }

            return record.enterpriseName === enterprise.name
          })
          const mirror = onboardingData?.digitalMirrors?.find((record) => record.enterpriseId === onboarding?.id)
          const candidates = (onboardingData?.dtaCandidates ?? []).filter((candidate) => candidate.enterpriseId === onboarding?.id)

          return (
            <article className="enterprise-home-panel" key={enterprise.id} style={{ '--enterprise-brand': enterprise.brandColor }}>
              <div className="enterprise-card-topline">
                <EnterpriseIdentity enterprise={enterprise} />
                <div>
                  <span>{enterprise.enterpriseId}</span>
                  <h3>{enterprise.name}</h3>
                  <small>{enterprise.industry} / {enterprise.timezone}</small>
                </div>
              </div>
              <dl className="monitoring-stat-grid wide">
                <div><dt>Enterprise Health</dt><dd>{home?.enterpriseHealth}%</dd></div>
                <div><dt>Asset Health</dt><dd>{home?.assetHealth}%</dd></div>
                <div><dt>Output Metric</dt><dd>{home?.productionMetric}</dd></div>
                <div><dt>Total Estimated Value</dt><dd>{formatCurrency(home?.totalEstimatedValue)}</dd></div>
                <div><dt>Risk Score</dt><dd>{home?.riskScore}</dd></div>
                <div><dt>Active Alerts</dt><dd>{home?.activeAlerts}</dd></div>
                <div><dt>Systems Status</dt><dd>{home?.systemsStatus}</dd></div>
                <div><dt>Human Approval Points</dt><dd>{home?.humanApprovalPoints}</dd></div>
              </dl>
              <div className="monitoring-chip-row">
                {(home?.agentsAssigned ?? []).map((agent) => <span key={agent}>{agent}</span>)}
              </div>
              {onboarding ? (
                <div className="enterprise-assimilation-links">
                  <span>Assimilation Links</span>
                  <strong>{mirror?.name ?? 'Digital Mirror pending'}</strong>
                  <small>{candidates.length} DTA candidates / {onboarding.stage}</small>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function StructureView({ data }) {
  const workflow = data?.generationWorkflows?.[0]

  return (
    <section className="master-monitoring-view">
      <div className="monitoring-visual-grid">
        <LayeredArchitectureDiagram layers={data?.architectureLayers} />
        <section className="monitoring-panel">
          <div className="monitoring-panel-heading">
            <span>Future Onboarding Workflow</span>
            <h3>Digital Twin Generation Process</h3>
          </div>
          <div className="generation-flow">
            {(workflow?.steps ?? []).map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function TelemetryView({ data }) {
  return (
    <section className="master-monitoring-view">
      <div className="monitoring-hero compact">
        <div>
          <span>Enterprise Telemetry</span>
          <h2>Simulated Data Feeds</h2>
        </div>
        <strong>UTC storage / local display</strong>
      </div>
      <div className="telemetry-grid">
        {(data?.telemetry ?? []).map((telemetry) => (
          <article className="telemetry-card" key={telemetry.id}>
            <span>{telemetry.sourceType}</span>
            <h3>{telemetry.metric}</h3>
            <strong>{formatMetricValue(telemetry)}</strong>
            <p>{telemetry.status} / confidence {telemetry.confidence}</p>
            <small>
              UTC {telemetry.timestampUtc} / {telemetry.displayTimezone}{' '}
              {formatDisplayTime(telemetry.timestampUtc, telemetry.displayTimezone)}
            </small>
          </article>
        ))}
      </div>
    </section>
  )
}

function SystemsAndAssetsView({ data, mode }) {
  const field = mode === 'enterprise-assets' ? 'primaryAssets' : 'systems'
  const heading = mode === 'enterprise-assets' ? 'Enterprise Assets' : 'Operational Systems'

  return (
    <section className="master-monitoring-view">
      <div className="monitoring-hero compact">
        <div>
          <span>Digital Twin Asset Portfolio</span>
          <h2>{heading}</h2>
        </div>
      </div>
      <div className="enterprise-home-grid">
        {(data?.enterpriseVisuals ?? []).map((enterprise) => (
          <article className="monitoring-panel" key={enterprise.id}>
            <div className="monitoring-panel-heading">
              <span>{enterprise.industry}</span>
              <h3>{enterprise.name}</h3>
            </div>
            <div className="asset-node-grid">
              {(enterprise[field] ?? []).map((item) => {
                const label = typeof item === 'string' ? item : item.name
                const meta = typeof item === 'string' ? 'Mapped asset' : `${item.status} / health ${item.healthScore}`
                return (
                  <article key={label}>
                    <strong>{label}</strong>
                    <small>{meta}</small>
                  </article>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function HumanWorkflowsView({ data }) {
  return (
    <section className="master-monitoring-view">
      <div className="monitoring-hero compact">
        <div>
          <span>Governance / Human Approval Points</span>
          <h2>Human Workflows</h2>
        </div>
      </div>
      <div className="enterprise-home-grid">
        {(data?.enterpriseVisuals ?? []).map((enterprise) => (
          <article className="monitoring-panel" key={enterprise.id}>
            <div className="monitoring-panel-heading">
              <span>{enterprise.enterpriseId}</span>
              <h3>{enterprise.name}</h3>
            </div>
            <div className="generation-flow">
              {enterprise.humanInteractionPoints.map((point, index) => (
                <article key={point}>
                  <span>{index + 1}</span>
                  <strong>{point}</strong>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function MasterMonitoringView({ data, mode, onboardingData }) {
  if (mode === 'enterprise-home') {
    return <EnterpriseHomeView data={data} onboardingData={onboardingData} />
  }

  if (mode === 'digital-twin-structure') {
    return <StructureView data={data} />
  }

  if (mode === 'data-feeds') {
    return <TelemetryView data={data} />
  }

  if (mode === 'systems' || mode === 'enterprise-assets') {
    return <SystemsAndAssetsView data={data} mode={mode} />
  }

  if (mode === 'human-workflows') {
    return <HumanWorkflowsView data={data} />
  }

  return <MonitoringOverview data={data} />
}

export default MasterMonitoringView
