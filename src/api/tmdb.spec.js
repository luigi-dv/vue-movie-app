import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tmdb, imageUrl, posterSrcset, clearTmdbCache, ApiError } from './tmdb'

function jsonResponse(body, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))
}

describe('tmdb client', () => {
  beforeEach(() => {
    clearTmdbCache()
    vi.stubGlobal('fetch', vi.fn(() => jsonResponse({ ok: true })))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('calls the proxy, never TMDb directly, and drops empty params', async () => {
    await tmdb('/movie/603', { language: 'en-US', page: 2, genre: '', year: undefined, region: null })
    const [url] = fetch.mock.calls[0]
    expect(url).toBe('/api/tmdb/movie/603?language=en-US&page=2')
    expect(url).not.toContain('api_key')
  })

  it('serves repeated requests from memory', async () => {
    await tmdb('movie/603')
    await tmdb('movie/603')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws an ApiError with TMDb’s message and status', async () => {
    fetch.mockImplementationOnce(() => jsonResponse({ status_message: 'The resource you requested could not be found.' }, 404))
    const error = await tmdb('movie/0').catch((err) => err)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
    expect(error.message).toBe('The resource you requested could not be found.')
  })

  it('does not cache failures', async () => {
    fetch.mockImplementationOnce(() => jsonResponse({}, 500))
    await expect(tmdb('movie/1')).rejects.toThrow()
    await expect(tmdb('movie/1')).resolves.toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('builds image URLs and responsive srcsets', () => {
    expect(imageUrl('/a.jpg', 'w342')).toBe('https://image.tmdb.org/t/p/w342/a.jpg')
    expect(imageUrl(null)).toBeNull()
    expect(posterSrcset('/a.jpg')).toContain('https://image.tmdb.org/t/p/w780/a.jpg 780w')
  })
})
