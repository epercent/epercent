export function completeMission({
  mission,
  engineeringPackage,
  governanceReview,
  gitCommit
}) {

  const errors = []

  if (!mission?.id)
    errors.push("Mission ID missing.")

  if (!engineeringPackage?.packageId)
    errors.push("Engineering Package missing.")

  if (governanceReview?.decision !== "Approved")
    errors.push("Governance approval missing.")

  if (!gitCommit?.success)
    errors.push("Git commit not completed.")

  if (errors.length) {
    return {
      success: false,
      status: "Mission Incomplete",
      errors,
      nextStep: "Return to Hermes"
    }
  }

  return {
    success: true,
    status: "Mission Complete",
    completedAt: new Date().toISOString(),
    missionId: mission.id,
    packageId: engineeringPackage.packageId,
    commit: gitCommit.commit,
    engineeringSummary: {
      validation: true,
      workspace: true,
      testing: true,
      governance: true,
      committed: true
    },
    nextStep: "Generate Next Mission"
  }
}
