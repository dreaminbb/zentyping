<script lang="ts" setup>
import { type Ref, ref } from 'vue'
import { user_info } from '@/store/store'
import user_active_calender from '@/components/user_activity_calender.vue'
import { LineChart, PieChart } from 'vue-chart-3'
import type { ChartData } from 'chart.js'


//todo
//１.ユーザーがグラフ選択中に別のところをクリックしたらグラフ変更を閉じる


const is_switcher_active = ref<boolean>(false)
const is_display_all_play_history = ref<boolean>(false)
const other_area_clicked = ref<boolean>(false)
const is_display_active_calender = ref<boolean>(true)
const display_play_info_chart = ref<boolean>(false)
const display_cps_line_chart = ref<boolean>(false)
const display_play_history = ref<boolean>(false)


const chart_type_index = ref<number>(0)
const chart_type = ref<Array<string>>(['アクティブカレンダー', '正入力', 'プレイグラフ', '履歴'])

const time_scale_char = ref(['2024', '今月', '今週'])
const cps_data_year = ref<Array<number>>([0, 4, 3, 5, 1, 2, 4, 5, 6, 4, 2, 5])
const cps_data_month = ref<Array<number>>([1, 5, 3, 5, 3, 2, 5, 5, 5, 5, 5, 5])
const cps_data_day = ref<Array<number>>([2, 7, 6, 7, 8, 8, 7, 6, 7, 8, 6])
const data_cps_data_arr = [cps_data_year.value, cps_data_month.value, cps_data_day.value]

const data_arr_play_info: Array<Array<Array<number>>> = [[[33, 55, 11, 55, 33, 66, 77, 44, 33, 55], [44, 11, 44, 22, 11, 55, 11, 55, 22, 11]], [[222, 111, 234, 123, 413, 533, 443, 523, 431, 211, 344, 244, 233], [22, 123, 345, 12, 33, 413, 66, 33, 22, 55, 33, 11, 66]]]

const time_scale_class_0 = ref<boolean>(true)
const time_scale_class_1 = ref<boolean>(false)
const time_scale_class_2 = ref<boolean>(false)
const time_scale_obj = ref<Array<Ref<boolean>>>([time_scale_class_0, time_scale_class_1, time_scale_class_2])


function regenerate_chart(data_index: number) {
  if (display_cps_line_chart.value) {
    display_cps_line_chart.value = false
    cps_line_data.value['datasets'][0]['data'] = data_cps_data_arr[data_index]

    setTimeout(() => {
      display_cps_line_chart.value = true
    }, 100)
  }
  if (display_play_info_chart.value) {
    display_play_info_chart.value = false
    play_info_data.value['datasets'][0]['data'] = data_arr_play_info[0][data_index]
    play_info_data.value['datasets'][1]['data'] = data_arr_play_info[1][data_index]
    setTimeout(() => {
      display_play_info_chart.value = true
    }, 100)
  }

  for (let i = 0; i < 3; i++) {
    time_scale_obj.value[i].value = false
  }
  time_scale_obj.value[data_index].value = true
}

if (is_display_all_play_history.value) {
  addEventListener('click', () => {
    is_display_all_play_history.value = false
  })
}

const changing_chart = () => {
  is_switcher_active.value = !is_switcher_active.value
  console.log(is_switcher_active.value, is_display_active_calender.value, display_cps_line_chart.value, display_play_info_chart.value, display_play_history.value, chart_type_index.value)
}

const is_display_all_play_history_func = () => {
  is_display_all_play_history.value = !is_display_all_play_history.value
}


//
// function click_other_area_close_chart_op(event: MouseEvent) {
//   if (other_area_clicked.value) {
//     is_switcher_active.value = false
//   }
// }

// onMounted(() => {
//   window.addEventListener('click', click_other_area_close_chart_op)
// })
// onBeforeUnmount(() => {
//   window.removeEventListener('click', click_other_area_close_chart_op)
// })


const calender_body = ref<HTMLElement | null>(null)
const active_level = ref<Array<string>>(['rgb(237,227,239)', 'rgb(207,175,207)', 'rgb(248,159,255)', 'rgb(173,0,239)', 'rgb(194,9,255)'])

// 登録日のフォーマット方法->2024/08/03

