import { runEnterpriseDiscovery } from '../services/enterprise-discovery-orchestrator-service.js'

export function runEnterpriseDiscoveryController(req, res) {
  const { source, entityType, name } = req.body ?? {}

  res.json(
    runEnterpriseDiscovery({
      source,
      entityType,
      name
    })
  )
}
