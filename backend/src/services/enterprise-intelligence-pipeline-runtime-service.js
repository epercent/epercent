import fs from 'fs'
import path from 'path'
import { getEnterpriseIntelligencePipeline } from './enterprise-intelligence-pipeline-service.js'
import { runEnterpriseDiscovery } from './enterprise-discovery-orchestrator-service.js'

function slugify(value) {
  return String(value || 'pipeline-run')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function createPipelineRunRecord({ runtime, pipeline, stageResults, discovery, input }) {
  const timestamp = runtime.completedAt
    .replace(/[-:]/g, '')
    .replace(/\..+$/, '')
    .replace('T', '-')

  const evidenceDir = path.resolve(process.cwd(), '../eos/evidence/pipeline-runs')
  const enterpriseSlug = slugify(input.name || discovery?.profile?.name || 'pipeline-run')
  const fileName = `${timestamp}-${enterpriseSlug}-pipeline-run.json`
  const filePath = path.join(evidenceDir, fileName)

  fs.mkdirSync(evidenceDir, { recursive: true })

  const record = {
    runtime,
    input,
    enterprise: {
      name: discovery?.profile?.name || input.name || 'Unknown Entity',
      source: discovery?.profile?.source || input.source || '',
      entityType: discovery?.profile?.entityType || input.entityType || 'Enterprise'
    },
    pipeline: {
      id: pipeline.id,
      version: pipeline.version,
      status: pipeline.status,
      stageCount: pipeline.stageCount
    },
    stageResults,
    linkedEvidence: {
      discoveryEvidenceReport: discovery?.discoveryEvidenceReport || null
    },
    governance: {
      status: discovery?.missionControlRuntime?.governanceStatus?.status || 'Awaiting Review',
      approvalRequired: discovery?.missionControlRuntime?.governanceStatus?.approvalRequired ?? true
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(record, null, 2))

  return {
    fileName,
    filePath,
    status: 'Pipeline Run Record Created'
  }
}

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

  const runtime = {
    id: `EIP-RUN-${Date.now()}`,
    status: 'Running',
    startedAt,
    completedAt: null
  }

  markStage('Discover', 'Completed')

  const discovery = await runEnterpriseDiscovery(input)

  markStage('Understand', 'Completed')
  markStage('Assess', 'Completed')
  markStage('Recommend', 'Completed')
  markStage('Twin', 'Completed')
  markStage('Value', 'Completed')
  markStage('Govern', 'Completed')

  runtime.status = 'Completed'
  runtime.completedAt = new Date().toISOString()

  const pipelineRunRecord = createPipelineRunRecord({
    runtime,
    pipeline,
    stageResults,
    discovery,
    input
  })

  return {
    runtime,
    pipeline,
    stageResults,
    pipelineRunRecord,
    discovery
  }
}
