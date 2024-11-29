import type { fetching_ranking_data_param_if } from "@/interface";
import type { ranking_data_if } from "@/interface";
import { user_info } from "@/store/store";

export class ranking_data_manager {
                base_url: string;
                client_raking: number | null = null;
                error_data: Array<ranking_data_if> = [];
                ranking_data_border: {
                                'short': number
                                'normal': number
                                'long': number
                } = {
                                                'short': 0,
                                                'normal': 0,
                                                'long': 0
                                }

                ranking_data_obj: {
                                'short': Array<ranking_data_if>,
                                'normal': Array<ranking_data_if>,
                                'long': Array<ranking_data_if>
                } = {
                                                'short': [],
                                                'normal': [],
                                                'long': []
                                }
                sample_ranking_data_obj: ranking_data_if = {
                                correct_count: 0,
                                correct_per_second_arr: [0],
                                correct_per_second_num: 0,
                                correct_rate: 0,
                                id: 0,
                                incorrect_count: 0,
                                input_per_second_arr: [0],
                                input_per_second_num: 0,
                                length: 0,
                                level: 'short',
                                name: 'someone',
                                play_count: 0,
                                played_at: 'the time',
                                time: 0,
                                pun_count: 0,
                                ranking: 0
                }

                constructor() {
                                this.base_url = 'http://localhost:8000/user/ranking';
                }

                private search_user_by_name(target_user_name: string, level: string): number | null {
                                const target_level: Array<ranking_data_if> = this.ranking_data_obj[level as 'short' | 'normal' | 'long']
                                const value_obj = target_level.find((item) => item.name.includes(target_user_name))
                                return value_obj ? value_obj.ranking as number + 1 : null
                }




                public async format_add_ranking_arr_dat(params: Array<ranking_data_if> | null, level: string) {
                                const terget_arr = this.ranking_data_obj[level as keyof typeof this.ranking_data_obj]

                                if (params) {
                                                for (let i = 0; i < params.length; i++) {
                                                                terget_arr.push(params[i])
                                                }
                                }
                                this.ranking_data_border[level as keyof typeof this.ranking_data_border] = terget_arr.length
                                this.ranking_data_obj[level as keyof typeof this.ranking_data_obj].sort((a, b) => a.ranking - b.ranking)
                }


                public async fetch_data(parameter: fetching_ranking_data_param_if): Promise<void> {

                                const queryParams = new URLSearchParams(Object.entries(parameter).map(([key, value]) => [key, value != null ? value.toString() : ''])).toString();

                                const response = await fetch(`${this.base_url}?${queryParams}`, {
                                                method: 'GET',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                }
                                });

                                // レスポンスのステータStatus: 400
                                const text = await response.text();

                                if (!response.ok) {
                                                throw new Error(`Network response was not ok: ${text}`);
                                }


                                // レスポンスをJSONとして解析
                                const contentType = response.headers.get('Content-Type');
                                const status_code = response.status
                                const res = JSON.parse(text);

                                if (contentType && contentType.includes('application/json') && status_code === 200) {
                                                const data: Array<ranking_data_if> = await res['range']
                                                const target: Array<ranking_data_if> = await res['target']
                                                console.log(target)
                                                
                                                const level: string = parameter['level']
                                                this.format_add_ranking_arr_dat(
                                                                data ? data : null,
                                                                level
                                                )

                                                this.client_raking = user_info().user_name ? this.search_user_by_name(user_info().user_name, parameter.level) : null
                                                console.log(this.client_raking)

                                                return
                                } else {
                                                const tmp_arr = []
                                                for (let i = 0; i < 50; i++) {
                                                                tmp_arr.push(this.sample_ranking_data_obj)
                                                }
                                                return
                                }

                }
}
