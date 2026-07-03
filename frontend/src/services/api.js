const API_BASE_URL = 'http://localhost:3000'

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`EOS Core API returned ${response.status} for ${path}`)
  }

  return response.json()
}

export function fetchCoreStatus() {
  return requestJson('/api/status')
}

export function fetchEnterpriseObjects() {
  return requestJson('/api/objects')
}
