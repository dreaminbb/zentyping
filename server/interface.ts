export interface user {
                _id?: string,
                github_id: string,
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
export interface code_data {
                _id?: string,
                id: number,
                code: string,
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
                iat: number,
}