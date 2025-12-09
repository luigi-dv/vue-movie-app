<script setup>
import PosterTile from './PosterTile.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

defineProps({
  movies: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: [Error, Object], default: null },
  skeletons: { type: Number, default: 12 }
})
defineEmits(['retry'])
</script>

<template>
  <ErrorState v-if="error" :error="error" @retry="$emit('retry')" />
  <div v-else :aria-busy="loading" class="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    <template v-if="loading && !movies.length">
      <div v-for="n in skeletons" :key="n" aria-hidden="true">
        <div class="skeleton aspect-[2/3]"></div>
        <div class="skeleton mt-3 h-4 w-3/4"></div>
        <div class="skeleton mt-2 h-3 w-1/3"></div>
      </div>
      <span class="sr-only">Loading films</span>
    </template>
    <PosterTile
      v-for="(movie, index) in movies"
      v-else
      :key="movie.id"
      :movie="movie"
      :eager="index < 6"
      :class="loading && 'opacity-50 transition-opacity'"
    />
  </div>
</template>
