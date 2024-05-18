import { defineComponent, ref, inject, type Ref } from 'vue';
import { Chart as ChartJS, registerables, LineController, Title } from 'chart.js';
import { LineChart, PieChart } from 'vue-chart-3';



ChartJS.register(...registerables);

const customTooltipPlugin = {
  id: 'customTooltipPlugin',
  beforeEvent(chart: any, args: any) {
    const event = args.event;
    const tooltip = chart.tooltip;

    if (event.type === 'mousemove') {
      const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
      if (elements.length) {
        const element = elements[0];
        if (element.elementType !== 'point') {
          tooltip.opacity = 0;
        } else {
          tooltip.opacity = 1;
        }
      }
    }
  }
};

ChartJS.register(customTooltipPlugin);

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
    const correct_pre_second = inject("correct_pre_second") as Ref<Array<number>>;
    const formated_corrrect_per_second: Array<number> = []


    for (let i = 1; i < correct_pre_second.value.length / 10; i++) {
      formated_corrrect_per_second.push(correct_pre_second.value[i * 10])
    }

    formated_corrrect_per_second.push(correct_pre_second.value[correct_pre_second.value.length - 1])
    const height_max = Math.max(...formated_corrrect_per_second) + 1


    for (let i = 1; i < time.value; i++) {
      time_format.push(i)
    }

    time_format.push(time.value)


    const data = ref({
      labels: time_format,
      datasets: [
        {
          label: '１秒ごとの正入力',
          data: formated_corrrect_per_second,
          backgroundColor: ['rgba(134, 95, 255, 0.5)'],
        },
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
