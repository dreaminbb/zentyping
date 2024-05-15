import { defineComponent, ref, inject, type Ref } from 'vue';
import { Chart as ChartJS, registerables } from 'chart.js';
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
      labels: ['correct'],
      datasets: [
        {
          data: [correct_rate.value, 100 - correct_rate.value],
          backgroundColor: ['rgba(134, 95, 255, 0.5 )', 'transparent'],
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
    const labels = []

    for (let i = 0; i < time.value; i++) {
      labels.push(i.toString());
    }

    

    const data = ref({

      labels: ['correct'],
      datasets: [
        {
          data: [],
          backgroundColor: ['rgba(134, 95, 255, 0.5)', 'transparent'],
        },
      ],
    });

    const options = ref({
      responsive: true,
      maintainAspectRatio: false,
    })

    return {
      data, options,
    };
  },

  template: `
    <LineChart :chart-data="data" :options="options" />
  `,

});
