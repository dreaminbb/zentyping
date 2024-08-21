import { defineComponent, ref, inject, type Ref } from 'vue';
import { Chart as ChartJS, registerables, LineController, Title } from 'chart.js';
import { LineChart, PieChart } from 'vue-chart-3';

ChartJS.register(...registerables);

export const pie_chart = defineComponent({
  components: {
    PieChart: PieChart,
  },
  setup() {
    const correct_rate = inject('correct_rate') as Ref<number>;
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
      options,
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
  setup() {
    const time = inject("time") as Ref<number>
    const time_format: Array<number> = [];
    const correct_every_second = inject("correct_every_second") as Ref<Array<number>>;
    const input_every_second = inject("input_every_second") as Ref<Array<number>>
    const formated_input_every_second: Array<number> = []
    const formated_corrrect_every_second: Array<number> = []


    for (let i = 1; i < correct_every_second.value.length / 10; i++) {
      formated_corrrect_every_second.push(Math.round(correct_every_second.value[i * 10] * 100) / 100)
      formated_input_every_second.push(Math.round(input_every_second.value[i * 10] * 100) / 100)
    }

    formated_corrrect_every_second.push(Math.round(correct_every_second.value[correct_every_second.value.length - 1] * 100) / 100)
    formated_input_every_second.push(Math.round(input_every_second.value[input_every_second.value.length - 1] * 100) / 100)
    const height_max = Math.max(...formated_input_every_second) + 1


    for (let i = 1; i < time.value; i++) {
      time_format.push(i)
    }

    time_format.push(time.value)

    const data = ref({
      labels: time_format,
      datasets: [
        {
          label: '１秒ごとの正入力',
          data: formated_corrrect_every_second,
          backgroundColor: ['rgba(134, 95, 255, 0.5)'],
        },
        {
          label: "１秒ごとの入力",
          data: formated_input_every_second,
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
