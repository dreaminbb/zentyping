import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


export const apiKey: string = import.meta.env.VITE_APP_API_KEY;
export const github_client_id: string = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
export const github_oauth_furl: string = `https://github.com/is_login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

createApp(App).use(router).mount('#app')
