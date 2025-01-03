export interface code_obj_type {
    code: string,
    url: string,
}

export interface store_code_type {
    'python': Array<code_obj_type> | null | undefined,
    'rust': Array<code_obj_type> | null | undefined,
    'typescript': Array<code_obj_type> | null | undefined
}