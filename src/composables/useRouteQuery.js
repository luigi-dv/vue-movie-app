import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Two-way binding between a ref and a URL query param, so filters survive reloads,
 * can be shared as links and work with the browser's back button.
 * Setting the default value removes the param to keep URLs short.
 */
export function useRouteQuery(name, defaultValue, { transform = (v) => v, resetPage = true } = {}) {
  const route = useRoute()
  const router = useRouter()

  return computed({
    get() {
      const raw = route.query[name]
      const value = Array.isArray(raw) ? raw[0] : raw
      return value === undefined || value === null || value === '' ? defaultValue : transform(value)
    },
    set(value) {
      const query = { ...route.query }
      if (value === defaultValue || value === '' || value === null || value === undefined) delete query[name]
      else query[name] = String(value)
      if (resetPage && name !== 'page') delete query.page
      router.push({ query })
    }
  })
}
