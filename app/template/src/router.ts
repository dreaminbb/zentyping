import { createRouter, createWebHistory } from 'vue-router'
import home from '@/components/user_home.vue'
import play from '@/components/play.vue'
import login from '@/components/user_login.vue'
import account from '@/components/user_account.vue'
import { is_login, token_manager } from './auth'


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
      beforeEnter: async (to, from, next) => {
        await new token_manager().verify_session()
        next()
      },
      component: login
    },
    {
      path: '/account',
      name: 'account',
      beforeEnter: async (to, from, next) => {
        await new token_manager().verify_session()
        next()
      },
      component: account
    }
  ]
})

export default router
