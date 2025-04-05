<script>
/**
 * Components
 * -Header
 * -Filters
 * -Movies
 * -Pagination
 */

  import HeaderSection from '@/components/movies/HeaderSection.vue'
  import FilterSection from "@/components/movies/filters/FilterSection.vue"
  import MoviesSection from '@/components/movies/MoviesSection.vue'
  import PaginationCentered from "@/components/navigation/PaginationCentered.vue";


/**
 * Vue Router
 */
  import { useRoute } from 'vue-router'
/**
 * Stores
 *  Movie [Main Store in View]
 */
  import { useMoviesStore } from "../stores/movies";

/**
 * Pinia MapActions
 */
  import { mapActions } from "pinia/dist/pinia";

/**
 * VueJS
 */
  import { onMounted } from 'vue'

/**
 * Const Languages [Default Languages in APP]
 * @type array
 */
  const languages = [
    {
      id: 'en-US',
      name: "English (US)",
    },
    {
      id: 'en-UK',
      name: "English (UK)",
    },
    {
      id: 'es-ES',
      name: "Español (España)",
    },
    {
      id: 'es-MX',
      name: "Español (Latinoamérica)",
    },
    {
      id: 'zh-CHS',
      name: "Chinese (Simplified)",
    },
    {
      id: 'pt-PT',
      name: "Portuguese (Portugal)",
    },
    {
      id: 'pt-BR',
      name: "Portuguese (Brasil)",
    },
    {
      id: 'de-DE',
      name: "Deutsch (Deutschland)",
    },
    {
      id: 'it-IT',
      name: "Italian",
    },
    {
      id: 'he-IL',
      name: "Hebrew",
    },
    {
      id: 'ru-RU',
      name: "Russian",
    },
    {
      id:'ar',
      name: "Arabic"
    }

  ]
/**
 * FetchMovieQuery [Default Query]
 * @type array
 */
  const fetchMovieQuery = {
      language : languages[0].id,
      order: 'desc',
      sortBy: 'popularity',
      page: 1,
      search: '',
  };
/**
 * SortByItems Array TMDB
 * @type array
 */
  const sortByItems = [
    { id: 'popularity', name: 'Popularity'},
    { id: 'release_date', name: 'Release Date'},
    { id: 'revenue', name: 'Revenue'},
    { id: 'primary_release_date', name: 'Primary Release Date'},
    { id: 'original_title', name: 'Original Title'},
    { id: 'vote_average', name: 'Vote Average'},
    { id: 'vote_count', name: 'Vote Count'}
  ];
/**
 * Order Array TMDB
 * @type array
 */
  const orderItems = [
    { id: 'desc', name: 'DESC' },
    { id: 'asc', name: 'ASC' },
  ];

/**
 * MoviesView
 */
export default {
  components: { HeaderSection, MoviesSection, FilterSection, PaginationCentered },
  name: "MoviesView",
  data () {
    return {
      language: fetchMovieQuery.language,
      order: fetchMovieQuery.order,
      sortBy: fetchMovieQuery.sortBy,
      page:  fetchMovieQuery.page,
      search: fetchMovieQuery.search,
    }
  },
  setup() {
    const storeMovies = useMoviesStore();
    const route = useRoute();

    const { fetchMoviesDiscover } = useMoviesStore();

    onMounted(() => {
      if(route.query.page){
        fetchMovieQuery.page = route.query.page;
      }
      else{
        if(route.query.page === ''){
          fetchMovieQuery.page = 1
        }
        else{
          fetchMovieQuery.page = 1
        }
      }
      // Movies (language, sortBy, Order, Page)
      fetchMoviesDiscover(fetchMovieQuery.language, fetchMovieQuery.sortBy, fetchMovieQuery.order, fetchMovieQuery.page);
    })

    return {
      storeMovies,
      route,
      languages,
      fetchMovieQuery,
      sortByItems,
      orderItems,
    }
  },
  methods: {
    ...mapActions(useMoviesStore, ['fetchMoviesDiscover']),

    changeLanguage(value) {
      this.language = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page);
    },
    changeOrder(value) {
      this.order = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page);
    },
    changeSortBy(value) {
      this.sortBy = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page);
    },
    changeSearch(value) {
      this.search = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page);
    },
    changePage() {
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page);
    },
    getTotalPages()
    {
      if(this.movies.total_pages > 500)
      {
        return 500;
      }
      else{
        return this.movies.total_pages;
      }
    },
    getCurrentPage() {
      return parseInt(fetchMovieQuery.page);
    }
  },
  computed: {
    movies() { return this.storeMovies.getDiscover },
  },
}
</script>

<template>
  <main>
    <HeaderSection :languages="this.languages" @changeLanguage="changeLanguage" />
    <FilterSection :orderItems="this.orderItems" :sortByItems="this.sortByItems" @changeSortBy="changeSortBy" @changeOrder="changeOrder"
                   @changeSearch="changeSearch" />
    <MoviesSection :movies="this.movies"/>
    <PaginationCentered :currentPage="this.getCurrentPage()"
                        :totalPages="this.getTotalPages()"
      @changePage="changePage"
    />
  </main>

</template>
