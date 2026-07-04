import LiveStatusPanel from './LiveStatusPanel.jsx'
import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

function ObjectList({ objects }) {
  return (
    <section className="object-section">
      <div className="section-heading">
        <div>
          <p className="section-label">
            <ExecutiveTooltip description={eosTooltips.enterpriseObject}>Enterprise Objects</ExecutiveTooltip>
          </p>
          <h2>Registry</h2>
        </div>
        <strong>{objects.length}</strong>
      </div>

      <div className="object-list">
        {objects.map((enterpriseObject) => (
          <article className="object-item" key={enterpriseObject.id}>
            <div className="object-primary">
              <span>{enterpriseObject.id}</span>
              <h3>{enterpriseObject.name}</h3>
              <p>{executiveValue(enterpriseObject.description, 'Description pending assessment.')}</p>
            </div>

            <dl className="object-meta">
              <div>
                <dt>Type</dt>
                <dd>{executiveValue(enterpriseObject.type)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{executiveValue(enterpriseObject.status, 'Monitoring')}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{executiveValue(enterpriseObject.owner)}</dd>
              </div>
              <div>
                <dt>Layer</dt>
                <dd>{executiveValue(enterpriseObject.layer)}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{enterpriseObject.version}</dd>
              </div>
              <div>
                <dt>Linked</dt>
                <dd>{enterpriseObject.linkedObjects.length}</dd>
              </div>
            </dl>

            <LiveStatusPanel liveStatus={enterpriseObject.liveStatus} />
          </article>
        ))}
      </div>
    </section>
  )
}

export default ObjectList
