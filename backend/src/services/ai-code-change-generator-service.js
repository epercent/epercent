import { getProvider } from '../providers/provider-registry.js'
import { parseEngineeringPackage } from './engineering-package-parser-service.js'
import { validateEngineeringPackage } from './engineering-package-validator-service.js'
import { applyEngineeringPackageToWorkspace } from './governed-workspace-builder-service.js'

function buildEngineeringGenerationMission(missionPackage) {
  return {
    ...missionPackage,

    engineeringExecution: {
      mode: 'Generate Engineering Package',
      standard: 'EOS Engineering Package Standard',
      workspacePolicy: 'Governed Workspace Only',
      canonicalRepositoryWriteAllowed: false,
      promotionAllowed: false,
      commitAllowed: false
    }
  }
}

function normalizeProviderResponse(result, missionId, providerName) {
  return {
    outputText:
      result?.artifact ??
      result?.outputText ??
      '',

    missionId:
      missionId ?? null,

    provider:
      result?.provider ??
      providerName ??
      'Unknown'
  }
}

export async function generateAICodeChange({
  missionPackage,
  providerName,
  repositoryRoot,
  workspaceRoot,
  provider: injectedProvider,
  workspaceBuilder = applyEngineeringPackageToWorkspace
} = {}) {
  const startedAt = new Date().toISOString()

  if (!missionPackage || typeof missionPackage !== 'object') {
    return {
      success: false,
      status: 'Mission Package Rejected',
      startedAt,
      error: 'missionPackage is required.',
      nextStep: 'Mission Package Generation'
    }
  }

  const missionId =
    missionPackage.missionId ??
    missionPackage.id ??
    null

  if (!missionId) {
    return {
      success: false,
      status: 'Mission Package Rejected',
      startedAt,
      error: 'Mission package must contain missionId or id.',
      nextStep: 'Mission Package Generation'
    }
  }

  let provider

  try {
    provider =
      injectedProvider ??
      getProvider(providerName)
  } catch (error) {
    return {
      success: false,
      status: 'Provider Resolution Failed',
      startedAt,
      missionId,
      error:
        error instanceof Error
          ? error.message
          : String(error),
      nextStep: 'Provider Configuration'
    }
  }

  const generationMission =
    buildEngineeringGenerationMission(
      missionPackage
    )

  let providerResult

  try {
    providerResult =
      await provider.submitMission(
        generationMission
      )
  } catch (error) {
    return {
      success: false,
      status: 'Provider Execution Failed',
      startedAt,
      missionId,
      provider:
        provider?.name ?? null,
      providerId:
        provider?.id ?? null,
      error:
        error instanceof Error
          ? error.message
          : String(error),
      nextStep: 'Provider Recovery'
    }
  }

  if (!providerResult?.dispatched) {
    return {
      success: false,
      status: 'Provider Execution Failed',
      startedAt,
      missionId,
      provider:
        provider?.name ?? null,
      providerId:
        provider?.id ?? null,
      providerResult,
      nextStep: 'Provider Recovery'
    }
  }

  const parsed =
    parseEngineeringPackage(
      normalizeProviderResponse(
        providerResult,
        missionId,
        provider?.name
      ),
      {
        missionId,
        provider:
          providerResult?.provider ??
          provider?.name
      }
    )

  if (!parsed.parsed || !parsed.package) {
    return {
      success: false,
      status: 'Engineering Package Parse Failed',
      startedAt,
      missionId,
      provider:
        provider?.name ?? null,
      providerId:
        provider?.id ?? null,
      providerResult,
      parsing: parsed,
      nextStep:
        parsed.nextStep ??
        'Structured Package Regeneration'
    }
  }

  const validation =
    validateEngineeringPackage(
      parsed.package
    )

  if (!validation.valid) {
    return {
      success: false,
      status: 'Engineering Package Validation Failed',
      startedAt,
      missionId,
      provider:
        provider?.name ?? null,
      providerId:
        provider?.id ?? null,
      providerResult,
      parsing: parsed,
      validation,
      engineeringPackage:
        parsed.package,
      nextStep: 'Return package to Hermes'
    }
  }

  const workspace =
    workspaceBuilder(
      parsed.package,
      {
        repositoryRoot,
        workspaceRoot
      }
    )

  if (!workspace?.success) {
    return {
      success: false,
      status: 'Governed Workspace Build Failed',
      startedAt,
      missionId,
      provider:
        provider?.name ?? null,
      providerId:
        provider?.id ?? null,
      providerResult,
      parsing: parsed,
      validation,
      engineeringPackage:
        parsed.package,
      workspace,
      nextStep:
        workspace?.nextStep ??
        'Workspace Recovery'
    }
  }

  return {
    success: true,
    status: 'AI Code Change Generated',
    startedAt,
    completedAt:
      new Date().toISOString(),

    missionId,

    provider:
      provider?.name ?? null,

    providerId:
      provider?.id ?? null,

    providerResult,

    parsing: {
      parsed: parsed.parsed,
      status: parsed.status
    },

    validation,

    engineeringPackage:
      parsed.package,

    workspace,

    governance: {
      canonicalRepositoryModified: false,
      workspaceOnly: true,
      promotionExecuted: false,
      commitExecuted: false
    },

    nextStep:
      'Run Governed Workspace Tests'
  }
}

export function createEngineeringGenerationMission(
  missionPackage
) {
  return buildEngineeringGenerationMission(
    missionPackage
  )
}
