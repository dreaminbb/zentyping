import { defineStore } from 'pinia'
import type { activity_calendar, all_play_history, play_history_if } from '@/interface'

export const user_status = defineStore('user_status', {
  state: (): { is_login: boolean; is_user: boolean; is_admin: boolean } => ({
    is_login: true,
    is_user: false,
    is_admin: false
  })
})


export const code_param = defineStore('user_param', {
  actions: {
    get_lang_from_local_storage(): void {
      this.code_lang = localStorage.getItem('code_lang') ?? 'ts'
    },
    store_long_param_local_storage(lang: string): void {
      localStorage.setItem('code_lang', lang)
    }
  },
  state: (): { code_lang: string } => ({
    code_lang: 'ts'
  })
})


export const user_settings = defineStore('user_settings', {
  state() {
    return {}
  }
})