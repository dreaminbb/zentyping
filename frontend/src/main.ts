import { createApp } from 'vue'
import App from '../src/App.vue'
import router from './router'


//play_page
export const apiKey_get_problem: string = import.meta.env.VITE_APP_GET_PROBLEM_API_KEY;

//signin_login
export const github_client_id: string = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
export const github_oauth_url: string = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&scope=user:read`


const app = createApp(App)
app.use(router)
app.mount('#app')
