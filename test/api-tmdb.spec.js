import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import handler, { CACHE_OK, CACHE_NOT_FOUND, CACHE_NONE } from '../api/tmdb.js'

function mockRes() {
  const res = { headers: {}, statusCode: 200, body: undefined }
  res.setHeader = (key, value) => { res.headers[key] = value }
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (body) => { res.body = body; return res }
  return res
}

describe('api/tmdb serverless proxy', () => {
  beforeEach(() => {
    process.env.TMDB_API_KEY = 'secret-key'
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ id: 603 }), { status: 200 })))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.TMDB_API_KEY
  })

  it('forwards the path and query to TMDb and appends the key server-side', async () => {
    const res = mockRes()
    await handler({ method: 'GET', query: { path: 'movie/603', language: 'es-ES' } }, res)
    const url = new URL(fetch.mock.calls[0][0])
    expect(url.origin + url.pathname).toBe('https://api.themoviedb.org/3/movie/603')
    expect(url.searchParams.get('language')).toBe('es-ES')
    expect(url.searchParams.get('api_key')).toBe('secret-key')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ id: 603 })
  })

  it('caches successful answers in the browser and at the edge', async () => {
    const res = mockRes()
    await handler({ method: 'GET', query: { path: 'movie/603' } }, res)
    expect(res.headers['Cache-Control']).toBe(CACHE_OK)
  })

  it('caches 404s briefly and never caches other errors', async () => {
    fetch.mockResolvedValueOnce(new Response('{}', { status: 404 }))
    const missing = mockRes()
    await handler({ method: 'GET', query: { path: 'movie/0' } }, missing)
    expect(missing.headers['Cache-Control']).toBe(CACHE_NOT_FOUND)

    fetch.mockResolvedValueOnce(new Response('{}', { status: 429 }))
    const limited = mockRes()
    await handler({ method: 'GET', query: { path: 'movie/603' } }, limited)
    expect(limited.statusCode).toBe(429)
    expect(limited.headers['Cache-Control']).toBe(CACHE_NONE)
  })

  it('refuses TMDb resources the app does not use', async () => {
    const res = mockRes()
    await handler({ method: 'GET', query: { path: 'account/1/lists' } }, res)
    expect(res.statusCode).toBe(404)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('accepts path segments as an array', async () => {
    await handler({ method: 'GET', query: { path: ['movie', '603', 'credits'] } }, mockRes())
    expect(new URL(fetch.mock.calls[0][0]).pathname).toBe('/3/movie/603/credits')
  })

  it('only allows GET', async () => {
    const res = mockRes()
    await handler({ method: 'POST', query: {} }, res)
    expect(res.statusCode).toBe(405)
    expect(res.headers.Allow).toBe('GET')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('answers 502 when TMDb cannot be reached', async () => {
    fetch.mockRejectedValueOnce(new Error('network down'))
    const res = mockRes()
    await handler({ method: 'GET', query: { path: 'movie/603' } }, res)
    expect(res.statusCode).toBe(502)
  })
})
