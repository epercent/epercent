export function requestGovernanceApproval(validationResult) {
  const approved = validationResult?.passed === true

  return {
    approvalId: `APPROVAL-${Date.now()}`,
    reviewedAt: new Date().toISOString(),
    validationId: validationResult?.validationId ?? null,
    missionId: validationResult?.missionId ?? null,
    status: approved ? 'Approved' : 'Rejected',
    approved,
    governanceOffice: 'Governance Office',
    approvalMode: 'Human Governance Required',
    nextStep: approved
      ? 'Update Development Intelligence and prepare commit'
      : 'Return to AI Engineering Office for correction'
  }
}
