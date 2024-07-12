import { createRouter, createWebHistory } from 'vue-router'
import home from '@/components/user_home.vue'
import play from '@/components/play.vue'
import login from '@/components/user_login.vue'
import account from '@/components/user_account.vue'
import { is_login, token_manager } from './client'


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
        if (await new token_manager().verify_access_token() === true) {
          is_login.value = true
          next({ name: 'home' })
        } else {
          next()
        }
      },
      component: login,
    },
    {
      path: '/account',
      name: 'account',
      beforeEnter: async (to, from, next) => {
        if (await new token_manager().verify_access_token() === true) {
          next()
        } else {
          next({ name: "home" })
        }
      },
      component: account
    }
  ]
})

export default router
