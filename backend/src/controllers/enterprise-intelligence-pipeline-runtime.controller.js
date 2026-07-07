import { runEnterpriseIntelligencePipeline } from '../services/enterprise-intelligence-pipeline-runtime-service.js'

export async function runEnterpriseIntelligencePipelineController(req, res) {
  const result = await runEnterpriseIntelligencePipeline(req.body ?? {})
  res.json(result)
}
