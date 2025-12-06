<script setup>
import { computed } from 'vue'
import { imageUrl } from '@/api/tmdb'
import { rating, year } from '@/lib/format'
import { useList, useGenres } from '@/composables/useCatalogue'
import { topRatedQuery } from '@/lib/lists'

const nowPlaying = useList('movie/now_playing')
const upcoming = useList('movie/upcoming')
const topRated = useList(topRatedQuery.path, topRatedQuery.params)
const { byId } = useGenres()

const today = new Date().toISOString().slice(0, 10)

function shortDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function note(movie) {
  const genres = (movie.genre_ids ?? []).map((id) => byId.value.get(id)).filter(Boolean).slice(0, 2)
  return [...genres, year(movie.release_date)].filter(Boolean).join(', ')
}

const groups = computed(() => [
  {
    name: 'In cinemas',
    to: '/movies/now-playing',
    items: nowPlaying.movies.value.slice(0, 5).map((movie) => ({ movie, figure: rating(movie.vote_average) || 'New', label: 'Rating' }))
  },
  {
    name: 'Coming soon',
    to: '/movies/upcoming',
    items: upcoming.movies.value
      .filter((movie) => movie.release_date >= today)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))
      .slice(0, 5)
      .map((movie) => ({ movie, figure: shortDate(movie.release_date), label: 'Opens' }))
  },
  {
    name: 'Top rated',
    to: '/movies/top-rated',
    items: topRated.movies.value.slice(0, 5).map((movie) => ({ movie, figure: rating(movie.vote_average), label: 'Rating' }))
  }
])

const backdrop = computed(() => nowPlaying.movies.value.find((movie) => movie.backdrop_path) || null)
const loading = computed(() => nowPlaying.loading.value && !nowPlaying.movies.value.length)
</script>

<template>
  <section aria-labelledby="programme-title" class="relative overflow-hidden bg-field px-2.5 py-20 sm:px-6 lg:py-32">
    <img
      v-if="backdrop"
      :src="imageUrl(backdrop.backdrop_path, 'w1280')"
      alt=""
      width="1280"
      height="720"
      loading="lazy"
      class="absolute inset-0 size-full object-cover"
    />
    <div class="absolute inset-0 bg-black/35" aria-hidden="true"></div>

    <div class="scallop relative mx-auto max-w-[640px] bg-paper px-7 py-16 text-center sm:px-16 lg:mr-[8vw]">
      <h2 id="programme-title" v-reveal class="text-title font-bold">This week’s programme</h2>
      <p v-reveal="1" class="mt-3 text-soft">Live from TMDb, refreshed every day.</p>

      <div v-if="loading" class="mt-14 space-y-4" aria-hidden="true">
        <div v-for="n in 8" :key="n" class="skeleton h-5"></div>
      </div>

      <div v-for="(group, groupIndex) in groups" v-else :key="group.name" class="mt-14">
        <h3 v-reveal class="text-lead font-semibold">
          <RouterLink :to="group.to" class="hover:text-accent transition-colors">{{ group.name }}</RouterLink>
        </h3>
        <ul class="mx-auto mt-6 max-w-[420px] space-y-4 text-left">
          <li v-for="(item, index) in group.items" :key="item.movie.id" v-reveal="index + groupIndex">
            <RouterLink :to="`/movies/title/${item.movie.id}`" class="group grid grid-cols-[1fr_auto] items-baseline gap-x-6">
              <span class="font-semibold group-hover:text-accent transition-colors">{{ item.movie.title }}</span>
              <span class="tabular font-semibold"><span class="sr-only">{{ item.label }} </span>{{ item.figure }}</span>
              <span class="col-span-2 text-small text-soft">{{ note(item.movie) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <p class="mt-16 text-soft">Every title opens its own page<br />with cast, trailer and similar films.</p>
    </div>
    <p v-if="backdrop" class="relative mt-6 text-center text-small text-white lg:mr-[8vw] lg:ml-auto lg:max-w-[640px]">
      Behind the sheet: {{ backdrop.title }}, in cinemas now.
    </p>
  </section>
</template>

<style scoped>
/* Scalloped top and bottom edges, like a printed cinema programme. The gradients are an alpha mask cutting the shape, not a visible fill. */
.scallop {
  --r: 9px;
  mask:
    radial-gradient(var(--r) at 50% 0, #0000 97%, #000) 50% 0 / calc(2.4 * var(--r)) 51% repeat-x, /* taste-skill-ignore */
    radial-gradient(var(--r) at 50% 100%, #0000 97%, #000) 50% 100% / calc(2.4 * var(--r)) 51% repeat-x; /* taste-skill-ignore */
}
</style>
