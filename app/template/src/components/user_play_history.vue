<script lang="ts" setup>
import { onMounted, type Ref, ref } from 'vue'
import { user_info } from '@/store/store'
import user_active_calender from '@/components/user_activity_calender.vue'
import { LineChart, PieChart } from 'vue-chart-3'
import type { ChartData } from 'chart.js'
import type {
  play_history_formated_if,
  play_history_if,
  play_info_chart_option_if
} from '@/interface'

//１.ユーザーがグラフ選択中に別のところをクリックしたらグラフ変更を閉じる
const is_display_all_play_history = ref<boolean>(false)
const other_area_clicked = ref<boolean>(false)
const is_display_active_calender = ref<boolean>(true)
const is_switcher_active = ref<boolean>(false)
const display_play_info_chart = ref<boolean>(false)
const display_cps_line_chart = ref<boolean>(false)
const display_play_history = ref<boolean>(false)
const is_display_time_scale_btn = ref<boolean>(false)

const chart_type_index = ref<number>(0)
const chart_type = ref<Array<string>>(['アクティブカレンダー', '正入力', 'プレイグラフ', '履歴'])

const time_scale_char = ref(['2024', '今月', '今週'])


// 折れ線グラフのデータ -> プレイ時間
// 棒グラフのデータ -> プレイ回数

const time_scale_class_0 = ref<boolean>(true)
const time_scale_class_1 = ref<boolean>(false)
const time_scale_class_2 = ref<boolean>(false)
const time_scale_obj = ref<Array<Ref<boolean>>>([
  time_scale_class_0,
  time_scale_class_1,
  time_scale_class_2
])
const play_history_count = ref<number>(Object.keys(user_info().play_history_by_play_count).length)
const display_more_btn = ref<boolean>(user_info().play_history_by_play_count.length > 6)

class play_history_format_cal {
  year_correct_rate: number[]
  month_correct_rate: number[]
  week_correct_rate: number[]
  year_play_count: number[]
  month_play_count: number[]
  week_play_count: number[]
  year_play_time: number[]
  month_play_time: number[]
  week_play_time: number[]

  f_play_history = this.format_play_history_data_by_year_month_week(
    user_info().play_history_by_play_count
  )

  format_play_history_data_by_year_month_week(
    play_history: play_history_if[]
  ): play_history_formated_if {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')

    const year_history = play_history.filter(
      (history: any) => history['played_at'].slice(0, 4) === `${year}`
    )
    const month_history = play_history.filter(
      (history: any) => history['played_at'].slice(0, 7) === `${year}-${month}`
    )
    //todo

    //月、年のプレイ履
    // 年 [毎月ごとのに分ける-> 計算12個の配列を作成]
    // 月 [毎日ごとに分ける-> 30~++ の配列を作成]

    //年
    const f_year_history: Array<Array<play_history_if>> = []
    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : `${i}`
      const month_history = year_history.filter(
        (history: any) => history['played_at'].slice(5, 7) === month
      )
      f_year_history.push(month_history)
    }

    //月
    const f_month_history: Array<Array<play_history_if>> = []
    const month_length = new Date(year, parseInt(month), 0).getDate()
    for (let i = 1; i <= month_length; i++) {
      const day = i < 10 ? `0${i}` : `${i}`
      const day_history = month_history.filter(
        (history: any) => history['played_at'].slice(8, 10) === day
      )
      f_month_history.push(day_history)
    }
    //今の週のプレイ履歴があった場合を[月~]を生成
    const today = new Date()
    const start_of_week = new Date(today)
    start_of_week.setDate(today.getDate() - today.getDay())
    
    const days: Array<string> = []
    for (let d = start_of_week; d <= today; d.setDate(d.getDate() + 1)) {
      let day: string = new Date(d).toLocaleDateString()
      //ここで日が1~9の場合は0をいれる
      const day_arr: Array<string> = day.split('/')
      if (10 > parseInt(day_arr[1], 10)) {
        day_arr[1] = '0' + day_arr[1]
      }
      if (10 > parseInt(day_arr[2])) {
        day_arr[2] = '0' + day_arr[2]
      }
      day = day_arr.join('-')
      days.push(day)
    }

    //週のプレイ履歴
    const week_history = play_history.filter((history: any) => days.includes(history['played_at']))
    const f_week_history: Array<Array<play_history_if>> = []
    days.reverse().forEach((day: string) => {
      const play_on_day = week_history.filter((history: any) => history.played_at === day)
      f_week_history.push(play_on_day.length ? play_on_day : [])
    })

    console.log(f_year_history, f_month_history, f_week_history, 'value')

