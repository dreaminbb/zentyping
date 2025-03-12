import 'dotenv/config';
import { undefined } from 'zod';

const from_env = {
        DB_URL: process.env.DB_URL ?? undefined,
        DB_NAME: process.env.DB_NAME ?? undefined,
        SITE_ORIGIN: process.env.SITE_ORIGIN ?? undefined,
        API_HOST_PORT: process.env.API_HOST_PORT ?? undefined,
        API_HOST_URL: process.env.API_HOST_URL ?? undefined,
        PYTHON_COLLECTION_NAME: process.env.PYTHON_COLLECTION_NAME ?? undefined,
        TS_COLLECTION_NAME: process.env.TS_COLLECTION_NAME ?? undefined,
	RUST_COLLECTION_NAME: process.env.RUST_COLLECTION_NAME ?? undefined,
        PRODUCTION: process.env.PRODUCTION ?? undefined
}
function is_available(): boolean {
        // from_env 内のすべての値をチェック
        for (const [key, value] of Object.entries(from_env)) {
                if (value === undefined) {
                        console.error(`Environment variable ${key} is not defined.`);
                        return false;
                }
        }
        return true;
}
// 呼び出してチェック
export const config = is_available() ? from_env : process.exit(1);

export const available_code_list: Array<string> = ['python','rust', 'typescript']

export const error_code_data = {
        _id: 'error',
        id: 0,
        code: "sorry , error happend in server and ofcourse we did't want it",
        lang: 'error',
}
