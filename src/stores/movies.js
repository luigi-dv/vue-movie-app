import { defineStore} from "pinia";
import axios from "axios";

export const useMoviesStore = defineStore("movies",{
    state: () => ({
        movies: [],
        movieCast: [],
        movieVideos: [],
        genres: [],
        trending:[],
        latest: [],
        discover: [],
        similarMovies: [],
    }),
    getters: {
        /**
         * Lists
         */
            getGenres() {
                return this.genres.genres
            },
            getLatest() {
                return this.latest
            },
            getTrending() {
                return this.trending.results
            },
            getDiscover() {
                return this.movies
            },
        /**
         * Object Movie
         */
            getMovie() {
                return this.movies
            },
            getMovieCast() {
              return this.movieCast.cast
            },
            getMovieCrew(){
                return this.movieCast.crew
            },
            getMovieVideos() {
                return this.movieVideos
            },
            getSimilarMovies() {
              return this.similarMovies
            }
    },
    actions: {

        /**
         * Fetch Movie
         * @param id
         * @param language
         * @returns {Promise<void>}
         */
        async fetchMovie(id, language) {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/movie/'+id+'?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=' + language)
                this.movies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        /**
         * Fetch Movie Cast (People)
         * @param id
         * @param language
         * @returns {Promise<void>}
         */
        async fetchMovieCast(id, language) {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/movie/'+id+'/credits?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=' + language)
                this.movieCast = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMovieVideos(id, language) {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/movie/'+id+'/videos?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=' + language)
                this.movieVideos = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },

        async fetchMovieSimilarMovies(id, language) {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/movie/'+id+'/similar?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=' + language)
                this.similarMovies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },

        /**
         * Fetch Movie Genres
         * @returns {Promise<void>}
         */
        async fetchMoviesGenres() {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/genre/movie/list?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.genres = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMoviesDiscover(language, sortBy, order, page) {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/discover/movie?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY +
                    '&language=' + language + '&sort_by=' + sortBy + '.' + order + '&include_adult=false&include_video=false&page='+ page)
                this.movies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMoviesLatest() {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/movie/latest?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.latest = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchTrendingMovieWeek() {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/trending/movie/week?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.trending = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchPopularMovies() {
            try {
                const data = await axios.get('https://api.themoviedb.org/'+import.meta.env.VITE_MOVIES_API_VERSION+'/movie/popular?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.movies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },

    },
})