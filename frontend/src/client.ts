import { ref, type Ref } from 'vue'

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
    public async verify_settion() {
        const request: Response = await fetch("http://localhost:8000/cookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: import.meta.env.VITE_APP_API_KEY,
                "Cookies": this.cookie ? `cookie=${this.cookie}` : '',
                credentials: 'include',
                "type": JSON.parse(this.cookie as string)["type"] as string
            },
        });

        const res = await request.json();
        if (res["login"] === true) {
            is_login.value = true;
            cookie_exist.value = true;
        }
        else {
            is_login.value = false;
            cookie_exist.value = false;
        }
    }


    public reset_cookie(new_cookie: string) {
        localStorage.removeItem('cookie')
        localStorage.setItem('cookie', JSON.stringify(new_cookie))
        console.log('removing cookie and setting new cookie...')
    }

    public logout() {
        is_login.value = false
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
        }

        const user_data: data_interface = {
            email: email,
            password: password,
            name: name
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
            console.log(res)
            if (res && res["cookie"]) {
                const new_cookie = res["cookie"]
                new token_manager().reset_cookie(new_cookie)
                is_login.value = true
                console.log(is_login.value)
            }
            else {
                console.log(res["message"])
            }

        } catch (error) {
            console.error('Error signg up:', error)
        }
    }



    public async login(email: string, password: string) {


        if (!localStorage.getItem('cookie')) {

            this.email_password = {
                email: email,
                password: password,
                type: "native"
            }

            const response: Response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: import.meta.env.VITE_APP_API_KEY,
                },
                body: JSON.stringify(this.email_password)
            }
            )

            const res = await response.json()
            if (res["cookie"]) {
                const new_cookie = res["cookie"]
                new token_manager().reset_cookie(new_cookie)
                is_login.value = true
                window.location.href = '/'
            } else {
                console.error("error")
            }
        }
    }
}

new token_manager().cookie_exit()
new token_manager().verify_settion()