export const engineeringAssignments = [
  {
    id: "ENG-ASSIGN-0001",
    missionId: "EBM-2026-0001",
    status: "Ready",

    capability: "Backend Development",

    recommendedWorkforce: {
      primary: "ADO-AGENT-CODEX-001",
      review: "ADO-AGENT-REVIEW-001",
      testing: "ADO-AGENT-TEST-001",
      documentation: "ADO-AGENT-DOCS-001"
    },

    estimatedComplexity: "Medium",

    dependencies: [
      "Engineering Coordination Engine"
    ],

    approvalRequired: true
  }
]
