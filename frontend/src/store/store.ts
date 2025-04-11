import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import type { code_obj, store_code_type } from '@/interface'
import { fetch_one_lang_code_from_api, fetch_all_lang_code_from_api } from '@/api/code';
import config from '@/config';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export const user_status = defineStore('user_status', {

  actions: {
    init_status(): void {
      this.is_login = false
      this.is_user = true
      this.is_admin = false
    }
  },
  state: (): { is_login: boolean; is_user: boolean; is_admin: boolean } => ({
    is_login: false,
    is_user: true,
    is_admin: false
  }),
  persist: {
    key: 'user_status', // 保存時のキー名
    storage: localStorage, // localStorageに保存
  },
})

export const user_info = defineStore('user_info', {

  state: (): { user_name: null | string; github_user_id: null | number; user_icon_url: string; token: string } => ({
    user_name: null,
    github_user_id: null,
    user_icon_url: '',
    token: ''
  }),

  actions: {
    update_token(token: string): void {
      this.token = token
    },
    update_user_info(user_name: string, github_user_id: number, user_icon_url: string): void {
      this.user_name = user_name
      this.github_user_id = github_user_id
      this.user_icon_url = user_icon_url
    },

    init_user_info(): void {
      this.user_name = null
      this.github_user_id = null
      this.user_icon_url = ''
      this.token = ''
    }
  },

  persist: {
    key: 'user_info', // 保存時のキー名
    storage: localStorage, // localStorageに保存
  },
})


export const code_data = defineStore('code_data', {

  state: (): { code_lang: string, code_point: number, code_data_obj: store_code_type | null, ready: boolean } => ({

    code_lang: localStorage.getItem('code_lang') === null ? 'rust' : localStorage.getItem('code_lang') as string,
    ready: false,
    code_point: 0,

    code_data_obj: {
      python: null,
      rust: null,
      typescript: null
    }
  }),

  actions: {

    store_lang_param_local_storage(lang: string): void {
      localStorage.setItem('code_lang', lang)
    },
    init_store(): void {
      this.ready = true
    },

    async initialize(): Promise<void> {
      try {
        const data = await fetch_all_lang_code_from_api(config.all_code_each_mount)
        //if there is no code_data_obj, hold data as variable and if there is, update it.

        if (!this.code_data_obj) {
          this.code_data_obj = data as unknown as store_code_type
        } else {
          Object.assign(this.code_data_obj, data as unknown as store_code_type)
        }
        // 既存のデータがある場合は直接更新
        // console.log(this.code_data_obj)

        this.ready = true
      } catch (e) {
        console.error(e)
        throw e;
      }
    },


    // This function calls another func which fetch code data from api, then sets code data into store.
    async one_lang_update_stored_code(lang: string, mount: number): Promise<void> {

      await fetch_one_lang_code_from_api(mount, lang).then((data) => {

        if (!this.code_data_obj) {
          throw new Error('code_data_obj is null')
        }

        this.code_data_obj[lang as keyof store_code_type] = data as Array<code_obj>

        return
      })
    },


    async update_all_stored_code(mount: number): Promise<void> {

      await fetch_all_lang_code_from_api(mount).then((data) => {

        if (!this.code_data_obj) {
          throw new Error('code_data_obj is null')
        }
        // console.log(data)
        this.code_data_obj = data as unknown as store_code_type

        return
      })
    }

  }
})



export const user_settings = defineStore('user_settings', {
  state() {
    return {}
  }
})

export default pinia