    return {
      year_history: f_year_history,
      month_history: f_month_history,
      week_history: f_week_history
    }
  }

  cal_avg_play_history_value(
    data: Array<Array<play_history_if>>,
    prop: keyof play_history_if
  ): Array<number> {
    return data.map((scale) => {
      if (scale.length === 0) {
        return 0
      }

      const correct_rate_sum = scale.reduce((a: any, b: any) => a + b[prop], 0)
      return correct_rate_sum / scale.length
    })
  }

  //配列の長さを返す
  cal_length_play_history_value(data: Array<Array<play_history_if>>): Array<number> {
    return data.map((scale) => {
      return scale.length
    })
  }

  cal_sum_play_history_value(
    data: Array<Array<play_history_if>>,
    prop: keyof play_history_if
  ): Array<number> {
    return data.map((scale) => {
      if (scale.length === 0) {
        return 0
      }

      const correct_rate_sum = scale.reduce((a: any, b: any) => a + b[prop], 0)
      return correct_rate_sum
    })
  }

  constructor() {
    this.year_correct_rate = this.cal_avg_play_history_value(
      this.f_play_history.year_history,
      'correct_rate'
    )
    this.month_correct_rate = this.cal_avg_play_history_value(
      this.f_play_history.month_history,
      'correct_rate'
    )
    this.week_correct_rate = this.cal_avg_play_history_value(
      this.f_play_history.week_history,
      'correct_rate'
    )
    //todo
    //プレイ回数で配列の長さを足す
    this.year_play_count = this.cal_length_play_history_value(this.f_play_history.year_history)
    this.month_play_count = this.cal_length_play_history_value(this.f_play_history.month_history)
    this.week_play_count = this.cal_length_play_history_value(this.f_play_history.week_history)
    this.year_play_time = this.cal_sum_play_history_value(this.f_play_history.year_history, 'time')
    this.month_play_time = this.cal_sum_play_history_value(
      this.f_play_history.month_history,
      'time'
    )
    this.week_play_time = this.cal_sum_play_history_value(this.f_play_history.week_history, 'time')
  }
}

const tmp = new play_history_format_cal() //何回も使うので一度だけインスタンス化
const this_month_length = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
const month_arr: Array<string> = []
for (let i = 1; i <= this_month_length; i++) {
  const day = `日${i}`
  month_arr.push(day)
}
const labels_arr = [
  ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  month_arr,
  ['日', '月', '火', '水', '木', '金', '土']
]
function regenerate_cps_chart(data_index: number): void {
  //ラベル、スケールの変更
  console.log(data_index, 'data_index')
  if (display_cps_line_chart.value) {
    display_cps_line_chart.value = false
    time_scale_obj.value[data_index].value = true

    for (let i = 0; i < time_scale_obj.value.length; i++) {
      if (i === data_index) {
        time_scale_obj.value[i].value = true
      }
      time_scale_obj.value[i].value = false
    }

    cps_line_data.value['datasets'][0]['data'] = [
      tmp.year_correct_rate,
      tmp.month_correct_rate,
      tmp.week_correct_rate
    ][data_index]
    cps_line_data.value['labels'] = labels_arr[data_index]
    console.log(cps_line_data.value['datasets'][0]['data'], 'value')

    setTimeout(() => {
      display_cps_line_chart.value = true
    }, 100)
  }

  for (let i = 0; i < 3; i++) {
    time_scale_obj.value[i].value = false
  }
  time_scale_obj.value[data_index].value = true
}

function regenerate_play_info_chart(data_index: number): void {
  console.log(display_cps_line_chart.value, 'tohteohh')
  if (display_play_info_chart.value) {
    time_scale_obj.value[data_index].value = true
    display_play_info_chart.value = false

    for (let i = 0; i < time_scale_obj.value.length; i++) {
      if (i === data_index) {
        time_scale_obj.value[i].value = true
      }
      time_scale_obj.value[i].value = false
    }

    const play_count_arr: Array<Array<number>> = [
      tmp.year_play_count,
      tmp.month_play_count,
      tmp.week_correct_rate
    ]
    const play_time_arr: Array<Array<number>> = [
      tmp.year_play_time,
      tmp.month_play_time,
      tmp.week_play_time
    ]

    play_info_data.value['datasets'][0]['data'] = play_count_arr[data_index]
    console.log(play_info_data.value['datasets'][0]['data'], 'datasets')
    play_info_data.value['datasets'][1]['data'] = play_time_arr[data_index] as Array<number>
    play_info_data.value['labels'] = labels_arr[data_index] as Array<string>
    ;(play_info_options.value as play_info_chart_option_if)['scales']['y']['max'] =
      Math.max(...play_time_arr[data_index]) !== 0
        ? Math.max(...play_time_arr[data_index]) +
          Math.floor(Math.max(...play_time_arr[data_index]) * 0.5)
        : 0
    ;(play_info_options.value as play_info_chart_option_if)['scales']['y1']['max'] =
      Math.max(...play_count_arr[data_index]) !== 0
        ? Math.max(...play_count_arr[data_index]) +
          Math.floor(Math.max(...play_count_arr[data_index]) * 0.5)
        : 0

    if (Math.max(...play_count_arr[data_index]) === 0) {
      ;((play_info_options.value as play_info_chart_option_if)['scales']['y']['mix'] = 0),
        ((play_info_options.value as play_info_chart_option_if)['scales']['y1']['mix'] = 0)
    }

    setTimeout(() => {
      display_play_info_chart.value = true
    }, 100)
  }

  for (let i = 0; i < 3; i++) {
    time_scale_obj.value[i].value = false
  }
  time_scale_obj.value[data_index].value = true
}

