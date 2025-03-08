<template>
  <div class="bg-white dark:bg-gray-900 pb-8 sm:pb-12 lg:pb-12">
    <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
      <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
        <div>
          <div class="text-green-600">
            <FilmIcon class="h-11 w-11 w-auto" />
          </div>
          <div class="mt-20">
            <div>
              <a href="#" class="inline-flex space-x-4">
                <span class="rounded bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600 tracking-wide uppercase"> What's new </span>
                <span class="inline-flex items-center text-sm font-medium text-green-600 space-x-1">
                  <span>Just shipped version 0.1.0</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </a>
            </div>
            <div class="mt-6 sm:max-w-xl">
              <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-5xl">The Movie App that fits for anyone</h1>
              <p class="mt-6 text-xl text-gray-500 dark:text-gray-400">Vue Movies API is an application based on VueJS that collects information directly from an API.</p>
            </div>
            <form action="#" class="mt-12 sm:max-w-lg sm:w-full sm:flex">
              <div class="min-w-0 flex-1">
                <label for="hero-email" class="sr-only">Email address</label>
                <input id="hero-email" type="email" class="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-5 py-3 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="Enter your email" />
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-3">
                <button type="submit" class="block w-full rounded-md border border-transparent px-5 py-3 bg-green-600 text-base font-medium text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:px-10">Notify me</button>
              </div>
            </form>
            <div class="mt-6">
              <div class="inline-flex items-center divide-x divide-gray-300">
                <div class="flex-shrink-0 flex pr-5">
                  <StarIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <StarIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <StarIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <StarIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <StarIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div class="min-w-0 flex-1 pl-5 py-1 text-sm text-gray-500 sm:py-3"><span class="font-medium text-gray-900 dark:text-gray-100">Rated 5 stars</span> by over <span class="font-medium text-green-600">500 beta users</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
        <div class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div class="hidden sm:block">
            <div class="absolute inset-y-0 left-1/2 w-screen bg-slate-100 dark:bg-slate-800 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
            <svg class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0" width="404" height="392" fill="none" viewBox="0 0 404 392">
              <defs>
                <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
            </svg>
          </div>
          <div class="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
            <HeroIcon class="bg-gray-50 dark:bg-gray-800 w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"></HeroIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronRightIcon, StarIcon, FilmIcon } from '@heroicons/vue/outline'
import HeroIcon from './icons/HeroIcon.vue'

export default {
  components: {
    ChevronRightIcon,
    StarIcon,
    FilmIcon,
    HeroIcon
  },
}
</script>