<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
      <div class="space-y-12">
        <div class="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">Cast</h2>
        </div>
        <div class="no-scrollbar overflow-x-auto flex gap-8 w-full snap-mandatory snap-x">
          <div v-for="(actor) in this.cast" :key="actor.id"
               class="w-screen bg-gray-50 rounded-xl dark:bg-gray-800 rounded-md text-center">
            <div class="snap-center md:snap-align-none w-72">
              <img v-if="actor.profile_path" class="rounded-t-xl object-cover h-1/2 w-full" :src="'https://image.tmdb.org/t/p/w500' + actor.profile_path" alt="" />
              <img v-else class="rounded-t-xl object-cover h-full w-full " src="/images/image-not-found.png" alt="" />
              <div class="py-5 px-6 xl:px-10 xl:text-left space-y-2 xl:flex xl:items-center xl:justify-between">
                <div class="font-medium text-lg leading-6 space-y-1">
                  <h3 class="text-xl font-bold dark:text-white text-gray-800">{{ actor.original_name }}</h3>
                  <p class="text-emerald-600">{{ actor.character }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * VueJS
 */

export default {
  name: 'CastSection',
  props: {
    cast: {
      type: Object,
      required: true,
    },
    crew: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
        maxCast: 20,
      }
  },
  setup() {
  },
}
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
-ms-overflow-style: none;  /* IE and Edge */
scrollbar-width: none;  /* Firefox */
}
</style>