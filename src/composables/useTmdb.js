import { ref, shallowRef, watch, toValue, onScopeDispose } from 'vue'
import { tmdb } from '@/api/tmdb'

/**
 * Reactive TMDb request. Re-fetches whenever the path or params change and aborts
 * the previous request, so fast filter changes never render stale results.
 *
 * @param {import('vue').MaybeRefOrGetter<string | null>} path null skips the request
 * @param {import('vue').MaybeRefOrGetter<Record<string, unknown>>} [params]
 */
export function useTmdb(path, params = {}) {
  const data = shallowRef(null)
  const error = shallowRef(null)
  const loading = ref(false)
  let controller = null

  async function run() {
    const currentPath = toValue(path)
    controller?.abort()
    if (!currentPath) return
    controller = new AbortController()
    const { signal } = controller
    loading.value = true
    error.value = null
    try {
      const result = await tmdb(currentPath, toValue(params), { signal })
      if (!signal.aborted) data.value = result
    }
    catch (err) {
      if (!signal.aborted) error.value = err
    }
    finally {
      if (!signal.aborted) loading.value = false
    }
  }

  watch(() => [toValue(path), JSON.stringify(toValue(params))], run, { immediate: true })
  onScopeDispose(() => controller?.abort())

  return { data, error, loading, refresh: run }
}
