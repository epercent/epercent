import fs from 'fs'
import path from 'path'

const evidenceDirectory = path.resolve(process.cwd(), 'eos/evidence/discovery')

export function listEnterpriseDiscoveryReports() {
  if (!fs.existsSync(evidenceDirectory)) {
    return {
      count: 0,
      reports: []
    }
  }

  const reports = fs.readdirSync(evidenceDirectory)
    .filter(file => file.endsWith('.json'))
    .sort()
    .reverse()
    .map(file => {
      const fullPath = path.join(evidenceDirectory, file)
      const report = JSON.parse(fs.readFileSync(fullPath, 'utf8'))

      return {
        file,
        discoveredAt: report.enterprise.discovered_at,
        enterprise: report.enterprise.name,
        website: report.enterprise.website,
        confidence: report.evidence.confidence,
        digitalTwinStatus: report.discovery.digital_twin_status
      }
    })

  return {
    count: reports.length,
    reports
  }
}
