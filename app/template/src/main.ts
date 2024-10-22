import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircle,
  faCircleXmark,
  faCoffee,
  faGear,
  faList,
  faPen,
  faQuestion,
  faRankingStar,
  faTimes,
  faUser,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { session_manager } from '@/services/auth'
import { user_info } from '@/store/store'

library.add(
  faCoffee,
  faQuestion,
  faUser,
  faRankingStar,
  faGear,
  faPen,
  faGithub,
  faList,
  faXTwitter,
  faCircle,
  faTimes,
  faXmark,
  faCircleXmark
)

const app = createApp(App)
const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)
app.mount('#app')

export const play_api_key: string = import.meta.env.VITE_APP_PLAY_API_KEY
export const github_oauth_url: string = 'http://localhost:8000/auth/github'

//サイトにアクセスしたらセッションが有効かを確認
document.cookie ? new session_manager().verify_session() : void 0
document.cookie ? user_info().fetch_info() : void 0

//todo
// インターフェースがなんか変
// プレイの処理でcompleted_play_countを加える

//ユーザーのデーターを取得
// if (document.cookie && user_status().is_login) {
//   try {
//     const response: Response = await fetch('http://localhost:8000/user/info', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     const data = await response.json()
//     if (response.status === 200) {
//       if (data) {
//         // user_info().play_history_value = data['play_history'] as Array
//         user_info().user_name = data['name'] as string
//         user_info().bio = data['bio'] as string
//         user_info().joined_day = data['created_at'].split('T')[0].replace(/-/g, ':') as string
//         user_info().play_count = data['total_result']['play_count'] as number
//         user_info().total_time = data['total_result']['total_time'] as number
//         user_info().short_correct_rate = data['total_result']['short_correct_rate'] as number
//         user_info().normal_correct_rate = data['total_result']['normal_correct_rate'] as number
//         user_info().long_correct_rate = data['total_result']['long_correct_rate'] as number

//       } else {
//         console.log('you are bad boy')w
//         user_info().user_name = '(:'
//         user_info().total_time = 0
//       }
//     } else if (response.status === 401) {
//       console.log('ログインし直してください')
//     } else if (response.status === 500) {
//       console.log('サーバー側でエラーが発生しました')
//     }
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   console.log('no cookie???')
// }

// 最後に離れたらサーバーに送信 window.addEventListener('beforeunload', (): void => { if (document.cookie) {
//     navigator.sendBeacon('http://localhost:8`000/exit', document.cookie) /     return } else { return } })
