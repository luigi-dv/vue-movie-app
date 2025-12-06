<script setup>
import { computed, ref, watch } from 'vue'
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'
import { imageUrl } from '@/api/tmdb'
import { languages } from '@/lib/languages'
import { useList } from '@/composables/useCatalogue'

const total = languages.length
const { movies } = useList('movie/popular')
const still = computed(() => movies.value.find((movie) => movie.backdrop_path) || null)

// The language figure counts up once, the first time the mosaic is seen
const target = ref(null)
// null until the count-up starts, so the real figure shows without script timing
const shown = ref(null)
const seen = ref(false)
const motion = usePreferredReducedMotion()
useIntersectionObserver(target, ([entry]) => { if (entry?.isIntersecting) seen.value = true }, { threshold: 0.01 })

watch(seen, (isSeen) => {
  const value = total
  if (!isSeen) return
  if (motion.value === 'reduce') {
    shown.value = value
    return
  }
  const start = performance.now()
  const step = (now) => {
    const progress = Math.min((now - start) / 1400, 1)
    shown.value = Math.round(value * (1 - Math.pow(1 - progress, 4)))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})
</script>

<template>
  <section ref="target" aria-labelledby="numbers-title" class="pb-28 lg:pb-44">
    <h2 id="numbers-title" v-reveal class="page-x mb-10 text-title font-bold">The catalogue today</h2>
    <div class="grid lg:h-[min(60vw,860px)] lg:grid-cols-3">
      <div class="relative aspect-[4/3] overflow-hidden bg-surface lg:col-span-2 lg:aspect-auto">
        <img
          v-if="still"
          :src="imageUrl(still.backdrop_path, 'w1280')"
          :alt="`Still from ${still.title}`"
          width="1280"
          height="720"
          loading="lazy"
          class="drift absolute inset-0 size-full object-cover"
        />
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-1">
        <div class="aspect-square bg-field p-5 text-on-field sm:p-7 lg:aspect-auto">
          <p class="text-display font-bold tabular">{{ shown ?? total }}</p>
          <p class="mt-3 text-small sm:text-body">languages for titles,<br />overviews and posters</p>
        </div>
        <div class="aspect-square bg-accent p-5 text-on-accent sm:p-7 lg:aspect-auto">
          <p class="text-display font-bold tabular">0</p>
          <p class="mt-3 text-small sm:text-body">API keys shipped<br />to your browser</p>
        </div>
      </div>
    </div>
  </section>
</template>
