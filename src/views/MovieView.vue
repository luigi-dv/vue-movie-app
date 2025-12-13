<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { imageUrl, posterSrcset, backdropSrcset } from '@/api/tmdb'
import { runtime, year, longDate, money, rating, pickTrailer } from '@/lib/format'
import { isRtl } from '@/lib/languages'
import { useTmdb } from '@/composables/useTmdb'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePreferencesStore } from '@/stores/preferences'
import WatchlistButton from '@/components/movie/WatchlistButton.vue'
import TrailerDialog from '@/components/movie/TrailerDialog.vue'
import PosterGrid from '@/components/movie/PosterGrid.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const { language } = storeToRefs(usePreferencesStore())

// One request for the film, its credits, videos, recommendations and certifications
const { data: movie, loading, error, refresh } = useTmdb(
  () => `movie/${props.id}`,
  () => ({
    language: language.value,
    append_to_response: 'credits,videos,recommendations,release_dates',
    // Trailers in the chosen language, falling back to English and language-neutral ones
    include_video_language: `${language.value.slice(0, 2)},en,null`
  })
)

const trailer = computed(() => pickTrailer(movie.value?.videos?.results))
const trailerOpen = ref(false)

const directors = computed(() => (movie.value?.credits?.crew ?? []).filter((person) => person.job === 'Director'))
const writers = computed(() => {
  const seen = new Set()
  return (movie.value?.credits?.crew ?? [])
    .filter((person) => ['Screenplay', 'Writer', 'Story', 'Novel'].includes(person.job))
    .filter((person) => !seen.has(person.id) && seen.add(person.id))
    .slice(0, 4)
})
const cast = computed(() => (movie.value?.credits?.cast ?? []).slice(0, 16))
const recommendations = computed(() => (movie.value?.recommendations?.results ?? []).slice(0, 12))

const certification = computed(() => {
  const releases = movie.value?.release_dates?.results ?? []
  const us = releases.find((entry) => entry.iso_3166_1 === 'US')
  return us?.release_dates.find((entry) => entry.certification)?.certification || null
})

const originalLanguage = computed(() => {
  const code = movie.value?.original_language
  if (!code) return null
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code)
  }
  catch {
    return code
  }
})

const facts = computed(() => {
  const m = movie.value
  if (!m) return []
  return [
    { label: 'Released', value: longDate(m.release_date) },
    { label: 'Runtime', value: runtime(m.runtime) },
    { label: 'Budget', value: money(m.budget) },
    { label: 'Box office', value: money(m.revenue) },
    { label: 'Original title', value: m.original_title !== m.title ? m.original_title : null },
    { label: 'Original language', value: originalLanguage.value },
    { label: 'Status', value: m.status !== 'Released' ? m.status : null },
    { label: 'Studios', value: (m.production_companies ?? []).slice(0, 3).map((c) => c.name).join(', ') || null }
  ].filter((fact) => fact.value)
})

usePageTitle(() => (movie.value ? `${movie.value.title}${movie.value.release_date ? ` (${year(movie.value.release_date)})` : ''}` : null))
</script>

