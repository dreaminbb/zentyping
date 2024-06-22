import { createRouter, createWebHistory } from 'vue-router'
import home from '@/components/home.vue'
import play from '@/components/play.vue'
import login from '@/components/signin.vue'
import profile from '@/components/profile.vue'


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
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/profile',
      name: 'profile',
      component: profile
    }
  ]
})

export default router
