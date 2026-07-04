import { useState } from 'react'
import { executiveValue } from '../design-system/eosDesignSystem.js'

function pct(value) {
  return `${Number.isFinite(Number(value)) ? Number(value) : 0}%`
}

function listItems(items = []) {
  return (
    <ul className="strategy-note-list">
      {items.map((item) => (
        <li key={typeof item === 'string' ? item : item.id ?? item.concept ?? item.name}>
          {typeof item === 'string' ? item : item.concept ?? item.name ?? item.reason}
        </li>
      ))}
    </ul>
  )
}

function ReadinessPanel({ assessment, title }) {
  if (!assessment) {
    return null
  }

  return (
    <section className="strategy-panel">
      <div className="strategy-panel-heading">
        <h3>{title}</h3>
        <strong>{assessment.score}/100</strong>
      </div>
      <div className="strategic-maturity-bar">
        <span style={{ width: pct(assessment.score) }} />
      </div>
      <div className="strategic-readiness-grid">
        <article>
          <span>Strengths</span>
          {listItems(assessment.strengths)}
        </article>
        <article>
          <span>Gaps</span>
          {listItems(assessment.gaps)}
        </article>
      </div>
      <p>{assessment.recommendedAction}</p>
    </section>
  )
}

function InvestmentThesis({ thesis }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Strategy / Investment Thesis</p>
          <h2>Investment Thesis Alignment</h2>
        </div>
        <strong>{executiveValue(thesis?.status, 'In Progress')}</strong>
      </div>

      <div className="strategy-grid">
        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Already Implemented</h3>
            <strong>{thesis?.alreadyImplemented?.length ?? 0}</strong>
          </div>
          {(thesis?.alreadyImplemented ?? []).map((item) => (
            <article className="strategic-record" key={item.concept}>
              <strong>{item.concept}</strong>
              <p>{item.evidence}</p>
            </article>
          ))}
        </section>

        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Partially Implemented</h3>
            <strong>{thesis?.partiallyImplemented?.length ?? 0}</strong>
          </div>
          {(thesis?.partiallyImplemented ?? []).map((item) => (
            <article className="strategic-record" key={item.concept}>
              <strong>{item.concept}</strong>
              <p>{item.gap}</p>
              <small>{item.recommendedFutureCapability}</small>
            </article>
          ))}
        </section>

        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Not Yet Implemented</h3>
            <strong>{thesis?.notYetImplemented?.length ?? 0}</strong>
          </div>
          {(thesis?.notYetImplemented ?? []).map((item) => (
            <article className="strategic-record" key={item.concept}>
              <strong>{item.concept}</strong>
              <p>{item.reason}</p>
            </article>
          ))}
        </section>

        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>Source Presentations</h3>
            <strong>{thesis?.sourcePresentations?.length ?? 0}</strong>
          </div>
          {(thesis?.sourcePresentations ?? []).map((item) => (
            <article className="strategic-record" key={item.name}>
              <strong>{item.name}</strong>
              <p>{item.repositoryStatus}</p>
              <small>{item.alignmentStatus}</small>
            </article>
          ))}
        </section>
      </div>
    </section>
  )
}

function TechnologyFlywheel({ flywheel }) {
  const [activeStepId, setActiveStepId] = useState(flywheel?.steps?.[0]?.id)
  const steps = flywheel?.steps ?? []
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0]

  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise Value / Flywheel</p>
          <h2>EOS Technology Flywheel</h2>
        </div>
        <strong>{flywheel?.overallMaturity ?? 0}% maturity</strong>
      </div>

      <div className="flywheel-layout">
        <div className="flywheel-visual" aria-label="EOS Technology Flywheel">
          {steps.map((step, index) => (
            <button
              className={step.id === activeStep?.id ? 'is-active' : ''}
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              title={step.currentContribution}
              type="button"
            >
              <span>{index + 1}</span>
              <strong>{step.name}</strong>
            </button>
          ))}
        </div>
        <section className="strategy-panel">
          <div className="strategy-panel-heading">
            <h3>{activeStep?.name ?? 'Flywheel Step'}</h3>
            <strong>{activeStep?.currentMaturity ?? 0}%</strong>
          </div>
          <p>{activeStep?.currentContribution}</p>
          <dl className="strategy-micro-grid">
            <div>
              <dt>Health</dt>
              <dd>{executiveValue(activeStep?.currentHealth, 'Monitoring')}</dd>
            </div>
            <div>
              <dt>Value</dt>
              <dd>{executiveValue(activeStep?.enterpriseValueContribution, 'Pending Assessment')}</dd>
            </div>
            <div>
              <dt>Dependencies</dt>
              <dd>{activeStep?.dependencies?.join(', ')}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  )
}

