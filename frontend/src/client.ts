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
    public async verify_session(): Promise<boolean> {
        if (localStorage.getItem('cookie')) {
            try {
                const request: Response = await fetch("http://localhost:8000/session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": import.meta.env.VITE_APP_API_KEY,
                        "token": JSON.stringify(JSON.parse(this.cookie as string)["jwt_token"]) as string,
                        "type": JSON.parse(this.cookie as string)["type"] as string
                    },
                });
                const res = await request.json()
                const response: string = JSON.stringify(res)
                console.log(response)
                if (res["login"] === true) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                return false
            }
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
                is_login.value = true
                window.location.href = '/account'
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
            console.log(res);
            if (res["cookie"]) {
                const new_cookie = res["cookie"];
                new token_manager().reset_cookie(new_cookie);
                is_login.value = true; // Update is_login value here
                window.location.href = '/'; // Redirect to home page
            } else {
                is_login.value = false; // Set is_login to false if no cookie is returned
            }
        } catch (error) {
            console.log(error);
            is_login.value = false
        }
    }
}

new token_manager().cookie_exit()