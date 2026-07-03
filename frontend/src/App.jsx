import { useCallback, useEffect, useState } from 'react'
import './App.css'

import DashboardHeader from './components/DashboardHeader.jsx'
import ObjectList from './components/ObjectList.jsx'
import StatusCard from './components/StatusCard.jsx'
import { fetchCoreStatus, fetchEnterpriseObjects } from './services/api.js'

function App() {
  const [status, setStatus] = useState(null)
  const [objectRegistry, setObjectRegistry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)

  const reloadDashboard = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setStatus(null)
    setObjectRegistry(null)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  useEffect(() => {
    let isCurrentRequest = true

    Promise.all([
      fetchCoreStatus(),
      fetchEnterpriseObjects(),
    ])
      .then(([statusResult, objectsResult]) => {
        if (!isCurrentRequest) {
          return
        }

        setStatus(statusResult)
        setObjectRegistry(objectsResult)
        setError(null)
      })
      .catch((requestError) => {
        if (!isCurrentRequest) {
          return
        }

        setError(requestError.message)
        setStatus(null)
        setObjectRegistry(null)
      })
      .finally(() => {
        if (!isCurrentRequest) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [requestVersion])

  const objects = objectRegistry?.objects ?? []
  const objectCount = objectRegistry?.count ?? objects.length

  return (
    <div className="dashboard-shell">
      <DashboardHeader status={status?.status} isLoading={isLoading} />

      <main className="dashboard-main">
        {isLoading && (
          <section className="state-panel" aria-live="polite">
            <p className="section-label">Loading</p>
            <h2>Connecting to EOS Core API</h2>
          </section>
        )}

        {!isLoading && error && (
          <section className="state-panel error-panel" role="alert">
            <p className="section-label">Connection Error</p>
            <h2>Mission Control could not reach EOS Core API.</h2>
            <p>{error}</p>
            <button type="button" onClick={reloadDashboard}>
              Retry
            </button>
          </section>
        )}

        {!isLoading && !error && (
          <>
            <section className="status-grid" aria-label="Platform metrics">
              <StatusCard
                label="Platform Status"
                value={status?.status}
                detail={status?.platform}
              />
              <StatusCard
                label="Version"
                value={status?.version}
                detail={status?.uptime}
              />
              <StatusCard
                label="Active Agents"
                value={status?.activeAgents}
                detail={status?.platform}
              />
              <StatusCard
                label="Enterprise Object Count"
                value={objectCount}
                detail={objectRegistry?.capability}
              />
            </section>

            <ObjectList objects={objects} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
