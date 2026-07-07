import { runEnterpriseDiscovery } from '../services/enterprise-discovery-orchestrator-service.js'

export async function runEnterpriseDiscoveryController(req, res) {
  const { source, entityType, name } = req.body ?? {}

  const result = await runEnterpriseDiscovery({
    source,
    entityType,
    name
  })

  res.json(result)
}
