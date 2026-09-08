const configuredBaseUrl = import.meta.env.VITE_API_URL

function getApiBaseUrl() {
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '')
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api'
  }

  const { hostname, protocol } = window.location
  if (hostname.endsWith('.app.github.dev')) {
    return `${protocol}//${hostname.replace(/-5173\.app\.github\.dev$/, '-8000.app.github.dev')}/api`
  }

  return `${protocol}//${hostname}:8000/api`
}

export const apiBaseUrl = getApiBaseUrl()

export async function request(resource, options = {}) {
  const response = await fetch(`${apiBaseUrl}/${resource}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.error || body.message || message
    } catch {
      // Keep the status message when the server did not return JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  list: (resource) => request(resource),
  create: (resource, data) => request(resource, { method: 'POST', body: JSON.stringify(data) }),
  update: (resource, id, data) => request(`${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (resource, id) => request(`${resource}/${id}`, { method: 'DELETE' }),
}
