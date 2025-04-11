export interface code_obj {
    code: string,
    lang: string,
    author: string,
}

export interface jwt_payload {
    sub: string,
    exp: number,
    iat: number
}

export interface store_code_type {
    'python': Array<code_obj> | null,
    'rust': Array<code_obj> | null,
    'typescript': Array<code_obj> | null
}

export interface result_data_itf {
    wpm: number;
    acc: number;
    time: number;
    wpm_arr: Array<number>
}