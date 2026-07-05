import { engineeringLedger } from '../data/engineering-ledger.js'

export function getEngineeringLedger() {
  return {
    ledger: engineeringLedger,
    summary: {
      totalEntries: engineeringLedger.length,
      status: "Operational"
    }
  }
}