const changing_chart = () => {
  is_switcher_active.value = !is_switcher_active.value
  console.log(
    is_switcher_active.value,
    is_display_active_calender.value,
    display_cps_line_chart.value,
    display_play_info_chart.value,
    display_play_history.value,
    chart_type_index.value
  )
}

function is_display_all_play_history_func(): void {
  is_display_all_play_history.value = !is_display_all_play_history.value
  is_switcher_active.value = false
}

onMounted(() => {
  console.log('mounted')
  console.log(user_info().short_correct_rate)
})

const short_data = ref<object>({
  datasets: [
    {
      data: user_info().short_correct_rate
        ? [user_info().short_correct_rate, 100 - user_info().short_correct_rate]
        : 0,
      backgroundColor: ['rgb(177,197,206)', 'rgba(124,124,124,0.4)']
    }
  ],
  elements: {
    line: {
      borderWidth: 2
    }
  }
})
const ratio_text_short = {
  id: 'ratio_text',
  beforeDraw(chart: any) {
    const {
      ctx,
      chartArea: { top, width, height }
    } = chart
    ctx.save()
    //チャート描画部分の中央を指定
    ctx.fillRect(width / 2, top + height / 2, 0, 0)
    //フォントのスタイル指定
    ctx.font = 'bold 25px Roboto'
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    //80%という文字列をドーナツチャートの中央部に描画
    ctx.fillText(user_info().short_correct_rate + '%', width / 2, top + height / 2)
  }
}
const short_options = ref<object>({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '90%',
  borderWidth: 0,
  plugins: {
    title: {
      display: true,
      position: 'bottom',
      text: 'short',
      font: {
        size: 20,
        color: 'white',
        weight: 'bold'
      }
    },
    legend: {},
    tooltip: {
      enabled: false,
      callbacks: {}
    },
    customTooltipPlugin: {}
  },
  hover: {
    mode: 'nearest'
  }
})

const normal_data = ref<object>({
  datasets: [
    {
      data: user_info().normal_correct_rate
        ? [user_info().short_correct_rate, 100 - user_info().short_correct_rate]
        : 0,
      backgroundColor: ['rgb(101,62,217)', 'rgba(124,124,124,0.4)']
    }
  ],
  elements: {
    line: {
      borderWidth: 2
    }
  }
})
const normal_options = ref<object>({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '90%',
  borderWidth: 0,
  plugins: {
    title: {
      display: true,
      position: 'bottom',
      text: 'normal',
      font: {
        size: 20,
        color: 'white',
        weight: 'bold'
      }
    },
    legend: {},
    tooltip: {
      enabled: false,
      callbacks: {}
    },
    customTooltipPlugin: {}
  },
  hover: {
    mode: 'nearest'
  },
  animation: {
    duration: 1000, // default animation duration
    easing: 'easeOutBounce' // default easing function
  }
})

const ratio_text_normal = {
  id: 'ratio_text',
  beforeDraw(chart: any) {
    const {
      ctx,
      chartArea: { top, width, height }
    } = chart
    ctx.save()
    //チャート描画部分の中央を指定
    ctx.fillRect(width / 2, top + height / 2, 0, 0)
    //フォントのスタイル指定
    ctx.font = 'bold 25px Roboto'
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    //80%という文字列をドーナツチャートの中央部に描画
    ctx.fillText(user_info().normal_correct_rate + '%', width / 2, top + height / 2)
  }
}

