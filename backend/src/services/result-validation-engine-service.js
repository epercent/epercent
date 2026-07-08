export function validateExecutionResult(dispatchRecord) {
  const requiredFields = [
    'dispatchId',
    'provider',
    'missionId',
    'objective',
    'assignedAgent',
    'assignedOffice',
    'execution',
    'status'
  ]

  const missingFields = requiredFields.filter((field) => !dispatchRecord?.[field])

  const passed = missingFields.length === 0 && dispatchRecord.status === 'Ready'

  return {
    validationId: `VALIDATION-${Date.now()}`,
    validatedAt: new Date().toISOString(),
    dispatchId: dispatchRecord?.dispatchId ?? null,
    missionId: dispatchRecord?.missionId ?? null,
    status: passed ? 'Passed' : 'Failed',
    passed,
    missingFields,
    checks: {
      dispatchExists: Boolean(dispatchRecord?.dispatchId),
      providerSelected: Boolean(dispatchRecord?.provider),
      missionLinked: Boolean(dispatchRecord?.missionId),
      agentAssigned: Boolean(dispatchRecord?.assignedAgent),
      executionStateAvailable: Boolean(dispatchRecord?.execution?.state)
    },
    nextStep: passed
      ? 'Submit for governance approval'
      : 'Return to AI Engineering Office for correction'
  }
}
