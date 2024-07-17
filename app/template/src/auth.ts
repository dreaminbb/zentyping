import { ref, type Ref } from 'vue'
import router from './router'

export const is_login: Ref<boolean> = ref(false)
export const cookie_exist: Ref<boolean> = ref(false)


export class token_manager {

  private readonly cookie: string | null = null

  constructor() {
    this.cookie = localStorage.getItem('cookie')
  }


  public cookie_exit(): void {
    cookie_exist.value = !!this.cookie
  }


  //bearerをつけてトークンを送る
  public async update_token(): Promise<boolean> {
    if (!localStorage.getItem('cookie')) {
      return false
    }
    try {
      const response: Response = await fetch('http://localhost:8000/user/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(this.cookie as string)['refresh_token'] as string,
          'type': JSON.parse(this.cookie as string)['type'] as string
        }
      })

      if (!response.ok) {
        return false
      }
      console.log(JSON.stringify(JSON.parse(this.cookie as string)['refresh_token']) as string)
      const res = await response.json()
      console.log(res)
      if (res['access_token']) {
        const access_token = res['access_token']
        const refresh_token = res['refresh_token']
        is_login.value = true
        this.restore_token(access_token, refresh_token)
        console.log('token were updated')
        return true
      }
    } catch (error) {
      console.log('error')
      return false
    }
    return false
  }

  public async verify_access_token(): Promise<boolean | void> {
    if (localStorage.getItem('cookie')) {
      try {
        const request: Response = await fetch('http://localhost:8000/user/access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.stringify(JSON.parse(this.cookie as string)['access_token']) as string,
            'type': JSON.parse(this.cookie as string)['type'] as string
          }
        })
        const res = await request.json()
        console.log(res)

        if (res['success']) {
          is_login.value = true
          console.log('welcome back sir')
          return true
        }
        if (res['timeout'] === true) {
          console.log('token timeout')
          setTimeout(async (): Promise<void> => {
            const update_result:boolean = await this.update_token()
            console.log(update_result)
            if (update_result) {
              is_login.value = true
            }
          }, 300)
        }
      } catch (error) {
        return
      }
    }
    return
  }

  public reset_cookie(new_cookie: string): void {
    localStorage.removeItem('cookie')
    localStorage.setItem('cookie', JSON.stringify(new_cookie))
    console.log('removing cookie and setting new cookie...')
  }

  //cookieをJSON->トークンの中身を更新->そしてそれを再度JSONの文字列にしてcookieに保管
  private restore_token(access_token: string, refresh_token: string) {
    if (localStorage.getItem('cookie')) {
      const json_cookie = JSON.parse(this.cookie as string)
      json_cookie['access_token'] = access_token
      json_cookie['refresh_token'] = refresh_token
      localStorage.setItem('cookie', JSON.stringify(json_cookie))
    }
  }

  public logout() {
    is_login.value = false
    localStorage.removeItem('cookie')
    window.location.reload()
  }
}


// ユーザーのアカウント作成、ログイン、ログアウト
export class native_user {

  private email_password: { email: string, password: string, type: 'native' } | null = null

  public async register(email: string, password: string, name: string) {

    interface data_interface {
      email: string,
      password: string
      name: string
      type: string
    }

    const user_data: data_interface = {
      email: email,
      password: password,
      name: name,
      type: 'native'
    }

    try {
      const response: Response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
      })

      const res = await response.json()
      if (res && res['cookie']) {
        const new_cookie = res['cookie']
        new token_manager().reset_cookie(new_cookie)
        window.location.href = '/account'
      } else {
        console.log(res['message'])
      }

    } catch (error) {
      console.error('Error sing up:', error)
    }
  }


  public async login(email: string, password: string): Promise<void> {
    this.email_password = {
      email: email,
      password: password,
      type: 'native'
    }

    try {
      const response: Response = await fetch('http://localhost:8000/user/native_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: import.meta.env.VITE_APP_API_KEY
        },
        body: JSON.stringify(this.email_password)
      })

      const res = await response.json()
      console.log(res)
      if (response.status === 200) {
        const new_cookie = res['new_cookie']
        new token_manager().reset_cookie(new_cookie)
        is_login.value = true
        await router.push({ name: 'home' })
      }
    } catch (error) {
      console.log(error)
    }
  }
}


new token_manager().cookie_exit()
new token_manager().verify_access_token()

// if (await new token_manager().verify_access_token() === false) {
//   is_login.value = true
//   console.log(JSON.stringify(JSON.parse(localStorage.getItem('cookie') as string)['refresh_token']) as string)
//   console.log(JSON.stringify(JSON.parse(localStorage.getItem('cookie') as string)['access_token']) as string)
// }`

console.log(is_login.value)
