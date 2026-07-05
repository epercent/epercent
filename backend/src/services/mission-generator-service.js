export function generateEngineeringMissions(ecrs = []) {
  return {
    generatedAt: new Date().toISOString(),
    totalEcrs: ecrs.length,
    totalMissions: ecrs.length,
    missions: ecrs.map((ecr, index) => ({
      missionId: `ADM-IMP-${String(index + 1).padStart(4, '0')}`,
      sourceEcr: ecr.id,
      title: ecr.title,
      priority: ecr.priority,
      status: "READY_FOR_DISPATCH",
      assignedProvider: null,
      assignedWorkforce: null,
      approval: "Pending",
      generated: true
    }))
  };
}
