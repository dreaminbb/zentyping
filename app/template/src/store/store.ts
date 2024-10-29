import { defineStore } from 'pinia'
import type { activity_calendar, all_play_history, play_history_if } from '@/interface'

export const user_status = defineStore('user_auth', {
  state: (): { is_login: boolean; is_user: boolean; is_admin: boolean } => ({
    is_login: false,
    is_user: false,
    is_admin: false
  })
})

export const user_info = defineStore('user_info', {
  state: () => ({
    user_name: 'タイピングニキ',
    joined_day: '',
    user_read_me: 'hhkb is piece of  shit',
    keyboard: '',
    user_github_link: '',
    user_twitter_link: '',
    user_new_read_me: '',
    new_user_name: '',
    new_user_github_link: '',
    new_user_twitter_link: '',
    activity_calender: [{}] as [activity_calendar],
    play_history: {} as all_play_history,
    //レベル別から時間別に分ける
    // ==========================================
    play_history_by_play_count: [] as play_history_if[],
    // ==========================================
    play_count: 0 as number,
    completed_play_count: 0 as number,
    total_time: 0 as number,
    short_correct_rate: 0,
    normal_correct_rate: 0,
    long_correct_rate: 0,
    cps_data_year: [] as Array<number>,
    cps_data_month: [] as Array<number>,
    cps_data_day: [] as Array<number>,
    active_level: 0 as number
  }),
  actions: {
    async fetch_info() {
      fetch('http://localhost:8000/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async (response) => {
        if (response.status == 200) {
          // user_status().is_login = true
          const data: any = await response.json()
          console.log(data['comprehensive_results'], 'comprehensive_results') //todo undifined
          console.log(data['short_correct_rate'], 'short_correct_rate') //todo undifined
          console.log(data['normal_correct_rate'], 'normal_correct_rate') //todo undifined
          console.log(data['long_correct_rate'], 'long_correct_rate') //todo undifined
          
          this.user_read_me = (data['user_read_me'] as string) || 'おっぱい大好き'
          this.user_name = (data['user_name'] as string) || '(:'
          this.keyboard = (data['keyboard'] as string) || '油と手垢のつきまくったクソ汚いキーボード'
          this.user_github_link = (data['user_github_link'] as string) || 'github.com'
          this.user_twitter_link = (data['user_twitter_link'] as string) || 'twitter.com'
          this.joined_day =
            (data['joined_day'].split('T')[0].replace(/-/g, ':') as string) || 'xxxx:x?:x!'
          this.total_time = (data['total_time'] as number) || 0
          this.play_count = data['play_count'] as number
          this.user_github_link = (data['github_link'] as string) || ''
          this.user_twitter_link = (data['twitter_link'] as string) || ''
          this.play_history = data['play_history'] as all_play_history
          this.short_correct_rate = data['short_correct_rate'] as number
          this.normal_correct_rate = data['normal_correct_rate'] as number
          this.long_correct_rate = data['long_correct_rate'] as number
          this.activity_calender = data['activity_calender'] as [activity_calendar]
          this.play_history = data['play_history'] || [{}]
          // todo
          //プレイ履歴からプレイ回数順に分けplay_hisory_by_play_countに格納
          this.play_history
            ? (this.play_history_by_play_count = Object.values(this.play_history)
              .flat()
              .sort((a: any, b: any) => a.play_count - b.play_count))
            : void 0
          this.display_info()
        }
      })
    },
    display_info() {
      console.log(this.$state)
    }
  }
})

export const user_settings = defineStore('user_settings', {
  state() {
    return {}
  }
})
//
// export const user_settings = defineStore("user_settings", {
//
//         state: (): { is_dark_mode: boolean } => ({
//             is_dark_mode: false
//         }),
//
//         actions: {
//             toggle_dark_mode(): void {
//                 this.is_dark_mode = !this.is_dark_mode
//             }
//         }
//     }),
// }



// export const user_ranking_