import { ref, type Ref } from 'vue'

export const is_login: Ref<boolean> = ref(false)
export const cookie_exist: Ref<boolean> = ref(false)

export class token_manager {

  private readonly cookie: string | null = null

  constructor() {
    this.cookie = document.cookie
  }


  public cookie_exit(): void {
    cookie_exist.value = !!this.cookie
  }


  public async verify_session(): Promise<void> {
    if (document.cookie) {
      try {
        const request: Response = await fetch('http://localhost:8000/user/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.cookie as string
          }
        })
        const response = await request.json()
        if (response["success"]) {
          is_login.value = true
        }
        if (response["error"]) {
          is_login.value = false
        }
        if (response["invalid"]) {
          is_login.value = false
        }
        return
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("no cookie?")
      return
    }
  }


  public reset_cookie(new_cookie: string): void {
    localStorage.removeItem('cookie')
    localStorage.setItem('cookie', JSON.stringify(new_cookie))
    console.log('removing cookie and setting new cookie...')
  }

  //cookieをJSON->トークンの中身を更新->そしてそれを再度JSONの文字列にしてcookieに保管
  private restore_token(access_token: string, refresh_token: string): void {
    if (localStorage.getItem('cookie')) {
      const json_cookie = JSON.parse(this.cookie as string)
      json_cookie['access_token'] = access_token
      json_cookie['refresh_token'] = refresh_token
      localStorage.setItem('cookie', JSON.stringify(json_cookie))
    }
  }

  public logout(): void {
    const resonse = fetch('http://localhost:8000/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.cookie as string
      }
    })
    document.cookie = ''
    is_login.value = false
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const eq_pos = cookies[i].indexOf('=')
      const name = eq_pos > -1 ? cookies[i].substr(0, eq_pos) : cookies[i]
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
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
      const response: Response = await fetch('http://localhost:8000/user/native_register', {
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
        window.location.reload()
        is_login.value = true
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export class github {
  public auth(): void {
    if (!document.cookie) {
      try {
        window.location.href = 'http://localhost:8000/github/'
        if (document.cookie) {
          is_login.value = true
        }
      } catch (error) {
        console.error('Error redirecting to GitHub authentication page:', error)
      }
    } else {
      console.log('you have cookie')
    }
  }
}

new token_manager().cookie_exit()
new token_manager().verify_session()

console.log(document.cookie)