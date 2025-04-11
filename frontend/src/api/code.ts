import { code_obj } from "@/interface";
import { fetch_with_middleware } from "./middleware/check_dev_mode";

export async function fetch_one_lang_code_from_api(mount: number, lang: string): Promise<Array<code_obj>> {

                try {


                                const url = import.meta.env["VITE_API_URL_RETURN_CODE_DATA"] as string
                                const method: string = 'POST'
                                const body: object = { mount, lang }

                                const data = await fetch_with_middleware(url, method, body);
                                // console.log(config.is_production ?? data.code as Array<code_obj>)
                                return data.code;
                } catch (error) {
                                console.error('Error fetching code:', error);
                                throw error;
                }
}

export async function fetch_all_lang_code_from_api(mount: number): Promise<code_obj> {

                try {
                                const url = import.meta.env["VITE_API_URL_RETURN_CODE_DATA"] as string
                                const method = 'POST' as string
                                const body: object = { mount: mount, lang: 'all' }
                                const data = await fetch_with_middleware(url, method, body);

                                return data.data

                } catch (error) {
                                console.error('Error fetching code:', error);
                                throw error;
                }
}