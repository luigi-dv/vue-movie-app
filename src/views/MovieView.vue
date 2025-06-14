<script>
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
    id: 'zh',
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
};

/**
 * Components
 */
import HeaderSection from '@/components/movies/object/HeaderSection.vue';
import ObjectSection from '@/components/movies/object/ObjectSection.vue';
import RecommendationSection from '@/components/movies/object/RecommendationSection.vue'
export default {
  name: "MovieView",
  props: ['id'],
  components: { HeaderSection, ObjectSection, RecommendationSection },
  data () {
    return {
      language: fetchMovieQuery.language,
    }
  },
  setup() {
    const storeMovies = useMoviesStore();
    const route = useRoute();

    const { fetchMovie, fetchMovieCast, fetchMovieSimilarMovies, fetchMovieVideos } = useMoviesStore();

    onMounted(() => {
      // Movies (language)
      fetchMovie(route.params.id, fetchMovieQuery.language);
      fetchMovieCast(route.params.id, fetchMovieQuery.language);
      fetchMovieSimilarMovies(route.params.id, fetchMovieQuery.language);
      fetchMovieVideos(route.params.id, fetchMovieQuery.language);
    })

    return {
      storeMovies,
      languages,
      route,
    }
  },

  methods: {
    ...mapActions(useMoviesStore, ['fetchMovie', 'fetchMovieCast', 'fetchMovieSimilarMovies', 'fetchMovieVideos']),

    changeLanguage(value) {
      this.language = value;
      this.fetchMovie(this.route.params.id, this.language);
      this.fetchMovieCast(this.route.params.id, this.language);
      this.fetchMovieSimilarMovies(this.route.params.id, this.language);
      this.fetchMovieVideos(this.route.params.id, this.language)
    },
  },
  computed: {
    movie() {  return this.storeMovies.getMovie },
    cast() { return this.storeMovies.getMovieCast },
    crew() { return this.storeMovies.getMovieCrew },
    similarMovies() { return this.storeMovies.getSimilarMovies},
    videos() { return this.storeMovies.getMovieVideos }
  },
}
</script>

<template>
  <main class="">
    <HeaderSection :movie="this.movie" :languages="this.languages" :videos="this.videos" @changeLanguage="changeLanguage" />
    <ObjectSection :movie="this.movie" :cast="this.cast" :crew="this.crew"/>
    <div class="border-t-2 border-t-emerald-500">
      <RecommendationSection :similarMovies="this.similarMovies" />
    </div>

  </main>
</template>