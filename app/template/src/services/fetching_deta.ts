import type { fetching_ranking_deta_param_if, line_data_if } from "@/interface";
import type { ranking_data_if } from "@/interface";

export class ranking_data_manager {
                base_url: string;
                pra: { level: string; range_from: number; range_to: number };
                error_data: Array<ranking_data_if> = [];
                ranking_data_arr: Array<ranking_data_if> = []
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
                                time: 0
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
                public async fetch_data(prameter: fetching_ranking_deta_param_if): Promise<any> {
                                const queryParams = new URLSearchParams(Object.entries(prameter).map(([key, value]) => [key, value.toString()])).toString();

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
                                                console.log('good res')
                                                this.ranking_data_arr = res['data']
                                                return text ? { 'message': res['message'] } : {};
                                } else {
                                                console.log('bad res')
                                                const tmp_arr = []
                                                for (let i = 0; i < 50; i++) {
                                                                tmp_arr.push(this.sample_ranking_data_obj)
                                                }
                                                return text ? { 'message': res['message'] } : {}
                                }

                }

                // インデックスの値からプレイのデータを取得
                result_data_follow_index(index: number): { pie_chart_data: number, line_chart_value: line_data_if } {
                                const pie_chart_data: number = this.ranking_data_arr[index].correct_rate
                                const line_chart_value: line_data_if = {
                                                time: this.ranking_data_arr[index]['time'],
                                                correct_per_second_arr: this.ranking_data_arr[index].correct_per_second_arr,
                                                input_per_second_arr: this.ranking_data_arr[index].input_per_second_arr
                                }
                                return { pie_chart_data, line_chart_value }
                }
}