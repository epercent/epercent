import { useMemo, useState } from 'react'

import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import KnowledgeObjectDetail from './KnowledgeObjectDetail.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

const supportedTypes = [
  'White Paper',
  'Academic Paper',
  'Research Note',
  'Patent Draft',
  'LinkedIn Article',
  'Investor Brief',
  'Business Case',
  'Architecture Document',
  'Genesis Entry',
  'Technical Specification',
  'Decision Record',
]

function KnowledgeAssetViewer({ repositories }) {
  const knowledgeObjects = useMemo(
    () => repositories.flatMap((repository) => repository.knowledgeObjects ?? []),
    [repositories],
  )
  const [selectedType, setSelectedType] = useState('All')
  const [selectedObjectId, setSelectedObjectId] = useState(knowledgeObjects[0]?.id)

  const availableTypes = useMemo(() => {
    const seededTypes = new Set(knowledgeObjects.map((knowledgeObject) => knowledgeObject.type))
    return ['All', ...supportedTypes.filter((type) => seededTypes.has(type))]
  }, [knowledgeObjects])

  const filteredObjects = useMemo(() => {
    if (selectedType === 'All') {
      return knowledgeObjects
    }

    return knowledgeObjects.filter((knowledgeObject) => knowledgeObject.type === selectedType)
  }, [knowledgeObjects, selectedType])

  const selectedObject =
    filteredObjects.find((knowledgeObject) => knowledgeObject.id === selectedObjectId) ?? filteredObjects[0]

  if (knowledgeObjects.length === 0) {
    return (
      <section className="asset-viewer empty-asset-viewer">
        <p className="section-label">Knowledge Asset Viewer</p>
        <h3>Repository Awaiting Knowledge Assets</h3>
      </section>
    )
  }

  return (
    <section className="asset-viewer">
      <div className="asset-viewer-header">
        <div>
          <p className="section-label">
            <ExecutiveTooltip description={eosTooltips.knowledgeObject}>Knowledge Asset Viewer</ExecutiveTooltip>
          </p>
          <h3>Live Knowledge Objects</h3>
        </div>
        <strong>{filteredObjects.length}</strong>
      </div>

      <div className="asset-type-filter" aria-label="Knowledge asset type filter">
        {availableTypes.map((type) => (
          <button
            aria-pressed={selectedType === type}
            className={selectedType === type ? 'is-active' : ''}
            key={type}
            onClick={() => setSelectedType(type)}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      <div className="asset-viewer-layout">
        <div className="asset-list" aria-label="Knowledge assets">
          {filteredObjects.map((knowledgeObject) => (
            <button
              className={selectedObject?.id === knowledgeObject.id ? 'is-active' : ''}
              key={knowledgeObject.id}
              onClick={() => setSelectedObjectId(knowledgeObject.id)}
              type="button"
            >
              <span>{knowledgeObject.id}</span>
              <strong>{knowledgeObject.title}</strong>
              <small>{knowledgeObject.type}</small>
              <em>{executiveValue(knowledgeObject.liveStatus.lifecycleStatus, 'Pending Assessment')}</em>
            </button>
          ))}
        </div>

        {selectedObject && <KnowledgeObjectDetail knowledgeObject={selectedObject} />}
      </div>
    </section>
  )
}

export default KnowledgeAssetViewer
