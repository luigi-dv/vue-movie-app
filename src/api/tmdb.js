/**
 * Thin client for the TMDb proxy at /api/tmdb.
 * The API key is appended server-side (api/tmdb.js in production, the Vite proxy in development),
 * so nothing secret ever reaches the browser.
 */

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const CACHE_TTL = 5 * 60 * 1000
const cache = new Map()

/** Clears the in-memory response cache (used by tests). */
export function clearTmdbCache() {
  cache.clear()
}

/**
 * GET a TMDb resource through the proxy. Successful responses are kept in memory for
 * five minutes, so going back to a page renders instantly without a second request.
 *
 * @param {string} path TMDb path without version, e.g. "movie/603"
 * @param {Record<string, unknown>} [params] query params; undefined, null and '' are dropped
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function tmdb(path, params = {}, { signal } = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  }
  const search = query.toString()
  const url = `/api/tmdb/${path.replace(/^\/+/, '')}${search ? `?${search}` : ''}`

  const hit = cache.get(url)
  if (hit && Date.now() - hit.time < CACHE_TTL) return hit.data

  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) {
    let message = `TMDb request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.status_message || body.error || message
    }
    catch {
      // Non-JSON error body; keep the generic message
    }
    throw new ApiError(message, response.status)
  }
  const data = await response.json()
  cache.set(url, { data, time: Date.now() })
  return data
}

const IMAGE_BASE = 'https://image.tmdb.org/t/p'

/** Builds a TMDb image URL, or null when the resource has no image. */
export function imageUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null
}

/** srcset for poster images so the browser picks the right width for the slot. */
export function posterSrcset(path) {
  if (!path) return undefined
  return ['w185 185w', 'w342 342w', 'w500 500w', 'w780 780w']
    .map((entry) => {
      const [size, width] = entry.split(' ')
      return `${IMAGE_BASE}/${size}${path} ${width}`
    })
    .join(', ')
}

export function backdropSrcset(path) {
  if (!path) return undefined
  return `${IMAGE_BASE}/w780${path} 780w, ${IMAGE_BASE}/w1280${path} 1280w, ${IMAGE_BASE}/original${path} 1920w`
}
