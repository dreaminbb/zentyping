
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    // beforeEnter: (to, from, next) => {
    // await new token_manager().verify_session()
    //     next()
    // },
    component: () => import('@/views/user_login.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/user_account.vue'),
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: () => import('@/views/user_ranking.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),  // HTML5 History モードを使用
  routes
})

library.add(fas as IconPack, far as IconPack, fab as IconPack)

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

export const play_api_key: string = import.meta.env.VITE_SERVER_API_KEY
export const seacret_key: string = import.meta.env.VITE_SEND_PLAY_INFO_API_KEY
export const github_oauth_url: string = 'http://localhost:8000/auth/github'