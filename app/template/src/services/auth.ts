import {user_status} from "@/store/store";

export class session_manager {

    public async  verify_session(): Promise<boolean> {
        if (document.cookie) {
            try {
                fetch('http://localhost:8000/session', {
                    method: 'POST',
                    "credentials": 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        user_status().is_login = data["session"] as boolean
                        if (data["session"]) {
                            return
                        } else if (data["error"]) {
                            return
                        }
                    })
            } catch (error) {
                console.error('Error verifying session:', error)
                return false
            }
        } else {
            return false
        }
        return false
    }


    logout(): void {
        fetch('http://localhost:8000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data =>{
                user_status().is_login = data["logout"] as boolean
            })
        setInterval(() => {
            window.location.reload()
        }, 800)
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
            fetch('http://localhost:8000/native_register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user_data)
            })
                .then(response => response.json())
                .then(data => {
                    user_status().is_login = data["success"] as boolean
                })
            window.location.href = 'http://localhost:8000/'
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
            fetch('http://localhost:8000/native_login', {
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