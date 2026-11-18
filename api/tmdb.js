/**
 * TMDb proxy (Vercel Serverless Function)
 * Forwards /api/tmdb/<path>?<query> to the TMDb API and appends the API key
 * on the server, so the key never reaches the browser bundle.
 * The <path> is passed in as ?path=... by the rewrite in vercel.json.
 */

// Only the TMDb resources the app actually reads. Anything else is refused before it costs
// a function invocation's worth of work, so the proxy can't be borrowed as a free TMDb key.
const ALLOWED_ROOTS = new Set(['discover', 'genre', 'movie', 'person', 'search', 'trending'])

// Catalogue data changes slowly. Browsers keep answers for 10 minutes and the Vercel CDN for a
// day, then serves the stale copy for up to a week while it refreshes in the background.
export const CACHE_OK = 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800'
// A missing film or person stays missing; cache the 404 too so repeat hits never reach the function.
export const CACHE_NOT_FOUND = 'public, max-age=600, s-maxage=3600'
// Rate limits, outages and other errors must not be pinned in the CDN.
export const CACHE_NONE = 'no-store'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { path = '', ...query } = req.query
    const segments = [].concat(path).join('/').split('/').filter(Boolean)
    if (!ALLOWED_ROOTS.has(segments[0])) {
        res.setHeader('Cache-Control', CACHE_NOT_FOUND)
        return res.status(404).json({ error: 'Not found' })
    }
    const version = process.env.TMDB_API_VERSION || '3'

    const url = new URL(`https://api.themoviedb.org/${version}/${segments.map(encodeURIComponent).join('/')}`)
    for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value)
    }
    url.searchParams.set('api_key', process.env.TMDB_API_KEY)

    try {
        const response = await fetch(url)
        const data = await response.json()
        const cache = response.ok ? CACHE_OK : response.status === 404 ? CACHE_NOT_FOUND : CACHE_NONE
        res.setHeader('Cache-Control', cache)
        return res.status(response.status).json(data)
    }
    catch {
        res.setHeader('Cache-Control', CACHE_NONE)
        return res.status(502).json({ error: 'Failed to reach TMDb' })
    }
}
