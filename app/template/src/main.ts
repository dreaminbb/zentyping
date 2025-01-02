
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'
import { loading_setup } from '@/module/loading';
import routes from './router';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'


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
loading_setup()