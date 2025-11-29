import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTmdb } from './useTmdb'
import { usePreferencesStore } from '@/stores/preferences'

/** Requests that take the visitor's content language, shared by several pages. */
function useLocalized(path, extra = {}) {
  const { language } = storeToRefs(usePreferencesStore())
  return useTmdb(path, () => ({ language: language.value, ...extra }))
}

export function useTrending() {
  const request = useLocalized('trending/movie/week')
  const movies = computed(() => request.data.value?.results ?? [])
  return { ...request, movies }
}

export function useGenres() {
  const request = useLocalized('genre/movie/list')
  const genres = computed(() => request.data.value?.genres ?? [])
  const byId = computed(() => new Map(genres.value.map((genre) => [genre.id, genre.name])))
  return { ...request, genres, byId }
}

export function useList(path, params = {}) {
  const request = useLocalized(path, params)
  const movies = computed(() => request.data.value?.results ?? [])
  return { ...request, movies }
}
