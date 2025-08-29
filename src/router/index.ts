import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/Dashboard/index.vue'
import BilibiliView from '../views/BilibiliView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-root',
      component: HomeView,
      meta: { title: 'Home' },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { title: 'Dashboard' },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About' },
    },
    {
      path: '/bilibili',
      name: 'bilibili',
      component: BilibiliView,
      meta: { title: 'Bilibili Screen' },
    },
  ],
})

export default router
