import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Define routes
const routes: RouteRecordRaw[] = [
                {
                                path: '',
                                name: 'Main',
                                component: () => import('./pages/code.vue')
                },
                {
                                path: '/about_owner',
                                name: 'About',
                                component: () => import('./pages/about.vue')
                },
                {
                                path: '/sc_doc',
                                name: 'ScDoc',
                                component: () => import('./pages/sc_doc.vue')
                },
                // Add more routes as needed
                {
                                path: '/info',
                                name: 'Info',
                                component: () => import('./pages/info.vue')
                }
];

// Create router instance
const router = createRouter({
                history: createWebHistory(),
                routes
});

export default router;