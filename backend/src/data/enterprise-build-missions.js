export const enterpriseBuildMissions = [
  {
    id: "EBM-2026-0001",
    title: "Engineering Coordination Engine",
    objective: "Create the first coordination engine capable of orchestrating EOS engineering services.",
    priority: "Critical",
    status: "Completed",
    businessValue: "High",
    office: "AI Development Office",

    lifecycle: {
      phase: "Completed",
      progress: 100,
      approved: true
    },

    engineering: {
      estimatedHours: 6,
      actualHours: 4,
      autonomousDevelopmentImpact: 2,
      engineeringMaturityImpact: 1
    },

    capabilities: [
      "Coordination",
      "Workflow",
      "Engineering Governance"
    ],

    assignedWorkforce: [
      "Program Director",
      "Codex Build Agent"
    ],

    deliverables: [
      "Engineering Coordination Service",
      "REST API",
      "Mission Control Integration"
    ],

    nextMission: "EBM-2026-0002"
  }
]