function ThreeHorizonRoadmap({ roadmap }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise / Roadmap</p>
          <h2>Three-Horizon Roadmap</h2>
        </div>
        <strong>{roadmap?.status ?? 'In Progress'}</strong>
      </div>
      <div className="horizon-grid">
        {(roadmap?.horizons ?? []).map((horizon) => (
          <article className="strategy-panel" key={horizon.id}>
            <div className="strategy-panel-heading">
              <h3>{horizon.name}: {horizon.theme}</h3>
              <strong>{horizon.progress}%</strong>
            </div>
            <div className="strategic-maturity-bar">
              <span style={{ width: pct(horizon.progress) }} />
            </div>
            <p>{horizon.investmentReadiness}</p>
            <span>Focus Areas</span>
            {listItems(horizon.focusAreas)}
            <span>Dependencies</span>
            {listItems(horizon.dependencies)}
          </article>
        ))}
      </div>
    </section>
  )
}

function RevenueEngine({ revenueEngine }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise Value / Revenue</p>
          <h2>Revenue Engine</h2>
        </div>
        <strong>{revenueEngine?.streams?.length ?? 0} streams</strong>
      </div>
      <div className="revenue-grid">
        {(revenueEngine?.streams ?? []).map((stream) => (
          <article className="strategic-record" key={stream.id}>
            <span>{stream.status}</span>
            <strong>{stream.name}</strong>
            <div className="strategic-maturity-bar">
              <span style={{ width: pct(stream.estimatedMaturity) }} />
            </div>
            <p>{stream.potentialMarket}</p>
            <small>{stream.dependencies.join(', ')}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function DtaLifecycle({ dtaLifecycle }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise Value / DTA</p>
          <h2>Digital Twin Asset Lifecycle</h2>
        </div>
        <strong>{dtaLifecycle?.stages?.length ?? 0} stages</strong>
      </div>
      <div className="lifecycle-chain">
        {(dtaLifecycle?.stages ?? []).map((stage) => (
          <article key={stage.id}>
            <span>{stage.sequence}</span>
            <strong>{stage.name}</strong>
            <small>{stage.governanceRequired ? 'Governance required' : 'Discovery'}</small>
          </article>
        ))}
      </div>
      <div className="strategy-grid">
        {(dtaLifecycle?.assets ?? []).map((asset) => (
          <section className="strategy-panel" key={asset.id}>
            <div className="strategy-panel-heading">
              <h3>{asset.name}</h3>
              <strong>{asset.lifecycleStage}</strong>
            </div>
            <div className="strategic-maturity-bar">
              <span style={{ width: pct(asset.progress) }} />
            </div>
            <p>{asset.recommendedAction}</p>
          </section>
        ))}
      </div>
    </section>
  )
}

function Kipr({ kipr }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">KIPR</p>
          <h2>Knowledge, Intellectual Property, Patents, and Research</h2>
        </div>
        <strong>{kipr?.areas?.length ?? 0} areas</strong>
      </div>
      <div className="revenue-grid">
        {(kipr?.areas ?? []).map((area) => (
          <article className="strategic-record" key={area.id}>
            <span>{area.status}</span>
            <strong>{area.name}</strong>
            <p>Publication: {area.publicationReadiness}</p>
            <small>Commercial value: {area.commercialValue} / Research value: {area.researchValue}</small>
          </article>
        ))}
      </div>
      <section className="strategy-panel">
        <div className="strategy-panel-heading">
          <h3>Linked Research Assets</h3>
          <strong>{kipr?.documents?.length ?? 0}</strong>
        </div>
        {(kipr?.documents ?? []).map((document) => (
          <article className="strategic-record" key={document.id}>
            <strong>{document.title}</strong>
            <p>{document.status} / Owner: {document.owner}</p>
            <small>{document.linkedEnterpriseObjects.join(', ')}</small>
          </article>
        ))}
      </section>
    </section>
  )
}

function EnterpriseProfile({ profile }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise Profile</p>
          <h2>{profile?.company ?? 'ePercent'}</h2>
        </div>
        <strong>{profile?.status ?? 'Running on EOS'}</strong>
      </div>
      <dl className="strategy-metric-grid">
        {[
          ['Role', profile?.role?.join(', ')],
          ['EOS Platform', profile?.eosPlatform],
          ['AI Workforce', profile?.executiveAiWorkforce],
          ['Enterprise Value', Number.isFinite(Number(profile?.enterpriseValue)) ? `$${Number(profile.enterpriseValue).toLocaleString()}` : 'Internal estimate'],
          ['Digital Twin Status', profile?.digitalTwinStatus],
          ['Second Balance Sheet', profile?.secondBalanceSheet],
          ['Commercial Readiness', profile?.commercialReadiness],
          ['Investor Readiness', profile?.investorReadiness]
        ].map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{executiveValue(value, 'Pending Assessment')}</strong>
          </article>
        ))}
      </dl>
      <article className="admin-safety-note">
        <strong>Valuation Notice</strong>
        <p>{profile?.enterpriseValueBasis}</p>
      </article>
    </section>
  )
}

