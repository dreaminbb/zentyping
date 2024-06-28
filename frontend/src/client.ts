import {ref} from "vue";

export const is_login: Ref<boolean> = ref(true)

export class user {
    private cookie:string | null = null
    private res:boolean | null = null

    constructor() {
        this.cookie = localStorage.getItem('cookie')
    }

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



}