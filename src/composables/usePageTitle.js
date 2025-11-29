import { watchEffect, toValue } from 'vue'

const SITE = 'Movie App'

/** Keeps document.title in sync with the page, e.g. "The Matrix (1999) · Movie App". */
export function usePageTitle(title) {
  watchEffect(() => {
    const value = toValue(title)
    document.title = value ? `${value} · ${SITE}` : `${SITE} · Every film, one keystroke away`
  })
}
