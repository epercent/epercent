import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'
import AttentionIndicator from './AttentionIndicator.jsx'
import CommandPalette from './CommandPalette.jsx'
import MetricPill from './MetricPill.jsx'
import PresentationModeToggle from './PresentationModeToggle.jsx'

function formatCurrency(value) {
  if (!Number.isFinite(Number(value))) {
    return 'Awaiting data'
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: Number(value) >= 1000000 ? 'compact' : 'standard',
    style: 'currency'
  }).format(Number(value))
}

function ExecutiveCommandBar({
  activeWorkspace,
  attentionCount,
  isLoading,
  isPresentationMode,
  metrics,
  onNavigate,
  onTogglePresentationMode
}) {
  return (
    <header className="executive-command-bar">
      <div className="command-bar-identity">
        <span>EOS / Mission Control</span>
        <strong>{activeWorkspace?.label ?? 'Digital Enterprise Headquarters'}</strong>
        <small>{isLoading ? 'Connecting to EOS Core API' : 'Digital Enterprise Headquarters'}</small>
      </div>

      <div className="command-bar-metrics" aria-label="Executive headline metrics">
        <MetricPill
          description="Internal digital enterprise value estimate. This is not an audited valuation."
          detail="Internal estimate"
          label="Enterprise Value"
          value={formatCurrency(metrics.enterpriseValue)}
        />
        <MetricPill
          description={eosTooltips.operationalStatus}
          label="Platform Health"
          value={executiveValue(metrics.platformHealth, 'Monitoring')}
        />
        <MetricPill
          description={eosTooltips.digitalTwinAsset}
          label="Digital Twin Assets"
          value={metrics.digitalTwinAssets}
        />
        <MetricPill
          description={eosTooltips.activeExecutives}
          label="AI Workforce"
          value={metrics.aiWorkforce}
        />
        <MetricPill
          description={eosTooltips.knowledgeObject}
          label="Knowledge Assets"
          value={metrics.knowledgeAssets}
        />
      </div>

      <div className="command-bar-actions">
        <AttentionIndicator
          count={attentionCount}
          description={eosTooltips.attentionLevel}
          level={attentionCount > 0 ? 'Review Required' : 'No Action Required'}
        />
        <PresentationModeToggle
          isEnabled={isPresentationMode}
          onToggle={onTogglePresentationMode}
        />
      </div>

      <CommandPalette onNavigate={onNavigate} />
    </header>
  )
}

export default ExecutiveCommandBar
