import {createApp, provide, ref, type Ref} from 'vue'
import App from '../src/App.vue'
import router from './router'

export const is_login: Ref<boolean> = ref(true)

export const apiKey: string = import.meta.env.VITE_APP_API_KEY;
export const github_client_id: string = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
export const github_oauth_url: string = `https://github.com/is_login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

//アクセストークンが有効かどうかを確認する


//アクセストークンの管理に必要なもの
//1.ローカルストレージにあるcookieの分析
//2. １をAPIに送信
//3.２の結果
//4. ３の結果によってcookieを更新する
//5. ４の結果によってcookieを削除する
//cookieが有効でなかったらログアウトした状態にする

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


            const req:Response = await fetch("http://localhost:8000/cookie", {
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

    public refresh_cookie() {

    }

    public user_logout() {
        localStorage.removeItem('cookie')
        is_login.value = false
    }



}

const cookie_manager = new token_manager()
if (cookie_manager.cookie_exit()) {
    cookie_manager.send_cookie()
}


createApp(App).use(router).mount('#app')
