<script setup>
import { computed } from 'vue'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { imageUrl } from '@/api/tmdb'
import { useTrending } from '@/composables/useCatalogue'
import { useWatchlistStore } from '@/stores/watchlist'
import WatchlistButton from '@/components/movie/WatchlistButton.vue'

const { movies } = useTrending()
const watchlist = useWatchlistStore()
const trailerStill = computed(() => movies.value.filter((movie) => movie.backdrop_path)[1] || null)
const saveExample = computed(() => movies.value[2] || null)

const titles = [
  { language: 'English', title: 'Spirited Away' },
  { language: 'Español', title: 'El viaje de Chihiro' },
  { language: 'Français', title: 'Le Voyage de Chihiro' },
  { language: '日本語', title: '千と千尋の神隠し' }
]
</script>

<template>
  <section aria-labelledby="features-title" class="page-x py-28 lg:py-44 lg:pl-[18vw]">
    <h2 id="features-title" v-reveal class="text-title font-bold">What you can do here</h2>

    <div class="mt-16 space-y-20 lg:space-y-28">
      <article class="flex max-w-[680px] flex-col gap-5 sm:flex-row">
        <div v-reveal class="flex w-full shrink-0 flex-col justify-center bg-surface p-4 sm:w-[360px]">
          <div data-ui class="bg-paper">
            <div class="flex items-center gap-3 bg-surface-2 px-4 py-3">
              <MagnifyingGlassIcon class="size-5 text-soft" aria-hidden="true" /><span>spirited</span><span class="h-5 w-0.5 bg-accent" aria-hidden="true"></span>
            </div>
            <p class="flex justify-between bg-accent px-4 py-2 text-small font-medium text-on-accent"><span>Spirited Away</span><span class="tabular">2001</span></p>
            <p class="flex justify-between px-4 py-2 text-small"><span>Spirit: Stallion of the Cimarron</span><span class="tabular text-soft">2002</span></p>
          </div>
        </div>
        <div v-reveal="1" class="sm:w-[280px]">
          <h3 class="font-semibold">Search from any page</h3>
          <p class="mt-2">Press ⌘K, Ctrl K or the slash key. Films and people arrive as you type, and the palette remembers what you opened.</p>
        </div>
      </article>

      <article class="flex max-w-[680px] flex-col gap-5 sm:flex-row">
        <div v-reveal class="w-full shrink-0 bg-surface p-4 sm:w-[360px]">
          <div data-ui class="bg-paper px-4 py-3 text-small">
            <p class="truncate"><span class="text-soft">movieapp.ldvloper.com/movies?</span><span class="font-semibold text-accent">genre=878</span><span class="text-soft">&amp;</span><span class="font-semibold text-accent">sort=vote_average</span></p>
          </div>
          <p data-ui class="mt-3 px-1 text-small text-soft">Science Fiction, best rated first, page 1 of 500</p>
        </div>
        <div v-reveal="1" class="sm:w-[280px]">
          <h3 class="font-semibold">Every filter is a link</h3>
          <p class="mt-2">Genre, year, sort order and page live in the address bar. Share the view, bookmark it, or press back to undo.</p>
        </div>
      </article>

      <article class="flex max-w-[680px] flex-col gap-5 sm:flex-row">
        <RouterLink
          v-reveal
          :to="trailerStill ? `/movies/title/${trailerStill.id}` : '/movies'"
          class="group relative block h-[200px] w-full shrink-0 overflow-hidden bg-surface sm:w-[360px]"
          :aria-label="trailerStill ? `Open ${trailerStill.title}` : 'Browse films'"
        >
          <img
            v-if="trailerStill"
            :src="imageUrl(trailerStill.backdrop_path, 'w780')"
            alt=""
            width="780"
            height="439"
            loading="lazy"
            class="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span data-ui class="absolute bottom-0 left-0 flex items-center gap-2 bg-accent px-4 py-3 text-small font-semibold text-on-accent">
            <PlayIcon class="size-4" aria-hidden="true" /> Play trailer
          </span>
        </RouterLink>
        <div v-reveal="1" class="sm:w-[280px]">
          <h3 class="font-semibold">Trailers open in place</h3>
          <p class="mt-2">The best official trailer plays in a privacy-enhanced YouTube player, without leaving the film’s page.</p>
        </div>
      </article>

      <article class="flex max-w-[680px] flex-col gap-5 sm:flex-row">
        <div v-reveal class="flex w-full shrink-0 flex-col justify-center gap-3 bg-surface p-4 sm:w-[360px]">
          <p data-ui class="flex items-center justify-between bg-paper px-4 py-3 text-small font-medium">
            Watchlist
            <span class="grid min-w-6 h-6 place-items-center bg-accent px-1.5 font-semibold text-on-accent tabular">{{ watchlist.count }}</span>
          </p>
          <div v-if="saveExample" data-ui class="flex items-center justify-between gap-3 bg-paper p-2 pl-4">
            <span class="truncate text-small font-medium">{{ saveExample.title }}</span>
            <WatchlistButton :movie="saveExample" />
          </div>
        </div>
        <div v-reveal="1" class="sm:w-[280px]">
          <h3 class="font-semibold">A watchlist with no account</h3>
          <p class="mt-2">Saved in your browser and kept in step across open tabs. Try the bookmark: the count updates everywhere at once.</p>
        </div>
      </article>

      <article class="flex max-w-[680px] flex-col gap-5 sm:flex-row">
        <div v-reveal class="w-full shrink-0 bg-surface p-4 sm:w-[360px]">
          <ul data-ui class="bg-paper py-1">
            <li v-for="(entry, index) in titles" :key="entry.language" class="flex items-baseline justify-between gap-3 px-4 py-1.5 text-small" :class="index === 3 && 'bg-surface-2'">
              <span class="font-medium">{{ entry.title }}</span><span class="text-soft">{{ entry.language }}</span>
            </li>
          </ul>
        </div>
        <div v-reveal="1" class="sm:w-[280px]">
          <h3 class="font-semibold">Twelve languages</h3>
          <p class="mt-2">Titles, overviews and posters switch to the language you choose, Arabic right to left included.</p>
        </div>
      </article>
    </div>
  </section>
</template>
