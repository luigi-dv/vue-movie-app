import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    meta: { transition: 'fade' },
  },
  {
    path: '/movies',
    name: 'Movies',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MoviesView.vue'),
  },
  {
    path: '/movies/title/:id',
    name: 'MovieObject',
    component: () => import('../views/MovieView.vue'),
    props: true
  },
  {
    path: '/movies/genres/:id',
    name: 'MovieGenre',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MoviesView.vue'),
    props: true
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