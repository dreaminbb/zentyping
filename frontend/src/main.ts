import { createApp, provide, ref, type Ref } from 'vue'
import App from '../src/App.vue'
import router from './router'

export const login: Ref<boolean> = ref(true)

export const apiKey_get_problem: string = import.meta.env.VITE_APP_GET_PROBLEM_API_KEY;
export const github_client_id: string = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
export const github_oauth_url: string = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

//アクセストークンが有効かどうかを確認
const cookie = localStorage.getItem('cookie')
if (cookie) {
    console.log("cookieここにあり")
}

createApp(App).use(router).mount('#app')
