import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WatchlistButton from './WatchlistButton.vue'
import { useWatchlistStore } from '@/stores/watchlist'

const movie = { id: 603, title: 'The Matrix', poster_path: null, release_date: '1999-03-31', vote_average: 8.2 }

describe('WatchlistButton', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('exposes its state to assistive technology and toggles the store', async () => {
    const wrapper = mount(WatchlistButton, { props: { movie } })
    const button = wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-label')).toBe('Add The Matrix to your watchlist')

    await button.trigger('click')
    expect(useWatchlistStore().has(603)).toBe(true)
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('aria-label')).toBe('Remove The Matrix from your watchlist')
  })

  it('renders a labelled button in the full variant', async () => {
    const wrapper = mount(WatchlistButton, { props: { movie, variant: 'full' } })
    expect(wrapper.text()).toContain('Add to watchlist')
    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('On your watchlist')
  })
})
