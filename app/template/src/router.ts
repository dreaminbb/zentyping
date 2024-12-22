import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import play from '@/views/play_test.vue'
import login from '@/views/user_login.vue'
import account from '@/views/user_account.vue'
import ranking from '@/views/user_ranking.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/play',
    name: 'play',
    component: play
  },
  {
    path: '/login',
    name: 'login',
    // beforeEnter: (to, from, next) => {
    //     // await new token_manager().verify_session()
    //     next()
    // },
    component: login
  },
  {
    path: '/account',
    name: 'account',
    component: account
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: ranking
  }
]

const router = createRouter({
  history: createWebHistory(),  // HTML5 History モードを使用
  routes
})

export default router