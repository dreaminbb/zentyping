import type { fetching_ranking_deta_param_if } from "@/interface";
import type { ranking_data_if } from "@/interface";
export class fetch_from_api {
                base_url: string;
                pra: { level: string; range_from: number; range_to: number };
                error_data: Array<ranking_data_if> = [];
                console_data_sample = {};


                constructor() {
                                this.base_url = 'http://localhost:8000/user/ranking';
                                this.pra = {
                                                level: 'short',
                                                range_from: 0,
                                                range_to: 10
                                };
                                this.console_data_sample = {
                                                'correct_count': 0,
                                                'correct_per_second': [0],
                                                'correct_per_second_num': 0,
                                                'correct_rate': 0,
                                                'id': 0,
                                                'incorrect_count': 0,
                                                'input_per_second': [0],
                                                'input_per_second_num': 0,
                                                'length': 0,
                                                'level': "??",
                                                'name': 'the typer',
                                                'play_count': 0,
                                                'played_at': 'データなし',
                                                'time': 0
                                }
                }

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
                                if (contentType && contentType.includes('application/json')) {
                                                const tmp = JSON.parse(text);
                                                return text ? { 'message': tmp['message'], 'data': tmp['data'] } : {};
                                } else {

                                                return text;
                                }
                }
}