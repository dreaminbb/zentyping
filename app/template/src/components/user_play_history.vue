<script lang="ts" setup>
import { ref } from 'vue'
import { user_info } from '@/store/store'
import { LineChart, PieChart } from 'vue-chart-3'


const is_switcher_active = ref<boolean>(true)

const changing_chart = () => {
  is_switcher_active.value = !is_switcher_active.value
  console.log(is_switcher_active.value)
}

const chart_type_index = ref<number>(0)
const chart_type = ref<Array<string>>(['正入力', 'プレイグラフ'])

const display_cps_line_chart = ref<boolean>(false)

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
  }
})

const cps_line_data = ref<object>({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  datasets: [
    {
      data: [8, 0, 5, 7, 6, 7, 6],
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

const play_info_data = ref<object>({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  datasets: [
    {
      type: 'line',
      data:
        [30, 10, 90, 71, 69, 172, 163, 123, 123, 123, 12],
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
      BorderColor: 'rgb(16,105,168)',
      fill: true,
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
  <div id="play_time_count_elm">
    <div id="total_time_display" class="total_result_elms">総時間: {{ formated_time }}</div>
    <div id="total_play_count" class="total_result_elms">プレイ回数: {{ user_info().play_count }}回</div>
    <div id="completed_play_count" class="total_result_elms">プレイ終了回数: {{ user_info().completed_play_count }}
    </div>
  </div>

  <div id="correct_rate_charts_container">
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


  <div id="line_charts_container_view">


    <div id="chart_view_top_bar">
      <div id="chart_display_switcher" @click="changing_chart"
           :class="{chart_display_switcher_active : is_switcher_active ,chart_display_switcher_inactive: !is_switcher_active }">
        <div id="chart_type_display_in_btn">
          {{ chart_type[chart_type_index] }}
        </div>

        <div id="chart_op_open_button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="op_angle_up"
               :class="{active_angle:is_switcher_active , inactive_angle:!is_switcher_active}">
            <path
              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
          </svg>
        </div>
      </div>

      <div id="chart_op_dis" v-if="is_switcher_active" :class="{open_chart_op: is_switcher_active}">
        <div class="chart_ops_elm" @click="is_switcher_active=false; display_cps_line_chart=true; chart_type_index = 0">
          {{ chart_type[0] }}
        </div>
        <div class="chart_ops_elm"
             @click="is_switcher_active=false; display_cps_line_chart=false ; chart_type_index = 1">{{ chart_type[1] }}
        </div>
      </div>


      <div id="chart_button_frame">
        <button class="chart_scale_switch_btn"></button>
        <button class="chart_scale_switch_btn"></button>
        <button class="chart_scale_switch_btn"></button>
      </div>

    </div>

    <div id="line_charts_container">
      <line-chart :chart-data="cps_line_data as any" :options="cps_options as any" class="charts"
                  v-if="display_cps_line_chart" />
      <line-chart :chart-data="play_info_data as any" :options="play_info_options as any" class="charts"
                  v-if="!display_cps_line_chart" />
    </div>
  </div>


  <!--  <div id="correct_rate_container">-->
  <!--    <div id="short_correct_rate" class="correct_rate_display">short: {{ user_info().short_correct_rate }}%</div>-->
  <!--    <div id="normal_correct_rate" class="correct_rate_display">normal: {{ user_info().normal_correct_rate }}%</div>-->
  <!--    <div id="long_correct_rate" class="correct_rate_display">long: {{ user_info().long_correct_rate }}%</div>-->
  <!--  </div>-->


  <!--  <table id="play_history_short_display">-->
  <!--    <tr id="play_history_title_container">-->
  <!--      <th class="play_history_titles">時間</th>-->
  <!--      <th class="play_history_titles">正打率</th>-->
  <!--      <th class="play_history_titles">ミス回数</th>-->
  <!--      <th class="play_history_titles">文字数</th>-->
  <!--      <th class="play_history_titles">毎秒入力</th>-->
  <!--      <th class="play_history_titles">毎秒正入力</th>-->
  <!--    </tr>-->
  <!--    <tr v-for="(history, index) in user_info().play_history_value_short.slice(0,7)" :key="index">-->
  <!--      <td class="play_history_values">{{ history['time'] }}</td>-->
  <!--      <td class="play_history_values">{{ history['correct_rate'] }}</td>-->
  <!--      <td class="play_history_values">{{ history['incorrect_count'] }}</td>-->
  <!--      <td class="play_history_values">{{ history['length'] }}</td>-->
  <!--      <td class="play_history_values">-->
  <!--        {{ Math.floor(history['input_per_second'].reduce((a, b) => a + b, 0) / history['input_per_second'].length * 10) * 10-->
  <!--        }}-->
  <!--      </td>-->
  <!--      <td class="play_history_values">-->
  <!--        {{ Math.floor(history['correct_per_second'].reduce((a, b) => a + b, 0) / history['correct_per_second'].length * 10) / 10-->
  <!--        }}-->
  <!--      </td>-->
  <!--    </tr>-->
  <!--  </table>-->

  <!--  <div id="activity_calender">-->
  <!--    <div id="day_of_week_display">-->
  <!--      <div>日</div>-->
  <!--      <div>火</div>-->
  <!--      <div>月</div>-->
  <!--    </div>-->


  <!--    <table id="calender_body" ref="calender_body">-->
  <!--      <tr v-for="day in 7" id="same_day_of_week" :key="day" ref="day_of_week">-->
  <!--        <td v-for="same_say_of_weeks in 60" :key="same_say_of_weeks" class="active_days">-->
  <!--        </td>-->
  <!--      </tr>-->
  <!--    </table>-->

  <!--    <div id="active_level_sample">-->
  <!--      <div class="active_sample_char">少ない</div>-->
  <!--      <div id="active_level_zero" :style="{background:active_level[0]}" class="active_level_sample_eml"></div>-->
  <!--      <div id="active_level_one" :style="{background:active_level[1]}" class="active_level_sample_eml"></div>-->
  <!--      <div id="active_level_two" :style="{background:active_level[2]}" class="active_level_sample_eml"></div>-->
  <!--      <div id="active_level_three" :style="{background:active_level[3]}" class="active_level_sample_eml"></div>-->
  <!--      <div id="active_level_five" :style="{background:active_level[4]}" class="active_level_sample_eml"></div>-->
  <!--      <div class="active_sample_char">多い</div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style lang="scss" scoped>

:root {
  --main-icon-color: #dabfbf;
  --main--font-color: #f0f0f0;
  --sub--font-color: #808080;
  --active_border_color: rgb(35, 33, 41);
  --diactive--border-color: rgb(40, 39, 48);
}


#play_time_count_elm {
  position: absolute;
  width: 70%;
  height: 15%;
  top: 5%;
  left: 15%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(to top, rgba(171, 128, 255, 0.67), rgba(244, 241, 255, 0.67));
  border-radius: 16px;
  box-shadow: 0 10px 20px 5px rgba(184, 144, 241, 0.5);
  backdrop-filter: blur(17.2px);
  -webkit-backdrop-filter: blur(17.2px);

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


#line_charts_container_view {
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
      width: 15%;
      height: 90%;
      left: 0;
      background: transparent;
      border: #87b1ff 1px solid;
      color: var(--main--font-color);
      justify-content: center;
      align-items: center;
      letter-spacing: 2px;
      padding-left: 5px;


      #chart_type_display_in_btn {
        position: absolute;
        left: 5%;
        width: 70%;
        background: transparent;
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


        #op_angle_up {
          width: 60%;
          fill: #87b1ff;
          transform: rotate(180deg);
        }


        .active_angle {
          animation: angle_rotate_up ease-in-out 0.3s forwards;
        }

        .inactive_angle {
          animation: angle_rotate_down ease-in-out 0.3s forwards;
        }

        @keyframes angle_rotate_up {
          0% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        @keyframes angle_rotate_down {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(180deg);
          }

        }


      }
    }

    #chart_op_dis {
      position: absolute;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(2, 1fr);
      //grid-column-gap: 0px;
      //grid-row-gap: 5px;
      border-radius: 10px 10px 0 0;
      border: #87b1ff 1px solid;
      width: 15%;
      height: 200%;
      top: -200%;
      align-items: stretch;
      background: transparent;
      overflow: hidden;

      .open_chart_op {
        height: 150%;
        width: 100%;
        top: -10%;
      }

      .chart_ops_elm {
        display: flex;
        color: var(--sub--font-color);
        width: 100%;
        height: 100%;
        align-items: center;
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
        border: 1px #986ba4 solid;
        background: transparent;
        border-radius: 10px;
      }
    }
  }

  #line_charts_container {
    position: absolute;
    display: flex;
    bottom: 0;
    height: 80%;
    width: 100%;


    .charts {
      background: transparent;
      position: absolute;
      border: none;
      width: 100%;
      height: 100%;
    }
  }

}

//#play_history {
//  position: absolute;
//  right: 15%;
//  top: 110%;
//  display: grid;
//  background: transparent;
//  width: 70%;
//  height: 60%;
//}

//#play_history_short_display {
//  position: absolute;
//  display: table;
//  top: 35%;
//  right: 5%;
//  width: 90%;
//  height: 60%;
//
//
//  background: linear-gradient(to right, rgb(243, 105, 230), rgb(181, 36, 197));
//  border-radius: 16px;
//  box-shadow: 0 10px 20px 5px rgba(255, 65, 147, 0.5);
//  backdrop-filter: blur(17.2px);
//  -webkit-backdrop-filter: blur(17.2px);
//
//
//  .play_history_titles {
//    color: var(--main--font-color);
//    font-size: 1.5rem;
//  }
//
//  .play_history_values {
//    color: var(--main--font-color);
//    border: 1px solid;
//    font-size: 1.25rem;
//    text-align: center;
//  }
//}

//#activity_calender {
//  position: absolute;
//  display: flex;
//  top: 80%;
//  right: 15%;
//  width: 70%;
//  height: 25%;
//  border: 2px solid;
//  border-image: linear-gradient(to right, var(--red-fellow), var(--pink_red)) 20;
//  border-radius: inherit;
//  justify-content: center;
//  align-items: center;
//
//  //曜日の表示
//  #day_of_week_display {
//    position: absolute;
//    height: 60%;
//    width: 2%;
//    left: 1%;
//    display: grid;
//    grid-template-columns: 1fr;
//    grid-template-rows: repeat(3, minmax(3px, 1fr));
//    grid-row-gap: 10px;
//    color: var(--main--font-color);
//  }
//
//  #day_of_week_display div {
//    display: flex;
//    align-items: center;
//    justify-content: center;
//  }
//
//  //アクティブカレンダーの中身
//  #calender_body {
//    left: 4%;
//    position: absolute;
//    height: 60%;
//    width: 93%;
//    display: grid;
//    grid-column-gap: 5px;
//    grid-row-gap: 5px;
//
//    #same_day_of_week {
//      display: flex;
//      background: transparent;
//      grid-column-gap: 5px;
//    }
//
//    .active_days {
//      width: 100%;
//      height: 100%;
//      display: flex;
//      border: 1px solid;
//      border-radius: 5px;
//      border-color: var(--sub--font-color);
//    }
//
//  }
//
//  #active_level_sample {
//    position: absolute;
//    display: grid;
//    bottom: 10%;
//    right: 10%;
//    height: 5%;
//    grid-template-columns: 2fr repeat(5, 15px) 2fr;
//    grid-template-rows: 15px;
//    grid-column-gap: 15px;
//    grid-row-gap: 10px;
//    align-items: center;
//
//    .active_sample_char {
//      color: var(--main--font-color);
//    }
//
//    .active_level_sample_eml {
//      width: 100%;
//      height: 100%;
//      border: 1px solid;
//      border-radius: 5px;
//      border-color: var(--sub--font-color);
//      padding-left: 10px;
//    }
//  }
//}


</style>