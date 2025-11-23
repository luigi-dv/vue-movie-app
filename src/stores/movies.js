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
                const data = await axios.get('/api/tmdb/movie/'+id+'?language=' + language)
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
                const data = await axios.get('/api/tmdb/movie/'+id+'/credits?language=' + language)
                this.movieCast = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMovieVideos(id, language) {
            try {
                const data = await axios.get('/api/tmdb/movie/'+id+'/videos?language=' + language)
                this.movieVideos = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },

        async fetchMovieSimilarMovies(id, language) {
            try {
                const data = await axios.get('/api/tmdb/movie/'+id+'/similar?language=' + language)
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
                const data = await axios.get('/api/tmdb/genre/movie/list?language=en-US')
                this.genres = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMoviesDiscover(language = 'en-US', sortBy = 'popularity', order = 'desc', page = 1) {
            try {
                const data = await axios.get('/api/tmdb/discover/movie?language=' + language + '&sort_by=' + sortBy + '.' + order + '&include_adult=false&include_video=false&page='+ page)
                this.movies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMoviesLatest() {
            try {
                const data = await axios.get('/api/tmdb/movie/latest?language=en-US')
                this.latest = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchTrendingMovieWeek() {
            try {
                const data = await axios.get('/api/tmdb/trending/movie/week?language=en-US')
                this.trending = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchPopularMovies() {
            try {
                const data = await axios.get('/api/tmdb/movie/popular?language=en-US')
                this.movies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },

    },
})