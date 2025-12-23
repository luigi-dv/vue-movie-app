/**
 * TMDb proxy (Vercel Serverless Function)
 * Forwards /api/tmdb/<path>?<query> to the TMDb API and appends the API key
 * on the server, so the key never reaches the browser bundle.
 * The <path> is passed in as ?path=... by the rewrite in vercel.json.
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { path = '', ...query } = req.query
    const segments = [].concat(path).join('/').split('/').filter(Boolean)
    const version = process.env.TMDB_API_VERSION || '3'

    const url = new URL(`https://api.themoviedb.org/${version}/${segments.map(encodeURIComponent).join('/')}`)
    for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value)
    }
    url.searchParams.set('api_key', process.env.TMDB_API_KEY)

    try {
        const response = await fetch(url)
        const data = await response.json()
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
        return res.status(response.status).json(data)
    }
    catch {
        return res.status(502).json({ error: 'Failed to reach TMDb' })
    }
}