const long_data = ref<object>({
  datasets: [
    {
      data: user_info().long_correct_rate
        ? [user_info().short_correct_rate, 100 - user_info().short_correct_rate]
        : 0,
      backgroundColor: ['rgb(192,154,255)', 'rgba(124,124,124,0.4)']
    }
  ],
  elements: {
    line: {
      borderWidth: 2
    }
  }
})
const ratio_text_long = {
  id: 'ratio_text',
  beforeDraw(chart: any) {
    const {
      ctx,
      chartArea: { top, width, height }
    } = chart
    ctx.save()
    //チャート描画部分の中央を指定
    ctx.fillRect(width / 2, top + height / 2, 0, 0)
    //フォントのスタイル指定
    ctx.font = 'bold 25px Roboto'
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    //80%という文字列をドーナツチャートの中央部に描画
    ctx.fillText(user_info().long_correct_rate + '%', width / 2, top + height / 2)
  }
}
const long_options = ref<object>({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '90%',
  borderWidth: 0,
  plugins: {
    title: {
      display: true,
      position: 'bottom',
      text: 'long',
      font: {
        size: 20,
        color: 'white',
        weight: 'bold'
      }
    },
    legend: {},
    tooltip: {
      enabled: false,
      callbacks: {}
    },
    customTooltipPlugin: {}
  },
  hover: {
    mode: 'nearest'
  },
  animation: {
    duration: 1000, // default animation duration
    easing: 'easeOutBounce' // default easing function
  }
})

const cps_line_data = ref<ChartData<'line'>>({
  labels: [],
  datasets: [
    {
      data: [],
      borderColor: 'rgb(160,109,236)',
      tension: 0.35,
      fill: true, //下を塗りつぶす
      //下を塗りつぶすための設定
      backgroundColor: (context: any) => {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) {
          return null
        }

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(72,58,201,0.5)')
        gradient.addColorStop(1, 'rgba(161,0,255,0)')
        return gradient
      }
    }
  ]
})
const cps_options = ref<object>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    }
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    x: {
      display: true,
      max: 33,
      title: {
        display: false,
        text: 'Month'
      },
      grid: {
        display: false
      }
    },
    y: {
      display: true,
      max: 20,
      title: {
        text: 'Value'
      },
      grid: {
        display: false
      }
    }
  }
})
const play_info_data = ref<ChartData<'line' | 'bar'>>({
  labels: [],
  datasets: [
    {
      type: 'line',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'プレイ回数',
      borderColor: 'rgb(16,105,168)',
      tension: 0.35,
      fill: true, //下を塗りつぶす//下を塗りつぶすための設定

      backgroundColor: (context: any) => {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) {
          return null
        }

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(3,40,61,0.94)')
        gradient.addColorStop(1, 'rgba(161,0,255,0)')

        return gradient
      }
    },
    {
      type: 'bar',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'プレイ時間',
      backgroundColor: (context: any) => {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) {
          return null
        }

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(120,188,232,0.94)')
        gradient.addColorStop(1, 'rgba(162,29,144,0)')
        return gradient
      }
    }
  ]
})

const play_info_options = ref<object>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    }
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    x: {
      display: true,
      title: {
        display: false,
        text: 'Month'
      },
      grid: {
        display: false
      }
    },
    y: {
      display: true,
      max: 0,
      mix: 0,
      title: {
        text: '合計回数'
      },
      grid: {
        display: true
      }
    },
    y1: {
      display: true,
      max: 0,
      mix: 0,
      title: {
        text: '合計時間'
      },
      position: 'right'
    }
  }
})

// const active_level = ref<Array<string>>(['rgb(106,106,108)', 'rgb(207,175,207)', 'rgb(211,38,227)', 'rgb(173,0,239)', 'rgb(194,9,255)'])

function format_time(total_time: number): string {
  const hours: number = Math.floor(total_time / 3600)
  const minutes: number = Math.floor((total_time % 3600) / 60)
  const seconds: number = Math.floor(total_time % 60)
  const formatted_minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formatted_seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
  if (hours < 1) {
    return `${formatted_minutes}:${formatted_seconds}`
  } else {
    return `${hours}:${formatted_minutes}:${formatted_seconds}`
  }
}

const total_time: number = user_info().total_time
const formated_time = ref<string>(format_time(total_time))
</script>

