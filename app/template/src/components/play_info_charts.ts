import { defineComponent, ref, type PropType, type Ref } from 'vue';
import { Chart as ChartJS, registerables, LineController, Title, type ChartData, type ChartOptions } from 'chart.js';
import type { ranking_data_if } from '@/interface'
import { LineChart, PieChart } from 'vue-chart-3';

ChartJS.register(...registerables);

export const pie_chart = defineComponent({
  components: {
    PieChart: PieChart,
  },
  props: {
    chart_data: {
      type: Number,
      required: true
    },
  },
  setup(props: { chart_data: number }) {

    if (props.chart_data === undefined) {
      throw new Error('correct_rate is undefined');
    }
    console.log('nothing undefind in pie chart')

    const correct_rate = ref<number>(props.chart_data);
    const data = ref({
      labels: ['correct', 'nobisiro'],
      datasets: [
        {
          data: [correct_rate.value, 100 - correct_rate.value],
          backgroundColor: ['rgba(134, 95, 255, 0.2)', 'transparent'],
        },
      ],

      elements: {
        line: {
          borderWidth: 0
        }
      }
    });

    const options = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
        },
        customTooltipPlugin: {},
      },
    });

    return {
      data,
      options
    };
  },
  template: `
    <PieChart :chart-data="data" :options="options" />
  `,
});


export const line_chart = defineComponent({
  components: {
    LineChart: LineChart,
  },
  props: {
    chart_data: {
      type: Object as PropType<ranking_data_if>,
      required: true
    }
  },
  setup(props: { chart_data: ranking_data_if }) {

    if (Object.values(props.chart_data).includes(undefined)) {
      const undefinedKeys = Object.keys(props.chart_data).filter(key => (props.chart_data as any)[key] === undefined);
      console.error('Undefined keys in chart_data:', undefinedKeys);
      throw new Error('chart_data contains undefined values');
    }
    console.log('nothing undefind in line chart')

    const time: number = props.chart_data.time;
    const correct_per_second_arr: Array<number> = props.chart_data.correct_per_second_arr
    const input_per_second_arr: Array<number> = props.chart_data.input_per_second_arr
    const time_format: Array<number> = []
    const formated_input_per_second_arr: Array<number> = []
    const formated_correct_per_second_arr: Array<number> = []


    for (let i = 1; i < correct_per_second_arr.length / 10; i++) {
      formated_correct_per_second_arr.push(Math.round(correct_per_second_arr[i * 10] * 100) / 100)
      formated_input_per_second_arr.push(Math.round(input_per_second_arr[i * 10] * 100) / 100)
    }

    formated_correct_per_second_arr.push(Math.round(correct_per_second_arr[correct_per_second_arr.length - 1] * 100) / 100)
    formated_input_per_second_arr.push(Math.round(input_per_second_arr[input_per_second_arr.length - 1] * 100) / 100)
    const height_max = Math.max(...formated_input_per_second_arr) + 1


    for (let i = 1; i < time; i++) {
      time_format.push(i)
    }

    time_format.push(time)

    const data = ref({
      labels: time_format,
      datasets: [
        {
          label: '１秒ごとの正入力',
          data: formated_correct_per_second_arr,
          backgroundColor: ['rgba(134, 95, 255, 0.5)'],
        },
        {
          label: "１秒ごとの入力",
          data: formated_input_per_second_arr,
          backgroundColor: ["rgba(255, 255, 255, 0.61)"],
        }
      ],
    });

    const options = ref({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 1,
          max: time_format[time_format.length]
        },
        y: {
          min: 0,
          max: height_max
        }
      }
    })

    return {
      data, options,
    };
  },

  template: `
    <LineChart :chart-data="data" :options="options" />
  `,

});
