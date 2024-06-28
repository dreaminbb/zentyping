import {createApp, provide, ref, type Ref} from 'vue'
import App from '../src/App.vue'
import router from './router'


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



// const cookie_manager = new token_manager()
// if (cookie_manager.cookie_exit()) {
//     console.log(is_login.value)
//     cookie_manager.send_cookie()
// }


createApp(App).use(router).mount('#app')
