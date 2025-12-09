<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowsUpDownIcon } from '@heroicons/vue/20/solid'
import { useTmdb } from '@/composables/useTmdb'
import { useRouteQuery } from '@/composables/useRouteQuery'
import { useGenres } from '@/composables/useCatalogue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePreferencesStore } from '@/stores/preferences'
import { sortOptions, MAX_PAGES } from '@/lib/lists'
import PosterGrid from '@/components/movie/PosterGrid.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'

const toInt = (value) => Number.parseInt(value, 10) || null

const genre = useRouteQuery('genre', null, { transform: toInt })
const sort = useRouteQuery('sort', 'popularity')
const order = useRouteQuery('order', 'desc')
const releaseYear = useRouteQuery('year', null, { transform: toInt })
const page = useRouteQuery('page', 1, { transform: (value) => Math.min(Math.max(toInt(value) || 1, 1), MAX_PAGES) })

const { language } = storeToRefs(usePreferencesStore())
const { genres, byId } = useGenres()

const { data, loading, error, refresh } = useTmdb('discover/movie', () => ({
  language: language.value,
  sort_by: `${sort.value}.${order.value}`,
  with_genres: genre.value,
  primary_release_year: releaseYear.value,
  // Without a vote floor, "best rated" is full of films with a single 10/10 vote
  'vote_count.gte': sort.value === 'vote_average' ? 300 : undefined,
  include_adult: false,
  page: page.value
}))

const movies = computed(() => data.value?.results ?? [])
const totalPages = computed(() => Math.min(data.value?.total_pages ?? 1, MAX_PAGES))
const totalResults = computed(() => data.value?.total_results ?? null)

const thisYear = new Date().getFullYear()
const years = Array.from({ length: thisYear + 2 - 1920 }, (_, i) => thisYear + 1 - i)

const orderLabels = {
  popularity: ['Most popular first', 'Least popular first'],
  vote_average: ['Best rated first', 'Lowest rated first'],
  primary_release_date: ['Newest first', 'Oldest first'],
  revenue: ['Highest grossing first', 'Lowest grossing first'],
  title: ['Z to A', 'A to Z']
}
const orderLabel = computed(() => (orderLabels[sort.value] ?? ['Descending', 'Ascending'])[order.value === 'desc' ? 0 : 1])

const genreName = computed(() => (genre.value ? byId.value.get(genre.value) : null))
const heading = computed(() => {
  if (genreName.value && releaseYear.value) return `${genreName.value}, ${releaseYear.value}`
  if (genreName.value) return `${genreName.value} films`
  if (releaseYear.value) return `Films from ${releaseYear.value}`
  return 'Discover'
})
const filtered = computed(() => genre.value || releaseYear.value || sort.value !== 'popularity' || order.value !== 'desc')

usePageTitle(() => (genreName.value ? `${genreName.value} films` : 'Discover films'))

function reset() {
  genre.value = null
  releaseYear.value = null
  sort.value = 'popularity'
  order.value = 'desc'
}
</script>

<template>
  <div class="page-x pt-10 pb-28 lg:pt-16">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <h1 class="text-title font-bold">{{ heading }}</h1>
      <p class="text-soft tabular" aria-live="polite">
        <template v-if="totalResults !== null">{{ totalResults.toLocaleString('en-US') }} films</template>
      </p>
    </div>

    <nav aria-label="Genres" class="no-scrollbar -mx-4 mt-8 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <ul class="flex w-max gap-2 lg:w-auto lg:flex-wrap">
        <li>
          <button
            type="button"
            class="min-h-11 px-4 font-medium transition-colors duration-150"
            :class="!genre ? 'bg-accent text-on-accent' : 'bg-surface hover:bg-surface-2'"
            :aria-pressed="!genre"
            @click="genre = null"
          >
            All genres
          </button>
        </li>
        <li v-for="item in genres" :key="item.id">
          <button
            type="button"
            class="min-h-11 px-4 font-medium whitespace-nowrap transition-colors duration-150"
            :class="genre === item.id ? 'bg-accent text-on-accent' : 'bg-surface hover:bg-surface-2'"
            :aria-pressed="genre === item.id"
            @click="genre = genre === item.id ? null : item.id"
          >
            {{ item.name }}
          </button>
        </li>
      </ul>
    </nav>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <label>
        <span class="sr-only">Sort by</span>
        <select v-model="sort" class="field-select">
          <option v-for="option in sortOptions" :key="option.id" :value="option.id">Sort by {{ option.name.toLowerCase() }}</option>
        </select>
      </label>
      <button type="button" class="btn btn-quiet font-medium" @click="order = order === 'desc' ? 'asc' : 'desc'">
        <ArrowsUpDownIcon class="size-5 text-soft" aria-hidden="true" />
        {{ orderLabel }}
      </button>
      <label>
        <span class="sr-only">Release year</span>
        <select :value="releaseYear ?? ''" class="field-select" @change="releaseYear = toInt($event.target.value)">
          <option value="">Any year</option>
          <option v-for="option in years" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
      <button v-if="filtered" type="button" class="min-h-12 px-3 font-medium text-accent hover:underline underline-offset-4" @click="reset">
        Reset filters
      </button>
    </div>

    <div class="mt-12">
      <PosterGrid :movies="movies" :loading="loading" :error="error" @retry="refresh" />
      <p v-if="!loading && !error && !movies.length" class="bg-surface px-6 py-12 text-lead">
        No films match these filters. <button type="button" class="link" @click="reset">Reset them</button>
      </p>
    </div>

    <PaginationBar class="mt-16" :page="page" :total-pages="totalPages" />
  </div>
</template>
