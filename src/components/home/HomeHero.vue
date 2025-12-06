<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useDocumentVisibility, usePreferredReducedMotion } from '@vueuse/core'
import { StarIcon } from '@heroicons/vue/20/solid'
import { imageUrl, backdropSrcset } from '@/api/tmdb'
import { rating, year } from '@/lib/format'
import { useTrending } from '@/composables/useCatalogue'
import { useSearchStore } from '@/stores/search'

const { movies } = useTrending()
const search = useSearchStore()
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

// This week's top four trending films become the stage, crossfading like light shifting in a room
const stage = computed(() => movies.value.filter((movie) => movie.backdrop_path).slice(0, 4))
const active = ref(0)
const current = computed(() => stage.value[active.value] || null)

const visibility = useDocumentVisibility()
const motion = usePreferredReducedMotion()
let timer = null

function stop() {
  clearInterval(timer)
  timer = null
}
function start() {
  stop()
  if (motion.value === 'reduce' || visibility.value === 'hidden' || stage.value.length < 2) return
  timer = setInterval(() => { active.value = (active.value + 1) % stage.value.length }, 6000)
}

watch([visibility, motion, () => stage.value.length], start, { immediate: true })
onBeforeUnmount(stop)
</script>

<template>
  <section aria-labelledby="hero-title" class="grid gap-3 p-3 lg:h-[calc(100svh-4rem)] lg:min-h-[600px] lg:grid-cols-2">
    <div class="flex flex-col items-center justify-center bg-paper px-6 py-16 text-center sm:px-12 lg:order-first">
      <h1 id="hero-title" class="lines text-display font-bold text-accent">
        <span class="line"><span data-line style="--i: 0">Find your</span></span>
        <span class="line"><span data-line style="--i: 1">next film</span></span>
      </h1>
      <p data-rise style="--i: 2" class="mt-8 max-w-[40ch] text-lead text-ink">
        Search, filter and save from the full TMDb catalogue, with trailers a click away, in twelve languages.
      </p>
      <div data-rise style="--i: 3" class="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto">
        <RouterLink to="/movies" class="btn btn-primary w-full px-8 sm:w-auto">Browse films</RouterLink>
        <button type="button" class="min-h-12 text-soft hover:text-accent transition-colors" @click="search.open = true">
          or press <kbd class="font-sans font-semibold text-ink">{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd> to search from any page
        </button>
      </div>
    </div>

    <div class="relative order-first h-[56svh] overflow-hidden bg-surface-2 lg:h-auto">
      <img
        v-for="(movie, index) in stage"
        :key="movie.id"
        :src="imageUrl(movie.backdrop_path, 'w1280')"
        :srcset="backdropSrcset(movie.backdrop_path)"
        sizes="(min-width: 1024px) 50vw, 100vw"
        :alt="index === active ? `Still from ${movie.title}` : ''"
        :aria-hidden="index !== active"
        width="1280"
        height="720"
        :fetchpriority="index === 0 ? 'high' : 'low'"
        :loading="index === 0 ? 'eager' : 'lazy'"
        class="drift absolute inset-0 size-full object-cover transition-opacity duration-[1600ms] ease-[var(--ease-in-out)]"
        :class="index === active ? 'opacity-100' : 'opacity-0'"
      />
      <RouterLink
        v-if="current"
        :to="`/movies/title/${current.id}`"
        class="absolute inset-x-0 bottom-0 flex h-14 items-center justify-between gap-4 bg-paper px-5 text-small transition-colors hover:text-accent"
        aria-live="polite"
      >
        <span class="truncate"><span class="text-soft">Trending this week:</span> <span class="font-semibold">{{ current.title }}</span></span>
        <span class="flex shrink-0 items-center gap-1 tabular">
          <StarIcon class="size-4 text-accent" aria-hidden="true" />{{ rating(current.vote_average) }}<span class="ml-2 text-soft">{{ year(current.release_date) }}</span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>
