<script lang="ts" setup>
<<<<<<< HEAD
import { ref } from 'vue'
const ranking_table = ref<HTMLTableElement | null>(null)
const test_value = [
  {
    correct_count: 59,
    correct_per_second: [
      0.4, 0.0, 0.0, 0.7, 0.7, 0.6, 0.8, 0.3, 0.7, 0.9, 0.8, 0.4, 0.0, 0.2, 0.2, 0.2, 0.6, 0.6, 0.4,
      0.6
    ],
    correct_per_second_num: 3.2,
    correct_rate: 29.535098050455332,
    id: 21,
    incorrect_count: 41,
    input_per_second: [
      0.6, 0.9, 0.9, 0.5, 0.6, 0.5, 0.0, 0.8, 0.2, 0.4, 0.3, 0.0, 0.1, 0.1, 0.4, 0.1, 0.1, 0.2, 0.9,
      0.7
    ],
    input_per_second_num: 1.2,
    length: 87,
=======
import type { ranking_data_if } from '@/interface'
import { onBeforeMount, onMounted, ref } from 'vue'
import { ranking_data_manager } from '@/services/fetching_deta'
import { pie_chart, line_chart } from '@/components/play_info_charts'

// クリック => グラフのデータを関数で返す => グラフを表示する
const is_display_result_chart = ref<boolean>(false)
const rdm_ins = ref(new ranking_data_manager())
const line_chart_data = ref<ranking_data_if>({} as ranking_data_if)
const pie_chart_data = ref<number>(0)

<<<<<<< HEAD
onBeforeMount(async () => {
  const fetching_deta: any = await new rf().fetch_data({
>>>>>>> e5457f7 (ランキンングのデータをAPIから取得して表示するためのコード)
=======
onBeforeMount(async () => {})
onMounted(async () => {
  console.log('on mounted')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
  await rdm_ins.value.fetch_data({
>>>>>>> e1221aa (グラフを表示させることに成功)
    level: 'short',
    range_from: 0,
    range_to: 10
  })
  if (!rdm_ins.value.ranking_data_arr) {
    rdm_ins.value.ranking_data_arr = []
  }
  console.log('on before mount')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
})

function display_charts(index: number): ranking_data_if {
  is_display_result_chart.value = true
  //during execution of component update at <UserRanking onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref<
  // チャートを表示させたいけどエラーが出る
  if (rdm_ins.value.ranking_data_arr && rdm_ins.value.ranking_data_arr[index]) {
    line_chart_data.value = rdm_ins.value.ranking_data_arr[index]
    pie_chart_data.value = rdm_ins.value.ranking_data_arr[index].correct_rate
  } else {
    console.error('Invalid index or ranking data array is undefined')
  }
  console.log(rdm_ins.value.ranking_data_arr[index])
  return rdm_ins.value.ranking_data_arr[index]
}
</script>

<template>
  <div>
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

<<<<<<< HEAD
    <div id="chart_area" v-if="is_display_result_chart">
      <line_chart :chart_data="line_chart_data" />
      <pie_chart :chart_data="pie_chart_data" />
=======
    <div id="play_result_container" v-if="is_display_result_chart">
      <play_result :data="result_data" id="play_result_comp" />
>>>>>>> 5c9b666 (UI作成順調!!!!!消すボタン、イベントリスナーとかもつけたい)
    </div>
  </div>
</template>

<style lang="scss">
body {
  height: 700%;
  width: 100%;
  background: rgba(169, 147, 147, 0.5);
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
      border-bottom: 1px solid #ddd;
    }

    tr:nth-child(1) {
      background: rgba(169, 147, 147, 0.7);
      border-radius: 10%;
    }

    tr:nth-child(even) {
      background: #ddd;
    }

    #crown {
      position: relative;
      top: 30%;
    }
  }

<<<<<<< HEAD
  #chart_area {
    position: relative;
    background: rgba(169, 147, 147, 0.7);
    top: 20%;
    width: 100%;
    height: 70%;
=======
  #play_result_container {
    position: absolute;
    background: rgba(169, 147, 147, 0.7);
    top: 20%;
    right: 5%;
    width: 90%;
    height: 45%;

    #play_result_comp {
      position: relative;
      width: 90%;
      height: 95%;
      justify-self: center;
      align-self: center;
    }
>>>>>>> 5c9b666 (UI作成順調!!!!!消すボタン、イベントリスナーとかもつけたい)
  }
}
</style>
