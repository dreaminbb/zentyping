import { ref, type Ref } from 'vue'
import { apiKey } from "@/main";

export const is_login: Ref<boolean> = ref(false)

export class token_manager {

    private cookie: string | null = null
    private res: boolean | null = null

    constructor() {
        this.cookie = localStorage.getItem('cookie')
    }


    //cookieが存在するかを確認
    public cookie_exit() {

        if (this.cookie) {
            console.log("token is exist")
            is_login.value = true
            console.log(this.cookie)
            console.log(is_login.value)
            return true
        } else if (!this.cookie) {
            console.log("you have to is_login")
            is_login.value = false
            return false
        } else {
            console.error("error")
        }

    }

    //cookieをAPIに送信
    public async send_cookie(): Promise<void> {
        try {
            const req: Response = await fetch("http://localhost:8000/cookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: apiKey,
                    "Cookies": this.cookie ? `cookie=${this.cookie}` : ''
                },
            })
            console.log(`cookie=${this.cookie}`)

            this.res = await req.json()
            console.log(this.res)

            if (this.res === false) {
                localStorage.removeItem('cookie')
                is_login.value = false
            }

            if (this.res === null) {
                is_login.value = false
            }

        } catch (e) {
            console.error(e)
        }
    }


    public reset_cookie(new_cookie: string) {
        localStorage.removeItem('cookie')
        localStorage.setItem('cookie', JSON.stringify(new_cookie))
        is_login.value = true
    }

    public logout() {
        localStorage.removeItem('cookie')
        is_login.value = false
        window.location.reload()
    }

}


// ユーザーのアカウント作成、ログイン、ログアウト
export class native_user {


    private email_password: { email: string, password: string } | null = null

    public async login(email: string, password: string) {

        this.email_password = {
            email: email,
            password: password
        }

        const res: Response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: apiKey,
            },
            body: JSON.stringify(this.email_password)
        }
        )

        if (res.ok) {
            is_login.value = true
            localStorage.setItem('cookie', res.headers.get('cookie') as string)
        } else {
            console.error("error")
            is_login.value = false
        }
    }


}

new token_manager().cookie_exit()
