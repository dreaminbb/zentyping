import { ref, type Ref } from 'vue'

export const is_login: Ref<boolean> = ref(false)
export const cookie_exist: Ref<boolean> = ref(false)

export class token_manager {

  // public async verify_session(): Promise<void> {
  //   if (document.cookie) {
  //     try {
  //       const request: Response = await fetch('http://localhost:8000/user/session', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': document.cookie
  //         }
  //       })
  //       const response = await request.json()
  //       if (response["success"]) {
  //         is_login.value = true
  //       }

  //       if (response["cookie"]) {
  //         console.log(response["cookie"])
  //         window.location.reload()
  //       }

  //       if (response["error"] || response["invalid"]) {
  //         is_login.value = false
  //         this.logout()
  //       }
  //       return
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   } else {
  //     console.log("no cookie?")
  //     return
  //   }
  // }

  public logout(): void {
    fetch('http://localhost:8000/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    window.location.href = '/'
  }
}


// ユーザーのアカウント作成、ログイン、ログアウト
export class native_user {

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
      fetch('http://localhost:8000/user/native_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': import.meta.env.VITE_APP_API_KEY,
          // 'dataType': 'json',
        },
        body: JSON.stringify(email_password),
        // credentials: 'include'
      })
        .then(response => {
          if (response.status === 200) {
            console.log("it working")
            window.location.href = 'http://localhost:8000/'
          } else if (response.status === 444) {
            console.log("パスワードまたはユーザー名に誤りがあります");
          } else if (response.status === 446) {
            console.log("ユーザー登録がありません");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
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