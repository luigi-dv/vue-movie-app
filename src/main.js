import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal'
import './assets/main.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .directive('reveal', reveal)
  .mount('#app')