<template>
  <div id="not_table_elms">
    <div id="play_time_count_elm">
      <div id="total_time_display" class="total_result_elms">総時間: {{ formated_time }}</div>
      <div id="total_play_count" class="total_result_elms">
        プレイ回数: {{ user_info().play_count }}回
      </div>
      <div id="completed_play_count" class="total_result_elms">
        プレイ終了回数: {{ user_info().completed_play_count }}
      </div>
    </div>

    <div id="correct_rate_charts_container" @click="other_area_clicked = true">
      <div class="charts_fm">
        <PieChart
          :chart-data="short_data as any"
          :options="short_options"
          :plugins="[ratio_text_short]"
          class="correct_rate_charts"
        />
      </div>
      <div class="charts_fm">
        <PieChart
          :chart-data="normal_data as any"
          :options="normal_options"
          :plugins="[ratio_text_normal]"
          class="correct_rate_charts"
        />
      </div>
      <div class="charts_fm">
        <PieChart
          :chart-data="long_data as any"
          :options="long_options"
          :plugins="[ratio_text_long]"
          class="correct_rate_charts"
        />
      </div>
    </div>

    <div id="charts_container_view">
      <div id="chart_view_top_bar">
        <div
          id="chart_display_switcher"
          :class="{
            chart_display_switcher_active: is_switcher_active,
            chart_display_switcher_inactive: !is_switcher_active
          }"
          @click="changing_chart"
        >
          <div id="chart_type_display_in_btn">
            {{ chart_type[chart_type_index] }}
          </div>

          <div id="chart_op_open_button">
            <svg
              :class="{ active_angle: is_switcher_active, inactive_angle: !is_switcher_active }"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            > 
              <path
                d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
              />
            </svg>
          </div>
        </div>

        <div
          v-if="is_switcher_active"
          id="chart_op_display"
          :class="{ open_chart_op: is_switcher_active }"
        >
          <div
            class="chart_ops_elm"
            @click="
              (is_switcher_active = false),
              (is_display_time_scale_btn = false),
                (is_display_active_calender = true),
                (display_cps_line_chart = false),
                (display_play_info_chart = false),
                (display_play_history = false),
                (chart_type_index = 0)
            "
          >
            {{ chart_type[0] }}
            <!--            アクティブカレンダー -->
          </div>
          <div
            class="chart_ops_elm"
            @click="
              (is_switcher_active = false),
                (is_display_active_calender = false),
                (is_display_time_scale_btn = true),
                (is_switcher_active = false),
                (display_cps_line_chart = true),
                regenerate_cps_chart(0),
                (display_play_info_chart = false),
                (display_play_history = false),
                (chart_type_index = 1)
            "
          >
            {{ chart_type[1] }}
            <!--            正入力-->
          </div>
          <div
            class="chart_ops_elm"
            @click="
              (is_switcher_active = false),
                (is_display_time_scale_btn = true),
                (is_display_active_calender = false),
                (display_cps_line_chart = false),
                (display_play_info_chart = true),
                regenerate_play_info_chart(0),
                (display_play_history = false),
                (chart_type_index = 2)
            "
          >
            {{ chart_type[2] }}
            <!--            プレイグラフ-->
          </div>
          <div
            class="chart_ops_elm"
            @click="
              (is_switcher_active = false),
                (is_display_active_calender = false),
                (is_display_time_scale_btn = true),
                (display_cps_line_chart = false),
                (display_play_info_chart = false),
                (display_play_history = true),
                (chart_type_index = 3)
            "
          >
            {{ chart_type[3] }}
            <!--            履歴-->
          </div>
        </div>

        <div id="chart_button_frame" v-if="is_display_time_scale_btn">
          <button
            ref="time_scale_one"
            :class="{ chart_scale_switch_btn: true, active_time_scale: time_scale_class_0 }"
            @click="
              display_cps_line_chart ? regenerate_cps_chart(0) : void 0,
                display_play_info_chart ? regenerate_play_info_chart(0) : void 0
            "
          >
            {{ time_scale_char[0] }}
          </button>
          <button
            ref="time_scale_two"
            :class="{ chart_scale_switch_btn: true, active_time_scale: time_scale_class_1 }"
            @click="
              display_cps_line_chart ? regenerate_cps_chart(1) : void 0,
                display_play_info_chart ? regenerate_play_info_chart(1) : void 0
            "
          >
            {{ time_scale_char[1] }}
          </button>
          <button
            ref="time_scale_three"
            :class="{ chart_scale_switch_btn: true, active_time_scale: time_scale_class_2 }"
            @click="
              display_cps_line_chart ? regenerate_cps_chart(2) : void 0,
                display_play_info_chart ? regenerate_play_info_chart(2) : void 0
            "
          >
            {{ time_scale_char[2] }}
          </button>
        </div>
      </div>

      <div id="line_charts_container">
        <user_active_calender v-if="is_display_active_calender" id="activity_calender" />

        <line-chart
          v-if="display_cps_line_chart"
          :chart-data="cps_line_data as any"
          :options="cps_options as any"
          class="charts"
        />
        <line-chart
          v-if="display_play_info_chart"
          :chart-data="play_info_data as any"
          :options="play_info_options as any"
          class="charts"
        />
        <div v-if="display_play_history" id="play_history_elm">
          <table>
            <thead id="data_labels">
              <tr>
                <th class="data_labels_shells">日時</th>
                <th class="data_labels_shells">難易度</th>
                <th class="data_labels_shells">時間</th>
                <th class="data_labels_shells">文字数</th>
                <th class="data_labels_shells">正入力</th>
                <th class="data_labels_shells">誤入力</th>
                <th class="data_labels_shells">正入力率</th>
              </tr>
            </thead>

            <thead id="data_dis">
              <tr
                v-for="(history, index) in (user_info().play_history_by_play_count?.slice(0, 6) ??
                [])
                  ? user_info().play_history_by_play_count.slice(0, 6)
                  : []"
                :key="index"
                class="play_history_data_dis"
              >
                <td>{{ history['played_at'] }}</td>
                <td>{{ history['level'] }}</td>
                <td>{{ history['time'] }}</td>
                <td>長さ</td>
                <td>
                  {{ history['correct_count'] }}
                </td>
                <td>
                  {{ history['incorrect_count'] }}
                </td>
                <td>{{ history['correct_rate'] }}</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <button
        v-if="display_play_history && display_more_btn"
        id="see_more_play_history"
        :class="{
          being_active: is_display_all_play_history,
          normal_state: !is_display_all_play_history
        }"
        @click="is_display_all_play_history_func"
      >
        <div>...</div>
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
          />
        </svg>
      </button>
    </div>
  </div>

  <div v-if="is_display_all_play_history" id="all_play_history_fm">
    <table>
      <thead id="data_labels">
        <tr>
          <th class="data_labels_shells">日時</th>
          <th class="data_labels_shells">難易度</th>
          <th class="data_labels_shells">時間</th>
          <th class="data_labels_shells">文字数</th>
          <th class="data_labels_shells">正入力</th>
          <th class="data_labels_shells">誤入力</th>
          <th class="data_labels_shells">正入力率</th>
        </tr>
      </thead>

      <thead>
        <tr
          v-for="(history, index) in user_info().play_history_by_play_count.slice(0, 6)
            ? user_info().play_history_by_play_count.slice(0, play_history_count)
            : []"
          :key="index"
        >
          <td>{{ history['played_at'] }}</td>
          <td>{{ history['level'] }}</td>
          <td>{{ history['time'] }}</td>
          <!--       shell<td class="play_history_values">{{ history['input_per_second'] }}</td>-->
          <!--       shell<td class="play_history_values">{{ history['correct_per_second'] }}</td>-->
          <td>長さ</td>
          <td>
            {{ history['correct_count'] }}
          </td>
          <td>
            {{ history['incorrect_count'] }}
          </td>
          <td>{{ history['correct_rate'] }}</td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style lang="scss">
