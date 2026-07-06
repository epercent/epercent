import { executiveValue } from '../design-system/eosDesignSystem.js'
import WorkspaceTile from './WorkspaceTile.jsx'

function greetingForNow() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good morning Eric.'
  }

  if (hour < 18) {
    return 'Good afternoon Eric.'
  }

  return 'Good evening Eric.'
}

function WorkspaceHome({
  attentionByWorkspace,
  metrics,
  metricsByWorkspace,
  onOpenWorkspace,
  roadmap,
  status,
  workspaces,
  missionControlRuntime
}) {
  const totalAttention = Object.values(attentionByWorkspace).reduce((sum, value) => sum + value, 0)

  return (
    <section className="workspace-home">
      <div className="headquarters-lobby">
        <div>
          <p className="section-label">Digital Headquarters Lobby</p>
          <h1>{greetingForNow()}</h1>
          <p>
            EOS is {executiveValue(status?.status, 'Monitoring').toLowerCase()}.
            {' '}
            {totalAttention > 0
              ? `${totalAttention} workspace signals require executive review.`
              : 'No executive action is required right now.'}
          </p>
        </div>
        <dl>
          <div>
            <dt>Enterprise Health</dt>
            <dd>{executiveValue(metrics.platformHealth, 'Monitoring')}</dd>
          </div>
          <div>
            <dt>Enterprise Value</dt>
            <dd>{metrics.enterpriseValueLabel}</dd>
          </div>
          <div>
            <dt>Today&apos;s Executive Brief</dt>
            <dd>{executiveValue(roadmap?.currentCapability, 'Pending assessment')}</dd>
          </div>
          <div>
            <dt>Estimated Review Time</dt>
            <dd>{totalAttention > 0 ? `${Math.max(8, totalAttention * 4)} minutes` : 'No review required'}</dd>
          </div>
        </dl>
      </div>

      {missionControlRuntime && (
        <div className="headquarters-lobby">
          <div>
            <p className="section-label">Mission Control Runtime</p>
            <h2>{missionControlRuntime.enterprise?.name ?? 'Enterprise Discovery'}</h2>
            <p>{missionControlRuntime.digitalIntelligenceProfile?.intelligenceSummary}</p>
          </div>
          <dl>
            <div>
              <dt>Discovery Status</dt>
              <dd>{missionControlRuntime.discoveryStatus?.status ?? 'Pending'}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{missionControlRuntime.discoveryStatus?.confidenceScore ?? 0}%</dd>
            </div>
            <div>
              <dt>Current Workspace</dt>
              <dd>{missionControlRuntime.currentWorkspace ?? 'enterprise-value'}</dd>
            </div>
            <div>
              <dt>Recommended Actions</dt>
              <dd>{missionControlRuntime.recommendedActions?.length ?? 0}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="workspace-home-heading">
        <div>
          <p className="section-label">Choose Your Workspace</p>
          <h2>Open the area you want to operate.</h2>
        </div>
        <strong>{workspaces.length} workspaces</strong>
      </div>

      <div className="workspace-tile-grid">
        {workspaces.map((workspace) => (
          <WorkspaceTile
            attentionCount={attentionByWorkspace[workspace.id] ?? 0}
            key={workspace.id}
            metric={metricsByWorkspace[workspace.id] ?? 'Monitoring'}
            onOpen={onOpenWorkspace}
            status="Operational"
            workspace={workspace}
          />
        ))}
      </div>
    </section>
  )
}

export default WorkspaceHome
