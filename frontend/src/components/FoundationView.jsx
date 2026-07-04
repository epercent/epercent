import { executiveValue } from '../design-system/eosDesignSystem.js'

const viewContent = {
  governance: {
    label: 'Enterprise',
    title: 'Governance',
    summary: 'Governance status is represented through strategy approvals, action governance, executive approval queues, and roadmap alignment.',
    actions: ['Review Strategy Governance', 'Review Action Governance', 'Review Approval Queue']
  },
  valuation: {
    label: 'Enterprise Value',
    title: 'Valuation',
    summary: 'Digital enterprise valuation is available in the Strategic Layer as an internal estimate, not audited valuation.',
    actions: ['Review Internal Estimate', 'Review Value Drivers', 'Review Governance Notes']
  },
  'second-balance-sheet': {
    label: 'Enterprise Value',
    title: 'Second Balance Sheet',
    summary: 'Second Balance Sheet metrics are available in the Strategic Layer for digital assets, knowledge assets, workflows, and governance assets.',
    actions: ['Review Metrics', 'Review Methodology', 'Review Research Notes']
  },
  'digital-twin-assets': {
    label: 'Enterprise Value',
    title: 'Digital Twin Assets',
    summary: 'Digital Twin Asset monitoring is available in the Strategic Layer for ePercent and EOS platform asset formation.',
    actions: ['Review DTA Monitoring', 'Review Formation Status', 'Review Valuation Readiness']
  },
  'investor-centre': {
    label: 'Enterprise Value',
    title: 'Investor Centre',
    summary: 'Investor readiness notes are connected to strategy, valuation, Second Balance Sheet, roadmap, and AI Workforce Operations.',
    actions: ['Review Investor Notes', 'Prepare Board Update', 'Review Commercial Value']
  },
  storage: {
    label: 'Platform',
    title: 'Storage',
    summary: 'Persistent storage health is visible through the Storage Health panel and Platform Administration Center.',
    actions: ['Review Storage Status', 'Review Collections', 'Review Warnings']
  },
  backups: {
    label: 'Platform',
    title: 'Backups',
    summary: 'Backup metadata is visible in Platform Administration. Restore validation remains the next resilience priority.',
    actions: ['Review Latest Backup', 'Validate Restore', 'Review Backup Count']
  },
  health: {
    label: 'Platform',
    title: 'Health',
    summary: 'Platform health is summarized through backend, frontend, API, storage, backup, and Mission Control status.',
    actions: ['Run Health Check', 'Review API Health', 'Review System Warnings']
  },
  releases: {
    label: 'Platform',
    title: 'Releases',
    summary: 'Release status is governed through root release scripts, release metadata, backups, and quality gates.',
    actions: ['Review Release Notes', 'Review Build Version', 'Review Quality Gates']
  },
  architecture: {
    label: 'Development',
    title: 'Architecture',
    summary: 'Architecture governance is represented by Atlas, PMO dependencies, design system rules, and technical debt records.',
    actions: ['Review Architecture Docs', 'Review Dependencies', 'Review Technical Debt']
  },
  engineering: {
    label: 'Development',
    title: 'Engineering',
    summary: 'Engineering controls include estimates, ECCR reporting, lint, build, tests, backup, status, and five quality gates.',
    actions: ['Review Engineering Standard', 'Review Build Health', 'Review Capability Process']
  },
  briefing: {
    label: 'My Workspace',
    title: 'Executive Briefing',
    summary: 'The personal executive briefing area is prepared for priority summaries, review time, decisions, and saved operating context.',
    actions: ['Review Current Priority', 'Review Attention Items', 'Prepare Executive Update']
  },
  tasks: {
    label: 'My Workspace',
    title: 'Tasks',
    summary: 'The personal task queue is reserved for future governed assignments, delegated work, and executive follow-up items.',
    actions: ['Review Assigned Work', 'Review Delegations', 'Prepare Task Governance']
  },
  decisions: {
    label: 'My Workspace',
    title: 'Decisions',
    summary: 'The decision queue is reserved for future approvals, governance decisions, investment reviews, and release authorizations.',
    actions: ['Review Approvals', 'Review Governance Items', 'Prepare Decision Brief']
  },
  notes: {
    label: 'My Workspace',
    title: 'Notes',
    summary: 'The executive notes area is reserved for saved context, research observations, board notes, and operating memory.',
    actions: ['Review Saved Context', 'Review Research Notes', 'Prepare Knowledge Capture']
  },
  workspace: {
    label: 'My Workspace',
    title: 'My Workspace',
    summary: 'The executive workspace foundation is ready for future personal tasks, briefings, approvals, and saved views.',
    actions: ['Review Briefings', 'Review Approvals', 'Review Current Priority']
  },
}

function FoundationView({ mode, strategicLayer, adminData, pmo, kernel, decisionIntelligence }) {
  const content = viewContent[mode] ?? viewContent.workspace

  return (
    <section className="operations-section">
      <div className="section-heading">
        <div>
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
        </div>
        <strong>Foundation Ready</strong>
      </div>

      <article className="admin-safety-note">
        <strong>{content.title}</strong>
        <p>{content.summary}</p>
      </article>

      <div className="operations-grid">
        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>EOS Kernel</h3>
            <strong>{executiveValue(kernel?.status, 'Unavailable')}</strong>
          </div>
          <div className="operations-note-list">
            <p>Kernel version: {executiveValue(kernel?.version, '0.1')}</p>
            <p>Subsystems: {executiveValue(kernel?.subsystems?.length, 0)}</p>
            <p>Source: {executiveValue(kernel?.source ? 'Discovered' : null, 'Not Discovered')}</p>
          </div>
        </section>

        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Decision Intelligence</h3>
            <strong>{executiveValue(decisionIntelligence?.status, 'Unavailable')}</strong>
          </div>
          <div className="operations-note-list">
            <p>Engine version: {executiveValue(decisionIntelligence?.version, '0.1')}</p>
            <p>Mode: {executiveValue(decisionIntelligence?.mode, 'Not Loaded')}</p>
            <p>Assessments: {executiveValue(decisionIntelligence?.supportedAssessments?.length, 0)}</p>
          </div>
        </section>

        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Current Context</h3>
            <strong>{executiveValue(pmo?.masterRoadmap?.currentCapability, 'EOS-CAP-0028')}</strong>
          </div>
          <div className="operations-note-list">
            <p>Strategic approval: {executiveValue(strategicLayer?.strategy?.approvalStatus, 'Awaiting Review')}</p>
            <p>Platform version: {executiveValue(adminData?.currentVersion, '0.20.0')}</p>
            <p>Backup health: {executiveValue(adminData?.backupHealth, 'Pending Assessment')}</p>
          </div>
        </section>

        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Available Actions</h3>
            <strong>{content.actions.length}</strong>
          </div>
          <div className="operations-note-list">
            {content.actions.map((action) => (
              <p key={action}>{action}</p>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default FoundationView
