import fs from 'fs'
import path from 'path'

const pipelineRunDirectory = path.resolve(process.cwd(), '../eos/evidence/pipeline-runs')

export function listEnterpriseIntelligencePipelineRuns() {
  if (!fs.existsSync(pipelineRunDirectory)) {
    return {
      count: 0,
      runs: []
    }
  }

  const runs = fs.readdirSync(pipelineRunDirectory)
    .filter(file => file.endsWith('.json'))
    .sort()
    .reverse()
    .map(file => {
      const fullPath = path.join(pipelineRunDirectory, file)
      const run = JSON.parse(fs.readFileSync(fullPath, 'utf8'))

      return {
        file,
        runtimeId: run.runtime.id,
        status: run.runtime.status,
        startedAt: run.runtime.startedAt,
        completedAt: run.runtime.completedAt,
        enterprise: run.enterprise.name,
        source: run.enterprise.source,
        stageCount: run.pipeline.stageCount,
        completedStages: run.stageResults.filter(stage => stage.status === 'Completed').length,
        governanceStatus: run.governance.status,
        discoveryEvidence: run.linkedEvidence.discoveryEvidenceReport?.fileName ?? null
      }
    })

  return {
    count: runs.length,
    runs
  }
}