<template>
  <div class="pb-0">
    <div v-if="error" class="page-x py-16">
      <ErrorState :error="error" title="This film did not load" @retry="refresh" />
    </div>

    <template v-else-if="movie && String(movie.id) === id">
      <div class="relative h-[44svh] overflow-hidden bg-surface-2 lg:h-[64svh]">
        <img
          v-if="movie.backdrop_path"
          :src="imageUrl(movie.backdrop_path, 'w1280')"
          :srcset="backdropSrcset(movie.backdrop_path)"
          sizes="100vw"
          :alt="`Still from ${movie.title}`"
          width="1280"
          height="720"
          fetchpriority="high"
          class="drift absolute inset-0 size-full object-cover"
        />
      </div>

      <div class="page-x grid grid-cols-[minmax(0,1fr)] gap-x-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div class="relative -mt-28 w-40 sm:w-52 lg:sticky lg:top-24 lg:mt-[-18svh] lg:w-full lg:max-w-[440px] lg:self-start">
          <div class="aspect-[2/3] overflow-hidden bg-surface">
            <img
              v-if="movie.poster_path"
              :src="imageUrl(movie.poster_path, 'w500')"
              :srcset="posterSrcset(movie.poster_path)"
              sizes="(min-width: 1024px) 34vw, 13rem"
              :alt="`Poster for ${movie.title}`"
              width="500"
              height="750"
              class="size-full object-cover"
            />
          </div>
        </div>

        <article class="min-w-0 pt-8 pb-24 lg:pt-14 lg:pb-32" :dir="isRtl(language) ? 'rtl' : undefined">
          <h1 data-rise class="text-title font-bold">{{ movie.title }}</h1>
          <p data-rise style="--i: 1" class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-soft tabular">
            <span v-if="movie.release_date">{{ year(movie.release_date) }}</span>
            <span v-if="certification" class="bg-surface px-2 font-semibold text-ink">{{ certification }}</span>
            <span v-if="movie.runtime">{{ runtime(movie.runtime) }}</span>
            <span>
              <template v-for="(genre, index) in movie.genres" :key="genre.id">
                <RouterLink :to="{ path: '/movies', query: { genre: genre.id } }" class="text-ink hover:text-accent transition-colors">{{ genre.name }}</RouterLink><template v-if="index < movie.genres.length - 1">, </template>
              </template>
            </span>
          </p>
          <p v-if="movie.tagline" data-rise style="--i: 2" class="mt-6 max-w-[40ch] text-lead">{{ movie.tagline }}</p>

          <div data-rise style="--i: 3" class="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
            <p v-if="movie.vote_count" class="leading-none">
              <span class="text-title font-bold text-accent tabular">{{ rating(movie.vote_average) }}</span>
              <span class="text-lead text-soft">/10</span>
              <span class="mt-2 block text-small text-soft">from {{ movie.vote_count.toLocaleString('en-US') }} votes on TMDb</span>
            </p>
            <div class="flex flex-wrap gap-3">
              <button v-if="trailer" type="button" class="btn btn-primary" @click="trailerOpen = true">
                <PlayIcon class="size-5" aria-hidden="true" /> Play trailer
              </button>
              <WatchlistButton :movie="movie" variant="full" />
            </div>
          </div>

          <section v-if="movie.overview" class="mt-16 max-w-[62ch]">
            <h2 v-reveal class="text-lead font-semibold">Story</h2>
            <p v-reveal="1" class="mt-3">{{ movie.overview }}</p>
          </section>

          <dl class="mt-12 grid max-w-[62ch] gap-x-8 gap-y-5 sm:grid-cols-2">
            <div v-if="directors.length" v-reveal>
              <dt class="text-small text-soft">Directed by</dt>
              <dd class="font-semibold">
                <template v-for="(person, index) in directors" :key="person.id">
                  <RouterLink :to="`/people/${person.id}`" class="hover:text-accent transition-colors">{{ person.name }}</RouterLink><template v-if="index < directors.length - 1">, </template>
                </template>
              </dd>
            </div>
            <div v-if="writers.length" v-reveal="1">
              <dt class="text-small text-soft">Written by</dt>
              <dd class="font-semibold">
                <template v-for="(person, index) in writers" :key="person.id">
                  <RouterLink :to="`/people/${person.id}`" class="hover:text-accent transition-colors">{{ person.name }}</RouterLink><template v-if="index < writers.length - 1">, </template>
                </template>
              </dd>
            </div>
            <div v-for="(fact, index) in facts" :key="fact.label" v-reveal="index + 2">
              <dt class="text-small text-soft">{{ fact.label }}</dt>
              <dd class="font-semibold tabular">{{ fact.value }}</dd>
            </div>
          </dl>

          <section v-if="cast.length" class="mt-20">
            <h2 v-reveal class="text-lead font-semibold">Cast</h2>
            <ul class="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <li v-for="person in cast" :key="person.credit_id" class="w-32 shrink-0 snap-start">
                <RouterLink :to="`/people/${person.id}`" class="group block">
                  <div class="poster-zoom aspect-[2/3] overflow-hidden bg-surface">
                    <img
                      v-if="person.profile_path"
                      :src="imageUrl(person.profile_path, 'w185')"
                      :alt="person.name"
                      width="185"
                      height="278"
                      loading="lazy"
                      class="size-full object-cover"
                    />
                  </div>
                  <p class="mt-2 text-small font-semibold leading-snug group-hover:text-accent transition-colors">{{ person.name }}</p>
                  <p class="text-small text-soft leading-snug">{{ person.character }}</p>
                </RouterLink>
              </li>
            </ul>
          </section>
        </article>
      </div>

      <section v-if="recommendations.length" aria-labelledby="more-title" class="page-x bg-surface py-24 lg:py-32">
        <h2 id="more-title" v-reveal class="text-title font-bold">If you liked {{ movie.title }}</h2>
        <PosterGrid class="mt-12" :movies="recommendations" />
      </section>

      <TrailerDialog :open="trailerOpen" :video="trailer" :title="movie.title" @close="trailerOpen = false" />
    </template>

    <div v-else-if="loading" aria-busy="true">
      <div class="skeleton h-[44svh] lg:h-[64svh]"></div>
      <div class="page-x grid gap-x-16 py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div class="skeleton hidden aspect-[2/3] lg:block"></div>
        <div class="space-y-4">
          <div class="skeleton h-12 w-2/3"></div>
          <div class="skeleton h-5 w-1/3"></div>
          <div class="skeleton mt-10 h-28 max-w-[62ch]"></div>
        </div>
      </div>
      <span class="sr-only">Loading film</span>
    </div>
  </div>
</template>
