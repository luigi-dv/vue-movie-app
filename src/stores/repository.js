import { defineStore} from "pinia";
import axios from "axios";

export const useRepositoryStore = defineStore("repository",{
    state: () => ({
        repository: [],
        repoCommit: []
    }),
    getters: {
        getMasterBranch() {
            return this.repository;
        },
        getMasterCommit() {
            return this.repoCommit;
        }
    },
    actions: {
        async fetchMasterBranch() {
            try {
                const data = await axios.get('https://api.github.com/repos/luigi-dv/vue-movies-api/branches/master')
                this.repository = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
        async fetchCommit() {
            try {
                const data = await axios.get('https://api.github.com/repos/luigi-dv/vue-movies-api/branches/master')
                this.repoCommit = data.data['commit']
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        },
    },
})




