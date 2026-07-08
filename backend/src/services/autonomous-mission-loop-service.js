import { generateMissionPackage } from './mission-package-generator-service.js'
import { dispatchMission } from './ai-provider-dispatcher-service.js'
import { validateExecutionResult } from './result-validation-engine-service.js'
import { requestGovernanceApproval } from './governance-approval-engine-service.js'

export function runAutonomousMissionLoop() {
  const mission = generateMissionPackage()
  const dispatch = dispatchMission(mission)
  const validation = validateExecutionResult(dispatch)
  const approval = requestGovernanceApproval(validation)

  return {
    timestamp: new Date().toISOString(),
    stage: 'Autonomous Mission Loop',
    status: approval.approved ? 'Governed Loop Complete' : 'Governance Required',
    mission,
    dispatch,
    validation,
    approval,
    completed: validation.passed && approval.approved,
    nextStep: approval.approved
      ? 'Update Development Intelligence and generate next mission'
      : 'Return to AI Engineering Office for correction'
  }
}
