<script setup>
import { useSearchStore } from '@/stores/search'
import { usePageTitle } from '@/composables/usePageTitle'

const search = useSearchStore()
usePageTitle('Page not found')
</script>

<template>
  <section class="page-x flex min-h-[70svh] flex-col justify-center py-24">
    <h1 class="lines text-display font-bold">
      <span class="line"><span data-line style="--i: 0">This reel</span></span>
      <span class="line"><span data-line style="--i: 1">is missing</span></span>
    </h1>
    <p data-rise style="--i: 2" class="mt-8 max-w-[44ch] text-lead">The page you asked for is not here. It may have moved, or the link was mistyped.</p>
    <div data-rise style="--i: 3" class="mt-10 flex flex-wrap gap-3">
      <RouterLink to="/movies" class="btn btn-primary">Browse films</RouterLink>
      <button type="button" class="btn btn-quiet" @click="search.open = true">Search instead</button>
    </div>
  </section>
</template>
