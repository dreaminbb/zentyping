import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
import App from './App.vue'
import Getq from './Getq.vue'
import Play from './Play.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: App },
    { path: '/getq', component: Getq },
    { path: '/play', component: Play }
    // 他のルート...
  ]
})
