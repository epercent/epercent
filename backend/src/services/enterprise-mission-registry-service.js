import fs from 'fs'
import path from 'path'

const registryDir = path.resolve(process.cwd(), 'eos/evidence/missions')

function slug(value) {
  return String(value || 'mission')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function createEnterpriseMission({
  enterprise,
  missionType,
  priority = 'Medium',
  assignedOffice = 'Engineering Office',
  assignedAgent = 'Unassigned',
  governanceStatus = 'Awaiting Review'
}) {
  fs.mkdirSync(registryDir, { recursive: true })

  const createdAt = new Date().toISOString()
  const stamp = createdAt
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .replace('T', '-')

  const mission = {
    id: `EOS-MISSION-${Date.now()}`,
    enterprise,
    missionType,
    priority,
    assignedOffice,
    assignedAgent,
    status: 'Open',
    governanceStatus,
    createdAt
  }

  const fileName = `${stamp}-${slug(enterprise)}-mission.json`

  fs.writeFileSync(
    path.join(registryDir, fileName),
    JSON.stringify(mission, null, 2)
  )

  return {
    fileName,
    mission
  }
}

export function listEnterpriseMissions() {
  if (!fs.existsSync(registryDir)) {
    return {
      module: 'Enterprise Mission Registry',
      status: 'Operational',
      count: 0,
      missions: []
    }
  }

  const missions = fs.readdirSync(registryDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()
    .map(file => ({
      file,
      ...JSON.parse(
        fs.readFileSync(path.join(registryDir, file), 'utf8')
      )
    }))

  return {
    module: 'Enterprise Mission Registry',
    status: 'Operational',
    count: missions.length,
    missions
  }
}