:root {
  --main-icon-color: #dabfbf;
  --main--font-color: #f0f0f0;
  --sub--font-color: #808080;
  --active_border_color: rgb(35, 33, 41);
  --diactive--border-color: rgb(40, 39, 48);
}

#not_table_elms {
  width: 100%;
  height: 100%;
}

.fog {
  filter: blur(10px);
  background: white;
}

#play_time_count_elm {
  position: absolute;
  width: 70%;
  height: 15%;
  top: 5%;
  left: 15%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: transparent;
  border: var(--main--font-color) 1px solid;
  border-radius: 16px;

  &:hover {
    border-radius: 16px;
    transition: box-shadow 0.4s ease-in-out;
    backdrop-filter: blur(17.2px);
    -webkit-backdrop-filter: blur(17.2px);
    filter: brightness(1.5);
  }

  .total_result_elms {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--main--font-color);
    font-size: 1.5rem;
  }
}

#correct_rate_charts_container {
  position: absolute;
  display: grid;
  width: 70%;
  height: 25%;
  top: 23%;
  left: 15%;
  grid-template-columns: repeat(3, 1fr);
  padding-bottom: 10px;
  grid-column-gap: 15%;
  background: transparent;

  .charts_fm {
    display: flex;
    color: white;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: transparent;

    .cr_percentage {
      position: absolute;
      height: 10%;
      letter-spacing: 3px;
      font-size: 1.5rem;
      top: 0;
      color: var(--main--font-color);
    }

    .correct_rate_charts {
      position: absolute;
      top: 15%;
      display: flex;
      width: 90%;
      height: 90%;
      border-radius: 30px;
    }
  }
}

