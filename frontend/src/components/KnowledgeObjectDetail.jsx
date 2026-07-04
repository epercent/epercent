import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import {
  eosTooltips,
  executiveActionLabel,
  executiveValue
} from '../design-system/eosDesignSystem.js'

function DetailList({ label, items }) {
  const values = Array.isArray(items) && items.length > 0 ? items : ['Pending Assessment']

  return (
    <div className="asset-detail-list">
      <dt>
        <ExecutiveTooltip description={eosTooltips.knowledgeObject}>{label}</ExecutiveTooltip>
      </dt>
      <dd>
        {values.map((item) => (
          <span key={item}>{executiveValue(item)}</span>
        ))}
      </dd>
    </div>
  )
}

function DetailValue({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{executiveValue(value)}</dd>
    </div>
  )
}

function PreviewContent({ previewContent }) {
  if (!previewContent) {
    return null
  }

  return (
    <section className="asset-preview">
      <p className="section-label">Preview Content</p>
      <div className="preview-grid">
        <article>
          <span>Executive Summary</span>
          <p>{previewContent.executiveSummary}</p>
        </article>
        <article>
          <span>Core Argument</span>
          <p>{previewContent.coreArgument}</p>
        </article>
        <article>
          <span>Research Questions</span>
          <ul>
            {previewContent.researchQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Commercial Relevance</span>
          <p>{previewContent.commercialRelevance}</p>
        </article>
        <article>
          <span>Related EOS Capability</span>
          <p>{previewContent.relatedEOSCapability}</p>
        </article>
        <article>
          <span>Next Drafting Step</span>
          <p>{previewContent.nextDraftingStep}</p>
        </article>
      </div>
    </section>
  )
}

function KnowledgeObjectDetail({ knowledgeObject }) {
  const liveStatus = knowledgeObject.liveStatus

  return (
    <article className={`asset-detail status-${liveStatus.operationalStatus.toLowerCase()}`}>
      <div className="asset-detail-heading">
        <div>
          <span>{knowledgeObject.id}</span>
          <h3>{knowledgeObject.title}</h3>
        </div>
        <strong>{knowledgeObject.type}</strong>
      </div>

      <dl className="asset-detail-meta">
        <DetailValue label="Owner Agent" value={knowledgeObject.ownerAgent} />
        <DetailValue label="Lifecycle Status" value={liveStatus.lifecycleStatus} />
        <DetailValue label="Operational Status" value={liveStatus.operationalStatus} />
        <DetailValue label="Progress" value={`${knowledgeObject.progress}%`} />
        <DetailValue label="Publication Target" value={knowledgeObject.publicationTarget} />
        <DetailValue label="Patent Potential" value={knowledgeObject.patentPotential} />
        <DetailValue label="Investor Ready" value={knowledgeObject.investorReady} />
        <DetailValue label="Publication Ready" value={knowledgeObject.publicationReady} />
      </dl>

      <p className="asset-summary">{knowledgeObject.summary}</p>

      <dl className="asset-link-grid">
        <DetailList label="Related Capabilities" items={knowledgeObject.relatedCapabilities} />
        <DetailList label="Related Enterprise Objects" items={knowledgeObject.relatedEnterpriseObjects} />
        <DetailList label="Related Workflows" items={knowledgeObject.relatedWorkflows} />
        <DetailList label="Related Events" items={knowledgeObject.relatedEvents} />
        <DetailList label="Tags" items={knowledgeObject.tags} />
        <DetailList label="Linked Documents" items={knowledgeObject.linkedDocuments} />
      </dl>

      <PreviewContent previewContent={knowledgeObject.previewContent} />

      <section className="asset-action-panel">
        <div>
          <span>Recommended Action</span>
          <p>{executiveValue(liveStatus.recommendedAction, 'No Action Required')}</p>
        </div>
        <div className="asset-actions">
          {liveStatus.availableActions.map((action) => (
            <button disabled key={action} type="button">
              {executiveActionLabel(action, knowledgeObject.type)}
            </button>
          ))}
        </div>
      </section>
    </article>
  )
}

export default KnowledgeObjectDetail
