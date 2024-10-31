<script lang="ts">
import { defineComponent, ref, type PropType, type Ref } from 'vue'
import type { ranking_data_if } from '@/interface'
import { pie_chart, line_chart } from '@/components/play_info_charts'

export default defineComponent({
  name: 'play_result',
  components: {
    pie_chart,
    line_chart
  },
  props: {
    data: {
      type: Object as PropType<ranking_data_if>,
      required: true
    }
  },
  setup(props) {
    const pie_chart_data: Ref<number> = ref(props.data.correct_rate)
    const line_chart_data: Ref<ranking_data_if> = ref(props.data)

    function back_game(): void {
      console.log('I am backed')
    }
    return {
      pie_chart_data,
      line_chart_data,
      back_game,
    }
  }
})
</script>

<template>
  <div>
    <div id="graph_frame">
      <line_chart :chart_data="line_chart_data" id="line_chart" />
      <pie_chart :chart_data="pie_chart_data" id="pie_chart" />
    </div>
    <div id="result_container">
      <div id="char_detail">
        {{ $props.data.length }} / {{ $props.data.correct_count }} /
        {{ $props.data.length - $props.data.correct_count }}
      </div>
      <div id="time_display">{{ $props.data.time }} s</div>
      <div id="pun_count">{{ $props.data.pun_count }}</div>
    </div>

    <button @click="back_game" id="back_game" ref="back_game_button">
      <svg
        id="play_init_svg"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path
          d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"
        />
      </svg>
    </button>
  </div>
</template>
