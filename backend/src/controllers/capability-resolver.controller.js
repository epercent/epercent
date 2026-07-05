import { resolveMissionCapability } from '../services/capability-resolver-service.js'

export function getCapabilityResolution(req, res) {
  res.json(resolveMissionCapability())
}
