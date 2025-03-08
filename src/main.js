import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/css/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Filter
app.config.globalProperties.$filters = {

    str_limit (value, size) {
        if (!value) return ''
        value = value.toString()

        if (value.length <= size) {
            return value
        }
        return value.substr(0, size) + '...'
    },
    int_abbr: function(num) {
        if (String(num).length < 7) {
            return Math.floor(num/1000) + 'K';
        } else {
            return Math.floor(num/1000000) + 'M';
        }
    }
}

app.mount('#app')
