<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { refDebounced } from '@vueuse/core'
import { StarIcon } from '@heroicons/vue/20/solid'
import { imageUrl } from '@/api/tmdb'
import { rating, year } from '@/lib/format'
import { useTmdb } from '@/composables/useTmdb'
import { useGenres } from '@/composables/useCatalogue'
import { usePreferencesStore } from '@/stores/preferences'
import WatchlistButton from '@/components/movie/WatchlistButton.vue'

const { language } = storeToRefs(usePreferencesStore())
const title = ref('Spirited Away')
const term = refDebounced(computed(() => title.value.trim()), 300)

const { data, loading } = useTmdb(
  () => (term.value.length >= 2 ? 'search/movie' : null),
  () => ({ query: term.value, language: language.value, include_adult: false })
)
const { byId } = useGenres()

const match = computed(() => (term.value.length >= 2 ? data.value?.results?.[0] ?? null : null))
const request = computed(() => `/api/tmdb/search/movie?query=${encodeURIComponent(title.value.trim()).replace(/%20/g, '+')}`)
const genres = computed(() => (match.value?.genre_ids ?? []).map((id) => byId.value.get(id)).filter(Boolean).slice(0, 3))
</script>

<template>
  <section aria-labelledby="showcase-title" class="grid lg:grid-cols-2">
    <h2 id="showcase-title" class="sr-only">Type a title, get the film</h2>

    <div class="flex min-w-0 min-h-[62svh] flex-col bg-field px-5 pt-[14svh] pb-8 text-on-field sm:px-12 lg:min-h-[90svh] lg:pt-[24svh]">
      <label for="showcase-input" class="text-small font-semibold text-field-soft">Type any film</label>
      <input
        id="showcase-input"
        v-model="title"
        type="search"
        autocomplete="off"
        spellcheck="false"
        class="mt-3 w-full max-w-[34ch] bg-white/10 px-4 py-3 text-lead font-semibold text-on-field placeholder:text-field-soft/70 focus:bg-white/15 focus:outline-none focus-visible:outline-3 focus-visible:outline-on-field"
        placeholder="Spirited Away"
      />
      <pre class="mt-6 max-w-full overflow-x-auto text-small leading-relaxed text-field-soft"><code>GET {{ request }}
<span class="text-on-field">→ the server adds the API key and caches the answer for an hour</span></code></pre>
      <p v-reveal aria-hidden="true" class="mt-auto pt-16 text-display font-bold">Type it,</p>
    </div>

    <div class="flex min-w-0 min-h-[62svh] flex-col bg-ground px-5 pt-10 pb-8 sm:px-12 lg:min-h-[90svh] lg:pt-[24svh]">
      <div data-ui aria-live="polite" class="w-full max-w-[500px] bg-paper p-4 transition-opacity duration-200" :class="loading && 'opacity-60'">
        <div v-if="match" class="flex gap-4">
          <img
            v-if="match.poster_path"
            :src="imageUrl(match.poster_path, 'w342')"
            :alt="`Poster for ${match.title}`"
            width="140"
            height="210"
            loading="lazy"
            class="h-[210px] w-[140px] shrink-0 object-cover"
          />
          <div class="min-w-0">
            <p class="text-lead font-bold leading-tight">{{ match.title }}</p>
            <p class="mt-1 flex items-center gap-2 text-small text-soft tabular">
              {{ year(match.release_date) }}
              <span v-if="match.vote_average" class="inline-flex items-center gap-1 text-ink"><StarIcon class="size-4 text-accent" aria-hidden="true" />{{ rating(match.vote_average) }}</span>
            </p>
            <p v-if="genres.length" class="mt-1 text-small text-soft">{{ genres.join(', ') }}</p>
            <p class="mt-3 line-clamp-3 text-small">{{ match.overview }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <RouterLink :to="`/movies/title/${match.id}`" class="btn btn-primary min-h-11 px-4 text-small">Open film</RouterLink>
              <WatchlistButton :movie="match" />
            </div>
          </div>
        </div>
        <div v-else-if="loading || title.trim() !== term" class="flex gap-4" aria-hidden="true">
          <div class="skeleton h-[210px] w-[140px] shrink-0"></div>
          <div class="flex-1"><div class="skeleton h-6 w-3/4"></div><div class="skeleton mt-3 h-4 w-1/3"></div><div class="skeleton mt-6 h-16"></div></div>
        </div>
        <p v-else class="py-10 text-center text-soft">{{ term.length < 2 ? 'Start typing a title.' : `TMDb has nothing called “${term}”. Try another title.` }}</p>
      </div>
      <p v-reveal aria-hidden="true" class="mt-auto self-end pt-16 text-display font-bold">find it.</p>
    </div>
  </section>
</template>
