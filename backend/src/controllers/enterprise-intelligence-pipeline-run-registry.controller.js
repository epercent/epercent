import { listEnterpriseIntelligencePipelineRuns } from '../services/enterprise-intelligence-pipeline-run-registry-service.js'

export function getEnterpriseIntelligencePipelineRunRegistryController(req, res) {
  res.json({
    module: 'Enterprise Intelligence Pipeline Run Registry',
    status: 'Operational',
    ...listEnterpriseIntelligencePipelineRuns()
  })
}
