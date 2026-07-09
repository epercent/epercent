export function createProviderResponse(execution, providerResponse) {
  return {
    responseId: `RESPONSE-${Date.now()}`,
    provider: execution.provider,
    missionId: execution.missionId,
    executionRuntimeId: execution.executionRuntimeId,
    receivedAt: new Date().toISOString(),
    status: 'Received',
    codeGenerated: !!providerResponse,
    response: providerResponse,
    nextStep: 'Governance Review'
  }
}
