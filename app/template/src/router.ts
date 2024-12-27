import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
                {
                                path: '/login',
                                name: 'login',
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
export default routes