import { OpenAIProvider } from './openai-provider.js'
import { env } from '../config/env.js'

const providers = {
  OPENAI: new OpenAIProvider()
}

export function getProvider(name = env.aiProvider) {
  const normalizedName = String(name || 'OPENAI').trim().toUpperCase()
  const provider = providers[normalizedName]

  if (!provider) {
    throw new Error(`Unsupported AI provider: ${normalizedName}`)
  }

  return provider
}

export function listProviders() {
  return Object.values(providers)
}
