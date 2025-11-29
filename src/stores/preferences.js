import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { defaultLanguage, languages } from '@/lib/languages'

/** User preferences that apply to every TMDb request. Persisted per browser. */
export const usePreferencesStore = defineStore('preferences', () => {
  const stored = useLocalStorage('movie-app:language', defaultLanguage)
  if (!languages.some((language) => language.id === stored.value)) stored.value = defaultLanguage

  return { language: stored }
})
