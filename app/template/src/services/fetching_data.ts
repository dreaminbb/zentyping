import type { fetching_ranking_data_param_if } from "@/interface";
import type { ranking_data_if } from "@/interface";

export class ranking_data_manager {
                base_url: string;
                pra: { level: string; range_from: number; range_to: number };
                error_data: Array<ranking_data_if> = [];
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
                                pun_count: 0
                }

                constructor() {
                                this.base_url = 'http://localhost:8000/user/ranking';
                                this.pra = {
                                                level: 'short',
                                                range_from: 0,
                                                range_to: 10
                                };
                }


                // APIからデータを取得
                public async fetch_data(parameter: fetching_ranking_data_param_if): Promise<any> {
                                const queryParams = new URLSearchParams(Object.entries(parameter).map(([key, value]) => [key, value.toString()])).toString();

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
                                console.log(res)
                                if (contentType && contentType.includes('application/json') && status_code === 200) {
                                                this.ranking_data_obj[parameter['level'] as 'short' | 'normal' | 'long'] = res['data']
                                                return text ? { 'message': res['message'], 'data': res['data'] } : {};
                                } else {
                                                console.log('bad res')
                                                const tmp_arr = []
                                                for (let i = 0; i < 50; i++) {
                                                                tmp_arr.push(this.sample_ranking_data_obj)
                                                }
                                                return text ? { 'message': res['message'] } : {}
                                }

                }
}