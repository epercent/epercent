import { getDevelopmentIntelligence } from './development-intelligence-service.js'
import { getEngineeringOfficeRuntime } from './ai-engineering-office-runtime-service.js'

export function getEngineeringIntelligenceHub() {
  return {
    timestamp: new Date().toISOString(),
    development: getDevelopmentIntelligence(),
    engineeringOffice: getEngineeringOfficeRuntime(),

    recommendation: {
      action: "Continue Enterprise Control Runtime",
      priority: "Critical",
      autonomousReady: false
    }
  }
}
