import { createApp } from 'vue'
import App from '../src/App.vue'
import axios from 'axios'
import router from './router'



const apiKey = import.meta.env.VITE_APP_HASHED_API_KEY



const app = createApp(App)
app.use(router)
app.mount('#app')
