<script setup>
import { computed } from 'vue'
import { StarIcon } from '@heroicons/vue/20/solid'
import { imageUrl, posterSrcset } from '@/api/tmdb'
import { rating, year } from '@/lib/format'
import WatchlistButton from './WatchlistButton.vue'

const props = defineProps({
  movie: { type: Object, required: true },
  /** First rows load eagerly so the largest image is not lazy */
  eager: { type: Boolean, default: false },
  sizes: { type: String, default: '(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 45vw' }
})

const releaseYear = computed(() => year(props.movie.release_date))
const score = computed(() => rating(props.movie.vote_average))
</script>

<template>
  <article class="group relative">
    <RouterLink :to="`/movies/title/${movie.id}`" class="block focus-visible:outline-offset-4">
      <div class="poster-zoom relative aspect-[2/3] overflow-hidden bg-surface">
        <img
          v-if="movie.poster_path"
          :src="imageUrl(movie.poster_path, 'w342')"
          :srcset="posterSrcset(movie.poster_path)"
          :sizes="sizes"
          :alt="`Poster for ${movie.title}`"
          width="342"
          height="513"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          class="size-full object-cover"
        />
        <div v-else class="flex size-full items-end p-4">
          <span class="text-lead font-semibold leading-tight">{{ movie.title }}</span>
        </div>
      </div>
      <h3 class="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-accent transition-colors duration-150">
        {{ movie.title }}
      </h3>
    </RouterLink>
    <p class="mt-1 flex items-center gap-3 text-small text-soft tabular">
      <span v-if="releaseYear">{{ releaseYear }}</span>
      <span v-if="score" class="inline-flex items-center gap-1">
        <StarIcon class="size-4 text-accent" aria-hidden="true" />
        <span><span class="sr-only">Rated </span>{{ score }}</span>
      </span>
    </p>
    <div class="absolute top-2 right-2 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 [&:has([aria-pressed=true])]:opacity-100">
      <WatchlistButton :movie="movie" />
    </div>
  </article>
</template>
