<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div :style="mainStyle" class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
    <div class="backdrop-blur-xl backdrop-brightness-50 px-4 py-5 sm:p-6">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 lg:flex lg:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-3xl font-semibold leading-7 text-gray-100 sm:text-6xl">
            {{ movie.title }}
          </h2>
          <div class="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div class="mt-2 flex items-center text-sm text-white">
              <CalendarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              {{ new Date(movie.release_date).toDateString() }}
            </div>
            <div class="mt-2 flex items-center text-sm text-white">
              <ClockIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              {{ getDuration(movie.runtime) }}
            </div>
            <div class="mt-2 flex items-center text-sm text-white">
              <CurrencyDollarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              ${{ convertBudget(movie.budget,3)}}
            </div>
          </div>
        </div>
        <div class="mt-12 flex gap-8 justify-end lg:mt-0 lg:ml-4">
          <div class="-mt-7 w-full max-w-xs">
            <label for="language" class="block text-base font-medium text-white">Language</label>
            <div class="mt-1.5 relative">
              <select v-model="this.language" @change="changeLanguage()" id="language-input" name="language-input"
                      class="appearance-none block w-full bg-none bg-white dark:bg-gray-800 border
                  border-transparent rounded-md pl-3 pr-10 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-1
                  focus:ring-gray-300 focus:border-gray-300 dark:focus:ring-white dark:focus:border-white sm:text-sm">
                <option v-for="language in languages" :key="language.id" :value="language.id">{{ language.name }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 px-2 flex items-center">
                <ChevronDownIcon class="h-4 w-4 text-gray-900 dark:text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
          <span class="sm:ml-3">
            <button :title="'Vote average ' + movie.vote_average" type="button" class="inline-flex items-center px-3 py-2 h-10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <StarIcon class="-ml-1 mr-2 h-5 w-5 text-yellow-400" aria-hidden="true" />
              {{ movie.vote_average }}
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="backdrop-blur px-4 py-4 sm:px-6 backdrop-brightness-50">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 grid grid-cols-12 gap-8">
          <div class="flex w-full justify-center items-center col-span-12 lg:col-span-3">
            <div class="top-6 divide-y divide-gray-300">
              <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.original_title"
                   class="self-center w-full h-full object-center object-cover rounded-lg shadow-2xl" />
              <img v-else src="/images/image-not-found.png">
            </div>
          </div>
          <main class="col-span-12 lg:col-span-9 flex justify-center items-center text-gray-100">
            <section class="header poster">
              <div class="title ott_true" dir="auto">
                <h2 class="text-4xl">
                  <router-link :to="'/movies/title/'+movie.id">{{ movie.title }}</router-link>
                </h2>
                <h3 class="mt-2 text-xl">
                  Original - <span class="italic font-semibold">{{ movie.original_title }}</span>
                </h3>
                <h4 class="mt-1 italic text-gray-200" dir="auto">
                  {{ movie.tagline }}
                </h4>
                <div class="mt-5 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div class="col-span-2 md:col-span-1">
                    <span class="rounded-md px-3 py-2"
                        :class="{ 'bg-gray-900' :movie.status === 'Rumored',
                                  'bg-indigo-600': movie.status === 'Planned',
                                 'bg-yellow-600': movie.status === 'In Production',
                                  'bg-blue-600': movie.status === 'Post Production',
                                 'bg-emerald-600': movie.status === 'Released',
                                 'bg-red-600': movie.status === 'Canceled'}">
                      {{ movie.status }}
                    </span>

                  </div>
                    <span class="release">
                       {{ new Date(movie.release_date).toLocaleDateString() }} (US)
                    </span>
                    <span class="runtime">Duration: <span class="font-bold">{{ getDuration(movie.runtime) }}</span></span>
                    <span class="col-span-2 md:col-span-1 genres">
                      <router-link :to="'/movies/genres/'+ item.id" v-for="(item,index) in movie.genres" :key="item.id"
                      class="font-semibold text-white-500 hover:text-emerald-600">
                        {{ item.name }}<span class="font-medium text-gray-200" v-if="movie.genres[index] !== movie.genres[movie.genres.length - 1]">,&nbsp;</span>
                      </router-link>
                    </span>
                </div>
              </div>
            <div class="mt-5">
              <ul class="flex items-center gap-4">
                <PlayIcon class="h-12 w-12"></PlayIcon>
                <li class="video none">
                  <a class="no_click play_trailer" href="#" data-site="YouTube" data-id="l-LD16Yzi2c" data-title="Play Trailer"><span class="glyphicons_v2 play"></span> Play Trailer</a>
                </li>
              </ul>

              <div class="mt-5">
                <h2 class="text-xl mt-4 font-bold">Overview</h2>
                <div class="mt-1" dir="auto">
                  <p>{{ movie.overview}}</p>
                </div>
              </div>
            </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

</script>

<script>
import {
  CalendarIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  PlayIcon,
} from '@heroicons/vue/solid'

export default {
  name: 'ObjectHeaderSection',
  emits: ['changeLanguage'],
  props: {
    languages: {
      type: Array,
      required: true,
    },
    movie: {
      type: Object,
      required: true,
    },
  },
  components: {
    CalendarIcon,
    StarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChevronDownIcon,
    PlayIcon
  },
  setup() {
  },
  data() {
    return {
      language: ''
    }
  },
  mounted() {
    this.language = this.languages[0].id
  },
  methods: {
    changeLanguage() {
      this.$emit('changeLanguage', this.language)
    },
    getDuration(n)
    {
        let hours = (n / 60);
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        return + rhours + "h " + rminutes + "m";
    },
    convertBudget(num,digits)
    {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    },
  },
  computed: {
    mainStyle() {
      if(this.movie.backdrop_path){
        return {
          "background-image": "url('https://image.tmdb.org/t/p/original/" + this.movie.backdrop_path +"')",
          "background-size": "cover",
          "background-attachment": "fixed",
        };
      }else {
        return {
          "background-color": "#374151",
          "background-size": "cover",
          "background-attachment": "fixed",
        };
      }
    }
  }
}
</script>