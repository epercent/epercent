import { getDevelopmentIntelligence } from '../services/development-intelligence-service.js'

export function getDevelopmentIntelligenceController(_req, res) {
  res.json(getDevelopmentIntelligence())
}
