import { createRouter, createWebHistory } from 'vue-router'
import home from '@/components/user_home.vue'
import play from '@/components/play.vue'
import login from '@/components/user_login.vue'
import account from '@/components/user_account.vue'


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
      // name: 'login',
      // beforeEnter: async (to, from, next) => {
      //   const verify_settion = await new token_manager().verify_settion();
      //   if (verify_settion) {
      //     is_login.value = true;
      //     next({ name: 'home' });
      //   } else {
      //     is_login.value = false;
      //     next();
      //   }
      // },
      component: login,
    },
    {
      path: '/account',
      name: 'account',
      component: account
    }
  ]
})

export default router
