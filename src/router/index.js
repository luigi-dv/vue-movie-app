import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { movieLists } from '@/lib/lists'

const listSlugs = movieLists.map((list) => list.slug).join('|')

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/movies', name: 'discover', component: () => import('@/views/DiscoverView.vue') },
  // Kept so links to the old genre pages keep working
  { path: '/movies/genres/:id', redirect: (to) => ({ path: '/movies', query: { genre: to.params.id } }) },
  { path: `/movies/:list(${listSlugs})`, name: 'list', component: () => import('@/views/ListView.vue'), props: true },
  { path: '/movies/title/:id(\\d+)', name: 'movie', component: () => import('@/views/MovieView.vue'), props: true },
  { path: '/people/:id(\\d+)', name: 'person', component: () => import('@/views/PersonView.vue'), props: true },
  { path: '/watchlist', name: 'watchlist', component: () => import('@/views/WatchlistView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/CaseStudyView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    // Filter changes only touch the query: stay where the visitor is
    if (to.path === from.path && to.query.page === from.query.page) return false
    return { top: 0 }
  }
})

export default router
