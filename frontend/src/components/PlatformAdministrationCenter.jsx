import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

function AdminMetric({ description, label, value, detail }) {
  return (
    <article>
      <span>
        <ExecutiveTooltip description={description}>{label}</ExecutiveTooltip>
      </span>
      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
      {detail && <small>{executiveValue(detail, 'Pending Assessment')}</small>}
    </article>
  )
}

function PlatformAdministrationCenter({ adminActionsData, adminData, platformStatus, storageStatus }) {
  if (!adminData) {
    return (
      <section className="operations-section">
        <p className="section-label">Platform</p>
        <h2>Administration Center Awaiting Live Signal</h2>
      </section>
    )
  }

  const actions = adminActionsData?.actions ?? adminData.adminActions ?? []
  const safeActions = actions.filter((action) => action.executionMode === 'Executable')
  const governedActions = actions.filter((action) => action.executionMode !== 'Executable')
  const warnings = adminData.systemWarnings ?? []

  return (
    <section className="operations-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Platform</p>
          <h2>Administration Center</h2>
        </div>
        <strong>{executiveValue(adminData.platformStatus, 'Operational')}</strong>
      </div>

      <article className="admin-safety-note">
        <strong>Governed Administration</strong>
        <p>{adminData.safetyNotice}</p>
      </article>

      <div className="operations-metric-grid">
        <AdminMetric label="Platform Status" value={adminData.platformStatus} detail={adminData.environment} />
        <AdminMetric label="Current Version" value={adminData.currentVersion} detail={adminData.releaseVersion} />
        <AdminMetric label="Backend Status" value={adminData.backendStatus} detail="EOS Core API" />
        <AdminMetric label="Frontend Status" value={adminData.frontendStatus} detail="Mission Control" />
        <AdminMetric label="API Health" value={adminData.apiHealth} detail={`${adminData.activeApis?.length ?? 0} active APIs`} />
        <AdminMetric label="Storage Health" value={adminData.storageHealth} detail={`${storageStatus?.collectionsFound?.length ?? 0} collections`} />
        <AdminMetric label="Backup Health" value={adminData.backupHealth} detail={adminData.latestBackup?.archive} />
        <AdminMetric
          description="Restore validation confirms whether the latest backup has been tested before relying on it for recovery."
          label="Restore Validation"
          value={adminData.restoreValidationStatus}
          detail={adminData.latestBackup?.localTime}
        />
        <AdminMetric label="Git Status" value={adminData.gitStatus} />
        <AdminMetric label="Data Store Status" value={adminData.dataStoreStatus} detail={storageStatus?.storageStatus} />
        <AdminMetric label="Registered Services" value={adminData.registeredServices?.length ?? 0} detail={adminData.registeredServices?.join(', ')} />
        <AdminMetric label="Running URLs" value={adminData.runningUrls?.length ?? 0} detail={adminData.runningUrls?.join(' / ')} />
      </div>

      <div className="operations-grid">
        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Safe Admin Actions</h3>
            <strong>{safeActions.length}</strong>
          </div>
          <div className="admin-action-list">
            {safeActions.map((action) => (
              <article key={action.id}>
                <div>
                  <span>{action.category}</span>
                  <h4>{action.label}</h4>
                  <p>{action.recommendedNextStep}</p>
                </div>
                <dl>
                  <div>
                    <dt>Risk</dt>
                    <dd>{action.riskLevel}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{action.status}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Governed Actions</h3>
            <strong>{governedActions.length}</strong>
          </div>
          <div className="admin-action-list">
            {governedActions.map((action) => (
              <article key={action.id}>
                <div>
                  <span>{action.executionMode}</span>
                  <h4>{action.label}</h4>
                  <p>{action.recommendedNextStep}</p>
                </div>
                <dl>
                  <div>
                    <dt>Risk</dt>
                    <dd>{action.riskLevel}</dd>
                  </div>
                  <div>
                    <dt>Approval</dt>
                    <dd>{action.requiresApproval ? 'Required' : 'Not Required'}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="operations-grid">
        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>System Warnings</h3>
            <strong>{warnings.length}</strong>
          </div>
          <div className="operations-note-list">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        </section>

        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>
              <ExecutiveTooltip description={eosTooltips.recommendedAction}>
                Recommended Admin Actions
              </ExecutiveTooltip>
            </h3>
            <strong>{adminData.recommendedAdminActions?.length ?? 0}</strong>
          </div>
          <div className="operations-note-list">
            {(adminData.recommendedAdminActions ?? []).map((action) => (
              <p key={action}>{action}</p>
            ))}
          </div>
        </section>
      </div>

      <section className="operations-panel">
        <div className="operations-panel-heading">
          <h3>Authorization Policies</h3>
          <strong>{adminData.authorizationPolicies?.length ?? 0}</strong>
        </div>
        <div className="policy-list">
          {(adminData.authorizationPolicies ?? []).map((policy) => (
            <article key={policy.id}>
              <h4>{policy.actionType}</h4>
              <p>{policy.summary}</p>
              <small>{policy.policyStatus} / {policy.requiredRole}</small>
            </article>
          ))}
        </div>
      </section>

      {platformStatus?.recommendedAction && (
        <article className="ceo-recommendation">
          <span>Platform Recommendation</span>
          <p>{platformStatus.recommendedAction}</p>
        </article>
      )}
    </section>
  )
}

export default PlatformAdministrationCenter
