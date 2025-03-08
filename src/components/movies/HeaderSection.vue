<template>
  <div class="bg-gray-800">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between">
      <div class="max-w-xl">
        <h2 class="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Movies</h2>
        <p class="mt-5 text-xl text-gray-400">There are millions of incredible movies waiting for you. <br> <span class="text-2xl text-emerald-600">Explore now</span></p>
      </div>
      <div class="mt-10 w-full max-w-xs">
        <label for="currency" class="block text-base font-medium text-gray-300">Language</label>
        <div class="mt-1.5 relative">
          <select v-model="this.language" @change="changeLanguage()" id="language-input" name="language-input" class="appearance-none block w-full bg-none bg-gray-700 border border-transparent rounded-md pl-3 pr-10 py-2 text-base text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white sm:text-sm">
            <option v-for="language in languages" :key="language.id" :value="language.id">{{ language.name }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 px-2 flex items-center">
            <ChevronDownIcon class="h-4 w-4 text-white" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronDownIcon } from '@heroicons/vue/solid'

export default {
  emits: ['changeLanguage'],
  props: {
    languages: {
      type: Array,
      required: true,
    }
  },
  components: {
    ChevronDownIcon,
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
    }
  },
}
</script>