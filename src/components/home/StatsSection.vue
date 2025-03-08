<script>
//Import movies store
import { useMoviesStore } from "../../stores/movies";
import { useSeriesStore } from "../../stores/series";

import { onMounted } from 'vue'

export default {
  name: "StatsSection",
  setup() {
    const storeMovies = useMoviesStore();
    const storeSeries = useSeriesStore();

    const { fetchMoviesDiscover } = useMoviesStore();
    const { fetchSeriesDiscover } = useSeriesStore();

    onMounted(() => {
      // movies
      fetchMoviesDiscover();
      // series
      fetchSeriesDiscover();
    })

    return {
      storeMovies,
      storeSeries
    }
  },

  computed: {
    discoverMovies() { return this.storeMovies.getDiscover },
    discoverSeries() { return this.storeSeries.getDiscover }
  }
}
</script>
<template>
  <div class="bg-gray-50 dark:bg-gray-700 pt-12 sm:pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-gray-50 sm:text-4xl capitalize">Developed with the latest technologies</h2>
        <p class="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          The Movie APP is based on TMDb API a service that is free to use as long as is properly attributed
          as the source of the data and/or images.</p>
      </div>
    </div>
    <div class="mt-10 pb-12 bg-white dark:bg-gray-900 sm:pb-16">
      <div class="relative">
        <div class="absolute inset-0 h-1/2 bg-gray-50 dark:bg-gray-700" />
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl mx-auto">
            <dl class="rounded-lg bg-white dark:bg-gray-800 shadow-lg sm:grid sm:grid-cols-3">
              <div class="flex flex-col border-b border-gray-100 dark:border-gray-800 p-6 text-center sm:border-0 sm:border-r">
                <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Movies</dt>
                <dd class="order-1 text-5xl font-extrabold text-emerald-600 selection:bg-green-100">
                  {{ $filters.int_abbr(this.discoverMovies.total_results)}}
                </dd>
              </div>
              <div class="flex flex-col border-t border-b border-gray-100 dark:border-gray-900 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Series</dt>
                <dd class="order-1 text-5xl font-extrabold text-emerald-600 selection:bg-green-100">
                  {{ $filters.int_abbr(this.discoverSeries.total_results)}}
                </dd>
              </div>
              <div class="flex flex-col border-t border-gray-100 dark:border-gray-900 p-6 text-center sm:border-0 sm:border-l">
                <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Total Entrances</dt>
                <dd class="order-1 text-5xl font-extrabold text-emerald-600 selection:bg-green-100">{{ $filters.int_abbr(this.discoverMovies.total_results+ this.discoverSeries.total_results) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
