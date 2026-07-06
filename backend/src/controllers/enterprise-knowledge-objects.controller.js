import {
  getEnterpriseKnowledgeObject,
  listEnterpriseKnowledgeObjects
} from '../services/enterprise-knowledge-object-service.js'

export function listEnterpriseKnowledgeObjectsController(req, res) {
  res.json(listEnterpriseKnowledgeObjects())
}

export function getEnterpriseKnowledgeObjectController(req, res) {
  const object = getEnterpriseKnowledgeObject(req.params.id)

  if (!object) {
    return res.status(404).json({
      error: 'Enterprise Knowledge Object not found',
      id: req.params.id
    })
  }

  return res.json(object)
}
