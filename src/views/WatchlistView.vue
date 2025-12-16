<script setup>
import { computed, ref } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'
import { useRouteQuery } from '@/composables/useRouteQuery'
import { usePageTitle } from '@/composables/usePageTitle'
import PosterTile from '@/components/movie/PosterTile.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const watchlist = useWatchlistStore()
const sort = useRouteQuery('sort', 'added')

const sorters = {
  added: (a, b) => b.addedAt - a.addedAt,
  title: (a, b) => a.title.localeCompare(b.title),
  rating: (a, b) => b.vote_average - a.vote_average,
  release: (a, b) => (b.release_date || '').localeCompare(a.release_date || '')
}
const items = computed(() => [...watchlist.items].sort(sorters[sort.value] ?? sorters.added))

// Clearing keeps a copy for a few seconds so it can be undone instead of asking for confirmation
const undoBuffer = ref(null)
let undoTimer = null
function clearAll() {
  undoBuffer.value = [...watchlist.items]
  watchlist.clear()
  clearTimeout(undoTimer)
  undoTimer = setTimeout(() => { undoBuffer.value = null }, 8000)
}
function undo() {
  watchlist.items = undoBuffer.value
  undoBuffer.value = null
}

usePageTitle('Your watchlist')
</script>

<template>
  <div class="page-x pt-10 pb-28 lg:pt-16">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div>
        <h1 class="text-title font-bold">Your watchlist</h1>
        <p class="mt-3 text-lead text-soft">
          <template v-if="watchlist.count">{{ watchlist.count }} {{ watchlist.count === 1 ? 'film' : 'films' }}, saved in this browser.</template>
          <template v-else>Saved in this browser. No account needed.</template>
        </p>
      </div>
      <div v-if="watchlist.count" class="flex flex-wrap items-center gap-2">
        <label>
          <span class="sr-only">Sort watchlist</span>
          <select v-model="sort" class="field-select">
            <option value="added">Recently added</option>
            <option value="title">Title, A to Z</option>
            <option value="rating">Best rated</option>
            <option value="release">Newest releases</option>
          </select>
        </label>
        <button type="button" class="btn btn-quiet font-medium" @click="clearAll">Clear all</button>
      </div>
    </div>

    <p v-if="undoBuffer" role="status" class="mt-8 flex flex-wrap items-center justify-between gap-4 bg-field px-5 py-3 text-on-field">
      Watchlist cleared.
      <button type="button" class="btn btn-on-field min-h-10 px-4" @click="undo">Undo</button>
    </p>

    <TransitionGroup
      v-if="items.length"
      tag="div"
      class="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      move-class="transition-transform duration-300"
      leave-active-class="transition-opacity duration-200 absolute"
      leave-to-class="opacity-0"
    >
      <PosterTile v-for="(movie, index) in items" :key="movie.id" :movie="movie" :eager="index < 6" />
    </TransitionGroup>

    <EmptyState
      v-else-if="!undoBuffer"
      class="mt-12"
      title="Nothing saved yet"
      text="Use the bookmark on any poster or film page. Your picks stay here, in this browser, until you remove them."
    >
      <RouterLink to="/movies/popular" class="btn btn-on-field">See what’s popular</RouterLink>
      <RouterLink to="/movies/now-playing" class="btn text-on-field hover:bg-white/10">What’s in cinemas</RouterLink>
    </EmptyState>
  </div>
</template>
