<script>
//Import movies store
import { useMoviesStore } from "../../stores/movies";
import { useSeriesStore } from "../../stores/series";


import { ref, onMounted } from 'vue'
import {
  Dialog,
  DialogOverlay,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { MenuIcon, SearchIcon, XIcon, FilmIcon } from '@heroicons/vue/outline'

export default {
  emits: ['openCommandPalette'],
  components: {
    Dialog,
    DialogOverlay,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    TransitionChild,
    TransitionRoot,
    MenuIcon,
    SearchIcon,
    XIcon,
    FilmIcon
  },
  setup() {
    const storeMovies = useMoviesStore();
    const storeSeries = useSeriesStore();

    const { fetchMoviesGenres, fetchTrendingMovieWeek, fetchMoviesLatest } = useMoviesStore();
    const { fetchSeriesGenres, fetchTrendingSeriesWeek } = useSeriesStore();
    const open = ref(false)
    onMounted(() => {
      // movies
      fetchMoviesGenres();
      fetchMoviesLatest();
      fetchTrendingMovieWeek();
      // series
      fetchSeriesGenres();
      fetchTrendingSeriesWeek();
    })

    return {
      open,
      storeMovies,
      storeSeries
    }
  },
  computed: {
    navigation() {
      return  {
        categories: [
          {
            id: 'movies',
            name: 'Movies',
            featured: this.storeMovies.getTrending,
            sections: [
              {
                id: '/movies',
                name: 'Links',
                items: [
                  { name: 'All Movies', id: '' },
                  { name: 'Popular', id: '/popular' },
                  { name: 'Now Playing', id: '/now-playing' },
                  { name: 'Upcoming', id: '/upcoming' },
                  { name: 'Top Rated', id: '/top-rated' },
                ],
              },
              {
                id: '/movies/genres/',
                name: 'Genres',
                items: this.storeMovies.getGenres
              },

            ],
          },
          {
            id: 'series',
            name: 'Series',
            featured: this.storeSeries.getTrending,
            sections: [
              {
                id: '/series/',
                name: 'Links',
                items: [
                  { name: 'All Series', id: '' },
                  { name: 'Popular', id: 'popular' },
                  { name: 'Now Playing', id: 'now-playing' },
                  { name: 'Upcoming', id: 'upcoming' },
                  { name: 'Top Rated', id: 'top-rated' },
                ],
              },
              {
                id: '/series/genres/',
                name: 'Genres',
                items: this.storeSeries.getGenres,
              },
            ],
          },
        ],
        pages: [
          { name: 'About', href: '/about' },
        ],
        latestMovie: this.storeMovies.getLatest,
      }
    },
  },
}

</script>
<template>
  <div class="lg:relative z-20 bg-white dark:bg-gray-900">
    <!-- Mobile menu -->
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="fixed inset-0 flex z-40 lg:hidden" @close="open = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
          <div class="relative max-w-xs w-full bg-white dark:bg-gray-900 shadow-xl pb-12 flex flex-col overflow-y-auto">
            <div class="px-4 pt-5 pb-2 flex">
              <button type="button" class="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400" @click="open = false">
                <span class="sr-only">Close menu</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Links -->
            <TabGroup as="div" class="mt-2">
              <div class="border-b border-gray-200 dark:border-gray-700">
                <TabList class="-mb-px flex px-4 space-x-8">
                  <Tab as="template" v-for="category in navigation.categories" :key="category.name" v-slot="{ selected }">
                    <button :class="[selected ? 'text-emerald-600 border-emerald-600' : 'text-gray-900 dark:text-gray-200 border-transparent', 'flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium']">
                      {{ category.name }}
                    </button>
                  </Tab>
                </TabList>
              </div>
              <TabPanels as="template">
                <TabPanel v-for="category in navigation.categories" :key="category.name" class="pt-10 pb-8 px-4 space-y-10">
                  <div class="grid grid-cols-2 gap-x-4">
                    <div v-for="(item,index) in category.featured" :key="item.id" class="group relative text-sm">
                      <div v-if="index <= 1">
                        <div class="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                          <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" :alt="item.title" class="object-center object-cover" />
                        </div>
                        <router-link @click="open = false " :to="'/' + category.id + '/' + item.id" class="mt-6 block font-medium text-gray-900 dark:text-gray-200">
                          <span class="absolute z-10 inset-0" aria-hidden="true" />
                          {{ item.title }}
                        </router-link>
                        <p aria-hidden="true" class="mt-1 text-gray-500">Watch</p>
                      </div>
                    </div>
                  </div>
                  <div v-for="section in category.sections" :key="section.name">
                    <p :id="`${category.id}-${section.id}-heading-mobile`" class="font-medium text-gray-900 dark:text-gray-200">
                      {{ section.name }}
                    </p>
                    <ul role="list" :aria-labelledby="`${category.id}-${section.id}-heading-mobile`" class="mt-6 flex flex-col space-y-6">
                      <li v-for="item in section.items" :key="item.name" class="flow-root">
                        <router-link @click="open = false " :to="section.id + item.id" class="-m-2 p-2 block text-gray-500 dark:text-gray-400">
                          {{ item.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>

            <div class="border-t border-gray-200 dark:border-gray-700 py-6 px-4 space-y-6">
              <div v-for="page in navigation.pages" :key="page.name" class="flow-root">
                <router-link @click="open = false " :to="page.href" class="-m-2 p-2 block font-medium text-gray-900 dark:text-gray-200">{{ page.name }}</router-link>
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>

    <header class="relative bg-gray-50 dark:bg-gray-800">
      <p class="bg-emerald-600 h-10 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
        Our latest movie -
        <router-link class="text-sm font-bold ml-2 " :to="'/movies/' + navigation.latestMovie.id">{{ $filters.str_limit(navigation.latestMovie.title,20) }}</router-link>
      </p>

      <nav aria-label="Top" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <div class="h-16 flex items-center">
            <button type="button" class="bg-white dark:bg-gray-800 p-2 rounded-md text-gray-400 dark:text-gray-100 lg:hidden" @click="open = !open">
              <span class="sr-only">Open menu</span>
              <MenuIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Logo -->
            <div class="ml-4 flex lg:ml-0">
              <router-link to="/">
                <span class="sr-only">Movies API</span>
                <FilmIcon class="h-8 w-8 w-auto text-emerald-600" />
              </router-link>
            </div>

            <!-- Flyout menus -->
            <PopoverGroup class="hidden lg:ml-8 lg:block lg:self-stretch">
              <div class="h-full flex space-x-8 text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-400">
                <Popover v-for="category in navigation.categories" :key="category.name" class="flex" v-slot="{ open }">
                  <div class="relative flex">
                    <PopoverButton :class="[open ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-400', 'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px']">
                      {{ category.name }}
                    </PopoverButton>
                  </div>

                  <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <PopoverPanel class="absolute top-full inset-x-0 text-sm text-gray-500" v-slot="{ close }">
                      <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
                      <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                      <div class="relative bg-gray-100 dark:bg-gray-800">
                        <div class="max-w-7xl mx-auto px-8">
                          <div class="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                            <div class="col-start-2 grid grid-cols-2 gap-x-8">
                              <div v-for="(item,index) in category.featured" :key="item.id" class="group relative text-sm">
                                <div v-if="index <= 1">
                                  <div class="aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                                    <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" :alt="item.title" class="object-contain" />
                                  </div>
                                  <router-link @click="close" :to="'/movies/' + item.id" class="mt-6 block font-medium text-gray-900 dark:text-gray-200">
                                    <span class="absolute z-10 inset-0" aria-hidden="true" />
                                    {{ item.title }}
                                  </router-link>
                                  <p aria-hidden="true" class="mt-1 text-gray-500">Watch</p>
                                </div>
                              </div>
                            </div>
                            <div class="row-start-1 grid grid-cols-1 gap-y-10 gap-x-8 text-sm">
                              <div v-for="section in category.sections" :key="section.name">
                                <p id="`${section.name}-heading`" class="text-xl font-medium text-gray-900 dark:text-gray-200">
                                  {{ section.name }}
                                </p>
                                <ul role="list" :aria-labelledby="`${section.name}-heading`" class="grid grid-rows-5 grid-flow-col ">
                                  <li v-for="item in section.items" :key="item.name" class="py-2">
                                    <router-link @click="close" :to="section.id + item.id" class="text-gray-900 dark:text-gray-200 hover:text-gray-500">
                                      {{ item.name }}
                                    </router-link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverPanel>
                  </transition>
                </Popover>
                <router-link active-class="text-emerald-600 hover:text-emerald-700" v-for="page in navigation.pages" :key="page.name" :to="page.href" class="flex items-center text-sm font-medium">{{ page.name }}</router-link>
              </div>
            </PopoverGroup>

            <div class="ml-auto flex items-center">
              <!-- Search -->
              <div class="flex lg:ml-6">
                <a @click="$emit('openCommandPalette')" class="p-2 text-gray-400 hover:text-emerald-600 cursor-pointer">
                  <span class="sr-only">Search</span>
                  <SearchIcon class="w-6 h-6" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>
