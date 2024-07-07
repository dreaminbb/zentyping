import { ref, type Ref } from 'vue'
import router from './router'
export const is_login: Ref<boolean> = ref(false)
export const cookie_exist: Ref<boolean> = ref(false)


export class token_manager {

    private cookie: string | null = null
    apiKey: string | undefined;

    constructor() {
        this.cookie = localStorage.getItem('cookie')
    }


    //cookieが存在するかを確認
    public cookie_exit() {
        if (this.cookie) {
            console.log(localStorage.getItem('cookie'))
            cookie_exist.value = true
        } else {
            cookie_exist.value = false
            console.log(localStorage.getItem('cookie'))
        }
    }



    //cookieをAPIに送信
    //todo cookieを更新させる not yet
    public async verify_access_token(): Promise<boolean | void> {
        if (localStorage.getItem('cookie')) {
            try {
                const request: Response = await fetch("http://localhost:8000/access", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": import.meta.env.VITE_APP_API_KEY,
                        "token": JSON.stringify(JSON.parse(this.cookie as string)["access_token"]) as string,
                        "type": JSON.parse(this.cookie as string)["type"] as string
                    },
                });
                console.log(JSON.stringify(JSON.parse(this.cookie as string)["access_token"]) as string)
                const res = await request.json()
                console.log(res)
                if (res["login"] === true) {
                    return true
                } if (res["timeout"] === true) {
                    if (await this.updata_token()) {
                        setTimeout(() => {
                            this.verify_access_token()
                        }, 300)
                    }
                }
            } catch (error) {
                return false
            }
        }
        return false
    }



    public async updata_token(): Promise<boolean> {
        if (localStorage.getItem("cookie")) {
            try {
                const request: Response = await fetch("http://localhost:8000/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": import.meta.env.VITE_APP_API_KEY,
                        "token": JSON.stringify(JSON.parse(this.cookie as string)["refresh_token"]) as string,
                        "type": JSON.parse(this.cookie as string)["type"] as string
                    },
                });
                console.log(JSON.stringify(JSON.parse(this.cookie as string)["refresh_token"]) as string, 'refresh_token is might be none')
                const res = await request.json()
                if (res["access_token"]) {
                    const current_cookie = JSON.parse(this.cookie as string)
                    current_cookie["access_token"] = res["access_token"]
                    current_cookie["refresh_token"] = res["refresh_token"]
                    this.reset_cookie(JSON.stringify(current_cookie))
                    return true
                }
            }
            catch (error) {
                console.log(error)
                return false
            }
        } else {
            return false
        }
        return false
    }


    public reset_cookie(new_cookie: string) {
        localStorage.removeItem('cookie')
        localStorage.setItem('cookie', JSON.stringify(new_cookie))
        console.log('removing cookie and setting new cookie...')
    }

    public logout() {
        is_login.value = false
        localStorage.removeItem("cookie")
    }

}


// ユーザーのアカウント作成、ログイン、ログアウト
export class native_user {


    private email_password: { email: string, password: string, type: "native" } | null = null


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
            type: "native"
        }

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user_data)
            })

            const res = await response.json()
            if (res && res["cookie"]) {
                const new_cookie = res["cookie"]
                new token_manager().reset_cookie(new_cookie)
                window.location.href = '/account'
            }
            else {
                console.log(res["message"])
            }

        } catch (error) {
            console.error('Error signg up:', error)
        }
    }



    public async login(email: string, password: string): Promise<void> {
        this.email_password = {
            email: email,
            password: password,
            type: "native"
        }

        try {
            const response: Response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: import.meta.env.VITE_APP_API_KEY,
                },
                body: JSON.stringify(this.email_password)
            });

            const res = await response.json();
            if (res["login"] === true) {
                const new_cookie = res["cookie"];
                new token_manager().reset_cookie(new_cookie);
                is_login.value = true
                router.push({ name: 'home' })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

new token_manager().cookie_exit()