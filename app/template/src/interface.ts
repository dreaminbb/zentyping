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
    'input_per_second': Array<number>
    'correct_per_second': Array<number>,
    'length': number,
    'pun_count': number,
    'played_at': string,
    'play_count': number
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