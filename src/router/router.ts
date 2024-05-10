import { createRouter, createWebHistory } from 'vue-router'
import home from '@/components/home.vue'
import play from '@/components/play.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/play',
      name: 'play',
      component: play
    }
  ]
})

export default router
