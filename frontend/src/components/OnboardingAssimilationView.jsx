function executiveValue(value, fallback = 'Awaiting data') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return value
}

function SummaryTile({ label, value }) {
  return (
    <article className="onboarding-summary-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function OnboardingCard({ record, pipeline }) {
  return (
    <article className="onboarding-card">
      <div className="monitoring-panel-heading">
        <span>{record.industry}</span>
        <h3>{record.enterpriseName}</h3>
      </div>
      <dl className="monitoring-stat-grid">
        <div><dt>Status</dt><dd>{record.status}</dd></div>
        <div><dt>Stage</dt><dd>{record.stage}</dd></div>
        <div><dt>Progress</dt><dd>{record.liveStatus?.progress ?? pipeline?.progress}%</dd></div>
        <div><dt>Validation</dt><dd>{record.humanValidationRequired ? 'Required' : 'No Action Required'}</dd></div>
      </dl>
      <p>{record.liveStatus?.summary}</p>
      <div className="monitoring-chip-row">
        {(record.assignedAgents ?? []).map((agent) => (
          <span key={agent.agentId}>{agent.agentName}: {agent.assignment}</span>
        ))}
      </div>
    </article>
  )
}

function PipelineView({ data }) {
  return (
    <section className="onboarding-stage-grid">
      {(data?.pipelines ?? []).map((pipeline) => (
        <article className="monitoring-panel" key={pipeline.id}>
          <div className="monitoring-panel-heading">
            <span>{pipeline.enterpriseName}</span>
            <h3>{pipeline.currentStage}</h3>
          </div>
          <div className="assimilation-stage-list">
            {pipeline.stages.map((stage) => (
              <article key={`${pipeline.id}-${stage.stageId}`}>
                <div>
                  <span>{stage.stageId}</span>
                  <strong>{stage.name}</strong>
                  <small>{stage.ownerAgent} / {stage.status}</small>
                </div>
                <meter max="100" value={stage.progress}>{stage.progress}%</meter>
                <p>{stage.recommendedAction}</p>
              </article>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}

function DigitalMirrorsView({ data }) {
  return (
    <section className="enterprise-home-grid">
      {(data?.digitalMirrors ?? []).map((mirror) => (
        <article className="monitoring-panel" key={mirror.id}>
          <div className="monitoring-panel-heading">
            <span>{mirror.industry}</span>
            <h3>{mirror.name}</h3>
          </div>
          <dl className="monitoring-stat-grid wide">
            <div><dt>Confidence</dt><dd>{mirror.confidenceScore}%</dd></div>
            <div><dt>Validation</dt><dd>{mirror.validationStatus}</dd></div>
            <div><dt>Objects</dt><dd>{mirror.objectMap.length}</dd></div>
            <div><dt>Risks</dt><dd>{mirror.riskMap.length}</dd></div>
          </dl>
          <p>{mirror.description}</p>
          <div className="asset-node-grid">
            {mirror.objectMap.map((object) => <article key={object}><strong>{object}</strong><small>Enterprise object candidate</small></article>)}
          </div>
        </article>
      ))}
    </section>
  )
}

function DtaCandidatesView({ data }) {
  return (
    <section className="enterprise-home-grid">
      {(data?.dtaCandidates ?? []).map((candidate) => (
        <article className="monitoring-panel" key={candidate.id}>
          <div className="monitoring-panel-heading">
            <span>{candidate.assetType}</span>
            <h3>{candidate.name}</h3>
          </div>
          <dl className="monitoring-stat-grid">
            <div><dt>Status</dt><dd>{candidate.status}</dd></div>
            <div><dt>Value Potential</dt><dd>{candidate.valuationPotential}</dd></div>
            <div><dt>Risk</dt><dd>{candidate.riskScore}</dd></div>
            <div><dt>Confidence</dt><dd>{candidate.confidenceScore}%</dd></div>
          </dl>
          <p>{candidate.description}</p>
          <div className="monitoring-chip-row">
            {candidate.missingData.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
      ))}
    </section>
  )
}

function DataFeedsView({ data }) {
  return (
    <section className="telemetry-grid">
      {(data?.dataFeedRequirements ?? []).map((feed) => (
        <article className="telemetry-card" key={feed.id}>
          <span>{feed.priority} priority</span>
          <h3>{feed.sourceName}</h3>
          <strong>{feed.connectionStatus}</strong>
          <p>{feed.targetObject} / {feed.frequency} / {feed.dataQualityStatus}</p>
          <small>{feed.requiredFields.join(', ')}</small>
        </article>
      ))}
    </section>
  )
}

function HumanValidationView({ data }) {
  return (
    <section className="enterprise-home-grid">
      {(data?.onboarding ?? []).map((record) => {
        const items = (data?.humanValidationItems ?? []).filter((item) => item.enterpriseId === record.id)

        return (
          <article className="monitoring-panel" key={record.id}>
            <div className="monitoring-panel-heading">
              <span>{record.enterpriseName}</span>
              <h3>Human Validation Checklist</h3>
            </div>
            <div className="generation-flow validation-flow">
              {items.map((item) => (
                <article key={item.id}>
                  <span>{item.priority}</span>
                  <strong>{item.checklistItem}</strong>
                  <small>{item.status} / {item.owner}</small>
                </article>
              ))}
            </div>
          </article>
        )
      })}
    </section>
  )
}

function OnboardingOverview({ data }) {
  const pipelinesByEnterprise = new Map((data?.pipelines ?? []).map((pipeline) => [pipeline.enterpriseId, pipeline]))

  return (
    <section className="enterprise-home-grid">
      {(data?.onboarding ?? []).map((record) => (
        <OnboardingCard key={record.id} pipeline={pipelinesByEnterprise.get(record.id)} record={record} />
      ))}
    </section>
  )
}

function OnboardingAssimilationView({ data, mode }) {
  const summary = data?.summary ?? {}

  return (
    <section className="master-monitoring-view onboarding-assimilation-view">
      <div className="monitoring-hero compact">
        <div>
          <span>Enterprise Value / DTA Assimilation</span>
          <h2>Enterprise Onboarding & DTA Assimilation</h2>
          <p>
            Structured enterprise intake, Digital Mirror creation, DTA candidate discovery, feed requirements, agent
            assignment, and human validation before governed DTA formation.
          </p>
        </div>
        <strong>{executiveValue(data?.capability, 'EOS-CAP-0032')}</strong>
      </div>

      <div className="onboarding-summary-grid">
        <SummaryTile label="Onboarding Records" value={summary.onboardingRecords ?? 0} />
        <SummaryTile label="Digital Mirrors" value={summary.digitalMirrors ?? 0} />
        <SummaryTile label="DTA Candidates" value={summary.dtaCandidates ?? 0} />
        <SummaryTile label="Feed Requirements" value={summary.dataFeedRequirements ?? 0} />
        <SummaryTile label="Validation Items" value={summary.humanValidationItems ?? 0} />
        <SummaryTile label="Missing Data Items" value={summary.missingDataItems ?? 0} />
      </div>

      {mode === 'assimilation-pipeline' ? <PipelineView data={data} /> : null}
      {mode === 'digital-mirrors' ? <DigitalMirrorsView data={data} /> : null}
      {mode === 'dta-candidates' ? <DtaCandidatesView data={data} /> : null}
      {mode === 'data-feed-requirements' ? <DataFeedsView data={data} /> : null}
      {mode === 'human-validation' ? <HumanValidationView data={data} /> : null}
      {mode === 'enterprise-onboarding' ? <OnboardingOverview data={data} /> : null}
    </section>
  )
}

export default OnboardingAssimilationView
