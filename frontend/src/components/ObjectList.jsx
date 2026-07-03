function ObjectList({ objects }) {
  return (
    <section className="object-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Enterprise Objects</p>
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
              <p>{enterpriseObject.description}</p>
            </div>

            <dl className="object-meta">
              <div>
                <dt>Type</dt>
                <dd>{enterpriseObject.type}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{enterpriseObject.status}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{enterpriseObject.owner}</dd>
              </div>
              <div>
                <dt>Layer</dt>
                <dd>{enterpriseObject.layer}</dd>
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
          </article>
        ))}
      </div>
    </section>
  )
}

export default ObjectList
