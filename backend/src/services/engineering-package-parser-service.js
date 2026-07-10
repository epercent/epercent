import { createEmptyEngineeringPackage } from './engineering-package-standard-service.js'

function extractJsonCandidate(text = '') {
  const trimmed = String(text).trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed
  }

  const fencedJsonMatch = trimmed.match(/```json\s*([\s\S]*?)```/i)

  if (fencedJsonMatch?.[1]) {
    return fencedJsonMatch[1].trim()
  }

  const fencedMatch = trimmed.match(/```\s*([\s\S]*?)```/)

  if (fencedMatch?.[1]) {
    const candidate = fencedMatch[1].trim()

    if (candidate.startsWith('{') && candidate.endsWith('}')) {
      return candidate
    }
  }

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }

  return null
}

function normalizeEngineeringPackage(parsed, context = {}) {
  const base = createEmptyEngineeringPackage({
    missionId:
      parsed?.missionId ??
      context.missionId ??
      'UNKNOWN-MISSION',
    provider:
      parsed?.provider ??
      context.provider ??
      'Unknown'
  })

  return {
    ...base,
    ...parsed,
    packageId: parsed?.packageId ?? base.packageId,
    missionId: parsed?.missionId ?? base.missionId,
    provider: parsed?.provider ?? base.provider,
    generatedAt: parsed?.generatedAt ?? base.generatedAt,
    summary: typeof parsed?.summary === 'string' ? parsed.summary : '',
    files: Array.isArray(parsed?.files) ? parsed.files : [],
    operations: Array.isArray(parsed?.operations) ? parsed.operations : [],
    tests: Array.isArray(parsed?.tests) ? parsed.tests : [],
    risks: Array.isArray(parsed?.risks) ? parsed.risks : [],
    governance: {
      ...base.governance,
      ...(parsed?.governance ?? {})
    }
  }
}

export function parseEngineeringPackage(providerResponse, context = {}) {
  const outputText =
    typeof providerResponse === 'string'
      ? providerResponse
      : providerResponse?.outputText ?? ''

  const candidate = extractJsonCandidate(outputText)

  if (!candidate) {
    return {
      parsed: false,
      status: 'No Engineering Package Found',
      error: 'Provider response did not contain a JSON engineering package.',
      rawResponse: outputText,
      package: null,
      nextStep: 'Return response to Hermes for structured regeneration'
    }
  }

  try {
    const parsed = JSON.parse(candidate)
    const normalizedPackage = normalizeEngineeringPackage(parsed, {
      missionId: context.missionId ?? providerResponse?.missionId,
      provider: context.provider ?? providerResponse?.provider
    })

    return {
      parsed: true,
      status: 'Engineering Package Parsed',
      error: null,
      rawResponse: outputText,
      package: normalizedPackage,
      nextStep: 'Validate Engineering Package'
    }
  } catch (error) {
    return {
      parsed: false,
      status: 'Engineering Package Parse Failed',
      error: error.message,
      rawResponse: outputText,
      package: null,
      nextStep: 'Return response to Hermes for correction'
    }
  }
}
