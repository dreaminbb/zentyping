import { createApp } from 'vue'
import App from '../src/App.vue'
import axios from 'axios'
import router from './router'


const API_KEY_TOP_SEACRE: string = '763afd861d9c4081faf2baaf0b27dbb25a1d1c663b33fc099abef48c07237c88'


const app = createApp(App)
app.use(router)
app.mount('#app')
