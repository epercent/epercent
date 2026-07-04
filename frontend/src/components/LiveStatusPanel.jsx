import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import {
  eosTooltips,
  executiveActionLabel,
  executiveValue
} from '../design-system/eosDesignSystem.js'

const statusClassNames = {
  Green: 'status-green',
  Amber: 'status-amber',
  Red: 'status-red',
  Blue: 'status-blue',
  Grey: 'status-grey',
}

function clampProgress(progress) {
  if (!Number.isFinite(progress)) {
    return 0
  }

  return Math.min(100, Math.max(0, progress))
}

function LiveStatusPanel({ liveStatus }) {
  const status = liveStatus?.operationalStatus ?? liveStatus?.status ?? 'Grey'
  const statusClassName = statusClassNames[status] ?? statusClassNames.Grey
  const progress = clampProgress(liveStatus?.progress ?? 0)
  const availableActions = liveStatus?.availableActions ?? []

  return (
    <section className={`live-status-panel ${statusClassName}`} aria-label={`${status} live status`}>
      <div className="live-status-header">
        <div className="live-status-title">
          <span className="live-status-dot" />
          <strong>{executiveValue(status, 'Monitoring')}</strong>
        </div>
        <span className="attention-level">
          <ExecutiveTooltip description={eosTooltips.attentionLevel}>
            {executiveValue(liveStatus?.attentionLevel, 'No Action Required')}
          </ExecutiveTooltip>
        </span>
      </div>

      <dl className="live-status-metrics">
        <div>
          <dt>
            <ExecutiveTooltip description={eosTooltips.healthScore}>Health</ExecutiveTooltip>
          </dt>
          <dd>{executiveValue(liveStatus?.healthScore, 0)}</dd>
        </div>
        <div>
          <dt>
            <ExecutiveTooltip description={eosTooltips.lifecycleStatus}>Lifecycle</ExecutiveTooltip>
          </dt>
          <dd>{executiveValue(liveStatus?.lifecycleStatus, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>
            <ExecutiveTooltip description={eosTooltips.progress}>Progress</ExecutiveTooltip>
          </dt>
          <dd>{progress}%</dd>
        </div>
      </dl>

      <div className="progress-track" aria-label={`Progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <p className="live-summary">{executiveValue(liveStatus?.summary, 'Live status is pending assessment.')}</p>
      <p className="recommended-action">{executiveValue(liveStatus?.recommendedAction, 'No Action Required')}</p>

      <div className="available-actions" aria-label="Available actions">
        {availableActions.map((action) => (
          <span key={action}>{executiveActionLabel(action)}</span>
        ))}
      </div>
    </section>
  )
}

export default LiveStatusPanel
