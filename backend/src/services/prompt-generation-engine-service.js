export function generateProviderPrompt(missionPackage) {
  return {
    promptId: `PROMPT-${Date.now()}`,
    provider: missionPackage.execution.provider,
    missionId: missionPackage.id,
    generatedAt: new Date().toISOString(),
    objective: missionPackage.mission.objective,
    prompt: `
You are an AI software engineer.

Objective:
${missionPackage.mission.objective}

Priority:
${missionPackage.mission.priority}

Assigned Office:
${missionPackage.mission.assignedOffice}

Assigned Agent:
${missionPackage.mission.assignedAgent}

Implement the requested feature.
Return production-ready code.
Do not modify unrelated files.
    `.trim(),
    status: "Generated",
    nextStep: "Send to Provider Adapter"
  }
}
