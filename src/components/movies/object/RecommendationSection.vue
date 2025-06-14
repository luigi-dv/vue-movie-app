<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
      <div class="space-y-5">
        <div class="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
          <h2 class="text-xl font-extrabold text-emerald-600 dark:text-emerald-500 tracking-tight sm:text-2xl">Recommendation</h2>
        </div>
        <div class="h-96 no-scrollbar overflow-x-auto flex gap-8 w-full snap-mandatory snap-x">
          <div v-for="movie in this.similarMovies.results" :key="movie.id"
               class="w-screen rounded-2xl rounded-md text-center">
            <div class="snap-center md:snap-align-none w-72">
              <router-link :to="'/movies/title/'+movie.id">
                <img v-if="movie.poster_path" class="h-96 rounded-2xl object-center object-cover h-full w-full"
                     :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="" />
                <img v-else class="rounded-2xl object-cover h-1/2 w-full " src="/images/image-not-found.png" alt="" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendationSection",
  props: {
    similarMovies: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>