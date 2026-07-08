import { getEnterpriseControlSummary } from '../services/enterprise-control-summary-service.js'

export function getEnterpriseControlSummaryController(_req, res) {
  res.json(getEnterpriseControlSummary())
}
