import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const MAX_RECENT = 6

/** State for the ⌘K search palette: open/closed plus recently opened results. */
export const useSearchStore = defineStore('search', () => {
  const open = ref(false)
  const recent = useLocalStorage('movie-app:recent-searches', [])

  function remember(result) {
    const entry = {
      id: result.id,
      media_type: result.media_type,
      title: result.title || result.name,
      image: result.poster_path || result.profile_path || null,
      year: (result.release_date || '').slice(0, 4)
    }
    recent.value = [entry, ...recent.value.filter((item) => !(item.id === entry.id && item.media_type === entry.media_type))]
      .slice(0, MAX_RECENT)
  }

  function clearRecent() {
    recent.value = []
  }

  return { open, recent, remember, clearRecent }
})
