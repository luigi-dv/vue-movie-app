import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useWatchlistStore } from './watchlist'

const matrix = { id: 603, title: 'The Matrix', poster_path: '/p.jpg', release_date: '1999-03-31', vote_average: 8.2, overview: 'not stored' }
const heat = { id: 949, title: 'Heat', poster_path: null, release_date: '1995-12-15', vote_average: 7.9 }

describe('watchlist store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds the newest film first and keeps only what a tile needs', () => {
    const watchlist = useWatchlistStore()
    watchlist.add(matrix)
    watchlist.add(heat)
    expect(watchlist.items.map((item) => item.id)).toEqual([949, 603])
    expect(watchlist.items[1]).not.toHaveProperty('overview')
    expect(watchlist.count).toBe(2)
  })

  it('never stores the same film twice', () => {
    const watchlist = useWatchlistStore()
    watchlist.add(matrix)
    watchlist.add(matrix)
    expect(watchlist.count).toBe(1)
  })

  it('toggles a film in and out', () => {
    const watchlist = useWatchlistStore()
    watchlist.toggle(matrix)
    expect(watchlist.has(603)).toBe(true)
    watchlist.toggle(matrix)
    expect(watchlist.has(603)).toBe(false)
  })

  it('persists to localStorage', async () => {
    const watchlist = useWatchlistStore()
    watchlist.add(matrix)
    await nextTick()
    const stored = JSON.parse(localStorage.getItem('movie-app:watchlist'))
    expect(stored[0]).toMatchObject({ id: 603, title: 'The Matrix' })
  })
})
