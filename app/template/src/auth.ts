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

        if (response["cookie"]) {
          console.log(response["cookie"])
          document.cookie = response["cookie"]
          window.location.reload()
        }

        if (response["error"] || response["invalid"]) {
          is_login.value = false
          this.logout()
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






  public logout(): void {
    fetch('http://localhost:8000/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.cookie as string
      }
    })
    document.cookie = "inlaid cookie!!!!!!!!!"
    window.location.href = '/'
  }
}


// ユーザーのアカウント作成、ログイン、ログアウト
export class native_user {

  private email_password: { email: string, password: string, type: 'native' } | null = null

  public async register(email: string, password: string, name: string): Promise<void> {

    interface data_interface {
      email: string,
      password: string
      name: string
    }

    const user_data: data_interface = {
      email: email,
      password: password,
      name: name
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
      if (res["success"]) {
        document.cookie = res["cookie"]
        window.location.href = "/"
        is_login.value = true
      } else {
        console.log("no cookie motherfucker")
      }
    } catch (error) {
      console.error('Error sing up:', error)
    }
  }




  //cookieを更新させるコードを書く
  public async login(email: string, password: string): Promise<void> {

    const email_password = {
      email: email,
      password: password
    }

    try {
      const response: Response = await fetch('http://localhost:8000/user/native_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: import.meta.env.VITE_APP_API_KEY
        },
        body: JSON.stringify(email_password)
      })

      const res = await response.json()
      if (res["success"] && res["cookie"]) {
        document.cookie = res["cookie"]
        window.location.href = '/'
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