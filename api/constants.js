// Only the TMDb resources the app actually reads. Anything else is refused before it costs
// a function invocation's worth of work, so the proxy can't be borrowed as a free TMDb key.
export const ALLOWED_ROOTS = new Set(['discover', 'genre', 'movie', 'person', 'search', 'trending'])
// Catalogue data changes slowly. Browsers keep answers for 10 minutes and the Vercel CDN for a
// day, then serves the stale copy for up to a week while it refreshes in the background.
export const CACHE_OK = 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800'
// A missing film or person stays missing; cache the 404 too so repeat hits never reach the function.
export const CACHE_NOT_FOUND = 'public, max-age=600, s-maxage=3600'
// Rate limits, outages and other errors must not be pinned in the CDN.
export const CACHE_NONE = 'no-store'