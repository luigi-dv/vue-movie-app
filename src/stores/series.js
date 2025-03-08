import { defineStore} from "pinia";
import axios from "axios";

export const useSeriesStore = defineStore("series",{
    state: () => ({
        series: [],
        genres: [],
        trending:[],
        discover:[],
    }),
    getters: {
        getGenres() {
            return this.genres
        },
        getTrending() {
            return this.trending.results
        },
        getDiscover() {
            return this.discover
        }
    },
    actions: {
        async fetchSeriesGenres() {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/genre/tv/list?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.genres = data.data.genres
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchSeriesDiscover() {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/discover/tv?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.discover = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchTrendingSeriesWeek() {
            try {
                const data = await axios.get('https://api.themoviedb.org/3/trending/tv/week?api_key='
                    + import.meta.env.VITE_MOVIES_API_KEY + '&language=en-US')
                this.trending = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        }
    },
})
