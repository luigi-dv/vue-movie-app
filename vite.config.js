import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (not only VITE_*) for server-side use; they are never exposed to the client
  const env = loadEnv(mode, process.cwd(), '')

  // Dev/preview proxy mirroring the api/tmdb serverless function: the key is appended here, not in the browser.
  // Without a key, TMDB_PROXY_TARGET can point at a deployed copy of the app and reuse its proxy instead.
  const proxy = {
    '/api/tmdb': env.TMDB_PROXY_TARGET
      ? { target: env.TMDB_PROXY_TARGET, changeOrigin: true }
      : {
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

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: { proxy },
    preview: { proxy },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.spec.js', 'test/**/*.spec.js']
    }
  }
})
