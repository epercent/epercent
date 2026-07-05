import { getProviderGateway } from '../services/ai-provider-gateway-service.js'

export function getProviderGatewayController(req, res) {
  res.json(getProviderGateway())
}
