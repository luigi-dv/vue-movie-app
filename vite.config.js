import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (not only VITE_*) for server-side use; they are never exposed to the client
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      // Dev proxy mirroring the api/tmdb serverless function: the key is appended here, not in the browser
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          rewrite: (path) => {
            const [pathname, search = ''] = path.replace(/^\/api\/tmdb/, `/${env.TMDB_API_VERSION || 3}`).split('?')
            const params = new URLSearchParams(search)
            params.set('api_key', env.TMDB_API_KEY)
            return `${pathname}?${params}`
          }
        }
      }
    }
  }
})
