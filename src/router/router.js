import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlayView from '@/views/PlayView.vue'
// import GetqView from '@/views/WriteqView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/play',
      name: 'play',
      component: PlayView
    },
  ]
})

export default router
