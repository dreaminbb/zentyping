import { createApp } from 'vue'
import App from '../App.vue'
import router from './router'
import { is_login } from './auth'


export const apiKey: string = import.meta.env.VITE_APP_API_KEY
export const github_client_id: string = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
export const github_oauth_url: string = `https://github.com/is_login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

createApp(App).use(router).mount('#app')

//最後に離れた時間をサーバーに送信
// window.addEventListener('beforeunload', ():void => {
//  fetch("http://localhost:8080/user/exit",{
//    method: 'POST',
//    headers: {
//      'Content-Type':apiKey,
//      "Token" : JSON.parse(localStorage.getItem("cookie") as string)['refresh_token'] as string,
//      Authorization: JSON.stringify(JSON.parse(localStorage.getItem("cookie") as string)["refresh_token"]) as string ,
//    },
//  })
// })
const verify_session = async (): Promise<void> => {
    if (document.cookie) {
        try {
            fetch('http://localhost:8000/user/session', {
                method: 'POST',
                // "credentials": 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data["session"]) {
                        console.log("session is valid")
                        is_login.value = true
                    } else if (!data["session"]) {
                        console.log("session is timeout")
                        is_login.value = false
                    } else if (data["error"]) {
                        console.log("sometihnnig went worng")
                        is_login.value = false
                    }
                })
        } catch (error) {
            console.error('Error verifying session:', error)
        }
    } else {
        return
    }
}
verify_session()