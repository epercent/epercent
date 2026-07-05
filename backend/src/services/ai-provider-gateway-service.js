import { aiProviders } from '../data/ai-providers.js'

export function getProviderGateway() {
  return {
    gateway: {
      id: "EOS-AI-PROVIDER-GATEWAY",
      version: "0.1.0",
      status: "Operational",
      routingStrategy: "Capability First"
    },

    providers: aiProviders
  }
}
