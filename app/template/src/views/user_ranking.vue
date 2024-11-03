<script lang="ts" setup>
import type { ranking_data_if } from '@/interface'
import { onMounted, ref, type Ref } from 'vue'
import { ranking_data_manager } from '../services/fetching_data'
import play_result from '@/components/play_result.vue'

// クリック => グラフのデータを関数で返す => グラフを表示する
const is_display_result_chart: Ref<boolean> = ref<boolean>(false)
const rdm_ins = ref(new ranking_data_manager())
const result_data: Ref<ranking_data_if> = ref<ranking_data_if>({} as ranking_data_if)

// onBeforeMount(async () => {})
onMounted(async () => {
  console.log('on mounted')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
  await rdm_ins.value.fetch_data({
    level: 'short',
    range_from: 0,
    range_to: 40
  })
  if (!rdm_ins.value.ranking_data_arr) {
    rdm_ins.value.ranking_data_arr = []
  }
  console.log('on before mount')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
})

function show_off_display_result_chart_keydown(event: KeyboardEvent): void {
  // click event = outside of the result element
  if (KeyboardEvent && event instanceof KeyboardEvent) {
    if (event.key === 'Escape') {
      console.log('Escape key is pressed')
      is_display_result_chart.value = false
      removeEventListener('keydown', show_off_display_result_chart_keydown)
    }
  }
}

function show_off_display_result_chart(): void {
  is_display_result_chart.value = false
  removeEventListener('keydown', show_off_display_result_chart_keydown)
}
function display_charts(index: number): ranking_data_if | void {
  if (rdm_ins.value.ranking_data_arr && rdm_ins.value.ranking_data_arr[index]) {
    result_data.value = rdm_ins.value.ranking_data_arr[index]
  } else {
    console.error('Invalid index or ranking data array is undefined')
  }
  console.log(rdm_ins.value.ranking_data_arr[index])
  addEventListener('keydown', show_off_display_result_chart_keydown)
  console.log(is_display_result_chart.value)
  is_display_result_chart.value = true
  return rdm_ins.value.ranking_data_arr[index]
}
</script>

<template>
  <div id="ranking_main">
    <table id="ranking_table">
      <tr id="ranking_label_fm">
        <th v-for="key in 7" :key="key">
          {{
            [
              '順位',
              'ユーザー名',
              '正入力率',
              '一秒間の正入力',
              '一秒間の入力',
              'タイム',
              'タイムスタンプ'
            ][key - 1]
          }}
        </th>
      </tr>
      <tr
        v-for="(user, index) in rdm_ins.ranking_data_arr"
        :key="user.id"
        class="ranking_list"
        @click="() => display_charts(index)"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.correct_rate.toFixed(2) }}%</td>
        <td>{{ user.correct_per_second_num.toFixed(2) }}</td>
        <td>{{ user.input_per_second_num.toFixed(2) }}</td>
        <td>{{ user.time.toFixed(1) }}s</td>
        <td>{{ new Date(user.played_at).toLocaleString() }}</td>
      </tr>
    </table>

    <div id="play_result_container" v-if="is_display_result_chart">
      <play_result :data="result_data" id="play_result_comp" />
      <button @click="show_off_display_result_chart()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// theme color => tokyo night
@import '../assets/css/main.css';
#ranking_main {
  height: 700%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  #ranking_table {
    position: absolute;
    text-align: center;
    top: 20%;
    width: 80%;
    right: 10%;
    height: 100%; // ここを変えるとスクロールの長さが変わる(短いとできない)
    border-radius: 10%;
    border-collapse: collapse;
    color: white;
    color: rgb(48, 48, 48);

    tr {
      height: 50px;
    }

    tr:nth-child(1) {
      background-color: var(--background-color);
    }

    tr:nth-child(even) {
      background: transparent;
      color: rgba(255, 255, 255, 0.502);
    }
    tr:nth-child(odd) {
      background: var(--primary-color);
    }

    #crown {
      position: relative;
      top: 30%;
    }
  }

  #play_result_container {
    position: absolute;
    background: var(--sub-background-color);
    top: 20%;
    right: 5%;
    width: 90%;
    height: 45%;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 95% 5%;

    #play_result_comp {
      position: relative;
      width: 90%;
      height: 95%;
      justify-self: center;
      align-self: center;
    }

    button {
      position: relative;
      width: 40px;
      height: 40px;
      opacity: 0.8;
      justify-self: right;
      background: var(--primary-color);
      border-radius: 20px;
      color: var(--font-color);
      border: none;
      font-size: 1.5rem;
      cursor: pointer; // マウスが重なった時にカーソルが変わる
      transition: 0.3s;
      &:hover {
        box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
        background: var(--secondary-color);
        justify-self: right;
        width: 50px;
        height: 50px;
        transition: 0.3s ease;
      }
    }
  }
}
</style>
