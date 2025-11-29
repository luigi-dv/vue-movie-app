/**
 * TMDb's own top_rated list ranks titles with a handful of votes above the classics,
 * so "top rated" is built from discover with a vote floor instead.
 */
export const topRatedQuery = { path: 'discover/movie', params: { sort_by: 'vote_average.desc', 'vote_count.gte': 1000 } }

/** Curated TMDb lists exposed as /movies/:list routes. */
export const movieLists = [
  { slug: 'popular', path: 'movie/popular', title: 'Popular', description: 'What people are watching on TMDb right now.' },
  { slug: 'now-playing', path: 'movie/now_playing', title: 'Now playing', description: 'In cinemas this week.' },
  { slug: 'upcoming', path: 'movie/upcoming', title: 'Upcoming', description: 'Opening in the coming weeks.' },
  { slug: 'top-rated', ...topRatedQuery, title: 'Top rated', description: 'The highest-rated films with at least a thousand votes.' }
]

export function findList(slug) {
  return movieLists.find((list) => list.slug === slug) || null
}

export const sortOptions = [
  { id: 'popularity', name: 'Popularity' },
  { id: 'vote_average', name: 'Rating' },
  { id: 'primary_release_date', name: 'Release date' },
  { id: 'revenue', name: 'Box office' },
  { id: 'title', name: 'Title' }
]

/** TMDb caps pagination at page 500. */
export const MAX_PAGES = 500
