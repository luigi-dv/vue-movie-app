import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { useTmdb } from './useTmdb'
import { clearTmdbCache } from '@/api/tmdb'

describe('useTmdb', () => {
  let resolvers

  beforeEach(() => {
    clearTmdbCache()
    resolvers = []
    // Each request stays pending until the test resolves it, and rejects when aborted
    vi.stubGlobal('fetch', vi.fn((url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
      resolvers.push({ url, resolve: (body) => resolve(new Response(JSON.stringify(body))) })
    })))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('loads data and clears the loading flag', async () => {
    const scope = effectScope()
    const { data, loading } = scope.run(() => useTmdb('movie/603'))
    expect(loading.value).toBe(true)
    resolvers[0].resolve({ title: 'The Matrix' })
    await flushPromises()
    expect(data.value).toEqual({ title: 'The Matrix' })
    expect(loading.value).toBe(false)
    scope.stop()
  })

  it('aborts the stale request when params change, so old answers never win', async () => {
    const page = ref(1)
    const scope = effectScope()
    const { data, error } = scope.run(() => useTmdb('movie/popular', () => ({ page: page.value })))
    page.value = 2
    await nextTick()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true)

    resolvers[1].resolve({ page: 2 })
    await flushPromises()
    expect(data.value).toEqual({ page: 2 })
    expect(error.value).toBeNull()
    scope.stop()
  })

  it('skips the request while the path is null', () => {
    const scope = effectScope()
    const { loading } = scope.run(() => useTmdb(() => null))
    expect(fetch).not.toHaveBeenCalled()
    expect(loading.value).toBe(false)
    scope.stop()
  })
})
