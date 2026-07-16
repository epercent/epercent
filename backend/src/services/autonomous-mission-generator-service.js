export function generateNextEngineeringMission({
  completedMission,
  currentSprint = 'Sprint 10',
  currentObjective = 'Complete Autonomous Engineering Runtime',
  sequence = 1
}) {
  if (!completedMission?.success || completedMission.status !== 'Mission Complete') {
    return {
      success: false,
      status: 'Mission Generation Blocked',
      reason: 'Previous mission has not been completed.',
      nextStep: 'Complete Current Mission'
    }
  }

  const generatedAt = new Date().toISOString()

  return {
    success: true,
    status: 'Mission Generated',
    mission: {
      id: `EOS-AUTONOMOUS-MISSION-${Date.now()}-${sequence}`,
      generatedAt,
      sprint: currentSprint,
      objective: currentObjective,
      rationale:
        'Continue the governed autonomous engineering programme after successful mission completion.',
      priority: 'Critical',
      assignedOffice: 'AI Engineering Office',
      assignedAgent: 'Hermes',
      executionMode: 'Human Approved',
      autonomousReady: false,
      predecessorMissionId: completedMission.missionId,
      predecessorCommit: completedMission.commit,
      requiredCapabilities: [
        'Mission Orchestration',
        'Engineering Package Generation',
        'Package Validation',
        'Governed Workspace Execution',
        'Automated Testing',
        'Governance Review',
        'Git Execution'
      ],
      acceptanceCriteria: [
        'Mission is generated from verified completion evidence',
        'Sprint and objective are explicitly defined',
        'Office and agent are assigned',
        'Predecessor mission and commit are linked',
        'Mission is ready for orchestration'
      ],
      nextStep: 'Dispatch Mission'
    }
  }
}
