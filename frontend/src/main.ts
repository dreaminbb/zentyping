import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core';
import routes from './router'; import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { code_data } from './store/store';

const router = createRouter({
  history: createWebHistory(),
  routes
})
library.add(fas as IconPack, far as IconPack, fab as IconPack)
const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

code_data().initialize().then(() => {
  app.mount('#app')
}).catch((error) => {
  console.log(error)
})

