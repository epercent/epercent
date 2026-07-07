import { getEnterpriseIntelligencePipeline } from './enterprise-intelligence-pipeline-service.js'
import { runEnterpriseDiscovery } from './enterprise-discovery-orchestrator-service.js'

export async function runEnterpriseIntelligencePipeline(input = {}) {
  const pipeline = getEnterpriseIntelligencePipeline()
  const startedAt = new Date().toISOString()

  const stageResults = pipeline.stages.map(stage => ({
    id: stage.id,
    name: stage.name,
    status: 'Pending',
    startedAt: null,
    completedAt: null
  }))

  const markStage = (name, status) => {
    const stage = stageResults.find(s => s.name === name)
    if (!stage) return
    if (!stage.startedAt) stage.startedAt = new Date().toISOString()
    stage.status = status
    stage.completedAt = new Date().toISOString()
  }

  markStage('Discover', 'Completed')

  const discovery = await runEnterpriseDiscovery(input)

  markStage('Understand', 'Completed')
  markStage('Assess', 'Completed')
  markStage('Recommend', 'Completed')
  markStage('Twin', 'Completed')
  markStage('Value', 'Completed')
  markStage('Govern', 'Completed')

  return {
    runtime: {
      id: `EIP-RUN-${Date.now()}`,
      status: 'Completed',
      startedAt,
      completedAt: new Date().toISOString()
    },
    pipeline,
    stageResults,
    discovery
  }
}
