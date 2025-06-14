<template>
  <nav class="border-t border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    <div class="-mt-px w-0 flex-1 flex">
      <router-link @click="this.changePage(previousPage)"
          v-if="1 < currentPage" :to="'?page=' + previousPage" class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
        <ArrowNarrowLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        Previous
      </router-link>
    </div>
    <div class="hidden md:-mt-px md:flex">
      <router-link @click="this.changePage(1)"
          v-if="currentPage !== 1"
          :key="'page-' + 1"
          :to="'?page=1'"
          class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
        First
      </router-link>
      <!--Dots-->
      <span v-if="currentPage > 3" class="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"> ... </span>
      <!--Previous Page-->
      <router-link
          @click="this.changePage(previousPage)"
          v-if="(currentPage > 2 && previousPage !== totalPrevious && this.totalPages > 3)"
          :key="'page-' + previousPage"
          :to="'?page=' + previousPage"
          class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
        {{ previousPage }}
      </router-link>
      <!--Current Page-->
      <router-link
          @click="this.changePage(currentPage)"
          v-if="this.currentPage !== this.totalPages"
         :key="'page-' + currentPage"
         :to="'?page=' + currentPage"
         class="border-emerald-500 text-emerald-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
        {{ currentPage }}
      </router-link>
      <!--Next Page-->
      <router-link
          @click="this.changePage(nextPage)"
          v-if="this.nextPage < totalPages"
          :key="'page-' + this.nextPage"
          :to="'?page=' + this.nextPage"
          class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
        {{ nextPage }}
      </router-link>
      <!--Dots-->
      <span v-if="(totalPages - currentPage) >= 3" class="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"> ... </span>
      <!--Previous Second Last Page-->
      <router-link
          @click="this.changePage(this.totalPrevious - 1)"
          v-if="(totalPrevious !== this.currentPage && (totalPages - currentPage) < 2) && this.totalPages > 3"
          :key="'page-' + (this.totalPrevious - 1)"
          :to="'?page=' + (this.totalPrevious - 1)"
          class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
        {{ totalPrevious - 1 }}
      </router-link>
      <!--Previous Last Page-->
      <router-link
          @click="this.changePage(this.totalPrevious)"
          v-if="(totalPrevious !== this.currentPage && (totalPages - currentPage) > 4) || this.currentPage === this.totalPages"
          :key="'page-' + this.totalPrevious"
          :to="'?page=' + this.totalPrevious"
          class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
        {{ totalPrevious }}
      </router-link>
      <!--Last Page-->
      <router-link
          @click="this.changePage(totalPages)"
          :key="'page-' + totalPages"
          :to="'?page=' + totalPages"
          :class="{
            'border-emerald-500 text-emerald-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium': this.checkIfLastPage(),
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium': !this.checkIfLastPage()
           }">
       Last
      </router-link>
    </div>
    <div class="-mt-px w-0 flex-1 flex justify-end">
      <router-link
          @click="this.changePage(currentPage + 1)"
          v-if="currentPage < totalPages" :to="'?page=' + this.nextPage" class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
        Next
        <ArrowNarrowRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
      </router-link>
    </div>
  </nav>
</template>

<script>
import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/vue/solid'
export default {
  emits: ['changePage'],
  props: {
    currentPage: {
      required: true
    },
    totalPages: {
      required: true
    }
  },
  data() {
    return {
      page: '',
    }
  },
  name: 'PaginationCentered',
  components: {
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
  },
  methods: {
    changePage(page) {
      this.$emit('changePage', page)
    },
    checkIfLastPage()
    {
      return this.currentPage === this.totalPages;
    }
  },
  computed: {
    nextPage() {
      return parseInt(this.currentPage) + 1;
    },
    previousPage() {
      return parseInt(this.currentPage) - 1;
    },
    totalPrevious() {
      return parseInt(this.totalPages) - 1;
    }
  }
}
</script>