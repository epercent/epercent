function DashboardHeader({ status, isLoading }) {
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
        aria-label={`Platform status ${statusLabel ?? 'Unavailable'}`}
      >
        <span className="status-dot" />
        {statusLabel ?? 'Unavailable'}
      </div>
    </header>
  )
}

export default DashboardHeader
