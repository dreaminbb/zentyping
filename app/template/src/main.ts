import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { session_manager } from '@/services/auth'
import { user_info, user_status } from '@/store/store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')


export const play_api_key: string = import.meta.env.VITE_APP_PLAY_API_KEY
export const github_oauth_url: string = 'http://localhost:8000/auth/github'

//サイトにアクセスしたらセッションが有効かを確認
document.cookie ? new session_manager().verify_session() : void 0


//ユーザーのデーターを取得
if (document.cookie && user_status().is_login) {
  try {
    const response: Response = await fetch('http://localhost:8000/user/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (response.status === 200) {
      if (data) {
        user_info().play_history_value = data['play_history']
        user_info().user_name = data['name'] as string
        user_info().bio = data['bio'] as string
        user_info().joined_day = data['created_at'].split('T')[0].replace(/-/g, ':') as string
        user_info().play_count = data['total_result']['play_count'] as number
        user_info().total_time = data['total_result']['total_time'] as number
        user_info().short_correct_rate = data['total_result']['short_correct_rate'] as number
        user_info().normal_correct_rate = data['total_result']['normal_correct_rate'] as number
        user_info().long_correct_rate = data['total_result']['long_correct_rate'] as number

      } else {
        console.log('you are bad boy')
        user_info().user_name = '(:'
        user_info().total_time = 0
      }
    } else if (response.status === 401) {
      console.log('ログインし直してください')
    } else if (response.status === 500) {
      console.log('サーバー側でエラーが発生しました')
    }
  } catch (error) {
    console.error(error)
  }
} else {
  console.log('no cookie???')
}

// 最後に離れたらサーバーに送信 window.addEventListener('beforeunload', (): void => { if (document.cookie) {
//     navigator.sendBeacon('http://localhost:8`000/exit', document.cookie) /     return } else { return } })