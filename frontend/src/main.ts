import { createApp } from 'vue'
import App from '../src/App.vue'
import axios from 'axios'
import router from './router'

export const apiKey_get_problem: string = import.meta.env.VITE_APP_GET_PROBLEM_API_KEY;


const app = createApp(App)
app.use(router)
app.mount('#app')
