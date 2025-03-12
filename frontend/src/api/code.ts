import { code_obj } from "@/interface";

export async function fetch_one_lang_code_from_api(mount: number, lang: string): Promise<Array<code_obj>> {
                try {
                                const response = await fetch(import.meta.env["VITE_API_URL_RETURN_CODE_DATA"], {
                                                method: 'POST',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                },
                                                credentials: 'include',
                                                body: JSON.stringify({ mount, lang }),
                                });

                                if (!response.ok) {
                                                throw new Error(`HTTP error! status: ${response.status}`);
                                }

                                const data = await response.json();
                                console.log(data.code as Array<code_obj>)
                                return data.code;
                } catch (error) {
                                console.error('Error fetching code:', error);
                                throw error;
                }
}

export async function fetch_all_lang_code_from_api(mount: number): Promise<code_obj> {
                try {
                                const response = await fetch(import.meta.env["VITE_API_URL_RETURN_CODE_DATA"], {
                                                method: 'POST',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                },
                                                credentials: 'include',
                                                body: JSON.stringify({ mount, lang: 'all' }),
                                });

                                if (!response.ok) {
                                                throw new Error(`HTTP error! status: ${response.status}`);
                                }

                                const res = await response.json();


                                return res.data;

                } catch (error) {
                                console.error('Error fetching code:', error);
                                throw error;
                }
}