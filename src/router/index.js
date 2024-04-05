import { createRouter, createWebHashHistory } from 'vue-router'
import pege1 from './App.vue'
import pege2 from './Play.vue'
import pege3 from './Getq.vue'

const routes = [
  {
    path: '/',
    name: 'pege1',
    component: pege1
  },
  {
    path: '/play',
    name: 'pege2',
    component: pege2
  },
  {
    path: '/getq',
    name: 'pege3',
    component: pege3
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
