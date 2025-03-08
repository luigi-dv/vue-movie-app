<script>
  //Components
  import HeaderSection from '@/components/movies/HeaderSection.vue'
  import FilterSection from "@/components/movies/filters/FilterSection.vue"
  import MoviesSection from '@/components/movies/MoviesSection.vue'
  import PaginationCentered from "@/components/navigation/PaginationCentered.vue";
  //Import movies store
  import { useMoviesStore } from "../stores/movies";
  import { onMounted } from 'vue'
  import { mapActions } from "pinia/dist/pinia";

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
      name: "Español",
    },
    {
      id: 'de-DE',
      name: "Deutsch",
    },
  ]
  const fetchMovieQuery = {
      language : languages[0].id,
      order: 'desc',
      sortBy: 'popularity',
      page: 1,
      search: '',
  };
  const sortByItems = [
    { id: 'popularity', name: 'Popularity'},
    { id: 'release_date', name: 'Release Date'},
    { id: 'revenue', name: 'Revenue'},
    { id: 'primary_release_date', name: 'Primary Release Date'},
    { id: 'original_title', name: 'Original Title'},
    { id: 'vote_average', name: 'Vote Average'},
    { id: 'vote_count', name: 'Vote Count'}
  ];
  const orderItems = [
    { id: 'desc', name: 'DESC' },
    { id: 'asc', name: 'ASC' },
  ];
  export default {
  components: { HeaderSection, MoviesSection, FilterSection, PaginationCentered },
  name: "MovieView",
  data () {
    return {
      language: fetchMovieQuery.language,
      order: fetchMovieQuery.order,
      sortBy: fetchMovieQuery.sortBy,
      page: fetchMovieQuery.page,
      search: fetchMovieQuery.search,
    }
  },
  setup() {
    const storeMovies = useMoviesStore();

    const { fetchMoviesDiscover } = useMoviesStore();

    onMounted(() => {
      // Movies (language, sortBy, Order, Page)
      fetchMoviesDiscover(fetchMovieQuery.language, fetchMovieQuery.sortBy, fetchMovieQuery.order, fetchMovieQuery.page);
    })

    return {
      storeMovies,
      languages,
      fetchMovieQuery,
      sortByItems,
      orderItems
    }
  },
  methods: {
    ...mapActions(useMoviesStore, ['fetchMoviesDiscover']),

    changeLanguage(value) {
      this.language = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page, this.search);
    },
    changeOrder(value) {
      this.order = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page, this.search);
    },
    changeSortBy(value) {
      this.sortBy = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page, this.search);
    },
    changeSearch(value) {
      this.search = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page, this.search);
    },
    changePage(value) {
      this.page = value;
      this.fetchMoviesDiscover(this.language, this.sortBy, this.order, this.page, this.search);
    },
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
    <PaginationCentered />
  </main>

</template>
