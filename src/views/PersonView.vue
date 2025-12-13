<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { imageUrl } from '@/api/tmdb'
import { longDate, age, year } from '@/lib/format'
import { useTmdb } from '@/composables/useTmdb'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePreferencesStore } from '@/stores/preferences'
import PosterTile from '@/components/movie/PosterTile.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const { language } = storeToRefs(usePreferencesStore())
const { data: person, loading, error, refresh } = useTmdb(
  () => `person/${props.id}`,
  () => ({ language: language.value, append_to_response: 'movie_credits' })
)

const showFullBio = ref(false)
const paragraphs = computed(() => (person.value?.biography ?? '').split(/\n+/).map((p) => p.trim()).filter(Boolean))
const visibleParagraphs = computed(() => (showFullBio.value ? paragraphs.value : paragraphs.value.slice(0, 2)))

/** Every film credit, one row per film, merging acting and crew jobs. */
const credits = computed(() => {
  const rows = new Map()
  const add = (credit, role) => {
    const row = rows.get(credit.id) ?? { movie: credit, roles: [] }
    if (role && !row.roles.includes(role)) row.roles.push(role)
    rows.set(credit.id, row)
  }
  for (const credit of person.value?.movie_credits?.cast ?? []) add(credit, credit.character)
  for (const credit of person.value?.movie_credits?.crew ?? []) add(credit, credit.job)
  return [...rows.values()]
})

const knownFor = computed(() => [...credits.value]
  .sort((a, b) => (b.movie.vote_count ?? 0) - (a.movie.vote_count ?? 0))
  .slice(0, 6)
  .map((row) => row.movie))

const filmography = computed(() => [...credits.value].sort((a, b) => {
  const da = a.movie.release_date || '9999'
  const db = b.movie.release_date || '9999'
  return db.localeCompare(da)
}))

const lifeLine = computed(() => {
  const p = person.value
  if (!p?.birthday) return null
  const born = `Born ${longDate(p.birthday)}${p.place_of_birth ? ` in ${p.place_of_birth}` : ''}`
  if (p.deathday) return `${born}. Died ${longDate(p.deathday)}, aged ${age(p.birthday, p.deathday)}.`
  return `${born}. Age ${age(p.birthday)}.`
})

usePageTitle(() => person.value?.name)
</script>

<template>
  <div>
    <div v-if="error" class="page-x py-16">
      <ErrorState :error="error" title="This person did not load" @retry="refresh" />
    </div>

    <div v-else-if="person && String(person.id) === id" class="lg:grid lg:grid-cols-2">
      <div class="relative h-[60svh] bg-surface-2 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)]">
        <img
          v-if="person.profile_path"
          :src="imageUrl(person.profile_path, 'h632')"
          :alt="person.name"
          width="421"
          height="632"
          fetchpriority="high"
          class="absolute inset-0 size-full object-cover object-top"
        />
        <p v-else class="absolute inset-0 grid place-items-center p-8 text-display font-bold text-soft">{{ person.name.split(' ').map((w) => w[0]).join('') }}</p>
      </div>

      <article class="min-w-0 page-x py-14 lg:px-16 lg:py-20">
        <h1 data-rise class="text-title font-bold">{{ person.name }}</h1>
        <p data-rise style="--i: 1" class="mt-3 text-lead text-soft">{{ person.known_for_department }}</p>
        <p v-if="lifeLine" data-rise style="--i: 2" class="mt-6 max-w-[56ch]">{{ lifeLine }}</p>

        <section v-if="paragraphs.length" class="mt-12 max-w-[62ch]">
          <h2 class="text-lead font-semibold">Biography</h2>
          <div class="mt-3 space-y-4">
            <p v-for="(paragraph, index) in visibleParagraphs" :key="index">{{ paragraph }}</p>
          </div>
          <button v-if="paragraphs.length > 2" type="button" class="link mt-4 font-semibold" :aria-expanded="showFullBio" @click="showFullBio = !showFullBio">
            {{ showFullBio ? 'Show less' : 'Read the full biography' }}
          </button>
        </section>

        <section v-if="knownFor.length" class="mt-16">
          <h2 v-reveal class="text-lead font-semibold">Known for</h2>
          <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
            <PosterTile v-for="movie in knownFor" :key="movie.id" :movie="movie" sizes="(min-width: 1024px) 14vw, 45vw" />
          </div>
        </section>

        <section v-if="filmography.length" class="mt-20">
          <h2 v-reveal class="text-lead font-semibold">Filmography</h2>
          <p class="mt-1 text-small text-soft">{{ filmography.length }} films, newest first</p>
          <ol class="mt-6 space-y-3">
            <li v-for="row in filmography" :key="row.movie.id" class="grid grid-cols-[4rem_1fr] gap-4">
              <span class="text-soft tabular">{{ year(row.movie.release_date) || 'TBA' }}</span>
              <span>
                <RouterLink :to="`/movies/title/${row.movie.id}`" class="font-semibold hover:text-accent transition-colors">{{ row.movie.title }}</RouterLink>
                <span v-if="row.roles.length" class="block text-small text-soft">{{ row.roles.join(', ') }}</span>
              </span>
            </li>
          </ol>
        </section>
      </article>
    </div>

    <div v-else-if="loading" aria-busy="true" class="lg:grid lg:grid-cols-2">
      <div class="skeleton h-[60svh] lg:h-[calc(100svh-4rem)]"></div>
      <div class="page-x space-y-4 py-14 lg:px-16">
        <div class="skeleton h-12 w-2/3"></div>
        <div class="skeleton h-5 w-1/3"></div>
        <div class="skeleton mt-10 h-40"></div>
      </div>
      <span class="sr-only">Loading</span>
    </div>
  </div>
</template>
