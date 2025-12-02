<script setup>
import { computed } from 'vue'
import { imageUrl } from '@/api/tmdb'
import { useList } from '@/composables/useCatalogue'
import { topRatedQuery } from '@/lib/lists'
import TmdbLogo from '@/components/ui/TmdbLogo.vue'

const menu = [
  { to: '/movies', label: 'Discover' },
  { to: '/movies/popular', label: 'Popular' },
  { to: '/movies/now-playing', label: 'In cinemas' },
  { to: '/movies/upcoming', label: 'Coming soon' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/about', label: 'How it’s built' }
]

// The highest-rated film's backdrop, cropped hard, closes every page
const { movies } = useList(topRatedQuery.path, topRatedQuery.params)
const still = computed(() => movies.value.find((movie) => movie.backdrop_path) || null)
</script>

<template>
  <footer class="grid bg-surface lg:min-h-[86svh] lg:grid-cols-2">
    <div class="relative h-[50svh] overflow-hidden bg-surface-2 lg:h-auto">
      <img
        v-if="still"
        :src="imageUrl(still.backdrop_path, 'w1280')"
        :alt="`Still from ${still.title}`"
        width="1280"
        height="720"
        loading="lazy"
        class="absolute inset-0 size-full scale-125 object-cover object-[30%_40%]"
      />
      <RouterLink
        v-if="still"
        :to="`/movies/title/${still.id}`"
        class="absolute bottom-0 left-0 bg-ground px-4 py-3 text-small font-medium hover:text-accent transition-colors"
      >
        {{ still.title }}, among the highest-rated films on TMDb
      </RouterLink>
    </div>

    <div class="flex flex-col px-6 py-14 sm:px-12 lg:py-20">
      <RouterLink to="/" class="font-bold tracking-tight">Movie App<span class="text-accent">.</span></RouterLink>
      <nav aria-label="Footer" class="mt-8">
        <ul class="group/menu space-y-3 lg:space-y-5">
          <li v-for="item in menu" :key="item.to">
            <RouterLink
              :to="item.to"
              class="inline-block text-[clamp(1.75rem,2.6vw,2.5rem)] font-bold tracking-tight leading-tight transition-[transform,color] duration-200 group-hover/menu:text-soft hover:translate-x-3 hover:text-ink! focus-visible:translate-x-3"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="mt-16 grid gap-8 text-small sm:grid-cols-2">
        <div>
          <p class="font-semibold">Built by Luigelo Davila</p>
          <p class="mt-1 text-soft">Design, front end and the serverless layer.</p>
          <a href="https://github.com/Luigi-DV" class="link mt-2 inline-block" rel="me noopener" target="_blank">github.com/Luigi-DV</a>
        </div>
        <div>
          <p class="font-semibold">Source code</p>
          <p class="mt-1 text-soft">Vue 3, Vite and Vercel, tested with Vitest and Playwright.</p>
          <a href="https://github.com/Luigi-DV/vue-movies-api" class="link mt-2 inline-block" rel="noopener" target="_blank">Read the repository</a>
        </div>
      </div>

      <div class="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-16 text-small text-soft">
        <a href="https://www.themoviedb.org" target="_blank" rel="noopener" class="shrink-0">
          <TmdbLogo class="h-4 w-auto" />
        </a>
        <p class="max-w-[52ch]">This product uses the TMDB API but is not endorsed or certified by TMDB. Film data and images belong to TMDB and its contributors.</p>
      </div>
    </div>
  </footer>
</template>
