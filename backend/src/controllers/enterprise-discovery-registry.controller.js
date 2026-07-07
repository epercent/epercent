import { listEnterpriseDiscoveryReports } from '../services/enterprise-discovery-registry-service.js'

export function getEnterpriseDiscoveryRegistry(req, res) {
  const registry = listEnterpriseDiscoveryReports()

  res.json({
    module: 'Enterprise Discovery Registry',
    status: 'Operational',
    ...registry
  })
}
