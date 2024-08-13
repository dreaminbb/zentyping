import {defineStore} from "pinia";
import {token_manager} from "@/services/auth";


export const user_status = defineStore("user_auth", {

    state: (): { is_login: boolean, is_user: boolean, is_admin: boolean } => ({

        is_login: false,
        is_user: false,
        is_admin: false
    }),

    actions: {
        logout(): void {
              new token_manager().logout()
        },

        move_to_login_page(): void {
            window.location.href = 'http://localhost:8000/login'
        },

        async verify_session() {
            const [result] =  await Promise.all([new token_manager().verify_session()])
            this.is_login = result
        },
    }
})

//
// export const user_settings = defineStore("user_settings", {
//
//         state: (): { is_dark_mode: boolean } => ({
//             is_dark_mode: false
//         }),
//
//         actions: {
//             toggle_dark_mode(): void {
//                 this.is_dark_mode = !this.is_dark_mode
//             }
//         }
//     }),
// }
