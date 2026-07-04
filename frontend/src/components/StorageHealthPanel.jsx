import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { executiveValue } from '../design-system/eosDesignSystem.js'

function totalRecords(recordCounts) {
  return Object.values(recordCounts ?? {}).reduce((total, count) => total + count, 0)
}

function StorageHealthPanel({ storageStatus }) {
  if (!storageStatus) {
    return null
  }

  const warnings = storageStatus.warnings ?? []

  return (
    <section className="storage-health-panel" aria-label="Storage and data health">
      <div>
        <p className="section-label">
          <ExecutiveTooltip description="Storage health reports whether EOS durable JSON collections are initialized, current, and ready for future database migration.">
            Storage / Data Health
          </ExecutiveTooltip>
        </p>
        <h2>{executiveValue(storageStatus.storageStatus, 'Pending Assessment')}</h2>
      </div>

      <dl className="storage-health-grid">
        <div>
          <dt>Collections</dt>
          <dd>{storageStatus.collectionsFound?.length ?? 0}</dd>
        </div>
        <div>
          <dt>Records</dt>
          <dd>{totalRecords(storageStatus.recordCounts)}</dd>
        </div>
        <div>
          <dt>Last Updated</dt>
          <dd>{executiveValue(storageStatus.lastUpdated, 'Pending Assessment')}</dd>
        </div>
        <div>
          <dt>Snapshots</dt>
          <dd>{storageStatus.snapshotCount ?? 0}</dd>
        </div>
      </dl>

      <div className={`storage-warning-list ${warnings.length > 0 ? 'has-warnings' : ''}`}>
        <strong>{warnings.length > 0 ? 'Warnings' : 'No Action Required'}</strong>
        <p>{warnings.length > 0 ? warnings.join(' ') : 'All expected persistent collections are available.'}</p>
      </div>
    </section>
  )
}

export default StorageHealthPanel
