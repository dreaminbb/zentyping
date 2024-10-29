export interface activity_calendar {
    day: string,
    week_number: number,
    day_of_week: string,
    play_count_in_day: number
}

export interface play_history_if {
    'id': number,
    'level': string,
    'time': number,
    'correct_rate': number,
    'correct_count': number,
    'incorrect_count': number,
    'input_per_second_arr': Array<number>
    'correct_per_second': Array<number>,
    'length': number,
    'pun_count': number,
    'played_at': string,
    'play_count': number
}

export interface fetching_ranking_res_if {
    'message': string,
    'deta': Array<ranking_data_if>
}
export interface fetching_ranking_deta_param_if {
    'level': string,
    'range_from': number,
    'range_to': number
}

export interface ranking_data_if {
    "correct_count": number,
    "correct_per_second_arr": Array<number>,
    "correct_per_second_num": number,
    "correct_rate": number
    "id": number,
    "incorrect_count": number,
    "input_per_second_arr": Array<number>,
    "input_per_second_num": number,
    "length": number
    "level": string,
    "name": string,
    "play_count": number,
    "played_at": string,
    "time": number,
}

export interface all_play_history {
    'short': Array<play_history_if>,
    'normal': Array<play_history_if>,
    'long': Array<play_history_if>
}

export interface play_history_formated_if {
    year_history: Array<Array<play_history_if>>,
    month_history: Array<Array<play_history_if>>,
    week_history: Array<Array<play_history_if>>,
    // year_avg_correct_rate: Array<number>,
    // month_avg_correct_rate: Array<number>,
    // week_avg_correct_rate: Array<number>,
}

export interface play_info_chart_option_if {
    responsive: boolean
    maintainAspectRatio: boolean
    plugins: {
        legend: {
            display: boolean
            position: string
        }
        tooltip: {
            enabled: boolean
            mode: string
            intersect: boolean
        }
    }
    hover: {
        mode: string
        intersect: boolean
    }
    scales: {
        x: {
            display: boolean
            title: {
                display: boolean
                text: string
            }
            grid: {
                display: boolean
            }
        }
        y: {
            display: boolean
            max: number
            mix: number
            title: {
                text: string
            }
            grid: {
                display: boolean
            }
        }
        y1: {
            display: boolean
            max: number
            mix: number
            title: {
                text: string
            }
            position: string
        }
    }
}