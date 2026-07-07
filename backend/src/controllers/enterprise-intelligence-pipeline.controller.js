import { getEnterpriseIntelligencePipeline } from '../services/enterprise-intelligence-pipeline-service.js'

export function getEnterpriseIntelligencePipelineController(req, res) {
  res.json(getEnterpriseIntelligencePipeline())
}
