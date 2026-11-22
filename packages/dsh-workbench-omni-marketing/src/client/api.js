const PREFIX = '/api/omni-marketing'

async function request(url, options = {}, timeout = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (options.signal) {
    if (options.signal.aborted) controller.abort()
    else options.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
    return body.data
  } finally {
    clearTimeout(timer)
  }
}

export function createApi() {
  return {
    get: (resource, signal) => request(`${PREFIX}.data?resource=${resource}`, { signal }),
    post: (action, payload = {}) => request(`${PREFIX}.action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    }),
  }
}
