<script>

export default {
  props: {
    orderItems: {
      type: Object,
      required: true
    },
    sortByItems: {
      type: Object,
      required: true
    }
  },
  name: 'FilterSection',
  data () {
    return {
      sortByFilter: '',
      orderFilter: '',
      searchFilter: '',
    }
  },
  methods: {
    changeSortBy() {
      this.$emit('changeSortBy', this.sortByFilter)
    },
    changeOrder() {
      this.$emit('changeOrder', this.orderFilter)
    },
    changeSearch() {
      this.$emit('changeSearch', this.searchFilter)
    },
  },
  mounted () {
    this.sortByFilter = this.sortByItems[0].id;
    this.orderFilter = this.orderItems[0].id;
    let keysPressed = {};
    window.addEventListener('keydown', (e) => {
      keysPressed[e.key] = true;
      if (keysPressed['Meta'] && e.key === 'k' ) {
        this.$refs.search.focus()
      }
    });
    document.addEventListener('keyup', (e) => {
      delete keysPressed[e.key];
    });
  },

}
</script>
<template>
  <div class="max-w-2xl mx-auto py-5 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8 md:shadow-md">
    <h1 class="py-2 text-xl text-gray-800 dark:text-gray-200">Filters</h1>
    <div class="w-full grid grid-cols-1 md:grid-cols-4 gap-4 ">
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Order By</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <select @change="changeSortBy()" v-model="sortByFilter" id="sort-by" name="sort-by" ref="sort-by" class="dark:bg-gray-800 dark:text-gray-300 focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-12 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md">
            <option v-for="item in sortByItems" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="currency" class="sr-only">Order</label>
            <select @change="changeOrder()" v-model="orderFilter" id="order" name="order" class="focus:ring-emerald-500 focus:border-emerald-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 dark:text-gray-300 sm:text-sm rounded-md">
              <option v-for="item in orderItems" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
        </div>
      </div>
      <!--Search-->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Quick search</label>
        <div class="mt-1 relative flex items-center">
          <input @keyup.enter="changeSearch()" v-model="searchFilter" ref="search" type="text" name="search" id="search" class="dark:bg-gray-800 dark:placeholder:text-gray-200 dark:text-gray-200
          shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-12 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md placeholder:text-gray-300 dark:placeholder:text-gray-600" placeholder="Search" />
          <div class="hidden md:block absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd class="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400"> ⌘K </kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>