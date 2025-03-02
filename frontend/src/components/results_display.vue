<script lang="ts">
import { defineComponent } from 'vue'
import type { result_data_itf } from '@/interface'
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
export default defineComponent({
  name: 'result_view',
  components: { Line },
  props: {
    result_data: {
      type: Object as () => result_data_itf,
      required: true
    }
  },
  setup(props:any) {
    return {
      char_data: {
        labels: Array.from({ length: props.result_data.wpm_arr.length }, (_, i) => `${i + 1}秒`),
        datasets: [
          {
            label: 'WPM',
            data: props.result_data.wpm_arr, // データポイント
            fill: false,
            tension: 0.1,
            borderColor: '#cdd6f4', // Catppuccin color
            backgroundColor: '#cdd6f4' // Catppuccin color
          }
        ]
      },
      chart_options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#cdd6f4' // Catppuccin color
            }
          },
          title: {
            display: true,
            color: '#cdd6f4' // Catppuccin color
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#cdd6f4' // Catppuccin color
            },
            grid: {
              color: '#45475a' // Catppuccin color
            }
          },
          y: {
            ticks: {
              color: '#cdd6f4', // Catppuccin color
              stepSize: Math.max(...props.result_data.wpm_arr) > 100 ? 30 : 20,
              min: Math.min(...props.result_data.wpm_arr) -10,
              max: Math.max(...props.result_data.wpm_arr) + 20
            },
            grid: {
              color: '#45475a' // Catppuccin color
            }
          }
        }
      }
    }
  }
})
</script>

<template>
  <main id="result_main_container">
    <div id="wpm_acc_time_container">
      <div class="wpm_acc_time_class">毎分単語数 {{ result_data.wpm }}</div>
      <div class="wpm_acc_time_class">正入力率 {{ result_data.acc }} %</div>
      <div class="wpm_acc_time_class">時間 {{ result_data.time.toFixed(2) }} 秒</div>
    </div>
    <Line id="line_chart_comp" :data="char_data" :options="chart_options" />
  </main>
</template>

<style>
#result_main_container {
  height: 100%;
  width: 70%;
  margin: 0 auto;
}

#wpm_acc_time_container {
  padding: top 50px;
  top: 0;
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-around;
  font-size: 2rem;
}
#line_chart_comp {
  bottom: 0;
  padding: 0;
  margin: 0 auto;
  width: 80%;
  height: 70%;
}
</style>
