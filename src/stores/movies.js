import { defineStore} from "pinia";
import axios from "axios";

export const useMoviesStore = defineStore("movies",{
    state: () => ({
        movies: [],
        genres: [],
        trending:[],
        latest: [],
        discover: [],
    }),
    getters: {
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
            return this.discover
        }
    },
    actions: {

        async fetchMoviesGenres() {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.genres = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMoviesDiscover(language, sortBy, order, page, search) {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/discover/movie?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY +
                    '&language=' + language + '&sort_by=' + sortBy + '.' + order + '&include_adult=false&include_video=false&page='+ page + '&without_keywords=' + search)
                this.discover = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMoviesLatest() {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/movie/latest?api_key='
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
                const data = await axios.get('https://api.themoviedb.org/3/trending/movie/week?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.trending = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchMovie(id) {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/movie/'+id+'?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.movies = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchPopularMovies() {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key='
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
