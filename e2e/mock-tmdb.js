/**
 * Offline stand-in for TMDb. Every /api/tmdb request is answered from these fixtures,
 * so the browser tests are fast, deterministic and need no API key.
 */

const genres = [
  { id: 28, name: 'Action' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Science Fiction' }
]

function movie(id, title, extra = {}) {
  return {
    id,
    title,
    original_title: title,
    poster_path: `/poster-${id}.jpg`,
    backdrop_path: `/backdrop-${id}.jpg`,
    release_date: '1999-03-31',
    vote_average: 8.2,
    vote_count: 25000,
    genre_ids: [28, 878],
    overview: `${title} overview.`,
    media_type: 'movie',
    ...extra
  }
}

const catalogue = [
  movie(603, 'The Matrix'),
  movie(949, 'Heat', { genre_ids: [28, 18], release_date: '1995-12-15' }),
  movie(78, 'Blade Runner', { genre_ids: [878, 18], release_date: '1982-06-25' }),
  movie(438631, 'Dune', { release_date: '2021-09-15' }),
  movie(129, 'Spirited Away', { release_date: '2001-07-20' })
]

function page(results, extra = {}) {
  return { page: 1, results, total_pages: 3, total_results: results.length * 3, ...extra }
}

function movieDetails(id) {
  const base = catalogue.find((m) => m.id === id) ?? movie(id, `Film ${id}`)
  return {
    ...base,
    runtime: 136,
    budget: 63000000,
    revenue: 463517383,
    status: 'Released',
    tagline: 'Believe the unbelievable.',
    original_language: 'en',
    genres: genres.filter((g) => base.genre_ids.includes(g.id)),
    production_companies: [{ id: 1, name: 'Village Roadshow Pictures' }],
    credits: {
      cast: [{ id: 6384, credit_id: 'c1', name: 'Keanu Reeves', character: 'Neo', profile_path: '/keanu.jpg' }],
      crew: [{ id: 9339, credit_id: 'c2', name: 'Lana Wachowski', job: 'Director' }]
    },
    videos: { results: [{ key: 'vKQi3bBA1y8', site: 'YouTube', type: 'Trailer', official: true, name: 'Official Trailer' }] },
    recommendations: page(catalogue.filter((m) => m.id !== id).slice(0, 3)),
    release_dates: { results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'R' }] }] }
  }
}

function respond(url) {
  const path = url.pathname.replace(/^\/api\/tmdb\//, '')
  const params = url.searchParams

  if (path === 'genre/movie/list') return { genres }
  if (path === 'search/multi' || path === 'search/movie') {
    const q = (params.get('query') || '').toLowerCase()
    const people = [{ id: 6384, name: 'Keanu Reeves', media_type: 'person', known_for_department: 'Acting', known_for: [{ title: 'The Matrix' }] }]
    const movies = catalogue.filter((m) => m.title.toLowerCase().includes(q))
    return page(path === 'search/movie' ? movies : [...movies, ...people.filter((p) => p.name.toLowerCase().includes(q))])
  }
  if (path === 'discover/movie') {
    const genre = Number(params.get('with_genres'))
    return page(genre ? catalogue.filter((m) => m.genre_ids.includes(genre)) : catalogue, { page: Number(params.get('page') || 1) })
  }
  if (path.startsWith('movie/') && /^movie\/\d+$/.test(path)) {
    const id = Number(path.split('/')[1])
    return id === 404404 ? null : movieDetails(id)
  }
  if (path.startsWith('movie/') || path.startsWith('trending/')) return page(catalogue)
  if (path.startsWith('person/')) {
    return {
      id: 6384,
      name: 'Keanu Reeves',
      known_for_department: 'Acting',
      birthday: '1964-09-02',
      place_of_birth: 'Beirut, Lebanon',
      biography: 'Keanu Charles Reeves is a Canadian actor.',
      profile_path: '/keanu.jpg',
      movie_credits: { cast: [{ ...catalogue[0], character: 'Neo' }], crew: [] }
    }
  }
  return page([])
}

const pixel = '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="3"><rect width="2" height="3" fill="#2a3a33"/></svg>'

export async function mockTmdb(page) {
  await page.route('**/api/tmdb/**', async (route) => {
    const body = respond(new URL(route.request().url()))
    if (body === null) {
      await route.fulfill({ status: 404, json: { status_message: 'The resource you requested could not be found.' } })
    }
    else {
      await route.fulfill({ json: body })
    }
  })
  // Keep tests offline: images, the GitHub API and YouTube are stubbed
  await page.route('https://image.tmdb.org/**', (route) => route.fulfill({ contentType: 'image/svg+xml', body: pixel }))
  await page.route('https://github.com/**', (route) => route.fulfill({ contentType: 'image/svg+xml', body: pixel }))
  await page.route('https://api.github.com/**', (route) => route.fulfill({ status: 404, json: {} }))
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<p>player</p>' }))
}
