import fs from 'fs'
import path from 'path'

const EKO_ROOT = path.resolve(process.cwd(), '..', 'enterprise', 'knowledge', 'objects')

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function walkJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return walkJsonFiles(fullPath)
    }

    return entry.name.endsWith('.json') ? [fullPath] : []
  })
}

export function listEnterpriseKnowledgeObjects() {
  const objects = walkJsonFiles(EKO_ROOT).map(readJsonFile)

  return {
    status: 'Operational',
    count: objects.length,
    objects
  }
}

export function getEnterpriseKnowledgeObject(id) {
  const objects = listEnterpriseKnowledgeObjects().objects

  return objects.find((object) => object.knowledgeObjectId === id) ?? null
}
