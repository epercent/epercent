import { enterpriseIntelligencePipelineStages } from '../data/enterprise-intelligence-pipeline.js'

export function getEnterpriseIntelligencePipeline() {
  return {
    id: 'EOS-ENTERPRISE-INTELLIGENCE-PIPELINE',
    version: '0.1.0',
    status: 'Sprint 9 Foundation',
    stageCount: enterpriseIntelligencePipelineStages.length,
    stages: enterpriseIntelligencePipelineStages
  }
}
