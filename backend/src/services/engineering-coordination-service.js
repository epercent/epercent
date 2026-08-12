import { getAiDevelopmentOffice } from './ai-development-office-service.js'
import { listAgents } from './agent-service.js'
import { getApprovalQueue } from './executive-action-service.js'
import { listWorkflows } from './workflow-service.js'
import { getPmo } from './pmo-service.js'
import { getAuditReport } from './audit-service.js'

export function getEngineeringCoordinationOverview() {
  const office = getAiDevelopmentOffice()
  const agents = listAgents()
  const workflows = listWorkflows()
  const approvals = getApprovalQueue()
  const pmo = getPmo()
  const audit = getAuditReport()

  return {
    engine: {
      id: 'EOS-ENGINE-ENGINEERING-COORDINATION',
      name: 'Engineering Coordination Engine',
      version: '0.1.0',
      status: 'Operational',
      purpose:
        'Coordinate AI software engineering activities across EOS services.'
    },

    summary: {
      registeredAgents: agents.length,
      activeBuildTasks: office.metrics.activeBuildTasks,
      pendingApprovals:
        approvals.pendingApprovals ??
        approvals.length ??
        0,
      workflows: workflows.length,
      roadmapPhase:
        pmo.masterRoadmap?.currentPhase ??
        'Foundation',
      auditStatus:
        audit.status ??
        'Ready'
    },

    coordinationTargets: {
      office,
      agents,
      workflows,
      approvals,
      pmo
    }
  }
}
