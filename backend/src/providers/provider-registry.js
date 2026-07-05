import { OpenAIProvider } from './openai-provider.js'

const providers = {
  OPENAI: new OpenAIProvider()
}

export function getProvider(name = process.env.AI_PROVIDER || "OPENAI") {

  return providers[name]

}

export function listProviders() {

  return Object.values(providers)

}
