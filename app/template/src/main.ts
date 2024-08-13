import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

export const apiKey: string = import.meta.env.VITE_APP_API_KEY
export const github_client_id: string = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
export const play_api_key: string = import.meta.env.VITE_APP_PLAY_API_KEY
export const get_problem_url: string = import.meta.env.VITE_APP_GET_PROBLEM_URL
export const send_play_result_url: string = import.meta.env.VITE_APP_SEND_PLAY_INFO_URL
export const github_oauth_url: string = `https://github.com/is_login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

// 最後に離れたらサーバーに送信
window.addEventListener('beforeunload', (): void => {
  if (document.cookie) {
    navigator.sendBeacon('http://localhost:8000/exit', document.cookie)
    return
  } else {
    return
  }
})