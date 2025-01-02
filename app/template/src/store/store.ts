import { defineStore } from 'pinia'
import type { store_code_type } from '@/interface'

export const user_status = defineStore('user_status', {
  state: (): { is_login: boolean; is_user: boolean; is_admin: boolean } => ({
    is_login: true,
    is_user: false,
    is_admin: false
  })
})


export const code_param = defineStore('code_param', {
  actions: {
    get_lang_from_local_storage(): void {
      this.code_lang = localStorage.getItem('code_lang') ?? 'ts'
    },
    store_long_param_local_storage(lang: string): void {
      localStorage.setItem('code_lang', lang)
    }
  },
  state: (): { code_lang: string } => ({
    code_lang: 'rust'
  })
})


export const codes_storege = defineStore('codes_storage', {
  actions: {
  },
  state: (): { store_code: store_code_type } => ({
    store_code: {
      python: null,
      rust: null,
      typescript: null
    }
  })
})


export const user_settings = defineStore('user_settings', {
  state() {
    return {}
  }
})