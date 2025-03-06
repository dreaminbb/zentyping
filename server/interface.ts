
export interface code_data {
                _id?: string,
                id: number,
                code: string,
                lang: string,
}

export interface code_req {
                key: string,
                mount?: number,
                lang: string,
}

export interface code_res {
                status: number
                message: string,
                code_data: Array<code_data>
}