const short_data = ref<object>({
  datasets: [
    {
      data: user_info().short_avg_correct_rate ? [user_info().short_avg_correct_rate, 100 - user_info().short_avg_correct_rate] : 0,
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
    const { ctx, chartArea: { top, width, height } } = chart
    ctx.save()
    //チャート描画部分の中央を指定
    ctx.fillRect(width / 2, top + (height / 2), 0, 0)
    //フォントのスタイル指定
    ctx.font = 'bold 25px Roboto'
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    //80%という文字列をドーナツチャートの中央部に描画
    ctx.fillText(user_info().short_avg_correct_rate + '%', width / 2, top + (height / 2))
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
      data: user_info().normal_avg_correct_rate ? [user_info().short_avg_correct_rate, 100 - user_info().short_avg_correct_rate] : 0,
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
    const { ctx, chartArea: { top, width, height } } = chart
    ctx.save()
    //チャート描画部分の中央を指定
    ctx.fillRect(width / 2, top + (height / 2), 0, 0)
    //フォントのスタイル指定
    ctx.font = 'bold 25px Roboto'
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    //80%という文字列をドーナツチャートの中央部に描画
    ctx.fillText(user_info().normal_avg_correct_rate + '%', width / 2, top + (height / 2))
  }
}

const long_data = ref<object>({
  datasets: [
    {
      data: user_info().long_avg_correct_rate ? [user_info().short_avg_correct_rate, 100 - user_info().short_avg_correct_rate] : 0,
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
    const { ctx, chartArea: { top, width, height } } = chart
    ctx.save()
    //チャート描画部分の中央を指定
    ctx.fillRect(width / 2, top + (height / 2), 0, 0)
    //フォントのスタイル指定
    ctx.font = 'bold 25px Roboto'
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    //80%という文字列をドーナツチャートの中央部に描画
    ctx.fillText(user_info().long_avg_correct_rate + '%', width / 2, top + (height / 2))
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
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  datasets: [
    {
      data: [0, 4, 3, 5, 1, 2, 4, 5, 6, 4, 2, 5],
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
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  datasets: [
    {
        type: 'line',
      data: [100, 90, 112, 121, 122, 133, 151, 122, 122, 122, 122],
      borderColor: 'rgb(16,105,168)',
      tension: 0.35,
      fill: true, //下を塗りつぶす//下を塗りつぶすための設定

      backgroundColor:
        (context: any) => {
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
      data: [160, 90, 112, 121, 122, 133, 151, 122, 122, 122, 122],
      backgroundColor:
        (context: any) => {
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
      max: 200,
      title: {
        text: '月の合計回数'
      },
      grid: {
        display: true
      }
    },
    y1: {
      display: true,
      max: 500,
      title: {
        text: '月の合計'
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
      <div id="total_time_display" class="total_result_elms">総時間: {{ formated_time }}
      </div>
      <div id="total_play_count" class="total_result_elms">プレイ回数: {{ user_info().play_count }}回</div>
      <div id="completed_play_count" class="total_result_elms">プレイ終了回数: {{ user_info().completed_play_count }}
      </div>
    </div>

    <div id="correct_rate_charts_container" @click="other_area_clicked = true">
      <div class="charts_fm">
        <PieChart :chart-data="short_data as any" :options="short_options"
                  :plugins="[ratio_text_short]"
                  class="correct_rate_charts" />
      </div>
      <div class="charts_fm">
        <PieChart :chart-data="normal_data as any" :options="normal_options"
                  :plugins="[ratio_text_normal]" class="correct_rate_charts" />
      </div>
      <div class="charts_fm">
        <PieChart :chart-data="long_data as any" :options="long_options"
                  :plugins="[ratio_text_long]" class="correct_rate_charts" />
      </div>
    </div>


    <div id="charts_container_view">
      <div id="chart_view_top_bar">
        <div id="chart_display_switcher"
             :class="{chart_display_switcher_active : is_switcher_active ,chart_display_switcher_inactive: !is_switcher_active }"
             @click="changing_chart">
          <div id="chart_type_display_in_btn">
            {{ chart_type[chart_type_index] }}
          </div>


          <div id="chart_op_open_button">
            <svg :class="{active_angle:is_switcher_active , inactive_angle:!is_switcher_active}" viewBox="0 0 448 512"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </div>
        </div>

        <div v-if="is_switcher_active" id="chart_op_display" :class="{open_chart_op: is_switcher_active}">
          <div class="chart_ops_elm"
               @click="is_switcher_active=false; is_display_active_calender=true; display_cps_line_chart=false; display_play_info_chart=false; display_play_history=false; chart_type_index = 0">
            {{ chart_type[0] }}
            <!--            アクティブカレンダー -->
          </div>
          <div class="chart_ops_elm"
               @click="is_switcher_active=false; is_display_active_calender=false; display_cps_line_chart=true; display_play_info_chart =false; display_play_history=false; chart_type_index = 1">
            {{ chart_type[1] }}
            <!--            正入力-->
          </div>
          <div class="chart_ops_elm"
               @click="is_switcher_active=false; is_display_active_calender=false; display_cps_line_chart=false; display_play_info_chart=true; display_play_history=false; chart_type_index=2">
            {{ chart_type[2] }}
            <!--            プレイグラフ-->
          </div>
          <div class="chart_ops_elm"
               @click="is_switcher_active=false; is_display_active_calender=false; display_cps_line_chart=false; display_play_info_chart=false; display_play_history=true; chart_type_index=3">
            {{ chart_type[3] }}
            <!--            履歴-->
          </div>
        </div>


        <div id="chart_button_frame">
          <button ref="time_scale_one"
                  :class="{chart_scale_switch_btn:true ,active_time_scale:time_scale_class_0}"
                  @click="regenerate_chart(0)">{{ time_scale_char[0]
            }}
          </button>
          <button ref="time_scale_two"
                  :class="{chart_scale_switch_btn:true ,active_time_scale:time_scale_class_1}"
                  @click="regenerate_chart(1)">{{ time_scale_char[1]
            }}
          </button>
          <button ref="time_scale_three"
                  :class="{chart_scale_switch_btn:true ,active_time_scale:time_scale_class_2}"
                  @click="regenerate_chart(2)">{{ time_scale_char[2]
            }}
          </button>
        </div>

      </div>

      <div id="line_charts_container">

        <user_active_calender v-if="is_display_active_calender" id="activity_calender" />

        <line-chart v-if="display_cps_line_chart" :chart-data="cps_line_data as any" :options="cps_options as any"
                    class="charts" />
        <line-chart v-if="display_play_info_chart" :chart-data="play_info_data as any"
                    :options="play_info_options as any"
                    class="charts" />
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


            <thead>
            <tr v-for="(history, index) in user_info().play_history_value_short.slice(0,8)" :key="index">
              <td>{{ history['played_at'] }}</td>
              <td>{{ history['difficulty'] }}</td>
              <td>{{ history['time'] }}</td>
              <td>長さ</td>
              <td>
                {{ Math.floor(history['input_per_second'].reduce((a, b) => a + b, 0) / history['input_per_second'].length * 10) * 10
                }}
              </td>
              <td>
                {{ Math.floor(history['correct_per_second'].reduce((a, b) => a + b, 0) / history['correct_per_second'].length * 10) / 10
                }}
              </td>
              <td>{{ history['correct_rate'] }}</td>
            </tr>
            </thead>
          </table>
        </div>
      </div>

      <button v-if="display_play_history" id="see_more_play_history"
              :class="{being_active: is_display_all_play_history , normal_state:!is_display_all_play_history}"
              @click="is_display_all_play_history_func(); is_switcher_active=false">

        <div>もっと見る...</div>
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
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
        v-for="(history, index) in user_info().play_history_value_short.slice(0,user_info().play_history_value_short.length)"
        :key="index">
        <td>{{ history['played_at'] }}</td>
        <td>{{ history['difficulty'] }}</td>
        <td>{{ history['time'] }}</td>
        <!--       shell<td class="play_history_values">{{ history['input_per_second'] }}</td>-->
        <!--       shell<td class="play_history_values">{{ history['correct_per_second'] }}</td>-->
        <td>長さ</td>
        <td>
          {{ Math.floor(history['input_per_second'].reduce((a, b) => a + b, 0) / history['input_per_second'].length * 10) * 10
          }}
        </td>
        <td>
          {{ Math.floor(history['correct_per_second'].reduce((a, b) => a + b, 0) / history['correct_per_second'].length * 10) / 10
          }}
        </td>
        <td>{{ history['correct_rate'] }}</td>
      </tr>
      </thead>
    </table>

    <button id="del_table_elm"></button>
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
      //grid-column-gap: 0px;
      //grid-row-gap: 5px;
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
        background: rgba(0, 9, 33, 0.73);
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
      table-layout: fixed;

      table {
        width: 100%;
        border-radius: 30px;
        height: 90%;
        border-collapse: collapse;
        color: var(--main--font-color);
        background: transparent;


        .data_labels_shells {
          background: transparent;
        }

        th, td {
          width: 14.285%;
          text-align: center;
          color: var(--main--font-color);
          font-size: 1.25rem;
          border-radius: 10px;
          padding-right: 8px;
        }

        thead:nth-child(2) tr:nth-child(odd) {
          overflow: auto;
          background: rgba(105, 104, 140, 0.22);
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
      fill: rgba(135, 177, 255, 0.55);;
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
    background: rgba(105, 104, 140, 0.22);

    div {
      font-size: 1.25rem;
      padding-right: 20px;
    }


    svg {
      fill: #3c3c4c;
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
  width: 1000px;
  height: 600px;
  top: 15%;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.25);
  overflow: auto;
  border-collapse: collapse; /* セルの境界を重ねる */

  animation: appear 0.5s ease-in-out forwards;


  table {
    width: 100%;
    border-radius: 30px;
    height: 100%;
    border-collapse: collapse;
    color: var(--main--font-color);
    background: transparent;


    .data_labels_shells {
      background: transparent;
    }


    th, td {
      width: 14.285%;
      text-align: center;
      color: var(--main--font-color);
      font-size: 1.25rem;
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


  button {
    position: absolute;
    display: flex;
    top: -100px;
    right: 0;
    background: #9ba4f3;
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 920px) {
  * {
    font-size: 1rem;
    background: transparent;
  }

}
</style>