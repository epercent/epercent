import KnowledgeAssetViewer from './KnowledgeAssetViewer.jsx'
import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

function readinessLabel(count, label) {
  return `${count} ${label}${count === 1 ? '' : 's'}`
}

function KnowledgeRepositoryPanel({ repositories }) {
  const totalKnowledgeObjects = repositories.reduce(
    (total, repository) => total + repository.knowledgeObjectCount,
    0,
  )
  const totalResearchProjects = repositories.reduce(
    (total, repository) => total + repository.researchProjectCount,
    0,
  )
  const publicationReady = repositories.reduce(
    (total, repository) => total + repository.publicationReadyCount,
    0,
  )
  const investorReady = repositories.reduce(
    (total, repository) => total + repository.investorReadyCount,
    0,
  )
  const patentOpportunities = repositories.reduce(
    (total, repository) => total + repository.patentOpportunityCount,
    0,
  )

  return (
    <section className="knowledge-section">
      <div className="section-heading">
        <div>
          <p className="section-label">
            <ExecutiveTooltip description={eosTooltips.knowledgeObject}>Agent Knowledge Repository</ExecutiveTooltip>
          </p>
          <h2>Research & Publications</h2>
        </div>
        <strong>{totalKnowledgeObjects}</strong>
      </div>

      <div className="knowledge-summary-grid" aria-label="Knowledge repository summary">
        <article>
          <span>Research Projects</span>
          <strong>{totalResearchProjects}</strong>
        </article>
        <article>
          <span>
            <ExecutiveTooltip description={eosTooltips.investorReadiness}>Publication Readiness</ExecutiveTooltip>
          </span>
          <strong>{readinessLabel(publicationReady, 'ready')}</strong>
        </article>
        <article>
          <span>
            <ExecutiveTooltip description={eosTooltips.investorReadiness}>Investor Readiness</ExecutiveTooltip>
          </span>
          <strong>{readinessLabel(investorReady, 'ready')}</strong>
        </article>
        <article>
          <span>Patent Opportunities</span>
          <strong>{patentOpportunities}</strong>
        </article>
      </div>

      <KnowledgeAssetViewer repositories={repositories} />

      <div className="repository-list">
        {repositories.map((repository) => (
          <article className="repository-item" key={repository.id}>
            <div className="repository-header">
              <div>
                <span>{repository.agentName}</span>
                <h3>{repository.role}</h3>
              </div>
              <strong>{executiveValue(repository.attentionLevel, 'No Action Required')}</strong>
            </div>

            <dl className="repository-meta">
              <div>
                <dt>Knowledge Objects</dt>
                <dd>{repository.knowledgeObjectCount}</dd>
              </div>
              <div>
                <dt>Research Projects</dt>
                <dd>{repository.researchProjectCount}</dd>
              </div>
              <div>
                <dt>Publication Ready</dt>
                <dd>{repository.publicationReadyCount}</dd>
              </div>
              <div>
                <dt>Investor Ready</dt>
                <dd>{repository.investorReadyCount}</dd>
              </div>
              <div>
                <dt>Patent Potential</dt>
                <dd>{repository.patentOpportunityCount}</dd>
              </div>
              <div>
                <dt>Recent Activity</dt>
                <dd>{executiveValue(repository.recentActivity, 'Monitoring')}</dd>
              </div>
            </dl>

            {repository.knowledgeObjects.length > 0 && (
              <div className="knowledge-object-list">
                {repository.knowledgeObjects.map((knowledgeObject) => (
                  <div className="knowledge-object-row" key={knowledgeObject.id}>
                    <span>{knowledgeObject.id}</span>
                    <strong>{knowledgeObject.title}</strong>
                    <small>{knowledgeObject.type}</small>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default KnowledgeRepositoryPanel
