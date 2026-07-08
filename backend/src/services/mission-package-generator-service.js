import { evaluateEngineeringState } from './engineering-decision-engine-service.js'

export function generateMissionPackage() {
  const decision = evaluateEngineeringState()

  return {
    id: `EOS-MISSION-PACKAGE-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    status: 'Generated',

    mission: {
      objective: decision.nextAction,
      rationale: decision.rationale,
      priority: decision.currentMission.priority,
      assignedOffice: decision.currentMission.assignedOffice,
      assignedAgent: decision.currentMission.assignedAgent
    },

    execution: {
      provider: 'Codex',
      mode: 'Human Approved',
      autonomousReady: decision.currentMission.autonomousReady
    },

    requiredCapabilities: [
      'Development Intelligence',
      'Engineering Intelligence Hub',
      'Engineering Decision Engine',
      'Mission Orchestration'
    ],

    affectedAreas: [
      'backend/src/services',
      'backend/src/controllers',
      'backend/src/routes',
      'frontend/src/enterprise-control'
    ],

    acceptanceCriteria: [
      'Mission package is generated',
      'Assigned office is identified',
      'Assigned agent is identified',
      'Priority is set',
      'Next action is clear',
      'Package is ready for AI execution'
    ],

    testCommands: [
      "node -e \"import('./backend/src/services/mission-package-generator-service.js').then(m=>console.log(m.generateMissionPackage()))\""
    ]
  }
}
