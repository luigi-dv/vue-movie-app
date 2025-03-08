<script>
export default {
  props: ['movies'],
  name: "MoviesSection",
}
</script>
<template>
  <div class="max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 md:shadow-2xl md:border md:border-t-0 md:border-b-0 border-gray-200 dark:border-gray-700">
    <div class="py-12 px-4 sm:py-24 sm:px-6 lg:px-8 ">
      <h2 class="sr-only">Movies</h2>
      <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 cxl:gap-x-8">
        <router-link v-for="movie in movies.results" :key="movie.id" :to="'/movies/' + movie.id" class="group">
          <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
            <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.original_title" class="w-full h-full object-center object-cover group-hover:opacity-75" />
            <img v-else src="../../assets/images/image-not-found.png">
          </div>
          <h3 class="mt-4 text-regular italic text-gray-700 dark:text-gray-200">
            {{ movie.original_title }}
          </h3>
          <p class="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-600">
            {{ movie.title }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>