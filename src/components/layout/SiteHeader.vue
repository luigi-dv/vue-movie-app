<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { languages } from '@/lib/languages'
import { usePreferencesStore } from '@/stores/preferences'
import { useWatchlistStore } from '@/stores/watchlist'
import { useSearchStore } from '@/stores/search'

const links = [
  { to: '/movies', label: 'Discover' },
  { to: '/movies/now-playing', label: 'In cinemas' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/about', label: 'How it’s built' }
]

const { language } = storeToRefs(usePreferencesStore())
const watchlist = useWatchlistStore()
const search = useSearchStore()
const route = useRoute()
const menuOpen = ref(false)
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

watch(() => route.fullPath, () => { menuOpen.value = false })

function isActive(to) {
  if (to === '/movies') return route.path === '/movies' || route.path.startsWith('/movies/genres')
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-ground">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 btn btn-primary">Skip to content</a>
    <div class="page-x flex h-16 items-center gap-6">
      <RouterLink to="/" class="text-lead font-bold tracking-tight shrink-0" aria-label="Movie App, home">
        Movie App<span class="text-accent">.</span>
      </RouterLink>

      <nav aria-label="Main" class="hidden lg:block">
        <ul class="flex items-center gap-1">
          <li v-for="link in links" :key="link.to">
            <RouterLink
              :to="link.to"
              class="relative flex h-12 items-center px-3 font-medium transition-colors duration-150 hover:text-accent"
              :class="isActive(link.to) ? 'text-accent' : 'text-ink'"
              :aria-current="isActive(link.to) ? 'page' : undefined"
            >
              {{ link.label }}
              <span
                v-if="link.to === '/watchlist' && watchlist.count"
                class="ml-1.5 grid min-w-6 h-6 place-items-center bg-accent px-1.5 text-small font-semibold text-on-accent tabular"
              >
                {{ watchlist.count }}<span class="sr-only"> saved</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          class="btn btn-quiet px-3 sm:px-4 font-medium"
          aria-keyshortcuts="Meta+K Control+K /"
          @click="search.open = true"
        >
          <MagnifyingGlassIcon class="size-5" aria-hidden="true" />
          <span class="hidden sm:inline">Search films and people</span>
          <span class="sr-only sm:hidden">Search</span>
          <kbd class="hidden md:inline text-small text-soft font-sans">{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd>
        </button>

        <label class="hidden md:block">
          <span class="sr-only">Content language</span>
          <select v-model="language" class="field-select">
            <option v-for="option in languages" :key="option.id" :value="option.id">{{ option.name }}</option>
          </select>
        </label>

        <button
          type="button"
          class="grid size-12 place-items-center hover:bg-surface lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <component :is="menuOpen ? XMarkIcon : Bars3Icon" class="size-6" aria-hidden="true" />
          <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150" leave-to-class="opacity-0"
    >
      <nav v-if="menuOpen" id="mobile-menu" aria-label="Main" class="page-x bg-surface pb-8 pt-4 lg:hidden">
        <ul>
          <li v-for="link in links" :key="link.to">
            <RouterLink :to="link.to" class="flex min-h-14 items-center justify-between text-lead font-semibold" :class="isActive(link.to) && 'text-accent'">
              {{ link.label }}
              <span v-if="link.to === '/watchlist' && watchlist.count" class="text-body text-soft tabular">{{ watchlist.count }} saved</span>
            </RouterLink>
          </li>
        </ul>
        <label class="mt-6 block md:hidden">
          <span class="block text-small text-soft mb-2">Content language</span>
          <select v-model="language" class="field-select w-full bg-ground">
            <option v-for="option in languages" :key="option.id" :value="option.id">{{ option.name }}</option>
          </select>
        </label>
      </nav>
    </Transition>
  </header>
</template>
