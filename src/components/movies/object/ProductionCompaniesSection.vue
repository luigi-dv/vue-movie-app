<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
    <h2 class="dark:text-gray-200 text-gray-800 text-2xl font-medium capitalize tracking-wide">Production Companies</h2>
    <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 place-content-center">
      <a v-for="company in productionCompanies" :key="company.name" class="hover:bg-emerald-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-5 col-span-1 flex shadow-sm rounded-md">
        <img v-if="company.logo_path" :src="'https://image.tmdb.org/t/p/original'+ company.logo_path" class="h-48 w-48 object-center object-contain">
        <div class="h-full w-full object-contain text-4xl flex items-center justify-center text-center text-gray-800 dark:text-white font-extralight" v-else>
          {{company.name}}
        </div>
      </a>
    </ul>
  </div>
</template>

<script>
import { DotsVerticalIcon } from '@heroicons/vue/solid'

const projects = [
  { name: 'Graph API', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' },
  { name: 'Component Design', initials: 'CD', href: '#', members: 12, bgColor: 'bg-purple-600' },
  { name: 'Templates', initials: 'T', href: '#', members: 16, bgColor: 'bg-yellow-500' },
  { name: 'React Components', initials: 'RC', href: '#', members: 8, bgColor: 'bg-green-500' },
]

export default {
  name: 'ProductionCompaniesSection',
  props: {
    productionCompanies: {
      type: Object,
      required: true
    }
  },
  components: {
    DotsVerticalIcon,
  },
  setup() {
    return {
      projects,
    }
  },
}
</script>