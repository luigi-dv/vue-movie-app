import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    meta: { transition: 'fade' },
  },
  {
    path: '/movies',
    name: 'movies',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MoviesView.vue'),
  },

  // And finally the default route, when none of the above matches:
  { path: '/404',
    name: 'PageNotExist',
    component: () => import('../views/errors/PageNotFoundView.vue')
  },
  {
    path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
    redirect: '/404',
  },

];

const router = createRouter({
  scrollBehavior (to, from, savedPosition) {
    // always scroll to top
    return {
      top: 0,
      behavior: 'smooth',
    }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router