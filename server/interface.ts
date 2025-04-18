export interface user {
                github_id: string,
                github_user_name:string,
                last_login_time: Date,
                play_info: {
                                total_play_time: number,
                                total_play_count_each_lang: {
                                                python: number,
                                                typescript: number,
                                                rust: number,
                                },
                }
}

export interface original_code_data {
                _id: object,
                id: number,
                code: string,
                author: string, // author is display name
                author_uid: string, // this is github uid and don't add to client response
                lang: string,
}

export interface code_data {
                id: number,
                code: string,
                author: string, // author is display name
                lang: string,
}

export interface code_req {
                mount?: number,
                lang: string,
}

export interface code_res {
                status: number
                message: string,
                code_data: Array<code_data>
}

//exp is on the function create jwt
export interface unsignined_jwt_payload {
                sub: string,
                iat: number,
}

export interface signined_jwt_payload {
                sub: string, // sub is github uid
                github_user_name:string,
                iat: number,
}