import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

/** Fields kept per film: enough to render a poster tile without refetching. */
function snapshot(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    release_date: movie.release_date ?? '',
    vote_average: movie.vote_average ?? 0,
    addedAt: Date.now()
  }
}

/** Watchlist persisted in localStorage, so it works without an account and syncs across tabs. */
export const useWatchlistStore = defineStore('watchlist', () => {
  const items = useLocalStorage('movie-app:watchlist', [])

  const ids = computed(() => new Set(items.value.map((item) => item.id)))
  const count = computed(() => items.value.length)

  function has(id) {
    return ids.value.has(id)
  }

  function add(movie) {
    if (!has(movie.id)) items.value = [snapshot(movie), ...items.value]
  }

  function remove(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function toggle(movie) {
    if (has(movie.id)) remove(movie.id)
    else add(movie)
  }

  function clear() {
    items.value = []
  }

  return { items, count, has, add, remove, toggle, clear }
})
