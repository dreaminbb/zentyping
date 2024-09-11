import { createApp } from 'vue'
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

library.add(faCoffee, faQuestion, faUser, faRankingStar, faGear, faPen, faGithub, faList, faXTwitter, faCircle, faTimes, faXmark, faCircleXmark)


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


// interface activity_calender_entry {
//   day:string,
//   week_number:number,
//   day_of_week:string,
//   play_count_in_day:number
// }

// interface user_info_payload {
//   user_name: string,
//   bio: string,
//   user_github_link: string,
//   user_twitter_link: string,
//   keyboard: string,
//   user_read_me: string,
//   joined_day: string,
//   activity_calender: Array<{
//     day: string,
//     week_number: number,
//     day_of_week: string,
//     play_count_in_day: number
//   }>,
//   play_history: Array<{
//     correct_count: number,
//     correct_every_second: number[],
//     correct_rate: number,
//     id: number,
//     incorrect_count: number,
//     input_every_second: number[],
//     length: number,
//     level: string,
//     played_at: string,
//     pun_count: number,
//     time: number
//   }>,
//   play_count: number,
//   total_time: number,
//   total_result: object,
//   short_correct_rate: number,
//   normal_correct_rate: number,
//   long_correct_rate: number
// }

if (document.cookie) {
  fetch('http://localhost:8000/user/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async response => {
    if (response.status == 200) {
      const data:any = await response.json()
      // const data: user_info_payload = await response.json()
      console.log(data)
      const user_info_obj = user_info()
      user_info_obj.user_name = data['user_name'] as string || '(:'
      user_info_obj.bio = data['bio'] as string || 'データがありません'
      user_info_obj.keyboard = data['keyboard'] as string || '油と手垢のつきまくったクソ汚いキーボード'
      user_info_obj.user_github_link = data['user_github_link'] as string || 'github.com'
      user_info_obj.user_twitter_link = data['user_twitter_link'] as string || 'twitter.com'
      user_info_obj.joined_day = data['joined_day'].split('T')[0].replace(/-/g, ':') as string || 'xxxx:x?:x!'
      user_info_obj.total_time = data['total_time'] as number || 0
      user_info_obj.activity_calender = data['activity_calender'] as Array<{
        day: string,
        week_number: number,
        day_of_week: string,
        play_count_in_day: number
      }>
      user_info_obj.user_read_me = data['user_read_me'] as string || 'おっぱい大好き'
      user_info_obj.play_history = data['play_history'] || [{}]
      console.log(Object.keys(data).filter(key => !Object.keys(user_info()).includes(key)), 'data has but user_info doesn\'t')
    }
  })
}


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
//
//       } else {
//         console.log('you are bad boy')
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