#charts_container_view {
  position: absolute;
  background: transparent;
  display: flex;
  border: none;
  width: 90%;
  right: 5%;
  height: 50%;
  bottom: 10px;
  border-radius: 10px;

  //チャートのタイムスケール切り替えボタン
  #chart_view_top_bar {
    position: absolute;
    display: flex;
    top: 0;
    height: 10%;
    width: 100%;

    //クリックされた時のボタンのクラス
    .chart_display_switcher_active {
      border-radius: 0 0 10px 10px;
      background: red;
    }

    .chart_display_switcher_inactive {
      border-radius: 10px;
    }

    #chart_display_switcher {
      position: absolute;
      display: flex;
      width: 17%;
      height: 90%;
      left: 0;
      background: transparent;
      border: #87b1ff 1px solid;
      color: var(--main--font-color);
      justify-content: center;
      align-items: center;
      padding-left: 5px;

      &:hover {
        background: #3c3c4c;
      }

      #chart_type_display_in_btn {
        white-space: pre;
        position: absolute;
        left: 5%;
        width: 80%;
        font-size: 0.8rem;
        background: transparent;
        justify-content: center;
        text-align: center;
      }

      //表示するグラフの内容を変更する時に開くボタン
      #chart_op_open_button {
        position: absolute;
        display: flex;
        width: 20px;
        height: 20px;
        text-align: center;
        border-radius: 100px;
        background: rgb(42, 52, 75);
        filter: brightness(1.2);
        justify-content: center;
        top: 25%;
        right: 3%;

        svg {
          display: flex;
          transform: rotate(180deg);
          fill: #5f6ca3;
        }

        .active_angle {
          width: 60%;
          animation: angle_rotate_up ease-in-out 0.2s forwards;
        }

        .inactive_angle {
          width: 60%;
          animation: angle_rotate_down ease-in-out 0.2s forwards;
        }

        @keyframes angle_rotate_up {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(180deg);
          }
        }
        @keyframes angle_rotate_down {
          0% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      }
    }

    #chart_op_display {
      position: absolute;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
      border-radius: 10px 10px 0 0;
      border: #87b1ff 1px solid;
      width: 17%;
      height: 450%;
      top: -450%;
      align-items: stretch;
      background: transparent;
      overflow: hidden;

      .chart_ops_elm {
        display: flex;
        color: var(--sub--font-color);
        width: 100%;
        height: 100%;
        align-items: center;
        border: solid 1px rgba(255, 255, 255, 0.27);
        justify-content: center;
        background: rgba(148, 148, 148, 0.1);
        backdrop-filter: blur(17.2px);
        -webkit-backdrop-filter: blur(17.2px);
        white-space: nowrap;

        &:hover {
          color: var(--main--font-color);
          backdrop-filter: blur(17.2px);
          -webkit-backdrop-filter: blur(17.2px);
          background: rgba(89, 89, 89, 0.5);
        }
      }
    }

    #chart_button_frame {
      position: absolute;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 15px;
      width: 80%;
      height: 90%;
      right: 20px;
      background: transparent;

      .chart_scale_switch_btn {
        width: 100%;
        height: 100%;
        color: var(--main--font-color);
        border: 1px #986ba4 solid;
        background: transparent;
        border-radius: 10px;
        font-size: 1rem;

        &:hover {
          color: var(--sub--font-color);
          background: rgba(0, 9, 33, 0.73);
        }
      }

      .active_time_scale {
        background: rgba(40, 26, 83, 0.73);
      }
    }
  }

  #line_charts_container {
    position: absolute;
    display: flex;
    bottom: 3%;
    height: 83%;
    width: 100%;
    background: transparent;
    backdrop-filter: blur(17.2px);
    -webkit-backdrop-filter: blur(17.2px);

    .charts {
      background: transparent;
      position: absolute;
      border: none;
      width: 100%;
      height: 100%;
    }

    //インポート
    #activity_calender {
      position: absolute;
      display: flex;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      border-radius: inherit;
      justify-content: center;
      align-items: center;

      //曜日の表示
      #day_of_week_display {
        position: absolute;
        height: 50%;
        width: 2%;
        left: 1%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, minmax(3px, 1fr));
        grid-row-gap: 10px;
        color: var(--main--font-color);
      }

      #day_of_week_display div {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      //アクティブカレンダーの中身
      #calender_body {
        left: 3%;
        padding-left: 10px;
        position: absolute;
        height: 40%;
        width: 95%;
        display: grid;
        grid-column-gap: 5px;
        grid-row-gap: 5px;

        #same_day_of_week {
          display: flex;
          background: transparent;
          grid-column-gap: 5px;
        }

        .active_days {
          width: 100%;
          height: 100%;
          display: flex;
          border: 1px solid;
          border-radius: 5px;
          border-color: var(--sub--font-color);
        }
      }

      #active_level_sample {
        position: absolute;
        display: grid;
        bottom: 10%;
        right: 10%;
        height: 5%;
        grid-template-columns: 2fr repeat(5, 15px) 2fr;
        grid-template-rows: 15px;
        grid-column-gap: 15px;
        grid-row-gap: 10px;
        align-items: center;

        .active_sample_char {
          color: var(--main--font-color);
        }

        .active_level_sample_eml {
          width: 100%;
          height: 100%;
          border: 1px solid;
          border-radius: 5px;
          border-color: var(--sub--font-color);
          padding-left: 10px;
        }
      }
    }

    #play_history_elm {
      display: flex;
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 10px;
      border-collapse: collapse; /* セルの境界を重ねる */

      table {
        height: 90%;
        width: 100%;
        border-radius: 30px;
        color: var(--main--font-color);
        background: transparent;

        #data_labels {
          .data_labels_shells {
            background: transparent;
          }
        }

        #data_dis {
          height: 80%;
        }

        tr {
          width: 100%;
          height: 6px;

          td {
            text-align: center;
            color: var(--main--font-color);
            font-size: 1rem;
            border-radius: 10px;
          }
        }

        thead:nth-child(2) tr:nth-child(odd) {
          background: rgba(140, 127, 199, 0.22);
        }
      }
    }
  }

  .normal_state {
    position: absolute;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 10%;
    border-radius: 20px;
    transition: (-50% - 50%);
    padding: 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    border: none;
    color: rgba(255, 255, 255, 0.58);
    letter-spacing: 3px;
    background: rgba(105, 104, 140, 0.22);

    div {
      font-size: 1.25rem;
      padding-right: 20px;
    }

    svg {
      fill: rgba(135, 177, 255, 0.55);
      height: 25px;
    }

    &:hover {
      background: rgba(105, 104, 140, 0.42);
      color: var((--main--font-color));

      svg {
        fill: #87b1ff;
      }
    }
  }

  .being_active {
    position: absolute;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 10%;
    border-radius: 20px;
    transition: (-50% - 50%);
    padding: 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    border: none;
    color: rgba(255, 255, 255, 0.58);
    letter-spacing: 3px;
    background: rgba(105, 104, 140, 0.42);

    div {
      font-size: 1.25rem;
      padding-right: 20px;
    }

    svg {
      fill: #87b1ff;
      height: 25px;
      animation: display_history_angle_rotate_down ease-in-out 0.2s forwards;
    }

    &:hover {
      background: rgba(105, 104, 140, 0.42);
      color: var((--main--font-color));

      svg {
        fill: #87b1ff;
      }
    }

    &:active {
      color: var((--main--font-color));

      svg {
        animation: deactivate_angle ease-in-out 0.2s forwards;
      }
    }
  }

  @keyframes display_history_angle_rotate_down {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }

  @keyframes deactivate_angle {
    0% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#all_play_history_fm {
  position: absolute;
  display: flex;
  height: 90%;
  width: 100%;
  top: 3%;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.25);
  overflow-y: auto;
  border-collapse: collapse; /* セルの境界を重ねる */
  animation: appear 0.5s ease-in-out forwards;

  table {
    width: 100%;
    border-radius: 30px;
    height: 50%;
    bottom: 0;
    border-collapse: collapse;
    color: var(--main--font-color);
    background: transparent;

    .data_labels_shells {
      background: transparent;
      padding-bottom: 5px;
    }

    th,
    td {
      width: 14.285%;
      height: 30px;
      text-align: center;
      color: var(--main--font-color);
      font-size: 1rem;
      border-radius: 10px;
      padding-right: 8px;
    }

    td {
      padding-top: 5px;
      padding-bottom: 5px;
    }

    thead:nth-child(1) {
      background: #3c3c4c;
    }

    thead:nth-child(2) tr:nth-child(odd) {
      overflow: auto;
      background: rgba(0, 0, 0, 0.22);
    }
  }
}
// #del_table_elm {
//   position: absolute;
//   display: flex;
//   left: 0;
//   top: 0;
//   background: #727272;
//   width: 95%;
//   height: 5%;
//   border-radius: 16px;
// }

@media (max-width: 920px) {
  * {
    font-size: 1rem;
    background: transparent;
  }
}
</style>