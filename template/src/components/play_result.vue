<script lang="ts">
import { defineComponent, ref, type PropType, type Ref } from 'vue'
import type { ranking_data_if } from '@/interface'
import { line_chart } from '@/components/play_info_charts'

export default defineComponent({
  name: 'play_result',
  components: {
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
    return {
      pie_chart_data,
      line_chart_data
    }
  }
})
</script>

<template>
  <div>
    <div id="play_result_main">
      <div id="play_detail_container">
        <div class="play_detail_container_elm">{{ $props.data.correct_per_second_num }}</div>
        <div class="play_detail_container_elm">{{ $props.data.input_per_second_num }}</div>
      </div>
      <div class="chart_container">
        <line_chart :chart_data="line_chart_data" id="line_chart" class="chart_elm" />
      </div>
      <div id="user_name_container">
        <div>{{ $props.data.name }}</div>
      </div>
      <div id="result_container">
        <div id="char_detail">
          {{ $props.data.length }} / {{ $props.data.correct_count }} /
          {{ $props.data.length - $props.data.correct_count }}
        </div>
        <div id="time_display">{{ $props.data.time }} s</div>
        <div id="pun_count">{{ $props.data.pun_count }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// I love coding but same time i hate it
// I feel so miserable  when i can't solve the problem
//  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// |       |                             |
// |   詳  |                             |
// |   細  |          グラフ              |
// |       |                             |
// |_______|_____________________________
// |       |                             |
// |  名前  |          詳細               |
// |_ _ _ _|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _|

#play_result_main {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 10% 1fr;
  grid-template-rows: 80% 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;

  #play_detail_container {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 10px;
    align-items: center;
    justify-content: center;

    .play_detail_container_elm {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .chart_container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 10px 5px 10px 0px;

    .chart_elm {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.58);
    }
  }
}

#user_name_container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  padding-left: 20px;
}

#result_container {
  padding-left: 20px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }

  #char_detail::after {
    content: '長さ / 正解 / 間違い';
  }

  #time_display::after {
    content: '時間';
  }

  #pun_count::after {
    content: '句読点';
  }

  #char_detail:focus,
  #char_detail:hover,
  #time_display:focus,
  #time_display:hover,
  #pun_count:focus #pun_count:hover {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }

  #char_detail:hover::after,
  #char_detail:focus::after,
  #time_display:hover::after,
  #time_display:focus::after,
  #pun_count:hover::after,
  #pun_count:focus:after {
    display: block;
  }
}
</style>
