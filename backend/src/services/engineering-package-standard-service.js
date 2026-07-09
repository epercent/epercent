export function createEngineeringPackageStandard() {
  return {
    standard: 'EOS Engineering Package Standard',
    version: '0.1.0',
    status: 'Active',
    requiredFields: [
      'packageId',
      'missionId',
      'provider',
      'summary',
      'files',
      'operations',
      'tests',
      'risks',
      'governance'
    ],
    packageShape: {
      packageId: 'string',
      missionId: 'string',
      provider: 'string',
      generatedAt: 'ISO-8601 datetime',
      summary: 'string',
      files: [
        {
          path: 'string',
          action: 'create | update | delete',
          language: 'string',
          content: 'string',
          reason: 'string'
        }
      ],
      operations: [
        {
          type: 'create_file | update_file | delete_file | run_command',
          target: 'string',
          description: 'string'
        }
      ],
      tests: [
        {
          command: 'string',
          purpose: 'string',
          expectedResult: 'string'
        }
      ],
      risks: [
        {
          level: 'low | medium | high | critical',
          description: 'string',
          mitigation: 'string'
        }
      ],
      governance: {
        confidence: 'number between 0 and 1',
        approvalRequired: 'boolean',
        approvedForAutonomousExecution: 'boolean',
        reviewer: 'string'
      }
    },
    nextStep: 'Create engineering package validator'
  }
}

export function createEmptyEngineeringPackage({ missionId, provider }) {
  return {
    packageId: `EPS-${Date.now()}`,
    missionId,
    provider,
    generatedAt: new Date().toISOString(),
    summary: '',
    files: [],
    operations: [],
    tests: [],
    risks: [],
    governance: {
      confidence: 0,
      approvalRequired: true,
      approvedForAutonomousExecution: false,
      reviewer: 'Governance Office'
    }
  }
}
