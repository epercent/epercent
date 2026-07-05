import { getEngineeringLedger } from '../services/engineering-ledger-service.js'

export function getEngineeringLedgerController(req, res) {
  res.json(getEngineeringLedger())
}