function IndustryFramework({ framework }) {
  return (
    <section className="strategic-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Development / Industry Framework</p>
          <h2>Cross Industry Framework</h2>
        </div>
        <strong>{framework?.industries?.length ?? 0} industries</strong>
      </div>
      <div className="industry-grid">
        {(framework?.industries ?? []).map((industry) => (
          <article className="strategic-record" key={industry.id}>
            <span>{industry.currentMaturity}</span>
            <strong>{industry.name}</strong>
            <p>{industry.potentialDtas.join(', ')}</p>
            <small>{industry.exampleOpportunities[0]}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function StrategicAlignmentView({ mode, strategicAlignment }) {
  const alignment = strategicAlignment?.strategicAlignment ?? strategicAlignment
  const thesis = strategicAlignment?.investmentThesis ?? alignment?.thesis
  const flywheel = strategicAlignment?.technologyFlywheel ?? alignment?.technologyFlywheel
  const horizons = strategicAlignment?.threeHorizonRoadmap ?? alignment?.threeHorizonRoadmap
  const revenue = strategicAlignment?.revenueEngine ?? alignment?.revenueEngine
  const lifecycle = strategicAlignment?.dtaLifecycle ?? alignment?.dtaLifecycle
  const kipr = strategicAlignment?.kipr ?? alignment?.kipr
  const profile = strategicAlignment?.enterpriseProfile ?? alignment?.enterpriseProfile
  const framework = strategicAlignment?.industryFramework ?? alignment?.industryFramework
  const readiness = strategicAlignment?.readinessAssessments ?? alignment?.readinessAssessments

  if (mode === 'investment-thesis') {
    return <InvestmentThesis thesis={thesis} />
  }

  if (mode === 'technology-flywheel') {
    return <TechnologyFlywheel flywheel={flywheel} />
  }

  if (mode === 'three-horizon-roadmap') {
    return <ThreeHorizonRoadmap roadmap={horizons} />
  }

  if (mode === 'revenue-engine') {
    return <RevenueEngine revenueEngine={revenue} />
  }

  if (mode === 'dta-lifecycle') {
    return <DtaLifecycle dtaLifecycle={lifecycle} />
  }

  if (mode === 'kipr') {
    return <Kipr kipr={kipr} />
  }

  if (mode === 'enterprise-profile') {
    return <EnterpriseProfile profile={profile} />
  }

  if (mode === 'industry-framework') {
    return <IndustryFramework framework={framework} />
  }

  if (mode === 'commercial-readiness') {
    return <ReadinessPanel assessment={readiness?.commercial} title="Commercial Readiness Assessment" />
  }

  if (mode === 'investor-readiness') {
    return <ReadinessPanel assessment={readiness?.investor} title="Investor Readiness Assessment" />
  }

  return <InvestmentThesis thesis={thesis} />
}

export default StrategicAlignmentView
