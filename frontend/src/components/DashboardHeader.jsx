import { executiveValue } from '../design-system/eosDesignSystem.js'

function DashboardHeader({ children, status, isLoading }) {
  const statusLabel = isLoading ? 'Connecting' : status
  const isOperational = status === 'Operational'

  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Mission Control</p>
        <h1>EOS Mission Control</h1>
      </div>

      <div
        className={`status-pill ${isOperational ? 'is-operational' : ''}`}
        aria-label={`Platform status ${executiveValue(statusLabel, 'Awaiting Live Signal')}`}
      >
        <span className="status-dot" />
        {executiveValue(statusLabel, 'Awaiting Live Signal')}
      </div>
      {children && <div className="header-actions">{children}</div>}
    </header>
  )
}

export default DashboardHeader
