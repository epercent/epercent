export function reviewEngineeringPackage({
  validation,
  workspace,
  tests,
  governance
}) {

  const errors = []

  if (!validation?.valid)
    errors.push("Engineering package validation failed.")

  if (!workspace?.success)
    errors.push("Workspace build failed.")

  if (!tests?.success)
    errors.push("Workspace tests failed.")

  const confidence = governance?.confidence ?? 0

  const approvalRequired =
    governance?.approvalRequired ?? true

  const autonomousApproved =
    governance?.approvedForAutonomousExecution ?? false

  let decision = "Rejected"

  if (
    errors.length === 0 &&
    autonomousApproved &&
    confidence >= 0.95 &&
    !approvalRequired
  ) {
    decision = "Approved"
  }
  else if (
    errors.length === 0
  ) {
    decision = "Human Review Required"
  }

  return {
    reviewedAt: new Date().toISOString(),
    decision,
    confidence,
    approvalRequired,
    autonomousApproved,
    passedValidation: validation?.valid ?? false,
    workspaceBuilt: workspace?.success ?? false,
    testsPassed: tests?.success ?? false,
    errors,
    nextStep:
      decision === "Approved"
        ? "Git Commit"
        : decision === "Human Review Required"
          ? "Executive Approval"
          : "Return package to Hermes"
  }
}
